import qs from "qs";
import Cookies from "js-cookie";
import config from "../static/config";

const token = Cookies.get("token");
const sessionid = Cookies.get("sessionId");

export default ({ app: { $axios } }, inject) => {
  // $axios.setHeader("Content-Type", "application/json;charset=UTF-8");
  $axios.setHeader("enterprisecode", config[`${process.env.NODE_PLA}`].enterprisecode);
  $axios.setHeader("enterpriseId", config[`${process.env.NODE_PLA}`].enterpriseId);
  // $axios.setHeader("enterprisecode", "ksy");
  // $axios.setHeader("enterpriseId", 29);
  if (token) $axios.setHeader("token", token);
  if (sessionid) $axios.setHeader("sessionid", sessionid);
  $axios.defaults.timeout = 100 * 1000;
  // 设置axios跨域访问
  $axios.defaults.withCredentials = true;
  $axios.defaults.crossDomain = true;

  let baseUrl = process.env.SERVER_URL;
  console.log(baseUrl, process.env.NODE_PLA);
  $axios.defaults.baseURL = baseUrl;

  /**
   *  平铺数据
   * @param {String} url 请求后缀
   * @param {String} method get or post
   * @param {String} formData 个别请求是formdata类型
   * @return {Object} params 参数 如需要enterprisecode、Id后缀，写在url里
   */
  inject("axiosApi", (url, method, params = {}, formData = false) => {
    if (Cookies.get("token")) $axios.setHeader("token", Cookies.get("token"));
    if (Cookies.get("sessionId")) $axios.setHeader("sessionid", Cookies.get("sessionId"));
    return new Promise((resolve, reject) => {
      let methodLower = method.toLowerCase();
      let params2 = {};
      methodLower === "get"
        ? (params2 = {
            method: "get",
            url: url,
            params,
            headers: {
              "Content-Type": formData ? "application/x-www-form-urlencoded" : "application/json;charset=UTF-8",
            },
          })
        : (params2 = {
            method: "post",
            url: url,
            data: formData ? qs.stringify(params) : params,
            headers: {
              "Content-Type": formData ? "application/x-www-form-urlencoded" : "application/json;charset=UTF-8",
            },
          });
      $axios(params2)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};
