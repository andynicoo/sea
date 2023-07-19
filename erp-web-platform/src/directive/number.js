module.exports = {
  limitPercentNumber: {
    inserted: function(el, binding) {
      let trigger = (el, type) => {
        const e = document.createEvent('HTMLEvents')
        e.initEvent(type, true, true)
        el.dispatchEvent(e)
      }
      el.addEventListener('keyup', function(e) {
        let input = e.target
        let value = input.value
        if (parseFloat(value) > parseFloat(binding.value)) {
          input.value = binding.value
        }
        if (parseFloat(value) < 0) {
          input.value = 1
        }
        trigger(input, 'input')
      })
    }
  },
  limitMinNumber: {
    inserted: function(el, binding) {
      let trigger = (el, type) => {
        const e = document.createEvent('HTMLEvents')
        e.initEvent(type, true, true)
        el.dispatchEvent(e)
      }
      el.addEventListener('keyup', function(e) {
        let input = e.target
        let value = input.value
        if (parseFloat(value) < 0) {
          input.value = 1
        }
        // 0 标识必须是大于0的整数
        if (binding.value == 0) {
          input.value = parseInt(input.value) == 0 ? 1 : parseInt(input.value) //强制整数
        }
        trigger(input, 'input')
      })
    }
  },
  limitMaxNumber: {
    inserted: function(el, binding) {
      // binding.value
      let trigger = (el, type) => {
        const e = document.createEvent('HTMLEvents')
        e.initEvent(type, true, true)
        el.dispatchEvent(e)
      }

      el.addEventListener('keyup', function(e) {
        let input = e.target
        let value = input.value
        if (parseFloat(value) > parseFloat(binding.value)) {
          input.value = binding.value
        }
        trigger(input, 'input')
      })
    }
  },
  // <a-input>限制input正数
  /** binding.value   v-positiveNumber = {isInteger: 0}
   * isInteger: number, // 1  正整数， 0 正数(默认值)
   * maxNum: number,  // 最大值
   * minNum: number,   // 最小值
   * fixedNum: number,   // 保留小数位
   **/

  positiveNumber: {
    inserted(el, binding) {
      let inputChange = null
      let trigger = (el, type) => {
        const e = document.createEvent('HTMLEvents')
        e.initEvent(type, true, true)
        el.dispatchEvent(e)
      }
      el.addEventListener('keyup', function(e) {
        let input = e.target
        let value = input.value
        input.value = inputChange(value, binding)
        trigger(input, 'input')
      })
      el.addEventListener(
        'blur',
        function(e) {
          const { maxNum, minNum, fixedNum } = binding.value || {}
          let input = e.target
          let value = input.value
          value = inputChange(value, binding)
          // 保留两位小数
          if (!isNaN(fixedNum) && !Number.isInteger(Number(value))) {
            value = Number(value).toFixed(fixedNum)
          }
          // 限制最大值
          if (!isNaN(maxNum)) {
            value = Number(value) > maxNum ? maxNum : value
          }
          // 限制最小值
          if (!isNaN(minNum)) {
            value = Number(value) < minNum ? minNum : value
          }
          input.value = value
          trigger(input, 'input')
        },
        true
      )
      inputChange = (value, binding) => {
        const { isInteger = 0 } = binding.value || {}
        if (isInteger) {
          // 整数
          value = value.replace(/[^\d.]/g, '').replace(/\./g, '')
        } else {
          value = value
            .replace(/。/g, '.') // 中文字符。改成英文.
            .replace(/[^\d.]/g, '') // 只限制输入数字和小数点
            .replace(/\.{2,}/g, '') // 只保留第一个. 清除多余的
            .replace(/^(\d+)\.(\d+).*$/, '$1.$2')
        }
        return value
      }
    }
  }
}
