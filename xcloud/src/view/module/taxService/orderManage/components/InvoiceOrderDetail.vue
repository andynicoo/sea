<template>
  <div>
    <div class="invoiceOrderDetail" v-if="!isDetailShow">
      <div class="goBack" @click="goBack">
        <Card>返回列表</Card>
      </div>
      <div class="head">
        <span>开票信息</span>
        <Button
          type="primary"
          v-if="rowData.from == 'invoiceList' && invoiceInfo.status != 3"
          @click="invoiceModal = true"
          >上传发票</Button
        >
      </div>
      <Divider />
      <table class="table">
        <tbody v-if="invoiceInfo.invoiceType == 2">
          <tr>
            <td>公司名称：{{ invoiceInfo.companyName }}</td>
            <td>纳税识别号：{{ invoiceInfo.taxIdentificationNumber }}</td>
          </tr>
          <tr>
            <td>公司地址：{{ invoiceInfo.companyAddress }}</td>
            <td>公司电话：{{ invoiceInfo.companyTel }}</td>
          </tr>
          <tr>
            <td>开户银行：{{ invoiceInfo.openingBank }}</td>
            <td>开户账号：{{ invoiceInfo.bankAccount }}</td>
          </tr>
          <tr>
            <td>
              查看发票：<a
                :href="invoiceInfo.invoiceFile"
                target="_blank"
                v-if="invoiceInfo.invoiceFile"
                >发票文件</a
              >
            </td>
            <td></td>
          </tr>
        </tbody>
        <template
          v-if="invoiceInfo.invoiceType == 1 && invoiceInfo.subjectType == 1"
        >
          <tr>
            <td>名字：{{ invoiceInfo.name }}</td>
            <td>身份证号码：{{ invoiceInfo.idNumber }}</td>
          </tr>
        </template>
        <template
          v-if="invoiceInfo.invoiceType == 1 && invoiceInfo.subjectType == 2"
        >
          <tr>
            <td>公司名称：{{ invoiceInfo.companyName }}</td>
            <td>纳税识别号：{{ invoiceInfo.taxIdentificationNumber }}</td>
          </tr>
        </template>
        <tr>
          <td>
            查看发票：<a
              :href="invoiceInfo.invoiceFile"
              target="_blank"
              v-if="invoiceInfo.invoiceFile"
              >发票文件</a
            >
          </td>
          <td></td>
        </tr>
      </table>

      <div class="head" style="margin-top:20px;">
        <span>订单信息</span>
      </div>
      <Divider />
      <Table border :columns="columns" :data="tableData">
        <template slot="status" slot-scope="{ row }">
          <span>{{
            row.status == "0"
              ? "待付款"
              : row.status == "1"
              ? "付款待确认"
              : row.status == "2"
              ? "已付款"
              : row.status == "3"
              ? "已取消"
              : row.status == "4"
              ? "部分付款"
              : row.status == "5"
              ? "部分退款"
              : row.status == "6"
              ? "全额退款"
              : row.status == "8"
              ? "待审核"
              : row.status == "10"
              ? "订单驳回"
              : ""
          }}</span>
        </template>
        <template slot="operation" slot-scope="{ row, index }">
          <p
            class="btnClass"
            v-if="row.orderForm == 0 || rowData.from == 'invoiceList'"
            @click="goOrderDetail(row)"
          >
            查看
          </p>
        </template>
      </Table>
      <table class="table" style="margin-top:20px;">
        <tbody>
          <tr>
            <td>用户昵称：{{ orderInfo.userNickname }}</td>
            <td>手机号：{{ orderInfo.userMobile }}</td>
          </tr>
          <tr>
            <td>用户级别：{{ orderInfo.openingBank }}</td>
            <td>电子邮箱：{{ orderInfo.userEmail }}</td>
          </tr>
          <tr>
            <td>开票订单创建时间：{{ invoiceInfo.createTime }}</td>
            <td>开票订单付款时间：{{ invoiceInfo.updateTime }}</td>
          </tr>
          <tr>
            <td>开票订单到账时间：{{ invoiceInfo.gatheringTime }}</td>
            <td>
              开票订单付款凭证：<a
                :href="invoiceInfo.paymentProof"
                target="_blank"
                >付款凭证</a
              >
            </td>
          </tr>
          <tr>
            <td>开票订单状态：{{ statusList[invoiceInfo.status] }}</td>
            <td>开票订单金额：{{ invoiceInfo.makeInvoiceMoney }}</td>
          </tr>
          <tr>
            <td>申请开票金额：{{ invoiceInfo.amountMoney }}</td>
            <td style="font-weight:600;font-size:16px">财务最终开票金额：{{ invoiceInfo.makeInvoiceMoney + invoiceInfo.amountMoney}} {{ '（' + invoiceInfo.amountMoney + '+' + invoiceInfo.makeInvoiceMoney + '）'}}</td>
          </tr>
        </tbody>
      </table>
      <Modal v-model="invoiceModal" title="上传发票">
        <Upload
          ref="taxFile"
          type="drag"
          :action="fileUpload"
          :data="{ prefix: '' }"
          :before-upload="beroreTaxUpload"
          :on-success="taxUploadSuccess"
          :on-remove="removetax"
          style="width:260px"
        >
          <div style="padding: 10px 0">
            <Icon
              type="ios-cloud-upload"
              size="30"
              style="color: #3399ff"
            ></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button
            type="primary"
            ghost
            style="margin-right:20px;"
            @click="invoiceModal = false"
            >取消</Button
          >
          <Button type="primary" @click="sureUploadTax">确认</Button>
        </p>
      </Modal>
    </div>
    <OrderDetailNew
      v-if="isDetailShow && !isShowOldDetail"
      :id="detailId"
      :parentData="parentData"
      @back="isDetailShow = false"
    ></OrderDetailNew>
    <OrderDetail
      v-if="isDetailShow && isShowOldDetail"
      :id="detailId"
      :parentData="parentData"
      @back="isDetailShow = false"
    ></OrderDetail>
  </div>
</template>

<script>
import * as API from "@/api/taxService/order.js";
import * as APIInvoice from "@/api/taxService/invoice.js";
import OrderDetailNew from "./OrderDetailNew";
import OrderDetail from "./OrderDetail";
export default {
  props: ["rowData"],
  components: {
    OrderDetailNew,
    OrderDetail
  },
  data() {
    return {
      fileUpload: this.workOrderFile,
      invoiceModal: false,
      invoiceFile: "",
      statusList: ["", "待支付", "待开票", "已开票"],
      invoiceInfo: {},
      orderInfo: {},
      columns: [
        {
          title: "订单号",
          key: "orderNo"
        },
        {
          title: "服务金额  ",
          key: "payableTotalAmount"
        },
        {
          title: "实付金额",
          key: "actualAmount"
        },
        {
          title: "订单状态",
          slot: "status"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "操作",
          slot: "operation"
        }
      ],
      tableData: [],
      isShowOldDetail: "",
      isDetailShow: "",
      parentData: "",
      detailId: ""
    };
  },
  methods: {
    //返回列表
    goBack() {
      this.$emit("back");
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
    removetax(res, file, fileList) {
      this.invoiceFile = "";
    },
    // 上传发票
    sureUploadTax() {
      if (this.invoiceFile === "") {
        this.$Message.error("请上传发票");
        return;
      }
      APIInvoice.uploadInvoice({
        id: this.rowData.id,
        invoiceFile: this.invoiceFile
      })
        .then(res => {
          if (res.code == 0) {
            this.invoiceModal = false;
            this.$Message.success("发票上传成功");
            this.getDetail();
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(err => console.log(err));
    },
    //查看订单详情
    goOrderDetail(row) {
      // 后台录入查看详情看新页面，其他看旧页面
      let orderId = "";
      if (this.rowData.from == "orderList") {
        orderId = row.id;
      }
      if (this.rowData.from == "invoiceList") {
        orderId = row.orderId;
      }
      if (row.orderSource == 5) {
        this.isShowOldDetail = false;
        this.isDetailShow = true;
        this.detailId = orderId;
        this.parentData = {
          orderId: orderId
        };
      } else {
        this.isShowOldDetail = true;
        this.isDetailShow = true;
        this.detailId = orderId;
        this.parentData = {
          orderId: orderId
        };
      }
    },
    //获取详情数据
    getDetail() {
      let params;
      if (this.rowData.from == "orderList") {
        params = {
          orderId: this.rowData.id
        };
        API.orderInvoiceDetail(params)
          .then(res => {
            if (res.code == 0) {
              this.invoiceInfo = res.data.invoiceInfo;
              this.tableData = res.data.invoiceInfoItemList;
              this.orderInfo = res.data.order;
            }
          })
          .catch(err => console.log(err));
      } else if (this.rowData.from == "invoiceList") {
        params = {
          id: this.rowData.id
        };
        API.invoiceDetail(params)
          .then(res => {
            if (res.code == 0) {
              this.invoiceInfo = res.data.invoiceInfo;
              this.tableData = res.data.invoiceInfoItemList;
              this.orderInfo = res.data.order;
            }
          })
          .catch(err => console.log(err));
      }
    }
  },
  created() {
    this.getDetail();
  }
};
</script>

<style scoped lang="less">
.invoiceOrderDetail {
  .goBack {
    height: 40px;
    line-height: 40px;
    margin-bottom: 20px;
    cursor: pointer;
    /deep/ .ivu-card {
      height: 100%;
    }
    /deep/ .ivu-card-body {
      padding: 0 15px;
    }
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 14px;
  }
  .table {
    width: 100%;
    td {
      display: inline-block;
      width: 50%;
      line-height: 30px;
    }
  }

  /deep/ .ivu-divider-horizontal {
    margin: 10px 0;
  }
  .btnClass {
    cursor: pointer;
    color: #2d8cf0;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
  }
}
</style>
