import Vue from "vue";

import ImagePreview from "./imagePreview.vue";

const ImagePreviewConstructor = Vue.extend(ImagePreview)

/**
 * 图片放大预览
 * @param {*} images 
 * @param {*} index 
 * @returns 
 */
function showImagePreview(images, index = 0) {
    const type = (source) => Object.prototype.toString.call(source)
    if (type(images) === "[object String]") {
        images = [images]
    }

    if (type(index) === "[object String]" && /^http(s):\/\//.test(index)) {
        index = images.indexOf(index)
    }
    const ImagePreviewDom = new ImagePreviewConstructor({
        el: document.createElement('div'),
        data: { images, index }
    })
    document.body.appendChild(ImagePreviewDom.$el);
    ImagePreviewDom.clear = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                document.body.removeChild(ImagePreviewDom.$el)
                resolve()
            }, 500)
        })
    }

    return ImagePreviewDom
}

function install(Vue) {
    Vue.prototype.$ImagePreview = showImagePreview
}

export default { install }