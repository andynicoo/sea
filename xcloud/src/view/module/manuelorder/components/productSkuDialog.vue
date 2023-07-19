<template>
  <el-dialog title="修改续费规格" :visible.sync="dialogvisible" width="460px">
    <div>
      <div class="title">{{ renewalProduct.productName }}</div>
      <el-radio-group v-model="specId">
        <el-radio-button :label="item.productSpecId" v-for="item in supportRenewProductSpecs" :key="item.productSpecId">{{ item.productSpecName }}</el-radio-button>
      </el-radio-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    productSkuDialog: Boolean,
    renewalProduct: Object,
    renewalIndex: Number,
  },
  data() {
    return {
      supportRenewProductSpecs: [],
      specId: '',
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.productSkuDialog;
      },
      set(val) {
        this.$emit('update:productSkuDialog', val);
      },
    },
  },
  watch: {
    renewalProduct: {
      handler(newVal) {
        if (newVal) {
          this.supportRenewProductSpecs = newVal.supportRenewProductSpecs;
          if (this.supportRenewProductSpecs.find((item) => item.productSpecId === newVal.productSpecId)) {
            this.specId = newVal.productSpecId;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    submit() {
      let specItem = this.supportRenewProductSpecs.find((item) => item.productSpecId === this.specId);
      this.$emit('changeSpec', {
        index: this.renewalIndex,
        productSpecId: this.specId,
        specItem,
      });
      this.dialogvisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 10px;
}
</style>
