import PayMentDialog from './payMentDialog.vue';

/**
 * dialog
 * @param {*} images
 * @returns
 */
function install(Vue, options) {
  const payMentDialogConstructor = Vue.extend(PayMentDialog);
  function showPayMentDialog(payInfo) {
    return new Promise((resolve, reject) => {
      const payMentDialogDom = new payMentDialogConstructor({
        el: document.createElement('div'),
        data: { payInfo, options, resolve, reject },
      });
      document.body.appendChild(payMentDialogDom.$el);
    });
  }
  Vue.prototype.$payMentDialogDom = showPayMentDialog;
}

export default { install };
