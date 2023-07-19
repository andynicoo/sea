<template>
  <div
    ref="container"
    class="mobiledom"
  >
    <a-spin :spinning="loading">
      <iframe
        id="mobile"
        :src="iframeUrl"
        frameborder="0px"
        height="600"
        width="350"
      />
    </a-spin>
  </div>
</template>
<script>
import { debounce } from 'lodash'
export default {
  props: {
    // 纯预览模式或者传参给iframe模式
    viewType: {
      type: Boolean,
      default: false
    },
    // 传参信息
    memberInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      iframeUrl: ''
    }
  },
  watch: {
    memberInfo: {
      handler(val) {
        console.log('mobile组件接收到信息：' + val)
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 1000)
        this.itemChange()
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    const originUrl = location.origin
    if (process.env.NODE_ENV === 'development') {
      this.iframeUrl = 'https://hm-erp-sit1.emalacca.com/buy.html'
    } else {
      originUrl.indexOf('sit1') > 0 ? this.iframeUrl = 'https://hm-erp-sit1.emalacca.com/buy.html' : this.iframeUrl = 'https://hm-erp.emalacca.com/buy.html'
    }

    this.viewType === true ? this.iframeUrl = this.iframeUrl + '?preview=1' : ''

    this.itemChange = debounce(this.onHandleChange, 1000)
    var messageEle = document.getElementById('mobile')
    let that = this
    if (messageEle.attachEvent) {
      messageEle.attachEvent('onload', function() {
        that.loading = false
      })
    } else {
      messageEle.onload = function() {
        that.loading = false
      }
    }
  },
  methods: {
    onHandleChange() {
      console.log('debounce..', this.memberInfo)
      this.sendMessage(this.memberInfo)
    },
    sendMessage(data) {
      const el = document.getElementById('mobile')
      el.contentWindow.postMessage({ type: 'MESSAGE_BANNER_INFO', data }, '*')
    }
  }
}
</script>
<style lang="less" scoped>
.mobiledom {
  height: 600px;
}
</style>
