<template>
  <div class="app-container">
    <!-- 查询 -->
    <WorkOrderSearch ref="workOrderSearch" v-model="form" :functionCode="functionCode">
      <template #operator>
        <el-dropdown @command="command" style="margin-left: 20px">
          <el-button type="primary">功能按钮<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changeManager" v-show="hasAuthority('K1_1')">修改交付专员</el-dropdown-item>
            <el-dropdown-item command="batchChangeCustom" v-show="hasAuthority('K1_23')">修改客服</el-dropdown-item>
            <el-dropdown-item command="exportData">导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #searchItems>
        <el-form-item label="欧盟税号状态" prop="taxNumberEuStatus">
          <el-select style="width: 168px" v-model="form.taxNumberEuStatus" placeholder="请选择" clearable>
            <el-option :value="1" label="有效"></el-option>
            <el-option :value="0" label="未查询"></el-option>
            <el-option :value="-1" label="失效"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税号" prop="taxNumber">
          <el-input v-model="form.taxNumber" placeholder="请输入税号" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item label="是否新增转代理" prop="isExistProxy">
          <el-select style="width: 168px" v-model="form.isExistProxy" placeholder="请选择" clearable>
            <el-option :value="0" label="否"></el-option>
            <el-option :value="1" label="是"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报税周期" prop="declarePeriod">
          <el-select style="width: 168px" v-model="form.declarePeriod" placeholder="请选择" clearable>
            <el-option :value="0" label="月报"></el-option>
            <el-option :value="1" label="季报"></el-option>
            <el-option :value="2" label="年报"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权状态" prop="authDeclare">
          <el-select style="width: 168px" v-model="form.authDeclare" placeholder="请选择" clearable>
            <el-option :value="true" label="已授权"></el-option>
            <el-option :value="false" label="待授权"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </WorkOrderSearch>
    <WorkOrderTable ref="workOrderTable" :form="form" :method="method" :functionCode="functionCode" @getListData="getListData" @handleSelectionChange="handleSelectionChange">
      <template slot="tableItems">
        <!--       
        <WaringTableColum @showFollow="(val) => ((followItem = val), (showFollow = true))" /> -->
      </template>
      <template #operator="{ row }">
        <el-tooltip effect="dark" content="查看" placement="top">
          <el-link type="primary" class="icon icon-see" :underline="false" @click="handleClickSetting(row)" v-show="hasAuthority('K1_7')"></el-link>
        </el-tooltip>
        <el-tooltip effect="dark" content="备注" placement="top">
          <el-link type="primary" class="icon icon-remarks" :underline="false" @click.native="addRemark(row)" v-show="hasAuthority('K1_8')"></el-link>
        </el-tooltip>
        <el-tooltip effect="dark" content="确认转出：指已从服务商/税局转出该公司的申报服务" placement="top">
          <span>
            <el-link type="primary" class="icon icon-out" :underline="false" @click="transferConfirm([row.serviceId])" v-if="row.status === 4" v-show="hasAuthority('K1_25')"></el-link>
          </span>
        </el-tooltip>
        <!-- 英国、服务中、待授权、转代理完成、筛选了待授权 -->
        <el-tooltip effect="dark" content="授权报税" placement="top">
          <span>
            <el-link type="primary" class="icon icon-out" :underline="false" @click="authToDeclare" v-if="row.countryCode === 'GB' && row.status === 1 && !row.authDeclare && row.currentNodeCode === currentCodeEnum.NODE8 && searchAuthDeclare === false" v-show="hasAuthority('K1_19')"></el-link>
          </span>
        </el-tooltip>
      </template>
    </WorkOrderTable>

    <IndexModel :dialog="model" :queryData="getList" />
    <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :serviceNo="serviceNo" />
    <BatchModifySupplierModel :batchModifySupplierDialog.sync="batchModifySupplierDialog" :queryData="getList" :batchModifySupplierObj="batchModifySupplierObj" :functionCode="functionCode" />
    <AddRemarkDialog :addRemarkDialog.sync="addRemarkDialog" :workNo="checkedRow.workNo" @refresh="getList" />
    <BatchChangeHandlerDialog :batchChangeHandlerDialog.sync="batchChangeHandlerDialog" :functionCode="functionCode" :workOrderIds="checkIds" :type="handlerType" @refresh="getList" />
    <WaringDrawer v-if="showFollow" :visible.sync="showFollow" :detailId="followItem.id" />
  </div>
</template>
<script>
import WorkOrderSearch from '@/view/module/workOrder/components/common/workOrderSearch';
import WorkOrderTable from '@/view/module/workOrder/components/common/workOrderTable';
import IndexModel from './Model'; //列表用到的弹窗
import { getList, sendsmCode, seelistRemark, serviceNode, listReject, transferOut } from '@/api/newApi/taxServices/serviceManage.js';
import { getCountrySelectList, getDisposelist, getRejectCode, serviceStatus, serviceProgress } from '@/api/newApi/common.js';
import { getproductInfoList } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';
import { getPageList, getwayCallback } from '@/api/newApi/taxServices/taxRegister.js';
import CheckRejectInfoDialog from '@/view/module/workOrder/components/checkRejectInfoDialog';
import cacheQuery from '@/mixins/cacheQuery';
import BatchModifySupplierModel from '../components/batchModifySupplierModel';
import AddRemarkDialog from '@/view/module/workOrder/components/addRemarkDialog.vue';
import BatchChangeHandlerDialog from '@/view/module/workOrder/components/batchChangeHandlerDialog';
import { getUserListByRole } from '@/api/newApi/common';
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
import WaringTableColum from '@/components/waringTableColum/tableColumn';
export default {
  components: {
    IndexModel,
    CheckRejectInfoDialog,
    BatchModifySupplierModel,
    WorkOrderSearch,
    WorkOrderTable,
    AddRemarkDialog,
    BatchChangeHandlerDialog,
    WaringTableColum,
    WaringDrawer: () => import('../../../../components/waringDrawer/waringDrawer.vue'),
  },
  data() {
    return {
      form: {
        functionCodeColl: [2],
        taxNumberEuStatus: '',
        isProxy: 1,
        taxNumber: '',
        isExistProxy: '',
        declarePeriod: '',
        authDeclare: '',
      },
      functionCode: this.$constant.TAXProxy_FUNCTION_CODE,
      list: [],
      countrySelect: [], //国家列表
      supplierList: [], //服务商列表
      supplier: {}, //修改服务商参数
      remarkObj: {}, //备注
      taxInfo: {},
      selectList: [], //表格勾选数
      checkIds: [],
      checkedRow: {},
      model: {
        remarkModel: false, //备注弹窗
        progressModel: false, //更改进度弹窗
        taxInfoModel: false, //税号信息
        serviceModel: false, //修改服务商
        seeRemarkModel: false, //查看备注
        changeCustomerModel: false, //修改客服
        orderRemarkModel: false,
        serviceNo: '',
        nodeCodeName: '',
        serviceId: '',
        listRemark: [],
        servicesIds: [], //
        activities: [], //查看驳回详情列表
        taxManagerList: [], //交付专员列表
        serviceIdColl: [],
        taxManagerModel: false,
        commissionerList: [],
        serviceIds: [],
        supplierList: [], //服务商列表
        checkItem: {},
      },
      checkRejectInfoDialog: false, //查看驳回
      serviceNo: '',
      moreSerch: false,
      // 搜索的服务状态
      searchStatus: -1,
      searchAuthDeclare: '',
      batchModifySupplierObj: {
        countryCode: '',
        functionCode: '',
        curNodeCode: '',
        countryNameZh: '',
        serviceIds: [],
      },
      batchModifySupplierDialog: false,
      batchChangeHandlerDialog: false,
      addRemarkDialog: false,
      currentCodeEnum,
      method: getPageList,
      handlerType: 1, // 1：客服，2：交付
      showFollow: false,
      followItem: {},
    };
  },
  created() {
    this.getManagerList(); //交付专员
    this.getCustomerList(); //客服
  },
  mounted() {
    this.getwayCallBackFun();
  },
  methods: {
    command(c) {
      this[c]();
    },
    getList() {
      this.$refs.workOrderTable.getList();
    },
    getListData({ form }) {
      this.searchStatus = form.status;
      this.searchAuthDeclare = form.authDeclare;
    },
    //多选勾选
    handleSelectionChange(val, checkIds) {
      this.selectList = val;
      this.checkIds = checkIds;
    },
    batchModifySupplier() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      const countryCode = this.selectList[0].countryCode;
      const productFunctionCode = this.selectList[0].productFunctionCode;
      if (this.selectList.some((item) => item.countryCode != countryCode || item.productFunctionCode != productFunctionCode)) {
        this.$message.error('不符合批量操作要求，请确认勾选的服务单（国家和税务类型）一致。');
        return;
      }
      this.batchModifySupplierObj.workIdColl = this.checkIds;
      this.batchModifySupplierObj.countryCode = this.selectList[0].countryCode;
      this.batchModifySupplierObj.functionCode = this.selectList[0].productFunctionCode;
      this.batchModifySupplierObj.curNodeCode = this.selectList[0].currentNodeCode;
      this.batchModifySupplierObj.countryNameZh = this.selectList[0].countryNameZh;
      this.batchModifySupplierObj.declareType = this.selectList[0].declarePeriod;
      this.batchModifySupplierDialog = true;
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
      getUserListByRole({
        roleCode: this.$constant.VAT_CUSTOMER_SERVICE,
      }).then((res) => {
        this.model.commissionerList = res.data;
      });
    },

    // 修改服务商
    changeServiceProvider(row) {
      this.model.checkItem = row;
      this.model.serviceModel = true;
      this.getSuppllier(row.countryCode, [row.productFunctionCode], 'table'); //服务商列表
    },

    /** 获取服务商列表 */
    getSuppllier(countryCode, functionCode, type) {
      this.supplierList = [];
      this.model.supplierList = [];
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCodes: functionCode,
        countryCode: countryCode,
      }).then((res) => {
        if (type == 'list') {
          this.supplierList = res.data.records;
        } else {
          this.model.supplierList = res.data.records;
        }
      });
    },

    // 获取交付专员列表
    getManagerList() {
      getDisposelist({
        functionCode: this.functionCode,
      }).then((res) => {
        this.model.taxManagerList = res.data;
      });
    },
    /**
     * 批量提醒
     */
    batchReminder() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      this.$confirm('<h3>发送提醒后，客户将收到短信通知</h3><div>确定发送吗？</div>', '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true,
      }).then(() => {
        workOrderCommonOperator('remind', { workOrderIds: [this.checkIds] }).then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
          }
        });
      });
    },
    /** 备注弹窗 */
    addRemark(row) {
      this.checkedRow = row;
      this.addRemarkDialog = true;
    },
    /**获取驳回节点 (驳回节点可能为空)*/
    getRejectNode(row) {
      getRejectCode({
        nodeCode: row.nodeCode,
        nodeId: row.nodeId,
        workFlowId: row.flowId,
      }).then((res) => {
        if (res.code == 0) {
          this.nodeName = res.data.nodeName;
        }
      });
    },
    // 一键转出
    batchTransfer() {
      if (this.selectList.length == 0) {
        this.$message.warning('无勾选数据，请先勾选服务单');
        return;
      }
      this.transferConfirm(this.selectList.map((item) => item.serviceId));
    },
    // 确认转出
    transferConfirm(servicesIds) {
      this.$confirm('确认转出？', '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        transferOut({ servicesIds }).then((res) => {
          if (res.code === 0) {
            this.$message.success('确认转出成功');
            this.getList();
          }
        });
      });
    },

    /**
     * 查看
     */
    handleClickSetting(row) {
      this.$router.push({
        name: 'internalTaxInfo',
        query: { workOrderId: row.id, serviceNo: row.serviceNo },
      });
    },
    // 授权回调
    getwayCallBackFun() {
      if (window.location.search.indexOf('state') > 0 && window.location.search.indexOf('code') > 0) {
        var code = this.$util.getQueryVariable('code');
        var state = this.$util.getQueryVariable('state');
        getwayCallback({
          code: code,
          state: state,
          location: 2,
        }).then((res) => {});

        var url = window.location.href;
        url = url.split('?')[0];
        window.history.pushState({}, 0, url);
      }
    },
    // 授权报税
    authToDeclare() {
      window.open('https://www.tax.service.gov.uk/oauth/start?auth_id=62be61ee190000060708a512&state=YfxUEpJHfyYizag03hdev6G%252BAm2Zd67lCkKriEDhEvTKjQPTQtV%252BXg%253D%253D');
    },
    // 导出
    exportData() {
      this.$refs.workOrderTable.exportData();
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/fixedSearch.scss';
.header-tittle {
  overflow: hidden;
  padding: 10px;
}
.batch {
  color: #fff !important;
  background: #ffc100;
  border-color: #ffc100 !important ;
}
.table-container {
  position: relative;
}

.modifySuppierBtn {
  position: absolute;
  top: 9px;
  right: 20px;
}
</style>
