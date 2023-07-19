<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <div
        :class="{
          'search-aera': true,
          'search-on': moreSerch,
          'search-off': !moreSerch,
        }"
      >
        <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
          <el-form :model="form" ref="searchForm" inline label-width="90px">
            <el-form-item prop="enterpriseIdList">
              <el-select style="width: 168px" v-model="form.enterpriseIdList" placeholder="请选择公司主体" clearable multiple filterable>
                <el-option v-for="item in firmList" :value="item.id" :key="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="orderNo">
              <el-input v-model="form.orderNo" placeholder="销售订单号" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item prop="refundNo">
              <el-input v-model="form.refundNo" placeholder="退款单号" clearable style="width: 168px" />
            </el-form-item>

            <el-form-item prop="applyTime" clearable>
              <el-date-picker
                v-model="form.applyTime"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="申请开始日期"
                end-placeholder="申请结束日期"
                :default-time="['00:00:00', '23:59:59']"
                style="width: 340px"
                align="right"
                clearable
                unlink-panels
              ></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              <el-button @click="resetSearchBox()" icon="el-icon-refresh">重置</el-button>
              <el-button type="text" @click="handleMoreSearch">
                <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
                {{ moreSerch ? '收起' : '更多' }}筛选
              </el-button>
            </el-form-item>
            <div class="more-search" v-show="moreSerch">
              <el-form-item prop="userMobile">
                <el-input v-model="form.userMobile" placeholder="客户手机号" clearable style="width: 168px" />
              </el-form-item>
              <el-form-item prop="refundStatus">
                <el-select style="width: 168px" placeholder="退款订单状态" v-model="form.refundStatus">
                  <el-option v-for="item in tabs" :value="item.id" :key="item.id" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="refundApplyType">
                <el-select style="width: 168px" placeholder="退款类型" v-model="form.refundApplyType">
                  <el-option v-for="item in refundTypeList" :value="item.value" :key="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="refundType">
                <el-select style="width: 168px" placeholder="退款商品" v-model="form.refundType">
                  <el-option v-for="item in refundGoodsList" :value="item.value" :key="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="countryCode">
                <el-select style="width: 168px" placeholder="请选择国家" v-model="form.countryCode" clearable multiple filterable>
                  <el-option v-for="item in countrySelectList" :value="item.countryCode" :key="item.id" :label="item.countryNameZh"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="applyId">
                <el-select style="width: 168px" placeholder="请选择申请人" v-model="form.applyId" clearable filterable>
                  <el-option v-for="item in applyUserList" :value="item.userId" :key="item.userId" :label="item.nickName" filterable></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="refundTime" clearable>
                <el-date-picker
                  v-model="form.refundTime"
                  type="daterange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="退款开始日期"
                  end-placeholder="退款结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                  style="width: 260px"
                  align="right"
                  clearable
                  unlink-panels
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="refundMethod">
                <el-select style="width: 168px" placeholder="请选择退款路径" v-model="form.refundMethod" clearable filterable>
                  <el-option v-for="item in refundMethodList" :value="item.value" :key="item.value" :label="item.label" filterable></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane :label="item.label" :name="item.id" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
      </el-tabs>
      <el-table ref="table" :data="tableData" border show-summary :summary-method="getSummaries" v-loading="loading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="refundNo" label="退款订单号" width="120" align="center"></el-table-column>
        <el-table-column prop="orderNo" label="销售订单号" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderNo }}</span>
            <template v-if="scope.row.payMethod === 'INTL_PAY'">
              <img class="pay-icon" src="@/assets/icons/pay-guoji.svg" alt="国际支付" title="国际支付" />
            </template>
            <template v-else>
              <img class="pay-icon" src="@/assets/icons/pay-guonei.svg"  alt="国内支付" title="国内支付" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="退款商品" width="150" align="center" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="orderMoney" label="服务金额" width="120" align="center">
          <template slot-scope="scope">￥{{ scope.row.orderMoney | formatQianFenWei }}</template>
        </el-table-column> -->
        <el-table-column prop="productPaidMoney" label="商品实付金额" width="120" align="center">
          <template slot-scope="scope">￥{{ scope.row.productPaidMoney | formatQianFenWei }}</template>
        </el-table-column>

        <el-table-column prop="refundMoney" label="退款金额" width="120" align="center">
          <template slot-scope="scope">￥{{ scope.row.refundMoney | formatQianFenWei }}</template>
        </el-table-column>

        <el-table-column prop="refundPoundage" label="退款手续费" width="120" align="center">
          <template slot-scope="scope">￥{{ scope.row.refundPoundage | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column prop="refundMethod" label="退款路径" width="120" align="center"></el-table-column>
        <el-table-column prop="refundApplyType" label="退款类型" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.refundApplyType | filterRefundApplyType }}</template>
        </el-table-column>
        <!-- <el-table-column label="退款金额" width="120" align="center">
          <template slot-scope="scope">
            ￥{{ (scope.row.refundMoney + scope.row.refundPoundage) | formatQianFenWei }}
          </template>
        </el-table-column> -->
        <el-table-column prop="refundStatus" label="退款状态" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.refundStatus | filterStatus }}</template>
        </el-table-column>
        <el-table-column prop="userMobile" label="客户手机号" width="120" align="center">
          <template slot-scope="{ row }">
            <span v-hidden>{{ row.userMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyName" label="申请人" width="120" align="center"></el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="150" align="center"></el-table-column>
        <el-table-column label="操作" min-width="160" fixed="right" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('C2_1')">
              <el-link type="primary" :underline="false" @click="refundDetail(scope.row)" class="icon icon-see"></el-link>
            </el-tooltip>
            <!-- <el-tooltip effect="dark" content="确认退款" placement="top" v-if="hasAuthority('C2_2')">
              <el-link
                type="primary"
                :underline="false"
                @click="refundConfirm(scope.row)"
                v-if="scope.row.status == 1 && (scope.row.refundApplyType === 1 || scope.row.refundApplyType === 2)"
                class="icon icon-refund"
              ></el-link>
              <el-link
                type="primary"
                :underline="false"
                @click="refundConfirm2(scope.row)"
                v-if="scope.row.status == 1 && scope.row.refundApplyType === 3"
                class="icon icon-refund"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="审核" placement="top" v-if="hasAuthority('C2_3')">
              <el-link
                type="primary"
                :underline="false"
                @click="audit(scope.row)"
                v-if="scope.row.status == 0"
                class="icon icon-audit"
              ></el-link>
            </el-tooltip> -->
            <el-tooltip effect="dark" content="取消" placement="top" v-if="hasAuthority('C2_4')">
              <el-link type="primary" :underline="false" @click="cancel(scope.row.orderRefundId)" v-if="scope.row.refundStatus == 'AUDIT_FAIL' || scope.row.refundStatus == 'WAIT_REFUND' || scope.row.refundStatus == 'WAIT_AUDIT'" class="icon icon-cancel"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50, 100]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <!-- 退款审核 -->
    <!-- <audit-dialog :auditDialogvisible.sync="auditDialogvisible" :id="checkId" @refresh="getList"></audit-dialog> -->
    <!-- 确认退款弹窗 -->
    <!-- <refund-dialog
      :refundDialogvisible.sync="refundDialogvisible"
      :order="order"
      @getParentFn="getList"
    ></refund-dialog> -->
  </div>
</template>

<script>
import { refundOrderList, totalRefund, cancelRefund, applyOrderRefund } from '@/api/newApi/orderManage/refundOrder';
import { userList, getCountrySelectList, getFirm } from '@/api/newApi/common.js';
// import AuditDialog from "./components/auditDialog.vue";
// import RefundDialog from "./components/refundDialog.vue";
import cacheQuery from '@/mixins/cacheQuery';
export default {
  mixins: [cacheQuery],
  data() {
    return {
      // drawer: false,
      // WAIT_AUDIT:待审核 AUDIT_FAIL:审核不通过 WAIT_REFUND:待退款 REFUNDED:已退款 CANCEL:已取消
      tabs: [
        { id: '-1', label: '全部订单' },
        { id: 'WAIT_AUDIT', label: '审批中' },
        { id: 'WAIT_REFUND', label: '审批通过' },
        { id: 'REFUNDING', label: '退款中' },
        { id: 'REFUNDED', label: '已退款' },
        { id: 'UNREFUND', label: '无需退款' },
        { id: 'REFUND_FAIL', label: '退款失败' },
        { id: 'AUDIT_FAIL', label: '审批不通过' },
        { id: 'CANCEL', label: '已取消' },
      ],
      activeName: '-1',
      refundTypeList: [
        { label: '仅退款', value: 'ONLY_REFUND' },
        { label: '退款并取消服务', value: 'REFUND_CANCEL_SERVICE' },
        { label: '仅取消服务', value: 'CANCEL_SERVICE' },
      ],
      refundGoodsList: [
        { label: '订单', value: 'ORDER' },
        { label: '发票', value: 'INVOICE' },
      ],
      loading: false,
      tableData: [],
      total: 0,
      firmList: [],
      serviceCascader: [],
      form: {
        refundNo: '',
        userMobile: '',
        orderNo: '',
        // serviceClass: "",
        refundStatus: '',
        countryCode: [],
        applyId: '',
        applyStartTime: '',
        applyEndTime: '',
        refundStartTime: '',
        refundEndTime: '',
        refundApplyType: '',
        enterpriseIdList: [],
        refundType: '',
        refundMethod: '',
        page: 1,
        limit: 20,
        applyTime: [],
        refundTime: [],
      },
      copyForm: {},
      showMoreSearch: false,
      countrySelectList: [],
      applyUserList: [],
      // auditDialogvisible: false,
      // refundDialogvisible: false,
      moreSerch: false,
      // 选中的id
      // checkId: "0",
      // order: {},
      sum: {},
      cacheKey: 'form',
      copyListQuery: {},
      refundMethodList: [
        { value: 'RETURN_TO_SOURCE', label: '原路返回' },
        { value: 'RETURN_TO_BANK', label: '退回到银行卡' },
        { value: 'COUPON', label: '发放优惠券' },
        { value: 'VIRTUAL', label: '虚拟退款' },
      ],
    };
  },
  components: {
    // AuditDialog,
    // RefundDialog,
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
        case 'REFUNDING':
          return '退款中';
        case 'REFUND_FAIL':
          return '退款失败';
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
  },
  // computed: {
  //   getrefundTime() {
  //     return this.$util.getEndTime(this.refundTime);
  //   },
  // },
  created() {
    // 保留搜索条件默认值
    this.setApplyTime();
    this.getFirmList();
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this._getCountrySelectList();
    this._userList();
    this.init();
  },
  methods: {
    // handleClose(done) {
    //   this.$confirm("确认关闭？")
    //     .then((_) => {
    //       done();
    //     })
    //     .catch((_) => {});
    // },
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    getFirmList() {
      getFirm().then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    //切换tab状态时请求列表
    tabHandleClick() {
      if (this.activeName == '-1') {
        this.form.refundStatus = '';
      } else {
        this.form.refundStatus = this.activeName;
      }
      this.getList();
    },
    _userList() {
      userList().then((res) => {
        this.applyUserList = res.data;
      });
    },
    search() {
      this.searchFlag = true;
      this.init();
    },
    getFormData() {
      let { applyTime, refundTime, ...data } = this.form;
      if (this.form.refundStatus === '-1') {
        data.refundStatus = '';
      }
      if (this.form.applyTime) {
        data.applyStartTime = this.form.applyTime ? this.form.applyTime[0] : '';
        data.applyEndTime = this.form.applyTime ? this.form.applyTime[1] : '';
      }
      if (this.form.refundTime) {
        data.refundStartTime = this.form.refundTime ? this.form.refundTime[0] : '';
        data.refundEndTime = this.form.refundTime ? this.form.refundTime[1] : '';
      }
      data.countryCode = this.form.countryCode.join(',');
      return data;
    },
    setApplyTime() {
      //默认当前日期到前三个月
      this.form.applyTime = this.$util.getThreeTime(this.form.applyTime);
    },
    async init() {
      if (this.form.refundStatus) {
        this.activeName = this.form.refundStatus;
      }
      this.getList();
    },
    /** 底部合计 */
    getTotalList() {
      totalRefund(this.getFormData()).then((res) => {
        if (res.code == 0) {
          this.sum = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    // 获取列表
    getList() {
      this.loading = true;
      this.setPageCache();
      refundOrderList(this.getFormData()).then((res) => {
        let result = res.data;
        this.getTotalList();
        this.tableData = result.records;
        this.total = parseInt(result.total);
        // this.sum = {};
        this.loading = false;
        if (this.searchFlag) {
          this.$message({
            message: `搜索完成，为您搜索${this.total}条结果`,
            type: 'success',
            duration: 2000,
          });
          this.searchFlag = false;
        }
      });
    },
    getSummaries(params) {
      const { columns } = params;
      const sums = [];
      if (this.sum) {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          let key = column.property;
          let formatQianFenWei = this.$options.filters['formatQianFenWei'];
          switch (key) {
            case 'productPaidMoney':
              return (sums[index] = '￥' + formatQianFenWei(this.sum.productPaidTotal));
            case 'refundMoney':
              return (sums[index] = '￥' + formatQianFenWei(this.sum.refundTotal));
            case 'refundPoundage':
              return (sums[index] = '￥' + formatQianFenWei(this.sum.refundPoundageTotal));
          }
        });
      }
      return sums;
    },
    // 分页
    handleSizeChange(val) {
      this.form.limit = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.init();
    },
    resetSearchBox() {
      this.form = { ...this.copyListQuery };
      this.setApplyTime();
      this.removePageCache();
      this.init();
    },
    // 查看详情
    refundDetail(row) {
      this.$router.push({
        path: '/refundorder/detail',
        query: { id: row.orderRefundId },
      });
    },
    // 仅退款、退款并取消服务确认退款弹框
    // refundConfirm(row) {
    //   this.refundDialogvisible = true;
    //   this.order = row;
    // },
    // // 仅取消服务确认退款
    // refundConfirm2(row) {
    //   this.$confirm("确认对该订单进行虚拟退款？", "确认退款", {
    //     customClass: "custom-confirm",
    //     type: "warning",
    //     center: true
    //   }).then(() => {
    //     applyOrderRefund({
    //       id: row.id
    //     }).then(res => {
    //       this.$message.success("退款成功");
    //       this.getList()
    //     })
    //   });
    // },
    // 审核
    // audit(row) {
    //   this.checkId = row.id;
    //   this.auditDialogvisible = true;
    // },
    // 取消
    cancel(id) {
      this.$confirm('确定取消？', '取消提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        cancelRefund(id).then((res) => {
          if (res.code === 0) {
            this.$message.success('取消成功');
            this.getList();
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.title {
  overflow: hidden;
  margin: 10px 0;
  h2 {
    color: #333333;
  }
}
.pay-icon {
  margin-top: -3px;
  margin-left: 2px;
}
</style>
