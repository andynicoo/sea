<template>
  <el-dialog
    title="审核资料"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="审核：" prop="status">
        <el-radio-group v-model="form.status">
          <!-- <el-radio :label="1">审核通过</el-radio> -->
          <el-radio :label="2">资料不对，驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择服务商：" prop="supplierId" v-if="nodeCode === progressBarObj.WAIT_REVIEW && form.status === 1">
        <el-select
          style="width: 300px"
          v-model="form.supplierId"
          size="small"
          filterable
        >
          <el-option v-for="item in supplierList" :key="item.supplierId" :value="item.supplierId" :label="item.shortName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="驳回原因：" prop="remark" v-if="form.status === 2">
        <el-input
          v-model="form.remark"
          placeholder="请输入"
          clearable
          type="textarea"
          style="width: 300px"
          size="small"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="submit"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {progressBarObj} from '../enumObj'
import {authAgentReject} from '@/api/newApi/workOrder/authorizedRepresent'
import {findSuppliers} from '@/api/newApi/processFields/processConfig.js'
export default {
  props: {
    auditDialog: Boolean,
    serviceId: String,
    nodeCode: String
  },
  data() {
    return {
      progressBarObj: progressBarObj,
      form: {
        remark: "",
        status: 2,
        supplierId: ''
      },
      rules: {
        remark: [{required: true, message: '请输入驳回原因', trigger: 'blur'}],
        supplierId: [{required: true, message: '请选择服务商', trigger: 'blur'}]
      },
      supplierList: []
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.auditDialog;
      },
      set(val) {
        this.$emit("update:auditDialog", val);
      },
    },
  },
  mounted() {
    // this.getSuppliers()
  },
  methods: {
    // 获取服务商列表
    getSuppliers() {
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCode: this.$constant.AUTHORIZEDREPRESENT_FUNCTION_CODE
      }).then(res => {
        this.supplierList = res.data.records
      })
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      authAgentReject({
        remark: this.form.remark,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('驳回成功');
          this.$emit("refresh");
        }
      });
    },
    reset() {
      if(this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
  },
};
</script>

<style></style>
