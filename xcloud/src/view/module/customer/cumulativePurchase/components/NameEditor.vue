<template>
  <div>
    <el-input v-if="editing" v-model="row.nickName" @blur="blur" v-focus></el-input>
    <span v-else>{{ row.nickName }}<i class="el-icon-edit" @click="editing = true"></i></span>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
    },
  },
  data() {
    return {
      editing: false,
    };
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus();
      },
    },
  },
  methods: {
    blur() {
      this.editing = false;

      this.$emit('handleEdit', this.nickName, { ...this.row, nickName: this.row.nickName });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-icon-edit {
  color: #1890ff;
  font-size: 13px;
  margin-left: 5px;
  cursor: pointer;
}
</style>
