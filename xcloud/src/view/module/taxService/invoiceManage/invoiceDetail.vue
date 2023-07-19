<template>
  <div class="invoiceDetail">
    <div class="back"
         @click="goBack()">
      <Icon type="md-arrow-back" />返回列表</div>
    <div class="orderDetailInfo">
      <div class="titleBox">
        <span class="title">开票信息</span>
        <Button type="primary"
                v-show="hasAuthority('upload_invoice_xq')"
                v-if="invoiceInfo.status === 2"
                @click="uploadInvoic">上传发票</Button>
      </div>
      <div class="basicInfoBox"
           v-if="invoiceInfo.companyName !== ''">
        <Row class="rowItem">
          <Col span="4">公司名称：</Col>
          <Col span="4">{{invoiceInfo.companyName || '暂无'}}</Col>
          <Col span="4">纳税识别号：</Col>
          <Col span="4">{{invoiceInfo.taxIdentificationNumber || '暂无'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">公司地址：</Col>
          <Col span="4">{{invoiceInfo.companyAddress || '暂无'}}</Col>
          <Col span="4">公司电话：</Col>
          <Col span="4">{{invoiceInfo.companyTel || '暂无'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">开户银行：</Col>
          <Col span="4">{{invoiceInfo.openingBank || '暂无'}}</Col>
          <Col span="4">开户账号：</Col>
          <Col span="4">{{invoiceInfo.bankAccount || '暂无'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">查看发票：</Col>
          <Col span="4">
          <a :href="invoiceInfo.invoiceFile"
             target="_blank"
             v-if="invoiceInfo.invoiceFile">查看发票</a>
          <span v-else>暂无</span>
          </Col>
        </Row>
      </div>
      <div class="basicInfoBox"
           v-else>
        <Row class="rowItem">
          <Col span="4">名字：</Col>
          <Col span="4">{{invoiceInfo.name || '暂无'}}</Col>
          <Col span="4">身份证号码：</Col>
          <Col span="4">{{invoiceInfo.idNumber || '暂无'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">查看发票：</Col>
          <Col span="4">
          <a :href="invoiceInfo.invoiceFile"
             target="_blank"
             v-if="invoiceInfo.invoiceFile">查看发票</a>
          <span v-else>暂无</span>
          </Col>
        </Row>
      </div>
      <div class="titleBox">
        <span class="title">订单信息</span>
      </div>
      <div class="basicInfoBox">
        <Row class="rowItem">
          <Col span="4">订单号：</Col>
          <Col span="4">{{orderDetailInfo.orderNo}}</Col>
          <Col span="4">订单状态：</Col>
          <Col span="4">{{orderDetailInfo.status == '0' ? "待付款" : orderDetailInfo.status == '1' ? "付款待确认" : orderDetailInfo.status == '2' ? "已付款" : orderDetailInfo.status == '3' ? "已取消" : orderDetailInfo.status == '4' ? '部分付款' : orderDetailInfo.status == '5' ? '部分退款' : orderDetailInfo.status == '6' ? '全额退款' : '' }}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">用户昵称：</Col>
          <Col span="4">{{orderDetailInfo.userNickname || "暂无"}}</Col>
          <Col span="4">手机号：</Col>
          <Col span="4">{{orderDetailInfo.userMobile}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">用户级别：</Col>
          <Col span="4">{{orderDetailInfo.userType == 0 ? "普通用户" : '其他'}}</Col>
          <Col span="4">电子邮箱：</Col>
          <Col span="4">{{orderDetailInfo.userEmail}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">订单金额：</Col>
          <Col span="4">{{orderDetailInfo.orderOldMoney}}</Col>
          <Col span="4">优惠金额：</Col>
          <Col span="4">{{orderDetailInfo.discAmount}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">应付金额：</Col>
          <Col span="4">{{orderDetailInfo.orderMoney}}</Col>
          <Col span="4">订单来源:</Col>
          <Col span="4">{{orderDetailInfo.orderSource == '0' ? "PC网页端" : ""}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">实付金额：</Col>
          <Col span="4">{{orderDetailInfo.amountMoney}}</Col>
          <Col span="4">支付渠道:</Col>
          <Col span="4">{{orderDetailInfo.paymentChannel == '0' ? "未知" :orderDetailInfo.paymentChannel == '1' ? "微信扫码支付" :orderDetailInfo.paymentChannel == '2' ? "支付宝PC端支付" :orderDetailInfo.paymentChannel == '3' ? "银联" :orderDetailInfo.paymentChannel == '4' ? "微信小程序支付" : ""}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">创建时间：</Col>
          <Col span="4">{{orderDetailInfo.createTime}}</Col>
          <Col span="4">付款时间：</Col>
          <Col span="4">{{orderDetailInfo.paymentTime}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">到账时间：</Col>
          <Col span="4">{{orderDetailInfo.gatheringTime || '暂无'}}</Col>
          <Col span="4">付款凭证：</Col>
          <Col span="4"
               v-if="orderDetailInfo.paymentFile">
          <a v-if="orderDetailInfo.paymentFile!==''"
             :href="orderDetailInfo.paymentFile "
             target="_blank">{{'付款凭证'}}</a>
          <span v-if="orderDetailInfo.paymentFile==''">{{'暂无'}}</span>
          </Col>
        </Row>
        <Row class="rowItem">
          <Col span="4">订单归属：</Col>
          <Col span="4">{{orderDetailInfo.followUserName || '暂无'}}</Col>
          <Col span="4">开票金额：</Col>
          <Col span="4">{{orderDetailInfo.invoiceMoney || '暂无'}}</Col>
        </Row>
      </div>
    </div>
    <Modal v-model="invoiceModal"
           title="上传发票">
      <Upload ref="taxFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreTaxUpload"
              :on-success="taxUploadSuccess"
              :on-remove="removetax"
              style="width:260px">
        <div style="padding: 10px 0">
          <Icon type="ios-cloud-upload"
                size="30"
                style="color: #3399ff"></Icon>
          <span>请拖拽文件到此区域上传或点击上传</span>
        </div>
      </Upload>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="invoiceModal=false">取消</Button>
        <Button type="primary"
                @click="sureUploadTax">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/taxService/invoice.js';
export default {
  name: 'orderDetail',
  props: ['id'],
  data() {
    return {
      orderDetailInfo: {},
      invoiceInfo: {},
      listTotal: 0,
      invoiceModal: false,
      tableData: [],
      tableLoading: false,
      fileUpload: this.workOrderFile,
      invoiceFile: '',
    }
  },
  mounted() {
    this.getOrderDetail();
  },
  watch: {
    $route(to, from) {
      if (to.path === '/orderDetail') {
        this.getOrderDetail();
      }
    }
  },
  methods: {
    //返回列表
    goBack() {
      this.$emit('back')
    },
    //详情信息
    getOrderDetail() {
      this.tableLoading = true;
      API.getInvoiceDetail({
        id: this.id
      }).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.invoiceInfo = res.data.invoiceInfo
          this.orderDetailInfo = res.data.order
        } else {
          this.$Message.warning(res.message);
        }
      })
        .catch((err) => console.log(err))
    },
    uploadInvoic() {
      this.invoiceModal = true
    },
    //发票上传之前
    beroreTaxUpload() {
      let self = this;
      const check = self.invoiceFile == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    //发票上传成功
    taxUploadSuccess(res, file, fileList) {
      this.invoiceFile = res.data.fileUrl;
    },
    //移除发票
    removetax(file, fileList) {
      this.invoiceFile = '';
    },
    sureUploadTax() {
      if (this.invoiceFile === '') {
        this.$Message.error('请上传发票')
        return
      }
      API.uploadInvoice({
        id: this.id,
        invoiceFile: this.invoiceFile
      }).then(res => {
        if (res.code == 0) {
          this.invoiceModal = false
          this.$Message.success('发票上传成功')
          this.getOrderDetail();
          this.$emit('refresh')
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    }
  },
}
</script>
<style lang="less" scoped>
.invoiceDetail {
  background: #ffffff;
  padding: 0px 20px;
  .back {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    width: 100px;
  }
  /deep/ .serviceInfo {
    .title {
      font-size: 16px;
      font-weight: 700;
      padding-left: 10px;
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #ccc;
    }
    .ivu-btn {
      float: right;
    }
  }
  .orderDetailInfo {
    .titleBox {
      display: flex;
      justify-content: space-between;
      height: 36px;
      line-height: 36px;
      border-bottom: 1px solid #ccc;
      .title {
        font-size: 16px;
        font-weight: 700;
      }
    }
    .basicInfoBox {
      padding: 20px;
      .rowItem {
        margin-bottom: 10px;
      }
    }
  }
}
/deep/ .serviceList {
  .ivu-table td {
    border-right: 1px solid #e8eaec;
  }
}
</style>