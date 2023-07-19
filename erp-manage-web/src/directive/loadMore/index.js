function loadMore(el, binding) {
  const ele = el.querySelector(`.${binding.arg}` || el)
  let p = 0
  let t = 0
  let down = true
  // eslint-disable-next-line no-unused-vars
  let timeId = null
  ele && ele.addEventListener('scroll', function() {
    // 判断是否向下滚动
    p = this.scrollTop
    if (t < p) {
      down = true
    } else {
      down = false
    }
    t = p
    // 判断是否到底
    const sign = 10
    const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
    if (scrollDistance <= sign && down) {
      if (timeId) {
        clearTimeout(timeId)
        timeId = null
      }
      timeId = setTimeout(() => {
        binding.value()
      }, 300)
    }
  })
}

const install = function(Vue) {
  Vue.directive('loadMore', { bind: loadMore })
}

export default {
  install
}
