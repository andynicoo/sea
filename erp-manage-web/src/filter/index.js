function formatMoney(val) {
  if (val) {
    const num = Number(val)
    return num.toLocaleString()
  } else {
    return val ?? ''
  }
}

const install = function(Vue) {
  Vue.filter('formatMoney', formatMoney)
}
export default {
  install
}
