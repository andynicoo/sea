import Vue from "vue";
import VueLazyLoad from "vue-lazyload";

const loadimage = require("../static/images/loading-img.png");
const errorimage = require("../static/images/default-img.png");

Vue.use(VueLazyLoad, {
  preLoad: 1.33, //预加载高度比例
  error: errorimage, //加载失败时图像的src
  loading: loadimage, //加载时图像的src
  attempt: 1,
});
