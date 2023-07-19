// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import iView from 'iview';
import i18n from '@/locale';
import config from '@/config';
import importDirective from '@/directive';
import installPlugin from '@/plugin';
import 'iview/dist/styles/iview.css';
import './index.less';
import '@/assets/icons/iconfont.css';
import '@/assets/style/common.less';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import TreeTable from 'tree-table-vue';
import Treeselect from '@riophae/vue-treeselect';
import 'highlight.js/styles/googlecode.css'; // 样式文件
import VueNeditorWrap from 'vue-neditor-wrap'; // 百度编辑器
import VueUeditorWrap from 'vue-ueditor-wrap'; // 上面这个编辑器没人维护了 换个新的
import clipboard from 'clipboard'; // 一键复制
import area1 from './libs/area1'; // 二级联动地区选择
import area from './libs/area'; // 地区选择
import { iiptoProgressBar, functionCodeList } from '@/libs/iipto.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss'; // global scss 公共样式
import '@/styles/element-variables.scss';
import util from '@/utils/util.js';
import constant from '@/utils/constant.js';
import filters from '@/api/newApi/filters';
import { Base64 } from 'js-base64';

import cascaderMulti from 'cascader-multi';
Vue.use(cascaderMulti);
import formCreateZj from './formCreate.js'; // 工单模块动态表单插件
import QRCode from 'qrcodejs2'; // 二维码生成器
import getTableHeight from '@/mixins/getTableHeight';
// import getRouterFrom from "@/mixins/getRouterFrom";
import Empty from '@/components/Empty';
import * as math from 'mathjs';

Vue.prototype.$formCreateZj = formCreateZj; // 工单动态表单用的from插件
Vue.prototype.$Base64 = Base64;
Vue.prototype.$util = util; // 全局公共方法
Vue.prototype.$constant = constant; // 常量
Vue.prototype.$QRCode = QRCode;
Vue.prototype.$qkActions = null;

Vue.prototype.$printFn = function printFn(value) {
  const precision = 14;
  return Number(math.format(value, precision));
};
// 商品订单，工单状态过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// 适配表格高度
Vue.mixin(getTableHeight);
// 获取上级页面path
// Vue.mixin(getRouterFrom);

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value),
});

Vue.use(ElementUI, {
  size: 'small',
  i18n: function (path, options) {
    // ...
  },
});
// 注册组件
Vue.component(TreeTable.name, TreeTable);
Vue.component('treeselect', Treeselect);
Vue.component('vue-neditor-wrap', VueNeditorWrap);
Vue.component('vue-ueditor-wrap', VueUeditorWrap);
Vue.component('Empty', Empty);
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue);

// 地区data
Vue.prototype.AREA = area;
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;
// 注册到vue原型上
Vue.prototype.clipboard = clipboard;
Vue.prototype.AREA1 = area1;
Vue.prototype.$iiptoProgressBar = iiptoProgressBar;
Vue.prototype.$functionCodeList = functionCodeList;
// 文件http替换为https
Vue.prototype.replaceHttps = (url = '') => url.replace('http:', 'https:');
/**
 * 注册指令
 */
importDirective(Vue);

/**
 * 按钮全新控制
 *authorities 多个用,号隔开
 * @param authorities
 * @returns {boolean}
 */
Vue.prototype.hasAuthority = function (authorities) {
  if (!authorities) {
    return false;
  }
  return authorities.split(',').some((item) => {
    return store.state.user.access.includes('ACTION_' + item);
  });
};

/**
 * 时间转换成字符串格式
 */
Vue.prototype.formatDate = function (date, type) {
  if (typeof date === 'object') {
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    if (type == 'date') {
      return y + '-' + m + '-' + d + ' 00:00:00';
    } else if (type == 'month') {
      return y + '-' + m;
    }
  } else {
    return date;
  }
};

/**
 * @description 获取baseUrl
 */
let baseUrl = process.env.VUE_APP_BASE_API; // 这里是一个默认的url，可以没有
// switch (process.env.NODE_ENV) {
//   case "development":
//     baseUrl = config.apiUrl.dev; // 这里是本地的请求url
//     break;
//   case "production":
//     baseUrl = config.apiUrl.pro; // 生产环境url
//     break;
// }
Vue.prototype.baseUrl = baseUrl;
Vue.prototype.uploadUrl = baseUrl + '/filekjzd/laravel-u-editor-server/server';
Vue.prototype.workOrderFile = baseUrl + '/file/oss/upload'; // 工单文件上传接口
Vue.prototype.workOrderFileName = baseUrl + '/file/oss/upload2'; // 文件上传接口 保留文件名
Vue.prototype.ueditorFile = baseUrl + '/file/oss/upload/ueditor'; // ueditor文件上传接口
Vue.prototype.kjxFile = baseUrl + '/file/oss/upload'; // kjx123文件上传接口
Vue.prototype.kjxUeditorFile = baseUrl + '/file/oss/upload/ueditor'; // kjx123ueditor文件上传接口
Vue.prototype.$cancelRequestList = []; // 保存需要取消的请求列表

// 地区data
// Vue.prototype.AREA = area;

// Ueditor
Vue.prototype.UEDITOR_HOME_URL = '/Neditor/';

router.onError((error) => {
  const pattern = /Loading CSS chunk (\d)+ failed./g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: (h) => h(App),
});
