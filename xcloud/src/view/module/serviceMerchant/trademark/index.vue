<template>
  <div class="app-container">
    <!-- 解决样式问题占位 -->
    <div class="table-container-title" style="height:120px;display:none;"></div>
    <!-- 查询 -->
    <div class="table-container top-header">
      <el-tabs v-model="activeName"  ref="elTabs">
        <el-tab-pane label="商标分类" name="firstSort">
        </el-tab-pane>
        <el-tab-pane label="商标小类" name="secondSort">
        </el-tab-pane>
      </el-tabs>
    </div>
    <trademark-class v-if="activeName === 'firstSort'" />
    <trademark-subclass v-if="activeName === 'secondSort'" />
  </div>
</template>
<script>
import TrademarkClass from './components/trademarkClass.vue'
import TrademarkSubclass from './components/trademarkSubclass.vue'
export default {
  data() {
    return {
      activeName: this.$route.query.activeName || 'firstSort'
    }
  },
  components: {
    TrademarkClass,
    TrademarkSubclass
  }
}
</script>
<style scoped lang="scss">
/deep/ .el-tabs__item {
  width: 130px;
  text-align: center;
}
.top-header{
  margin-top: 0;
  margin-bottom: 0;
}
</style>
