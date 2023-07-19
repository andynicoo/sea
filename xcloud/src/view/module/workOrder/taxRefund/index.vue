<template>
  <div class="app-container">
    <WorkOrderSearch ref="workOrderSearch" v-model="form" :functionCode="functionCode">
      <template #operator>
        <el-dropdown @command="command" style="margin-left: 20px">
          <el-button type="primary">功能按钮<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changeManager" v-show="hasAuthority('Q1_1')">修改交付专员</el-dropdown-item>
            <el-dropdown-item command="batchChangeCustom" v-show="hasAuthority('Q1_9')">修改客服</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #searchItems>
        <!-- <el-form-item label="税号" prop="taxNumber">
          <el-input v-model="form.taxNumber" placeholder="请输入税号" clearable style="width: 168px" />
        </el-form-item> -->
      </template>
    </WorkOrderSearch>

    <WorkOrderTable ref="workOrderTable" :form="form" :method="method" :functionCode="functionCode" @handleSelectionChange="handleSelectionChange">
      <template #operator="{ row }">
        <el-tooltip content="查看" placement="top">
          <el-link type="primary" :underline="false" @click="detail(row)" v-show="hasAuthority('Q1_3')">
            <i class="icon icon-see"></i>
          </el-link>
        </el-tooltip>
        <el-tooltip content="添加备注" placement="top">
          <el-link type="primary" :underline="false" @click="addRemark(row)" v-show="hasAuthority('Q1_4')">
            <i class="icon icon-remarks"></i>
          </el-link>
        </el-tooltip>
      </template>
    </WorkOrderTable>
    <AddRemarkDialog :addRemarkDialog.sync="addRemarkDialog" :workNo="checkItem.workNo" @refresh="getList" />
    <BatchChangeHandlerDialog :batchChangeHandlerDialog.sync="batchChangeHandlerDialog" :functionCode="functionCode" :workOrderIds="checkIds" :type="handlerType" @refresh="getList" />
  </div>
</template>

<script>
import WorkOrderSearch from '@/view/module/workOrder/components/common/workOrderSearch';
import WorkOrderTable from '@/view/module/workOrder/components/common/workOrderTable';
import BatchChangeHandlerDialog from '@/view/module/workOrder/components/batchChangeHandlerDialog';
import AddRemarkDialog from '@/view/module/workOrder/components/addRemarkDialog.vue';
import { getTaxRefundList } from '@/api/newApi/workOrder/taxRefund';
import { currentCodeEnum } from '@/view/module/workOrder/map.js';

export default {
  data() {
    return {
      checkIds: [],
      form: {
        taxNumber: '',
      },
      functionCode: this.$constant.TAXREFUND_FUNCTION_CODE,
      addRemarkDialog: false, // 添加备注弹窗显示
      batchChangeHandlerDialog: false,
      checkItem: {},
      orderRemark: '',
      currentCodeEnum,
      method: getTaxRefundList,
      handlerType: 1, // 1：客服，2：交付
    };
  },
  components: {
    WorkOrderSearch,
    WorkOrderTable,
    AddRemarkDialog,
    BatchChangeHandlerDialog,
  },
  methods: {
    command(c) {
      this[c]();
    },
    getList() {
      this.$refs.workOrderTable.getList();
    },
    handleSelectionChange(val, checkIds) {
      this.checkIds = checkIds;
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
    // 详情弹窗
    detail(row) {
      this.$router.push({
        path: '/taxRefund/detail',
        query: {
          workOrderId: row.id,
          userId: row.userId,
          serviceNo: row.serviceNo,
        },
      });
    },
    // 添加备注
    addRemark(row) {
      this.checkItem = row;
      this.addRemarkDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.header-btn-group {
  text-align: right;
}
</style>
