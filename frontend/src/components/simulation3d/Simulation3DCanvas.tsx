import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type {
  CameraConfig,
  ResolvedObject3D,
  Simulation3DCanvasHandle,
} from './types/simulation3d'
import { readCurrentPalette } from './palette'
import { SimulationSceneManager } from './three/SceneManager'

interface Simulation3DCanvasProps {
  defaultCamera?: CameraConfig
  theme: 'dark' | 'light'
  onReady?: () => void
  onFail?: () => void
}

/**
 * React shell around the imperative three.js SceneManager. Owns the WebGL
 * canvas lifecycle: mount, resize, theme reloads and full cleanup.
 */
export const Simulation3DCanvas = forwardRef<Simulation3DCanvasHandle, Simulation3DCanvasProps>(
  function Simulation3DCanvas({ defaultCamera, theme, onReady, onFail }, ref) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const managerRef = useRef<SimulationSceneManager | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        apply(
          objects: ResolvedObject3D[],
          opts?: { animate?: boolean; duration?: number; camera?: CameraConfig },
        ) {
          const m = managerRef.current
          if (!m) return Promise.resolve()
          return m.apply(objects, opts)
        },
        resetCamera() {
          managerRef.current?.resetCamera()
        },
        focusAt(point) {
          managerRef.current?.focusAt(point)
        },
        toggleFullscreen() {
          const container = containerRef.current
          if (!container) return
          if (document.fullscreenElement) {
            void document.exitFullscreen()
          } else {
            void container.requestFullscreen?.()
          }
        },
      }),
      [],
    )

    useEffect(() => {
      const container = containerRef.current
      if (!container) return
      let cancelled = false
      let manager: SimulationSceneManager | null = null
      try {
        manager = new SimulationSceneManager(container, readCurrentPalette(), defaultCamera)
        managerRef.current = manager
        onReady?.()
      } catch {
        onFail?.()
        return
      }

      const ro = new ResizeObserver(() => {
        if (!cancelled && managerRef.current) {
          managerRef.current.resize(container.clientWidth, container.clientHeight)
        }
      })
      ro.observe(container)

      return () => {
        cancelled = true
        ro.disconnect()
        manager?.dispose()
        managerRef.current = null
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultCamera])

    useEffect(() => {
      managerRef.current?.setPalette(readCurrentPalette())
    }, [theme])

    return <div ref={containerRef} className="sim3d-canvas" role="img" aria-label="3D scene" />
  },
)