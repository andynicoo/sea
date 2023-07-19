<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="110px">
          <el-form-item label="搜索内容" prop="searchKeyword">
            <el-tooltip content="支持服务号/订单号搜索" placement="top">
              <el-input v-model="form.searchKeyword" placeholder="服务号/订单号" type="textarea" :rows="1" clearable style="width: 168px" size="small" />
            </el-tooltip>
          </el-form-item>
          <!-- <el-form-item label="服务号" prop="serviceNo">
            <el-input v-model="form.serviceNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item> -->
          <el-form-item label="公司中文名称" prop="companyNameZh">
            <el-input v-model="form.companyNameZh" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索</el-button>
            <el-button size="small" icon="el-icon-refresh-left" @click="reset"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-dropdown @command="(c) => this[c]()" style="margin-left: 20px">
                <el-button type="primary">功能按钮<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="changeManager" v-show="hasAuthority('p2_1')">修改交付专员</el-dropdown-item>
                  <el-dropdown-item command="batchChangeCustom" v-show="hasAuthority('p2_2')">修改客服</el-dropdown-item>
                  <el-dropdown-item command="batchUploadReceipt" v-if="tabNav === '1'" v-show="hasAuthority('D2_3')">上传回执</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-link type="primary" :underline="false" @click="toUploadAndDownloadRecords">上传/下载中心</el-link>
            </div>
          </el-form-item>

          <div v-show="moreSerch">
            <el-form-item label="客户手机号" prop="userMobile">
              <el-input v-model="form.userMobile" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="服务进度" prop="status">
              <el-select style="width: 168px" v-model="form.status" placeholder="服务进度" clearable filterable>
                <el-option v-for="(item, index) in progressBarList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家" prop="countryCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable @change="countryChange" v-model="form.countryCode">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="业务分类" prop="functionCode">
              <el-select style="width: 168px" v-model="form.type" size="small" clearable placeholder="请选择">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) in productFunctionList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务商" prop="supplierId">
              <el-select style="width: 168px" v-model="form.supplierId" size="small" clearable filterable placeholder="请选择">
                <el-option v-for="item in supplierList" :key="item.supplierId" :value="item.supplierId" :label="item.shortName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态" prop="serviceStatus">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.serviceStatus">
                <el-option v-for="item in filterStatusList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交付专员" prop="declareUserId">
              <el-select style="width: 168px" v-model="form.declareUserId" size="small" clearable filterable placeholder="请选择">
                <el-option v-for="item in managerList" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客服" prop="customerId">
              <el-select style="width: 168px" v-model="form.customerId" placeholder="客服" clearable filterable>
                <el-option v-for="(item, index) in commissionerList" :key="index" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="周期类型" prop="declarePeriod">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.declarePeriod">
                <el-option :value="0" label="月报"></el-option>
                <el-option :value="1" label="季报"></el-option>
                <el-option :value="2" label="年报"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="申报区间" prop="createTime">
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
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="tabNav" @tab-click="tabClick">
        <el-tab-pane name="-1" label="全部"></el-tab-pane>
        <el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
      </el-tabs>
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
        <!-- <el-table-column align="center" width="200" label="注册服务号" show-overflow-tooltip prop="parentServiceNo"></el-table-column> -->
        <el-table-column align="center" width="200" label="服务号" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <el-table-column align="center" width="200" label="工单号" show-overflow-tooltip prop="workNo"></el-table-column>
        <el-table-column align="center" width="100" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="120" label="业务分类">
          <span slot-scope="scope">
            <span>{{ scope.row.type | typeFilter }}</span>
          </span>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务名称" show-overflow-tooltip prop="serviceSpecName"></el-table-column>
        <el-table-column align="center" width="200" label="申报区间" show-overflow-tooltip>
          <span slot-scope="scope">
            <span>{{ scope.row.beginTime }} - {{ scope.row.endTime }}</span>
          </span>
        </el-table-column>
        <el-table-column align="center" label="周期类型" show-overflow-tooltip>
          <span slot-scope="scope">
            <span>{{ scope.row.declarePeriod | filterPeriod }}</span>
          </span>
        </el-table-column>
        <el-table-column align="center" width="120" label="申报截止日期" show-overflow-tooltip prop="due"></el-table-column>

        <el-table-column align="center" width="120" label="当前服务进度" show-overflow-tooltip prop="status">
          <span slot-scope="scope">
            {{ scope.row.status | filterStatus(progressBarList) }}
          </span>
        </el-table-column>
        <el-table-column align="center" width="150" label="公司中文名称" show-overflow-tooltip prop="companyNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="服务商" show-overflow-tooltip prop="supplierName">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            <span class="show-tooltip">{{ scope.row.supplierName }}</span>
          </span>
        </el-table-column>

        <el-table-column align="center" label="处理人" width="150">
          <template slot-scope="scope">
            <span style="white-space: pre-wrap">{{ scope.row.handler }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="70" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top" v-show="hasAuthority('J2_6')">
              <el-link type="primary" :underline="false" @click="detail(scope.row)">
                <i class="icon icon-see"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <ChangeManagerDialog :changeManagerDialog.sync="changeManagerDialog" linkFrom="preDeclare" :userList="managerList" :commissionerList="commissionerList" :serviceIdColl="checkIds" @refresh="getList" :handlerType="handlerType"></ChangeManagerDialog>
    <BatchUploadReceipt :show.sync="batchUploadReceiptDialog" @refresh="getList" isPreDeclare="1" />
  </div>
</template>

<script>
import { progressBarList } from './enumObj';
import * as comps from '../EPRManage/components/index';
import { getDisposelist, getCountrySelectList } from '@/api/newApi/common.js';
import { getPreDeclareListAPI } from '@/api/newApi/workOrder/preDeclare';

import ChangeManagerDialog from '../EPRDeclare/components/changeManagerDialog';
import BatchUploadReceipt from '@/view/module/workOrder/components/batchUploadReceipt';

import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';

import cacheQuery from '@/mixins/cacheQuery';
import { getUserListByRole } from '@/api/newApi/common';

export default {
  name: 'xcloudplat_workOrder_preDeclare',
  data() {
    return {
      list: [],
      tabNav: '-1',
      batchUploadReceiptDialog: false,
      tabs: [
        { label: '待预申报', value: '0' },
        { label: '预申报中', value: '1' },
        { label: '预申报完成', value: '2' },
      ],
      productFunctionList: [
        { label: '电池法', value: 3 },
        { label: '包装法', value: 2 },
        { label: '纺织法', value: 4 },
        { label: '家具法', value: 6 },
        { label: '印刷法', value: 7 },
        { label: '轮胎法', value: 5 },
        { label: '玩具法', value: 8 },
        { label: 'WEEE', value: 1 },
      ],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        companyNameZh: '',
        userMobile: '',
        serviceNo: '',
        countryCode: '',
        status: '',
        naturalPerson: '',
        supplierId: '',
        declareUserId: '',
        productId: '',
        searchKeyword: '',
        functionCode: '',
        createTime: [],
        customerId: '',
      },
      cacheKey: 'form',
      copyListQuery: {},
      exportForm: {},
      managerList: [],
      countrySelectList: [{ countryCode: 'FR', countryNameZh: '法国' }],
      supplierList: [],
      tableLoading: false,
      searchFlag: false,
      changeManagerDialog: false,
      // changeServiceProviderDialog: false,
      serviceIds: [],
      changeCustomerModel: false,
      commissionerList: [],
      statusList: [
        { label: '服务中', value: 1 },
        { label: '待续费', value: 2 },
        { label: '已转出', value: 4 },
        { label: '已取消', value: 9 },
        { label: '取消中', value: 11 },
      ],
      filterStatusList: [
        { label: '服务中', value: 1 },
        { label: '已取消', value: 9 },
        { label: '取消中', value: 11 },
      ],
      progressBarList: progressBarList,
      checkIds: [],
      handlerType: null,
      moreSerch: false,
    };
  },
  mixins: [cacheQuery],
  watch: {
    'form.countryCode'(val) {
      if (val) {
        this.getSuppliers();
      } else {
        this.form.supplierId = '';
        this.supplierList = [];
      }
    },
  },
  components: {
    ...comps,
    ChangeManagerDialog,
    BatchUploadReceipt,
  },
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
    typeFilter(type) {
      switch (type) {
        // (1、WEEE 2、包装法 3、电池法 4、纺织法 5、轮胎法)
        case 1:
          return 'WEEE';
        case 2:
          return '包装法';
        case 3:
          return '电池法';
        case 4:
          return '纺织法';
        case 5:
          return '轮胎法';
        default:
          return '';
      }
    },
    filterServiceStatus(serviceStatus) {
      // (0、未购买 1、正常（服务中） 2、待续费 3、税号注销 4.已转出 5.已取消 )
      switch (serviceStatus) {
        case 0:
          return '未购买';
        case 1:
          return '正常（服务中）';
        case 2:
          return '待续费';
        case 4:
          return '纺织法';
        case 5:
          return '轮胎法';
        default:
          return '';
      }
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this.getCountry();
    this.getCustomerList(); //客服
    this.getManagerList();
  },
  methods: {
    formatTime() {
      [this.form.submitDeclarationBegin, this.form.submitDeclarationEnd] = this.form.createTime && this.form.createTime.length ? this.form.createTime : ['', ''];
    },
    toUploadAndDownloadRecords() {
      this.$router.push({
        path: '/workOrder/uploadAndDownloadRecords',
      });
    },
    batchUploadReceipt() {
      this.batchUploadReceiptDialog = true;
    },
    getList() {
      if (this.form.status || this.form.status === 0) {
        this.tabNav = '' + this.form.status;
      } else {
        this.tabNav = '-1';
      }
      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      let { createTime, ...formData } = this.form;

      getPreDeclareListAPI(formData)
        .then((res) => {
          // this.list = res.data.records;
          if (res.data.records && res.data.records.length) {
            this.list = res.data.records.map((item) => {
              let serviceSpecName = item.serviceName;
              if (item.specName) {
                serviceSpecName += `(${item.specName})`;
              }
              return { ...item, serviceSpecName };
            });
          } else {
            this.list = [];
          }
          this.total = parseInt(res.data.total);
          this.exportForm = { ...this.form };
          this.tableLoading = false;
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
    batchChangeCustom() {
      if (this.checkIds.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      this.serviceIds = this.checkIds;
      this.changeManagerDialog = true;
      this.handlerType = 2;
    },
    // 获取客服
    getCustomerList() {
      getUserListByRole({
        roleCode: this.$constant.VAT_CUSTOMER_SERVICE,
      }).then((res) => {
        this.commissionerList = res.data;
      });
    },

    // 获取交付专员列表
    getManagerList() {
      getDisposelist({
        functionCode: this.$constant.EPR_FUNCTION_CODE,
      }).then((res) => {
        this.managerList = res.data;
      });
    },
    // 获取服务商列表
    getSuppliers() {
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCode: this.$constant.EPR_FUNCTION_CODE,
        countryCode: this.form.countryCode,
      }).then((res) => {
        this.supplierList = res.data.records;
      });
    },
    /**
     * 获取国家下拉框数据
     */
    getCountry() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelectList = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    countryChange(val) {
      this.form.supplierId = '';
    },

    handleSelectionChange(val) {
      this.checkIds = val.map((item) => item.workId);
    },
    tabClick() {
      this.form.status = this.tabNav === '-1' ? '' : Number(this.tabNav);
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
    // 修改交付专员
    changeManager() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择数据');
        return;
      }
      this.changeManagerDialog = true;
      this.handlerType = 1;
    },
    detail(row) {
      this.$router.push({
        path: '/preDeclare/detail',
        query: {
          workNo: row.workNo,
        },
      });
    },

    reset() {
      this.form.progressBar = '';
      this.supplierList = [];
      this.tabNav = '-1';
      this.form.status = '';
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
</style>
