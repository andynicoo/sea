<template>
  <div class="saleDetail">
    <div class="header-container">
      <div class="header-wrapper">
        <div class="status-wrapper">
          <el-link :underline="false" type="info" @click="goBack">
            <i class="el-icon-arrow-left"></i>
            返回列表
          </el-link>
          <div class="status">{{ productInfoVO | filterRefundApplyType }}</div>
        </div>
        <div class="btn-group">
          <el-button type="primary" @click="refundDialogvisible = true" size="small" v-if="orderRefund.refundStatus == 'REFUND_FAIL' || orderRefund.refundStatus == 'WAIT_REFUND'" v-show="hasAuthority('C2_12')"> 确认退款 </el-button>
          <!-- <el-button type="primary" @click="oldRefundDialogvisible = true" size="small" v-if="(orderRefund.refundStatus == 'REFUND_FAIL' || orderRefund.refundStatus == 'WAIT_REFUND') && supportOffLineRefundFlag" v-show="hasAuthority('C2_12')"> 确认退款 </el-button> -->

          <el-button type="primary" @click="modifyAccountVisible = true" size="small" v-if="orderRefund.refundStatus == 'WAIT_REFUND'" v-show="hasAuthority('C2_49')"> 修改退款信息 </el-button>
          <el-button type="primary" @click="showModifyDrawerVisible" size="small" v-if="orderRefund.refundStatus == 'AUDIT_FAIL'" v-show="hasAuthority('C2_31')"> 修改 </el-button>
          <el-button @click="cancel" size="small" v-if="orderRefund.refundStatus == 'WAIT_AUDIT' || orderRefund.refundStatus == 'WAIT_REFUND' || orderRefund.refundStatus == 'AUDIT_FAIL'" v-show="hasAuthority('C2_10')"> 取消 </el-button>
        </div>
      </div>

      <div class="status-title-wrap">
        <span>当前订单状态：</span><span> {{ orderRefund.refundStatus | filterStatus }}</span>
      </div>

      <div class="border-box">
        <div class="tittle">
          <el-divider direction="vertical"></el-divider>
          <span class="text-info zt-mr-2">基础信息</span>
          <img src="@/assets/icons/pay-guojidetail.svg" alt="国际支付" title="国际支付" class="payicon" v-if="orderRefund.payMethod === 'INTL_PAY'" />
          <img src="@/assets/icons/pay-guoneidetail.svg" alt="国内支付" title="国内支付" class="payicon" v-else />
        </div>

        <el-descriptions title="" direction="vertical" border :column="8">
          <el-descriptions-item label="退款订单号">{{ orderRefund.refundNo }}</el-descriptions-item>
          <el-descriptions-item label="退款类型">{{ orderRefund.refundApplyType | filterRefundApplyType }}</el-descriptions-item>
          <el-descriptions-item label="总商品售价">￥{{ orderRefund.productPaidMoney | formatQianFenWei }}</el-descriptions-item>
          <el-descriptions-item label="总实付金额">￥{{ orderRefund.productPaidMoney | formatQianFenWei }}</el-descriptions-item>
          <el-descriptions-item label="总手续费">￥{{ orderRefund.refundPoundage | formatQianFenWei }}</el-descriptions-item>
          <el-descriptions-item label="总申请退款金额" v-if="orderRefund.payMethod === 'CHN_PAY'">￥{{ orderRefund.refundMoney | formatQianFenWei }}</el-descriptions-item>
          <el-descriptions-item label="总申请退款金额" v-else
            >￥{{ orderRefund.refundMoney | formatQianFenWei }} <span class="zt-ml-2">{{ orderRefund.currencySymbol }}{{ floor(divide(orderRefund.refundMoney, orderRefund.exRate),2) }}</span> <span class="zt-ml-2">汇率：{{ orderRefund.exRate }}</span></el-descriptions-item
          >
          <el-descriptions-item label="总第三方手续费">￥{{ orderRefund.thirtyPoundage | formatQianFenWei }}</el-descriptions-item>
          <el-descriptions-item label="总退款成功金额">￥{{ (orderRefund.refundStatus == 'REFUNDED' ? orderRefund.refundMoney : 0) | formatQianFenWei }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="border-box">
        <div class="tittle">
          <el-divider direction="vertical"></el-divider>
          <span class="text-info">退款商品信息</span>
        </div>
        <el-table :data="productList" :span-method="objectSpanMethod" border style="width: 100%; margin-bottom: 20px">
          <!-- <el-table-column prop="refundNo" label="退款订单号" align="center"></el-table-column> -->
          <el-table-column prop="productName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="productPaymentMoney" label="商品售价" align="center">
            <template slot-scope="scope">￥{{ scope.row.productPaymentMoney | formatQianFenWei }}元</template>
          </el-table-column>
          <el-table-column label="商品实付金额" align="center" prop="productPaidMoney">
            <template slot-scope="scope"> ￥{{ scope.row.productPaidMoney | formatQianFenWei }}元 </template>
          </el-table-column>

          <!-- <el-table-column prop="refundApplyType" label="退款类型" align="center">
            <template slot-scope="scope">
              {{ scope.row.refundApplyType | filterRefundApplyType }}
            </template>
          </el-table-column> -->

          <!-- <template v-if="orderRefund.refundType === 'ORDER'">

          </template> -->
          <!-- <el-table-column prop="productPaymentMoney" label="开票金额" align="center" v-if="orderRefund.refundType === 'INVOICE'">
            <template slot-scope="scope">￥{{ scope.row.productPaymentMoney | formatQianFenWei }}元</template>
          </el-table-column> -->

          <el-table-column prop="productRefundPoundage" label="平台手续费" align="center">
            <template slot-scope="scope"> ￥{{ scope.row.productRefundPoundage | formatQianFenWei }} </template>
          </el-table-column>
          <el-table-column prop="refundMoney" label="退款金额" align="center">
            <template slot-scope="scope">￥{{ scope.row.refundMoney | formatQianFenWei }}</template>
          </el-table-column>

          <el-table-column prop="refundSuccessMoney" label="退款成功金额" align="center">
            <template slot-scope="scope">￥{{ (orderRefund.refundStatus == 'REFUNDED' ? scope.row.refundMoney : 0) | formatQianFenWei }}</template>
          </el-table-column>

          <el-table-column prop="specsName" label="服务项目" align="center"> </el-table-column>
          <el-table-column prop="countryName" label="国家" align="center"></el-table-column>
          <el-table-column prop="serviceCompanyName" label="服务公司名称" align="center"></el-table-column>
          <el-table-column prop="serviceNo" label="服务号" align="center"></el-table-column>
        </el-table>
      </div>

      <div class="border-box">
        <div class="tittle">
          <el-divider direction="vertical"></el-divider>
          <span class="text-info">退款方式</span>
        </div>
        <el-descriptions :colon="false" :column="4" :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }">
          <el-descriptions-item label="退款路径："> {{ orderRefund.refundMethod | filterRefundMethod }}</el-descriptions-item>
          <el-descriptions-item label="退款银行：">{{ orderRefund.refundBank }}</el-descriptions-item>
          <el-descriptions-item label="退款账号：">{{ orderRefund.refundAccount }}</el-descriptions-item>

          <el-descriptions-item label="开户支行：">{{ orderRefund.bankBranch }}</el-descriptions-item>
          <el-descriptions-item label="收款人姓名：">{{ orderRefund.refundPayee }}</el-descriptions-item>
          <el-descriptions-item label="省 市：">{{ orderRefund.province }} {{ orderRefund.city }}</el-descriptions-item>
          <el-descriptions-item label="退款原因分类：">
            {{ orderRefund.refundReasonType }}
          </el-descriptions-item>
          <el-descriptions-item label="退款原因：">{{ orderRefund.refundReason }}</el-descriptions-item>
          <el-descriptions-item label="未扣除手续费原因：">{{ orderRefund.noPoundageReason }}</el-descriptions-item>

          <el-descriptions-item label="退款凭证：">
            <div v-if="orderRefund.refundCertificate && orderRefund.refundCertificate.length">
              <div class="block-img" v-for="(img, i) in orderRefund.refundCertificate" :key="i">
                <el-image v-if="$util.isImage(img)" :src="img" :preview-src-list="orderRefund.refundCertificate"></el-image>
                <el-link class="file-link" v-else type="primary" target="_blank" :href="img.replace('http://', 'https://')">
                  {{ img }}
                </el-link>
              </div>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="border-box">
        <div class="tittle">
          <el-divider direction="vertical"></el-divider>
          <span class="text-info">钉钉审批信息</span>
        </div>
        <el-descriptions :colon="false" :column="4" :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }">
          <el-descriptions-item label="钉钉审批编号：">{{ orderRefund.dingDingBusinessId }}</el-descriptions-item>
          <el-descriptions-item label="钉钉审批状态："
            >{{ orderRefund.dingDingStatus | filterAuditStatus }}
            <el-tooltip effect="dark" content="重新加载钉钉状态" placement="top" v-if="orderRefund.dingDingStatus == ''">
              <el-link type="primary" :underline="false" @click="reloadState" icon="el-icon-refresh"></el-link>
            </el-tooltip>
            <el-link type="primary" :underline="false" @click="dingDrawerVisible = true"> 查看审批详情 </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="钉钉审批结果：">{{ orderRefund.dingDingResult | filterAuditResult }} </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="border-box">
        <div class="tittle">
          <el-divider direction="vertical"></el-divider>
          <span class="text-info">销售订单信息</span>
        </div>
        <el-descriptions :labelStyle="{ color: '#999999' }" :contentStyle="{ color: '#666666' }" :column="4">
          <el-descriptions-item label="销售订单号">{{ orders.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="销售人员">{{ orders.attributionName }}</el-descriptions-item>
          <el-descriptions-item label="应付金额">￥{{ orders.orderPaymentMoney | formatQianFenWei }}元</el-descriptions-item>
          <el-descriptions-item label="实付金额">￥{{ orders.orderPaidMoney | formatQianFenWei }}元</el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ orders.paymentChannel }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ orders.createTime }}</el-descriptions-item>
          <el-descriptions-item label="付款时间">{{ orders.paymentTime }}</el-descriptions-item>
          <el-descriptions-item label="到账时间">{{ orders.arrivalTime }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions>
          <el-descriptions-item label="付款凭证">
            <span v-if="orders.paymentFile && orders.paymentFile.length">
              <div class="block-img" v-for="(img, i) in orders.paymentFile" :key="i">
                <el-image :src="img" :preview-src-list="orders.paymentFile"></el-image>
              </div>
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="border-box">
        <div class="tittle">
          <el-divider direction="vertical"></el-divider>
          <span class="text-info">操作记录</span>
        </div>
        <OrderRecord :activities="activities"></OrderRecord>
      </div>
    </div>

    <!-- 审核退款弹窗 -->
    <!-- <AuditDialog :auditDialogvisible.sync="auditDialogvisible" :id="id" @refresh="getInfo"></AuditDialog> -->
    <!-- 确认退款弹窗 -->
    <RefundDialog :refundDialogvisible.sync="refundDialogvisible" :order="orderRefund" :orders="orders" :productList="productList" :id="id" @getParentFn="getInfo"></RefundDialog>
    <!-- <OldRefundDialog :refundDialogvisible.sync="oldRefundDialogvisible" :order="orderRefund" :productList="productList" :id="id" @getParentFn="getInfo"></OldRefundDialog> -->
    <!-- 修改 -->
    <ModifyDrawer :orders="orders" :modifyDrawerVisible.sync="modifyDrawerVisible" :selRefundList="selRefundList" :supportReturnSourceFlag="supportReturnSourceFlag" :orderRefund="orderRefund" :productList="productList" :id="id" :orderId="orders.orderId" @refresh="getInfo"> </ModifyDrawer>

    <ModifyAccount :modifyAccountVisible.sync="modifyAccountVisible" :supportReturnSourceFlag="supportReturnSourceFlag" :orderRefund="orderRefund" :id="id" :orderId="orders.orderId" @refresh="getInfo"> </ModifyAccount>
    <DingDrawer :dingDrawerVisible.sync="dingDrawerVisible" :processInstanceId="orderRefund.processInstanceId" />
  </div>
</template>

<script>
import { refundOrderInfo, cancelRefund, applyOrderRefund, reloadDingApprovalStatusApi } from '@/api/newApi/orderManage/refundOrder';
import RefundDialog from './components/refundDialog.vue';
import ModifyDrawer from './components/modifyDrawer.vue';
import DingDrawer from './components/dingDrawer.vue';
import ModifyAccount from './components/modifyAccount.vue';
// import Steps from "./components/Steps.vue";
import activities from '@/view/module/workOrder/mixin/operationLog';

import OrderRecord from '@/components/OrderRecord'; // 操作记录
import { divide,floor } from 'lodash';

export default {
  data() {
    return {
      divide,
      floor,
      // auditDialogvisible: false,
      refundDialogvisible: false,
      // oldRefundDialogvisible: false,
      modifyDrawerVisible: false,
      modifyAccountVisible: false,
      supportOffLineRefundFlag: false,
      supportReturnSourceFlag: false,
      dingDrawerVisible: false,
      id: this.$route.query.id,
      orderRefund: {},
      productInfoVO: {},
      orders: {},
      refundObj: {},
      productList: [],
      otherObj: {},
      selRefundList: [],
      auditor: [], //审核人
      payee: [], //收款
      editor: [],
      activities: [],
    };
  },
  components: {
    // AuditDialog,
    RefundDialog,
    ModifyDrawer,
    ModifyAccount,
    // OldRefundDialog,
    // Steps,
    DingDrawer,
    OrderRecord,
  },
  mixins: [activities],
  computed: {
    // isInvoice() {
    //   return this.orderRefund.refundType === 2
    // },
    // refundKind() {
    //   // 1：微信 2：支付宝 3：银联
    //   // 如果为手工录单，退款方式为银联
    //   if (this.orders.orderSource === 3) {
    //     return 3;
    //   }
    //   return this.orders.paymentChannel;
    // },
  },
  filters: {
    filterStatus(val) {
      switch (val) {
        case 'WAIT_AUDIT':
          return '审批中';
        case 'WAIT_REFUND':
          return '审批通过';
        case 'REFUNDED':
          return '已退款';
        case 'AUDIT_FAIL':
          return '审批不通过';
        case 'CANCEL':
          return '已取消';
        case 'REFUND_FAIL':
          return '退款失败';
        case 'REFUNDING':
          return '退款中';
        case 'UNREFUND':
          return '无需退款';
        default:
          return '';
      }
    },
    filterRefundApplyType(type) {
      switch (type) {
        case 'ONLY_REFUND':
          return '仅退款';
        case 'REFUND_CANCEL_SERVICE':
          return '退款并取消服务';
        case 'ONLY_CANCEL_SERVICE':
          return '仅取消服务';
        default:
          return type;
      }
    },
    // 审批状态
    filterAuditStatus(status) {
      let result = status;
      switch (status) {
        case 'NEW':
          result = '新创建';
          break;
        case 'RUNNING':
          result = '审批中';
          break;
        case 'TERMINATED':
          result = '被终止';
          break;
        case 'COMPLETED':
          result = '完成';
          break;
        case 'CANCELED':
          result = '取消';
          break;
      }
      return result;
    },
    // 审批结果
    filterAuditResult(result) {
      let resultStr = result;
      switch (result) {
        case 'agree':
          resultStr = '同意';
          break;
        case 'refuse':
          resultStr = '拒绝';
          break;
      }
      return resultStr;
    },
    // 退款路径
    filterRefundMethod(refundMethod) {
      let result = refundMethod;
      switch (refundMethod) {
        case 'RETURN_TO_SOURCE':
          result = '原路返回';
          break;
        case 'RETURN_TO_BANK':
          result = '退回到银行卡';
          break;
        case 'COUPON':
          result = '发放优惠券';
          break;
        case 'VIRTUAL':
          result = '虚拟退款';
          break;
      }
      return result;
    },
  },

  created() {
    this.getInfo();
  },
  methods: {
    goBack() {
      this.$router.push('/refundorder/index');
    },
    objectSpanMethod({ row, column }) {
      let combineList = ['productName', 'productPaymentMoney', 'productPaidMoney', 'refundPoundage', 'refundMoney', 'refundSuccessMoney', 'productRefundPoundage'];
      if (combineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    getInfo() {
      refundOrderInfo({
        id: this.id,
      }).then((res) => {
        let result = res.data;
        result.orderRefund.auditFile = result.orderRefund.auditFile.split(',').filter((i) => i);
        result.orderRefund.refundCertificate = result.orderRefund.refundCertificate.split(',').filter((i) => i);
        this.orderRefund = result.orderRefund;
        result.orders.paymentFile = result.orders.paymentFile.split(',').filter((i) => i);
        this.orders = result.orders;
        this.refundObj = result;
        this.supportOffLineRefundFlag = result.supportOffLineRefundFlag;
        this.supportReturnSourceFlag = result.supportReturnSourceFlag;
        // result.productInfoVO.thirtyPoundage = result.orderRefund.thirtyPoundage;
        // this.productList = [result.productInfoVO];
        this.formatListData(result.orderRefundProductInfo);
        // result.productList.forEach(item => {
        //   try {
        //     item.pcProductImgUrl = JSON.parse(item.pcProductImgUrl);
        //   } catch (error) {
        //     // item.pcProductImgUrl = [];
        //   }
        // });
        // this.productList = result.productList;
        this.productInfoVO = result.productInfoVO;
        this.formatRefundList(result.orderRefundProductInfo);
        this.getOperationLog(this.orders.orderNo, 1);
      });
    },
    formatListData(orderRefundProductInfo) {
      let list = [];
      orderRefundProductInfo.forEach((item) => {
        item.orderProductDetail.forEach((detail, i) => {
          list.push({
            ...detail,
            rowspan: item.orderProductDetail.length,
            index: i,
            ...item,
          });
        });
      });
      this.productList = list;
    },
    formatRefundList(orderRefundProductInfo) {
      let list = [];
      orderRefundProductInfo.forEach((item) => {
        let itemobj = {
          productPaidMoney: item.productPaidMoney,
          specsName: '',
          specsNameTip: '',
          orderProductId: item.orderProductId,
          productName: item.productName,
          refundMoney: item.refundMoney,
          refundPoundage: item.productRefundPoundage,
        };
        item.orderProductDetail.forEach((detail, i) => {
          itemobj.specsName = itemobj.specsName == '' ? itemobj.specsName + detail.specsName : itemobj.specsName + ';\n' + detail.specsName;
          itemobj.specsNameTip = itemobj.specsName + '(' + detail.serviceNo + ')';
        });
        list.push(itemobj);
      });
      this.selRefundList = list;
    },
    showModifyDrawerVisible() {
      this.modifyDrawerVisible = true;
    },
    cancel() {
      this.$confirm('确定取消？', '取消提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        cancelRefund(this.id).then((res) => {
          if (res.code === 0) {
            this.$message.success('已取消退款');
            this.getInfo();
          }
        });
      });
    },
    reloadState() {
      reloadDingApprovalStatusApi({ processInstanceId: this.orderRefund.processInstanceId }).then((res) => {
        if (res.code === 0) {
          this.$message.success('刷新成功');
          this.getInfo();
        }
      });
    },
    // auditDialog(){
    //   // if (this.orderRefund.dingDingBusinessId == '') return this.$message.error("审批编号不允许为空！");
    //   // if (this.orderRefund.auditFile && this.orderRefund.auditFile.length == 0) return this.$message.error("审批流凭证不允许为空！");
    //   this.auditDialogvisible = true;
    // },
    // refundConfirm() {
    //   this.$confirm("确认对该订单进行虚拟退款？", "确认退款", {
    //     customClass: "custom-confirm",
    //     type: "warning",
    //     center: true
    //   }).then(() => {
    //     applyOrderRefund({
    //       id: this.orderRefund.id
    //     }).then(res => {
    //       this.$message.success("退款成功");
    //       this.getInfo()
    //     })
    //   });
    // }
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-table .el-table__header th {
  background: #f6f6f6 !important;
}
::v-deep .el-descriptions-row {
  vertical-align: baseline;
}
.saleDetail {
  .header-container {
    padding: 20px;
    background-color: #fff;
    .tittle {
      display: flex;
      align-items: center;
      margin: 15px 0 15px -20px;
      font-size: 14px;
    }
    .border-box {
      margin: 30px 0;
      padding: 0px 25px;
      overflow: hidden;
      .order {
        font-size: 14px;
        margin: 20px 0;
      }
    }
    .btn-group {
      float: right;
    }
    .left {
      float: left;
      width: 60%;
    }
    .right {
      float: right;
      width: 40%;
    }
  }
  .block-img {
    width: 146px;
    height: 78px;
    margin-right: 10px;
    cursor: zoom-in;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }

  .check-btn {
    width: 100% !important;
    text-align: right !important;
    border-top: 1px solid #ccc;
  }
}
.file-link {
  display: -webkit-box;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .status-wrapper {
    display: flex;
    align-items: center;
    .status {
      color: #1890ff;
      padding-left: 28px;
      position: relative;
      font-size: 14px;
      &::before {
        position: absolute;
        content: '';
        width: 2px;
        height: 14px;
        background-color: #1890ff;
        top: 50%;
        transform: translateY(-50%);
        left: 16px;
      }
    }
  }
}

.status-title-wrap {
  background: #e4e4e4;
  height: 36px;
  line-height: 36px;
  margin: 20px 0 10px 10px;
  padding: 0 10px;
}

/deep/ .orderlist {
  padding: 0;
}
</style>
