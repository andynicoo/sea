<template>
  <div class="app-container">
    <!-- 查询 -->
    <WorkOrderSearch ref="workOrderSearch" v-model="form" :functionCode="functionCode">
      <template #operator>
        <el-dropdown @command="command" style="margin-left: 20px">
          <el-button type="primary">功能按钮<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="batchRemind" v-show="form.currentNodeCode === currentCodeEnum.NODE5 && form.status === 1 && hasAuthority('N1_19')">批量提醒</el-dropdown-item>
            <el-dropdown-item command="changeManager" v-show="hasAuthority('N1_1')">修改交付专员</el-dropdown-item>
            <el-dropdown-item command="batchChangeCustom" v-show="hasAuthority('N1_18')">修改客服</el-dropdown-item>
            <!-- TODO hasAuthority -->
            <!-- <el-dropdown-item command="batchDownload" v-if="form.currentNodeCode === currentCodeEnum.NODE8" v-show="hasAuthority('L1_39')">下载客户资料</el-dropdown-item> -->
            <!-- TODO hasAuthority -->
            <!-- <el-dropdown-item command="batchUploadHYFile" v-show="hasAuthority('L1_39')">上传海牙文件</el-dropdown-item> -->
            <!-- TODO hasAuthority -->
            <!-- <el-dropdown-item command="batchSubmitProvider" v-if="form.currentNodeCode === currentCodeEnum.NODE5" v-show="hasAuthority('L1_39')">提交服务商</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </WorkOrderSearch>

    <WorkOrderTable ref="workOrderTable" :form="form" :method="method" :functionCode="functionCode" @handleSelectionChange="handleSelectionChange">
      <template #operator="{ row }">
        <el-tooltip content="查看" placement="top">
          <el-link type="primary" :underline="false" @click="detail(row)" v-show="hasAuthority('N1_5')">
            <i class="icon icon-see"></i>
          </el-link>
        </el-tooltip>
        <el-tooltip content="备注" placement="top">
          <el-link type="primary" :underline="false" @click="addRemark(row)" v-show="hasAuthority('N1_6')">
            <i class="icon icon-remarks"></i>
          </el-link>
        </el-tooltip>
      </template>
    </WorkOrderTable>
    <CustomerDialog :typeNum="1" :changeCustomerModel.sync="changeCustomerModel" :serviceIds="serviceIds" :commissionerList="commissionerList" :queryData="getList"></CustomerDialog>
    <ChangeManagerDialog :changeManagerDialog.sync="changeManagerDialog" :userList="managerList" :serviceIdColl="checkIds" @refresh="getList"></ChangeManagerDialog>
    <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :serviceNo="checkItem.serviceNo"></CheckRejectInfoDialog>
    <CheckRemarkDialog :checkRemarkDialog.sync="checkRemarkDialog" :serviceNo="checkItem.serviceNo" @refresh="getList"></CheckRemarkDialog>
    <RemarkDialog :remarkDialog.sync="remarkDialog" :serviceNo="checkItem.serviceNo" @refresh="getList"></RemarkDialog>
    <ChangeServiceProviderDialog :changeServiceProviderDialog.sync="changeServiceProviderDialog" :countryNameZh="checkItem.countryNameZh" :serviceNo="checkItem.serviceNo" :serviceId="checkItem.serviceId" :countryCode="checkItem.countryCode" @refresh="getList"></ChangeServiceProviderDialog>
    <BatchDownloadDialog :batchDownloadDialog.sync="batchDownloadDialog" contentText="海牙文件" :checkIds="checkIds" />
    <BatchUploadHYFileDialog :batchUploadHYFileDialog.sync="batchUploadHYFileDialog" :checkIds="checkIds" />
    <BatchSubmitProviderDialog :batchSubmitProviderDialog.sync="batchSubmitProviderDialog" :checkIds="checkIds" />
    <BatchChangeHandlerDialog :batchChangeHandlerDialog.sync="batchChangeHandlerDialog" :functionCode="functionCode" :workOrderIds="checkIds" :type="handlerType" @refresh="getList" />
  </div>
</template>

<script>
import WorkOrderSearch from '@/view/module/workOrder/components/common/workOrderSearch';
import WorkOrderTable from '@/view/module/workOrder/components/common/workOrderTable';
import * as comps from './components/index';
import ChangeManagerDialog from '@/view/module/workOrder/authorizedRepresent/components/changeManagerDialog';
import CheckRejectInfoDialog from '@/view/module/workOrder/components/checkRejectInfoDialog';
import { statusList } from '@/view/module/workOrder/map.js';
import { getApostilleList, sendSmsBatch } from '@/api/newApi/workOrder/hyCertification';
import { getDisposelist, serviceProgress } from '@/api/newApi/common';
import { serviceNode, dispose, disposeBatch } from '@/api/newApi/taxServices/serviceManage.js';
import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';
import cacheQuery from '@/mixins/cacheQuery';
import CustomerDialog from '@/view/module/newTaxServices/taxNumDeclare/components/customerDialog';
import { getUserListByRole } from '@/api/newApi/common';
import BatchDownloadDialog from '@/view/module/workOrder/components/batchDownloadDialog.vue';
import BatchChangeHandlerDialog from '@/view/module/workOrder/components/batchChangeHandlerDialog';
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
export default {
  data() {
    return {
      form: {},
      functionCode: this.$constant.HYCERTIFICATION_FUNCTION_CODE,
      managerList: [],
      serviceIds: [],
      changeCustomerModel: false,
      commissionerList: [],
      progressList: [],
      eSSupplierList: [], //西班牙服务商列表
      tableLoading: false,
      searchFlag: false,
      checkRejectInfoDialog: false,
      checkRemarkDialog: false, // 查看备注弹窗显示
      remarkDialog: false, // 添加备注弹窗显示
      changeManagerDialog: false,
      changeServiceProviderDialog: false,
      batchDownloadDialog: false,
      batchUploadHYFileDialog: false,
      batchSubmitProviderDialog: false,
      batchChangeHandlerDialog: false,
      checkItem: {},
      selectList: [],
      checkIds: [],
      currentCodeEnum,
      method: getApostilleList,
      handlerType: 1, // 1：客服，2：交付
    };
  },
  mixins: [cacheQuery],
  components: {
    ...comps,
    ChangeManagerDialog,
    CheckRejectInfoDialog,
    CustomerDialog,
    BatchDownloadDialog,
    BatchChangeHandlerDialog,
    WorkOrderSearch,
    WorkOrderTable,
  },
  mounted() {
    this.getManagerList();
    this.getCustomerList(); //客服
    this.getEsSuppliers(); //获取海牙服务商
  },
  methods: {
    command(c) {
      this[c]();
    },
    getList() {
      this.$refs.workOrderTable.getList();
    },
    handleSelectionChange(val, checkIds) {
      this.selectList = val;
      this.checkIds = checkIds;
    },

    //** 海牙认证批量提醒按钮 */
    batchRemind() {
      const h = this.$createElement;
      let text = `当前勾选" ${this.checkIds.length}  "位客户，是否确定发送短信？`;
      if (this.checkIds.length === 0) {
        this.$message.warning('请先勾选需要发送短信的用户');
        return;
      }
      this.$msgbox({
        title: '短信提醒',
        message: h('div', null, [h('p', null, '此短信内容为:提醒客户邮寄授权书'), h('p', null, text)]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        workOrderCommonOperator('remind', { workOrderIds: [this.checkIds] }).then((res) => {
          if (res.code === 0) {
            this.$message.success('短信发送成功');
          }
        });
        // this.sendSmsBatchApi({ cureentNodeCode: this.form.currentNodeCode, servicesIds: this.checkIds });
      });
    },

    /**发送短信*/
    async sendSmsBatchApi(parm) {
      try {
        let { code, message } = await sendSmsBatch(parm);

        code === 0 ? this.$message.success('短信发送成功') : this.$message.error(message);
      } catch (error) {
        this.$message.error('程序出现问题请联系管理员');
      }
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
     * 上传海牙文件
     */
    batchUploadHYFile() {
      this.batchUploadHYFileDialog = true;
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
    // 获取客服
    getCustomerList() {
      getUserListByRole({
        roleCode: this.$constant.VAT_CUSTOMER_SERVICE,
      }).then((res) => {
        console.log(res);
        this.commissionerList = res.data;
      });
    },
    // 获取服务商列表
    getEsSuppliers() {
      findSuppliers({
        page: 1,
        limit: 9999,
        counrtycode: 'es',
        functionCode: this.functionCode,
      }).then((res) => {
        this.eSSupplierList = res.data.records;
      });
    },
    // 获取交付专员列表
    getManagerList() {
      getDisposelist({
        functionCode: this.functionCode,
      }).then((res) => {
        this.managerList = res.data;
      });
    },
    /**
     * 修改交付专员
     */
    changeManager() {
      if (this.checkIds.length == 0) {
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
      if (this.checkIds.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      this.handlerType = 1;
      this.batchChangeHandlerDialog = true;
    },
    // 批量认领
    BatchClaim() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择要操作的数据！');
        return;
      }
      this.$confirm('确定认领吗？', '认领', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        disposeBatch({
          ids: this.checkIds,
        }).then((res) => {
          this.getList();
        });
      });
    },

    // 详情
    detail(row) {
      this.$router.push({
        path: '/hyCertification/detail',
        query: {
          workOrderId: row.id,
          serviceNo: row.serviceNo,
          userId: row.userId,
        },
      });
    },
    // 查看驳回详情
    checkRejectInfo(row) {
      this.checkItem = row;
      this.checkRejectInfoDialog = true;
    },
    // 查看备注
    checkRemark(row) {
      this.checkItem = row;
      this.checkRemarkDialog = true;
    },
    // 认领
    claim(id) {
      this.$confirm('是否确认认领？', '认领', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        dispose(id).then((res) => {
          if (res.code === 0) {
            this.$message.success('认领成功');
            this.getList();
          }
        });
      });
    },
    // 添加备注
    addRemark(row) {
      this.checkItem = row;
      this.remarkDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.header-btn-group {
  text-align: right;
}
.message-btn-icon {
  width: 0px;
  margin: 0px;
}
</style>
