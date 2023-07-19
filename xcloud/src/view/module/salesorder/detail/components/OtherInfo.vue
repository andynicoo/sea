<template>
  <div id="salesOrderotherInfo">
    <div class="tittle">
      <el-divider direction="vertical"></el-divider>
      <span class="text-info">操作记录</span>
    </div>
    <div>
      <OrderRecord :activities="activities" />
    </div>
  </div>
</template>

<script>
import OrderRecord from '@/components/OrderRecord'; // 操作记录
export default {
  components: { OrderRecord },
  props: {
    activities: Array,
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
#salesOrderotherInfo {
  // padding: 10px 0;
  .tittle {
    // padding: 24px 0px 0px 0px;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
