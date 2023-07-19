<template>
  <div class="xcurrency">
    <el-select v-model="product.currency" placeholder="币种选择" style="width: 170px">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
    </el-select>
    <el-input-number v-model="product.currencyPayAmount" placeholder="请输入金额" :min="0.01" :max="999999999" controls-position="right" :precision="2"></el-input-number>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        // {
        //   value: null,
        //   label: '请选择',
        // },
        {
          value: 'USD',
          label: '美元',
        },
        {
          value: 'CNY',
          label: '人民币',
        },
        {
          value: 'EUR',
          label: '欧元',
        },
        {
          value: 'AUD',
          label: '澳元',
        },
        {
          value: 'GBP',
          label: '英镑',
        },
        {
          value: 'JPY',
          label: '日元',
        },
        {
          value: 'HKD',
          label: '港币',
        },
      ],
      value: '',
    };
  },
  model: {
    prop: 'product',
    event: 'input',
  },
  props: {
    product: Object,
  },
};
</script>

<style lang="less">
.xcurrency {
  display: inline-block;
  span.el-input-number__decrease {
    display: none;
  }
  span.el-input-number__increase {
    display: none;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-right: 15px;
  }
  .inputs{
    width: 300px;
  }
  .el-input-number, .el-input__inner {
    text-align: left;
  }
}
</style>
