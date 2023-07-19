<template>
  <el-dialog title="查看历史购买产品信息" :visible.sync="dialogvisible" width="860px" center>
    <p v-if="functionCode == $constant.ADD_CATEGORY_BRAND_FUNCTION_CODE || type == 1">WEEE产品信息</p>
    <el-table border :data="historyBuyInfoList" style="margin: 20px 0" highlight-current-row v-if="functionCode == $constant.ADD_CATEGORY_BRAND_FUNCTION_CODE || type == 1">
      <el-table-column min-width="150px" align="center" label="产品类别" prop="productCategory"> </el-table-column>
      <el-table-column min-width="150px" align="center" label="产品名称(中/英文)" prop="productName"> </el-table-column>
      <el-table-column min-width="150px" align="center" label="对应的品牌LOGO" prop="productLogo"> </el-table-column>
      <el-table-column align="center" label="单边最大尺寸/cm" prop="sideMaxSize"> </el-table-column>
      <el-table-column align="center" label="预计当年销售总量" prop="saleWeight"> </el-table-column>
    </el-table>

    <el-table border :data="historyBuyInfoList" style="margin: 20px 0" highlight-current-row v-if="functionCode == $constant.ADD_BAT_CATEGORY_BRAND_FUNCTION_CODE || type == 3">
      <el-table-column min-width="150px" align="center" label="产品中文名称" prop="productName"> </el-table-column>
      <el-table-column align="center" label="电池类型" prop="batteryType"> </el-table-column>
      <el-table-column align="center" label="材料类型" prop="materialType"> </el-table-column>
      <el-table-column align="center" label="是否可以充电" prop="isCharge"> </el-table-column>
      <el-table-column min-width="150px" align="center" label="单位重量" prop="saleWeight">
        <template slot-scope="scope">
          <el-input style="width: 120px" class="mb-10" disabled v-model="scope.row.unitWeight" clearable filterable> </el-input>

          <el-input-number style="width: 120px" disabled v-model="scope.row.batteryWeight" :precision="2" :min="0" clearable size="small" placeholder="单个电池重量" v-if="scope.row.unitWeight == '1KG以上'" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="年发货数量/个" prop="yearDeliveryNum"> </el-table-column>
      <el-table-column align="center" label="电池品牌" prop="batteryBrand"> </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: {
    historyBuyInfoDialog: Boolean,
    historyBuyInfoList: Array,
    functionCode: Number,
    type: Number,
  },
  data() {
    return {};
  },
  components: {},
  computed: {
    dialogvisible: {
      get() {
        return this.historyBuyInfoDialog;
      },
      set(val) {
        this.$emit('update:historyBuyInfoDialog', val);
      },
    },
  },
  mounted() {
    // this.getSuppliers()
  },
  methods: {},
};
</script>

<style></style>
