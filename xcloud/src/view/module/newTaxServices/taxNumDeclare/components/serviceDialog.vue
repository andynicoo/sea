<template>
  <!-- 服务商编码弹窗 -->
  <el-dialog title="修改服务商分配编码" :visible.sync="dialogvisible" width="400px">
    <el-input v-model="supplierAssignsCode" size="small" placeholder="请输入服务商分配编码" />
    <div slot="footer" style="text-align: right">
      <el-button size="small" style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button size="small" style="width: 65px" type="primary" @click="submitSupplierCode">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateSupplierCode } from '@/api/newApi/taxServices/serviceManage.js';
export default {
  props: {
    serviceDialog: { type: Boolean },
    getserviceDetail: {
      type: Function,
      default: null,
    },
    workId: String,
  },
  data() {
    return {
      supplierAssignsCode: '',
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.serviceDialog;
      },
      set(val) {
        this.$emit('update:serviceDialog', val);
      },
    },
  },
  methods: {
    /** 修改服务商编码 */
    submitSupplierCode() {
      if (this.supplierAssignsCode != '') {
        updateSupplierCode({ workId: this.workId, supplierAssignsCode: this.supplierAssignsCode })
          .then((res) => {
            if (res.code == 0) {
              this.$message.success('修改成功');
              this.serviceDialog = false;
              this.getserviceDetail();
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      } else {
        this.$message.warning('请输入服务商编码');
      }
    },
  },
};
</script>

<style></style>
