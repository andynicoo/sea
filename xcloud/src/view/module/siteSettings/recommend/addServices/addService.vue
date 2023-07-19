<!--  -->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogvisible"
    :close-on-click-modal="false"
    width="883px"
    :before-close="handleClose"
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="服务分类" name="1">
        <ServiceList ref="serviceCategory" />
      </el-tab-pane>
      <el-tab-pane label="添加商品" name="2">
        <ServiceTable />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import ServiceList from './addOrders/serviceList.vue';
import ServiceTable from './addOrders/serviceTable.vue';
export default {
  provide() {
    return {
      closeService: this.handleClose,
      serviceCategory: this.$refs,
    };
  },
  name: 'IndexServices',
  props: {
    title: {
      type: String,
      default: '新增服务',
    },
    show: Boolean,
    addServiceRowdata: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeName: '1',
      tableData: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      },
    },
  },
  components: {
    ServiceTable,
    ServiceList,
  },

  methods: {
    handleClose() {
      this.$emit('update:show', false);
    },
  },
};
</script>
<style lang="scss" scoped></style>
