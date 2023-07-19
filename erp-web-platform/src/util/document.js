/**
 * 关键词标红
 * @param {*} words 关键词组
 * @param {*} target 节点 class 属性
 */
export function checkIllegalWord(words, target) {
  target = document.getElementsByClassName(target)
  if (target && target.length) {
    target.forEach((ele) => {
      words.forEach(({ content }) => {
        ele.innerHTML = ele.innerHTML.replace(
          new RegExp(content, 'g'),
          `<span style="background-color: red;">${content}</span>`
        )
      })
    })
  }
}

/**
 * 获取图片
一个以英文句号（"."）开头的合法的不区分大小写的文件名扩展名。例如： .jpg，.pdf 或 .doc。
一个不带扩展名的 MIME 类型字符串。
字符串 audio/*， 表示“任何音频文件”。
字符串 video/*，表示 “任何视频文件”。
字符串 image/*，表示 “任何图片文件”。
允许的最大图片maxSize,默认要小于10，单位MB
 */
export function loadImage(
  { accept = 'image/*', multiple = false, maxSize = 10 } = {},
  callback
) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = accept
  input.multiple = multiple
  input.addEventListener('change', (input) => {
    let path = input.path ? input.path : [input.target]
    var pathArr = []
    for (let index = 0; index < path[0].files.length; index++) {
      const curSize = path[0].files[index].size / 1024 / 1024
      if (curSize > maxSize) {
        window._VV.errorAlert('请上传小于' + maxSize + 'MB的图片！')
      } else {
        pathArr.push(path[0].files[index])
      }
    }
    if (pathArr.length == 0) return
    callback(pathArr)
  })
  input.click()
}

/**
 * 排除非1:1的图片
 * @param {*} images
 */
export async function excludeNonProportionalImage(images) {
  images = images.map((src) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'Anonymous')
      img.onload = () => {
        if (img.width === img.height) {
          resolve(src)
        } else {
          resolve(false)
        }
      }
      img.src = src
    })
  })
  images = await Promise.all(images)
  return images.filter((image) => image)
}

/**
 * 获取[]图片的宽&高
 * @param {*} images
 */
export async function getImageAbbt(images) {
  images = images.map((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'Anonymous')
      img.onload = () => {
        const w = img.width
        const h = img.height
        resolve({ width: w, height: h })
      }
      img.onerror = () => {
        reject('图片加载失败...')
      }
      img.src = src
    })
  })
  images = await Promise.all(images)
  return images
}

/**
 * 广告关键词，返回htnl片段渲染广告
 * @param {*} adKey
 */
export async function getAdByKey(adKey) {
  return `<img width="100%" src=${adKey}/>`
}
