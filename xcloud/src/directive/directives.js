import { on } from '@/libs/tools';
import hljs from 'highlight.js';

const directives = {
  draggable: {
    inserted: (el, binding, vnode) => {
      let triggerDom = document.querySelector(binding.value.trigger);
      triggerDom.style.cursor = 'move';
      let bodyDom = document.querySelector(binding.value.body);
      let pageX = 0;
      let pageY = 0;
      let transformX = 0;
      let transformY = 0;
      let canMove = false;
      const handleMousedown = (e) => {
        let transform = /\(.*\)/.exec(bodyDom.style.transform);
        if (transform) {
          transform = transform[0].slice(1, transform[0].length - 1);
          let splitxy = transform.split('px, ');
          transformX = parseFloat(splitxy[0]);
          transformY = parseFloat(splitxy[1].split('px')[0]);
        }
        pageX = e.pageX;
        pageY = e.pageY;
        canMove = true;
      };
      const handleMousemove = (e) => {
        let xOffset = e.pageX - pageX + transformX;
        let yOffset = e.pageY - pageY + transformY;
        if (canMove) bodyDom.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      };
      const handleMouseup = (e) => {
        canMove = false;
      };
      on(triggerDom, 'mousedown', handleMousedown);
      on(document, 'mousemove', handleMousemove);
      on(document, 'mouseup', handleMouseup);
    },
    update: (el, binding, vnode) => {
      if (!binding.value.recover) return;
      let bodyDom = document.querySelector(binding.value.body);
      bodyDom.style.transform = '';
    },
  },
  highlight: {
    inserted: (el, binding, vnode) => {
      let blocks = el.querySelectorAll('pre');
      setTimeout(() => {
        blocks.forEach((block) => {
          hljs.highlightBlock(block);
        });
      }, 200);
    },
    componentUpdated: function (el) {
      let blocks = el.querySelectorAll('pre');
      setTimeout(() => {
        blocks.forEach((block) => {
          hljs.highlightBlock(block);
        });
      }, 200);
    },
  },
  hidden: {
    bind: function (el, binding, vnode) {
      // bind中的vnode里面的key可以给设置一个随机数，这样每次都会更新虚拟节点。
      let num = parseInt(Math.random() * 10);
      vnode.key = num;
    },
    inserted(el, binding, vnode) {
      let text = el.innerText;
      let hiddenText = text;
      try {
        hiddenText = text.substr(0, 3) + '****' + text.substr(7);
      } catch (error) {
        hiddenText = text;
      }
      el.innerText = hiddenText;
      let timeout = null;
      el.addEventListener('click', () => {
        if (timeout) {
          clearTimeout(timeout);
        }
        el.innerText = text;
        timeout = setTimeout(() => {
          el.innerText = hiddenText;
        }, 3000);
      });
    },
  },
/** binding.value   v-positiveNumber = {isInteger: 0}
 * isInteger: number, // 1  正整数， 0 正数(默认值)
 * maxNum: number,  // 最大值
 * minNum: number,   // 最小值
 * fixedNum: number,   // 保留小数位
 **/
  positiveNumber: {
    inserted(el, binding) {
      let inputChange = null;
      let trigger = (el, type) => {
        const e = document.createEvent("HTMLEvents");
        e.initEvent(type, true, true);
        el.dispatchEvent(e);
      };
      el.addEventListener("keyup", function (e) {
        let input = e.target;
        let value = input.value;
        input.value = inputChange(value, binding);
        trigger(input, "input");
      });
      el.addEventListener(
        "blur",
        function (e) {
          const { maxNum, minNum, fixedNum } = binding.value || {};
          let input = e.target;
          let value = input.value;
          value = inputChange(value, binding);
          // 保留两位小数
          if (!isNaN(fixedNum) && !Number.isInteger(Number(value))) {
            value = Number(value).toFixed(fixedNum);
          }
          // 限制最大值
          if (!isNaN(maxNum)) {
            value = Number(value) > maxNum ? maxNum : value;
          }
          // 限制最小值
          if (!isNaN(minNum)) {
            value = Number(value) < minNum ? minNum : value;
          }
          input.value = value;
          trigger(input, "input");
        },
        true
      );
      inputChange = (value, binding) => {
        const { isInteger = 0 } = binding.value || {};
        if (isInteger) {
          // 整数
          value = value.replace(/[^\d.]/g, "").replace(/\./g, "");
        } else if(value==='.'){
          value=''
        }
         else {
          value = value
            .replace(/。/g, ".") // 中文字符。改成英文.
            .replace(/[^\d.]/g, "") // 只限制输入数字和小数点
            .replace(/\.{2,}/g, "") // 只保留第一个. 清除多余的
            .replace(/^(\d+)\.(\d+).*$/, "$1.$2");
        }
        return value;
      };
    }
  }
};

export default directives;
