// 定义全局指令
export const directiveHidden = {
  // 省略其他生命周期钩子函数
  // el： 使用了指令的dom
  // binding.value:  v-指令名="binding.value就是这里表达式的值"
  mounted(el: any, binding: any, vnode: any) {
    let text = el.innerText;
    let hiddenText = text;
    try {
      hiddenText = text.substr(0, 3) + '****' + text.substr(7);
    } catch (error) {
      hiddenText = text;
    }
    el.innerText = hiddenText;
    let timeout: any = null;
    el.addEventListener('click', () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      el.innerText = text;
      timeout = setTimeout(() => {
        el.innerText = hiddenText;
      }, 3000);
    });
  }
}
