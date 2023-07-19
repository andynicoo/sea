<template>
  <div id="optionalCenter" class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="常见问题" name="first">
        <commonprobelm />
      </el-tab-pane>
      <el-tab-pane label="帮助文档" name="second">
        <helpdocument />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import helpdocument from "./conponents/helpDocument.vue";
import commonprobelm from "./conponents/commonProblem.vue";
export default {
  components: {
    helpdocument,
    commonprobelm,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick() {
      return;
    },
  },
};
</script>

<style lang="scss">
#optionalCenter {
  background-color: #fff;
  height: calc(100vh - 120px);
  padding: 25px;
  .el-tabs__item {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
