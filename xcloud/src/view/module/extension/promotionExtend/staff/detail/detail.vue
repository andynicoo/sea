<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <BackHerader @back="goBack" title="查看详情" class="backHerder"></BackHerader>
      <el-tabs v-model="activeName" ref="elTabs">
        <el-tab-pane label="链接管理" name="链接管理"> </el-tab-pane>
        <el-tab-pane label="链接明细" name="链接明细"> </el-tab-pane>
      </el-tabs>
      <InformAtion v-show="activeName == '链接管理'" :activeName="activeName"/>
      <RegisteredUser v-show="activeName == '链接明细'" :activeName="activeName"/>
    </div>
  </div>
</template>
<script>
import InformAtion from '../../components/staffInformAtion.vue'; //基本信息
import RegisteredUser from '../../components/staffRegisteredUser.vue'; //用户注册明细
import BackHerader from '@/components/backHerader';
import Title from '@/components/title/index';
export default {
  components: {
    InformAtion,
    RegisteredUser,
    BackHerader,
    Title,
  },
  data() {
    return {
      activeName: '链接管理',
    };
  },
  methods: {
    /**返回 */
    goBack() {
      sessionStorage.removeItem('staffEditObj');
      this.$router.push({ path: '/extension/promotionExtend/index' });
    },
  },
};
</script>
<style scoped lang="less">
.app-container {
  // margin-top: 10px;
  .backHerder {
    padding-bottom: 30px;
  }
}
</style>
