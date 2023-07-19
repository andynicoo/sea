import Vue from "vue";

import Confirm from "./confirm.vue";

const ConfirmConstructor = Vue.extend(Confirm)

function showConfirm({ title, btns, onOk, onCancel, field }) {

    const confirmDom = new ConfirmConstructor({
        el: document.createElement('div'),
        data() {
            return {
                title,
                btns: btns || ["ok", "cancel"],
                field
            }
        },
        methods: {
            onOk: onOk || (() => { }),
            onCancel: onCancel || (() => { })
        },
    })
    document.body.appendChild(confirmDom.$el);
}

function install(Vue) {
    Vue.prototype.$Confirm = showConfirm
}

export default { install }
