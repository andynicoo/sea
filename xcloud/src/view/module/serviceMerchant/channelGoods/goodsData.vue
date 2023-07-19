<template>
  <div class="app-container">
    <!-- 解决样式问题占位 -->
    <div class="table-container-title" style="height:120px;display:none;"></div>
    <!-- 查询 -->
    <div class="table-container top-header">
      <el-tabs v-model="activeName"  ref="elTabs">
        <el-tab-pane label="商品分类管理" name="firstSort"></el-tab-pane>
        <el-tab-pane label="商品规格管理" name="secondSort"></el-tab-pane>
        <el-tab-pane label="商品附加规格管理" name="thirdSort"></el-tab-pane>
      </el-tabs>
      <goods-classify v-if="activeName=='firstSort'"/>
      <goods-specs  v-if="activeName=='secondSort'"/>
      <goods-attachspecs  v-if="activeName=='thirdSort'"/>
      
    </div>
  </div>
</template>
<script>
import GoodsClassify from './component/goodsClassify.vue'
import GoodsSpecs from './component/goodsSpecs.vue'
import goodsAttachspecs from './component/goodsAttachspecs.vue'
export default {
  data() {
    return {
      activeName:'firstSort'
    }
  },
  components: {
    GoodsClassify,
    GoodsSpecs,
    goodsAttachspecs
  },
  created(){
    if(this.$route.query.tag){
        this.activeName = 'thirdSort'
    }
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
