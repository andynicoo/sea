<!-- 发票详情页 -->
<template>
  <div>
    <Modal v-model="dialog" class="main" title="发票详情" @on-cancel="dialog = false" footer-hide>
      <Row class="row">
        <Col span="5">开票类型</Col>
        <Col span="12">{{ incideType }}</Col>
      </Row>
      <Row class="row">
        <Col span="5">已付税额 </Col>
        <Col span="12">¥ {{ info.makeInvoiceMoney }}</Col>
      </Row>
      <div v-if="info.invoiceType == 'GENERAL'">
        <Row class="row">
          <Col span="5">{{
            info.subjectType == 'PERSON' ? '姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名' : '公司名称'
          }}</Col>
          <Col span="12">{{ info.name }}</Col>
        </Row>
        <Row class="row">
          <Col span="5">{{ info.subjectType == 'PERSON' ? '身份证号码' : '公司税号' }}</Col>
          <Col span="12">{{ info.idOrTaxNumber }}</Col>
        </Row>
      </div>
      <div v-else>
        <Row class="row">
          <Col span="5">公司名称</Col>
          <Col span="12">{{ info.name }}</Col>
        </Row>
        <Row class="row">
          <Col span="5"> 纳税识别号</Col>
          <Col span="12">{{ info.idOrTaxNumber }}</Col>
        </Row>
        <Row class="row">
          <Col span="5">公司地址</Col>
          <Col span="12">{{ info.companyAddress }}</Col>
        </Row>
        <Row class="row">
          <Col span="5">公司电话</Col>
          <Col span="12">{{ info.companyTel }}</Col>
        </Row>
        <Row class="row">
          <Col span="5"> 开户银行</Col>
          <Col span="12">{{ info.openingBank }}</Col>
        </Row>
        <Row class="row">
          <Col span="5">开户账号</Col>
          <Col span="12">{{ info.bankAccount }}</Col>
        </Row>
      </div>
      <Row class="row" v-if="info.invoiceFile !== ''">
        <Col span="5">查看发票</Col>
        <viewer :images="[info.invoiceFile]" style="width: 200px;">
          <img v-for="(src, index) in [info.invoiceFile]" :src="src" :key="index" />
        </viewer>
      </Row>
    </Modal>
  </div>
</template>
<script>
import { getInvoiceDetails } from '../../../../../../api/myOrder';
export default {
  name: 'IncideDetlie',
  props: {
    value: Boolean,
    id: String,
  },
  data() {
    return {
      info: {},
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

    incideType() {
      let {
        info: { invoiceType, subjectType },
      } = this;
      return invoiceType
        ? `${invoiceType == 'GENERAL' ? '增值税普通发票' : '增值税专用发票'}(${
            subjectType == 'PERSON' ? '个人' : '公司'
          })`
        : '';
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      let { data } = await getInvoiceDetails({ orderId: this.id });
      this.info = data;
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  .row {
    padding: 10px;
    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
