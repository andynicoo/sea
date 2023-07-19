import ImageChoose from './imageChoose.vue'

/**
 * 图片选择
 * @param {*} images
 * @returns
 */
function install(Vue, options) {
  const ImageChooseConstructor = Vue.extend(ImageChoose)

  function showImageChoose(images, limit = 1, originImages = []) {
    return new Promise((resolve, reject) => {
      const ImageChooseDom = new ImageChooseConstructor({
        el: document.createElement('div'),
        data: { images, limit, originImages, options, resolve, reject }
      })
      document.body.appendChild(ImageChooseDom.$el)
    })
  }

  Vue.prototype.$ImageChoose = showImageChoose
}

export default { install }
