<template>
  <div class="app-container">
    <!-- 查询 -->
    <Search :isRenewal="isRenewal" @queryData="queryData" @search="search">
      <template #btnGroup>
        <el-button type="success" @click="addOrder" class="fl-right" v-if="!isRenewal" v-show="hasAuthority('C2_7')">
          <i class="icon icon-adds"></i>
          手工录单
        </el-button>
        <el-button type="success" @click="batchModify" class="mr-10 fl-right" v-show="hasAuthority(isRenewal ? 'S2_4' : 'C2_30')">
          <i class="icon icon-change"></i>
          批量修改归属人
        </el-button>
      </template>
    </Search>

    <!-- 表格 -->
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane label="全部订单" name="-1"></el-tab-pane>
        <el-tab-pane v-for="item in statusList" :key="item.baseDataId" :label="item.dataValue + (item.count === undefined ? '' : `(${item.count})`)" :name="item.dataCode"></el-tab-pane>
      </el-tabs>
      <el-table border :data="tableData" v-loading="tableLoading" show-summary row-key="orderId" :summary-method="getSummaries" :height="tableHeight" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="selection" reserve-selection width="55"> </el-table-column>
        <el-table-column align="center" label="编号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售订单号" prop="orderNo" width="170" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.orderNo }} {{ scope.row.paymentBatchNo ? '批' : '' }}</span>
            <template v-if="scope.row.payMethod === 'INTL_PAY'">
              <img class="pay-icon" src="@/assets/icons/pay-guoji.svg" alt="国际支付" title="国际支付" />
            </template>
            <template v-else>
              <img class="pay-icon" src="@/assets/icons/pay-guonei.svg"  alt="国内支付" title="国内支付" />
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="客户手机号" prop="userMobile" width="100">
          <template slot-scope="{ row }">
            <span v-hidden>{{ row.userMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品分类" prop="productCategoryName" width="150" show-overflow-tooltip> </el-table-column>
        <el-table-column align="center" label="商品名称" prop="productNames" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="下单时间" prop="createTime" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="订单金额" prop="orderMoney" width="150" sortable>
          <template slot-scope="scope">￥{{ scope.row.orderMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="优惠金额" prop="discountMoney" width="150" sortable>
          <template slot-scope="scope">￥{{ scope.row.discountMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="应付金额" prop="orderPaymentMoney" width="150" sortable>
          <template slot-scope="scope">￥{{ scope.row.orderPaymentMoney | formatQianFenWei }}</template>
        </el-table-column>

        <el-table-column align="center" label="实付金额" prop="orderPaidMoney" width="150" sortable>
          <template slot-scope="scope">￥{{ scope.row.orderPaidMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="发票金额" prop="invoiceMoney" width="150" sortable>
          <template slot-scope="scope">￥{{ scope.row.invoiceMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单状态" width="100">
          <template slot-scope="scope">
            {{ scope.row.orderStatus }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务公司" prop="firstCompanyName" width="200">
          <template slot-scope="{ row }">
            <el-tooltip effect="dark" :content="row.serviceCompanyName" placement="top-start">
              <span>{{ row.firstCompanyName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="商机编号" prop="opportunityNo" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.opportunityNo">{{ scope.row.opportunityNo }}</span>
            <el-link type="primary" v-else @click="addOpportunityNo(scope.row)">添加</el-link>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="销售人员" prop="attributionName" width="120"></el-table-column>
        <el-table-column align="center" label="是否申请开票" width="100px">
          <template slot-scope="scope">
            {{ scope.row.invoiceStatus == 1 ? '已申请' : '未申请' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单来源" width="100px">
          <template slot-scope="scope">
            {{ scope.row.orderSource }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单类型" prop="orderType" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="备注" prop="remark" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('C2_8')">
              <el-link type="primary" :underline="false" class="icon-see icon" @click="showDetailModal(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改跟进人" placement="top" v-if="hasAuthority('C2_9')">
              <el-link type="primary" :underline="false" class="icon-edit icon" @click="showEditModal(scope.row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50, 100]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <!-- 修改归属人 -->
    <el-dialog title="修改归属人" :visible.sync="addDialogVisible" width="373px">
      <el-form ref="registerFundForm" label-width="120px">
        <el-form-item label="当前归属人：" v-show="follwObj.attributionName">
          {{ follwObj.attributionName }}
        </el-form-item>
        <el-form-item label="归属人">
          <el-select style="width: 168px" clearable placeholder="归属人" filterable v-model="follwObj.attributionId">
            <el-option-group>
              <li class="option_title" style="background: #f6f8fa">
                <span>姓名</span>
                <span>手机号</span>
                <span>部门</span>
              </li>

              <el-option v-for="item in followList" :key="item.userId" :label="item.nickName" :value="item.userId" class="option_title">
                <span>{{ item.nickName }}</span>
                &nbsp;
                <span>{{ item.mobile }}</span>
                &nbsp;
                <span>{{ item.departmentName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatefollowFun">确 定</el-button>
      </span>
    </el-dialog>
    <idx-dailog :dialogShowObj.sync="dialogShowObj"></idx-dailog>
    <AddOpportunityNoDialog :addOpportunityNoDialog.sync="addOpportunityNoDialog" :checkItem="checkItem" @refresh="queryData" />
  </div>
</template>
<script>
import { getorderlist, updateAttribution, getTotalPrice, orderStatusCount } from '@/api/newApi/orderManage/salesorder.js';
import AddOpportunityNoDialog from './indexComponents/addOpportunityNoDialog';
import Search from './indexComponents/search';
import staticList from './staticList';
import { getBaseDataByDataType, userList } from '@/api/newApi/common';
export default {
  props: {
    type: String,
  },
  components: {
    IdxDailog: () => import('./indexComponents/Dialog'),
    AddOpportunityNoDialog,
    Search,
  },
  data() {
    return {
      dialogShowObj: {
        orderTransfer: false,
      },
      activeName: '-1',
      tablist: staticList.tablist,
      statusList: [],

      // 分页
      listTotal: 0,
      addDialogVisible: false,
      moreSerch: false,
      tableData: [],
      listQuery: {},
      totalPrice: {}, //合计金额列表
      followList: [],
      follwObj: {
        followUserName: '', //归属人名称
        attributionId: '',
        attributionName: '',
      },
      enterpriseId: '',
      tableLoading: false,
      isBatchModify: false,

      invoiceStatusList: staticList.invoiceStatusList,
      orderTypeList: [
        { label: '正常订单', value: 0 },
        { label: '续费订单', value: 1 },
        { label: '项目制订单', value: 2 },
        { label: '溢价订单', value: 3 },
      ],
      checkItem: {},
      addOpportunityNoDialog: false,
    };
  },
  filters: {
    filterOrderType(orderType, orderTypeList) {
      let item = orderTypeList.find((i) => i.value === orderType);
      return item ? item.label : '';
    },
  },
  async created() {
    this.enterpriseId = this.$util.getLocalStorage('enterpriseId');
    await this.getOptionList();
    this.getUserList(); //获取归属人列表
    this.queryData();
  },
  computed: {
    isRenewal() {
      return this.type === 'renewal';
    },
  },
  mounted() {},
  methods: {
    getOptionList() {
      return new Promise((resolve) => {
        let index = 0;
        const optMap = {
          statusList: 'ORDER_STATUS_TYPE',
        };
        let keys = Object.keys(optMap);
        keys.map((item) => {
          getBaseDataByDataType({
            dataType: optMap[item],
          }).then((res) => {
            index += 1;
            if (res.code == 0) {
              this[item] = res.data;
            }
            if (index === keys.length) {
              resolve();
            }
          });
        });
      });
    },
    formatNum() {
      orderStatusCount(this.listQuery).then((res) => {
        res.data.orderStatusStatisticsVO.forEach((status) => {
          this.statusList.forEach((item) => {
            if (status.orderStatus === item.dataCode) {
              item.count = status.total;
              item.dataValue = item.dataValue;
            }
          });
        });
      });
    },
    // 添加商机
    addOpportunityNo(row) {
      this.checkItem = row;
      this.addOpportunityNoDialog = true;
    },
    // 获取订单列表
    queryData(query = {}) {
      this.tableLoading = true;
      if (query.listQuery) {
        this.listQuery = query.listQuery;
        // 切换主体，刷新页面获取最新企业id
        this.listQuery.enterpriseIdList = [Number(this.$util.getLocalStorage('enterpriseId'))];
      }
      getorderlist(this.listQuery)
        .then((res) => {
          if (res.code == 0) {
            res.data.records.forEach((item) => {
              item.firstCompanyName = item.serviceCompanyName.split('/')[0];
            });
            this.tableData = res.data.records;
            this.listTotal = parseInt(res.data.total);
            this.getTotal();
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
        });
      this.formatNum();
    },
    getTotal() {
      getTotalPrice(this.listQuery).then((res) => {
        if (res.code === 0) {
          this.totalPrice = res.data;
        }
      });
    },
    //金额合计显示
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        switch (column.property) {
          case 'orderMoney': //这是是根据prop来判断是那一列的数据
            sums[index] = '￥' + this.$options.filters['formatQianFenWei'](this.totalPrice.orderMoneySum); //sums[index]是固定写法  表示的是每一空格是要写什么内容,this.totalPrice就是后台的数据
            break;
          case 'orderPaymentMoney':
            sums[index] = '￥' + this.$options.filters['formatQianFenWei'](this.totalPrice.orderPaymentMoneySum);
            break;
          case 'orderPaidMoney':
            sums[index] = '￥' + this.$options.filters['formatQianFenWei'](this.totalPrice.orderPaidMoneySum);
            break;
          default:
            break;
        }
      });
      return sums;
    },
    //切换tab状态时请求列表
    tabHandleClick() {
      this.listQuery.page = 1;
      if (this.activeName == '-1') {
        this.listQuery.orderStatus = '';
      } else {
        this.listQuery.orderStatus = this.activeName;
      }
      this.queryData();
    },
    addOrder() {
      this.$router.push({
        path: '/manuelorder/index',
      });
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryData();
    },
    /**
     * 修改归属人
     */
    showEditModal(row) {
      this.follwObj.orderId = row.orderId;
      this.follwObj.attributionName = row.attributionName;
      this.follwObj.attributionId = row.attributionId;
      this.addDialogVisible = true;
      this.isBatchModify = false;
    },
    /**
     *归属人下拉列表
     */
    getUserList() {
      userList({
        page: 1,
        limit: -1,
      }).then((res) => {
        if (res.code == 0) {
          this.followList = res.data;
        }
      });
    },
    /**获取跟进人名称 */
    selectName() {
      let obj = {};
      obj = this.followList.find((item) => {
        //这里的Data就是上面遍历的数据源
        return item.userId === this.follwObj.attributionId; //筛选出匹配数据
      });
      return (obj || {}).nickName;
    },
    /**修改跟进人保存 */
    updatefollowFun() {
      updateAttribution({
        enterpriseId: this.enterpriseId,
        orderIds: this.isBatchModify ? this.$refs.table.selection.map((item) => item.orderId) : [this.follwObj.orderId],
        attributionId: this.follwObj.attributionId,
        attributionName: this.selectName(),
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success('修改成功');
          this.addDialogVisible = false;
          this.queryData();
          if (this.isBatchModify) {
            this.$refs.table.clearSelection();
          }
        }
      });
    },
    batchModify() {
      const selection = this.$refs.table.selection;
      if (!selection.length) {
        return this.$message({
          message: `请先选择订单`,
          type: 'error',
          duration: 2000,
        });
      }
      this.isBatchModify = true;
      if (selection.length == 1) {
        this.follwObj.attributionId = selection[0].attributionId;
        this.follwObj.attributionName = selection[0].attributionName;
      } else {
        this.follwObj.attributionId = '';
        this.follwObj.attributionName = '';
      }
      this.addDialogVisible = true;
    },

    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({
        name: 'salesorderdetail',
        query: {
          id: row.orderId,
          isRenewal: this.isRenewal,
        },
      });
    },
    search({ listQuery, activeName }) {
      this.listQuery = listQuery;
      this.listQuery.page = 1;
      this.activeName = activeName;
      this.queryData();
    },
  },
};
</script>
<style lang="scss" scoped>
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  line-height: 1;
  span {
    flex: 3;
  }
}
::v-deep .el-table-column--selection {
  text-align: center;
}

.mr-10 {
  margin-right: 10px;
}
.fl-right {
  float: right;
}
.pay-icon {
  margin-top: -3px;
}
</style>
