<template>
  <el-dialog title="竞品参考价" :visible.sync="dialogvisible" width="600px" center @close="reset" destroy-on-close>
    <div>
      <el-table border :data="rowData.productInfoSkuCompetitionList" :max-height="600" class="table">
        <el-table-column align="center" label="竞品公司名称" prop="companyName"></el-table-column>
        <el-table-column align="center" label="参考价格（元）" prop="competitionPrice"></el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    detailDialog: Boolean,
    rowData: {
      type: Object,
      default: () => {
        return {
          productInfoSkuCompetitionList: []
        }
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    dialogvisible: {
      get () {
        return this.detailDialog
      },
      set (val) {
        this.$emit('update:detailDialog', val)
      }
    }
  },
  created () {},
  watch: {},
  methods: {
    reset () {
      if (this.$refs.detailDialog) {
        this.$refs.detailDialog.resetFields()
      }
    }
  }
}
</script>

<style></style>
