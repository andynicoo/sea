<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox" v-if="!isShowDetail">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form :model="listQuery" ref="searchForm" inline label-width="80px">
          <el-form-item prop="serviceNo" label="服务号">
            <el-input v-model="listQuery.serviceNo" clearable placeholder="服务号" style="width: 168px" />
          </el-form-item>
          <el-form-item prop="userMobile" label="手机号">
            <el-input v-model="listQuery.userMobile" clearable placeholder="手机号" style="width: 168px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="refreshTable()" icon="el-icon-search">查询</el-button>
            <el-button icon="el-icon-refresh-left" size="small" @click="resetSearchBox()">重置</el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? "收起" : "更多" }}筛选
            </el-button>
          </el-form-item>
          <el-button size="small" class="green-btn" style="float: right" @click="batchChangeHandlerFunc()" v-show="hasAuthority('U1_1')">
            <i class="icon icon-change"></i>
            批量修改处理人
          </el-button>
          <div v-show="moreSerch">
            <el-form-item prop="companyName" label="申请人">
              <el-input v-model="listQuery.companyName" clearable placeholder="申请人" style="width: 168px" />
            </el-form-item>
            <el-form-item prop="trademarkNameEn" label="商标名称">
              <el-input v-model="listQuery.trademarkNameEn" clearable placeholder="商标名称" style="width: 168px"></el-input>
            </el-form-item>
            <el-form-item prop="serviceName" label="服务名称">
              <el-input v-model="listQuery.serviceName" placeholder="服务名称" clearable style="width: 168px" size="small"></el-input>
            </el-form-item>
            <el-form-item prop="countryCode" style="margin-bottom: 6px" label="国家">
              <el-select clearable style="width: 168px" v-model="listQuery.countryCode" placeholder="国家" filterable>
                <el-option v-for="item in countrySelect" :value="item.countryCode" :key="item.id" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="orderNo" label="订单编号">
              <el-input v-model="listQuery.orderNo" placeholder="订单编号" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item prop="acceptNum" style="margin-bottom: 6px" label="受理号">
              <el-input v-model="listQuery.acceptNum" clearable placeholder="受理号" style="width: 168px" />
            </el-form-item>
            <el-form-item prop="servicesStatus" label="服务状态">
              <el-select size="small" style="width: 168px" placeholder="服务状态" v-model="listQuery.servicesStatus" clearable>
                <el-option label="服务中" :value="1"></el-option>
                <el-option label="已取消" :value="9"></el-option>
                <el-option label="封存" :value="10"></el-option>
                <el-option label="取消中" :value="11"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="handleUserName" label="处理人">
              <el-input v-model="listQuery.handleUserName" placeholder="处理人" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker v-model="creatTime" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="创建日期开始" end-placeholder="创建日期结束"></el-date-picker>
            </el-form-item>
            <el-form-item label="修改时间">
              <el-date-picker v-model="updateTime" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="修改日期开始" end-placeholder="修改日期结束"></el-date-picker>
            </el-form-item>
            <el-form-item label="受理日期">
              <el-date-picker v-model="acceptTime" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="受理日期开始" end-placeholder="受理日期结束"></el-date-picker>
            </el-form-item>
            <el-form-item label="客户截止时间" label-width="100px">
              <el-date-picker v-model="customerExpiryDate" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="创建日期开始" end-placeholder="创建日期结束"></el-date-picker>
            </el-form-item>
            <el-form-item label="官方要求答复时间" label-width="130px">
              <el-date-picker v-model="officialExpirationDate" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="修改日期开始" end-placeholder="修改日期结束"></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container" v-if="!isShowDetail">
      <el-tabs ref="elTabs" v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane v-for="(item, index) in tablist" :key="index" :label="item.statusDesc" :name="String(item.order)"></el-tab-pane>
      </el-tabs>
      <el-table border :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="table" :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="商标" width="220">
          <template slot-scope="scope">
            <p>订单号：{{ scope.row.orderNo }}</p>
            <p>服务编号：{{ scope.row.serviceNo }}</p>
            <p>商标名称：{{ scope.row.trademarkNameEn }}</p>
            <p>服务名称：{{ scope.row.serviceName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="国家" prop="countryNameZh" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="申请人" prop="applyName" width="150"></el-table-column>
        <el-table-column align="center" label="注册进度" prop="serviceProgressStr"></el-table-column>
        <el-table-column align="center" label="服务状态" prop="serviceStatusStr" width="150"></el-table-column>
        <el-table-column label="受理号/日期" prop="acceptTime" width="150" sortable="custom">
          <template slot-scope="scope">
            <p>受理号：{{ scope.row.acceptNum }}</p>
            <p>日期：{{ scope.row.acceptTime }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateTime" width="130" sortable="custom"></el-table-column>
        <el-table-column align="center" label="客户截止时间" prop="lastDealDate" width="130" sortable="custom"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="130" sortable="custom"></el-table-column>
        <el-table-column align="center" label="处理人" prop="refundMoney" width="200">
          <template slot-scope="{ row }">
            <div v-if="row.workorderHandlerList.length > 0">
              <p style="margin-bottom: 4px" v-for="(item, index) in row.workorderHandlerList" :key="index">
                {{ item.handleTypeName }}：
                <span>{{ item.handlerUserName }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <!-- 查看 -->
            <el-tooltip content="查看" placement="top" v-show="hasAuthority('U1_2')">
              <el-link type="primary" :underline="false" @click="showDetailModal(scope.row)">
                <img src="@/assets/icons/icon_see.svg" alt="" />
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container" v-if="!isShowDetail">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <HandleUser v-if="isHandler" :rowInfo="rowInfo" :serviceIds="serviceIds" @cancelFunc="handleCancel"></HandleUser>
  </div>
</template>
<script>
import { getCountrySelectList, getBusinessLogListByNo } from "@/api/newApi/common.js";
import workOrderDetail from "../trademark/workerDetail";
import HandleUser from "../components/handleUser";
import * as API from "@/api/newApi/intellectualProperty/oa";
import { getAllServiceProgressAPI } from "@/api/newApi/intellectualProperty/trademark";
import { setSearchVal, getSearchVal, getSearchTime, removeSearchVal } from "../handleSearch";
export default {
  components: {
    workOrderDetail,
    HandleUser,
  },
  data() {
    return {
      activeName: "-1",
      tablist: [],
      moreSerch: false,
      orderSourceList: [],
      paymentChannelList: [],
      statusList: [],
      paymentTypeList: [],
      countrySelect: [],
      // 分页
      listTotal: 0,
      moreSerch: false,
      tableData: [],
      listQuery: {
        orderNo: "",
        serviceNo: "",
        userMobile: "",
        countryCode: "",
        companyName: "",
        paymentChannel: "",
        attributionId: "",
        orderSource: "",
        paymentType: "",
        order: "-1",
        page: 1,
        limit: 10,
        order: 0,
        trademarkNameEn: "",
        serviceName: "",
        acceptNum: "",
        servicesStatus: "",
        handleUserName: "",
      },
      creatTime: "",
      updateTime: "",
      acceptTime: "",
      customerExpiryDate: "",
      officialExpirationDate: "",
      tableLoading: false,
      selectList: [],
      isShowDetail: false,
      workflowColumns: [],
      rowInfo: {},
      oaFileList: [],
      serviceIds: "",
      isHandler: false, //修改处理人
      serviceStatusList: [],
      workOrderInfo: {},
      userInfo: {},
      operationLog: [],
      pagePath: this.$route.name,
    };
  },
  created() {
    if (getSearchVal(this.pagePath) != null) {
      this.listQuery = getSearchVal(this.pagePath);
    }
    if (getSearchTime(this.pagePath) != null) {
      let searchTime = getSearchTime(this.pagePath);
      this.creatTime = searchTime.creatTime;
      this.updateTime = searchTime.updateTime;
      this.acceptTime = searchTime.acceptTime;
      this.officialExpirationDate = searchTime.officialExpirationDate;
      this.customerExpiryDate = searchTime.customerExpiryDate;
    }
    this.refreshTable();
    this.getCountrySelectList(); //获取国家列表
    this.getNodesFunc();
  },
  methods: {
    //获取工单节点
    getNodesFunc() {
      API.oaStatusListAPI().then((res) => {
        if (res.code == 0) {
          this.tablist = res.data;
        }
      });
      getAllServiceProgressAPI({ functionCode: 61 }).then((res) => {
        if (res.code == 0) {
          this.serviceStatusList = res.data;
        }
      });
    },
    backFunc(val) {
      // console.log('backFunc');
      this.isShowDetail = false;
      if (val) this.refreshTable();
    },
    refreshTable(objData) {
      // console.log(objData);
      let { order, ...newQuery } = this.listQuery;
      if (this.activeName == "-1") {
        this.listQuery = newQuery;
        this.activeName = "-1";
      } else {
        this.listQuery.order = order;
        this.activeName = String(this.listQuery.order);
      }
      if (objData) {
        this.listQuery.ordersField = objData.ordersField;
        this.listQuery.ordersStr = objData.ordersStr;
      }

      this.listQuery.customerExpiryEndDate = this.customerExpiryDate
        ? this.$util.formatDate(this.customerExpiryDate[1])
        : "";
      this.listQuery.customerExpiryStartDate = this.customerExpiryDate
        ? this.$util.formatDate(this.customerExpiryDate[0])
        : "";
      this.listQuery.updateEndTime = this.updateTime ? this.$util.formatDate(this.updateTime[1]) : "";
      this.listQuery.updateStartTime = this.updateTime ? this.$util.formatDate(this.updateTime[0]) : "";
      this.listQuery.createEndTime = this.creatTime ? this.$util.formatDate(this.creatTime[1]) : "";
      this.listQuery.createStartTime = this.creatTime ? this.$util.formatDate(this.creatTime[0]) : "";
      this.listQuery.acceptEndTime = this.acceptTime ? this.$util.formatDate(this.acceptTime[1]) : "";
      this.listQuery.acceptStartTime = this.acceptTime ? this.$util.formatDate(this.acceptTime[0]) : "";
      this.listQuery.officialExpirationDateEndDate = this.officialExpirationDate
        ? this.$util.formatDate(this.officialExpirationDate[1])
        : "";
      this.listQuery.officialExpirationDateStartDate = this.officialExpirationDate
        ? this.$util.formatDate(this.officialExpirationDate[0])
        : "";
      let searchTime = {
        creatTime: this.creatTime,
        updateTime: this.updateTime,
        acceptTime: this.acceptTime,
        officialExpirationDate: this.officialExpirationDate,
        customerExpiryDate: this.customerExpiryDate,
      };
      setSearchVal(this.pagePath, JSON.stringify(this.listQuery), JSON.stringify(searchTime));
      this.getOrderList();
    },
    //切换tab状态时请求列表
    tabHandleClick() {
      let { order, ...newQuery } = this.listQuery;
      if (this.activeName == "-1") {
        this.listQuery = newQuery;
      } else {
        this.listQuery.order = this.activeName;
      }
      this.refreshTable();
    },
    getOrderList() {
      this.tableLoading = true;
      API.oaWorkorderListAPI(this.listQuery)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.listTotal = parseInt(res.data.total);
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    /**
     * 获取国家下拉框数据
     */
    getCountrySelectList() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelect = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.refreshTable();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.refreshTable();
    },

    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({
        path: "/oa/detail",
        query: {
          isOaDetail: true,
          serviceId: row.serviceId,
        },
      });
      return;
      // 修改的代码，不需要打开
      this.rowInfo = { ...row };
      API.oaWorkorderDetailAPI({
        serviceId: this.rowInfo.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.workflowColumns = res.data.workflowColumns;
          this.isShowDetail = true;
          this.oaFileList = res.data.fileOaWorkOrderList;
          this.workOrderInfo = res.data.trademarkOrderServiceInfoVO;
          this.userInfo = res.data.trademarkOrderUserInfoVO;
          this.getOperationLog(this.workOrderInfo.serviceNo, 2);
        }
      });
    },
    // 获取操作日志
    getOperationLog(businessNo, businessType) {
      getBusinessLogListByNo({
        businessNo,
        businessType,
      }).then((res) => {
        if (res.code === 0) {
          this.operationLog = res.data;
        }
      });
    },
    resetSearchBox() {
      this.$refs.searchForm.resetFields();
      this.acceptTime = "";
      this.creatTime = "";
      this.customerExpiryDate = "";
      (this.updateTime = ""), (this.officialExpirationDate = "");
      this.listQuery = {
        orderNo: "",
        serviceNo: "",
        userMobile: "",
        countryCode: "",
        companyName: "",
        paymentChannel: "",
        attributionId: "",
        orderSource: "",
        paymentType: "",
        order: "-1",
        page: 1,
        limit: 10,
        order: 0,
        trademarkNameEn: "",
        serviceName: "",
        acceptNum: "",
        servicesStatus: "",
        handleUserName: "",
      };
      removeSearchVal(this.pagePath);
    },
    //选择table数据
    handleSelectionChange(val) {
      this.selectList = val;
    },
    // 时间排序
    sortChange(column, key, order) {
      // console.log(column)
      let ordersField = "",
        ordersStr = "";
      if (column.order == "descending" && column.prop == "acceptTime") {
        ordersField = "wo.accept_time";
        ordersStr = "DESC";
      } else if (column.order == "ascending" && column.prop == "acceptTime") {
        ordersField = "wo.accept_time";
        ordersStr = "ASC";
      } else if (column.order == "descending" && column.prop == "updateTime") {
        ordersField = "oa.update_time";
        ordersStr = "DESC";
      } else if (column.order == "ascending" && column.prop == "updateTime") {
        ordersField = "oa.update_time";
        ordersStr = "ASC";
      } else if (column.order == "descending" && column.prop == "createTime") {
        ordersField = "s.create_time";
        ordersStr = "DESC";
      } else if (column.order == "ascending" && column.prop == "createTime") {
        ordersField = "s.create_time";
        ordersStr = "ASC";
      } else if (column.order == "descending" && column.prop == "lastDealDate") {
        ordersField = "oa.last_deal_date";
        ordersStr = "DESC";
      } else if (column.order == "ascending" && column.prop == "lastDealDate") {
        ordersField = "oa.last_deal_date";
        ordersStr = "ASC";
      }
      // console.log(ordersField,ordersStr);
      this.refreshTable({ ordersField, ordersStr });
    },
    //点击批量修改
    batchChangeHandlerFunc() {
      if (this.selectList.length == 0) {
        this.$Message.info("请先选择服务");
        return;
      }
      this.serviceIds = "";
      this.selectList.map((item, index) => {
        if (this.selectList.length > 1) {
          this.serviceIds += item.serviceId + ",";
        } else {
          this.serviceIds += item.serviceId;
        }
      });
      this.isHandler = true;
    },
    handleCancel(val) {
      this.isHandler = false;
      if (val) this.refreshTable();
    },
  },
};
</script>
<style scoped lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
.app-container {
  height: 100%;
  position: relative;
}
</style>
