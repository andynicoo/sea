<template>
  <div class="qrcode-page">
    <vue-qr
      v-bind="$attrs"
      :margin="codeMargin"
      :logoSrc="logoSrc"
      colorDark="#444"
      :logoScale="0.25"
      colorLight="#fff"
      :text="code"
      :size="size"
    />
  </div>
</template>
<script>
import vueQr from 'vue-qr'
export default {
  name: 'qrcode',
  components: {
    vueQr
  },
  data () {
    return {
      code: this.$attrs.text || 'https://m.iipto.com',
      logoSrc: require('@/assets/images/common/logo-code.svg'),
      size: this.$attrs.size || 200,
      codeMargin: this.$attrs.codeMargin || 20
    }
  }
}
</script>
<style lang="less" scoped>

</style>
