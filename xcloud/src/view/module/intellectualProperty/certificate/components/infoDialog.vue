<template>
  <el-dialog
    title="查看授权书"
    :visible.sync="dialogvisible"
    width="460px"
    center
  >
    <el-form>
      <!-- <el-form-item label="客户截至日期:" prop="status">
        {{(detailWorkOrderVO.lastDealDate || '').split(' ')[0]}}
      </el-form-item> -->
      <el-form-item label="授权书翻译文件:" prop="status">
        <el-link type="primary" :underline="false" target="_blank" :href="replaceHttps(detailWorkOrderVO.interpretFile)" v-if="detailWorkOrderVO.interpretFile">授权书翻译文件</el-link>
      </el-form-item>
      <el-form-item label="是否需要付费:" prop="status">
        {{detailWorkOrderVO.isNeedPay === 1 ? '不需要' : '需要'}}
      </el-form-item>
      <el-form-item :label="detailWorkOrderVO.productName + ':'" prop="status" v-if="detailWorkOrderVO.isNeedPay === 2">
        ￥{{detailWorkOrderVO.productMoney}}
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    infoDialog: Boolean,
    detailWorkOrderVO: Object
  },
  computed: {
    dialogvisible: {
      get() {
        return this.infoDialog;
      },
      set(val) {
        this.$emit("update:infoDialog", val);
      },
    },
  },
};
</script>

<style></style>
