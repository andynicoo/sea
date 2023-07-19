<!--  右侧点击选项卡 -->
<template>
  <el-tabs class="el-tabs" v-model="sonTabNav" @tab-click="handleClick">
    <template v-for="(item,index) in list">
      <el-tab-pane :name="item.name" :label="item.lable" :key="index"></el-tab-pane>
    </template>
  </el-tabs>
</template>
<script>

export default {
  name: 'AddEditElTable',
  props: {
    list: {
      type: Array,
      required: true,
    },
    tabNav: {
      type: String,
      required: true
    },

  },
  data() {
    return {
      sonTabNav: this.tabNav,
    };
  },

  methods: {
    handleClick(tab, event) {
      let tableInfo = this.getTableInfo();
      this.$emit('handleClick', { tab, event, tableInfo });
    },
    getTableInfo() {
      let val = this.list.find(item => item.name == this.sonTabNav);
      return val ? val : {};
    }
  }
}

</script>
<style lang='scss' scoped>
</style>