import fragmentShader from '@shader/density.fs'
import { Particle } from '@webgl/Particle'
import * as THREE from 'three'
import { Kernel } from './Kernel'

export class Density extends Kernel {
  constructor(renderer: THREE.WebGLRenderer) {
    super(renderer)

    this.createKernel({
      uniforms: {
        posMap: { value: null },
        particlePixel: { value: Particle.PIXEL },
        smoothingRadius: { value: Particle.SMOOTHING_RADIUS },
      },
      fragmentShader,
    })
  }

  render() {
    this.renderer.setRenderTarget(this.currentRenderTarget)
    this.renderer.render(this.scene, this.camera)
  }
}
