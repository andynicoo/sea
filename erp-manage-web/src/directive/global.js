import permission from './permission'
import lazy from './lazyLoad'
import loadMore from './loadMore'
import copy from './copy'
const imgUrl = require('@/assets/loading-img.png')
const Directive = {}
Directive.install = function(Vue) {
  // 背景颜色
  Vue.directive('warn', function(el) {
    el.style.color = '#f00'
    el.style.fontWeight = 'bold'
  })
  // 图片未加载完之前先用随机背景色占位
  Vue.directive('img', {
    inserted: function(el, binding) {
      var color = Math.floor(Math.random() * 1000000)
      el.style.backgroundColor = '#' + color
      var img = new Image()
      img.src = binding.value
      img.onload = function() {
        el.style.backgroundImage = 'url(' + binding.value + ')'
      }
    }
  })
  // 限制0和正整数
  Vue.directive('enterIntNumber', {
    inserted: function(el) {
      let trigger = (el, type) => {
        const e = document.createEvent('HTMLEvents')
        e.initEvent(type, true, true)
        el.dispatchEvent(e)
      }
      el.addEventListener('keyup', function(e) {
        let input = e.target
        let reg = new RegExp('^\\d{1}\\d*$') // 正则验证是否是数字
        let correctReg = new RegExp('\\d{1}\\d*') // 正则获取是数字的部分
        let matchRes = input.value.match(reg)
        if (matchRes === null) {
          console.log('null')
          // 若不是纯数字 把纯数字部分用正则获取出来替换掉
          let correctMatchRes = input.value.match(correctReg)
          if (correctMatchRes) {
            console.log('correct')
            input.value = correctMatchRes[0]
          } else {
            console.log('else')
            input.value = ''
          }
        }
        trigger(input, 'input')
      })
    }
  })

  Vue.directive('focus', {
    inserted(el) {
      el.focus()
    }
  })
  // 一键复制指令v-copy="xxx(复制的内容)"
  Vue.directive('copy', copy)
  // 权限指令v-permission="['edit']"
  Vue.use(permission)
  // img懒加载v-lazy:xxx="src地址"替换src属性
  Vue.use(lazy, { default: imgUrl })
  // 滚动加载v-loadMore:xxx(滚动元素)=callback
  Vue.use(loadMore)
}

export default Directive
