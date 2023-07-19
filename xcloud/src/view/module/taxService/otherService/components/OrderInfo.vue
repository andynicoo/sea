<template>
  <div class="workOrderAdmin">
    <Poptip
      placement="top"
      width="450"
      :transfer="true"
      @on-popper-show="queryOrderDetail"
    >
      <Button label="small">详情</Button>
      <div class="api" slot="content">
        <div class="tableBase">
          <p>订单号：{{ orderInfo.orderNo }}</p>
          <Row type="flex" class="code-row-bg">
            <Col class="rowbase" span="12">合同公司名称</Col>
            <Col class="rowbase" span="12">{{ orderInfo.companyName }}</Col>
          </Row>
          <Row type="flex" class="code-row-bg">
            <Col class="rowbase" span="12">客户</Col>
            <Col class="rowbase" span="12">{{ orderInfo.userNickname }}</Col>
          </Row>
          <Row type="flex" class="code-row-bg">
            <Col class="rowbase" span="12">手机号</Col>
            <Col class="rowbase" span="12">{{ orderInfo.userMobile }}</Col>
          </Row>
          <Row type="flex" class="code-row-bg">
            <Col class="rowbase" span="12">商品名称</Col>
            <Col class="rowbase" span="12">{{ orderInfo.productName }}</Col>
          </Row>
          <Row
            type="flex"
            class="code-row-bg"
            v-if="orderInfo.productType == 3"
          >
            <Col class="rowbase" span="12">商品价格</Col>
            <Col class="rowbase" span="12">{{ orderInfo.orderMoney }}</Col>
          </Row>
          <Row type="flex" class="code-row-bg">
            <Col class="rowbase" span="12">订单金额</Col>
            <Col class="rowbase" span="12">{{ orderInfo.orderOldMoney }}</Col>
          </Row>
          <Row type="flex" class="code-row-bg">
            <Col class="rowbase" span="12">订单来源</Col>
            <Col class="rowbase" span="12">
              {{
                orderInfo.orderSource == "0"
                  ? "PC网页端"
                  : orderInfo.orderSource == "1"
                  ? "小程序"
                  : orderInfo.orderSource == "2"
                  ? "H5端"
                  : orderInfo.orderSource == "5"
                  ? "后台录入"
                  : ""
              }}
            </Col>
          </Row>
          <Row type="flex" class="code-row-bg">
            <Col class="rowbase" span="12">所属公司</Col>
            <Col class="rowbase" span="12">
              {{
                orderInfo.companyBody == "1"
                  ? "跨税云"
                  : orderInfo.companyBody == "2"
                  ? "必胜道"
                  : orderInfo.companyBody == "3"
                  ? "卖家成长"
                  : ""
              }}
            </Col>
          </Row>
          <p>销售人员:{{ orderInfo.createName }}</p>
          <p>当前跟进人:{{ orderInfo.followUserName }}</p>
          <p>订单备注:{{ orderInfo.remark }}</p>
          <p>商品备注:{{ sendObj.remark }}</p>
        </div>
      </div>
    </Poptip>
  </div>
</template>
<script>
import { getPoptipOrderDetail } from "@/api/taxService/otherService.js";
export default {
  props: {
    sendObj: {
      type: Object
    }
  },
  data() {
    return {
      orderInfo: {}
    };
  },
  methods: {
    /**
     * 查询工单详情
     */
    queryOrderDetail() {
      getPoptipOrderDetail({
        orderNo: this.sendObj.orderNo
      })
        .then(
          res => {
            if (res.code === 0) {
              this.orderInfo = res.data[0];
            } else {
              this.$Message.warning(res.message);
            }
          },
          err => {}
        )
        .catch(error => {});
    }
  }
};
</script>
<style lang="less" scoped>
.tableBase {
  z-index: 999;
  position: relative;
  border: 1px solid #e5e5e5;
  margin-bottom: 20px;
  .rowbase {
    border: 1px solid #e5e5e5;
    padding: 5px 0;
    text-align: center;
    white-space: normal;
  }
  p {
    padding: 5px 10px;
  }
}
</style>
