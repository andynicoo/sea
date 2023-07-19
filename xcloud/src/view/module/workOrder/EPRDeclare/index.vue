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
                  <el-dropdown-item command="showStartDeclareDialog" v-show="hasAuthority('D2_1')">开始申报</el-dropdown-item>
                  <el-dropdown-item command="changeManager" v-show="hasAuthority('D2_2')">修改交付专员</el-dropdown-item>
                  <el-dropdown-item command="batchChangeCustom" v-show="hasAuthority('D2_3')">修改客服</el-dropdown-item>

                  <el-dropdown-item command="submitDeclare" v-if="tabNav == '-1'" v-show="hasAuthority('D2_4')">提交申报</el-dropdown-item>
                  <el-dropdown-item command="batchUploadReceipt" v-if="tabNav === '7'" v-show="hasAuthority('D2_3')">上传回执</el-dropdown-item>
                  <el-dropdown-item command="_export" v-show="hasAuthority('D2_5')">导出</el-dropdown-item>
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
              <el-select style="width: 168px" v-model="form.status" placeholder="服务进度" clearable filterable @change="changeProcess">
                <el-option v-for="(item, index) in progressList" :key="index" :label="item.nodeName" :value="item.nodeCode" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家" prop="country">
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
                <el-option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.shortName"></el-option>
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
              <el-select style="width: 168px" v-model="form.declarePeriod" size="small" clearable placeholder="请选择">
                <el-option label="月报" :value="0"></el-option>
                <el-option label="季报" :value="1"></el-option>
                <el-option label="年报" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申报区间" prop="submitDeclaration">
              <el-date-picker
                v-model="form.submitDeclaration"
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

            <el-form-item label="推送服务商" prop="pushThirdApiStatus">
              <el-select style="width: 168px" v-model="form.pushThirdApiStatus" size="small" clearable placeholder="请选择">
                <el-option label="成功" :value="1"></el-option>
                <el-option label="失败" :value="2"></el-option>
              </el-select>
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
        <el-table-column align="center" width="200" label="服务号" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <el-table-column align="center" width="200" label="工单号" show-overflow-tooltip prop="workNo"></el-table-column>

        <el-table-column align="center" width="150" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="业务分类" show-overflow-tooltip prop="serviceName">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            {{ scope.row.type == 1 ? 'WEEE申报' : scope.row.type == 2 ? '包装法申报' : scope.row.type == 3 ? '电池法申报' : '' }}
          </span>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务名称" show-overflow-tooltip prop="serviceSpecName"></el-table-column>

        <el-table-column align="center" width="150" label="申报区间" show-overflow-tooltip prop="nodeCodeName">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            {{ scope.row.beginTime }} -
            {{ scope.row.endTime }}
          </span>
        </el-table-column>
        <el-table-column align="center" width="150" label="周期类型" show-overflow-tooltip prop="declarePeriod">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            {{ scope.row.declarePeriod == 0 ? '月报' : scope.row.declarePeriod == 1 ? '季报' : scope.row.declarePeriod == 2 ? '年报' : '' }}
          </span>
        </el-table-column>

        <el-table-column align="center" width="150" label="申报截止日期" show-overflow-tooltip prop="due"></el-table-column>
        <el-table-column align="center" width="150" label="当前服务进度" show-overflow-tooltip prop="status">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            <span class="show-tooltip">{{ scope.row.status | statusFilter(progressList) }}</span>
          </span>
        </el-table-column>
        <el-table-column align="center" width="150" label="公司中文名称" show-overflow-tooltip prop="companyNameZh"></el-table-column>

        <el-table-column align="center" width="150" label="服务商" show-overflow-tooltip prop="supplierName">
          <span class="show-tooltip-wrapper" slot-scope="scope">
            <!-- <el-link type="primary" class="el-icon-edit show-tooltip-icon" @click="changeServiceProvider(scope.row)" v-if="scope.row.nodeCode === progressBarObj.WAIT_UPLOAD || scope.row.nodeCode === progressBarObj.WAIT_REVIEW || !scope.row.supplierId"></el-link> -->
            <span class="show-tooltip">{{ scope.row.supplierName }}</span>
          </span>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">{{ scope.row.serviceStatus | filterStatus(filterStatusList) }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="推送服务商" prop="status">
          <template slot-scope="scope"
            >{{ scope.row.pushThirdApiStatus | filterPushThirdApiStatus }}

            <el-tooltip popper-class="w-400" v-if="scope.row.pushThirdApiStatus == 2" :content="scope.row.pushThirdApiResult" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column align="center" label="处理人" width="150">
          <template slot-scope="scope">
            <span style="white-space: pre-wrap">{{ scope.row.handler }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="70" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top" v-show="hasAuthority('D2_6')">
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
    <StartDeclareDialog :startDeclareDialog.sync="startDeclareDialog" @refresh="getList" :orderRemark="orderRemark" />
    <BatchUploadReceipt :show.sync="batchUploadReceiptDialog" @refresh="getList" />
  </div>
</template>

<script>
import { progressBarObj } from './enumObj';
import * as comps from '../EPRManage/components/index';
import ChangeManagerDialog from './components/changeManagerDialog';
import StartDeclareDialog from './components/startDeclareDialog';
import { getDisposelist, getCountrySelectList } from '@/api/newApi/common.js';
import { getDeclareListAPI, declareEprExport, batchDeclaration } from '@/api/newApi/workOrder/EPRManage';
import { serviceNode } from '@/api/newApi/taxServices/serviceManage.js';
import { getProductList } from '@/api/newApi/servicemerchant/serviceMerchant.js'; // 使用证据商品

import cacheQuery from '@/mixins/cacheQuery';
import { getUserListByRole, getSupplierList } from '@/api/newApi/common';
import BatchUploadReceipt from '@/view/module/workOrder/components/batchUploadReceipt.vue';

export default {
  name: 'xcloudplat_workOrder_EPRDeclare',
  data() {
    return {
      list: [],
      tabNav: '-2',
      tabs: [
        { nodeCode: '0', nodeName: '未开始' },
        { nodeCode: '1', nodeName: '待上传资料' },
        { nodeCode: '10', nodeName: '款项待确认' },
        { nodeCode: '2', nodeName: '待补缴' },
        { nodeCode: '-1', nodeName: '待申报' },
        { nodeCode: '7', nodeName: '申报中' },
        { nodeCode: '8', nodeName: '申报完成' },
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
        declarePeriod: '',
        pushThirdApiStatus: '',
        supplierId: '',
        customerId: '',
        type: '',
        searchKeyword: '',
        submitDeclaration: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      startDeclareDialog: false,
      batchUploadReceiptDialog: false,
      exportForm: {},
      managerList: [],
      countrySelectList: [{ countryCode: 'FR', countryNameZh: '法国' }],
      supplierList: [],
      checkItem: {},
      tableLoading: false,
      searchFlag: false,
      changeManagerDialog: false,
      // changeServiceProviderDialog: false,
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
        { label: '未购买', value: 0 },
        { label: '正常(服务中)', value: 1 },
        { label: '待续费', value: 2 },
        { label: '税号注销', value: 3 },
        { label: '已转出', value: 4 },
        { label: '已取消', value: 5 },
      ],
      progressBarObj: progressBarObj,
      remarkObj: {},
      checkIds: [],
      moreSerch: false,
      progressList: [
        { nodeCode: 0, nodeName: '未开始' },
        { nodeCode: 1, nodeName: '待上传资料' },
        { nodeCode: 10, nodeName: '款项待确认' },
        { nodeCode: 2, nodeName: '待补缴' },
        { nodeCode: -1, nodeName: '待申报', disabled: true },
        { nodeCode: 3, nodeName: '待申报-客户已补缴' },
        { nodeCode: 4, nodeName: '待申报-客户未补缴' },
        { nodeCode: 5, nodeName: '待申报-客户未超额' },
        { nodeCode: 6, nodeName: '待申报-客户未提交' },
        { nodeCode: 7, nodeName: '申报中' },
        { nodeCode: 8, nodeName: '申报完成' },
      ],
      productList: [],
      serviceNos: [],
      isChangeProcess: true,
      checkOrderRemarkDialog: false,
      orderRemark: '',
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
    ...comps,
    ChangeManagerDialog,
    StartDeclareDialog,
    BatchUploadReceipt,
  },
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
    statusFilter(status, statusList) {
      let result = statusList.find((item) => item.nodeCode === status);
      return result ? result.nodeName : '';
    },
    filterPushThirdApiStatus(status) {
      switch (status) {
        case 0:
          return '-';
        case 1:
          return '成功';
        case 2:
          return '失败';
      }
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    // this.getServiceNode();
    // this.getServiceProgress();
    this.getProductFunc();
    this.getCountry();
    this.getCustomerList(); //客服
    this.getManagerList();
  },
  methods: {
    formatTime() {
      [this.form.submitDeclarationBegin, this.form.submitDeclarationEnd] = this.form.submitDeclaration && this.form.submitDeclaration.length ? this.form.submitDeclaration : ['', ''];
    },
    toUploadAndDownloadRecords() {
      this.$router.push({
        path: '/workOrder/uploadAndDownloadRecords',
      });
    },
    showStartDeclareDialog() {
      this.startDeclareDialog = true;
    },
    batchUploadReceipt() {
      this.batchUploadReceiptDialog = true;
    },
    changeProcess() {
      this.isChangeProcess = true;
    },
    getList() {
      if (this.isChangeProcess) {
        if (this.form.status || this.form.status === 0) {
          if ([3, 4, 5, 6].includes(this.form.status)) {
            this.tabNav = '-1';
          } else {
            this.tabNav = this.form.status + '';
          }
        } else {
          this.tabNav = '-2';
        }

        this.isChangeProcess = false;
      }

      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      let { createTime, ...formData } = this.form;
      getDeclareListAPI(formData)
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
    submitDeclare() {
      if (this.checkIds.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }

      this.$Modal.confirm({
        title: '提交申报',
        content: '提交服务商，工单流转到【待申报】',
        onOk: () => {
          batchDeclaration({
            eprTypes: 1,
            workIds: this.checkIds,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success('操作成功');
              } else {
                this.$Message.warning(res.message);
              }
            })
            .catch((err) => console.log(err));
        },
        onCancel: () => {},
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
    getServiceNode() {
      serviceNode({ functionCode: this.$constant.EPR_FUNCTION_CODE })
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
    // getServiceProgress() {
    //   serviceProgress({ functionCode: this.$constant.EPR_FUNCTION_CODE })
    //     .then((res) => {
    //       if (res.code == 0) {
    //         this.progressList = res.data;
    //       }
    //     })
    //     .catch((err) => {
    //       this.$message.error(err.message);
    //     });
    // },
    changeProgressBar(val) {
      let node = this.progressList.find((item) => this.form.nodeName == item.nodeName);
      // if (!node) {
      //   this.form.status = '';
      //   // this.form.progressBar = '';
      // } else {
      //   this.form.status = Number(node.nodeCode);
      //   // this.form.progressBar = node.nodeValue;
      // }
    },
    // 获取列表查询服务名称
    getProductFunc() {
      getProductList({ size: -1, functionCode: this.$constant.EPR_FUNCTION_CODE }).then((res) => {
        if (res.code == 0) {
          this.productList = res.data.records;
        }
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
      getSupplierList({
        page: 1,
        limit: 9999,
        functionCode: this.$constant.EPR_FUNCTION_CODE,
        countryCode: this.form.countryCode,
      }).then((res) => {
        this.supplierList = res.data;
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
    // checkRejectInfo(row) {
    //   this.checkItem = row;
    //   this.checkRejectInfoDialog = true;
    // },
    handleSelectionChange(val) {
      this.checkIds = val.map((item) => item.workId);
      this.serviceNos = val.map((item) => item.serviceNo);
    },
    tabClick() {
      this.form.page = 1;
      this.form.status = this.tabNav == '-2' ? '' : Number(this.tabNav);
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
    // batchClaim() {
    //   if (!this.checkIds.length) {
    //     this.$message.warning('请选择数据');
    //     return;
    //   }
    //   this.$confirm(`当前认领${this.checkIds.length}条工单，是否确认认领？`, '批量认领', {
    //     customClass: 'custom-confirm',
    //     confirmButtonText: '继续',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     center: true,
    //   }).then(() => {
    //     disposeBatch({
    //       ids: this.checkIds,
    //     }).then((res) => {
    //       if (res.code === 0) {
    //         this.$message.success('认领成功');
    //         this.getList();
    //       }
    //     });
    //   });
    // },
    // 批量提醒
    // batchRemind() {
    //   if (!this.checkIds.length) {
    //     this.$message.warning('请选择数据');
    //     return;
    //   }
    //   this.$confirm(`选中客户：${this.checkIds.length}位，提醒客户提交资料，是否确认发送短信`, '短信提醒', {
    //     customClass: 'custom-confirm',
    //     confirmButtonText: '继续',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     center: true,
    //   }).then(() => {
    //     eprNotice({
    //       code: this.tabNav,
    //       idColl: this.checkIds,
    //     }).then((res) => {
    //       if (res.code === 0) {
    //         this.$message.success('提醒成功');
    //         this.getList();
    //       }
    //     });
    //   });
    // },
    // 修改交付专员
    changeManager() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择数据');
        return;
      }
      this.changeManagerDialog = true;
      this.handlerType = 1;
    },
    // 导出
    _export() {
      this.formatTime();
      let { page, limit, submitDeclaration, ...data } = { ...this.exportForm, type: 1, serviceNos: this.serviceNos };
      // data.TYP
      declareEprExport(data).then((res) => {
        this.$util.exportExcel(res);
      });
      this.$refs.elTables.clearSelection();
    },
    detail(row) {
      this.$router.push({
        path: '/EPRDeclare/detail',
        query: {
          workNo: row.workNo,
          workId: row.workId,
        },
      });
    },
    reset() {
      // if (this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields();
      // }
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
