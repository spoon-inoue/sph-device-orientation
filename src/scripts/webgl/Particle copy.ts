import * as THREE from 'three'

export class Particle {
  static readonly AMOUNT_WIDTH = 70
  static readonly AMOUNT_HEIGHT = 30
  static readonly AMOUNT = this.AMOUNT_WIDTH * this.AMOUNT_HEIGHT
  static readonly PIXEL: [number, number] = [1 / this.AMOUNT_WIDTH, 1 / this.AMOUNT_HEIGHT]
  static readonly BOUNDS_WIDTH = 16
  static readonly DISPLAY_SIZE = 10
  static readonly SPAN = 0.15

  static readonly GRAVITY = [0, -9.8]
  static readonly SMOOTHING_RADIUS = 0.3
  static readonly TARGET_DENSITY = 50
  static readonly PRESSURE_MULTIPLIER = 150
  static readonly NEAR_PRESSURE_MULTIPLIER = 10
  static readonly VISCOSITY_STRENGTH = 6.5
  static readonly COLLISION_DAMPING = 0.5

  // prettier-ignore
  static readonly SMOOTHING_KERNEL_FACTOR = {
    C1_STD:         4 / (Math.PI * Math.pow(this.SMOOTHING_RADIUS, 8)),
    C2_STD_D2:    -24 / (Math.PI * Math.pow(this.SMOOTHING_RADIUS, 8)),
    C3_SPIKY:      10 / (Math.PI * Math.pow(this.SMOOTHING_RADIUS, 5)),
    C4_SPIKY_D1:  -30 / (Math.PI * Math.pow(this.SMOOTHING_RADIUS, 5)),
    C5_SPIKY2:      6 / (Math.PI * Math.pow(this.SMOOTHING_RADIUS, 4)),
    C6_SPIKY2_D1: -12 / (Math.PI * Math.pow(this.SMOOTHING_RADIUS, 4)),
  }

  static genInitialPosition() {
    const positions: number[] = []
    const offset = [-((this.AMOUNT_WIDTH - 1) * this.SPAN) * 0.5, -((this.AMOUNT_HEIGHT - 1) * this.SPAN) * 0.5]

    for (let ix = 0; ix < this.AMOUNT_WIDTH; ix++) {
      for (let iy = 0; iy < this.AMOUNT_HEIGHT; iy++) {
        positions.push(ix * this.SPAN + offset[0], iy * this.SPAN + offset[1], 0, 0)
      }
    }

    const dataTexture = new THREE.DataTexture(Float32Array.from(positions), this.AMOUNT_WIDTH, this.AMOUNT_HEIGHT, THREE.RGBAFormat, THREE.FloatType)
    dataTexture.needsUpdate = true
    return dataTexture
  }

  static get boundsSize(): [number, number] {
    const ratio = (window.innerWidth * window.devicePixelRatio) / 1920
    const invAsp = window.innerHeight / window.innerWidth
    return [this.BOUNDS_WIDTH * ratio, this.BOUNDS_WIDTH * ratio * invAsp]
  }
}
