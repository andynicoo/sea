import Vue from "vue";

import Loading from "./loading.vue";

const loadingConstructor = Vue.extend(Loading)

function showLoading() {

    const loadingDom = new loadingConstructor({ el: document.createElement('div') })

    document.body.appendChild(loadingDom.$el);

    loadingDom.clear = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                document.body.removeChild(loadingDom.$el)
                resolve()
            }, 500)
        })
    }

    return loadingDom
}

function install(Vue) {
    Vue.prototype.$Loading = showLoading
}

export default { install }