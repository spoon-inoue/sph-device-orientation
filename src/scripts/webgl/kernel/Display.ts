import * as THREE from 'three'
import { OrthographicCamera } from '@core/OrthographicCamera'
import { RawShaderMaterial } from '@core/ExtendedMaterials'
import vertexShader from '@shader/display.vs'
import fragmentShader from '@shader/display.fs'
import { Particle } from '@webgl/Particle'
import { ExternalForce } from './ExternalForce'

export class Display {
  private readonly scene: THREE.Scene
  private readonly camera: OrthographicCamera

  constructor(private readonly renderer: THREE.WebGLRenderer) {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#1e1e1e')

    this.camera = OrthographicCamera.createWindowAspect(renderer, 'width', Particle.boundsSize[0], 0.1, 10)
    this.camera.position.z = 1

    this.createParticle()
    this.createMouseCircle()
  }

  private createParticle() {
    const geo = new THREE.BufferGeometry()

    const positions: number[] = []
    const uvs: number[] = []

    for (let ix = 0; ix < Particle.AMOUNT_WIDTH; ix++) {
      for (let iy = 0; iy < Particle.AMOUNT_HEIGHT; iy++) {
        positions.push(0, 0, 0)
        uvs.push((ix + 0.1) / Particle.AMOUNT_WIDTH, (iy + 0.1) / Particle.AMOUNT_HEIGHT)
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    const mat = new RawShaderMaterial({
      uniforms: {
        posMap: { value: null },
        angleMap: { value: null },
        arrowMap: { value: null },
        size: { value: Particle.DISPLAY_SIZE },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    })
    const mesh = new THREE.Points(geo, mat)
    mesh.name = 'points'
    this.scene.add(mesh)
  }

  private createMouseCircle() {
    const geo = new THREE.CircleGeometry(ExternalForce.MOUSE_SIZE * 0.5, 50)
    const mat = new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: 0.2 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.name = 'mouse'
    this.scene.add(mesh)
  }

  get uniforms() {
    return (this.scene.getObjectByName('points') as THREE.Points<THREE.BufferGeometry, RawShaderMaterial>).material.uniforms
  }

  resize() {
    this.camera.updateFrustum(Particle.boundsSize[0], Particle.boundsSize[1])
  }

  render() {
    const mouseCircle = this.scene.getObjectByName('mouse') as THREE.Mesh
    mouseCircle.position.x = ExternalForce.MOUSE_POSITION[0]
    mouseCircle.position.y = ExternalForce.MOUSE_POSITION[1]

    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.camera)
  }
}
