<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="110px">
          <el-form-item label="搜索内容" prop="searchKeyword">
            <el-tooltip content="支持服务号/订单号/公司中文名称/公司英文名称搜索" placement="top">
              <el-input v-model="form.searchKeyword" placeholder="服务号/订单号" type="textarea" :rows="1" clearable style="width: 168px" size="small" />
            </el-tooltip>
          </el-form-item>

          <el-form-item label="公司中文名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入" clearable style="width: 168px" size="small" />
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
              <el-button size="small" type="primary" @click="batchRemind" v-if="tabNav === progressBarObj.WAIT_UPLOAD && hasAuthority('J2_2')" class="yellow-btn">
                <i class="icon icon-remind"></i>
                <span>批量提醒</span>
              </el-button>
              <el-button size="small" type="primary" @click="changeManager" class="green-btn" v-show="hasAuthority('J2_3')">
                <i class="icon icon-change"></i>
                <span>修改交付专员</span>
              </el-button>
              <el-button type="success" icon="el-icon-edit" @click="batchChangeCustom" v-show="hasAuthority('J2_24')"> 修改客服 </el-button>
              <el-button size="small" type="primary" @click="_export" class="yellow-btn" v-show="hasAuthority('J2_4')">
                <i class="icon icon-export"></i>
                <span>导出</span>
              </el-button>
            </div>
          </el-form-item>

          <div v-show="moreSerch">
            <el-form-item label="客户手机号" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="服务进度" prop="nodeName">
              <el-select style="width: 168px" v-model="form.nodeName" placeholder="服务进度" clearable filterable @change="changeProgressBar">
                <el-option v-for="(item, index) in progressList" :key="index" :label="item.nodeName" :value="item.nodeName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家" prop="country">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable @change="countryChange" v-model="form.country">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务名称" prop="productId">
              <el-select style="width: 168px" v-model="form.productId" size="small" clearable filterable placeholder="请选择" @change="productChange">
                <el-option :label="item.productName" :value="item.id" v-for="item in productList" :key="item.productId"></el-option>
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
            <el-form-item label="服务创建时间" prop="createTime">
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
            <el-form-item label="审核通过时间" prop="approvedTime">
              <el-date-picker
                v-model="form.approvedTime"
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
            <el-form-item prop="sendProviderTime" label="提交服务商时间">
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
            <el-form-item prop="completeTime" label="注册完成时间">
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
        <el-tab-pane name="-1" label="全部"></el-tab-pane>
        <el-tab-pane :label="item.nodeName" :name="item.nodeCode" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
      </el-tabs>
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
        <el-table-column align="center" width="200" label="注册服务号" show-overflow-tooltip prop="parentServiceNo"></el-table-column>
        <el-table-column align="center" width="200" label="服务号" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <el-table-column align="center" width="150" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="服务名称" show-overflow-tooltip prop="serviceSpecName"></el-table-column>
        <el-table-column align="center" width="150" label="服务进度" show-overflow-tooltip prop="nodeCodeName"></el-table-column>
        <el-table-column align="center" width="150" label="公司中文名称" show-overflow-tooltip prop="companyNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="服务商" show-overflow-tooltip prop="supplierName">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            <span class="show-tooltip">{{ scope.row.supplierName }}</span>
          </span>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">{{ scope.row.status | filterStatus(statusList) }}</template>
        </el-table-column>

        <el-table-column align="center" label="驳回详情" show-overflow-tooltip prop="sender">
          <template slot-scope="scope">
            <el-link v-if="hasAuthority('J2_21') && scope.row.existReject" @click="checkRejectInfo(scope.row)" type="primary">
              <i class="icon icon-search-small"></i>
              查看
            </el-link>
            <span v-else>-</span>
          </template>
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
    <ChangeManagerDialog :changeManagerDialog.sync="changeManagerDialog" :userList="managerList" :serviceIdColl="checkIds" @refresh="getList"></ChangeManagerDialog>
    <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :serviceNo="checkItem.serviceNo"></CheckRejectInfoDialog>
    <!-- <CheckOrderRemarkDialog :checkOrderRemarkDialog.sync="checkOrderRemarkDialog" :orderRemark="orderRemark" /> -->
    <CustomerDialog :typeNum="1" :changeCustomerModel.sync="changeCustomerModel" :serviceIds="serviceIds" :commissionerList="commissionerList" :queryData="getList"></CustomerDialog>
  </div>
</template>

<script>
import { progressBarList, progressBarObj } from './enumObj';
import * as comps from '../EPRManage/components/index';
import CheckRejectInfoDialog from '@/view/module/workOrder/components/checkRejectInfoDialog';
// import CheckOrderRemarkDialog from '@/view/module/workOrder/components/checkOrderRemarkDialog';
import { getDisposelist, serviceProgress, getCountrySelectList, getSupplierList } from '@/api/newApi/common.js';
import { getListAPI, addCateEprExport, eprNotice } from '@/api/newApi/workOrder/EPRManage';
import { serviceNode, disposeBatch } from '@/api/newApi/taxServices/serviceManage.js';
import { newfindProcesses } from '@/api/newApi/processFields/processConfig.js';
import { serviceProductListAPI } from '@/api/newApi/intellectualProperty/oa.js';
import { getProductList } from '@/api/newApi/servicemerchant/serviceMerchant.js'; // 使用证据商品

import cacheQuery from '@/mixins/cacheQuery';
import { getUserListByRole } from '@/api/newApi/common';
export default {
  name: 'xcloudplat_workOrder_authorizedRepresent',
  data() {
    return {
      list: [],
      tabNav: '-1',
      tabs: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        companyName: '',
        mobile: '',
        serviceNo: '',
        country: '',
        status: '',
        naturalPerson: '',
        supplierId: '',
        disposeId: '',
        productId: '',
        searchKeyword: '',
        functionCode: '',
        functionCodes: [this.$constant.ADD_CATEGORY_BRAND_FUNCTION_CODE, this.$constant.ADD_BAT_CATEGORY_BRAND_FUNCTION_CODE],
        createTime: [],
        approvedTime: [],
        customerId: '',
        completeTime: [],
        sendProviderTime: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      exportForm: {},
      managerList: [],
      countrySelectList: [{ countryCode: 'FR', countryNameZh: '法国' }],
      supplierList: [],
      checkItem: {},
      tableLoading: false,
      searchFlag: false,
      changeManagerDialog: false,
      checkRejectInfoDialog: false,
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
      progressBarObj: progressBarObj,
      remarkObj: {},
      checkIds: [],
      moreSerch: false,
      progressList: [],
      productList: [],
      functionCode: '',
      // checkOrderRemarkDialog: false,
      orderRemark: '',
    };
  },
  mixins: [cacheQuery],
  watch: {
    'form.country'(val) {
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
    CheckRejectInfoDialog,
    // CheckOrderRemarkDialog,
  },
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this.getServiceNode();
    this.getServiceProgress();
    // this.getProductFunc();
    this.getProduct();
    this.getCountry();
    this.getCustomerList(); //客服
    this.getManagerList();
  },
  methods: {
    formatTime() {
      [this.form.beginTime, this.form.endTime] = this.form.createTime && this.form.createTime.length ? this.form.createTime : ['', ''];
      [this.form.approvedTimeBegin, this.form.approvedTimeEnd] = this.form.approvedTime && this.form.approvedTime.length ? this.form.approvedTime : ['', ''];
      [this.form.commitSupplierTimeBegin, this.form.commitSupplierTimeEnd] = this.form.sendProviderTime && this.form.sendProviderTime.length ? this.form.sendProviderTime : ['', ''];
      [this.form.completeStart, this.form.completeEnd] = this.form.completeTime && this.form.completeTime.length ? this.form.completeTime : ['', ''];
    },
    getList() {
      if (this.form.currentNodeCode) {
        this.tabNav = this.form.currentNodeCode;
      } else {
        this.tabNav = '-1';
      }
      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      console.log(this.form);
      let { createTime, approvedTime, sendProviderTime, completeTime, ...formData } = this.form;

      getListAPI(formData)
        .then((res) => {
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
      this.changeCustomerModel = true;
    },
    // 获取客服
    getCustomerList() {
      getUserListByRole({
        roleCode: this.$constant.VAT_CUSTOMER_SERVICE,
      }).then((res) => {
        this.commissionerList = res.data;
      });
    },
    getServiceNode() {
      serviceNode({ functionCode: this.$constant.ADD_CATEGORY_BRAND_FUNCTION_CODE })
        .then((res) => {
          if (res.code == 0) {
            this.tabs = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 获取OA商品
    getProduct() {
      let data = { limit: 999, page: 1, status: 1, functionCodes: [this.$constant.ADD_CATEGORY_BRAND_FUNCTION_CODE, this.$constant.ADD_BAT_CATEGORY_BRAND_FUNCTION_CODE] };
      getProductList(data).then((res) => {
        if (res.code == 0) {
          this.productList = res.data.records;
          // this.form.productId = (this.productList[0] || {}).productId;
          // this.functionCode = (this.productList[0] || {}).functionCode;
          // this.getServiceProgress();
          // this.getServiceNode();
        }
      });
    },
    // 列表查询服务进度列表
    getServiceProgress() {
      serviceProgress({ functionCode: this.$constant.ADD_CATEGORY_BRAND_FUNCTION_CODE })
        .then((res) => {
          if (res.code == 0) {
            this.progressList = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    changeProgressBar() {
      let node = this.progressList.find((item) => this.form.nodeName == item.nodeName);
      if (!node) {
        this.form.currentNodeCode = '';
        this.form.progressBar = '';
      } else {
        this.form.currentNodeCode = node.nodeCode;
        this.form.progressBar = node.nodeValue;
      }
    },
    // 获取列表查询服务名称
    // getProductFunc() {
    //   serviceProductListAPI({ productFunctionCode: null }).then((res) => {
    //     if (res.code == 0) {
    //       console.log(res.data.records);
    //       this.productList = res.data.records;
    //     }
    //   });
    // },
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
      getSupplierList({
        page: 1,
        limit: 9999,
        functionCode: this.$constant.EPR_FUNCTION_CODE,
        countryCode: this.form.country,
      }).then(({ data }) => {
        this.supplierList = data;
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
    // 修改服务商
    // changeServiceProvider(row) {
    //   this.checkItem = row;
    //   this.changeServiceProviderDialog = true;
    // },
    // 查看驳回详情
    checkRejectInfo(row) {
      this.checkItem = row;
      this.checkRejectInfoDialog = true;
    },
    handleSelectionChange(val) {
      this.checkIds = val.map((item) => item.serviceId);
    },
    tabClick() {
      this.form.currentNodeCode = this.tabNav === '-1' ? '' : this.tabNav;
      if (this.tabNav === '-1') {
        this.form.status = '';
      } else {
        this.form.status = 1;
      }
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
      // if (this.moreSerch) {
      //   this.moreSerch = false;
      // }
      this.getList();
    },
    // 批量认领
    batchClaim() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择数据');
        return;
      }
      this.$confirm(`当前认领${this.checkIds.length}条工单，是否确认认领？`, '批量认领', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        disposeBatch({
          ids: this.checkIds,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('认领成功');
            this.getList();
          }
        });
      });
    },
    // 批量提醒
    batchRemind() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择数据');
        return;
      }
      this.$confirm(`选中客户：${this.checkIds.length}位，提醒客户提交资料，是否确认发送短信`, '短信提醒', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        eprNotice({
          code: this.tabNav,
          idColl: this.checkIds,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('提醒成功');
            this.getList();
          }
        });
      });
    },
    // 修改交付专员
    changeManager() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择数据');
        return;
      }
      this.changeManagerDialog = true;
    },
    // 导出
    _export() {
      this.formatTime();
      let { page, limit, createTime, approvedTime, sendProviderTime, completeTime, ...data } = { ...this.exportForm };
      if (this.checkIds.length) {
        data.options = this.checkIds;
      }
      addCateEprExport(data).then((res) => {
        this.$util.exportExcel(res);
      });
    },
    detail(row) {
      this.$router.push({
        path: '/addCategoryBrand/detail',
        query: {
          serviceId: row.serviceId,
          serviceNo: row.parentServiceNo,
          nodeCode: row.nodeCode,
        },
      });
    },
    productChange() {
      // const obj = this.productList.find((item) => item.productId == this.form.productId);
      // this.functionCode = (obj || {}).functionCode;
      // this.getServiceProgress();
      // this.getServiceNode();
    },
    reset() {
      this.form.progressBar = '';
      this.supplierList = [];
      this.tabNav = '-1';
      this.form.currentNodeCode = '';
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
