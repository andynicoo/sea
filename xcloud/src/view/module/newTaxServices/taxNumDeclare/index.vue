<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="listQuery" inline label-width="100px">
          <el-form-item label="国家" clearable prop="countryCode">
            <el-select style="width: 168px" v-model="listQuery.countryCode" placeholder="国家" clearable @change="chengeSupplier" filterable>
              <el-option v-for="(item, index) in countrySelect" :key="index" :label="item.countryNameZh" :value="item.countryCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务商" prop="supplierId">
            <el-select style="width: 168px" v-model="listQuery.supplierId" placeholder="服务商" filterable clearable>
              <el-option v-for="(item, key) in supplierList" :key="key" :value="item.id" :label="item.shortName"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
            <el-button type="primary" @click="batchSearchDialog = true">批量</el-button>
            <el-dropdown @command="(c) => this[c]()" style="margin-left: 20px">
              <el-button type="primary">功能按钮<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="changeUserMessage" v-if="isShowMessageBtn" v-show="hasAuthority('M1_28')">批量提醒</el-dropdown-item>
                <!-- <el-dropdown-item command="uploadReceipt" v-show="hasAuthority('M1_29')">下载申报回执</el-dropdown-item> -->
                <el-dropdown-item command="changeManager" v-show="hasAuthority('M1_1')">修改申报专员</el-dropdown-item>
                <el-dropdown-item command="batchChangeCustom" v-show="hasAuthority('M1_26')">修改客服</el-dropdown-item>
                <el-dropdown-item command="batchUploadReceipt" v-show="hasAuthority('M1_37')">上传申报回执</el-dropdown-item>
                <el-dropdown-item command="batchDownloadDeclareFiles" v-show="hasAuthority('M1_38')">下载申报文件</el-dropdown-item>
                <el-dropdown-item command="allDownloadDeclareFiles" v-show="hasAuthority('M1_39')">下载税务申报</el-dropdown-item>
                <el-dropdown-item command="batchTransfer" v-show="hasAuthority('M1_44')">批量转出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item style="float: right">
            <el-link type="primary" :underline="false" @click="toUploadAndDownloadRecords">上传/下载中心</el-link>
          </el-form-item>
          <div v-show="moreSerch">
            <!-- <el-form-item class="search-area" prop="searchKeyword" @click.native="batchSearchDialog = true">
              <el-input type="textarea" :rows="1" v-model="searchKeyword" placeholder="请输入订单号/工单号/服务号/公司名称/手机号" disabled clearable style="width: 320px"> </el-input>
              <el-button class="batch-btn">批量</el-button>
            </el-form-item> -->
            <el-form-item label="订单号" prop="orderNo">
              <el-input type="textarea" :rows="1" v-model="listQuery.orderNo" placeholder="请输入" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="服务号" prop="serviceNo">
              <el-input type="textarea" :rows="1" v-model="listQuery.serviceNo" placeholder="请输入" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="工单号" prop="workNo">
              <el-input type="textarea" :rows="1" v-model="listQuery.workNo" placeholder="请输入" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName">
              <el-input type="textarea" :rows="1" v-model="listQuery.companyName" placeholder="请输入" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="手机号" prop="userMobile">
              <el-input type="textarea" :rows="1" v-model="listQuery.userMobile" placeholder="请输入" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="服务商编码" prop="supplierAssignsCode">
              <el-input v-model="listQuery.supplierAssignsCode" placeholder="请输入" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="服务状态" prop="status">
              <el-select style="width: 168px" v-model="listQuery.status" clearable placeholder="请选择" filterable>
                <el-option v-for="(item, index) in serviceStatusList" :key="index" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="税号" prop="taxNumber">
              <el-input v-model="listQuery.taxNumber" placeholder="请输入" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="申报进度" prop="progress">
              <el-select style="width: 168px" v-model="listQuery.progress" clearable placeholder="请选择" filterable @change="progressChange">
                <el-option v-for="(item, index) in statusList" :key="index" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客服" prop="customerId">
              <el-select style="width: 168px" v-model="listQuery.customerId" placeholder="客服" clearable filterable>
                <el-option v-for="(item, index) in commissionerList" :key="index" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报专员" prop="disposeId">
              <el-select style="width: 168px" v-model="listQuery.disposeId" placeholder="申报专员" filterable>
                <el-option v-for="(item, index) in taxManagerList" :key="index" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类" prop="productCategory">
              <el-cascader
                style="width: 168px"
                clearable
                filterable
                v-model="listQuery.productCategory"
                :options="serviceCascader"
                :show-all-levels="false"
                :props="{
                  children: 'childrenProductCategory',
                  value: 'id',
                  label: 'categoryName',
                  emitPath: false,
                }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="周期类型" prop="declarePeriod">
              <el-select style="width: 168px" v-model="listQuery.declarePeriod" clearable placeholder="周期类型">
                <el-option value="0" label="月报"></el-option>
                <el-option value="1" label="季报"></el-option>
                <el-option value="2" label="年报"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否有递延" prop="frenchDeferredFlag" v-if="listQuery.countryCode == 'FR'">
              <el-select style="width: 168px" v-model="listQuery.frenchDeferredFlag" clearable placeholder="请选择">
                <el-option :value="0" label="否"></el-option>
                <el-option :value="1" label="是"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报税月份" prop="taxPeriod">
              <el-date-picker v-model="listQuery.taxPeriod" type="month" placeholder="请选择" style="width: 168px" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item label="服务截止时间" prop="time">
              <el-date-picker
                v-model="listQuery.time"
                type="datetimerange"
                align="right"
                clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :default-time="[, '23:59:59']"
                placeholder="请选择"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 340px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="提交申报日期" prop="submitDeclaration">
              <el-date-picker
                v-model="listQuery.submitDeclaration"
                type="daterange"
                align="right"
                clearable
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :default-time="[, '23:59:59']"
                placeholder="请选择"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 340px"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.index"></el-tab-pane>
      </el-tabs>
      <el-table ref="table" border :data="list" :height="tableHeight" v-loading="listLoading" highlight-current-row @selection-change="handleSelectionChange" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="selection" fixed="left" width="55" align="center"></el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="公司名称" prop="companyNameZh"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="服务号" width="200px" prop="serviceNo"></el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="客户手机号">
          <template slot-scope="scope">
            <span v-hidden>{{ scope.row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="申报进度">
          <template slot-scope="scope">
            {{ scope.row.progress | filterStatus }}
          </template>
        </el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="缴纳税金">
          <template slot-scope="scope">
            {{ [statusObj.FAILURE, statusObj.WAIT_SUBMIT].includes(scope.row.progress) ? '-' : scope.row.allTaxPrice }}
          </template>
        </el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="税号" prop="vatTaxNumber"></el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="国家" prop="countryNameZh">
          <template slot="header">
            国家
            <el-tooltip class="item" effect="dark" content="国家：IOSS的国家表示其注册的国家" placement="top-start">
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="服务商" prop="supplierName"></el-table-column>
        <el-table-column width="100px" show-overflow-tooltip align="center" label="周期类型">
          <template slot-scope="scope">
            {{ scope.row.declarePeriod == 0 ? '月报' : scope.row.declarePeriod == 1 ? '季报' : scope.row.declarePeriod == 2 ? '年报' : '-' }}
          </template>
        </el-table-column>
        <el-table-column width="200px" show-overflow-tooltip align="center" label="当前申报周期">
          <template slot-scope="scope"> {{ (scope.row.begin || '').split(' ')[0] }}至{{ (scope.row.end || '').split(' ')[0] }} </template>
        </el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="服务截止时间" prop="expirationTime"></el-table-column>
        <el-table-column align="center" label="处理人" width="150">
          <template slot-scope="scope">
            <span style="white-space: pre-wrap">{{ scope.row.handler }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="服务状态">
          <template slot-scope="scope">
            {{ scope.row.status | serviceStatus }}
          </template>
        </el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="备注">
          <template slot-scope="scope">
            <el-link v-if="scope.row.existRemark" type="primary" class="el-icon-search" :underline="false" @click="checkRemark(scope.row.workNo)" v-show="hasAuthority('M1_3')"> 查看 </el-link>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column width="150px" show-overflow-tooltip align="center" label="历史备注">
          <template slot-scope="scope">
            <el-link v-if="scope.row.existHistoryRemark" type="primary" class="el-icon-search" :underline="false" @click="checkRemark(scope.row.chiefServiceNo)" v-show="hasAuthority('M1_43')"> 查看 </el-link>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="250px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" class="" content="查看" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-see" @click="detail(scope.row)" v-show="hasAuthority('M1_6')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="备注" placement="top">
              <el-link type="primary" class="icon icon-remarks" :underline="false" @click="addRemark(scope.row)" v-show="hasAuthority('M1_7')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="转出代理" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-out" @click="transfer(scope.row)" v-if="scope.row.progress !== statusObj.VOUCHER_REJECT && [1, 2, 9, 11].includes(scope.row.status)" v-show="hasAuthority('M1_4')"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <TaxNumInfoDialog :taxNumInfoDialog.sync="taxNumInfoDialog" :row="row"></TaxNumInfoDialog>
    <WorkOrderRemarkDialog v-if="workOrderRemarkDialog" :workOrderRemarkDialog.sync="workOrderRemarkDialog" :workNo="remarkNo"></WorkOrderRemarkDialog>
    <AddRemarkDialog :addRemarkDialog.sync="addRemarkDialog" :workNo="row.workNo" @refresh="queryData"></AddRemarkDialog>
    <BatchDownloadDialog :batchDownloadDialog.sync="batchDownloadDialog" :selectList="selectList" />
    <BatchUploadReceiptDialog :batchUploadReceiptDialog.sync="batchUploadReceiptDialog" />
    <BatchChangeHandlerDialog :batchChangeHandlerDialog.sync="batchChangeHandlerDialog" :functionCode="functionCode" showAllCustomer :workOrderIds="checkIds" :type="handlerType" @refresh="queryData" />
    <!-- 批量下载申报回执弹窗 -->
    <el-dialog title="批量下载申报回执" :visible.sync="uploadReceiptDialog" width="460px" :close-on-click-modal="false" center :before-close="clearSetInterval">
      <p class="loading-text">{{ uploadStatus ? '文件已生成' : '文件生成中，请稍等……' }}</p>
      <p>备注：</p>
      <p :class="uploadStatus ? '' : 'color-red'">1.文件生成完成才可下载；</p>
      <p>2.批量下载的文件每一个工单为一个文件夹。</p>
      <p>3.单次批量下载文件大小为50M，约100个回执，批量下载时请控制数量；</p>
      <p>4.不支持批量下载英国回执</p>
      <div class="upload-box" v-if="uploadStatus">
        <el-button type="primary" @click="downFunc">下载</el-button>
      </div>
    </el-dialog>
    <BatchSearchDialog :batchSearchDialog.sync="batchSearchDialog" :keyword="searchKeyword" :activeTab="activeTab" @getBatchSearchKey="getBatchSearchKey" />
  </div>
</template>
<script>
import UploadImage from '@/components/UploadImage/index';
import * as comps from './components/index';
import AddRemarkDialog from '@/view/module/workOrder/components/addRemarkDialog.vue';
import WorkOrderRemarkDialog from '@/view/module/workOrder/components/workOrderRemarkDialog';
import { getList, serviceTransfer, sendSmsBatch, downloadMultipleReceipt, queryMultipleReceipt, allDeclareDownload, declareStatistics, batchTransformOut } from '@/api/newApi/taxServices/taxNumDeclare.js';
import { getCountrySelectList, getDisposelist, getSupplierList } from '@/api/newApi/common.js';
import { getProductList, getProductCategory } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { statusObj, statusList, ruleList, serviceStatusList } from './enumObj.js';
import cacheQuery from '@/mixins/cacheQuery';
import { userList } from '@/api/newApi/common';
import BatchChangeHandlerDialog from '@/view/module/workOrder/components/batchChangeHandlerDialog';
export default {
  data() {
    return {
      listLoading: false,
      // 分页
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
        orderNo: '',
        serviceNo: '',
        workNo: '',
        companyName: '',
        userMobile: '',
        countryCode: '',
        supplierId: '',
        supplierAssignsCode: '',
        progress: '',
        time: '',
        taxPeriod: '',
        userMobile: '',
        taxNumber: '',
        status: '',
        productFunctionCode: '',
        overdue: '',
        productCategory: '',
        customerId: '',
        disposeId: '',
        declarePeriod: '',
        // searchKeyword: '',
        frenchDeferredFlag: '',
        submitDeclaration: '',
        activeName: '-1',
        progressColl: [],
      },
      searchKeyword: '',
      searchData: {},
      cacheKey: 'listQuery',
      copyListQuery: {},
      list: [],
      tabs: [
        { index: '0', label: '未开始', value: 0, key: 'notStartCount', keys: [0] },
        { index: '1', label: '待申报', value: 0, key: 'declareSubmitCount', keys: [statusObj.WAIT_SUBMIT] },
        { index: '2', label: '待审核', value: 0, key: 'declareAuditCount', keys: [statusObj.WAIT_AUDIT_DECLARE, statusObj.WAIT_AUDIT, statusObj.DECLARING] },
        { index: '3', label: '待缴费', value: 0, key: 'taxSubmitCount', keys: [statusObj.WAIT_PAID] },
        { index: '4', label: '等待回执', value: 0, key: 'consignCount', keys: [statusObj.DECLARE_DOCK_COMPLATE] },
        { index: '5', label: '申报驳回', value: 0, key: 'declareRejectCount', keys: [statusObj.Sub_REJECT, statusObj.Tax_REJECT] },
        { index: '6', label: '申报完成', value: 0, key: 'completeCount', keys: [statusObj.DECLARE_COMPLETE] },
      ],
      functionCode: this.$constant.TAXProxy_FUNCTION_CODE,
      statusObj: statusObj,
      statusList: statusList,
      serviceStatusList: serviceStatusList,
      // serviceTypeList: [
      //   { label: '注册+申报', value: '5' },
      //   { label: '转代理+申报', value: '2' },
      //   { label: 'IOSS注册+申报', value: '23' },
      // ],
      createTime: '',
      selectList: [], // 表格勾选数
      productList: [], // 服务商品名称
      countrySelect: [], // 国家列表
      supplierList: [], // 服务商列表
      serviceCascader: [],
      serviceNo: '',
      addRemarkDialog: false,
      workOrderRemarkDialog: false,
      taxNumInfoDialog: false,
      moreSerch: false,
      serviceIds: [],
      changeCustomerModel: false,
      batchDownloadDialog: false,
      batchUploadReceiptDialog: false,
      exportLoading: false,
      serviceIdColl: [],
      taxManagerList: [],
      commissionerList: [],
      serviceId: '',
      row: {},
      uploadReceiptDialog: false,
      uploadStatus: false,
      setIntervalTimer: null,
      uploadObj: {},
      batchSearchDialog: false,
      activeName: '-1',
      keyList: ['orderNo', 'serviceNo', 'workNo', 'companyName', 'userMobile'],
      activeTab: '',
      handlerType: 1, // 1：客服，2：交付
      batchChangeHandlerDialog: false,
      checkIds: [],
      remarkNo: '',
    };
  },
  mixins: [cacheQuery],
  components: {
    UploadImage,
    ...comps,
    AddRemarkDialog,
    WorkOrderRemarkDialog,
    BatchChangeHandlerDialog,
  },
  computed: {
    isShowMessageBtn() {
      let { progress, status } = this.searchData;
      return status == 1 && (progress == 10 || progress == 18);
    },
  },
  filters: {
    filterStatus(status) {
      if (status < 10) {
        return '未开始';
      }
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
    filterRule(rule) {
      let result = ruleList.find((item) => item.value === rule);
      return result ? result.label : '-';
    },
    filterWorkStatus(workStatus) {
      switch (workStatus) {
        case 1:
          return '正常';
        case 2:
          return '已取消';
        default:
          return workStatus;
      }
    },
  },
  watch: {
    'listQuery.countryCode'(val) {
      if (val) {
        this.getSuppllier();
      } else {
        this.listQuery.supplierId = '';
        this.supplierList = [];
      }
      if (val != 'FR') {
        this.listQuery.frenchDeferredFlag = '';
      }
    },
  },
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this.activeName = this.listQuery.activeName;
    for (let i = 0; i < this.keyList.length; i++) {
      let key = this.keyList[i];
      if (this.listQuery[key]) {
        this.searchKeyword = this.listQuery[key];
        this.activeTab = key;
        break;
      }
    }
    this.queryData();
    this.getCountry(); // 国家列表
    this.getManagerList(); // 申报专员
    this.getCustomerList(); // 客服
    this.getproductList();
    this.getAllCategory();
  },
  methods: {
    getDeclareStatistics() {
      let { progressColl, ...params } = this.formatParams();
      declareStatistics(params).then((res) => {
        this.tabs.forEach((item) => {
          item.value = res.data[item.key] || 0;
        });
      });
    },
    handleClick() {
      if (this.activeName == '-1') {
        this.listQuery.progressColl = [];
        this.listQuery.progress = '';
        this.listQuery.status = '';
      } else {
        this.listQuery.progressColl = this.tabs[this.activeName].keys;
        this.listQuery.progress = this.listQuery.progressColl.length === 1 ? this.listQuery.progressColl[0] : '';
        this.listQuery.status = '1';
      }
      this.queryData();
    },
    getBatchSearchKey(val, activeName) {
      this.resetSearKeyWord();
      this.searchKeyword = val;
      this.listQuery[activeName] = val;
      this.queryData();
    },
    resetSearKeyWord() {
      this.keyList.forEach((item) => {
        this.listQuery[item] = '';
      });
    },
    /** 发送短信 */
    changeUserMessage() {
      const h = this.$createElement;
      let text = `当前勾选" ${this.selectList.length} "位客户，是否确定发送短信？`;
      if (this.selectList.length === 0) {
        this.$message.warning('请先勾选需要发送短信的用户');
        return;
      }
      this.$msgbox({
        title: '短信提醒',
        message: h('div', null, [h('p', { style: 'color: #E57910' }, '注意：每月3号、6号、9号、14号、25号系统会自动触发短信提醒客户申报，成功发送短信后会有操作记录'), h('p', null, '此短信内容为:提醒客户提交申报资料'), h('p', null, text)]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.sendSmsBatchApi();
      });
    },

    /** 发送短信 */
    async sendSmsBatchApi() {
      try {
        let { code, message } = await sendSmsBatch({
          status: this.listQuery.progress,
          workIds: this.selectList.map((item) => item.workId),
        });
        code == 0 && this.$message.success('短信发送成功');
      } catch (error) {}
    },
    formatParams() {
      let { time, submitDeclaration, activeName, ...param } = this.listQuery;
      return {
        ...param,
        expirationTimeFirst: time ? time[0] : '',
        expirationTimeLast: time ? time[1] : '',
        saveMaterialTimeFirst: submitDeclaration ? submitDeclaration[0] : '',
        saveMaterialTimeLast: submitDeclaration ? submitDeclaration[1] : '',
      };
    },
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.listQuery.activeName = this.activeName;
      this.setPageCache();
      getList(this.formatParams())
        .then((res) => {
          if (res.code === 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            this.searchData = { ...this.listQuery };
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .finally((err) => {
          this.listLoading = false;
        });
      // this.getDeclareStatistics();
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
    progressChange(val) {
      let temp = this.tabs.find((tab) => tab.keys.includes(val));
      if (temp) {
        this.activeName = temp.index;
        this.listQuery.status = '1';
      } else {
        this.activeName = '-1';
        this.listQuery.status = '';
      }
      this.listQuery.progressColl = [];
    },
    /** 服务商品列表 */
    getproductList() {
      getProductList({
        size: -1,
        functionCodes: ['2', '5', '23'],
      })
        .then((res) => {
          if (res.code === 0) {
            this.productList = res.data.records;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /**
     * 获取商品分类
     */
    getAllCategory() {
      getProductCategory({
        size: -1,
        status: 'ENABLE',
      }).then((res) => {
        if (res.code == 0) {
          let data = res.data.records.filter((item) => item.childrenProductCategory && item.childrenProductCategory.length);
          this.formatCategory(data);
          this.serviceCascader = data;
        }
      });
    },
    formatCategory(data) {
      data.forEach((item) => {
        if (item.childrenProductCategory && item.childrenProductCategory.length) {
          this.formatCategory(item.childrenProductCategory);
        } else {
          item.childrenProductCategory = void 0;
        }
      });
    },
    search() {
      this.listQuery.page = 1;
      this.queryData();
    },

    /**
     * 重置
     */
    reset() {
      this.listQuery = { ...this.copyListQuery };
      this.activeName = '-1';
      this.searchKeyword = '';
      this.removePageCache();
    },
    /**
     * 修改交付专员
     */
    changeManager() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      this.handlerType = 2;
      this.batchChangeHandlerDialog = true;
    },
    /**
     * 修改客服
     */
    batchChangeCustom() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      this.handlerType = 1;
      this.batchChangeHandlerDialog = true;
    },
    // 获取客服
    getCustomerList() {
      userList({
        limit: -1,
      }).then((res) => {
        this.commissionerList = res.data;
      });
    },
    // 多选勾选
    handleSelectionChange(val) {
      this.selectList = val;
      this.checkIds = val.map((item) => item.workId);
    },
    /**
     * 批量下载申报文件
     */
    batchDownloadDeclareFiles() {
      if (!this.selectList.length) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      // if (this.selectList.some((item) => item.regFunctionCode !== this.selectList[0].regFunctionCode)) {
      //   this.$message.warning('请选择相同服务类型的工单');
      //   return;
      // }
      this.batchDownloadDialog = true;
    },
    /**
     * 下载税务申报文件
     */
    allDownloadDeclareFiles() {
      this.setPageCache();
      allDeclareDownload(this.selectList.map((item) => item.workId)).then((res) => {
        this.$util.exportExcel(res, '税务申报');
      });
    },
    /**
     * 批量转出
     */
    batchTransfer() {
      if (!this.selectList.length) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      let temp = this.selectList[0];
      if (this.selectList.some((item) => item.countryCode !== temp.countryCode)) {
        this.$message.warning('请选择相同国家的工单');
        return;
      }
      if (this.selectList.some((item) => item.supplierId !== temp.supplierId)) {
        this.$message.warning('请选择相同服务商的工单');
        return;
      }
      const h = this.$createElement;
      this.$confirm(``, '批量转出确认', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message: h('div', null, [h('p', null, '国家：' + temp.countryNameZh), h('p', null, '服务商：' + temp.supplierName), h('p', { style: { fontWeight: 'bold', marginTop: '20px', fontSize: '16px' } }, '转出后该公司不能在本平台继续报税'), h('p', null, '是否确认转出申报')]),
        center: true,
      }).then(() => {
        batchTransformOut(this.selectList.map((item) => item.workId)).then((res) => {
          if (res.code === 0) {
            this.$message.success('转出成功');
            this.queryData();
          }
        });
      });
    },
    /**
     * 批量上传申报回执
     */
    batchUploadReceipt() {
      this.batchUploadReceiptDialog = true;
    },
    /**
     * 下载注册/转代理资料
     */
    download() {
      if (this.selectList.length === 0) {
        this.$message.warning('请选择要操作的工单');
      }
    },
    // 获取申报专员列表
    getManagerList() {
      getDisposelist({
        functionCodes: '2,23,5',
        functionCode: this.functionCode,
      }).then((res) => {
        this.taxManagerList = res.data;
      });
    },
    /**
     * 转出代理
     */
    transfer(row) {
      this.$confirm('<h3>转出后该公司不能在本平台继续报税</h3><div>是否确认转出申报</div>', '转出确认', {
        type: 'warning',
        customClass: 'custom-confirm',
        dangerouslyUseHTMLString: true,
        center: true,
      }).then(() => {
        serviceTransfer(row.workId).then((res) => {
          if (res.code === 0) {
            this.$message.success('转出成功');
            this.queryData();
          }
        });
      });
    },

    // 查看备注
    checkRemark(value) {
      this.workOrderRemarkDialog = true;
      // this.row = row;
      this.remarkNo = value;
    },
    // 添加备注弹框
    addRemark(row) {
      this.addRemarkDialog = true;
      this.row = row;
    },
    /**
     * 详情
     */
    detail(row) {
      this.$router.push({
        name: 'taxNumDeclareDetail',
        query: { workId: row.workId },
      });
    },
    /**
     * 获取国家下拉框数据
     */
    getCountry() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelect = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    chengeSupplier() {
      this.listQuery.supplierId = '';
    },
    /** 获取服务商列表 */
    getSuppllier() {
      getSupplierList({
        supplierType: 1,
        functionCodeColl: ['2', '5', '23'],
        countryCode: this.listQuery.countryCode,
        countryCodeList: [this.listQuery.countryCode],
      }).then((res) => {
        this.supplierList = res.data;
      });
    },
    // 下载申报回执
    uploadReceipt() {
      if (this.selectList.length === 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      this.uploadReceiptDialog = true;
      let ids = [];
      this.selectList.map((item) => {
        ids.push(item.id);
      });
      let requestData = {
        serviceIdList: ids,
      };
      downloadMultipleReceipt(requestData).then((res) => {
        if (res.code === 0) {
          this.uploadReceiptResultFunc(res.data);
        }
      });
    },
    uploadReceiptResultFunc(id) {
      this.setIntervalTimer = setInterval(() => {
        queryMultipleReceipt(id).then((res) => {
          if (res.code === 0) {
            // "downloadStatus":"下载状态（0：下载中，1：下载成功，2：下载失败）
            if (res.data.downloadStatus === 2) {
              this.$message.warning('下载失败');
              this.uploadReceiptDialog = false;
              clearInterval(this.setIntervalTimer);
            } else if (res.data.downloadStatus === 1) {
              this.uploadStatus = true;
              clearInterval(this.setIntervalTimer);
              this.uploadObj = res.data;
            }
          }
        });
      }, 1000);
    },
    clearSetInterval() {
      clearInterval(this.setIntervalTimer);
      this.uploadStatus = false;
      this.uploadObj = {};
      this.uploadReceiptDialog = false;
    },
    downFunc() {
      var link = document.createElement('a'); // 构建一个a标签
      link.href = this.uploadObj.fileUrl; // 把路径给它
      link.download = this.uploadObj.fileName; // 下载的文件名字
      link.click(); // 模拟点击
      this.uploadReceiptDialog = false;
      this.uploadStatus = false;
    },
    toUploadAndDownloadRecords() {
      this.$router.push({
        path: '/workOrder/uploadAndDownloadRecords',
        query: {
          productFunctionCode: 1,
        },
      });
    },
  },
  // 离开页面清除定时
  beforeDestroy() {
    if (this.setIntervalTimer) {
      clearInterval(this.setIntervalTimer);
    }
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/fixedSearch.scss';
.header-tittle {
  overflow: hidden;
  padding: 10px;
}
.loading-text {
  margin-bottom: 20px;
  font-size: 20px;
  color: #f1854f;
}
.color-red {
  color: #d72323;
}
.upload-box {
  text-align: center;
}
.search-area {
  ::v-deep .el-textarea.is-disabled {
    .el-textarea__inner {
      cursor: pointer;
    }
  }
}
.batch-btn {
  border: 1px solid #e4e7ed !important;
  border-left: none !important;
  background-color: #f6f8fa;
}
</style>
