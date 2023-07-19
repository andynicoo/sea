import { getByteLen } from '@/util'
function _render(el, binding, vnode, oldVnode) {
  const inputValue = vnode.data.model.value
  let length = 0
  let { max, min, required, right, calcByteLen } = binding.value
  if (inputValue) {
    length = inputValue.length
    if (calcByteLen) {
      length = getByteLen(inputValue)
    }
  }
  // 传入right参数可以适当调整提示符位置
  if (!right) right = '0px'
  if (!max) max = 0
  if (!min) min = 0
  if (!max) return
  const span = document.createElement('span')
  // 这里异步处理解决火狐浏览器定位出现错误的情况
  setTimeout(() => {
    span.innerText = `${length}/${max}`
    span.style.position = 'absolute'
    span.style.bottom = '-22px'
    span.style.lineHeight = '12px'
    span.style.fontSize = '12px'
    span.style.right = right
    if (inputValue !== undefined && required) {
      if (min >= length) span.style.color = '#f5222d'
      if (length > max) span.style.color = '#f5222d'
    }
    var parent = el.parentNode
    if (el.nextSibling) parent.removeChild(el.nextSibling)
    parent.insertBefore(span, el.nextSibling)
  })
}

// calcByteLen为true, 提示:  “一个中文将被计为2.25倍字符长度”
// extraSite以父级为默认值，extraTop绝对定位的top值
function chineseCharacterNum(el, binding) {
  let { calcByteLen, extraSite, extraTop } = binding.value
  const p = document.createElement('p')
  p.innerText = '一个中文将被计为2.25倍字符长度'
  p.style.position = 'absolute'
  p.style.top = extraTop || '-22px'
  p.style.lineHeight = '12px'
  p.style.fontSize = '12px'
  p.style.color = '#aaa'
  if (calcByteLen) {
    var parent = el.parentNode
    el.addEventListener(
      'focus',
      function() {
        if (extraSite == 'itself') {
          return el.insertBefore(p, el.nextSiblin)
        }
        parent.insertBefore(p, el.nextSiblin)
      },
      true
    )
    el.addEventListener(
      'blur',
      function() {
        parent.removeChild(p)
      },
      true
    )
  }
}

/**
 * 输入框字数统计
 */
const inputTextCount = {
  inserted: function(el, binding, vnode, oldVnode) {
    _render(el, binding, vnode, oldVnode)
    chineseCharacterNum(el, binding)
  },
  update: function(el, binding, vnode, oldVnode) {
    _render(el, binding, vnode, oldVnode)
  }
}

/**
 * 拖拽
 */
const drag = {
  bind: function(el, { value }) {
    // value: {
    //     bounds: 禁止出界
    //     sticky: 粘连
    //     left: 粘连左边界(需要配合sticky使用)
    //     right: 粘连右边界(需要配合sticky使用)
    // }
    el.onmousedown = (e) => {
      var elWidth = el.offsetWidth
      var elHeight = el.offsetHeight
      var docWidth = document.documentElement.clientWidth
      var docHeight = document.documentElement.clientHeight
      let disX = e.clientX - el.offsetLeft
      let disY = e.clientY - el.offsetTop
      document.onmousemove = (e) => {
        let left = e.clientX - disX
        let top = e.clientY - disY
        /**
         * 禁止出界
         */
        if (value.bounds) {
          if (left <= 0) left = 0
          if (top <= 0) top = 0
          if (left >= docWidth - elWidth) {
            left = docWidth - elWidth
          }
          if (top >= docHeight - elHeight) {
            top = docHeight - elHeight
          }
        }

        el.style.transition = null
        el.style.left = left + 'px'
        el.style.top = top + 'px'
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null

        /**
         * 粘连效果
         */
        if (value.sticky) {
          el.style.transition = 'all 0.2s ease 0s'
          if (el.offsetLeft + elWidth / 2 < docWidth / 2) {
            let left = value.left
            if (left) {
              el.style.left = left + 'px'
            } else {
              el.style.left = 0 + 'px'
            }
          } else {
            let right = value.right
            if (right) {
              el.style.left = docWidth - elWidth - right + 'px'
            } else {
              el.style.left = docWidth - elWidth + 'px'
            }
          }
        }
      }
    }
  }
}

export default {
  install: function(Vue) {
    Vue.directive('input-text-count', inputTextCount)
    Vue.directive('drag', drag)
  }
}
