import Vue from 'vue';
import router from './router';
import store from './store';
import App from './App.vue';

import area from './libs/area'; // 三级联动地区选择
import area1 from './libs/area1'; // 二级联动地区选择

import Clipboard from 'clipboard'; //一键复制
import MetaInfo from 'vue-meta-info'; //静态页面SEO处理
import VueI18n from 'vue-i18n'; // 引入i18n

//全局指令
import globalDirective from '@/directive/global';
Vue.use(globalDirective);

// import view-design
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
ViewUI.InputNumber.computed.precisionValue = function() {
  let arr = (this.currentValue + '').split('.');
  if (this.precision && arr[1] && this.precision < arr[1].length) return this.currentValue.toFixed(this.precision);
  return this.currentValue;
};

// 主要是移植官网组件，不想再用iview写一遍
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
Vue.use(Antd);

// import global index.scss
import '@/styles/index.less';

import '@/icons'; // icon
import './permission'; // permission control

import PayMentDialog from './components/payMentDialog';
Vue.use(PayMentDialog);

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Vue.use(Viewer, {
  defaultOptions: {
    button: true,
    navbar: false,
    title: false,
    toolbar: true,
  },
});

import util from '@/utils/util.js';
import filters from '@/utils/filters';
import QRCode from 'qrcodejs2'; //二维码生成器
import formCreateZj from './formCreate.js'; //工单模块动态表单插件

import ActiveConfig from './activeConfig/index';
import ProductList from './activeConfig/producList';

//子模块的一些参数
localStorage.enterpriseid = 29;
localStorage.productDetailPath = '/serviceDetail';
localStorage.productListPath = '/serviceList';
localStorage.orderListPath = '/orderList';
localStorage.workPath = '/work';

Vue.prototype.ActiveConfig = ActiveConfig; //活动配置
Vue.prototype.ProductList = ProductList; //活动配置

// use i18n
Vue.use(VueI18n);

// use view-design
Vue.use(ViewUI);

// use vue-meta-info
Vue.use(MetaInfo);

// vue config
Vue.config.productionTip = false;

Vue.prototype.$util = util; //全局公共方法

//
Vue.prototype.$QRCode = QRCode;
Vue.prototype.$formCreateZj = formCreateZj; //工单动态表单用的from插件
// vue prototype bind
Vue.prototype.baseUrl = process.env.VUE_APP_BASE_API;
Vue.prototype.ImgUrl = process.env.VUE_APP_BASE_API + '/file/oss/upload';
Vue.prototype.uploadUrl = process.env.VUE_APP_BASE_API + '/file/oss/upload'; // 图片文件等上传接口
Vue.prototype.isbig = localStorage.getItem('isBig');
Vue.prototype.clientType = localStorage.getItem('clientType');
Vue.prototype.backUrl = process.env.VUE_APP_BASE_API; // 回调地址
Vue.prototype.shareUrl = process.env.VUE_APP_SHARE_RUL; // 分享url
Vue.prototype.homePageUrl = process.env.VUE_APP_HOME_URL; // 首页url
Vue.prototype.homePageKBUrl = process.env.VUE_APP_HOMEKB_URL; // 跨标首页url
Vue.prototype.envpla = process.env.VUE_APP_ENV_PLA; // 跨企云标识
// Vue.prototype.MchId = '1495152042'   // 商户ID预发布
Vue.prototype.MchId = '1515011212'; // 商户ID
Vue.prototype.clipboard = Clipboard;
Vue.prototype.AREA = area;
Vue.prototype.AREA1 = area1;
// 文件http替换为https
Vue.prototype.replaceHttps = (url) => url.replace('http:', 'https:');

Vue.prototype.$bus = new Vue(); // event Bus 用于无关系组件间的通信

/**神策 start */
import sensors from 'sa-sdk-javascript';
import '@/directive/sensors.js';
import '@/libs/webPopup.esm.min.js';
const VUE_APP_SENSORS_RUL = process.env.VUE_APP_SENSORS_RUL;
console.log('VUE_APP_SENSORS_RUL', VUE_APP_SENSORS_RUL);
sensors.init({
  server_url: VUE_APP_SENSORS_RUL,
  cross_subdomain: false,
  show_log: false,
  is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
  use_client_time: true,
  send_type: 'beacon',
  heatmap: {
    //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 "not_collect" 表示关闭。
    clickmap: 'default',
    //是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 "default" 表示开启。
    scroll_notice_map: 'not_collect',
  },
});

// 关联用户
if (localStorage.objInfo) {
  console.log('main:', JSON.parse(localStorage.objInfo).userMobile);
  sensors.login(JSON.parse(localStorage.objInfo).userMobile);
}
// 注册公共属性
sensors.registerPage({
  platform_type: 'Web',
  platform_name: '跨税云',
});

sensors.quick('autoTrack'); //用于采集 $pageview 事件。
Vue.prototype.$sensors = sensors;

// 商品订单，工单状态过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

//获取神策匿名id
sensors.quick('isReady', function() {
  localStorage.anonymousID = sensors.quick('getAnonymousID');
});

sensors.use('WebPopup', {
  api_base_url: 'https://chenhaijituan.sfn-tx-guangzhou-01.saas.sensorsdata.cn/api/v2',
  popup_campaign_listener: {
    shouldStart: function(SFCampaign) {
      return true;
    },
    onStart: function(SFCampaign) {
      let SFC = JSON.parse(SFCampaign.content);
      ViewUI.Modal.confirm({
        okText: '关闭',
        cancelText: ' ',
        render: (h) => {
          return h(
            'div',
            SFC.map(function(item) {
              if (item.value.includes('http')) {
                return h('img', {
                  style: { width: '100%', verticalAlign: 'middle' },
                  attrs: { src: item.value },
                });
              } else {
                return h('p', item.value);
              }
            })
          );
        },
      });
    },
    onFailed: function(SFCampaign, errorCode, errorMessage) {},
    onEnd: function(SFCampaign) {},
  },
});
/**神策 end */

const i18n = new VueI18n({
  locale: localStorage.getItem('lang') || 'zh',
  messages: {
    zh: require('./lang/zh'),
    en: require('./lang/en'),
  },
});

// create vue
let vueThis = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
  mounted() {
    document.dispatchEvent(new Event('render-event'));
  },
}).$mount('#app');
export default vueThis;
