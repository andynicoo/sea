<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="120px">
          <el-form-item label="搜索内容" prop="searchKeyWord">
            <el-tooltip content="支持服务号/订单号/公司中文名称/公司英文名称搜索" placement="top">
              <el-input v-model="form.searchKeyWord" placeholder="服务号/订单号" type="textarea" :rows="1" clearable style="width: 168px" size="small" />
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
            <el-dropdown @command="(c) => this[c]()" style="margin-left: 20px">
              <el-button type="primary">功能按钮<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- v-show="hasAuthority('renew_1')" -->
                <el-dropdown-item command="changeManager">修改交付专员</el-dropdown-item>
                <el-dropdown-item command="batchChangeCustom">修改客服</el-dropdown-item>
                <el-dropdown-item command="_export">导出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item style="float: right">
            <el-link type="primary" :underline="false" @click="toUploadAndDownloadRecords">上传/下载中心</el-link>
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
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable @change="countryChange" v-model="form.countryCode">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务商" prop="supplierId">
              <el-select style="width: 168px" v-model="form.supplierId" size="small" clearable filterable placeholder="请选择">
                <el-option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.shortName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态" prop="serviceStatus">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.serviceStatus">
                <el-option v-for="item in statusList" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交付专员-" prop="disposeId">
              <el-select style="width: 168px" v-model="form.disposeId" size="small" clearable filterable placeholder="请选择">
                <el-option v-for="item in managerList" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客服" prop="customerId">
              <el-select style="width: 168px" v-model="form.customerId" placeholder="客服" clearable filterable>
                <el-option v-for="(item, index) in commissionerList" :key="index" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工单创建时间" prop="createTime">
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
                placement="bottom-start"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="completeTime" label="续费完成">
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
                placement="bottom-start"
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
        <el-table-column align="center" width="200" label="服务号" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <el-table-column align="center" width="200" label="工单号" show-overflow-tooltip prop="workNo"></el-table-column>
        <el-table-column align="center" width="150" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="业务分类" show-overflow-tooltip prop="functionCode">
          <template slot-scope="scope">
            {{ scope.row.functionCode === 80 ? 'WEEE续费' : '其他' }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务名称" show-overflow-tooltip prop="serviceSpecName"></el-table-column>
        <el-table-column align="center" width="150" label="当前服务进度" show-overflow-tooltip prop="cureentNodeCode">
          <template slot-scope="scope">
            <span v-if="scope.row.cureentNodeCode === 'NODE0090'">待提交续费申请</span>
            <span v-if="scope.row.cureentNodeCode === 'NODE0091'">待开启续费通道</span>
            <span v-if="scope.row.cureentNodeCode === 'NODE0092'">待续费</span>
            <span v-if="scope.row.cureentNodeCode === 'NODE0093'">续费中</span>
            <span v-if="scope.row.cureentNodeCode === 'NODE0094'">续费完成</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="公司中文名称" show-overflow-tooltip prop="companyNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="服务商" show-overflow-tooltip prop="supplierName"> </el-table-column>
        <el-table-column align="center" width="150" label="服务状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">{{ scope.row.status | filterStatus(statusList) }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="年份" show-overflow-tooltip prop="year"></el-table-column>
        <el-table-column align="center" label="处理人" width="150">
          <template slot-scope="scope">
            <span style="white-space: pre-wrap">{{ scope.row.handler }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="70" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top">
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

    <CustomerDialog :typeNum="1" :changeCustomerModel.sync="changeCustomerModel" :serviceIds="serviceIds" :commissionerList="commissionerList" :queryData="getList"></CustomerDialog>
    <BatchDownloadDialog :batchDownloadDialog.sync="batchDownloadDialog" contentText="EPR注册资料（包含授权书）" :checkIds="checkIds" />
    <BatchUploadCertificatesDialog :batchUploadCertificatesDialog.sync="batchUploadCertificatesDialog" :checkIds="checkIds" />
    <BatchUploadBillDialog :batchUploadBillDialog.sync="batchUploadBillDialog" :checkIds="checkIds" />
    <BatchUploadUINDialog :batchUploadUINDialog.sync="batchUploadUINDialog" :checkIds="checkIds" />
    <BatchSubmitProviderDialog :batchSubmitProviderDialog.sync="batchSubmitProviderDialog" :checkIds="checkIds" @refresh="getList" />
    <BatchChangeProviderDialog :batchChangeProviderDialog.sync="batchChangeProviderDialog" :checkIds="checkIds" />
  </div>
</template>

<script>
import { progressBarList, progressBarObj } from './enumObj';
import * as comps from './components/index';
import { getDisposelist, serviceProgress, getCountrySelectList } from '@/api/newApi/common.js';
import { eprWeeeExport, getEprRenewListAPI } from '@/api/newApi/workOrder/EPRManage';
import { serviceNode, disposeBatch } from '@/api/newApi/taxServices/serviceManage.js';
import cacheQuery from '@/mixins/cacheQuery';
import { getUserListByRole, getSupplierList } from '@/api/newApi/common';
import BatchDownloadDialog from '@/view/module/workOrder/components/batchDownloadDialog.vue';
import BatchUploadCertificatesDialog from '@/view/module/workOrder/components/batchUploadCertificatesDialog.vue';
import BatchUploadBillDialog from '@/view/module/workOrder/components/batchUploadBillDialog.vue';
import BatchUploadUINDialog from '@/view/module/workOrder/components/batchUploadUINDialog.vue';
import BatchSubmitProviderDialog from '@/view/module/workOrder/components/batchSubmitProviderDialog.vue';
import BatchChangeProviderDialog from '@/view/module/workOrder/components/batchChangeProviderDialog.vue';
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
        companyNameZh: '',
        mobile: '',
        serviceNo: '',
        countryCode: '',
        serviceStatus: '',
        naturalPerson: '',
        supplierId: '',
        disposeId: '',
        searchKeyWord: '',
        productFunctionCode: '80',
        createTime: [],
        customerId: '',
        completeTime: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      exportForm: {},
      managerList: [],
      countrySelectList: [],
      supplierList: [],
      checkItem: {},
      tableLoading: false,
      searchFlag: false,
      changeManagerDialog: false,
      serviceIds: [],
      changeCustomerModel: false,
      commissionerList: [],
      statusList: [
        { label: '服务中', value: 1 },
        { label: '待续费', value: 2 },
        { label: '已取消', value: 9 },
        { label: '取消中', value: 11 },
        { label: '已续费', value: 12 },
      ],
      progressBarList: progressBarList,
      progressBarObj: progressBarObj,
      remarkObj: {},
      selectList: [],
      checkIds: [],
      moreSerch: false,
      progressList: [],
      batchDownloadDialog: false,
      batchUploadCertificatesDialog: false,
      batchUploadBillDialog: false,
      batchUploadUINDialog: false,
      batchSubmitProviderDialog: false,
      batchChangeProviderDialog: false,
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
    BatchDownloadDialog,
    BatchUploadCertificatesDialog,
    BatchUploadBillDialog,
    BatchUploadUINDialog,
    BatchSubmitProviderDialog,
    BatchChangeProviderDialog,
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
    this.getCountry();
    this.getCustomerList(); //客服
    this.getManagerList();
  },
  methods: {
    formatTime() {
      [this.form.createStartTime, this.form.createEndTime] = this.form.createTime && this.form.createTime.length ? this.form.createTime : ['', ''];
      [this.form.completeStart, this.form.completeEnd] = this.form.completeTime && this.form.completeTime.length ? this.form.completeTime : ['', ''];
    },
    getList() {
      if (this.form.nodeCode) {
        this.tabNav = this.form.nodeCode;
      } else {
        this.tabNav = '-1';
      }
      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      let { createTime, approvedTime, completeTime, ...formData } = this.form;
      getEprRenewListAPI(formData)
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
      serviceNode({ functionCode: '80' })
        .then((res) => {
          if (res.code == 0) {
            this.tabs = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 列表查询服务进度列表
    getServiceProgress() {
      serviceProgress({ functionCode: '80' })
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
        this.form.nodeCode = '';
        this.form.progressBar = '';
      } else {
        this.form.nodeCode = node.nodeCode;
        this.form.progressBar = node.nodeValue;
      }
    },
    // 获取交付专员列表
    getManagerList() {
      getDisposelist({
        functionCode: '80',
      }).then((res) => {
        this.managerList = res.data;
      });
    },
    // 获取服务商列表
    getSuppliers() {
      getSupplierList({
        page: 1,
        limit: 9999,
        functionCode: '80',
        countryCode: this.form.countryCode,
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
    handleSelectionChange(val) {
      this.selectList = val;
      this.checkIds = val.map((item) => item.serviceNo);
    },
    tabClick() {
      this.form.nodeCode = this.tabNav === '-1' ? '' : this.tabNav;
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
      this.form.productFunctionCode = '80';
      // if (this.moreSerch) {
      //   this.moreSerch = false;
      // }
      this.getList();
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
      let data = this.form;
      data.nodeCode = this.tabNav;
      if (!this.checkIds.length) {
        this.$message.warning('请选择数据!');
        return;
      }
      data.ids = this.checkIds;
      eprWeeeExport(data).then((res) => {
        this.$util.exportExcel(res);
      });
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
     * 上传证书
     */
    batchUploadCertificates() {
      this.batchUploadCertificatesDialog = true;
    },
    /**
     * 上传账单
     */
    batchUploadBill() {
      this.batchUploadBillDialog = true;
    },
    /**
     * 上传UIN号
     */
    batchUploadUIN() {
      this.batchUploadUINDialog = true;
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
    /**
     * 修改服务商
     */
    batchChangeProvider() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      if (this.selectList.some((item) => item.countryCode !== this.selectList[0].countryCode || item.countryNameZh !== this.selectList[0].countryNameZh || item.productFunctionCode !== this.selectList[0].productFunctionCode)) {
        this.$message.warning('不符合批量操作要求，请确认勾选的服务单（国家和税务类型）一致。');
        return;
      }
      this.batchChangeProviderDialog = true;
    },
    toUploadAndDownloadRecords() {
      this.$router.push({
        path: '/workOrder/uploadAndDownloadRecords',
      });
    },
    detail(row) {
      this.$router.push({
        path: '/eprRenew/detail',
        query: {
          serviceId: row.parentServicesId,
          serviceNo: row.serviceNo,
        },
      });
    },
    reset() {
      // if (this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields();
      // }
      this.form.progressBar = '';
      this.supplierList = [];
      this.tabNav = '-1';
      this.form.nodeCode = '';
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
