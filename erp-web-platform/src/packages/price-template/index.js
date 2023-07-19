import PriceTemplateTabs from './PriceTemplateTabs.vue'

/**
 * 定价模版
 */
function install(Vue, options) {
  const PriceTemplateTabsConstructor = Vue.extend(PriceTemplateTabs)
  function showPriceTemplateTabs(products) {
    return new Promise((resolve, reject) => {
      const priceTemplateTabsDom = new PriceTemplateTabsConstructor({
        el: document.createElement('div'),
        data: { products, options, resolve, reject }
      })
      document.body.appendChild(priceTemplateTabsDom.$el)
    })
  }

  Vue.prototype.$priceTemplate = showPriceTemplateTabs
}

export default { install }
