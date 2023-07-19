/**神策 start */
import "./libs/sensorsdata.min.js";
window.onload = function () {
  var sensors = window["sensorsDataAnalytic201505"];
  let reg = /https:\/\/(www.)?itaxs.com.*/;
  let env = reg.test(location.href) ? "production" : "default";
  sensors.init({
    server_url: "https://sc-rec.gstarsea.com/sa?project=" + env,
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
    },
  });
  sensors.quick("autoTrack");
};
