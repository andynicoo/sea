import Vue from 'vue'
import App from './App.vue'
import store from '@/store/index'
import router from './router/'
import Antd from 'ant-design-vue'
import PreviewImg from './components/previewImg'
import filter from './filter'
import directive from './directive/global'
import Storage from 'vue-ls'
import '@/common/style/index.less'
import { isType } from '@/utils/index'
Vue.config.productionTip = false
Vue.prototype.$isType = isType
Vue.use(Antd).use(PreviewImg).use(filter).use(directive).use(Storage, {
  namespace: 'erp',
  name: 'ls',
  storage: 'local'
})
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
