// Copyright (c) 2019 by https://github.com/vannvan.
// All Rights Reserved.

import WModal from './modal/index'
import WMessage from './message/index'
import WImg from './w-img/index'
import WNotice from './notice/index'

const components = [WModal, WMessage, WImg]

const install = function(Vue, opts = {}) {
  if (install.installed) return
  components.map((component) => Vue.component(component.name, component))
  Vue.prototype.$Modal = WModal
  Vue.prototype.$Message = WMessage
  Vue.prototype.$Notice = WNotice
  Vue.prototype.$WUI = {
    transfer: 'transfer' in opts ? opts.transfer : '',
    modal: {
      maskClosable: opts.modal
        ? 'maskClosable' in opts.modal
          ? opts.modal.maskClosable
          : ''
        : ''
    }
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  WModal,
  WMessage,
  WNotice,
  WImg
}
