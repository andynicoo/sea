// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from '@/store'; // 引入store
import moment from 'moment'; // 导入文件

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

// 主要是移植官网组件，不想再用iview写一遍
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
Vue.use(Antd);
import './wechatcode.js';

import config from '@/config';
import QRCode from 'qrcodejs2'; // 二维码生成器
import area from './libs/area'; // 三级联动地区选择
import area1 from './libs/area1'; // 二级联动地区选择
import './formCreate.js';

import clipboard from 'clipboard'; // 一键复制

import PayMentDialog from './components/payMentDialog';
Vue.use(PayMentDialog);
import UploadAuthorizationLetter from '@/views/common/uploadAuthorizationLetter.vue';
Vue.component('UploadAuthorizationLetter', UploadAuthorizationLetter);
import { iiptoProgressBar, progressBarList } from '@/libs/iipto.js';
import '@/libs/sensors.js'; // 引入sensors指令
import util from '@/utils/util.js';
import '@/libs/webPopup.esm.min.js';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Vue.use(Viewer, {
  defaultOptions: {
    button: true,
    navbar: false,
    title: false,
    toolbar: false,
  },
});

//子模块的一些参数
localStorage.enterpriseid = process.env.NODE_PLA === 'wg' ? 49 : 30;
localStorage.productDetailPath = '/productDetail';
localStorage.productListPath =
  '/productDetail?id=' + (process.env.NODE_PLA === 'wg' ? '1606610367503691778' : '1606597568643756033');
localStorage.orderListPath = '/myOrder';
localStorage.workPath = '/myOrder';
localStorage.productId = process.env.NODE_PLA === 'wg' ? '1606610367503691778' : '1606597568643756033';
Vue.prototype.$util = util; // 全局公共方法
Vue.use(ViewUI);

/**
 * @description 获取baseUrl
 */

Vue.prototype.PROCESS_ENV = process.env;
console.log(process.env);
let baseUrl = ''; // 这里是一个默认的url，可以没有
switch (process.env.NODE_ENV) {
  case 'production':
    baseUrl = 'https://iipto-pro.itaxs.com/api'; // production
    break;
  case 'uatenvironment':
    baseUrl = 'https://uat-xcloud-iipto.itaxs.com/api'; // uatenvironment
    break;
  case 'uatenvironment2':
    baseUrl = 'https://uat2-console.itaxs.com/api'; // uatenvironment
    break;
  case 'testing':
    baseUrl = 'https://sit-xcloud-iipto.itaxs.com/api'; // testing
    break;
  case 'testing2':
    baseUrl = 'https://sit2-xcloud-console.itaxs.com/api'; // testing2
    break;
  case 'development':
    baseUrl = 'https://sit2-xcloud-console.itaxs.com/api'; // development
    break;
}

var sensors = require('sa-sdk-javascript');
sensors.init({
  show_log: false,
  server_url: config.apiUrl.server_url,
  cross_subdomain: false,
  is_track_single_page: false, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
  use_client_time: true,
  send_type: 'beacon',
  heatmap: {
    // 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
    clickmap: 'default',
    // 是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
    scroll_notice_map: 'not_collect',
  },
});
// 关联用户
if (localStorage.objInfo) {
  sensors.login(JSON.parse(localStorage.objInfo).userMobile);
}
// 注册公共属性
sensors.registerPage({
  platform_type: 'Web',
  platform_name: '跨标云',
});
sensors.quick('autoTrack'); // 用于采集 $pageview 事件。
// 获取神策匿名id
sensors.quick('isReady', function() {
  localStorage.anonymousID = sensors.quick('getAnonymousID');
});

Vue.prototype.$sensors = sensors;
// Vue.prototype.$sensorsType = sensorsType;

Vue.prototype.baseUrl = baseUrl;
Vue.prototype.uploadUrl = baseUrl + '/file/oss/upload'; // 图片文件等上传接口
Vue.prototype.$iiptoProgressBar = iiptoProgressBar;
// Vue.prototype.uploadUrl = baseUrl + '/file/dfs/upload'
Vue.prototype.isbig = localStorage.getItem('isBig');

Vue.prototype.backUrl = config.apiUrl.baseUrl; // 回调地址请求地址
Vue.prototype.shareUrl = config.apiUrl.shareUrl; // 分享url
Vue.prototype.homePageUrl = config.apiUrl.homePageUrl; // seo首页url
Vue.prototype.wgUrl = config.apiUrl.wgUrl; // 外观专利首页url
Vue.prototype.MchId = '1515011212'; // 商户ID
Vue.prototype.platform = '23'; // 平台id
Vue.prototype.enterpriseId = '30'; // 企业id

// 邀请码
Vue.prototype.invitedCode = localStorage.getItem('invitedCode');
Vue.prototype.promteCode = localStorage.getItem('promteCode');
// 注册到vue原型上
Vue.prototype.clipboard = clipboard;
// 地区data
Vue.prototype.AREA = area;
Vue.prototype.AREA1 = area1;
Vue.prototype.$progressBarList = progressBarList;
// 文件http替换为https
Vue.prototype.replaceHttps = (url) => url.replace('http:', 'https:');
Vue.prototype.$QRCode = QRCode;

// 注册全局 moment
Vue.prototype.$moment = moment;

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});

/* eslint-disable no-new */
let vueThis = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted() {
    document.dispatchEvent(new Event('render-event'));
  },
});
export default vueThis;
