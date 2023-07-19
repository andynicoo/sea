<template>
  <div class="bottom ksy-text-center ksy-w1320"
    :class="{ kbybottom: NODE_PLA === 'kby', wgbottom: NODE_PLA === 'wg', kqybottom: NODE_PLA === 'kqy' }">
    <div class="ksy-ib logo">
      <nuxt-link to="/"><img :src="webInfo.bottomLogo" alt="logo" style="width: 100px; height: 25px" /></nuxt-link>
    </div>
    <p class="ksy-ib">
      <a :href="webInfo.serviceAgreementLink" target="_blank">《{{ webInfo.name }}用户协议》</a>
      <a :href="webInfo.privacyPolicyLink" target="_blank">《{{ webInfo.name }}隐私策略》</a>
      <a href="http://beian.miit.gov.cn/" target="_blank">{{ webInfo.icpRecordNo }}</a>
      <a>{{ webInfo.copyrightInfo }}</a>
      <nuxt-link to="/tags" class="ksy-ml-1" v-if="NODE_PLA === 'kby' || NODE_PLA === 'ksy'">跨境标签</nuxt-link>
    </p>
  </div>
</template>

<script>
export default {
  name: "FooterTemp",
  props: {
    webInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
    };
  },
  methods: {},
};
</script>

<style lang="less">
.bottom {
  a {
    color: @textColor !important;
  }

  a:hover {
    color: @primaryColor !important;
  }
}

.kbybottom,
.wgbottom,
.kqybottom {
  a {
    color: @textColorW !important;
  }

  a:hover {
    color: @primaryColor !important;
  }
}

.bottom {
  margin: 0 auto;
  height: 72px;
  line-height: 72px;
  color: @textColor;
  font-size: 14px;

  .logo {
    img {
      width: 100px;
    }
  }

  p {
    margin-left: 20px;
    border-left: 1px solid #e3e3e3;
    height: 20px;
    line-height: 20px;
    padding-left: 15px;
  }

  a {
    color: rgba(@textColor, 0.9);
  }
}</style>
