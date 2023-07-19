<template>
  <div class="app-container">
    <!-- 查询 -->
    <WorkOrderSearch ref="workOrderSearch" v-model="form" :functionCode="functionCode" showBatchSearch>
      <template #operator>
        <el-dropdown @command="command" style="margin-left: 20px">
          <el-button type="primary">功能按钮<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changeManager" v-show="hasAuthority('L1_1')">修改交付专员</el-dropdown-item>
            <el-dropdown-item command="batchChangeCustom" v-show="hasAuthority('L1_29')">修改客服</el-dropdown-item>
            <el-dropdown-item command="batchModifySupplier" v-if="[currentCodeEnum.NODE2, currentCodeEnum.NODE3, currentCodeEnum.NODE7, currentCodeEnum.NODE8].includes(form.currentNodeCode)" v-show="hasAuthority('L1_32')">修改服务商</el-dropdown-item>
            <el-dropdown-item command="batchReminder" v-if="[currentCodeEnum.NODE2, currentCodeEnum.NODE5].includes(form.currentNodeCode)" v-show="hasAuthority('L1_2')">批量提醒</el-dropdown-item>
            <el-tooltip effect="dark" content="确认转出：指已从服务商/税局转出该公司的申报服务" placement="top">
              <el-dropdown-item command="batchTransfer" v-if="searchStatus === 4" v-show="hasAuthority('L1_30')">一键转出</el-dropdown-item>
            </el-tooltip>
            <el-dropdown-item command="batchDownload" v-if="![undefined, '', currentCodeEnum.NODE2].includes(form.currentNodeCode)" v-show="hasAuthority('L1_39')">下载客户资料</el-dropdown-item>
            <!-- TODO hasAuthority -->
            <!-- <el-dropdown-item command="batchUploadEORI" v-show="hasAuthority('L1_39')">上传EORI文件</el-dropdown-item> -->
            <!-- TODO hasAuthority -->
            <!-- <el-dropdown-item command="batchUploadProviderCode" v-show="hasAuthority('L1_39')">上传服务商分配编码</el-dropdown-item> -->
            <el-dropdown-item command="batchUploadGateway" v-show="hasAuthority('L1_40')">上传gateway账号密码</el-dropdown-item>
            <el-dropdown-item command="editLabel" v-show="hasAuthority('L1_43')">设置标签</el-dropdown-item>
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
        <!-- <el-form-item label="注册异常" prop="reject">
          <el-select style="width: 168px" v-model="form.reject" placeholder="请选择" clearable>
            <el-option value="1" label="异常"></el-option>
            <el-option value="2" label="预警"></el-option>
            <el-option value="3" label="无"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item prop="flagCustomerData" label="发送注册资料" label-width="130px">
          <el-select style="width: 150px" placeholder="发送注册资料" v-model="form.flagCustomerData" clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="emailSend" label="客户发送邮件状态" label-width="130px">
          <el-select style="width: 140px" placeholder="客户发送邮件状态" v-model="form.emailSend" clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </WorkOrderSearch>

    <WorkOrderTable ref="workOrderTable" :form="form" :method="method" :functionCode="functionCode" @getListData="getListData" @handleSelectionChange="handleSelectionChange">
      <template slot="tableItems">
        <WaringTableColum @showFollow="(val) => ((followItem = val), (showFollow = true))" />
      </template>
      <template #operator="{ row }">
        <el-tooltip effect="dark" content="查看" placement="top">
          <el-link type="primary" class="icon icon-see" :underline="false" @click="handleClickSetting(row)" v-show="hasAuthority('L1_7')"></el-link>
        </el-tooltip>
        <el-tooltip effect="dark" content="备注" placement="top">
          <el-link type="primary" class="icon icon-remarks" :underline="false" @click.native="addRemark(row)" v-show="hasAuthority('L1_8')"></el-link>
        </el-tooltip>
        <el-tooltip effect="dark" content="确认转出：指已从服务商/税局转出该公司的申报服务" placement="top">
          <span>
            <el-link type="primary" class="icon icon-out" :underline="false" @click="transferConfirm([row.serviceId])" v-if="row.status === 4" v-show="hasAuthority('L1_31')"></el-link>
          </span>
        </el-tooltip>
        <!-- 英国、服务中、待授权、转代理完成、筛选了待授权 -->
        <el-tooltip effect="dark" content="授权报税" placement="top">
          <span>
            <el-link type="primary" class="icon icon-out" :underline="false" @click="authToDeclare" v-if="row.countryCode === 'GB' && row.status === 1 && !row.authDeclare && row.currentNodeCode === currentCodeEnum.NODE8 && searchAuthDeclare === false" v-show="hasAuthority('L1_21')"></el-link>
          </span>
        </el-tooltip>
      </template>
    </WorkOrderTable>
    <EditLableDialog v-if="showEditeLable" :visible.sync="showEditeLable" :selectList="selectList" @update="getList" />
    <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :workNo="checkedRow.workNo" />
    <CheckOrderRemarkDialog :checkOrderRemarkDialog.sync="checkOrderRemarkDialog" :orderRemark="orderRemark" />
    <BatchModifySupplierModel :batchModifySupplierDialog.sync="batchModifySupplierDialog" :queryData="getList" :batchModifySupplierObj="batchModifySupplierObj" :functionCode="batchModifySupplierObj.functionCode" />
    <BatchDownloadDialog :batchDownloadDialog.sync="batchDownloadDialog" contentText="注册资料" :checkIds="checkIds" />
    <BatchUploadEORIDialog :batchUploadEORIDialog.sync="batchUploadEORIDialog" :checkIds="checkIds" />
    <BatchUploadProviderCodeDialog :batchUploadProviderCodeDialog.sync="batchUploadProviderCodeDialog" :checkIds="checkIds" />
    <BatchUploadGatewayDialog :batchUploadGatewayDialog.sync="batchUploadGatewayDialog" :checkIds="serviceIds" />
    <BatchSubmitProviderDialog :batchSubmitProviderDialog.sync="batchSubmitProviderDialog" :checkIds="checkIds" />
    <AddRemarkDialog :addRemarkDialog.sync="addRemarkDialog" :workNo="checkedRow.workNo" @refresh="getList" />
    <BatchChangeHandlerDialog :batchChangeHandlerDialog.sync="batchChangeHandlerDialog" :functionCode="functionCode" :workOrderIds="checkIds" :type="handlerType" @refresh="getList" />
    <WaringDrawer v-if="showFollow" :visible.sync="showFollow" :detailId="followItem.id" />
  </div>
</template>
<script>
import WorkOrderSearch from '@/view/module/workOrder/components/common/workOrderSearch';
import WorkOrderTable from '@/view/module/workOrder/components/common/workOrderTable';
import { transferOut } from '@/api/newApi/taxServices/serviceManage.js';
import { getPageList, getwayCallback } from '@/api/newApi/taxServices/taxRegister.js';
import CheckRejectInfoDialog from '@/view/module/workOrder/components/checkRejectInfoDialog';
import CheckOrderRemarkDialog from '@/view/module/workOrder/components/checkOrderRemarkDialog';
import BatchModifySupplierModel from '../components/batchModifySupplierModel';
import BatchDownloadDialog from '@/view/module/workOrder/components/batchDownloadDialog.vue';
import BatchUploadEORIDialog from '@/view/module/workOrder/components/batchUploadEORIDialog.vue';
import BatchUploadProviderCodeDialog from '@/view/module/workOrder/components/batchUploadProviderCodeDialog.vue';
import BatchUploadGatewayDialog from '@/view/module/workOrder/components/batchUploadGatewayDialog.vue';
import BatchSubmitProviderDialog from '@/view/module/workOrder/components/batchSubmitProviderDialog.vue';
import AddRemarkDialog from '@/view/module/workOrder/components/addRemarkDialog.vue';
import BatchChangeHandlerDialog from '@/view/module/workOrder/components/batchChangeHandlerDialog';
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
import WaringTableColum from '@/components/waringTableColum/tableColumn';
import dayjs from 'dayjs';
export default {
  components: {
    CheckRejectInfoDialog,
    CheckOrderRemarkDialog,
    BatchModifySupplierModel,
    BatchDownloadDialog,
    BatchUploadEORIDialog,
    BatchUploadProviderCodeDialog,
    BatchUploadGatewayDialog,
    BatchSubmitProviderDialog,
    AddRemarkDialog,
    BatchChangeHandlerDialog,
    WorkOrderSearch,
    WorkOrderTable,
    EditLableDialog: () => import('../../../../components/editLableDialog/editLableDialog'),
    WaringTableColum,
    WaringDrawer: () => import('../../../../components/waringDrawer/waringDrawer.vue'),
  },
  data() {
    return {
      form: {
        functionCodeColl: [5, 23],
        taxNumberEuStatus: '',
        taxNumber: '',
        isExistProxy: '',
        declarePeriod: '',
        authDeclare: '',
        reject: '',
      },
      functionCode: this.$constant.TAXRegAnd_FUNCTION_CODE,
      method: getPageList,
      selectList: [], //表格勾选数
      checkRejectInfoDialog: false,
      checkOrderRemarkDialog: false,
      orderRemark: '',
      // 搜索的服务状态
      searchStatus: -1,
      searchAuthDeclare: '',
      batchModifySupplierObj: {
        countryCode: '',
        functionCode: '',
        curNodeCode: '',
        countryNameZh: '',
        declareType: null,
        serviceIds: [],
      },
      batchModifySupplierDialog: false,
      batchDownloadDialog: false,
      batchUploadEORIDialog: false,
      batchUploadProviderCodeDialog: false,
      batchUploadGatewayDialog: false,
      batchSubmitProviderDialog: false,
      addRemarkDialog: false,
      batchChangeHandlerDialog: false,
      checkedRow: {},
      checkIds: [],
      serviceIds: [],
      currentCodeEnum,
      handlerType: 1, // 1：客服，2：交付
      showEditeLable: false,
      showFollow: false,
      followItem: {},
    };
  },
  mounted() {
    this.getwayCallBackFun();
  },
  methods: {
    command(c) {
      this[c]();
    },
    /*批量修改标签*/

    editLabel() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      } else {
        this.showEditeLable = true;
      }
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
      this.serviceIds = this.selectList.map((item) => item.serviceId);
    },
    batchModifySupplier() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      const countryCode = this.selectList[0].countryCode;
      const functionCode = this.selectList[0].functionCode;
      const declarePeriod = this.selectList[0].declarePeriod;
      if (this.selectList.some((item) => item.countryCode != countryCode || item.functionCode != functionCode)) {
        this.$message.error('不符合批量操作要求，请确认勾选的服务单（国家和税务类型）一致。');
        return;
      }
      if (this.form.currentNodeCode == this.currentCodeEnum.NODE8 && this.selectList.some((item) => item.declarePeriod !== declarePeriod)) {
        this.$message.error('不符合批量操作要求，请确认勾选的服务单（申报周期）一致。');
        return;
      }
      if (this.selectList.some((item) => item.status !== 1)) {
        let statusArr = this.selectList.filter((item) => item.status !== 1).map((item) => item.status);
        let statusStr = [...new Set(statusArr)].map((item) => this.$options.filters.serviceStatus(item)).join('、');
        this.$message.error(`工单服务状态为：${statusStr}，不支持转出；若需修改，走钉钉审批：中台数据修改审批；`);
        return;
      }
      this.batchModifySupplierObj.workIdColl = this.checkIds;
      this.batchModifySupplierObj.countryCode = this.selectList[0].countryCode;
      this.batchModifySupplierObj.functionCode = this.selectList[0].functionCode;
      this.batchModifySupplierObj.curNodeCode = this.selectList[0].currentNodeCode;
      this.batchModifySupplierObj.countryNameZh = this.selectList[0].countryNameZh;
      this.batchModifySupplierObj.declareType = this.selectList[0].declarePeriod;
      this.batchModifySupplierDialog = true;
    },
    /**
     * 下载客户资料
     */
    batchDownload() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      if (this.selectList.some((item) => item.functionCode !== this.selectList[0].functionCode)) {
        this.$message.warning('请选择相同税务类型的工单');
        return;
      }
      this.batchDownloadDialog = true;
    },
    /**
     * 上传EORI
     */
    batchUploadEORI() {
      this.batchUploadEORIDialog = true;
    },
    /**
     * 上传服务商分配编码
     */
    batchUploadProviderCode() {
      this.batchUploadProviderCodeDialog = true;
    },
    /**
     * 上传gateway账号密码
     */
    batchUploadGateway() {
      this.batchUploadGatewayDialog = true;
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
    // 查看驳回详情
    checkRejectInfo(row) {
      this.checkedRow = row;
      this.checkRejectInfoDialog = true;
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
      // 待审核资料 && 德国 跳转新详情
      if (row.currentNodeCode === 'NODE3' && row.countryCode === 'DE' && row.functionCode !== 23 && localStorage.getItem('enterpriseId') === '29' && dayjs(row.flowCreateTime).isAfter(dayjs('2023-07-06 22:30:00'))) {
        this.$router.push(`/adminNewApp/workOrder/vatServices/taxRegister/details?id=${row.id}`);
      } else {
        this.$router.push({
          name: 'taxRegisterInfo',
          query: { workOrderId: row.id, serviceNo: row.serviceNo },
        });
      }
    },
    // 授权回调
    getwayCallBackFun() {
      if (window.location.search.indexOf('state') > 0 && window.location.search.indexOf('code') > 0) {
        var code = this.$util.getQueryVariable('code');
        var state = this.$util.getQueryVariable('state');
        getwayCallback({
          code: code,
          state: state,
          location: 1,
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
