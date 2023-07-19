<template>
  <div class="app-container">
    <div class="header-container">
      <el-tabs value="name1">
        <el-tab-pane label="基本信息" name="name1">
          <InFo />
        </el-tab-pane>
        <el-tab-pane label="权限信息" name="name2">
          <EnterpriseInfo />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import InFo from "./components/InFo.vue";
import EnterpriseInfo from "./components/EnterpriseInfo.vue";

export default {
  components: {
    InFo,
    EnterpriseInfo,
  },
  data() {
    return {};
  },
};
</script>
<style scoped>
.info_list {
  margin-top: 20px;
}
</style>
