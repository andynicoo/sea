<template>
  <div class="product">
    {{ product }}
    <a-input v-model="product.name" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  model: {
    prop: "product",
    event: "input",
  },
  props: {
    product: Object,
  },
};
</script>

<style lang="less" scoped>
.product {
}
</style>
