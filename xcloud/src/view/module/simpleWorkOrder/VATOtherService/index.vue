<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="80px">
          <el-tooltip content="多个服务号查询请输入回车进行换行" placement="top">
            <el-form-item prop="serviceNo">
              <el-input v-model="form.serviceNo" placeholder="服务号" type="textarea" clearable style="width: 228px" size="small" :rows="3" />
            </el-form-item>
          </el-tooltip>
          <el-form-item label="" prop="mobile">
            <el-input v-model="form.mobile" placeholder="手机号" clearable style="width: 168px; margin-bottom: 10px" size="small" />
            <br />
            <el-input v-model="form.orderNo" placeholder="订单号" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="" prop="companyName">
            <el-input v-model="form.companyNameZh" placeholder="公司中文名称" clearable style="width: 168px; margin-bottom: 10px" size="small" />
            <br />
            <el-input v-model="form.companyNameEn" placeholder="公司英文名称" clearable style="width: 168px" size="small" />
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button icon="el-icon-refresh-left" @click="reset" size="small"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
            <el-dropdown @command="(c) => this[c]()" style="margin-left: 20px">
              <el-button type="primary">功能按钮<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="changeManager" v-show="hasAuthority('Z1_3')">修改交付专员</el-dropdown-item>
                <el-dropdown-item command="changeCustomerService" v-show="hasAuthority('Z1_2')">修改客服</el-dropdown-item>
                <el-dropdown-item command="changeServiceProviderBatch" v-show="![-1, progressBarObj.CANCEL].includes(+tabNav) && hasAuthority('Z1_4')">修改服务商/律师</el-dropdown-item>
                <el-dropdown-item command="UploadDataListing" v-show="[progressBarObj.PENDING, progressBarObj.WAIT_UPLOAD].includes(+tabNav) && hasAuthority('Z1_1')">上传资料清单</el-dropdown-item>
                <el-dropdown-item command="_export" v-show="hasAuthority('Z1_6')">导出</el-dropdown-item>
                <!-- TODO hasAuthority -->
                <!-- <el-dropdown-item command="batchDownload" v-if="[progressBarObj.WAIT_REVIEW, progressBarObj.PROCESSING, progressBarObj.COMPLETE].includes(+tabNav)" v-show="hasAuthority('Z1_4')">下载客户资料</el-dropdown-item> -->
                <!-- TODO -->
                <!-- <el-dropdown-item command="batchSubmitProvider" v-if="[progressBarObj.WAIT_REVIEW].includes(+tabNav)" v-show="hasAuthority('L1_39')">提交服务商</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>

          <el-form-item style="float: right">
            <el-link type="primary" :underline="false" @click="toUploadAndDownloadRecords">上传/下载中心</el-link>
          </el-form-item>

          <div v-show="moreSerch">
            <el-form-item label="服务名称" prop="serviceName">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable default-first-option v-model="form.productId">
                <el-option v-for="item in productList" :key="item.id" :value="item.id" :label="item.productName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家" prop="countryCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable default-first-option @change="countryChange" v-model="form.countryCode">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务进度" prop="progressBar">
              <el-select style="width: 168px" v-model="form.progressBar" size="small" clearable filterable placeholder="请选择">
                <el-option :value="item.progressBar + ''" :label="item.progressBarName" v-for="item in tabs" :key="item.progressBar"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态" prop="status">
              <el-select style="width: 168px" v-model="form.status" size="small" clearable filterable placeholder="请选择">
                <el-option :value="item.value + ''" :label="item.label" v-for="item in statusList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客服" prop="countryCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable default-first-option v-model="form.customerSupportId">
                <el-option v-for="item in customerSupportList" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交付专员" prop="countryCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable default-first-option v-model="form.disposeId">
                <el-option v-for="item in userList" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务创建时间" prop="createTime" label-width="125px">
              <el-date-picker
                v-model="form.createTime"
                type="daterange"
                align="right"
                size="small"
                clearable
                unlink-panels
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                range-separator="到"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="[, '23:59:59']"
                style="width: 340px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="上传资料清单时间" prop="handleTime" label-width="125px">
              <el-date-picker
                v-model="form.handleTime"
                type="daterange"
                align="right"
                size="small"
                clearable
                unlink-panels
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                range-separator="到"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="[, '23:59:59']"
                style="width: 340px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="提交服务商时间" prop="sendProviderTime" label-width="125px">
              <el-date-picker
                v-model="form.sendProviderTime"
                type="daterange"
                align="right"
                size="small"
                clearable
                unlink-panels
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                range-separator="到"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="[, '23:59:59']"
                style="width: 340px"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="标记完成时间" prop="completeTime" label-width="125px">
              <el-date-picker
                v-model="form.completeTime"
                type="daterange"
                align="right"
                size="small"
                clearable
                unlink-panels
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                range-separator="到"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="[, '23:59:59']"
                style="width: 340px"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <div style="display: flex">
        <div style="flex: 9">
          <el-tabs ref="elTabs" v-model="tabNav" @tab-click="tabClick">
            <el-tab-pane name="-1" :label="'全部' + '(' + totalCount + ')'"></el-tab-pane>
            <el-tab-pane :label="item.progressBarName + '(' + item.count + ')'" :name="item.progressBar + ''" v-for="item in tabs" :key="item.progressBar"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" row-key="id" :reserve-selection="true" @selection-change="handleSelectionChange" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
        <el-table-column align="center" width="200" label="服务号" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <el-table-column align="center" width="150" label="公司" show-overflow-tooltip prop="companyNameZh">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            <span class="show-tooltip" v-if="scope.row.companyNameZh">{{ scope.row.companyNameZh }}</span>
            <span class="show-tooltip" v-else style="color: darkgray">暂无</span>
          </span>
        </el-table-column>
        <el-table-column align="center" width="150" label="客户手机号" show-overflow-tooltip prop="userMobile"></el-table-column>
        <el-table-column align="center" width="150" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="服务商/律师" show-overflow-tooltip prop="supplierName">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            <el-link type="primary" class="el-icon-edit show-tooltip-icon" @click="changeServiceProvider('single', scope.row)" v-show="hasAuthority('Z1_8')"></el-link>
            <span class="show-tooltip">{{ scope.row.supplierName || scope.row.attorneyName }}</span>
          </span>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务名称" show-overflow-tooltip prop="serviceSpecName"></el-table-column>
        <el-table-column align="center" width="150" label="创建时间" show-overflow-tooltip prop="createTime" sortable></el-table-column>
        <!-- <el-table-column align="center" width="150" label="所属公司" show-overflow-tooltip prop="">
          <template>{{ enterpriseName }}</template>
        </el-table-column> -->
        <el-table-column align="center" width="150" label="服务状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务进度" show-overflow-tooltip prop="progressBar">
          <template slot-scope="scope">
            <span>{{ scope.row.progressBar | filterProgressBar }}</span>
            <br />
            <span style="color: red; cursor: pointer" @click="(checkRejectInfoDialog = true), (rejectInfo = scope.row.rejectReason)" v-if="scope.row.progressBar == progressBarObj.WAIT_UPLOAD && scope.row.rejectReason"> （被驳回） </span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" label="订单详情" show-overflow-tooltip prop="sendTime">
          <template slot-scope="scope">
            <el-link @click="showDetailDialog(scope.row.id)" type="primary" v-show="hasAuthority('Z1_9')">
              <i class="icon icon-search-small"></i>
              查看
            </el-link>
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" label="客服" show-overflow-tooltip prop="disposeName">
          <template slot-scope="scope">
            <el-link v-if="hasAuthority('Z1_11') && !scope.row.customerSupportName" @click="customerSupportClaim(scope.row)" type="primary">
              <i class="icon icon-claim-small"></i>
              认领
            </el-link>
            <span v-else>{{ scope.row.customerSupportName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" label="交付专员" show-overflow-tooltip prop="disposeName">
          <template slot-scope="scope">
            <el-link v-if="hasAuthority('Z1_14') && !scope.row.disposeName" @click="managerClaim(scope.row.id)" type="primary">
              <i class="icon icon-claim-small"></i>
              认领
            </el-link>
            <span v-else>{{ scope.row.disposeName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="200" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top">
              <el-link type="primary" :underline="false" @click="detail(scope.row)" v-show="hasAuthority('Z1_12')">
                <i class="icon icon-see"></i>
                <!-- 详情 -->
              </el-link>
            </el-tooltip>
            <el-tooltip content="添加备注" placement="top">
              <el-link type="primary" :underline="false" @click="addProgress(scope.row)" v-if="hasAuthority('Z1_13')">
                <i class="icon icon-add"></i>
              </el-link>
            </el-tooltip>

            <el-tooltip content="标记完成" placement="top">
              <el-link type="primary" :underline="false" @click="markComplete(scope.row)" v-if="hasAuthority('Z1_15') && scope.row.progressBar === progressBarObj.PROCESSING">
                <i class="icon icon-complete"></i>
                <!-- 标记完成 -->
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddProgressDialog :addProgressDialog.sync="addProgressDialog" :id="checkId"></AddProgressDialog>
    <DetailDialog :detailDialog.sync="detailDialog" :id="checkId"></DetailDialog>
    <ChangeManagerDialog :changeManagerDialog.sync="changeManagerDialog" :ids="checkIds" @refresh="getList" :userList="userList"></ChangeManagerDialog>
    <ChangeCustomerServiceDialog :changeCustomerServiceDialog.sync="changeCustomerServiceDialog" :ids="checkIds" @refresh="getList" :userList="customerSupportList"></ChangeCustomerServiceDialog>
    <ChangeCommDialog :changeCommDialog.sync="changeCommDialog" :ids="checkIds" @refresh="getList"></ChangeCommDialog>
    <UploadDataListingDialog :UploadDataListingDialog.sync="UploadDataListingDialog" :ids="checkIds" @refresh="getList"></UploadDataListingDialog>
    <ChangeServiceProviderDialog :changeServiceProviderDialog.sync="changeServiceProviderDialog" :ids="ids" :countryName="countryName" :countryCode="countryCode" @refresh="getList"></ChangeServiceProviderDialog>
    <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :rejectInfo="rejectInfo" @refresh="getList"></CheckRejectInfoDialog>
    <BatchDownloadDialog :batchDownloadDialog.sync="batchDownloadDialog" contentText="客户上传资料" :checkIds="checkIds" />
    <BatchSubmitProviderDialog :batchSubmitProviderDialog.sync="batchSubmitProviderDialog" :checkIds="checkIds" />
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import * as comps from './components/index';
import { progressBarObj, progressBarList } from './enumObj';
import { getSimpleWorkOrderList, dispose, batchDispose, supplyChain, batchSupplyChain, changeStatus, batchStatus, exportWorkOrder, customerSupportApi } from '@/api/newApi/simpleWorkOrder/otherService.js';
import { getProductList } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { getCountrySelectList } from '@/api/newApi/common.js';
import cacheQuery from '@/mixins/cacheQuery';
import { getUserListByRole } from '@/api/newApi/common';
import BatchDownloadDialog from '@/view/module/workOrder/components/batchDownloadDialog.vue';
import BatchSubmitProviderDialog from '@/view/module/workOrder/components/batchSubmitProviderDialog.vue';
export default {
  data() {
    return {
      enterpriseName: localStorage.getItem('enterpriseName'),
      list: [],
      tabNav: '-1',
      progressBarObj: progressBarObj,
      tabs: [],
      totalCount: 0,
      total: 0,
      form: {
        page: 1,
        limit: 20,
        countryCode: '',
        mobile: '',
        orderNo: '',
        serviceName: '',
        serviceNo: '',
        progressBar: '',
        companyNameZh: '',
        companyNameEn: '',
        productId: '',
        customerSupportId: '',
        disposeId: '',
        createTime: [],
        handleTime: [],
        sendProviderTime: [],
        completeTime: [],
        status: '',
      },
      cacheKey: 'form',
      copyListQuery: {},
      exportForm: {},
      countrySelectList: [],
      customerSupportList: [],
      tableLoading: false,
      searchFlag: false,
      detailDialog: false, // 详情弹窗显示
      addProgressDialog: false, // 添加进度弹窗显示
      changeManagerDialog: false, // 更改交付专员弹框显示
      changeCustomerServiceDialog: false, // 更改客服弹框显示
      changeCommDialog: false, // 更改供应链专员弹框显示
      changeServiceProviderDialog: false, // 更改供应商/律师弹框
      changeCompanyDialog: false, // 更改公司弹框
      UploadDataListingDialog: false, // 上传资料清单弹框
      checkRejectInfoDialog: false, // 查看驳回信息弹框
      batchSubmitProviderDialog: false, // 修改服务商弹框
      checkId: '0',
      checkItem: {},
      checkIds: [],
      moreSerch: false,
      disposeEmpty: false,
      userList: [],
      countryName: '',
      countryCode: '',
      selectList: [],
      ids: [],
      productList: [],
      rejectInfo: '',
      unUploaded: false,
      statusList: [
        { value: 1, label: '服务中' },
        // { value: 2, label: "待续费" },
        { value: 3, label: '税号注销' },
        { value: 4, label: '已转出' },
        { value: 9, label: '已取消' },
        { value: 11, label: '取消中' },
        { value: 10, label: '封存' },
      ],
      batchDownloadDialog: false,
    };
  },
  mixins: [cacheQuery],
  components: {
    ...comps,
    BatchDownloadDialog,
    BatchSubmitProviderDialog,
  },
  filters: {
    filterProgressBar(progressBar) {
      let result = progressBarList.find((item) => item.value === progressBar);
      return result ? result.label : '';
    },
    filterStatus(status) {
      switch (status) {
        case 1:
          return '服务中';
        case 2:
          return '待续费';
        case 3:
          return '税号注销';
        case 4:
          return '已转出';
        case 9:
          return '已取消';
        case 11:
          return '取消中';
        case 10:
          return '封存';
      }
    },
  },
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this._getCountrySelectList();
    this.getList();
    this.getUserList();
    this.getCustomerSupportList();
    this.getProductFunc();
  },
  methods: {
    formatTime() {
      [this.form.createStartTime, this.form.createEndTime] = this.form.createTime && this.form.createTime.length ? this.form.createTime : ['', ''];
      [this.form.referStartTime, this.form.referEndTime] = this.form.handleTime && this.form.handleTime.length ? this.form.handleTime : ['', ''];
      [this.form.completeStartTime, this.form.completeEndTime] = this.form.completeTime && this.form.completeTime.length ? this.form.completeTime : ['', ''];
      [this.form.submitServiceStartTime, this.form.submitServiceEndTime] = this.form.sendProviderTime && this.form.sendProviderTime.length ? this.form.sendProviderTime : ['', ''];
    },
    getList() {
      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      let { createTime, handleTime, completeTime, sendProviderTime, ...formData } = this.form;
      getSimpleWorkOrderList(formData)
        .then((res) => {
          let pageData = res.data.pageData;
          // this.list = pageData.records;

          if (pageData.records && pageData.records.length) {
            this.list = pageData.records.map((item) => {
              let serviceSpecName = item.serviceName;
              if (item.specName) {
                serviceSpecName += `(${item.specName})`;
              }
              return { ...item, serviceSpecName };
            });
          } else {
            this.list = [];
          }

          this.total = parseInt(pageData.total);
          this.tableLoading = false;
          this.tabNav = this.form.progressBar === '' ? '-1' : this.form.progressBar;
          this.exportForm = { ...this.form };
          this.tabs = res.data.statistics;
          this.totalCount = this.tabs.reduce((pre, cur) => {
            return pre + (cur.count - 0);
          }, 0);
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: 'success',
              duration: 2000,
            });
            this.searchFlag = false;
          }
        })
        .catch((err) => {
          this.searchFlag = false;
        });
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    countryChange() {
      this.getProductFunc();
      this.form.productId = '';
    },
    // 获取列表查询服务名称
    getProductFunc() {
      getProductList({ size: -1, functionCode: this.$constant.SIMPLE_WORK_ORDER, countryCode: this.form.countryCode }).then((res) => {
        if (res.code == 0) {
          this.productList = res.data.records;
        }
      });
    },
    // 获取交付专员
    getUserList() {
      getUserListByRole({
        roleCode: `${this.$constant.DELIVERY_ELEMENTARY},${this.$constant.DELIVERY_INTERMEDIATE}`,
      }).then((res) => {
        this.userList = res.data;
      });
    },
    // 获取客服
    getCustomerSupportList() {
      getUserListByRole({
        roleCode: `${this.$constant.VAT_CUSTOMER_SERVICE},${this.$constant.TRADEMARK_CUSTOMER_SERVICE}`,
      }).then((res) => {
        this.customerSupportList = res.data;
      });
    },
    handleSelectionChange(val) {
      this.checkIds = val.map((item) => item.id);
      this.selectList = val;
      this.disposeEmpty = val.some((item) => !item.disposeName);
      this.unUploaded = val.some((item) => item.progressBar == 1);
    },
    tabClick() {
      this.form.progressBar = this.tabNav === '-1' ? '' : this.tabNav;
      this.form.page = 1;
      this.getList();
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getList();
    },
    reset() {
      // if(this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields()
      // }
      this.form = { ...this.copyListQuery };
      this.getProductFunc();
      this.removePageCache();
    },
    // 交付专员批量认领
    // managerBatchClaim() {
    //   if (!this.checkIds.length) {
    //     this.$message.warning("需要勾选操作的工单");
    //     return;
    //   }
    //   this.$confirm("是否确认交付专员认领", "认领", {
    //     customClass: "custom-confirm",
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   }).then(() => {
    //     batchDispose({
    //       ids: this.checkIds
    //     }).then(res => {
    //       this.getList();
    //     });
    //   });
    // },
    // 供应链专员批量认领
    // commBatchClaim() {
    //   if (!this.checkIds.length) {
    //     this.$message.warning("需要勾选操作的工单");
    //     return;
    //   }
    //   if (this.disposeEmpty) {
    //     this.$message.warning("工单无匹配数据，请交付专员认领工单！");
    //     return;
    //   }
    //   this.$confirm("是否确认供应链专员认领", "认领", {
    //     customClass: "custom-confirm",
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   }).then(() => {
    //     batchSupplyChain({
    //       ids: this.checkIds
    //     }).then(res => {
    //       this.getList();
    //     });
    //   });
    // },
    // // 批量标记处理中
    // BatchMarkProcessing() {
    //   if (!this.checkIds.length) {
    //     this.$message.warning("需要勾选操作的工单");
    //     return;
    //   }
    //   if (this.disposeEmpty) {
    //     this.$message.warning("工单无匹配数据，请交付专员认领工单！");
    //     return;
    //   }
    //   this.$confirm("是否标记处理中", "提示", {
    //     customClass: "custom-confirm",
    //     confirmButtonText: "继续",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   }).then(() => {
    //     batchStatus({
    //       ids: this.checkIds,
    //       progressBar: this.progressBarObj.PROCESSING
    //     }).then(res => {
    //       this.getList();
    //     });
    //   });
    // },
    // 更改交付专员
    changeManager() {
      if (!this.checkIds.length) {
        this.$message.warning('需要勾选操作的工单');
        return;
      }
      this.changeManagerDialog = true;
    },
    // 更改客服弹
    changeCustomerService() {
      if (!this.checkIds.length) {
        this.$message.warning('需要勾选操作的工单');
        return;
      }
      if (this.disposeEmpty && this.unUploaded) {
        this.$message.warning('工单无匹配数据，请交付专员认领工单！');
        return;
      }
      this.changeCustomerServiceDialog = true;
    },
    // 上传资料清单
    UploadDataListing() {
      if (!this.checkIds.length) {
        this.$message.warning('需要勾选操作的工单');
        return;
      }
      // 验证勾选的服务单（国家和服务名称）是否一致
      if (!this.checkServiceName()) return;
      this.UploadDataListingDialog = true;
    },
    // 验证服务名称及国家 是否一致
    checkServiceName() {
      let isMeet = this.selectList.every((item) => {
        if (item.countryCode !== this.selectList[0].countryCode && item.productId !== this.selectList[0].productId) {
          return false;
        }
        return true;
      });
      if (!isMeet) {
        this.$message.warning('不符合批量操作要求，请确认勾选的服务单（国家和服务名称）一致！');
        return false;
      }
      return true;
    },
    // 更改供应链专员
    changeCommissioner() {
      if (!this.checkIds.length) {
        this.$message.warning('需要勾选操作的工单');
        return;
      }
      this.changeCommDialog = true;
    },
    // 导出
    _export() {
      this.formatTime();
      let { page, limit, ...data } = { ...this.exportForm };
      if (this.checkIds.length) {
        data.ids = this.checkIds.join(',');
      }
      exportWorkOrder(data).then((res) => {
        this.$util.exportExcel(res);
      });
    },
    showDetailDialog(id) {
      this.checkId = id;
      this.detailDialog = true;
    },
    // 交付专员认领
    managerClaim(id) {
      this.$confirm('是否确认交付专员认领？', '认领', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        dispose(id).then((res) => {
          this.getList();
        });
      });
    },
    // 客服认领
    customerSupportClaim(row) {
      if (!row.disposeName && row.progressBar == 1) {
        this.$message.warning('工单无匹配数据，请交付专员认领工单！');
        return;
      }
      this.$confirm('是否确认客服认领？', '认领', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        customerSupportApi(row.id).then((res) => {
          this.getList();
        });
      });
    },
    // 供应链专员认领
    // commClaim(row) {
    //   if (!row.disposeName) {
    //     this.$message.warning("该工单无匹配数据，请交付专员认领工单！");
    //     return;
    //   }
    //   this.$confirm("是否确认供应链专员认领？", "认领", {
    //     customClass: "custom-confirm",
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   }).then(() => {
    //     supplyChain(row.id).then(res => {
    //       this.getList();
    //     });
    //   });
    // },
    // 更改公司
    // changeCompany(row) {
    //   if (!row.disposeName) {
    //     this.$message.warning("该工单无匹配数据，请交付专员认领工单！");
    //     return;
    //   }
    //   this.$prompt("", "修改服务公司", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     inputPattern: /.+/,
    //     inputPlaceholder: "请输入公司名称",
    //     inputErrorMessage: "请输入公司名称",
    //     inputValue: row.companyNameZh
    //   }).then(({ value }) => {
    //     changeSimpleWorkOrderCompany({
    //       id: row.id,
    //       companyNameZh: value
    //     }).then(res => {
    //       if (res.code === 0) {
    //         this.$message.success("修改成功！");
    //         this.getList();
    //       }
    //     });
    //   });
    //   // this.checkId = row.id
    //   // this.checkItem = row
    //   // this.changeCompanyDialog = true
    // },
    // 批量修改服务商/律师
    changeServiceProviderBatch() {
      this.changeServiceProvider('batch');
    },
    // 修改服务商/律师
    changeServiceProvider(key, row) {
      if (row) this.checkId = row.id;
      if (!this.checkIds.length && key == 'batch') {
        this.$message.warning('需要勾选操作的工单');
        return;
      }
      if ((key == 'batch' && this.disposeEmpty && this.unUploaded) || (key == 'single' && !row.disposeName && row.progressBar == 1)) {
        this.$message.warning('工单无匹配数据，请交付专员认领工单！');
        return;
      }
      if (key == 'batch') {
        this.countryName = this.selectList[0].countryNameZh;
        this.countryCode = this.selectList[0].countryCode;
        this.ids = this.checkIds;
        // 验证勾选的服务单（国家和服务名称）是否一致
        if (!this.checkServiceName()) return;
      } else {
        this.countryName = row.countryNameZh;
        this.countryCode = row.countryCode;
        this.ids = [row.id];
      }
      this.changeServiceProviderDialog = true;
    },
    /**
     * 下载客户资料
     */
    batchDownload() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      this.batchDownloadDialog = true;
    },
    /**
     * 提交服务商
     */
    batchSubmitProvider() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      if (this.selectList.some((item) => item.countryCode !== this.selectList[0].countryCode || item.countryNameZh !== this.selectList[0].countryNameZh || item.supplierId !== this.selectList[0].supplierId)) {
        this.$message.warning('请选择同一国家同一服务商的工单');
        return;
      }
      this.batchSubmitProviderDialog = true;
    },
    toUploadAndDownloadRecords() {
      this.$router.push({
        path: '/workOrder/uploadAndDownloadRecords',
      });
    },
    // 跳转详情页面
    detail(row) {
      this.$router.push({
        name: 'VATOtherServiceDetail',
        query: {
          id: row.id,
        },
      });
    },
    // 添加进度
    addProgress(row) {
      if (!row.disposeName && row.progressBar == 1) {
        this.$message.warning('工单无匹配数据，请交付专员认领工单！');
        return;
      }
      this.checkId = row.id;
      this.addProgressDialog = true;
    },
    // 标记处理中
    // markProcessing(row) {
    //   if (!row.disposeName) {
    //     this.$message.warning("该工单无匹配数据，请交付专员认领工单！");
    //     return;
    //   }
    //   this.$confirm("是否标记处理中", "提示", {
    //     customClass: "custom-confirm",
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   }).then(() => {
    //     changeStatus({
    //       id: row.id,
    //       progressBar: this.progressBarObj.PROCESSING
    //     }).then(res => {
    //       if (res.code === 0) {
    //         this.$message.success("标记成功");
    //         this.getList();
    //       }
    //     });
    //   });
    // },
    // 标记完成
    markComplete(row) {
      if (!row.disposeName) {
        this.$message.warning('该工单无匹配数据，请交付专员认领工单！');
        return;
      }
      this.$confirm('是否标记完成', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        changeStatus({
          id: row.id,
          progressBar: this.progressBarObj.COMPLETE,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('标记成功');
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
.header-btn-group {
  text-align: right;
  .el-button {
    // width: 140px;
    margin-bottom: 5px;
  }
}
</style>
