const directives: any = {
  hidden: {
    inserted(el: any, binding: any, vnode: any) {
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
    },
  },
};

export default directives;
