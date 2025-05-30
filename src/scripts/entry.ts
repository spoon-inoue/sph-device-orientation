import { Canvas } from './webgl/Canvas'

const canvas = new Canvas(document.querySelector<HTMLCanvasElement>('canvas')!)

//

const valueContainer = document.querySelector<HTMLElement>('.devicemotion .val')!
const guiderDirection = document.querySelector<HTMLElement>('.guider .dir')!

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

const requestPermission = (DeviceOrientationEvent as any as DeviceOrientationEventiOS).requestPermission
const iOS = typeof requestPermission === 'function'

const requestDeviceMotionPermission = async (signal: AbortSignal) => {
  if (iOS) {
    const response = await requestPermission()
    valueContainer.innerText = response

    if (response === 'granted') {
      window.addEventListener(
        'deviceorientation',
        (e) => {
          if (e.alpha) {
            valueContainer.innerText = (-e.alpha).toFixed(0)

            canvas.updateGravityDirection(-e.alpha)
            guiderDirection.style.setProperty('rotate', `${e.alpha}deg`)
          }
        },
        { signal },
      )
    }
  }
}

let abortController: AbortController | null = null

const permitBtn = document.querySelector<HTMLButtonElement>('.permit')!
permitBtn.addEventListener('click', () => {
  abortController?.abort()
  abortController = new AbortController()

  permitBtn.innerText = 'reset'
  requestDeviceMotionPermission(abortController.signal)
})
