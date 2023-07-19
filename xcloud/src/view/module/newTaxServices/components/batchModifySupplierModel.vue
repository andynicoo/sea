<template>
  <el-dialog :visible.sync="dialogvisible" width="560px" center @close="clearSupplier">
    <div slot="title" class="supplier-title">
      <p>修改服务商</p>
      <span>勾选服务单（国家和税务类型一致），支持批量修改；</span>
    </div>
    <el-form :model="form" :rules="rules" label-width="180px" ref="ruleForm">
      <el-form-item label="国家：">{{ batchModifySupplierObj.countryNameZh }}</el-form-item>
      <el-form-item label="选择服务商：" prop="newSupplierId">
        <el-select v-model="form.newSupplierId" clearable filterable>
          <el-option v-for="(item, key) in supplierList" :key="key" :value="item.id" :label="item.shortName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务进度是否改变：" prop="isChangeProcess" v-if="batchModifySupplierObj.curNodeCode == currentCodeEnum.NODE7">
        <el-radio-group v-model="form.isChangeProcess">
          <el-radio label="0">保留当前服务进度（流程不更新）</el-radio>
          <el-radio label="1">驳回到：待审核（流程更新）</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="与原服务商合作状态：" prop="oldSupplierCooperationStatus" v-if="batchModifySupplierObj.curNodeCode == currentCodeEnum.NODE8">
        <el-radio-group v-model="form.oldSupplierCooperationStatus">
          <el-radio :label="1">未成功交易（此单未产生成本）</el-radio>
          <el-radio :label="2">转出</el-radio>
        </el-radio-group>
        <p class="warn-color">此项指：服务从原服务商转出，转入新服务商</p>
      </el-form-item>

      <el-form-item label="新服务商服务进度：" prop="newNodeCode" v-if="form.oldSupplierCooperationStatus == 2">
        <el-radio-group v-model="form.newNodeCode">
          <el-radio :label="currentCodeEnum.NODE3">待审核资料</el-radio>
          <el-radio :label="currentCodeEnum.NODE7">办理中</el-radio>
          <el-radio :label="currentCodeEnum.NODE8">已完成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="转代理开始申报周期：" prop="selectMonth" v-if="form.oldSupplierCooperationStatus == 2 && form.newNodeCode == currentCodeEnum.NODE8">
        <el-date-picker v-model="form.selectMonth" type="monthrange" value-format="yyyy-MM" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"> </el-date-picker>
      </el-form-item>
      <el-form-item label="申报周期类型：" v-if="form.oldSupplierCooperationStatus == 2 && form.newNodeCode == currentCodeEnum.NODE8">
        <span>
          {{ batchModifySupplierObj.declareType == 0 ? '月报' : batchModifySupplierObj.declareType == 1 ? '季报' : batchModifySupplierObj.declareType == 2 ? '年报' : '' }}
        </span>
      </el-form-item>
    </el-form>
    <p class="warn-color">{{ tipMap[batchModifySupplierObj.curNodeCode] }}</p>
    <div slot="footer" style="text-align: right">
      <el-button size="small" style="width: 65px" type="default" @click="dialogvisible = false"> 取消 </el-button>
      <el-button size="small" style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchModifyRtSupplier } from '@/api/newApi/taxServices/taxRegister.js';
import moment from 'moment';
import { getSupplierList } from '@/api/newApi/common';
import { getHandlerUserList } from '@/api/newApi/supplyChain/allocationRules.js';
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
export default {
  props: {
    batchModifySupplierDialog: Boolean,
    batchModifySupplierObj: Object,
    queryData: {
      type: Function,
      default: null,
    },
    functionCode: [String, Number],
  },
  data() {
    return {
      form: {
        newSupplierId: '',
        isChangeProcess: null,
        oldSupplierCooperationStatus: '',
        newNodeCode: '',
        selectMonth: [],
      },
      supplierList: [],
      rules: {
        newSupplierId: [{ required: true, message: '请选择服务商', trigger: 'change' }],
        isChangeProcess: [{ required: true, message: '请选择服务进度是否改变', trigger: 'change' }],
        oldSupplierCooperationStatus: [{ required: true, message: '请选择与原服务商合作状态', trigger: 'change' }],
        newNodeCode: [{ required: true, message: '请选择新服务商服务进度', trigger: 'change' }],
        selectMonth: [{ required: true, type: 'array', message: '请选择转代理开始申报周期', trigger: 'change' }],
      },
      tipMap: {
        [currentCodeEnum.NODE2]: '变更服务商后，服务流程会刷新为新服务商流程；',
        [currentCodeEnum.NODE3]: '新服务商资料可能有变动，变更服务商后，请重新审核资料；',
        [currentCodeEnum.NODE7]: '新服务商资料可能有变动，请确认是否将工单驳回到“待审核”重新审核资料；',
        [currentCodeEnum.NODE8]: '',
      },
      currentCodeEnum,
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchModifySupplierDialog;
      },
      set(val) {
        this.$emit('update:batchModifySupplierDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.getSuppllier();
      }
    },
  },
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.confirm();
        } else {
          return false;
        }
      });
    },
    clearSupplier() {
      this.form.newSupplierId = '';
      this.form.isChangeProcess = null;
      this.form.oldSupplierCooperationStatus = null;
      this.form.selectMonth = [];
      this.form.newNodeCode = null;
      this.$refs['ruleForm'].resetFields();
    },
    /** 获取服务商列表 */
    getSuppllier() {
      getSupplierList({
        supplierType: 1,
        functionCode: this.functionCode,
        countryCodeList: [this.batchModifySupplierObj.countryCode],
        flow: true,
      }).then((res) => {
        this.supplierList = res.data;
      });
    },

    confirm() {
      let newNodeCode = this.batchModifySupplierObj.curNodeCode;
      if (this.form.isChangeProcess == '1' && this.batchModifySupplierObj.curNodeCode == currentCodeEnum.NODE7) {
        newNodeCode = currentCodeEnum.NODE3;
      }
      if (this.form.newNodeCode == currentCodeEnum.NODE8 && this.form.oldSupplierCooperationStatus == 2 && this.form.selectMonth && this.form.selectMonth.length) {
        var a = moment(this.form.selectMonth[0]);
        var b = moment(this.form.selectMonth[1]);
        var month = b.diff(a, 'month');
        if (this.batchModifySupplierObj.declarePeriod == 0 && month != 0) {
          return this.$message.error('月报申报周期必须等于1个月！');
        }
        if (this.batchModifySupplierObj.declarePeriod == 1 && month != 2) {
          return this.$message.error('季报申报周期必须等于3个月！');
        }
        if (this.batchModifySupplierObj.declarePeriod == 2 && month != 11) {
          return this.$message.error('年报申报周期必须等于12个月！');
        }
      }

      workOrderCommonOperator('changeSupplier', {
        declareBeginTime: this.form.newNodeCode == currentCodeEnum.NODE8 ? this.form.selectMonth[0] + '-01 00:00:00' : '',
        declareEndTime: this.form.newNodeCode == currentCodeEnum.NODE8 ? moment(this.form.selectMonth[1]).endOf('month').format('YYYY-MM-DD') + ' 00:00:00' : '',
        declareType: this.batchModifySupplierObj.declareType,
        oldSupplierCooperationStatus: this.form.oldSupplierCooperationStatus,
        supplierId: this.form.newSupplierId,
        targetSupplierProgress: this.batchModifySupplierObj.curNodeCode == currentCodeEnum.NODE7 ? newNodeCode : this.form.newNodeCode,
        workIdColl: this.batchModifySupplierObj.workIdColl,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功');
          this.dialogvisible = false;
          this.queryData();
        } else {
          this.$message.error('修改失败');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.supplier-title {
  p {
    font-size: 18px;
    font-weight: 800;
    color: #333;
    margin-bottom: 4px;
  }
  span {
    color: #de7c09;
  }
}

/deep/ .el-dialog__header {
  height: 84px;
}

.warn-color {
  color: #de7c09;
}

.el-radio {
  margin-bottom: 5px;
}
</style>
