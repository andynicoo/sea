<template>
  <div class="check-wrapper">
    <Search ref="search" @check="checkFn">
      <el-button type="primary" slot="inputSlot" @click="check">查一查</el-button>
    </Search>
  </div>
</template>

<script>
import Search from './components/search';
export default {
  data() {
    return {};
  },
  components: {
    Search,
  },
  methods: {
    check() {
      this.$refs.search.check();
    },
    checkFn({ val, type }) {
      this.$router.push({
        name: 'checkResult',
        params: {
          val,
          type,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.check-wrapper {
  margin-right: 20px;
  position: relative;
  .history-list,
  .company-list {
    width: 228px;
  }
}
.el-input-group__append button.el-button {
  background-color: #1890ff !important;
}
</style>
