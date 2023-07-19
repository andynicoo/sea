/**神策 start */
import sensors from "sa-sdk-javascript";
import Vue from "vue";
// import "../libs/webPopup.esm.min.js";
const VUE_APP_SENSORS_RUL = process.env.SENSORS_RUL;
const VUE_APP_SENSORS_RULPROD = process.env.SENSORS_RULPROD;
const VUE_APP_ENV = process.env.NODE_ENV;
const SENSORS_RUL = VUE_APP_ENV === "prod" ? VUE_APP_SENSORS_RULPROD : VUE_APP_SENSORS_RUL;
sensors.init({
  // 跨税初版加神策，跨标23.3月加
  server_url: process.env.NODE_PLA === "ksy" || process.env.NODE_PLA === "kby" ? SENSORS_RUL : "",
  cross_subdomain: false,
  show_log: false,
  is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
  use_client_time: true,
  send_type: "beacon",
  heatmap: {
    //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 "not_collect" 表示关闭。
    clickmap: "default",
    //是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 "default" 表示开启。
    scroll_notice_map: "not_collect",
    // 全埋点的点击事件只采集a\input\button\textarea,其他标签慎重添加
    collect_tags: {
      em: true
    }
  },
});

// // 关联用户
// if (localStorage.objInfo) {
//   console.log('main:', JSON.parse(localStorage.objInfo).userMobile)
//   sensors.login(JSON.parse(localStorage.objInfo).userMobile);
// }
let platName = "";
if (process.env.NODE_PLA === "ksy") {
  platName = "跨税云官网(重构)";
} else if (process.env.NODE_PLA === "kby") {
  platName = "跨标云官网(重构)";
}

// 注册公共属性
sensors.registerPage({
  platform_type: "Web",
  platform_name: platName,
});

sensors.quick("autoTrack"); //用于采集 $pageview 事件。
Vue.prototype.$sensors = sensors;

//获取神策匿名id
sensors.quick("isReady", function () {
  localStorage.anonymousID = sensors.quick("getAnonymousID");
});

console.log(SENSORS_RUL, VUE_APP_ENV, process.env.NODE_PLA, "sensors--------------------------");

