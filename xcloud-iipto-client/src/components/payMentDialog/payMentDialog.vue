<!-- pay Mode -->
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
            <div v-if="PROCESS_ENV.NODE_PLA === 'kby'" class="price-name">收款方：跨标云</div>
            <div v-if="PROCESS_ENV.NODE_PLA === 'wg'" class="price-name">收款方：盛骁科技</div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import router from '@/router';
import { payResult } from '../../api/shoppingCar/shoppingCar';
import { routerOrder } from '../../utils/orderPlayConfig';
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
      timer: 0,
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

  created() {
    this.init();
  },
  methods: {
    changeStatePay(paySuccess) {
      if (this.dialog) {
        this.dialog = false;
        this.value = false;
        this.timer && clearInterval(this.timer);
        let { invoiceDTO, orderNo } = this.payInfo;
        if (this.payInfo.goPaymentSucceeded && paySuccess) {
          router.push({
            path: '/paymentSucceeded',
            query: {
              orderNo: this.payInfo.orderNo,
            },
          });
        } else {
          routerOrder({ invoiceDTO, orderNo });
        }
      }
    },

    payResultApi() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(async () => {
        let { code, data } = await payResult(this.payInfo.orderNo);
        if (code == 0 && data == true) {
          this.changeStatePay(true);
          clearInterval(this.timer);
          this.$Message.success('付款成功');
          this.$util.getUserInegralMessage(this, '消费');
        }
      }, 1500);
    },

    init() {
      let { data } = this.payInfo;
      this.qrcodeSrc = data;
      this.payResultApi();
    },

    beforDestroyed() {
      console.log('销毁');
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
  }
}
</style>
