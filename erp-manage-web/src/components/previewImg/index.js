
import Vue from 'vue'
import Main from './main.vue'
const PreviewImgConstructor = Vue.extend(Main)
let instance = null
const PreviewImg = function(options = {}) {
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  options.value = true
  instance = new PreviewImgConstructor({
    data: options
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
}
export default {
  install(Vue) {
    Vue.prototype.$previewImg = PreviewImg
  }
}
