// 全局指令
export const direc = {
  // 当指令绑定到元素上的时调用
  bind(el, binding, vnode) {
    console.log("绑定时");
  },
  // 元素插入到 DOM 时调用
  inserted(el, binding, vnode) {
    console.log("插入时");
  },
  // 组件更新时调用
  componentUpdated() {
    console.log("更新时");
  },
};

//限制正整数
export const enterIntNumber = {
  inserted: function (el) {
    let trigger = (el, type) => {
      const e = document.createEvent("HTMLEvents");
      e.initEvent(type, true, true);
      el.dispatchEvent(e);
    };
    el.addEventListener("keyup", function (e) {
      let input = e.target;
      let reg = new RegExp("^\\d{1}\\d*$"); //正则验证是否是数字
      let correctReg = new RegExp("\\d{1}\\d*"); //正则获取是数字的部分
      let matchRes = input.value.match(reg);
      if (matchRes === null) {
        //若不是纯数字 把纯数字部分用正则获取出来替换掉
        let correctMatchRes = input.value.match(correctReg);
        if (correctMatchRes) {
          input.value = correctMatchRes[0];
        } else {
          input.value = "";
        }
      }
      trigger(input, "input");
    });
  },
};

import sensors from "sa-sdk-javascript";

export const sensorsDire = {
  inserted: function (el, binding) {
    const { type, getParams, event = "view" } = binding.value;
    if (event === "click") {
      el.addEventListener("click", () => {
        const _params = getParams ? getParams() : {};
        sensors.track(type, _params);
      });
    } else {
      const _params = getParams ? getParams() : {};
      sensors.track(type, _params);
    }
  },
};

/** binding.value   v-positiveNumber = {isInteger: 0}
 * isInteger: number, // 1  正整数， 0 正数(默认值)
 * maxNum: number,  // 最大值
 * minNum: number,   // 最小值
 * fixedNum: number,   // 保留小数位
 **/

export const positiveNumber = {
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
      } else {
        value = value
          .replace(/。/g, ".") // 中文字符。改成英文.
          .replace(/[^\d.]/g, "") // 只限制输入数字和小数点
          .replace(/\.{2,}/g, "") // 只保留第一个. 清除多余的
          .replace(/^(\d+)\.(\d+).*$/, "$1.$2");
      }
      return value;
    };
  },
};
export const login = {
  bind(el, binding, vnode) {
    el.onclick = function (event) {
      //阻止事件冒泡
      event.stopPropagation();
      //监听点击事件，判断是否登录
      if (!vnode.context.$store.state.isLogined) {
        //未登录，跳转登录
        const host = `${vnode.context.$store.state.host.server_url}/login`;
        window.location = host;
      } else {
        if (binding.expression) {
          //已登录则，如果有后续执行的函数，则继续做组件自己的事件
          binding.value()
        }
      }
    }
  }
}