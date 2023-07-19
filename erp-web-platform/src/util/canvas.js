import { v4 as uuidv4 } from 'uuid'

/**
 * 图片合成
 */
export class ImgMerge {
  width = null
  height = null
  canvas = null
  canvasContext = null

  constructor({ width = 800, height = 800 }) {
    this.width = width
    this.height = height
    this.createCanvas()
  }

  createCanvas() {
    let canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    let canvasContext = canvas.getContext('2d')
    this.canvas = canvas
    this.canvasContext = canvasContext
  }

  draw(src) {
    const canvasContext = this.canvasContext
    const width = this.width
    const height = this.height
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = function() {
        canvasContext.drawImage(img, 0, 0, width, height)
        resolve(img)
      }
      img.src = src
    })
  }

  drawImg(images) {
    return new Promise((resolve, reject) => {
      if (!images) {
        reject()
        return
      }
      if (Array.isArray(images)) {
        /**
         * 处理图片url转base64
         */
        images
          .reduce(async (previous, current) => {
            const result = await previous
            return [...result, await imgurlToBase64(current)]
          }, Promise.resolve([]))
          .then(async (images) => {
            /**
             * 处理图片画入画布
             */
            images
              .reduce(async (previous, current) => {
                const result = await previous
                return [...result, await this.draw(current)]
              }, Promise.resolve([]))
              .then(async (images) => {
                resolve(images)
              })
          })
      } else {
        reject()
      }
    })
  }

  appendById(id) {
    const dom = document.getElementById(id)
    dom.appendChild(this.canvas)
  }

  outputImg() {
    return this.canvas.toDataURL('image/jpeg', 1)
  }
}

/**
 * 图片转base64
 */
export function imageToBase64(src, type = 'image/png') {
  var canvas = document.createElement('canvas')
  return new Promise((resolve) => {
    const img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous')
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
      var dataURL = canvas.toDataURL(type, 1)
      resolve(dataURL)
    }
    img.src = src
  })
}

/**
 * 异步创建图片元素
 */
export function createImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) reject('not image')
    const image = new Image()
    image.setAttribute('crossOrigin', 'Anonymous')
    image.onload = () => {
      resolve(image)
    }
    image.src = src
  })
}

/**
 * 图片 url 转base64
 * @param {*} outputFormat
 * @returns
 */
export function imgurlToBase64(url, outputFormat = 'image/png') {
  return new Promise((resolve) => {
    var canvas = document.createElement('CANVAS'),
      ctx = canvas.getContext('2d'),
      img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function() {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      var dataURL = canvas.toDataURL(outputFormat)
      resolve(dataURL)
      canvas = null
    }
    img.src = url
  })
}

// base64 转 file
export function base64ToFile(base64, fileType = 'jpeg') {
  const arr = base64.split(',')
  const bstr = window.atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${uuidv4()}.${fileType}`, {
    type: 'image/' + fileType
  })
}

/**
 * file 转 base64
 */
export function fileToBase64(file) {
  return new Promise((resolve) => {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function(e) {
      resolve(e.target.result)
    }
  })
}
