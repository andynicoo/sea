<!--
 * @Author: your name
 * @Date: 2021-07-08 17:33:09
 * @LastEditTime: 2021-08-12 15:06:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /erp-web-refactor/src/views/WmsPage.vue
-->
<template>
  <div id="iframeId" style="height:100%"></div>
</template>

<script>
import Basic from '../api/basic'
export default {
  name: 'wmsPage',
  watch: {
    $route: {
      handler(newVal) {
        if (newVal) {
          this.setPage()
        }
      }
    }
  },
  mounted() {
    this.setPage()
  },
  methods: {
    setPage() {
      if (sessionStorage.getItem('wmsToken')) {
        this.createIframe(sessionStorage.getItem('wmsToken'))
      } else {
        this.convertWmsToken()
      }
    },
    createIframe(token) {
      document.getElementById('iframeId').innerHTML = null
      let iframe = document.createElement('iframe')
      iframe.src =
        process.env.VUE_APP_WMS_URL + this.$route.query.path + '?token=' + token
      iframe.width = '100%'
      iframe.height = '99%'
      document.getElementById('iframeId').append(iframe)
    },
    convertWmsToken() {
      Basic.getWmsUserInfo({
        token: this.$store.getters.getAccessToken,
        memberId: this.$store.state.auth.userInfo.memberId,
        maAccount: this.$store.state.auth.userInfo.maAccount
      }).then((res) => {
        if (res && res.data && res.data.token) {
          let token = res ? res.data.token : ''
          sessionStorage.setItem('wmsToken', token)
          this.createIframe(token)
        }
      })
    }
  }
}
</script>

<style lang="scss">
#iframeId {
  iframe {
    box-sizing: border-box;
    border: 0;
    padding: 0;
    margin: 0;
  }
}
</style>
