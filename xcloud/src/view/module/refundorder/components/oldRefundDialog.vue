<template>
  <el-dialog width="460px" title="确认退款" :visible.sync="dialogvisible">
    <el-form label-width="120px">
      <el-form-item label="退款类型：">线下退款</el-form-item>
      <el-form-item label="退款金额：">￥{{ (productList[0] || {}).refundMoney | formatQianFenWei}}</el-form-item>
      <el-form-item label="退款凭证：">
        <UploadImages
          ref="uploadImageRef"
          :imageUrl="refundForm.refundCertificate"
          :on-success="uploadSuccess"
          :on-error="onUploadError"
          :on-remove="onUploadRemove"
          :num="1"
        ></UploadImages>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取 消</el-button>
      <el-button type="primary" @click="refundConfirm" size="small" :loading="refundLoading"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import UploadImages from "@/components/UploadImages";
import { applyOrderRefund } from "@/api/newApi/orderManage/refundOrder";
export default {
  props: {
    refundDialogvisible: Boolean,
    order: { type: Object },
    productList: { type: Array },
    id: { type: String },
  },
  components: { UploadImages },
  data() {
    return {
      refundLoading: false,
      refundForm: {
        refundCertificate: ''
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.refundDialogvisible;
      },
      set(val) {
        this.$emit("update:refundDialogvisible", val);
      },
    },
  },
  methods: {
    refundConfirm() {
      if (!this.refundForm.refundCertificate) {
        return this.$message({
            type: "error",
            message: '请上传凭证',
          });
      }
      this.refundLoading = true;
      applyOrderRefund({
        id: this.id,
        confirmMethod: 'OFFLINE',
        refundCertificate: this.refundForm.refundCertificate
      })
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "退款成功",
              duration: 2000,
            });
            this.dialogvisible = false;
            this.$emit("getParentFn");
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err.message,
          });
        })
        .finally(() => {
          this.dialogvisible = false;
          this.$emit("getParentFn");
        });
    },

    uploadSuccess(file) {
      this.refundForm.refundCertificate = file;
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(file) {
      this.refundForm.refundCertificate = "";
    },
  },
};
</script>

<style></style>
