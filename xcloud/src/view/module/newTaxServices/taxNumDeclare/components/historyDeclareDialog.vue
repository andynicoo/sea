<template>
  <el-dialog title="查看税局已申报区间" :visible.sync="dialogvisible" width="450px" center>

    <p class="mb-10">税号: {{vatTaxNumber}}</p>

    <div class="table-wrap">
      <el-table
        :data="historyDeclareList"
        style="width: 100%">
        <el-table-column
          label="税局已报税区间：">
          <template slot-scope="scope">{{ (scope.row.start || "").split(" ")[0] }} - 
            {{ (scope.row.end || "").split(" ")[0] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    
  </el-dialog>
</template>

<script>
export default {
  props: {
    historyDeclareDialog: Boolean,
    vatTaxNumber: String,
    historyDeclareList: Array
  },
  data() {
    return {
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.historyDeclareDialog;
      },
      set(val) {
        this.$emit("update:historyDeclareDialog", val);
      },
    },
  },

  methods: {
  },
};
</script>

<style lang="scss" scoped>
.color-red {
  color: #f56c6c;
}

.table-wrap {
  max-height: 400px;
  overflow: auto;
}
</style>
