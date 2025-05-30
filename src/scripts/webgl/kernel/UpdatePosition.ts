import fragmentShader from '@shader/updatePosition.fs'
import { Particle } from '@webgl/Particle'
import * as THREE from 'three'
import { Kernel } from './Kernel'

export class UpdatePosition extends Kernel {
  constructor(renderer: THREE.WebGLRenderer) {
    super(renderer, true, { format: THREE.RGBAFormat })

    this.createKernel({
      uniforms: {
        initPosMap: { value: Particle.genInitialPosition() },
        initFrame: { value: true },
        posMap: { value: null },
        velMap: { value: null },
        dt: { value: 0 },
        boundsSize: { value: Particle.boundsSize },
        collisionDamping: { value: Particle.COLLISION_DAMPING },
        particleSize: { value: Particle.DISPLAY_SIZE * (Particle.BOUNDS_WIDTH / window.innerWidth) },
        particlePixel: { value: Particle.PIXEL },
      },
      fragmentShader,
    })

    // draw initial position
    this.render(0)
    this.uniforms.initFrame.value = false
  }

  /** get current texture after swap() */
  get texture() {
    return this.prevRenderTarget.texture
  }

  /** get previous texture after swap() */
  get prevTexture() {
    return this.currentRenderTarget.texture
  }

  resize() {
    this.uniforms.boundsSize.value = Particle.boundsSize
  }

  render(dt: number) {
    this.uniforms.posMap.value = this.texture
    this.uniforms.dt.value = dt

    this.renderer.setRenderTarget(this.currentRenderTarget)
    this.renderer.render(this.scene, this.camera)

    this.swap()
  }
}
