<template>
    <!-- 批量查询 -->
    <el-dialog :title="title" :visible.sync="dialogvisible" width="500px">
      <el-form label-width="10px" >
        <el-form-item label="">
          <el-input type="textarea" v-model="searchStr" placeholder="" style="width:420px" />
        </el-form-item>
        
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="batchSearch">立即查看</el-button>
        <p>1.单次批量查询支持100条数据；</p>
        <p>2.仅支持单个条件批量查询，例如：不支持服务号和订单号同时查询；</p>
        <p>3.查询结果按照查询条件排序；</p>
      </div>
    </el-dialog>
</template>

<script>
export default {
  props: {
    batchSearchDialog: Boolean,
    type: String,
    setBatchSearch: Function,
    batchStr: String
  },
  data() {
    return {
      searchStr: ''
    };
  },
  computed: {
    dialogvisible: {
      get() {
        this.searchStr = this.batchStr
        return this.batchSearchDialog;
      },
      set(val) {
        this.$emit("update:batchSearchDialog", val);
      },
    },
    title() {
      if (this.type === 'mobiles') {
        return '手机号-批量查询'
      } else if (this.type === 'orderNos') {
        return '订单号-批量查询'
      }
      return '服务号-批量查询'
    }
  },
  created() {},
  methods: {
    batchSearch() {
      console.log(this.searchStr)
      this.setBatchSearch(this.type, this.searchStr)
      this.dialogvisible = false
    }
  },
};
</script>

<style lang="scss" scoped>
.el-textarea {
  width: 300px;
}

/deep/ .el-dialog__footer {
  border-top: 1px solid #eee;
  padding-top: 20px;
  p {
    text-align: left;
  }
}
</style>
