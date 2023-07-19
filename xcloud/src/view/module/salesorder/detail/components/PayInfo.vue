<template>
  <div id="salesOrderpayInfo">
    <!-- <div class="tittle">
      <el-divider direction="vertical"></el-divider>
      <span class="text-info">付款信息</span>
    </div> -->
    <!-- {{paymentChannelList}} -->
    <div class="status-title-wrap warn-color" v-if="detailInfo.orderStatus == 'PAY_REJECT'">
      付款凭证审核不通过：{{ detailInfo.paymentRemark }}

      <el-link type="primary" :underline="false" @click="editVoucher" v-show="hasAuthority('C2_40')">修改凭证信息</el-link>
    </div>
    <el-table border :data="orderPayments" :max-height="260" class="table">
      <el-table-column align="center" label="编号" width="70">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.paymentAmount | formatQianFenWei }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="币种/金额">
        <template slot-scope="scope">
          <p>{{ currency[scope.row.currency] }}{{ scope.row.currencyPayAmount | formatQianFenWei }}</p>
          <p>汇率
            <!-- {{ detailInfo.orderPaymentDetails[0].exRate }} -->
            <!-- {{scope.row}} -->
            {{scope.row.exRate}}
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付状态" prop="paymentStatus"></el-table-column>
      <el-table-column align="center" :label="$util.isDemoAccount() ? '签约日期' : '支付时间'" prop="paymentTime"></el-table-column>
      <el-table-column align="center" label="支付渠道" prop="paymentChannelName"></el-table-column>
      <el-table-column align="center" label="执行日期" prop="paymentTime" v-if="$util.isDemoAccount()">
        <template slot-scope="scope">
          {{ timeFilter(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式">
        <template slot-scope="scope">
          <!-- {{ scope.row.paymentChannel | filterPaymentChannel(paymentChannelList) }} -->
          {{ scope.row.payWayName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="付款方" prop="payer"></el-table-column>
      <el-table-column align="center" label="收款账号" prop="acceptAccountNo"></el-table-column>
      <el-table-column align="center" label="交易流水" prop="platformTradeNo"></el-table-column>
      <el-table-column align="center" label="付款凭证" prop="paymentFile">
        <template slot-scope="scope">
          <template v-if="scope.row.paymentFile">
            <el-image v-for="(img, index) in scope.row.paymentFileList" :key="index" style="width: 60px; height: 40px" :src="img" :preview-src-list="scope.row.paymentFileList"></el-image>
          </template>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实际到账时间" prop="arrivalTime"></el-table-column>
      <el-table-column align="center" label="备注" prop="remark"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="{ row }" v-if="row.paymentFile && ['PAY_WAIT_CONFIRM', 'PAY_REJECT'].includes(detailInfo.orderStatus)">
          <el-link type="primary" @click="audit(row)" v-if="row.paymentStatus === '待确认'" v-show="hasAuthority('C2_44')">审核</el-link>
          <el-link type="primary" @click="changeFile(row)" v-if="row.paymentStatus !== '已确认' && row.paymentStatus !== '已付款'" v-show="hasAuthority('C2_45')">修改凭证</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 是否确认到账 -->
    <el-dialog title="是否确认到账" :visible.sync="payModel" width="460px">
      <el-form :rules="rules" :model="payForm" ref="ruletimeForm">
        <el-form-item label="到账时间：" prop="gatheringTime">
          <el-date-picker v-model="payForm.gatheringTime" type="datetime" align="right" size="small" clearable placeholder="请选择付款时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 260px" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="payModel = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitPayBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗组件 -->
    <dialogsence :dialogShowObj.sync="dialogShowObj" :detailInfo="detailInfo" :paymen.sync="paymen" :isEditVoucher="true" :checkItem="checkItem" />
    <AuditUploadFileDialog :showAuditUploadFile.sync="showAuditUploadFile" :paymentChannelList="paymentChannelList" :checkItem="checkItem" :detailInfo="detailInfo" />
  </div>
</template>

<script>
import { confirmPayment, deletePayment } from '@/api/newApi/orderManage/salesorder.js';
import { getBankAccountList } from '@/api/newApi/common.js';
import dialogsence from './Dialog';
import AuditUploadFileDialog from './auditUploadFileDialog';
import dayjs from 'dayjs';
import currency from '@/utils/currency.js';

export default {
  components: { dialogsence, AuditUploadFileDialog },
  props: {
    orderPayments: { type: Array },
    detailInfo: { type: Object },
    id: { type: String },
    paymentChannelList: { type: Array },
  },

  data() {
    console.log(this.$util.isDemoAccount());
    return {
      currency: currency,
      tableLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
          // - 8.64e6
        },
      },
      keyNum: Math.random(),

      buttonLoading: false,
      payModel: false,
      imgFile: '',
      payForm: {
        gatheringTime: '',
      },
      dialogShowObj: {
        registerFundDialog: false,
        manConfirmPayDialog: false,
        flag: 'update',
        rejectModel: false,
      },
      //修改付款信息
      paymen: null,
      RegisterFundForm: {
        orderId: this.detailInfo.id,
        paymentType: this.detailInfo.paymentType,
        paymentChannel: 3, //默认支付方式为银联，可手动选择
        paymentFile: '',
      },
      //收款账户列表
      collectionList: [],
      rules: {
        gatheringTime: [
          {
            required: true,
            message: '请选择到账时间',
            trigger: 'change',
          },
        ],
      },
      showAuditUploadFile: false,
      checkItem: null,
      orderPaymentId: '',
    };
  },
  filters: {
    //订单状态
    filterPayment(val) {
      switch (val) {
        case 'UNKNOW':
          return '未知 ';
        case 'WEIXIN':
          return '微信';
        case 'ALIPAY':
          return '支付宝';
        case 'UNIONPAY':
          return ' 银联';
        default:
          return '';
      }
    },
    filterPaymentChannel(val, list) {
      if (val === 'OFFLINE_PAYMENT') return '线下转账';
      return (list.find((item) => item.dataCode == val) || {}).dataValue;
    },
  },
  created() {
    this.enterpriseId = this.$util.getLocalStorage('enterpriseId');
  },
  methods: {
    editVoucher() {
      this.checkItem = {};
      this.dialogShowObj.manConfirmPayDialog = true;
    },
    // 审核
    audit(row) {
      this.checkItem = row;
      this.showAuditUploadFile = true;
    },
    // 修改凭证
    changeFile(row) {
      this.checkItem = row;
      this.dialogShowObj.manConfirmPayDialog = true;
    },
    //修改付款信息
    updatePayment(row) {
      this.dialogShowObj.registerFundDialog = true;
      this.paymen = row;
    },
    //删除付款信息
    deletPayment(row) {
      this.$confirm('确认删除吗?', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        deletePayment(row.id).then((res) => {
          if (res.code == 0) {
            this.$message.success('删除成功');
            this.$parent.getDeatilData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      });
    },
    showRejectModal(row) {
      this.paymen = row;
      this.dialogShowObj.rejectModel = true;
    },

    //确认到账弹窗
    confirmBtnPay(row) {
      this.payModel = true;
      this.payForm.id = row.id;
      if (this.$refs.ruletimeForm) {
        this.$refs.ruletimeForm.resetFields();
      }
      if (row.gatheringTime) {
        this.payForm.gatheringTime = row.gatheringTime;
      }
    },
    //确认到账提交
    submitPayBtn() {
      this.$refs.ruletimeForm.validate((valid) => {
        if (valid) {
          this.payForm.enterpriseId = this.enterpriseId;
          confirmPayment(this.payForm)
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('确认到账成功');
                this.payModel = false;
                this.$parent.getDeatilData();
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }
      });
    },
    /**获取收款账户数据  */
    getBankList() {
      getBankAccountList({
        enterpriseId: this.enterpriseId,
      }).then((res) => {
        if (res.code == 0) {
          this.collectionList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    // 演示账号修改执行日期
    timeFilter(row) {
      let date = '-';
      try {
        let _date = dayjs(row.paymentTime);
        if (_date.year() === 2020 || _date.year() === 2021) {
          date = _date.add(220 + _date.date(), 'day').format('YYYY-MM-DD HH:mm:ss');
        } else if (_date.year() > 2021) {
          date = _date.add(30 + _date.date(), 'day').format('YYYY-MM-DD HH:mm:ss');
        } else {
          date = _date.format('YYYY-MM-DD HH:mm:ss');
        }
      } catch (error) {
        console.error(error);
      }
      return date;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-table .el-table__header th {
  background: #f6f6f6 !important;
}
#salesOrderpayInfo {
  .tittle {
    // padding: 24px 0px 0px 0px;
    font-size: 16px;
    font-weight: bold;
  }
  .table {
    margin: 0px 20px;
    width: auto;
  }
}
.status-title-wrap {
  background: #e4e4e4;
  height: 36px;
  line-height: 36px;
  margin: 20px 20px 10px;
  padding: 0 10px;

  .fr {
    float: right;
  }
}

.warn-color {
  background: #f9e7ce;
}
</style>
