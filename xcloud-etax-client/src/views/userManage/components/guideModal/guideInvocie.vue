<template>
  <div>
    <Modal v-model="dialog" class="main" title="订单支付成功" footer-hide>
      <div class="content">
        可在订单列表补充发票信息
      </div>
      <div class="footer-box">
        <Button class="close-btn" @click="dialog = false">取消</Button>
        <Button class="check-btn" @click="goPrizePage">完善开票信息</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'GuideInvocie',
  props: {
    value: Boolean,
    onOk: Function
  },
  data() {
    return {};
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
  },
  created() {},
  methods: {
    goPrizePage() {
      this.dialog = false;
      this.$parent.drawIncideShow = true;
      this.$emit('onOk')
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  /deep/ .ivu-modal-content {
    border-width: 0px;
    position: absolute;
    left: 0px;
    top: 0px;
    width: 384px;
    height: 218px;
    background: inherit;
    background-color: rgba(255, 255, 255, 1);
    border: none;
    border-radius: 9px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-radius: 10px;
    .ivu-modal-header {
      background: none !important;
      border-bottom: 0px solid #e8eaec;
      text-align: center;
    }
  }

  .content {
    padding: 15px;
  }
}
.footer-box {
  text-align: center;
  margin-top: 43px;
  .check-btn {
    background-color: rgba(0, 163, 255, 1);
    color: #ffffff;
    width: 115px;
    height: 37px;
  }
  .close-btn {
    width: 82px;
    height: 37px;
  }
}
</style>
