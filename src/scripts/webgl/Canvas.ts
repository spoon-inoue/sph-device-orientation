import { Base } from '@core/Base'
import { loadTexture } from './core/loader'
import { pane } from './Gui'
import { Density } from './kernel/Density'
import { Display } from './kernel/Display'
import { ExternalForce } from './kernel/ExternalForce'
import { Pressure } from './kernel/Pressure'
import { UpdateAngle } from './kernel/UpdateAngle'
import { UpdatePosition } from './kernel/UpdatePosition'
import { Viscosity } from './kernel/Viscosity'
import { Particle } from './Particle'

export class Canvas extends Base {
  private readonly externalForce: ExternalForce
  private readonly density: Density
  private readonly pressure: Pressure
  private readonly viscosity: Viscosity
  private readonly updatePosition: UpdatePosition
  private readonly updateAngle: UpdateAngle
  private readonly display: Display

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    this.externalForce = new ExternalForce(this.renderer)
    this.density = new Density(this.renderer)
    this.pressure = new Pressure(this.renderer)
    this.viscosity = new Viscosity(this.renderer)
    this.updatePosition = new UpdatePosition(this.renderer)
    this.updateAngle = new UpdateAngle(this.renderer)
    this.display = new Display(this.renderer)

    loadTexture(import.meta.env.BASE_URL, 'arrow.png').then((texture) => {
      this.display.uniforms.arrowMap.value = texture

      window.addEventListener('resize', this.resize.bind(this))
      this.renderer.setAnimationLoop(this.render.bind(this))
    })

    this.setGUI()
    pane.expanded = false
  }

  protected resize() {
    super.resize()
    this.updatePosition.resize()
    this.display.resize()
  }

  render() {
    pane.updateFps()
    const dt = this.clock.getDelta()

    this.externalForce.uniforms.velMap.value = this.updatePosition.texture
    this.externalForce.render(dt)

    this.density.uniforms.posMap.value = this.updatePosition.texture
    this.density.render()

    this.pressure.uniforms.densityMap.value = this.density.texture
    this.pressure.uniforms.posMap.value = this.updatePosition.texture
    this.pressure.uniforms.velMap.value = this.externalForce.texture
    this.pressure.render(dt)

    this.viscosity.uniforms.densityMap.value = this.density.texture
    this.viscosity.uniforms.posMap.value = this.updatePosition.texture
    this.viscosity.uniforms.velMap.value = this.pressure.texture
    this.viscosity.render(dt)

    this.updatePosition.uniforms.velMap.value = this.viscosity.texture
    this.updatePosition.render(dt)

    this.updateAngle.uniforms.posMap.value = this.updatePosition.texture
    this.updateAngle.uniforms.prevPosMap.value = this.updatePosition.prevTexture
    this.updateAngle.render()

    this.display.uniforms.posMap.value = this.updatePosition.texture
    this.display.uniforms.angleMap.value = this.updateAngle.texture
    this.display.render()
  }

  updateGravityDirection(deg: number) {
    const rad = deg * (Math.PI / 180)
    const s = Math.sin(rad)
    const c = Math.cos(rad)

    const x = c * Particle.GRAVITY[0] - s * Particle.GRAVITY[1]
    const y = s * Particle.GRAVITY[0] + c * Particle.GRAVITY[1]

    this.externalForce.uniforms.gravity.value = [x, y]
  }

  private setGUI() {
    pane.addFpsBlade()

    const params = {
      particles: `${Particle.AMOUNT} (x:${Particle.AMOUNT_WIDTH}, y:${Particle.AMOUNT_HEIGHT})`,
      gravityDirection: { x: 0, y: 1 },
      smoothingRadius: Particle.SMOOTHING_RADIUS,
      targetDensity: Particle.TARGET_DENSITY,
      pressureMultiplier: Particle.PRESSURE_MULTIPLIER,
      nearPressureMultiplier: Particle.NEAR_PRESSURE_MULTIPLIER,
      viscosityStrength: Particle.VISCOSITY_STRENGTH,
      collisionDamping: Particle.COLLISION_DAMPING,
    }

    pane.addBinding(params, 'particles', { disabled: true })

    // pane.addBinding(params, 'gravityDirection', { min: -1, max: 1, step: 0.1 }).on('change', (e) => {
    //   const len = Math.hypot(e.value.x, e.value.y)
    //   if (1e-5 < len) {
    //     const dir = [e.value.x / len, e.value.y / len]
    //     this.externalForce.uniforms.gravity.value = [dir[0] * 9.8, -dir[1] * 9.8]
    //   } else {
    //     this.externalForce.uniforms.gravity.value = [0, 0]
    //   }
    // })

    pane.addBinding(params, 'targetDensity', { min: 0, max: 20, step: 1 }).on('change', (e) => {
      this.pressure.uniforms.targetDensity.value = e.value
    })

    pane.addBinding(params, 'pressureMultiplier', { min: 0, max: 500, step: 5 }).on('change', (e) => {
      this.pressure.uniforms.pressureMultiplier.value = e.value
    })

    pane.addBinding(params, 'nearPressureMultiplier', { min: 0, max: 100, step: 5 }).on('change', (e) => {
      this.pressure.uniforms.nearPressureMultiplier.value = e.value
    })

    pane.addBinding(params, 'viscosityStrength', { min: 0, max: 10, step: 0.5 }).on('change', (e) => {
      this.viscosity.uniforms.viscosityStrength.value = e.value
    })

    pane.addBinding(params, 'collisionDamping', { min: 0, max: 0.95, step: 0.05 }).on('change', (e) => {
      this.updatePosition.uniforms.collisionDamping.value = e.value
    })
  }
}
