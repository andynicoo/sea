import CategoryChoose from './categoryChoose.vue'

/**
 * 类目选择
 */
function install(Vue, options) {
  const CategoryChooseConstructor = Vue.extend(CategoryChoose)
  function showCategoryChoose(countryCode) {
    return new Promise((resolve, reject) => {
      const categoryChooseDom = new CategoryChooseConstructor({
        el: document.createElement('div'),
        data: { countryCode, options, resolve, reject }
      })
      document.body.appendChild(categoryChooseDom.$el)
    })
  }

  Vue.prototype.$categoryChoose = showCategoryChoose
}

export default { install }
