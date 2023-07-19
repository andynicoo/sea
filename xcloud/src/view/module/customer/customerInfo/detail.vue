<template>
  <div class="app-container">
    <div class="header-container" style="padding-left: 24px">
      <el-link :underline="false" type="info" @click="goBack"><i class="el-icon-arrow-left"></i> 查看详情 </el-link>
      <el-tabs value="name1" style="margin-top:30px">
        <el-tab-pane label="基本信息" name="name1">
          <InformAtion />
        </el-tab-pane>
        <el-tab-pane label="跟进记录" name="name2">
          <Record />
        </el-tab-pane>
        <el-tab-pane label="订单信息" name="name3">
          <OrderInfo />
        </el-tab-pane>

        <el-tab-pane label="线下打款账户" name="name4">
          <AccountInfo />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import InformAtion from "./components/InformAtion.vue"; //基本信息
import Record from "./components/Record.vue"; //跟进记录
import OrderInfo from "./components/OrderInfo.vue"; //跟进记录
import AccountInfo from "./components/AccountInfo.vue"; //线下打款账号
export default {
  components: {
    InformAtion,
    Record,
    OrderInfo,
    AccountInfo
  },
  data() {
    return {};
  },
  created() {},
  methods: {
     goBack(){
      this.$router.push('/customer/customerInfo/index')
    }
  },
};
</script>
<style scoped>
</style>
