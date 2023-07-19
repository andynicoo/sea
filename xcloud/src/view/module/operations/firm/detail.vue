<template>
  <div class="app-container">
    <div class="header-container" style="padding-left: 24px">
      <el-link :underline="false" type="info" @click="goBack"><i class="el-icon-arrow-left"></i> 查看详情 </el-link>
     <!-- 基础信息 -->
          <Information />
      <!-- 银行账号 -->
          <BankAccount />
    </div>
  </div>
</template>
<script>
import Information from "./components/Information";
import BankAccount from "./components/BankAccount.vue";
export default {
  components: { Information, BankAccount },
  data() {
    return {
      // activeName: "first",
    };
  },
  created() {},
  methods: {
    goBack(){
      this.$router.push('/operations/firm/index')
    }
  },
};
</script>
<style lang="scss" scoped>
</style>