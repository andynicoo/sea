<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox" style="padding-left: 24px">
       <el-link :underline="false" type="info" @click="goBack"><i class="el-icon-arrow-left"></i> 查看详情 </el-link>
      <el-tabs value="name1" v-model="tabName" style="margin-top:30px">
        <el-tab-pane label="基本信息" name="name1">
          <InformAtion />
        </el-tab-pane>
        <el-tab-pane label="跟进记录" name="name2">
          <Record ref="getRecord" />
        </el-tab-pane>
        <el-tab-pane label="订单信息" name="name3">
          <OrderInfo />
        </el-tab-pane>
      </el-tabs>
      <el-button
        class="addRecord"
        type="primary"
        ghost
        v-if="tabName == 'name2'"
        @click="followModal = true"
         v-show="hasAuthority('C1_8')"
        >添加跟进记录</el-button
      >


    </div>

    <!-- 添加跟进记录 -->
    <el-dialog
      :visible.sync="followModal"
      width="390px"
      class-name="distribution"
      title="添加跟进记录"
    >
      <div style="margin-bottom: 15px">
        <el-input
          v-model="content"
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          resize="none"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followModal = false" >取 消</el-button>
        <el-button type="primary"  @click="updateInviteFun"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import InformAtion from "./components/InformAtion.vue"; //基本信息
import Record from "./components/Record.vue"; //跟进记录
import OrderInfo from "./components/OrderInfo.vue"; //跟进记录
import { addRecord } from "@/api/newApi/customer/customerInfo.js";
export default {
  components: {
    InformAtion,
    Record,
    OrderInfo,
  },
  data() {
    return {
      tabName: "name1",
      followModal: false,
      content: "",
    };
  },
  methods: {
     goBack(){
      this.$router.push('/customer/myCustomer/index')
    },
    /**添加跟进保存 */
    updateInviteFun(row) {
      addRecord({
        content: this.content,
        userId: this.$route.query.userId,
        enterpriseId: this.$route.query.enterpriseId,
      }).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "添加成功",
          });
          this.followModal = false;
          this.$refs.getRecord.getRecord();
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.app-container {
  position: relative;
  .addRecord {
    position: absolute;
    top: 10px;
    right: 20px;
  }
}
</style>
