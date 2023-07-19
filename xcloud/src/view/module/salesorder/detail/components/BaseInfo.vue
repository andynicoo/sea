<template>
  <div id="salesOrderBaseInfo">
    <el-link :underline="false" type="info" @click="goBack">
      <i class="el-icon-arrow-left"></i>
      返回
    </el-link>
    <div class="actionButton">
      <el-dropdown @command="(c) => this[c]()" class="zt-mr-3">
        <el-button type="primary">修改<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changeSaleman" v-show="hasAuthority('C2_17')">修改销售人员</el-dropdown-item>
          <el-dropdown-item command="changeUserMobile" v-show="hasAuthority('C2_27')">修改客户手机号</el-dropdown-item>
          <el-dropdown-item command="changeOrderRemark" v-show="hasAuthority('C2_46')">修改订单备注</el-dropdown-item>
          <!-- 待付款确认 付款被驳回 2状态显示-->
          <el-dropdown-item command="changeMoneyDialog" v-if="['PAY_WAIT_CONFIRM','PAY_REJECT'].includes(detailInfo.orderStatus)" v-show="hasAuthority('C2_55')">修改应付金额</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button size="small" v-show="hasAuthority('C2_37')" v-if="['WAIT_PAY', 'PART_PAID'].includes(detailInfo.orderStatus) && detailInfo.unPaidMoney > 0 && detailInfo.paymentTypeEn == 'PART' && !hasPaymentFile" @click="createPay"> 发起付款 </el-button>

      <!-- 待审核状态(status:12)下显示：审核-->
      <el-button size="small" @click="dialogShowObj.confirmOrderDialog = true" v-if="detailInfo.orderStatus === 'WAIT_AUDIT'" v-show="hasAuthority('C2_15')"> 审核 </el-button>
      <el-button size="small" @click="reCreate" v-if="['AUDIT_FAIL', 'CANCEL'].includes(detailInfo.orderStatus) && detailInfo.orderTypeEn !== 'EXCHANGE'" v-show="hasAuthority('C2_42')"> 重新创建 </el-button>
      <!-- 需要走合同流程且合同状态非特批不签(contractStatus:3),线下签订(contractStatus:4)才显示合同操作按钮 -->

      <el-button size="small" @click="getOrder" v-if="detailInfo.orderTypeEn !== 'EXCHANGE' && detailInfo.orderStatus === 'WAIT_AUDIT'" v-show="hasAuthority('C2_16')"> 修改订单 </el-button>
      <!-- 待审核(status:12)、部分付款(status:4)、挂账付款(paymentType:1)的付款待确认(status:1)时显示：登记款项-->

      <!-- 已付款或申请退款 且 没有开票信息 且 实付金额大于0 -->
      <el-button size="small" v-if="['PAID', 'APPLY_REFUND'].includes(detailInfo.orderStatus) && !detailInfo.invoiceStatus && detailInfo.orderPaidMoney > 0" @click="dialogShowObj.applyInvoiceDialog = true" v-show="hasAuthority('C2_18')"> 申请开票 </el-button>

      <!-- <el-button size="small" v-if="detailInfo.orderStatus == 'PAY_WAIT_CONFIRM'" @click="showAuditUploadFile = true"> 审核凭证 </el-button> -->

      <el-button size="small" @click="cancelOrder" v-if="showCancelBtn" v-show="hasAuthority('C2_28')"> 取消订单 </el-button>
      <!-- 在付款被驳回-申请取消(status:13)时显示  v-if="detailInfo.orderStatus === 'AUDIT_REJECT'" -->
    </div>
    <div class="status-title-wrap">
      <span>当前订单状态：</span><span> {{ detailInfo.orderStatus | filterName(statusList) }}</span>

      <span v-if="detailInfo.orderStatus == 'AUDIT_FAIL'" class="pay-cancel-tip">7天后会自动取消</span>
      <span style="margin-left: 30px"> 当前合同状态:{{ detailInfo.contractStatus }}</span>

      <el-tooltip class="icon fr" placement="left" popper-class="mw-350" v-if="detailInfo.orderStatus == 'WAIT_PAY' || detailInfo.orderStatus == 'PART_PAID'">
        <!-- <el-link type="primary" :underline="false" @click="showEditModal(scope.row, true)">
          <img src="@/assets/images/zt-upgrade-1/edit.svg" />
        </el-link> -->

        <div slot="content">
          如客户要求线下打款，可进入

          <el-link type="primary" :underline="false" @click="goCustomer()"> “客户管理>客户信息” </el-link>
          , 客户详情-线下打款账户”页面为客户开通指定打款账户，开通成功后可复制付款链接让客户选择"线下转账"进行支付，或则发送收款账户给客户进行打款
        </div>
        <i class="el-icon-question icon-hover"></i>
      </el-tooltip>

      <span class="fr">
        <el-button size="mini" data-clipboard-action="copy" class="cp-btn" v-if="detailInfo.orderPayUrl" :data-clipboard-text="detailInfo.orderPayUrl" @click="copyLink('.cp-btn')">付款链接（点击复制）</el-button>
        <el-button size="mini" v-show="hasAuthority('C2_40')" v-if="showOffLinePay" @click="offlinePay">线下付款</el-button>
      </span>
    </div>
    <!-- <div class="status-title-wrap warn-color" v-if="detailInfo.orderStatus == 'PAY_REJECT'">
      付款凭证审核不通过：{{ detailInfo.paymentRemark }}

      <el-link type="primary" :underline="false" @click="editVoucher" v-show="hasAuthority('C2_40')">修改凭证信息</el-link>
    </div> -->

    <div class="status-title-wrap warn-color" v-if="detailInfo.orderStatus === 'AUDIT_FAIL'">
      <span>订单审核不通过：{{ detailInfo.auditRemark }}</span>
      <el-link type="primary" :underline="false" @click="getOrder" v-if="detailInfo.orderTypeEn !== 'EXCHANGE' && detailInfo.orderStatus === 'AUDIT_FAIL'" v-show="hasAuthority('C2_16')">修改订单</el-link>
    </div>

    <div class="statusInfo">
      <div class="tittle">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">基础信息</span>
        <img src="@/assets/icons/pay-guojidetail.svg" alt="国际支付" title="国际支付" class="payicon" v-if="detailInfo.payMethod === 'INTL_PAY'" />
        <img src="@/assets/icons/pay-guoneidetail.svg" alt="国内支付" title="国内支付" class="payicon" v-else />
      </div>
      <div class="border-box">
        <div class="el-table el-table--border">
          <div class="el-table__header-wrapper basic-table">
            <!-- <BaseinfoTable thCalss="el-table__cell" divCalss="cell" :list="tableOneList" :info="detailInfo"> </BaseinfoTable> -->
            <BaseInfoTable2 :info="detailInfo" />
            <BaseinfoTable thCalss="el-table__cell" divCalss="cell" :list="tableTowList" :info="detailInfo"> </BaseinfoTable>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗组件 -->
    <dialogsence :dialogShowObj.sync="dialogShowObj" :orderPayments="orderPayments" :detailInfo="detailInfo" :balancePrice="balancePrice" :userInfo="userInfo" :isEditVoucher="isEditVoucher" :offlineStatus="offlineStatus" />
    <!-- 合同签署 -->
    <Contract v-if="dialogShowObj.signedModel" :signedModel.sync="dialogShowObj.signedModel" :detailInfo="detailInfo" />
    <!-- 审核凭证 -->
    <AuditUploadFileDialog :showAuditUploadFile.sync="showAuditUploadFile" :paymentChannelList="paymentChannelList" :detailInfo="detailInfo" />
    <!-- 修改金额 -->
    <UpdateMoneyDialog :updateMoneyDialog.sync="updateMoneyDialog" :paymentChannelList="paymentChannelList" :detailInfo="detailInfo" :orderPayments="orderPayments" />
  </div>
</template>

<script>
import dialogsence from './Dialog';
import Contract from './contract/index';
import AuditUploadFileDialog from './auditUploadFileDialog';
import UpdateMoneyDialog from './updateMoneyDialog';
import BaseinfoTable from './baseinfoTable.js';
import { CONTRACTEM } from '@/libs/contractEM.js';
import { setBainfoTableOneList, setBainfoTableTowList } from './util/baserInfoTableUtil.js';
import { revokeContractApi, contractsInvalidApi, getContractInfo, modifyOrderRemark } from '@/api/newApi/orderManage/salesorder.js';
import { getUserAccount } from '@/api/newApi/customer/customerInfo.js';
import BaseInfoTable2 from './BaseInfoTable2.vue';

export default {
  components: { dialogsence, Contract, BaseinfoTable, AuditUploadFileDialog, BaseInfoTable2, UpdateMoneyDialog },
  props: {
    detailInfo: { type: Object },
    id: { type: String },
    statusList: { type: Array },
    orderPayments: { type: Array },
    paymentChannelList: { type: Array },
    isRenewal: Boolean,
  },
  inject: ['parentFn'],
  data() {
    return {
      dialogShowObj: {
        applyInvoiceDialog: false,
        confirmOrderDialog: false,
        changeBelongDialog: false,
        cancelOrderDialog: false,
        updateUserMobileDialog: false,
        signedModel: false,
        offlinePayDialog: false,
        initiatePayDialog: false,
        manConfirmPayDialog: false,
        offlineUnopenDialog: false,
      },

      enterpriseId: this.$util.getLocalStorage('enterpriseId'),

      contractData: {},
      userInfo: {},
      isEditVoucher: false,
      showAuditUploadFile: false,
      updateMoneyDialog: false,
      CONTRACTEM: CONTRACTEM,
      offlineStatus: '',
    };
  },
  filters: {
    filterName(type, list) {
      let item = list.find((i) => i.dataCode === type);
      return item ? item.dataValue : '';
    },
  },
  computed: {
    balancePrice() {
      //剩余尾款
      //总价应付-实付 (amountMoney实付金额) orderMone应付金额
      const invoiceMoney = this.detailInfo.invoice && this.detailInfo.invoice.gatheringTime ? this.detailInfo.invoice.invoiceAmountMoney : 0;
      if (this.detailInfo.amountMoney > this.detailInfo.includeTaxOrderMoney) {
        return 0;
      } else {
        const result = this.$util.accSub(this.detailInfo.includeTaxOrderMoney, this.detailInfo.amountMoney);
        return Number(this.$util.accSub(Number(result), invoiceMoney));
      }
    },

    showCancelBtn() {
      const isExchangeBtn = this.detailInfo.orderTypeEn == 'EXCHANGE' && this.detailInfo.orderStatus == 'PART_PAID' && this.detailInfo.exchangeMoney > this.detailInfo.refundServiceMoney;
      const statusList = ['AUDIT_FAIL', 'WAIT_AUDIT', 'WAIT_PAY', 'PAY_WAIT_CONFIRM', 'PAY_REJECT'];
      return statusList.includes(this.detailInfo.orderStatus) || isExchangeBtn;
    },

    tableOneList() {
      return setBainfoTableOneList(this.detailInfo, this);
    },
    tableTowList() {
      return setBainfoTableTowList(this.detailInfo, this);
    },
    hasPaymentFile() {
      return this.detailInfo.orderPaymentDetails.some((item) => item.paymentFile);
    },
    showOffLinePay() {
      return this.detailInfo.orderStatus == 'WAIT_PAY' || (this.detailInfo.orderStatus == 'PART_PAID' && this.detailInfo.paymentTypeEn == 'PART') || (this.detailInfo.orderStatus == 'PART_PAID' && this.detailInfo.orderTypeEn == 'EXCHANGE' && this.detailInfo.unPaidMoney > 0);
    },
  },
  created() {
    this.contractInfo();
  },
  methods: {
    createPay() {
      if (this.detailInfo.orderPaymentDetails.some((item) => item.paymentStatus === '被驳回')) {
        this.$message.warning('请先处理已驳回的凭证');
        return;
      }
      this.dialogShowObj.initiatePayDialog = true;
    },
    //复制链接
    copyLink(className) {
      let _this = this;
      let clipboard = new this.clipboard(className);
      clipboard.on('success', function (e) {
        _this.$Message.success('复制成功');
      });
      clipboard.on('error', function () {
        _this.$Message.info('复制失败');
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
    goCustomer() {
      this.$router.push({ path: '/customer/customerInfo/index' });
    },

    offlinePay() {
      getUserAccount({
        userId: this.detailInfo.userId,
      }).then((res) => {
        if (res.code === 0) {
          console.log(this.detailInfo.payMethod);
          // 国际支付直接到线下支付并去除提示
          if (this.detailInfo.payMethod === 'INTL_PAY') {
            this.dialogShowObj.manConfirmPayDialog = true;
            this.userInfo = res.data;
          } else {
            if (res.data.status == 'NORMAL') {
              // 线下付款提示?
              this.dialogShowObj.offlinePayDialog = true;
              this.userInfo = res.data;
            } else {
              // 未开通线下付款提示?
              this.dialogShowObj.offlineUnopenDialog = true;
              this.offlineStatus = res.data.status;
              this.isEditVoucher = false;
            }
          }
        }
      });
    },

    editVoucher() {
      this.dialogShowObj.manConfirmPayDialog = true;
      this.isEditVoucher = true;
    },

    async contractInfo() {
      let { data, code } = await getContractInfo(this.$route.query.id);
      this.contractData = code == 0 && (data.find((item) => item.invalidStatus == false) || {});
    },
    getOrder() {
      if (!(this.detailInfo.contractStatus === '已撤销' || this.detailInfo.contractStatus === '已作废' || this.detailInfo.contractStatus === '未签署')) {
        return this.$message.warning('请先将合同状态改完 已撤销/已作废/未签署');
      }

      this.$router.push({ path: '/manuelorder/index', query: { id: this.id } });
    },
    reCreate() {
      this.$router.push({ path: '/manuelorder/index', query: { id: this.id, reCreate: true } });
    },
    goBack() {
      let name = this.isRenewal ? 'xcloudplat_renewalorder' : 'xcloudplat_salesOrder';
      this.$router.push({
        name,
      });
    },
    cancelOrder() {
      this.dialogShowObj.cancelOrderDialog = true;
    },
    // 修改订单备注
    changeOrderRemark() {
      this.$prompt('', '请输入订单备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入订单备注',
      }).then(({ value }) => {
        modifyOrderRemark({
          orderId: this.id,
          remark: value,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('修改成功');
            this.parentFn.getDeatilData();
          }
        });
      });
    },
    // 修改销售人员
    changeSaleman() {
      this.dialogShowObj.changeBelongDialog = true;
    },
    // 修改客户手机号
    changeUserMobile() {
      this.dialogShowObj.updateUserMobileDialog = true;
    },
    changeMoneyDialog() {
      this.updateMoneyDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
#salesOrderBaseInfo {
  overflow: hidden;

  .actionButton {
    float: right;
  }
  .statusInfo {
    ::v-deep .el-divider--vertical {
      height: 16px;
      margin-top: -6px;
    }
    .text-info {
      font-size: 16px;
      font-weight: bold;
      margin-right: 10px;
    }
    .order {
      font-size: 14px;
      padding: 20px 0;
    }
    .border-box {
      margin: 15px 20px;
      .stepsInfo {
        flex: 3;
        min-width: 320px;
        position: relative;
        .signedBtn {
          position: absolute;
          right: 0px;
          bottom: 20px;
        }
      }
    }
    .title {
      font-weight: bold;
      line-height: 43px;
      padding-left: 5px;
    }
    .btn {
      float: right;
    }
  }
}
//列表布局
.dis-flex {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  li {
    list-style: none;
    width: 350px;
    padding: 7px 25px;
    font-size: 12px;
    display: flex;
    word-break: break-all;
    align-items: center;
    .text-title {
      display: inline-block;
      width: 100px;
      flex: 0 0 80px;
      white-space: nowrap;
      text-align: right;
      color: #999;
      margin-right: 8px;
    }
  }
}

.basic-table {
  ::v-deep .el-table__header {
    width: 100%;
    border-spacing: 0;
  }
}

.title {
  padding: 24px 0px 0px 0px;
  font-size: 14px;
}

::v-deep .el-table .el-table__header th {
  background: #f6f6f6 !important;
}

::v-deep .el-table .el-table__header td {
  background: #fff !important;
}

.mt-4 {
  margin-top: -4px;
}

.status-title-wrap {
  background: #e4e4e4;
  height: 36px;
  line-height: 36px;
  margin: 20px 0 10px;
  padding: 0 10px;

  .fr {
    float: right;
  }
}
.el-icon-question {
  color: #ff9900;
  padding: 0 12px;
  line-height: 36px;
  font-size: 20px;
}

.warn-color {
  background: #f9e7ce;
}
</style>
<style lang="scss">
.mw-350 {
  max-width: 350px !important;
}

.pay-cancel-tip {
  margin-left: 30px;
  color: #7f7f7f;
}
.payicon {
  margin-top: -5px;
}
</style>
