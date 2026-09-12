import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type {
  Simulation3DCanvasHandle,
  Simulation3DStep,
} from '../types/simulation3d'

export type PlaybackSpeed = 0.25 | 0.5 | 1 | 2 | 4

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.25, 0.5, 1, 2, 4]

const BASE_DURATION = 750
const SPEED_FACTOR: Record<PlaybackSpeed, number> = {
  0.25: 2.6,
  0.5: 1.7,
  1: 1,
  2: 0.58,
  4: 0.34,
}
const HOLD_MS: Record<PlaybackSpeed, number> = {
  0.25: 520,
  0.5: 300,
  1: 150,
  2: 75,
  4: 32,
}

const durFor = (st: Simulation3DStep, speed: PlaybackSpeed): number =>
  Math.round((st.duration ?? BASE_DURATION) * SPEED_FACTOR[speed])

function reduceMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const delay = (ms: number): Promise<void> => new Promise((r) => window.setTimeout(r, ms))

export interface AnimationPlayback {
  step: number
  playing: boolean
  speed: PlaybackSpeed
  ready: boolean
  failed: boolean
  atStart: boolean
  atEnd: boolean
  setReady: () => void
  setFailed: () => void
  setSpeed: (s: PlaybackSpeed) => void
  goto: (i: number) => void
  next: () => void
  prev: () => void
  restart: () => void
  togglePlay: () => void
  resetCamera: () => void
}

function needsStep(st: Simulation3DStep): boolean {
  return !st.camera?.instant && (st.duration ?? 0) > 0
}

/**
 * Step-timeline playback for the 3D engine.
 *
 * - Forward playback animates each transition through the canvas handle.
 * - Jumping (timeline click / prev / restart) applies the keyframe instantly.
 * - Pausing finishes the in-flight transition, then stops on a consistent frame.
 */
export function useAnimationPlayback(
  steps: Simulation3DStep[],
  canvasRef: RefObject<Simulation3DCanvasHandle>,
): AnimationPlayback {
  const [step, setStepState] = useState(0)
  const [playing, setPlayingState] = useState(false)
  const [speed, setSpeedState] = useState<PlaybackSpeed>(1)
  const [ready, setReadyState] = useState(false)
  const [failed, setFailedState] = useState(false)

  const stepRef = useRef(0)
  const playingRef = useRef(false)
  const speedRef = useRef<PlaybackSpeed>(1)
  const readyRef = useRef(false)
  const reducedRef = useRef(false)
  const stepsRef = useRef(steps)
  const lastStepsRef = useRef<string | null>(null)

  stepsRef.current = steps
  playingRef.current = playing
  speedRef.current = speed
  readyRef.current = ready

  useEffect(() => {
    reducedRef.current = reduceMotion()
  }, [])

  const setStep = useCallback((n: number) => {
    stepRef.current = n
    setStepState(n)
  }, [])

  const setPlaying = useCallback((v: boolean) => {
    playingRef.current = v
    setPlayingState(v)
  }, [])

  // Reset when the algorithm sequence changes identity (new algorithm or
  // changed inputs) and clamp when the number of steps shrinks.
  useEffect(() => {
    const signature = steps.length > 0 ? steps[0].id : ''
    const prev = lastStepsRef.current
    lastStepsRef.current = signature
    if (prev !== null && prev !== signature) {
      setPlaying(false)
      setStep(0)
    } else if (stepRef.current >= steps.length && steps.length > 0) {
      setStep(Math.max(0, steps.length - 1))
    }
  }, [steps, setPlaying, setStep])

  const apply = useCallback(
    async (index: number, animate: boolean) => {
      const st = stepsRef.current[index]
      const canvas = canvasRef.current
      if (!st || !canvas) return
      if (animate && needsStep(st) && !reducedRef.current) {
        await canvas.apply(st.objects, { animate: true, duration: durFor(st, speedRef.current), camera: st.camera })
      } else {
        canvas.apply(st.objects, { animate: false, camera: st.camera })
      }
    },
    [canvasRef],
  )

  // Apply the current keyframe once the canvas is mounted and whenever steps
  const [, forceApply] = useState(0)
  useEffect(() => {
    if (!readyRef.current || stepsRef.current.length === 0) return
    void apply(Math.min(stepRef.current, stepsRef.current.length - 1), false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, steps, apply, forceApply])

  const goto = useCallback(
    (i: number) => {
      const c = Math.min(Math.max(i, 0), stepsRef.current.length - 1)
      setPlaying(false)
      setStep(c)
      void apply(c, false)
    },
    [apply, setPlaying, setStep],
  )

  const advanceOne = useCallback(
    async (from: number) => {
      const to = from + 1
      const st = stepsRef.current[to]
      const canvas = canvasRef.current
      if (!st || !canvas) return
      if (needsStep(st) && !reducedRef.current) {
        await canvas.apply(st.objects, { animate: true, duration: durFor(st, speedRef.current), camera: st.camera })
      } else {
        canvas.apply(st.objects, { animate: false, camera: st.camera })
      }
      if (playingRef.current) return
      setStep(to)
    },
    [setStep],
  )

  const next = useCallback(() => {
    if (stepRef.current >= stepsRef.current.length - 1) return
    setPlaying(false)
    void advanceOne(stepRef.current)
  }, [advanceOne, setPlaying])

  const prev = useCallback(() => {
    goto(stepRef.current - 1)
  }, [goto])

  const restart = useCallback(() => {
    setPlaying(false)
    setStep(0)
    void apply(0, false)
  }, [apply, setPlaying, setStep])

  const resetCamera = useCallback(() => {
    canvasRef.current?.resetCamera()
  }, [canvasRef])

  const togglePlay = useCallback(() => {
    if (playingRef.current) {
      setPlaying(false)
      return
    }
    if (stepRef.current >= stepsRef.current.length - 1) {
      setStep(0)
      void apply(0, false)
    }
    setPlaying(true)
  }, [apply, setPlaying, setStep])

  const setReady = useCallback(() => {
    setReadyState(true)
    forceApply((n) => n + 1)
  }, [])

  const setFailed = useCallback(() => setFailedState(true), [])

  const setSpeed = useCallback((s: PlaybackSpeed) => setSpeedState(s), [])

  // Autoplay loop. Runs while `playing` is true; guarded by refs so that
  // pausing stops after the current transition completes.
  useEffect(() => {
    if (!playing) return
    const loop = async () => {
      let idx = stepRef.current
      while (idx < stepsRef.current.length - 1 && playingRef.current) {
        const to = idx + 1
        const st = stepsRef.current[to]
        const canvas = canvasRef.current
        if (!st || !canvas) break
        if (needsStep(st) && !reducedRef.current) {
          await canvas.apply(st.objects, { animate: true, duration: durFor(st, speedRef.current), camera: st.camera })
        } else {
          canvas.apply(st.objects, { animate: false, camera: st.camera })
        }
        if (!playingRef.current) {
          setStep(to)
          break
        }
        setStep(to)
        await delay(HOLD_MS[speedRef.current])
        if (!playingRef.current) break
      }
      if (playingRef.current) setPlaying(false)
    }
    void loop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  const count = steps.length
  return {
    step: Math.min(step, Math.max(0, count - 1)),
    playing,
    speed,
    ready,
    failed,
    atStart: step === 0,
    atEnd: step >= Math.max(0, count - 1),
    setReady,
    setFailed,
    setSpeed,
    goto,
    next,
    prev,
    restart,
    togglePlay,
    resetCamera,
  }
}