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
          <el-form-item label="公司中文名称" prop="companyNameZh">
            <el-input v-model="form.companyNameZh" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
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
                  <el-dropdown-item command="changeManager" v-show="hasAuthority('D2_2')">修改交付专员</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-form-item>

          <div v-show="moreSerch">
            <el-form-item label="客户手机号" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="服务进度" prop="currentNodeCN">
              <el-select style="width: 168px" v-model="form.currentNodeCN" placeholder="服务进度" clearable filterable @change="changeProcess">
                <el-option v-for="(item, index) in progressList" :key="index" :label="item.nodeName" :value="item.nodeCode + '_' + item.nodeValue" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家" prop="country">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable @change="countryChange" v-model="form.countryCode">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务分类" prop="functionCode">
              <el-select style="width: 168px" v-model="form.functionCode" size="small" clearable placeholder="请选择">
                <el-option :label="item.label" :value="item.value" v-for="(item, index) in productFunctionList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务商" prop="supplierId">
              <el-select style="width: 168px" v-model="form.supplierId" size="small" clearable filterable placeholder="请选择">
                <el-option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.shortName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态" prop="status">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.status">
                <el-option v-for="item in filterStatusList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交付专员" prop="disposeId">
              <el-select style="width: 168px" v-model="form.disposeId" size="small" clearable filterable placeholder="请选择">
                <el-option v-for="item in managerList" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客服" prop="customerId">
              <el-select style="width: 168px" v-model="form.customerId" placeholder="客服" clearable filterable>
                <el-option v-for="(item, index) in commissionerList" :key="index" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="工单创建时间" prop="cre">
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

            <el-form-item label="续费完成时间" prop="completeTime">
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
      <el-tabs ref="elTabs" v-model="tabNav" @tab-click="tabClick">
        <el-tab-pane name="-2" label="全部"></el-tab-pane>
        <el-tab-pane :label="item.nodeName" :name="item.nodeCode" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
      </el-tabs>
      <el-table ref="elTables" border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
        <el-table-column align="center" width="200" label="注册服务号" show-overflow-tooltip prop="parentServiceNo"></el-table-column>
        <el-table-column align="center" width="200" label="服务号" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <!-- <el-table-column align="center" width="200" label="工单号" show-overflow-tooltip prop="workNo"></el-table-column> -->

        <el-table-column align="center" width="100" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="业务分类" show-overflow-tooltip prop="productFunctionCodeName"> </el-table-column>
        <el-table-column align="center" width="250" label="服务名称" show-overflow-tooltip prop="serviceName">
          <span slot-scope="scope">
            {{ scope.row.serviceName + '(' + scope.row.specName + ')' }}
          </span>
        </el-table-column>

        <el-table-column align="center" width="150" label="当前服务进度" show-overflow-tooltip prop="nodeCodeName"> </el-table-column>
        <el-table-column align="center" width="150" label="公司中文名称" show-overflow-tooltip prop="companyNameZh"></el-table-column>

        <el-table-column align="center" width="150" label="服务商" show-overflow-tooltip prop="supplierName">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            <el-link type="primary" class="el-icon-edit show-tooltip-icon" @click="changeServiceProvider(scope.row)" v-if="['NODE0361', 'NODE0362', 'NODE0363', ''].includes(scope.row.nodeCode)"></el-link>
            <span class="show-tooltip">{{ scope.row.supplierName }}</span>
          </span>
        </el-table-column>

        <el-table-column align="center" width="150" label="服务状态" show-overflow-tooltip prop="supplierName">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            {{ scope.row.status | filterStatus(filterStatusList) }}
          </span>
        </el-table-column>

        <el-table-column align="center" width="150" label="年份" show-overflow-tooltip prop="supplierName">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            <span class="show-tooltip">{{ scope.row.year || '' }}</span>
          </span>
        </el-table-column>

        <el-table-column align="center" label="处理人" width="150">
          <template slot-scope="scope">
            <span style="white-space: pre-wrap">{{ scope.row.handler }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="70" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top" v-if="scope.row.flowId">
              <el-link type="primary" :underline="false" @click="detail(scope.row)">
                <i class="icon icon-see"></i>
                <!-- 查看 -->
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
    <ChangeManagerDialog :changeManagerDialog.sync="changeManagerDialog" :userList="managerList" :commissionerList="commissionerList" :serviceIdColl="checkIds" @refresh="getList" :handlerType="handlerType"></ChangeManagerDialog>
    <ChangeServiceProviderDialog :changeServiceProviderDialog.sync="changeServiceProviderDialog" :rowSupplierList="rowSupplierList" @changeProvider="changeProvider"></ChangeServiceProviderDialog>
  </div>
</template>

<script>
// import * as comps from '../EPRManage/components/index';
import ChangeManagerDialog from './components/changeManagerDialog';
import { getDisposelist, serviceProgress, getCountrySelectList, getUserListByRole, getSupplierList } from '@/api/newApi/common.js';
import { getEprRenewalListAPI, modifyProvider } from '@/api/newApi/workOrder/eprRenewal';
import cacheQuery from '@/mixins/cacheQuery';

import ChangeServiceProviderDialog from './components/changeServiceProviderDialog';

export default {
  name: 'xcloudplat_workOrder_EPRRenewal',
  data() {
    return {
      list: [],
      tabNav: '-2',
      tabs: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        companyNameZh: '',
        mobile: '',
        serviceNo: '',
        countryCode: '',
        status: '',
        declarePeriod: '',
        supplierId: '',
        functionCode: '',
        currentNodeCode: '',
        disposeId: '',
        customerId: '',
        searchKeyword: '',
        completeTime: [],
        createTime: [],
      },
      productFunctionList: [
        { label: '电池法', value: 3131 },
        { label: '包装法', value: 3132 },
        { label: '纺织法', value: 3133 },
        { label: '家具法', value: 3134 },
        { label: '印刷法', value: 3135 },
        { label: '轮胎法', value: 3136 },
        { label: '玩具法', value: 3137 },
        { label: 'WEEE', value: 3138 },
      ],
      cacheKey: 'form',
      copyListQuery: {},
      managerList: [],
      countrySelectList: [],
      supplierList: [],
      tableLoading: false,
      searchFlag: false,
      changeManagerDialog: false,
      commissionerList: [],
      filterStatusList: [
        { label: '正常(服务中)', value: 1 },
        { label: '待续费', value: 2 },
        { label: '取消中', value: 11 },
        { label: '已取消', value: 9 },
      ],
      checkIds: [],
      moreSerch: false,
      progressList: [],
      serviceNos: [],
      rowSupplierList: [],
      checkItem: {},
      changeServiceProviderDialog: false,
      handlerType: null,
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
    // ...comps,
    ChangeManagerDialog,
    ChangeServiceProviderDialog,
  },
  filters: {
    filterStatus(status, filterStatusList) {
      let result = filterStatusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    // this.getServiceNode();
    this.getServiceProgress();
    this.getCountry();
    this.getCustomerList(); //客服
    this.getManagerList();
  },
  methods: {
    formatTime() {
      [this.form.beginTime, this.form.endTime] = this.form.createTime && this.form.createTime.length ? this.form.createTime : ['', ''];
      [this.form.completeStart, this.form.completeEnd] = this.form.completeTime && this.form.completeTime.length ? this.form.completeTime : ['', ''];
    },

    changeProcess(val) {
      if (val) {
        this.form.progressBar = val.split('_')[1];
        this.form.currentNodeCode = val.split('_')[0];
      } else {
        this.form.progressBar = '';
        this.form.currentNodeCode = '';
      }
    },
    getList() {
      if (this.form.currentNodeCode) {
        this.tabNav = this.form.currentNodeCode;
      } else {
        this.tabNav = '-2';
      }
      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      let { createTime, completeTime, currentNodeCN, ...formData } = this.form;
      getEprRenewalListAPI(formData)
        .then((res) => {
          if (res.data.records && res.data.records.length) {
            this.list = res.data.records;
          } else {
            this.list = [];
          }

          this.total = parseInt(res.data.total);
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
    changeServiceProvider(row) {
      this.checkItem = row;
      this.changeServiceProviderDialog = true;
      this.getRowSuppliers(row);
    },
    changeProvider(val) {
      modifyProvider({
        supplierId: val.supplierId,
        workIdColl: [this.checkItem.workOrderId],
      }).then((res) => {
        this.changeServiceProviderDialog = false;
        if (res.code === 0) {
          this.getList();
          if (JSON.stringify(res.data) === '{}') {
            this.$message.success('修改成功');
          } else if (res.data) {
            this.$alert(res.data, '', {});
          }
        }
      });
    },

    // 列表查询服务进度列表
    getServiceProgress() {
      serviceProgress({ functionCode: 3130 })
        .then((res) => {
          if (res.code == 0) {
            this.progressList = res.data;
            this.tabs = res.data.filter((item) => item.nodeValue == 1);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    // 获取交付专员列表
    getManagerList() {
      getDisposelist({
        functionCodes: '3131,3132,133,3134,3135,3136,3137,3138',
      }).then((res) => {
        this.managerList = res.data;
      });
    },
    // 获取服务商列表
    getSuppliers() {
      getSupplierList({
        page: 1,
        limit: 9999,
        functionCodeColl: [3131, 3132, 3133, 3134, 3135, 3136, 3137, 3138],
        supplierType: 1,
        countryCode: this.form.countryCode,
      }).then((res) => {
        this.supplierList = res.data;
      });
    },

    getRowSuppliers(row) {
      getSupplierList({
        page: 1,
        limit: 9999,
        functionCode: row.productFunctionCode,
        countryCode: row.countryCode,
        flow: true,
      }).then((res) => {
        this.rowSupplierList = res.data;
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
      this.checkIds = val.map((item) => item.workOrderId);
    },
    tabClick() {
      this.form.page = 1;
      this.form.currentNodeCode = this.tabNav == '-2' ? '' : this.tabNav;
      this.form.progressBar = '';
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
        path: '/EPRRenewal/detail',
        query: {
          workOrderId: row.workOrderId,
          serviceId: row.serviceId,
        },
      });
    },
    reset() {
      this.form.progressBar = '';
      this.supplierList = [];
      this.tabNav = '-2';
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
