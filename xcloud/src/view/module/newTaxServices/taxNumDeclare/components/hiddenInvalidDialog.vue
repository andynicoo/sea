<template>
  <el-dialog title="隐藏作废工单" :visible.sync="dialogvisible" width="560px" center>
    <el-table ref="multipleTable" :data="list" height="500" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" fixed="left" width="55"></el-table-column>
      <el-table-column label="申报区间" width="200">
        <template slot-scope="{ row }">{{ (row.beginTime || '').split(' ')[0] }}至{{ (row.endTime || '').split(' ')[0] }}</template>
      </el-table-column>
      <el-table-column label="申报进度" prop="progressDesc"></el-table-column>
      <el-table-column label="状态">作废</el-table-column>
    </el-table>
    <div class="text-danger">请勾选需隐藏的申报记录，未勾选的记录系统会继续展示</div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="submit">确定隐藏</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    hiddenInvalidDialog: Boolean,
    refDeclareInfoColl: Array,
  },
  data() {
    return {
      checkItems: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.hiddenInvalidDialog;
      },
      set(val) {
        this.$emit('update:hiddenInvalidDialog', val);
      },
    },
    list() {
      return this.refDeclareInfoColl.filter((item) => item.invalid);
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.checkItems = val;
    },
    submit() {
      if (!this.checkItems.length) {
        this.$message.warning('请勾选申报记录');
        return;
      }
      this.$emit('hiddenInvalidItems', this.checkItems);
      this.$refs.multipleTable.clearSelection();
      this.dialogvisible = false;
    },
  },
};
</script>

<style></style>
