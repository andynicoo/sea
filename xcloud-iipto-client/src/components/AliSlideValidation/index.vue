<template>
  <div>
    <div id="nc" class="ncLogin"></div>
  </div>
</template>

<script>
export default {
  props: ["scene"],
  data() {
    return {
      nc: null,
    };
  },
  mounted() {
    this.validationFun();
  },
  methods: {
    validationFun(params) {
      // 参考阿里云滑块验证 https://help.aliyun.com/document_detail/121893.html?spm=a2c4g.11174283.3.1.38159a9eJBg1Ru
      let self = this;
      var nc_token = ["FFFF0N0000000000998C", new Date().getTime(), Math.random()].join(":");
      var NC_Opt = {
        renderTo: "#nc",
        appkey: "FFFF0N0000000000998C",
        scene: this.scene,
        token: nc_token,
        customWidth: 300,
        trans: { key1: "code0" },
        elementID: ["usernameID"],
        is_Opt: 0,
        language: "cn",
        isEnabled: true,
        timeout: 3000,
        times: 5,
        apimap: {
          // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
          // 'get_captcha': '//b.com/get_captcha/ver3',
          // 'get_captcha': '//pin3.aliyun.com/get_captcha/ver3'
          // 'get_img': '//c.com/get_img',
          // 'checkcode': '//d.com/captcha/checkcode.jsonp',
          // 'umid_Url': '//e.com/security/umscript/3.2.1/um.js',
          // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
          // 'umid_serUrl': 'https://g.com/service/um.json'
        },
        callback: function (data) {
          // window.console && console.log(nc_token)
          // window.console && console.log(data.csessionid)
          // window.console && console.log(data.sig)
          self.$emit("validationData", {
            ncToken: nc_token,
            csessionid: data.csessionid,
            sig: data.sig,
            scene: self.scene,
          });
        },
      };
      this.nc = new noCaptcha(NC_Opt);
      this.nc.upLang("cn", {
        _startTEXT: "请按住滑块，拖动到最右边",
        _yesTEXT: "验证通过",
        _error300: '哎呀，出错了，点击<a href="javascript:__nc.reset()">刷新</a>再来一次',
        _errorNetwork: '网络不给力，请<a href="javascript:__nc.reset()">点击刷新</a>',
      });
    },
    refresh() {
      this.nc.reload();
    },
    reset() {
      this.nc.reset();
    },
  },
};
</script>

<style lang="less" scoped>
.ncLogin {
}
</style>
