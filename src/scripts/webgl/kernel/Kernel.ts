import vertexShader from '@shader/quad.vs'
import { RawShaderMaterial } from '@webgl/core/ExtendedMaterials'
import { UnworkableCamera } from '@webgl/core/UnworkableCamera'
import { Particle } from '@webgl/Particle'
import * as THREE from 'three'

export abstract class Kernel {
  protected readonly scene: THREE.Scene
  protected readonly camera: UnworkableCamera

  private readonly rt1: THREE.WebGLRenderTarget
  private rt2?: THREE.WebGLRenderTarget
  private currentRT: THREE.WebGLRenderTarget
  private prevRT?: THREE.WebGLRenderTarget

  abstract render(...args: any): void

  constructor(
    protected readonly renderer: THREE.WebGLRenderer,
    private readonly useBackBuffer = false,
    options?: THREE.RenderTargetOptions,
  ) {
    this.scene = new THREE.Scene()
    this.camera = new UnworkableCamera()

    this.rt1 = this.createRenderTarget(options)
    this.currentRT = this.rt1

    if (useBackBuffer) {
      this.rt2 = this.createRenderTarget(options)
      this.prevRT = this.rt2
    }
  }

  private createRenderTarget(options?: THREE.RenderTargetOptions) {
    return new THREE.WebGLRenderTarget(Particle.AMOUNT_WIDTH, Particle.AMOUNT_HEIGHT, {
      format: THREE.RGFormat,
      type: THREE.HalfFloatType,
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
      ...options,
    })
  }

  protected createKernel(parameters: THREE.ShaderMaterialParameters) {
    parameters.vertexShader = vertexShader

    let fs = parameters.fragmentShader!
    for (const [key, value] of Object.entries(Particle.SMOOTHING_KERNEL_FACTOR)) {
      fs = fs.replace(key, value.toString())
    }
    fs = fs.replaceAll('PARTICLE_AMOUNT_WIDTH', Particle.AMOUNT_WIDTH.toString())
    fs = fs.replaceAll('PARTICLE_AMOUNT_HEIGHT', Particle.AMOUNT_HEIGHT.toString())
    parameters.fragmentShader = fs

    const geo = new THREE.PlaneGeometry()
    const mat = new RawShaderMaterial(parameters)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = 'kernel'
    this.scene.add(mesh)
  }

  get uniforms() {
    return (this.scene.getObjectByName('kernel') as THREE.Mesh<THREE.PlaneGeometry, RawShaderMaterial>).material.uniforms
  }

  protected get currentRenderTarget() {
    return this.currentRT
  }

  protected get prevRenderTarget() {
    return this.prevRT!
  }

  get texture() {
    return this.currentRenderTarget.texture
  }

  protected swap() {
    if (!this.useBackBuffer) return

    this.currentRT = this.currentRT === this.rt1 ? this.rt2! : this.rt1
    this.prevRT = this.currentRT === this.rt1 ? this.rt2! : this.rt1
  }
}
