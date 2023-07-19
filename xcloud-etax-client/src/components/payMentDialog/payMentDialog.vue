<!-- 发票详情页 -->
<template>
  <div>
    <Modal v-model="dialog" :width="600" footer-hide @on-visible-change="changeStatePay(false)" :title="title">
      <div id="qrcode" class="qrcode">
        <div class="qrcode-container">
          <div class="qrcode-img">
            <div id="qrcode-content">
              <img :src="qrcodeSrc" alt="" />
            </div>
            <div class="qrcode-content-text">
              <img style="margin-bottom: -3px; margin-right: 3px" src="@/assets/images/sureOrder/sao.png" alt />
              使用【{{ dialogInfo.name }}扫一扫】即可付款
            </div>
            <div class="price-name" v-if="envpla==='ksy'">收款方：跨税云</div>
            <div class="price-name" v-if="envpla==='kqy'">收款方：跨企云</div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import router from '@/router';
import { payResult } from '@/api/shoppingCar/shoppingCar';
export default {
  name: 'PayMentDialog',

  data() {
    return {
      qrcodeSrc: '',
      value: true,
      payInfo: {
        payWayKey: '',
        data: '',
        orderNo: '',
      },
      timer: '',
      mode: false,
    };
  },

  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },

    dialogInfo() {
      let { payWayKey } = this.payInfo;
      let name = '';
      if (payWayKey) {
        if (payWayKey.includes('WECHAT')) {
          name = '微信';
        } else if (payWayKey.includes('ALIPAY')) {
          name = '支付宝';
        } else {
          name = '银联';
        }
      }
      return { name };
    },
    title() {
      return this.dialogInfo.name + '支付';
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    changeStatePay(paySuccess) {
      if (this.dialog) {
        this.dialog = false;
        this.value = false;
        console.log(this.payInfo.goPaymentSucceeded, paySuccess, 999);
        setTimeout(() => {
          //支付成功跳支付成功落地页

          if (this.payInfo.goPaymentSucceeded && paySuccess) {
            router.push({
              path: '/paymentSucceeded',
              query: {
                orderNo: this.payInfo.orderNo,
              },
            });
          } else {
            if (router.history.current.path != '/orderList') {
              router.push('/orderList');
            } else {
              location.reload();
            }
          }

          this.$destroy();
        }, 1000);

        setTimeout(() => {
          this.timer && clearInterval(this.timer);
        }, 5000);
      }
    },
    payResultApi() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(async () => {
        let { code, data } = await payResult(this.payInfo.orderNo);
        if (code == 0 && data == true) {
          clearInterval(this.timer);
          this.$Message.success('付款成功');
          this.$util.getUserInegralMessage(this, '消费');
          this.changeStatePay(true);
          // 发票指引 标识
          this.$store.commit('savePayLog', true);
        }
      }, 1500);
      console.log(this.timer);
    },

    init() {
      let { data } = this.payInfo;
      this.qrcodeSrc = data;
      setTimeout(() => {
        this.payResultApi();
      }, 5000);
    },
    beforeDestroy() {
      console.log('跳转', this.$router);
    },
  },
};
</script>
<style lang="less" scoped>
.qrcode {
  margin-top: 35px;
}

img {
  margin: auto;
}

.qrcode-img {
  text-align: center;

  #qrcode-content {
    margin-bottom: 20px;
  }

  .qrcode-content-text {
    font-size: 12px;
    color: #999999;
  }

  .price-name {
    font-size: 12px;
    color: #666666;
    margin-top: 20px;
    padding-bottom: 20px;
  }
}
</style>
