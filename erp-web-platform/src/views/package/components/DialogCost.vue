<template>
  <!-- 添加附加费的弹窗 -->
  <a-modal v-model="visible" max-width="400px" :title="$t('packages.fujiafei')">
    <div class="cost-dialog">
      <!-- <a-row class="cost-item">
          <span class="label">{{ packageFee.title }}：</span>
          <div class="input-box">{{ packageFee.value }}</div>
        </a-row> -->
      <a-row class="cost-item">
        <span class="label">{{ baseFee.title }}：</span>
        <div class="input-box">{{ baseFee.value }}</div>
      </a-row>
      <a-row class="cost-item">
        <span class="label">{{ containFee.title }}：</span>
        <div class="input-box">{{ containFee.value }}</div>
      </a-row>
      <a-row class="cost-item">
        <span class="label">{{ otherFee.title }}：</span>
        <div class="input-box">{{ otherFee.value }}</div>
      </a-row>
      <a-row class="cost-item" v-show="costInfo.remark">
        <span class="label">{{ $t('packages.liuyan') }}</span>
        <div class="input-box notice">{{ costInfo.remark }}</div>
      </a-row>
      <a-row class="cost-item" v-show="costInfo.imgUrl">
        <span class="label">{{ $t('packages.tupianfujian') }}</span>
        <div class="input-box img-box">
          <img :src="costInfo.imgUrl" width="80" />
        </div>
      </a-row>
    </div>
    <template slot="footer">
      <a-button text @click="cancle">
        {{ $t('common.cancel') }}
      </a-button>
      <a-button type="danger" text @click="refuse">
        {{ $t('packages.jujue') }}
      </a-button>
      <a-button type="primary" @click="receive">
        {{ $t('packages.tongyi') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  props: {
    dialogCost: {
      default: false
    },
    uploadImg: {
      default: false
    },
    costInfo: {
      default: {}
    }
  },
  data() {
    return {
      remark: '',
      isDelete: false,
      packageFee: { title: '', value: '' }, //包材费（材料附加费）
      containFee: { title: '', value: '' }, //运费（物流费）
      otherFee: { title: '', value: '' }, //其他费
      baseFee: { title: '', value: '' }, //贴标费
      visible: false
    }
  },
  watch: {
    dialogCost(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          let fees = this.costInfo.fees
          fees.forEach((item) => {
            if (item.feeType == 1) {
              this.packageFee = {
                title: item.feeTypeDisplay,
                value: item.feeValue
              }
            } else if (item.feeType == 3) {
              this.containFee = {
                title: item.feeTypeDisplay,
                value: item.feeValue
              }
            } else if (item.feeType == -1) {
              this.otherFee = {
                title: item.feeTypeDisplay,
                value: item.feeValue
              }
            } else if (item.feeType == 0) {
              this.baseFee = {
                title: item.feeTypeDisplay,
                value: item.feeValue
              }
            }
          })
        })
        this.visible = newVal
      }
    }
  },
  methods: {
    refuse() {
      this.visible = false
      this.$emit('refuse')
    },
    receive() {
      this.visible = false
      this.$emit('receive')
    },

    cancle() {
      this.visible = false
      this.$emit('cancle')
    }
  }
}
</script>

<style lang="scss" scoped>
.cost-dialog {
  .cost-item {
    margin-bottom: -10px;
    display: flex;
    .label {
      display: inline-block;
      width: 100px;
      line-height: 40px;
      font-weight: 600;
    }
    .input-box {
      width: 100px;
      line-height: 40px;
    }
    .img-box {
      width: 80px;
      height: 80px;
      margin-top: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .headline {
    font-size: 18px !important;
  }
  .text-section {
    margin-top: -20px;
  }
}
</style>
