if (process.browser) {
  const head = document.getElementsByTagName("head")[0];
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "/libs/sensorsdata.min.js";
  //   script.src= "https://www.iipto.com/libs/sensorsdata.min.js";

  const server_url = `https://sc-rec.gstarsea.com/sa?project=${
    process.env.APP_ENV === "prod" ? "production" : "default"
  }`;
  console.log(server_url, process.env.APP_ENV);
  script.onload = () => {
    var sensors = window["sensorsDataAnalytic201505"];
    sensors.init({
      server_url: server_url,
      cross_subdomain: false,
      show_log: process.env.APP_ENV === "prod" ? false : true,
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
          em: true,
        },
      },
    });
    // 注册公共属性
    sensors.registerPage({
      platform_type: "Web",
      platform_name: "跨境知道",
    });
    sensors.quick("autoTrack"); //用于采集 $pageview 事件。

    //获取神策匿名id
    sensors.quick("isReady", function () {
      localStorage.anonymousID = sensors.quick("getAnonymousID");
    });
  };

  head.appendChild(script);
}
