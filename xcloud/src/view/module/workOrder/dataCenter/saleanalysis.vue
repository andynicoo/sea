<template>
  <div>
    <div class="app-container">
      <salesVolume />
      <searchBox @searchSubmit="searchSubmit" />

      <el-row>
        <el-col :span="24">
          <echartBoxBar :resData="resData" :formModal="formModal" />
        </el-col>
        <el-col :span="12">
          <echartBox :dataObj="resData.orderSalesModelVOMap" :formModal="formModal" echartType="department" />
        </el-col>
        <el-col :span="12">
          <echartBox :dataObj="resData.orderSalesModelVOMap" :formModal="formModal" echartType="category" />
        </el-col>
        <el-col :span="12">
          <echartBox :dataObj="resData.orderSalesModelVOMap" :formModal="formModal" echartType="country" />
        </el-col>
        <el-col :span="12">
          <echartBox :dataObj="resData.orderSalesModelVOMap" :formModal="formModal" echartType="supplier" />
        </el-col>
        <el-col :span="12">
          <echartBox :dataObj="resData.orderSalesModelVOMap" :formModal="formModal" echartType="productSku" />
        </el-col>
        <el-col :span="12">
          <echartBox :dataObj="resData.orderSalesModelVOMap" :formModal="formModal" echartType="manageUser" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import salesVolume from "./components/saleanalysis/salesVolume.vue";
import searchBox from "./components/saleanalysis/searchBox.vue";
import echartBoxBar from "./components/saleanalysis/echartBoxBar.vue";
import echartBox from "./components/saleanalysis/echartBox.vue";
import { getAnalyzeList } from "@/api/newApi/workOrder/dataCenter.js";

export default {
  components: {
    salesVolume,
    searchBox,
    echartBoxBar,
    echartBox,
  },
  data() {
    return {
      formModal: {},
      resData: {},
    };
  },
  mounted() {},
  methods: {
    // 搜索
    searchSubmit(formModal) {
      this.formModal = JSON.parse(JSON.stringify(formModal)) || {};
      if (this.formModal.paymentTime && this.formModal.paymentTime.length > 0) {
        this.formModal.paymentTimeStart = this.formModal.paymentTime[0] + " 00:00:00";
        this.formModal.paymentTimeEnd = this.formModal.paymentTime[1] + " 23:59:59";
      }
      if (this.formModal.departmentIdList && this.formModal.departmentIdList.length > 0) {
        this.formModal.departmentIdList = Array.from(new Set(this.formModal.departmentIdList.join(",").split(",")));
      }
      if (this.formModal.productCategoryId && this.formModal.productCategoryId.length > 0) {
        this.formModal.productCategoryId = Array.from(new Set(this.formModal.productCategoryId.join(",").split(",")));
      }
      if (this.formModal.productSkuIdList && this.formModal.productSkuIdList.length > 0) {
        this.formModal.productSkuIdList = Array.from(new Set(this.formModal.productSkuIdList.join(",").split(",")));
      }
      getAnalyzeList(this.formModal).then((res) => {
        if (res.code === 0) {
          this.resData = res.data || {};
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.app-container {
  background-color: #fff;
}
</style>
