<!--
 * @Author: your name
 * @Date: 2021-08-06 14:56:22
 * @LastEditTime: 2021-08-10 10:30:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /erp-web-refactor/src/App.vue
-->
<template>
  <div id="app">
    <a-config-provider :locale="locale">
      <router-view></router-view>
      <MessageModal v-model="visible" :title="title" :content="content" />
    </a-config-provider>
    <!-- <div
      @click="ttkfVisible = true"
      v-if="!$route.path.includes('oms')"
      class="me-ttkf-btn"
    >
      在线客服咨询
    </div>
    <a-modal
      :visible="ttkfVisible"
      :confirm-loading="confirmLoading"
      :footer="null"
      @cancel="ttkfVisible = false"
      class="me-ttkefu"
      :maskClosable="false"
      :destroyOnClose="true"
      width="700px"
    >
      <p class="me-mask-logo"></p>
      <p class="me-mask-hd"></p>
      <p class="me-mask-md"></p>
      <p class="me-mask-fd"></p>
      <iframe
        class="me-ttkefu-ifreame"
        src="https://w1011.ttkefu.com/k/linkurl/?t=2D3FCF0"
      ></iframe>
    </a-modal> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Crawl from '@/api/crawl'
import { isDev } from '@/util'
import MessageModal from './components/MessageModal.vue'
import { getMessage } from '@/api/common.js'
import Basic from '@/api/basic'
import Order from '@/api/order'
import bus from '@/bus'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { v4 as uuid } from 'uuid'
import Member from './api/member'
export default {
  components: { MessageModal },
  data() {
    return {
      title: '',
      content: '',
      visible: false,
      noticeKey: '',
      ylUser: true,
      locale: zhCN,
      ttkfVisible: false,
      couponNotificationKey: uuid()
    }
  },
  computed: {
    ...mapState({
      requestIsLoading: (state) => state.app.requestIsLoading,
      systemConfig: (state) => state.app.systemConfig,
      userInfo: (state) => state.auth.userInfo,
      access_token: (state) => state.auth.access_token
    })
  },
  watch: {
    $route(to, from) {
      //   if (from.name === 'login') {
      //     console.log('走你')
      //     this.getMessage()
      //   }
    }
  },
  created() {
    // 限制提示只有一条
    this.$message.config({
      maxCount: 1
    })
  },
  async mounted() {
    if (typeof window !== undefined && window._VV === undefined) {
      window._VV = this
    }
    if (!isDev) {
      let { data } = await Crawl.getLastPluginVersion()
      this.$store.commit('setSystemConfig', data)
    }
    isDev && console.log(process.env)

    /**订单通知 */
    setInterval(async () => {
      if (this.access_token) {
        let { data } = await Basic.getNotice()
        if (data) {
          this.$notification.close(this.noticeKey)
          this.openNotification('bottomRight')
        }
      } else {
        console.log('no account')
      }
    }, 1000 * 60 * 5)

    /**优惠券通知 */
    setInterval(async () => {
      if (!this.$store.state.auth.access_token) return
      const { data } = await Basic.getCouponNotice()
      if (!data) return
      this.openCouponNotification()
      this.$notification.close(this.couponNotificationKey)
    }, 1000 * 60 * 5)
    bus.$on('getOrderListCount', this.getOrderList)
  },
  destroyed() {
    bus.$off('getOrderListCount')
  },
  methods: {
    async getMessage() {
      try {
        const { data } = await getMessage()
        this.title = data?.title
        this.content = data?.content
        if (data) {
          this.visible = true
        }
      } catch (error) {
        console.error(error)
      }
    },
    openCouponNotification() {
      const key = this.couponNotificationKey
      this.$notification.open({
        message: `您有未使用优惠券，点击查看>>`,
        placement: 'bottomRight',
        duration: null,
        key,
        onClick: () => {
          //   this.$router.push('/member/coupon')
          this.$notification.close(key)
        }
      })
    },
    openNotification(placement) {
      const that = this
      this.noticeKey = `open${Date.now()}`
      const key = this.noticeKey
      this.$notification.open({
        message: `您有新订单，请及时处理>>`,
        // description: 'Sheep订单号:',
        placement,
        duration: null,
        key,
        onClick: function() {
          // 一乐用户 跳到未录单
          // localStorage.ylUser
          if (that.ylUser) {
            that.$router.push('/order/page-packing')
          } else {
            that.$router.push('/order/page-ready')
          }
          that.$notification.close(that.noticeKey)
        }
      })
    },
    async getOrderList() {
      this.ylUser = localStorage.ylUser == 'true' ? true : false
      let params = {
        type: this.ylUser ? 2 : 0,
        current: 1,
        size: 10,
        statusList: 'READY_TO_SHIP,PROCESSED,RETRY_SHIP,TO_RETURN'
      }
      var data
      if (this.ylUser) {
        data = await Order.getOrderList(params).then()
      } else {
        data = await Order.getOrderList(params).then()
      }

      if (data.data && data.data.records.length) {
        this.$notification.close(this.noticeKey)
        this.openNotification('bottomRight')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  width: 100vw;
  height: 100vh;
}

.global-progress-wrap {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 100vw;
  z-index: 9;
}

.me-ttkf-btn {
  right: 0px;
  bottom: 0px;
  position: fixed;
  z-index: 2147483;
  width: 200px;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  background: #ff6b38 url(https://w1011.ttkefu.com/images/kf.png) no-repeat 10px
    center;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 16px;
  color: #fff;
  padding-left: 35px;
}
.me-ttkefu {
  ::v-deep .ant-modal-close-x {
    background-color: rgb(255, 153, 2);
  }
  ::v-deep .ant-modal-body {
    padding: 0;
    overflow: hidden;
  }
  .me-mask-logo {
    position: absolute;
    z-index: 4;
    top: 0;
    right: 55px;
    height: 56px;
    width: 150px;
    background-color: #ff9902;
  }
  .me-mask-hd {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    height: 63px;
    width: 100%;
    background-color: rgb(255, 153, 2);
  }
  .me-mask-md {
    position: absolute;
    z-index: 5;
    top: 456px;
    left: 0;
    height: 20px;
    width: 100%;
    background-color: #fff;
  }
  .me-mask-fd {
    position: absolute;
    z-index: 5;
    top: 561px;
    left: 0;
    height: 42px;
    width: 596px;
    background-color: #fff;
  }
}
.me-ttkefu-ifreame {
  position: relative;
  z-index: 3;
  width: 700px;
  height: 600px;
}
</style>
