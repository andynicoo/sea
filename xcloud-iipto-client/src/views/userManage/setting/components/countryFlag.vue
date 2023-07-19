<template>
  <div class="txtl">
    <img src="@/assets/images/setting/mg-flag.png" v-if="site === 'USA'" />
    <img src="@/assets/images/setting/yg-flag.png" v-if="site === 'UK'" />
    <img src="@/assets/images/setting/dg-flag.png" v-if="site === 'DE'" />
    <img src="@/assets/images/setting/ydl-flag.png" v-if="site === 'IT'" />
    <img src="@/assets/images/setting/fg-flag.png" v-if="site === 'FR'" />
    <img src="@/assets/images/setting/xby-flag.png" v-if="site === 'ES'" />
    <img src="@/assets/images/setting/rb-flag.png" v-if="site === 'JP'" />
    <img
      src="@/assets/images/setting/adly-flag.png"
      v-if="site === 'AU'"
    />
    <img src="@/assets/images/setting/bx-flag.png" v-if="site === 'BR'" />
    <img src="@/assets/images/setting/jnd-flag.png" v-if="site === 'CA'" />
    <img src="@/assets/images/setting/yd-flag.png" v-if="site === 'IN'" />
    <img src="@/assets/images/setting/mxg-flag.png" v-if="site === 'MX'" />
    <img src="@/assets/images/setting/hl-flag.png" v-if="site === 'NL'" />
    <img src="@/assets/images/setting/bl-flag.png" v-if="site === 'PL'" />
    <img src="@/assets/images/setting/teq-flag.png" v-if="site === 'TR'" />
    <img src="@/assets/images/setting/alb-flag.png" v-if="site === 'AE'" />
    <img src="@/assets/images/setting/xjp-flag.png" v-if="site === 'SG'" />
  </div>
</template>

<script>
export default {
  props: {
    site: {
      type: String,
      default: ''
    }
  }
}
</script>
