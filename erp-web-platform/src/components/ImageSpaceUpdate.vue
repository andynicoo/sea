<template>
  <div class="update">
    <h2>图片空间升级</h2>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="售价" labelAlign="left">
        <b>500M</b>/10元
      </a-form-model-item>
      <a-form-model-item label="有效期" labelAlign="left">
        30天
      </a-form-model-item>
      <a-form-model-item label="购买数量" labelAlign="left">
        <a-input-number id="inputNumber" v-model="form.month" :min="1" />月
      </a-form-model-item>
      <a-form-model-item label="支付方式" labelAlign="left">
        <a-radio-group v-model="form.payType">
          <a-radio value="wangbi">
            旺币
          </a-radio>
          <a-radio value="ali">
            支付宝
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
    </a-form-model>
    <a-button type="primary" class="paybutton">
      立即支付10元
    </a-button>
  </div>
</template>
<script>
export default {
  props: {},
  mounted() {},
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      form: {
        month: 1,
        payType: 'wangbi'
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.update {
  h2 {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #303133;
    line-height: 22px;
    margin-bottom: 10px;
  }
  .ant-form-item {
    margin-bottom: 15px;
  }
  .paybutton {
    width: 312px;
    height: 40px;
  }
}
</style>
