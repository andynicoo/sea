<template>
  <div class="app-container">
    <div class="header-container"  ref="searchBox">
      <BackHerader @back="goBack" title="查看详情" class="backHerder"></BackHerader>
      <el-tabs v-model="activeName" ref="elTabs" >
        <el-tab-pane label="基本信息" name="基本信息">
           <!-- <Title class="title" titieName="基本信息"></Title> -->
        </el-tab-pane>
        <el-tab-pane label="注册用户明细" name="注册用户明细">
        </el-tab-pane>
        <el-tab-pane label="订单信息" name="订单信息">
        </el-tab-pane>
      </el-tabs>
      <InformAtion v-show="activeName=='基本信息'"/>
      <RegisteredUser v-show="activeName=='注册用户明细'"/>
      <OrderInfo v-show="activeName=='订单信息'"/>
    </div>
  </div>
</template>
<script>
import InformAtion from "../components/InformAtion.vue"; //基本信息
import RegisteredUser from "../components/RegisteredUser.vue"; //用户注册明细
import OrderInfo from "../components/OrderInfo.vue"; //订单信息
import BackHerader from "@/components/backHerader";
import Title from "@/components/title/index";
export default {
  components: {
    InformAtion,
    RegisteredUser,
    OrderInfo,
    BackHerader,
    Title
  },
  data() {
    return {
      activeName:'基本信息'
    };
  },
  methods: {
    /**返回 */
    goBack() {
      this.$router.push({ path: "/extension/promotionExtend/index" });
    },
  },
};
</script>
<style scoped lang="less" >
.app-container {
  // margin-top: 10px;
  .backHerder {
    padding-bottom: 30px;
  }
}
</style>
