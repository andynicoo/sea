<template>
  <el-dialog title="确认已发送服务商" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="">
        <div style="display: flex">
          <p>资料清单：</p>
          <div>
            <p>1、海牙授权书</p>
            <p>2、资质证明</p>
            <p>3、营业执照扫描件与翻译件</p>
            <p>4、法人身份证扫描件与翻译件</p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="物流公司：" prop="logisticsProviders">
        <el-select placeholder="请选择" size="small" style="width: 300px" clearable filterable v-model="form.logisticsProviders">
          <el-option v-for="item in logistics" :key="item.code" :value="item.value" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="快递单号：" prop="hyTrackingNumber">
        <el-input v-model="form.hyTrackingNumber" placeholder="请输入寄出海牙文件的快递单号" clearable size="small" style="width: 300px" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { apostilleSendLogisticsInfo } from '@/api/newApi/workOrder/hyCertification';
import { getLogistics } from '@/api/newApi/common';
export default {
  props: {
    sendProviderDialog: Boolean,
    workId: [String, Number],
  },
  data() {
    return {
      form: {
        logisticsProviders: '',
        hyTrackingNumber: '',
      },
      logistics: [],
      rules: {
        logisticsProviders: [{ required: true, message: '请选择服务商', trigger: 'blur' }],
        hyTrackingNumber: [{ required: true, message: '请填写快递单号', trigger: 'blur' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.sendProviderDialog;
      },
      set(val) {
        this.$emit('update:sendProviderDialog', val);
      },
    },
  },
  mounted() {
    this._getLogistics();
  },
  methods: {
    _getLogistics() {
      getLogistics().then((res) => {
        this.logistics = res.data;
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      apostilleSendLogisticsInfo({
        ...this.form,
        workId: this.workId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '确认成功',
            duration: 2000,
          });
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style></style>
