import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type {
  CameraConfig,
  Object3DKind,
  ResolvedObject3D,
  Sim3DTone,
  Vec3,
} from '../types/simulation3d'
import { colorOf, type Simulation3DPalette } from '../palette'

const BASE_DURATION = 750

interface T3 {
  x: number
  y: number
  z: number
}

interface Transform {
  pos: T3
  rot: T3
  scl: T3
  opacity: number
  visible: boolean
  emphasize: boolean
}

interface OrbitInfo {
  cx: number
  cz: number
  y: number
  radius: number
  fromAngle: number
  toAngle: number
}

interface AnimEntry {
  live: LiveObj
  from: Transform
  to: Transform
  orbit: OrbitInfo | null
}

interface TweenState {
  start: number
  duration: number
  entries: AnimEntry[]
  gone: LiveObj[]
  camera:
    | {
        fromPos: THREE.Vector3
        toPos: THREE.Vector3
        fromTgt: THREE.Vector3
        toTgt: THREE.Vector3
      }
    | null
  controlsLocked: boolean
  resolve: () => void
}

interface ArrowRef {
  helper: THREE.ArrowHelper
  from: Vec3
  to: Vec3
}

interface LiveObj {
  id: string
  kind: Object3DKind
  root: THREE.Object3D
  materials: THREE.Material[]
  spec: ResolvedObject3D
  tone: Sim3DTone
  opacity: number
  emphasize: boolean
  geometry: THREE.BufferGeometry | null
  lastKey: string
  arrow: ArrowRef | null
  spriteTexture: THREE.CanvasTexture | null
}

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

const toV3 = (p: Vec3): THREE.Vector3 => new THREE.Vector3(p[0], p[1], p[2])

const lerpT3 = (a: T3, b: T3, t: number): T3 => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  z: a.z + (b.z - a.z) * t,
})

function createGlyphTexture(text: string): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, size, size)
    // Auto-fit long labels (hex values, words) by shrinking the font.
    const len = Math.max(1, text.length)
    const fontSize = Math.max(52, Math.min(150, 460 / Math.pow(len, 0.72)))
    ctx.font = `600 ${fontSize}px "Segoe UI", system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(text, size / 2, size / 2 + fontSize * 0.07)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export class SimulationSceneManager {
  private container: HTMLElement
  private palette: Simulation3DPalette
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private grid: THREE.GridHelper
  private hemi: THREE.HemisphereLight

  private objects = new Map<string, LiveObj>()
  private textureCache = new Map<string, THREE.CanvasTexture>()
  private geometryCache = new Map<string, THREE.BufferGeometry>()

  private rafId = 0
  private disposed = false
  private anim: TweenState | null = null

  private homePos = new THREE.Vector3(9, 10.5, 14.5)
  private homeTarget = new THREE.Vector3(0, 0.4, 0)

  constructor(container: HTMLElement, palette: Simulation3DPalette, defaultCamera?: CameraConfig) {
    this.container = container
    this.palette = palette

    const w = Math.max(container.clientWidth || 8, 1)
    const h = Math.max(container.clientHeight || 8, 1)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(w, h, false)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.setAttribute('aria-label', '3D scene')
    container.appendChild(renderer.domElement)
    this.renderer = renderer

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(palette.background)

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 500)
    if (defaultCamera) {
      this.homePos = toV3(defaultCamera.position)
      this.homeTarget = toV3(defaultCamera.target)
      this.camera.position.copy(this.homePos)
    } else {
      this.camera.position.copy(this.homePos)
    }
    this.camera.lookAt(this.homeTarget)

    this.controls = new OrbitControls(this.camera, renderer.domElement)
    this.controls.target.copy(this.homeTarget)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 5
    this.controls.maxDistance = 55
    this.controls.maxPolarAngle = Math.PI * 0.52
    this.controls.update()

    this.grid = new THREE.GridHelper(72, 36, palette.gridLine, palette.gridCenter)
    const gridMat = this.grid.material as THREE.LineBasicMaterial
    gridMat.transparent = true
    gridMat.opacity = 0.5
    this.grid.position.y = -0.04
    this.scene.add(this.grid)

    this.hemi = new THREE.HemisphereLight(0xffffff, palette.background, 0.9)
    this.scene.add(this.hemi)

    const dir = new THREE.DirectionalLight(0xffffff, 1.6)
    dir.position.set(10, 18, 8)
    dir.castShadow = true
    dir.shadow.mapSize.set(1024, 1024)
    dir.shadow.camera.left = -20
    dir.shadow.camera.right = 20
    dir.shadow.camera.top = 20
    dir.shadow.camera.bottom = -20
    dir.shadow.camera.far = 60
    dir.shadow.bias = -0.0004
    this.scene.add(dir)

    const point = new THREE.PointLight(0xffffff, 0.35, 50)
    point.position.set(-9, 7, -7)
    this.scene.add(point)

    this.rafId = requestAnimationFrame(this.tick)
  }

  // ---- public API ---------------------------------------------------------

  /** Apply a full keyframe. `animate` eases transforms, otherwise jumps. */
  apply(
    objects: ResolvedObject3D[],
    opts?: { animate?: boolean; duration?: number; camera?: CameraConfig },
  ): Promise<void> {
    const camera = opts?.camera
    if (opts?.animate && !cameraAlwaysInstant(camera)) {
      return this.applyAnimated(objects, opts?.duration, camera)
    }
    return this.applyInstant(objects, camera)
  }

  resetCamera(): void {
    if (this.disposed) return
    this.camera.position.copy(this.homePos)
    this.controls.target.copy(this.homeTarget)
    this.controls.update()
  }

  setPalette(palette: Simulation3DPalette): void {
    if (this.disposed) return
    this.palette = palette
    this.scene.background = new THREE.Color(palette.background)
    this.hemi.groundColor.set(palette.background)
    this.rebuildGrid()
    for (const live of this.objects.values()) {
      if (live.kind === 'grid') this.rebuildVisual(live, live.spec)
      else this.syncMaterialColor(live)
    }
  }

  focusAt(point: Vec3): void {
    if (this.disposed) return
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target)
    const dist = dir.length()
    dir.normalize()
    this.controls.target.set(point[0], point[1], point[2])
    this.camera.position.copy(this.controls.target).addScaledVector(dir, dist)
    this.controls.update()
  }

  resize(width: number, height: number): void {
    if (this.disposed) return
    const w = Math.max(width, 1)
    const h = Math.max(height, 1)
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    cancelAnimationFrame(this.rafId)
    this.anim = null
    this.controls.dispose()

    for (const live of this.objects.values()) {
      this.scene.remove(live.root)
      this.disposeRoot(live)
    }
    this.objects.clear()

    for (const tex of this.textureCache.values()) tex.dispose()
    this.textureCache.clear()
    for (const g of this.geometryCache.values()) g.dispose()
    this.geometryCache.clear()

    this.scene.remove(this.grid)
    this.grid.geometry.dispose()
    ;(this.grid.material as THREE.Material).dispose()

    this.renderer.dispose()
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement)
    }
  }

  // ---- instant path -------------------------------------------------------

  private applyInstant(objects: ResolvedObject3D[], camera?: CameraConfig): Promise<void> {
    this.cancelTween()
    const ids = new Set(objects.map((o) => o.id))
    for (const [id, live] of Array.from(this.objects.entries())) {
      if (!ids.has(id)) {
        this.scene.remove(live.root)
        this.disposeRoot(live)
        this.objects.delete(id)
      }
    }
    for (const spec of objects) {
      const live = this.getOrCreateLive(spec)
      this.syncSpec(live, spec)
      this.writeTransform(live, spec, true)
      this.syncMaterialColor(live)
    }
    if (camera) {
      this.camera.position.set(...camera.position)
      this.controls.target.set(...camera.target)
      this.controls.update()
    }
    return Promise.resolve()
  }

  // ---- animated path ------------------------------------------------------

  private applyAnimated(
    objects: ResolvedObject3D[],
    duration: number | undefined,
    camera?: CameraConfig,
  ): Promise<void> {
    this.cancelTween()

    const ids = new Set(objects.map((o) => o.id))
    const gone: LiveObj[] = []
    for (const [id, live] of Array.from(this.objects.entries())) {
      if (!ids.has(id)) gone.push(live)
    }

    const entries: AnimEntry[] = []
    for (const spec of objects) {
      const existed = this.objects.has(spec.id)
      const live = this.getOrCreateLive(spec)
      const from = this.captureTransform(live)
      const to = this.targetTransform(spec)
      // New objects grow in from nothing; existing objects tween normally.
      const start = existed ? from : { ...to, scl: { x: 0.001, y: 0.001, z: 0.001 }, opacity: 0 }
      this.syncSpec(live, spec)
      entries.push({ live, from: start, to, orbit: this.orbitInfoFrom(spec) })
    }
    // Also sync material color before the tween begins (tone changes are instant).
    for (const entry of entries) this.syncMaterialColor(entry.live)
    for (const g of gone) this.syncMaterialColor(g)

    let cam: TweenState['camera'] = null
    let controlsLocked = false
    if (camera) {
      cam = {
        fromPos: this.camera.position.clone(),
        toPos: toV3(camera.position),
        fromTgt: this.controls.target.clone(),
        toTgt: toV3(camera.target),
      }
      controlsLocked = true
    }

    const dur = Math.max(1, duration ?? BASE_DURATION)
    return new Promise<void>((resolve) => {
      this.anim = {
        start: performance.now(),
        duration: dur,
        entries,
        gone,
        camera: cam,
        controlsLocked,
        resolve,
      }
    })
  }

  // ---- per-frame tween ----------------------------------------------------

  private tick = (): void => {
    if (this.disposed) return
    this.rafId = requestAnimationFrame(this.tick)
    if (document.hidden) return

    const anim = this.anim
    if (anim) {
      const now = performance.now()
      const t = Math.min(1, (now - anim.start) / anim.duration)
      const e = easeInOutCubic(t)
      for (const entry of anim.entries) this.applyEntry(entry, e, t >= 1)
      for (const g of anim.gone) {
        g.opacity = 1 - e
        this.writeLiveOpacity(g)
      }
      if (anim.camera) {
        this.camera.position.lerpVectors(anim.camera.fromPos, anim.camera.toPos, e)
        this.controls.target.lerpVectors(anim.camera.fromTgt, anim.camera.toTgt, e)
      }
      if (anim.controlsLocked) this.controls.enabled = false
      else this.controls.enabled = true
      this.controls.update()
      this.renderer.render(this.scene, this.camera)
      if (t >= 1) this.finishTween()
      return
    }

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  private applyEntry(entry: AnimEntry, e: number, done: boolean): void {
    const { live } = entry
    let pos: T3
    if (entry.orbit) {
      const o = entry.orbit
      const a = o.fromAngle + (o.toAngle - o.fromAngle) * e
      pos = { x: o.cx + o.radius * Math.cos(a), y: o.y, z: o.cz + o.radius * Math.sin(a) }
    } else {
      pos = lerpT3(entry.from.pos, entry.to.pos, e)
    }
    live.root.position.set(pos.x, pos.y, pos.z)

    const rot = lerpT3(entry.from.rot, entry.to.rot, e)
    live.root.rotation.set(rot.x, rot.y, rot.z)

    const scl = lerpT3(entry.from.scl, entry.to.scl, e)
    live.root.scale.set(scl.x, scl.y, scl.z)

    live.opacity = entry.from.opacity + (entry.to.opacity - entry.from.opacity) * e
    live.emphasize = done ? entry.to.emphasize : entry.from.emphasize
    if (done) live.root.visible = entry.to.visible
    else live.root.visible = entry.from.visible || entry.to.visible

    this.writeLiveOpacity(live)
    this.writeEmissive(live)
  }

  private finishTween(): void {
    const anim = this.anim
    if (!anim) return
    this.anim = null
    for (const g of anim.gone) {
      this.scene.remove(g.root)
      this.disposeRoot(g)
      this.objects.delete(g.id)
    }
    if (anim.camera) {
      this.controls.enabled = true
    }
    anim.resolve()
  }

  private cancelTween(): void {
    if (!this.anim) return
    const prev = this.anim
    this.anim = null
    if (prev.camera) this.controls.enabled = true
    prev.resolve()
  }

  // ---- object lifecycle ---------------------------------------------------

  private getOrCreateLive(spec: ResolvedObject3D): LiveObj {
    const existing = this.objects.get(spec.id)
    if (existing) return existing
    const { root, materials, geometry, arrow, spriteTexture } = this.buildRoot(spec)
    const tone = spec.tone ?? 'muted'
    const live: LiveObj = {
      id: spec.id,
      kind: spec.kind,
      root,
      materials,
      spec,
      tone,
      opacity: 1,
      emphasize: false,
      geometry,
      lastKey: this.paramKey(spec),
      arrow,
      spriteTexture,
    }
    this.objects.set(spec.id, live)
    // Create hidden and let the renderer write the final state.
    root.visible = false
    this.scene.add(root)
    return live
  }

  private buildRoot(spec: ResolvedObject3D): {
    root: THREE.Object3D
    materials: THREE.Material[]
    geometry: THREE.BufferGeometry | null
    arrow: ArrowRef | null
    spriteTexture: THREE.CanvasTexture | null
  } {
    const tone = spec.tone ?? 'muted'
    const color = colorOf(this.palette, tone, 'muted')
    const root = new THREE.Group()
    root.name = spec.id

    switch (spec.kind) {
      case 'box': {
        const s = spec.size ?? [1, 1, 1]
        const geom = this.geometry('box', `${s[0]}|${s[1]}|${s[2]}`, () => new THREE.BoxGeometry(s[0], s[1], s[2]))
        const mat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.04,
          roughness: 0.45,
          metalness: 0.15,
        })
        const mesh = new THREE.Mesh(geom, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        root.add(mesh)
        return { root, materials: [mat], geometry: geom, arrow: null, spriteTexture: null }
      }
      case 'sphere': {
        const r = (spec.size?.[0] ?? spec.radius ?? 0.5) || 0.5
        const segs = spec.segments ?? 32
        const geom = this.geometry('sphere', `${r}|${segs}`, () => new THREE.SphereGeometry(r, segs, segs))
        const mat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.1,
          roughness: 0.35,
          metalness: 0.2,
        })
        const mesh = new THREE.Mesh(geom, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        root.add(mesh)
        return { root, materials: [mat], geometry: geom, arrow: null, spriteTexture: null }
      }
      case 'glyph': {
        const label = spec.label ?? '?'
        let tex = this.textureCache.get(label)
        if (!tex) {
          tex = createGlyphTexture(label)
          this.textureCache.set(label, tex)
        }
        const mat = new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          depthWrite: false,
          color,
        })
        const sprite = new THREE.Sprite(mat)
        const s = spec.glyphScale ?? 1
        sprite.scale.set(s, s, 1)
        sprite.renderOrder = 5
        root.add(sprite)
        return { root, materials: [mat], geometry: null, arrow: null, spriteTexture: tex }
      }
      case 'ring': {
        const R = spec.ringRadius ?? 1
        const tube = spec.ringTube ?? 0.2
        const geom = this.geometry('ring', `${R}|${tube}`, () => new THREE.TorusGeometry(R, tube, 12, 72))
        const mat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.12,
          roughness: 0.55,
          metalness: 0.2,
        })
        const mesh = new THREE.Mesh(geom, mat)
        mesh.castShadow = true
        mesh.receiveShadow = true
        // Lay the torus in the XZ plane.
        mesh.rotation.set(Math.PI / 2, 0, 0)
        root.add(mesh)
        return { root, materials: [mat], geometry: geom, arrow: null, spriteTexture: null }
      }
      case 'arrow': {
        if (spec.from && spec.to) {
          const from = toV3(spec.from)
          const to = toV3(spec.to)
          const dir = new THREE.Vector3().subVectors(to, from)
          const len = Math.max(dir.length(), 0.001)
          dir.normalize()
          const head = Math.min(1.2, Math.max(0.45, len * 0.22))
          const helper = new THREE.ArrowHelper(dir, from, len, color, head, Math.max(0.18, head * 0.45))
          root.add(helper)
          const mats: THREE.Material[] = [
            helper.line.material as THREE.Material,
            helper.cone.material as THREE.Material,
          ]
          return { root, materials: mats, geometry: null, arrow: { helper, from: spec.from, to: spec.to }, spriteTexture: null }
        }
        return { root, materials: [], geometry: null, arrow: null, spriteTexture: null }
      }
      case 'arc': {
        const pts = spec.points ?? []
        const tube = spec.ringTube ?? 0.16
        const key = pts.map((p) => p.join(',')).join('|')
        const geom = this.geometry('arc', key, () => {
          const curve = new THREE.CatmullRomCurve3(
            pts.map((p) => toV3(p)),
            false,
            'catmullrom',
            0.5,
          )
          return new THREE.TubeGeometry(curve, Math.max(32, pts.length * 5), tube, 8, false)
        })
        const mat = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.3,
          roughness: 0.5,
          metalness: 0.1,
        })
        const mesh = new THREE.Mesh(geom, mat)
        mesh.castShadow = true
        root.add(mesh)
        return { root, materials: [mat], geometry: geom, arrow: null, spriteTexture: null }
      }
      case 'grid': {
        return this.buildGrid(spec)
      }
      default:
        return { root, materials: [], geometry: null, arrow: null, spriteTexture: null }
    }
  }

  private buildGrid(spec: ResolvedObject3D): {
    root: THREE.Object3D
    materials: THREE.Material[]
    geometry: THREE.BufferGeometry | null
    arrow: ArrowRef | null
    spriteTexture: THREE.CanvasTexture | null
  } {
    const g = spec.grid
    const root = new THREE.Group()
    root.name = spec.id
    const mats: THREE.Material[] = []
    const layerH = g?.height ?? 0.12
    const layers = g?.layers ?? []

    layers.forEach((layer, li) => {
      const rows = Math.max(1, layer.rows)
      const cols = Math.max(1, layer.cols)
      const cell = layer.cellSize ?? 1
      const gap = layer.gap ?? 0.14
      const cellGeom = this.geometry('cell', `${layerH}|${cell}`, () => new THREE.BoxGeometry(cell, layerH, cell))
      const stepX = cell + gap
      const stepZ = cell + gap
      const offX = ((cols - 1) * stepX) / 2
      const offZ = ((rows - 1) * stepZ) / 2
      const layerY = li * (layerH + 0.32)
      layer.cells.forEach((row, r) => {
        if (!row) return
        for (let ci = 0; ci < cols; ci++) {
          const c = row[ci]
          if (!c) continue
          const x = ci * stepX - offX
          const z = r * stepZ - offZ
          const cellTone = c.tone ?? spec.tone ?? 'muted'
          const cellColor = colorOf(this.palette, cellTone, 'muted')
          const tile = new THREE.Mesh(
            cellGeom,
            new THREE.MeshStandardMaterial({
              color: cellColor,
              emissive: cellColor,
              emissiveIntensity: c.emphasize ? 0.42 : 0.1,
              roughness: 0.42,
              metalness: 0.14,
              transparent: (c.opacity ?? 1) < 0.999,
              opacity: c.opacity ?? 1,
            }),
          )
          tile.position.set(x, layerY + (c.visible ?? true ? 0 : -2), z)
          tile.visible = c.visible ?? true
          tile.castShadow = true
          tile.receiveShadow = true
          root.add(tile)
          const tmat = tile.material as THREE.MeshStandardMaterial
          mats.push(tmat)

          if (c.label) {
            let tex = this.textureCache.get(c.label)
            if (!tex) {
              tex = createGlyphTexture(c.label)
              this.textureCache.set(c.label, tex)
            }
            const smat = new THREE.SpriteMaterial({
              map: tex,
              transparent: true,
              depthWrite: false,
              color: cellColor,
              opacity: c.opacity ?? 1,
            })
            const sprite = new THREE.Sprite(smat)
            const ls = layer.labelScale ?? 0.78
            const lx = (c.label.length > 1 ? 0.92 : 1.05) * cell * ls
            sprite.scale.set(lx, lx, 1)
            sprite.position.set(x, layerY + layerH + 0.09, z)
            sprite.renderOrder = 6
            root.add(sprite)
            mats.push(smat)
          }
        }
      })
    })
    return { root, materials: mats, geometry: null, arrow: null, spriteTexture: null }
  }

  private geometry(keyPrefix: string, key: string, factory: () => THREE.BufferGeometry): THREE.BufferGeometry {
    const k = `${keyPrefix}|${key}`
    let g = this.geometryCache.get(k)
    if (!g) {
      g = factory()
      this.geometryCache.set(k, g)
    }
    return g
  }

  /** Write a spec onto an existing live object (position, rotation, scale…). */
  private syncSpec(live: LiveObj, spec: ResolvedObject3D): void {
    live.spec = spec
    live.tone = spec.tone ?? live.tone ?? 'muted'

    // Rebuild geometry when the params change (grids rebuild on every cell change).
    const geomKey = this.paramKey(spec)
    if (spec.kind !== 'glyph' && spec.kind !== 'arrow' && live.lastKey !== geomKey) this.rebuildVisual(live, spec)
    // Rebuild arrow when endpoints change.
    if (live.arrow && spec.kind === 'arrow' && spec.from && spec.to) {
      const changed =
        live.arrow.from[0] !== spec.from[0] ||
        live.arrow.from[1] !== spec.from[1] ||
        live.arrow.from[2] !== spec.from[2] ||
        live.arrow.to[0] !== spec.to[0] ||
        live.arrow.to[1] !== spec.to[1] ||
        live.arrow.to[2] !== spec.to[2]
      if (changed) this.rebuildVisual(live, spec)
    }
  }

  private paramKey(spec: ResolvedObject3D): string {
    switch (spec.kind) {
      case 'box':
        return `box|${(spec.size ?? [1, 1, 1]).map((v) => String(v)).join('|')}`
      case 'sphere':
        return `sphere|${spec.size?.[0] ?? spec.radius ?? 0.5}|${spec.segments ?? 32}`
      case 'ring':
        return `ring|${spec.ringRadius ?? 1}|${spec.ringTube ?? 0.2}`
      case 'arc':
        return `arc|${(spec.points ?? []).map((p) => p.join(',')).join('|')}`
      case 'grid':
        return `grid|${JSON.stringify(spec.grid)}`
      default:
        return ''
    }
  }

  private rebuildVisual(live: LiveObj, spec: ResolvedObject3D): void {
    // Drop the old visual subtree but keep the wrapper group.
    const wrapper = live.root
    for (let i = wrapper.children.length - 1; i >= 0; i--) {
      const child = wrapper.children[i]
      wrapper.remove(child)
      this.disposeObject(child)
    }
    const next = this.buildRoot(spec)
    for (const child of next.root.children) wrapper.add(child)
    live.geometry = next.geometry
    live.arrow = next.arrow
    live.spriteTexture = next.spriteTexture
    live.materials = next.materials
    live.lastKey = this.paramKey(spec)
    live.spec = spec
  }

  private captureTransform(live: LiveObj): Transform {
    return {
      pos: {
        x: live.root.position.x,
        y: live.root.position.y,
        z: live.root.position.z,
      },
      rot: {
        x: live.root.rotation.x,
        y: live.root.rotation.y,
        z: live.root.rotation.z,
      },
      scl: {
        x: live.root.scale.x,
        y: live.root.scale.y,
        z: live.root.scale.z,
      },
      opacity: live.opacity,
      visible: live.root.visible,
      emphasize: live.emphasize,
    }
  }

  private targetTransform(spec: ResolvedObject3D): Transform {
    return {
      pos: { x: spec.position[0], y: spec.position[1], z: spec.position[2] },
      rot: {
        x: THREE.MathUtils.degToRad(spec.rotation?.[0] ?? 0),
        y: THREE.MathUtils.degToRad(spec.rotation?.[1] ?? 0),
        z: THREE.MathUtils.degToRad(spec.rotation?.[2] ?? 0),
      },
      scl: {
        x: spec.scale?.[0] ?? 1,
        y: spec.scale?.[1] ?? 1,
        z: spec.scale?.[2] ?? 1,
      },
      opacity: spec.opacity ?? 1,
      visible: spec.visible ?? true,
      emphasize: spec.emphasize ?? false,
    }
  }

  private writeTransform(live: LiveObj, spec: ResolvedObject3D, instant: boolean): void {
    const t = this.targetTransform(spec)
    // Orbit-enabled objects are always placed by their angle.
    const orbit = this.orbitInfoFrom(spec)
    if (orbit && instant) {
      const a = orbit.toAngle
      live.root.position.set(orbit.cx + orbit.radius * Math.cos(a), orbit.y, orbit.cz + orbit.radius * Math.sin(a))
    } else {
      live.root.position.set(t.pos.x, t.pos.y, t.pos.z)
    }
    live.root.rotation.set(t.rot.x, t.rot.y, t.rot.z)
    live.root.scale.set(t.scl.x, t.scl.y, t.scl.z)
    live.opacity = t.opacity
    live.emphasize = t.emphasize
    live.root.visible = t.visible
    this.writeLiveOpacity(live)
    this.writeEmissive(live)
  }

  private orbitInfoFrom(spec: ResolvedObject3D): OrbitInfo | null {
    const o = spec.orbit
    if (!o) return null
    return {
      cx: o.center[0],
      cz: o.center[2],
      y: o.y,
      radius: o.radius,
      fromAngle: o.fromAngle,
      toAngle: o.toAngle,
    }
  }

  private syncMaterialColor(live: LiveObj): void {
    if (live.kind === 'grid') return
    const color = colorOf(this.palette, live.tone, 'muted')
    for (const mat of live.materials) {
      if (!mat) continue
      if (mat instanceof THREE.SpriteMaterial || mat instanceof THREE.MeshStandardMaterial) {
        mat.color.set(color)
      }
    }
    if (live.arrow) {
      live.arrow.helper.setColor(new THREE.Color(color))
    }
  }

  private writeLiveOpacity(live: LiveObj): void {
    const op = Math.max(0, Math.min(1, live.opacity))
    const transparent = op < 0.999
    for (const mat of live.materials) {
      if (!mat) continue
      mat.transparent = transparent
      mat.opacity = op
    }
  }

  private writeEmissive(live: LiveObj): void {
    if (live.kind === 'grid') return
    for (const mat of live.materials) {
      if (mat instanceof THREE.MeshStandardMaterial) {
        mat.emissive.set(colorOf(this.palette, live.tone, 'muted'))
        mat.emissiveIntensity = live.emphasize ? 0.55 : 0.05
      }
    }
  }

  private rebuildGrid(): void {
    this.scene.remove(this.grid)
    this.grid.geometry.dispose()
    ;(this.grid.material as THREE.Material).dispose()
    this.grid = new THREE.GridHelper(72, 36, this.palette.gridLine, this.palette.gridCenter)
    const gm = this.grid.material as THREE.LineBasicMaterial
    gm.transparent = true
    gm.opacity = 0.5
    this.grid.position.y = -0.04
    this.scene.add(this.grid)
  }

  private disposeRoot(live: LiveObj): void {
    this.disposeObject(live.root)
    if (live.spriteTexture) {
      // Shared texture — only disposed via the texture cache on dispose().
      live.spriteTexture = null
    }
  }

  private disposeObject(obj: THREE.Object3D): void {
    obj.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.geometry) mesh.geometry.dispose()
      const material = (mesh as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(material)) material.forEach((m) => m.dispose())
      else if (material) material.dispose()
    })
  }
}

function cameraAlwaysInstant(camera?: CameraConfig): boolean {
  return !!camera?.instant
}