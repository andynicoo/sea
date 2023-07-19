<!-- 线下支付 -->
<template>
  <el-dialog :visible.sync="dialogvisible" z-index="101" width="600px" footer-hide title="请向以下账号进行打款" class="account-wrap">
    <p class="pay-money-title">打款金额：￥{{ orderInfo.orderPaymentMoney }}</p>
    <div class="pay-account">
      <Form>
        <FormItem label="收款公司：">
          {{ userTransferAccountInfo.companyName }}
        </FormItem>
        <FormItem label="收款账号：">
          {{ userTransferAccountInfo.accountNumber }}
        </FormItem>
        <FormItem label="开户行名称：">
          {{ userTransferAccountInfo.bankName }}
        </FormItem>

        <FormItem label="联行行号：">
          {{ userTransferAccountInfo.bankNumber }}
        </FormItem>
      </Form>
    </div>
    <div class="btn-wrap">
      <Button type="primary" :loading="loadComfirm" @click="goPay(true)">
        <span v-if="!loadComfirm">已完成打款</span>
        <span v-else>确认中..</span>
      </Button>
    </div>

    <div class="warn-wrap">
      <p class="tip-font">温馨提示</p>
      <p class="tip-font">1，请按照以上指定收款账户打款，完成转帐后点击已完成打款</p>
      <p class="tip-font">2，节假日打款部分银行会有延时，请已实际到账时间为准</p>
      <p class="tip-font">3，如遇到支付问题可联系客户经理或在线客服</p>
    </div>
  </el-dialog>
</template>

<script>
import { queryUserTransferAccountInfo } from '../../../api/shoppingCar/index';
import { userPay } from '../../../utils/orderPlayConfig';
import { getInfo } from '../../../api/user/index';
import router from '@/router';
export default {
  props: {
    visible: Boolean,
    orderInfo: {
      type: Object,
      default: () => {},
    },
    payMode: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      userTransferAccountInfo: {},
      loadComfirm: false,
      orderNo: '',
    };
  },

  components: {},

  computed: {
    dialogvisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },

  async created() {
    let {
      data: { userId },
    } = await getInfo();
    let { code, data } = await queryUserTransferAccountInfo(userId);
    if (code == 0) {
      this.userTransferAccountInfo = data;
    }
  },
  methods: {
    async goPay() {
      this.loadComfirm = true;
      try {
        let { orderPaymentMoney, clientOrderProductVOList, orderNo } = this.orderInfo;
        let payInfo = {
          actNo: this.userTransferAccountInfo.accountNumber,
          amount: orderPaymentMoney,
          ...this.payMode,
          orderNo: orderNo.toString(),
        };
        userPay('PC', clientOrderProductVOList, payInfo, (payResponse) => {
          this.loadComfirm = false;
          if (payResponse.data == 'SUCCESS') {
            this.$emit('off');
            this.dialogvisible = false;
            setTimeout(() => {
              this.$Message.success('支付成功');
            }, 2000);
            if (router.history.current.path != '/orderManage/orderList') {
              router.push('/orderManage/orderList');
            }
          }
        });
      } catch (error) {
        this.loadComfirm = false;
        console.log('error :>> ', error);
      }
    },

    // getBeforeColse(val){
    //   console.log(1111);
    //   this.$emit("getOff");
    // }
  },
};
</script>
<style lang="less" scoped>
.account-wrap {
  /deep/ .ivu-modal-header-inner {
    text-align: center;
    font-size: 20px;
    font-weight: 800;
  }
  .pay-money-title {
    text-align: center;
    margin-bottom: 15px;
  }

  .pay-account {
    /deep/ .ivu-form-item {
      margin-bottom: 10px;
    }

    /deep/ .ivu-form {
      margin-left: 60px;
    }
  }
  .btn-wrap {
    text-align: center;
  }

  .tip-font {
    color: #999;
  }

  /deep/ .ivu-modal-content {
    height: 460px;
  }

  .warn-wrap {
    margin: 30px 0 0 60px;
  }
}
</style>
