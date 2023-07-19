<template>
  <div class="product">
    <el-select :style="{ width: width + 'px' }" v-model="product.enterpriseIdList" placeholder="请选择公司主体" :clearable="clearable" :multiple="multiple" :filterable="filterable">
      <el-option :value="-1" label="全部" v-if="showAllOption"></el-option>
      <el-option v-for="item in firmList" :value="item.id" :key="item.id" :label="item.name" :disabled="multiple ? product.enterpriseIdList.includes(-1) : false"></el-option>
    </el-select>
  </div>
</template>

<script>
import { getFirm } from '@/api/newApi/common';
export default {
  data() {
    return {
      firmList: [],
    };
  },
  model: {
    prop: 'product',
    event: 'input',
  },
  props: {
    product: Object,
    width: {
      type: Number,
      default: 200,
    },
    // 是否有全部选项
    showAllOption: {
      type: Boolean,
      default: false,
    },
    // 是否默认选中全部选项
    selectAllOption: {
      type: Boolean,
      default: false,
    },
    // 是否选中当前主体, 与上一条不要冲突
    selectCurOption: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    'product.enterpriseIdList': function (newV, oldV) {
      if (this.multiple) {
        let entLength = this.firmList.length;
        // 有‘全部’选项时，这个选项与其他单选或多选不能重叠
        if (this.showAllOption) {
          // 选中全部，取消其他显示
          if (newV.includes(-1) && newV.length !== 1) {
            this.product.enterpriseIdList = [-1];
          }
          // 选中全部其他，转为全部
          if (newV.length === entLength && !newV.includes(-1)) {
            this.product.enterpriseIdList = [-1];
          }
        }
      }
    },
  },
  async created() {
    await getFirm().then((res) => {
      if (res.code === 0) {
        this.firmList = res.data;

        if (this.selectCurOption) {
          this.enterpriseId = this.$util.getLocalStorage('enterpriseId');
          this.product.enterpriseIdList = this.multiple ? [Number(this.enterpriseId)] : Number(this.enterpriseId); // 默认选中当前的公司主体
        }
        if (this.selectAllOption) {
          this.product.enterpriseIdList = this.multiple ? [-1] : -1;
        }
      } else {
        this.$message({
          type: 'error',
          message: res.message,
        });
      }
    });
  },
};
</script>

<style lang="less" scoped>
.product {
}
</style>
