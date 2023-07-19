<template>
  <div id="commonProblemContent">
    <div class="menu">
      <el-menu default-active="1" class="el-menu-vertical-demo" @select="select">
        <el-menu-item index="1">
          <span slot="title">VAT注册</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">VAT转代理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span slot="title">VAT申报</span>
        </el-menu-item>
        <el-menu-item index="4">
          <span slot="title">各国申报时间</span>
        </el-menu-item>
        <el-menu-item index="5">
          <span slot="title">欧代</span>
        </el-menu-item>
        <el-menu-item index="6">
          <span slot="title">英代</span>
        </el-menu-item>
        <el-menu-item index="7">
          <span slot="title">退税</span>
        </el-menu-item>
        <el-menu-item index="8">
          <span slot="title">税号/EORI 查询</span>
        </el-menu-item>
        <el-menu-item index="9">
          <span slot="title">税号绑定销售平台</span>
        </el-menu-item>
        <el-menu-item index="10">
          <span slot="title">其他问题</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content">
      <questionItem :index="index"></questionItem>
    </div>
  </div>
</template>

<script>
import questionItem from "./questionItem.vue";
export default {
  components: {
    questionItem,
  },
  data() {
    return {
      index: 1,
    };
  },
  methods: {
    select(key, keyPath) {
      this.index = key;
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss" scoped>
#commonProblemContent {
  height: calc(100vh - 220px);
  display: flex;
  .menu {
    flex: 2;
    .el-menu-vertical-demo {
      margin-left: 20px;
      margin-right: 35px;
      height: calc(100vh - 220px);
      border-radius: 10px;
      border: 1px solid #e4e4e4;
      overflow-y: auto;
      .el-menu-item {
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        span {
          padding-left: 20px;
        }
      }
    }
    .el-menu-item.is-active {
      color: #fff;
      background: #1890ff;
    }
  }
  .content {
    flex: 8;
  }
}
</style>
