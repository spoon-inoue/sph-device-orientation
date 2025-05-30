import fragmentShader from '@shader/externalForce.fs'
import { Particle } from '@webgl/Particle'
import * as THREE from 'three'
import { Kernel } from './Kernel'

export class ExternalForce extends Kernel {
  static readonly MOUSE_POSITION: [number, number] = [0, 0]
  static readonly MOUSE_SIZE = 0.5 * window.devicePixelRatio

  constructor(renderer: THREE.WebGLRenderer) {
    super(renderer, false)

    this.createKernel({
      uniforms: {
        velMap: { value: null },
        particlePixel: { value: Particle.PIXEL },
        gravity: { value: Particle.GRAVITY },
        dt: { value: 0 },
        mousePosition: { value: ExternalForce.MOUSE_POSITION },
        mouseSize: { value: ExternalForce.MOUSE_SIZE },
      },
      fragmentShader,
    })

    this.addMouseEvents()
  }

  private addMouseEvents() {
    window.addEventListener('pointermove', (e) => {
      ExternalForce.MOUSE_POSITION[0] = ((e.clientX / window.innerWidth) * 2 - 1) * Particle.boundsSize[0] * 0.5
      ExternalForce.MOUSE_POSITION[1] = ((1 - e.clientY / window.innerHeight) * 2 - 1) * Particle.boundsSize[1] * 0.5

      this.uniforms.mousePosition.value = ExternalForce.MOUSE_POSITION
    })
  }

  render(dt: number) {
    this.uniforms.dt.value = dt

    this.renderer.setRenderTarget(this.currentRenderTarget)
    this.renderer.render(this.scene, this.camera)
  }
}
