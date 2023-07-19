<template>
  <a-modal v-model:visible="visible" :footer="null" title="更多近似商标" @cancel="$emit('close')" width="1100px">
    <div class="content">
      <div class="my-table-title">{{ title }}</div>
      <a-table :dataSource="data" :columns="columns" bordered :pagination="false"></a-table>
    </div>
  </a-modal>
</template>
<script>
export default {
  props: {
    data: Array,
    title: String,
    columns: Array,
  },
  data() {
    return {
      visible: true,
    };
  },
};
</script>
<style lang="less" scoped>
.content {
  user-select: none;
}
.my-table-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  border: 1px solid #f0f0f0;
  border-bottom: 0;
  background: #fafafa;
}
.ant-table-wrapper {
  overflow: auto;
  max-height: 600px;
}
a.link {
  color: #00a3ff;
}
/deep/.ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
  background: #fff;
}
</style>
