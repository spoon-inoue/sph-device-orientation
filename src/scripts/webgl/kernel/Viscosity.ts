import fragmentShader from '@shader/viscosity.fs'
import { Particle } from '@webgl/Particle'
import * as THREE from 'three'
import { Kernel } from './Kernel'

export class Viscosity extends Kernel {
  constructor(renderer: THREE.WebGLRenderer) {
    super(renderer)

    this.createKernel({
      uniforms: {
        densityMap: { value: null },
        posMap: { value: null },
        velMap: { value: null },
        particlePixel: { value: Particle.PIXEL },
        smoothingRadius: { value: Particle.SMOOTHING_RADIUS },
        viscosityStrength: { value: Particle.VISCOSITY_STRENGTH },
        dt: { value: 0 },
      },
      fragmentShader,
    })
  }

  render(dt: number) {
    this.uniforms.dt.value = dt
    this.renderer.setRenderTarget(this.currentRenderTarget)
    this.renderer.render(this.scene, this.camera)
  }
}
