import fragmentShader from '@shader/updateAngle.fs'
import { Particle } from '@webgl/Particle'
import * as THREE from 'three'
import { Kernel } from './Kernel'

export class UpdateAngle extends Kernel {
  constructor(renderer: THREE.WebGLRenderer) {
    super(renderer, true, { format: THREE.RedFormat })

    this.createKernel({
      uniforms: {
        posMap: { value: null },
        prevPosMap: { value: null },
        prevAngleMap: { value: null },
        particlePixel: { value: Particle.PIXEL },
      },
      fragmentShader,
    })
  }

  get texture() {
    return this.prevRenderTarget.texture
  }

  resize() {
    this.uniforms.boundsSize.value = Particle.boundsSize
  }

  render() {
    this.uniforms.prevAngleMap.value = this.texture

    this.renderer.setRenderTarget(this.currentRenderTarget)
    this.renderer.render(this.scene, this.camera)

    this.swap()
  }
}
