import { mapGetters } from "vuex";
import moment from "moment";
import Cookies from "js-cookie";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isLogin"]),
  },
  methods: {
    // 跳转到客户端
    toClient(path = "login") {
      const host = `${this.$store.state.host.server_url}/${path}`;
      window.location = host;
    },
    // gif loading加载
    showLoading(status) {
      this.$emit("showLoading", {
        show: status,
      });
    },
    // 免费查询次数处理
    handleSearchFree() {
      let isLogin = false;
      let token = Cookies.get("token");
      let sid = Cookies.get("sessionId");
      if (token && sid) {
        isLogin = true;
      }
      return new Promise((resolve, reject) => {
        if (!isLogin) {
          console.log("未登录");
          if (localStorage.searchTime) {
            if (moment(new Date()) - moment(localStorage.searchTime) > 86400000) {
              localStorage.searchTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
              localStorage.searchSum = 1;
              resolve(1);
            } else {
              if (localStorage.searchSum < 3) {
                localStorage.searchSum = 1 + parseInt(localStorage.searchSum);
                resolve(1);
              } else {
                // 温馨提示，取消时，移除搜索cookie值
                Cookies.remove("countryList");
                Cookies.remove("trade");
                Cookies.remove("category");
                this.$store.commit("setLoginPopData", { show: true });
                this.$nextTick(() => {
                  this.$bus.$emit("loginVisiable", { type: 4 });
                });
              }
            }
          } else {
            localStorage.searchTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            localStorage.searchSum = 1;
            resolve(1);
          }
        } else {
          console.log("已登录");
          resolve(1);
        }
      });
    },
    // 搜索前置
    searchTest(string) {
      return new Promise((resolve, reject) => {
        //const reg = /^(?=.*[a-zA-Z0-9]).{1,30}$/;
        const reg = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9\d\s]{1,30}$/;
        if (!reg.test(string)) {
          this.$message.error("为更好的提供取名服务，请输入英文/数字，字符长度：1~30");
          reject(0);
        } else {
          resolve(1);
        }
      });
    },
    mTest() {
      console.log("mTest");
    },
  },
};
