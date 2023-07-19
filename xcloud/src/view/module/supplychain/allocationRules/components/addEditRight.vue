<!-- addEdit 页面右侧展示信息 -->
<template>
  <div class="info-block-wrapper">
    <add-edit-el-table :list='elTableList.list' :tabNav="elTableList.tabNav" @handleClick="getTabalInfo"> </add-edit-el-table>
    <div class="info-block">
      <add-edit-supplier-info :tabkey='isShowkey' comKey="record" :listByNoInfo="listByNoInfo"> </add-edit-supplier-info>
    </div>
    <div class="info-block2">
      <add-edit-census :tabkey='isShowkey' :tableData="tableData" comKey="distribution"></add-edit-census>
    </div>
    <div class="info-block3">
      <complete-statistics :tabkey='isShowkey' :tableData="tableData" :completeCom="completeCom" comKey="completeStatistics" />
    </div>
  </div>
</template>

<script>
import AddEditElTable from "./addEditComponents/addEditElTable.vue";
export default {
  name: "AddEditRight",
  components: {
    AddEditElTable,
    AddEditSupplierInfo: () => import("./addEditComponents/addEditSupplierInfo.vue"),
    AddEditCensus: () => import("./addEditComponents/addEditCensus.vue"),
    CompleteStatistics: () => import("./addEditComponents/completeStatistics.vue"),
  },
  data() {
    return {
      elTableList: {
        list: [
          { name: "distribution", lable: "分配统计" },
          { name: "record", lable: "操作记录" },
          { name: "completeStatistics", lable: "完成统计" },
        ],
        tabNav: "distribution",
      }, //table 数据 点击导航栏
      isShowkey: "distribution", //点击的组件
      listByNoInfo: {
        businessNo: this.$route.query.id,
        businessModule: 105,
        businessType: 5,
      },
      censusData: this.$parent.infoData,
   
      completeCom: this.$parent.infoData.durationConfigs,
    };
  },
  computed: {
    tableData() {
      let arr = [];
      this.censusData.supplierAllotRuleDetailsVOList &&
        this.censusData.supplierAllotRuleDetailsVOList.forEach((element) => {
          if (element.id !== 0 && element.id && element.id != "") arr.push(element);
        });
      return arr;
    },
  },
  created() {},
  methods: {
    /**
     * 获取点击导航栏
     */
    getTabalInfo(e) {
      let {
        tableInfo: { name },
      } = e;
      this.isShowkey = name;
    },
  },
};
</script>
<style lang='scss' scoped>
.info-block-wrapper {
  width: 550px;
  flex: 0 0 550px;
  .info-block {
    padding: 0px !important;
    overflow-y: auto;
  }
}
</style>