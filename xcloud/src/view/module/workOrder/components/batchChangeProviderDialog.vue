<template>
  <el-dialog :visible.sync="dialogvisible" width="460px" center @close="reset">
    <div slot="title" class="diag-title-wrapper">
      <div class="diag-title">修改服务商</div>
      <p class="diag-desc">勾选服务单（国家和税务类型一致），支持批量修改；</p>
    </div>
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <el-form-item label="国家：">
        <span>{{ countryNameZh }}</span>
      </el-form-item>
      <el-form-item prop="supplierId" label="选择服务商：">
        <el-select style="width: 300px" v-model="form.supplierId" size="small" filterable>
          <el-option-group>
            <div class="option_title" style="background: #f6f8fa">
              <!-- <span>全称</span> -->
              <span>简称</span>
              <span>服务商类型</span>
            </div>
            <el-option v-for="item in userList" :key="item.code" :label="item.shortName" :value="item.id" class="option_title">
              <!-- <span>{{ item.supplierName }} </span>&nbsp; -->
              <span>{{ item.shortName }} </span>&nbsp;
              <span>服务商</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <p class="diag-desc">变更服务商后，服务流程会刷新为新服务商流程；</p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSuppliers } from '@/api/newApi/processFields/processConfig.js';
import { apostilleChange } from '@/api/newApi/workOrder/hyCertification';
export default {
  props: {
    batchChangeProviderDialog: Boolean,
    serviceId: String,
    countryCode: String,
    serviceNo: String,
    countryNameZh: String,
  },
  data() {
    return {
      form: {
        supplierId: '',
      },
      userList: [],
      rules: {
        supplierId: [{ required: true, message: '请选择服务商', trigger: 'blur' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchChangeProviderDialog;
      },
      set(val) {
        this.$emit('update:batchChangeProviderDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.getSuppliers();
      }
    },
  },
  methods: {
    getSuppliers() {
      getSuppliers({
        serviceNo: this.serviceNo,
      }).then((res) => {
        if (JSON.stringify(res.data) !== '{}') {
          this.userList = [res.data];
        } else {
          this.userList = [];
        }
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
        }
      });
    },
    confirm() {
      apostilleChange({
        ...this.form,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) === '{}') {
            this.$message.success('修改成功');
          } else if (res.data) {
            this.$alert(res.data, '', {});
          }
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  line-height: 1;
  span {
    flex: 3;
  }
}
.diag-title {
  font-size: 18px;
  color: #333;
  font-weight: 800;
}

.diag-desc {
  color: #e6a23c;
  margin-top: 4px;
}
.dialog-footer {
  text-align: center;
}
/deep/ .el-dialog__header {
  height: 84px;
}
</style>
>
