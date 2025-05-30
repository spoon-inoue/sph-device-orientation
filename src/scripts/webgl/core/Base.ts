import * as THREE from 'three'

export abstract class Base {
  protected readonly renderer: THREE.WebGLRenderer
  protected readonly clock: THREE.Clock
  private readonly abortController: AbortController

  constructor(canvas: HTMLCanvasElement, rendererParams?: THREE.WebGLRendererParameters) {
    this.renderer = this.createRenderer(canvas, rendererParams)
    this.clock = new THREE.Clock()

    this.abortController = new AbortController()
    document.addEventListener('visibilitychange', this.handleVisibilitychange.bind(this), {
      signal: this.abortController.signal,
    })
  }

  private createRenderer(canvas: HTMLCanvasElement, rendererParams?: THREE.WebGLRendererParameters) {
    const renderer = new THREE.WebGLRenderer({ ...rendererParams, canvas })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    return renderer
  }

  protected enableShadowMap() {
    this.renderer.shadowMap.enabled = true
  }

  protected resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private handleVisibilitychange() {
    if (document.visibilityState === 'visible') {
      this.clock.start()
    } else {
      this.clock.stop()
    }
  }

  protected get canvas() {
    return this.renderer.domElement
  }

  protected get size(): [number, number] {
    return [this.canvas.width, this.canvas.height]
  }

  protected get resolution(): [number, number] {
    const [width, height] = this.size
    const dpr = this.renderer.getPixelRatio()
    return [width * dpr, height * dpr]
  }

  dispose() {
    this.abortController.abort()
    this.renderer.setAnimationLoop(null)
    this.renderer.dispose()
  }
}
