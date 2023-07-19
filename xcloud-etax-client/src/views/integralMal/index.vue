<template>
  <div>
    <IntegralMal style="padding: 24px" :code-url="wxUrl" />
  </div>
</template>
<script>
import IntegralMal from '@comp/integralMal';
import { getQRcode } from '@/api/applet/index';
const VUE_APP_APPLET_ENV = process.env.VUE_APP_APPLET_ENV;
export default {
  components: {
    IntegralMal,
  },
  data() {
    return {
      wxUrl: '', // 小程序图片，base64
    };
  },
  created() {
    getQRcode({
      path: 'pages/integral/list',
      envVersion: VUE_APP_APPLET_ENV,
      type: 'sign',
    }).then((res) => {
      if (res.code == 0) {
        this.wxUrl = res.data.img;
      }
    });
  },
};
</script>
