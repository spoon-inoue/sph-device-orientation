import * as THREE from 'three'

type TextureOptions = {
  colorSpace: THREE.ColorSpace
  flipY: boolean
  wrapS: THREE.Wrapping
  wrapT: THREE.Wrapping
  magFilter: THREE.MagnificationTextureFilter
  minFilter: THREE.MinificationTextureFilter
}

export async function loadTexture(path: string, fileName: string, options?: Partial<TextureOptions>) {
  const loader = new THREE.TextureLoader()
  return loadTextureCore(path, fileName, loader, options)
}

export async function loadTextures(path: string, fileNames: string[], options?: Partial<TextureOptions>) {
  const loader = new THREE.TextureLoader()
  const textures: THREE.Texture[] = []
  await Promise.all(
    fileNames.map(async (fileName) => {
      textures.push(await loadTextureCore(path, fileName, loader, options))
    }),
  )
  return textures
}

async function loadTextureCore(path: string, fileName: string, loader: THREE.TextureLoader, options?: Partial<TextureOptions>) {
  const texture = await loader.loadAsync(path + fileName)
  texture.userData.name = fileName
  texture.userData.aspect = texture.source.data.width / texture.source.data.height
  // prettier-ignore
  {
    options?.colorSpace && (texture.colorSpace = options.colorSpace)
    options?.flipY      && (texture.flipY      = options.flipY)
    options?.wrapS      && (texture.wrapS      = options.wrapS)
    options?.wrapT      && (texture.wrapT      = options.wrapT)
    options?.magFilter  && (texture.magFilter  = options.magFilter)
    options?.minFilter  && (texture.minFilter  = options.minFilter)
  }
  return texture
}
