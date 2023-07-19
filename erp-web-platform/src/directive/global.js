import { Message } from 'ant-design-vue'
import tooltip from './tooltip'
const Directive = {}
Directive.install = function(Vue) {
  //背景颜色
  Vue.directive('warn', function(el) {
    el.style.color = '#f00'
    el.style.fontWeight = 'bold'
  }),
    // 图片未加载完之前先用默认图片占位
    Vue.directive('img', {
      inserted: function(el, binding) {
        var defaultImg = require('@/assets/images/loading-img.png')
        el.style.backgroundImage = 'url(' + defaultImg + ')'
        el.style.backgroundSize = '100%'
        var img = new Image()
        img.src = binding.value
        img.onload = function() {
          el.style.backgroundImage = 'url(' + binding.value + ')'
        }
      }
    }),
    //限制正整数
    Vue.directive('enterIntNumber', {
      inserted: function(el) {
        let trigger = (el, type) => {
          const e = document.createEvent('HTMLEvents')
          e.initEvent(type, true, true)
          el.dispatchEvent(e)
        }
        el.addEventListener('keyup', function(e) {
          let input = e.target
          let reg = new RegExp('^\\d{1}\\d*$') //正则验证是否是数字
          let correctReg = new RegExp('\\d{1}\\d*') //正则获取是数字的部分
          let matchRes = input.value.match(reg)
          if (matchRes === null) {
            //若不是纯数字 把纯数字部分用正则获取出来替换掉
            let correctMatchRes = input.value.match(correctReg)
            if (correctMatchRes) {
              input.value = correctMatchRes[0]
            } else {
              input.value = ''
            }
          }
          trigger(input, 'input')
        })
      }
    }),
    //复制
    Vue.directive('copy', {
      bind(el, { value }) {
        el.$value = value // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
        el.handler = () => {
          if (!el.$value) {
            // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
            Message.warning(window._VV.$t('common.nocopy'))
            return
          }
          // 动态创建 textarea 标签
          const textarea = document.createElement('textarea')
          // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
          textarea.readOnly = 'readonly'
          textarea.style.position = 'absolute'
          textarea.style.left = '-9999px'
          // 将要 copy 的值赋给 textarea 标签的 value 属性
          textarea.value = el.$value
          // 将 textarea 插入到 body 中
          document.body.appendChild(textarea)
          // 选中值并复制
          textarea.select()
          textarea.setSelectionRange(0, textarea.value.length)
          const result = document.execCommand('Copy')
          if (result) {
            Message.success(window._VV.$t('common.copyd'))
          }
          document.body.removeChild(textarea)
        }
        // 绑定点击事件，就是所谓的一键 copy 啦
        el.addEventListener('click', el.handler)
      },
      // 当传进来的值更新的时候触发
      componentUpdated(el, { value }) {
        el.$value = value
      },
      // 指令与元素解绑的时候，移除事件绑定
      unbind(el) {
        el.removeEventListener('click', el.handler)
      }
    }),
    //权限
    Vue.directive('auth', {
      inserted: function(el, binding) {
        const { path } = window._VV.$route
        // 去掉路由开头的斜杠,与登录时候获取到到接口数据对应，接口的也要去掉开头到斜杠
        let routePath = path.replace(/^\//, '')
        try {
          const rules = window._VV.$store.getters.buttonRules
          if (!rules[routePath] || !rules[routePath].includes(binding.value)) {
            el.remove()
          }
          // 如果没有这个模块直接删除
          if (!rules[routePath]) {
            el.remove()
          }
        } catch (error) {
          console.warn(`[${binding.value}]按钮权限错误:`, error)
          el.remove()
        }
      }
    }),
    /**过滤特殊字符 */
    Vue.directive('filter-text', {
      inserted: function(el) {
        const handler = (event) => {
          if (event.target.value != '') {
            const pattern = new RegExp(/[^a-zA-Z0-9_\u4e00-\u9fa5]+$/gi)
            event.target.value = event.target.value.replace(pattern, '')
          }
        }
        el.addEventListener('input', handler)
        el.addEventListener('blur', handler)
        el.addEventListener('focus', handler)
      }
    })

  Vue.directive('tooltip', tooltip)
}

export default Directive
