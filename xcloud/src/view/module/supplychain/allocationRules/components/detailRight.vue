<!-- addEdit 页面右侧展示信息 -->
<template>
  <div class="info-block-wrapper">
    <add-edit-el-table :list='elTableList.list' :tabNav="elTableList.tabNav" @handleClick="getTabalInfo"> </add-edit-el-table>
    <div class="info-block">
      <info-item :tabkey='isShowkey' comKey="key1" :list='itemList'></info-item>
   
    </div>
    <div class="info-block2">
     
      <add-edit-supplier-info :tabkey='isShowkey' comKey="key2" :listByNoInfo="listByNoInfo"> </add-edit-supplier-info>
    </div>
  </div>
</template>

<script>
import AddEditElTable from "./addEditComponents/addEditElTable.vue";
import { getSupplierAllotRuleInfo } from "@/api/newApi/supplyChain/allocationRules.js";

export default {
  name: "DetailRight",
  components: {
    AddEditElTable,
    AddEditSupplierInfo: () => import("./addEditComponents/addEditSupplierInfo.vue"),
    InfoItem: () => import("./addEditComponents/infoTtem.vue"),
    CompleteStatistics: () => import("./addEditComponents/completeStatistics.vue"),
  },

  data() {
    return {
      id: this.$route.query.id,
      allocationFunctionCode: this.$route.query.functionCode || 0,
      elTableList: {
        list: [
          { name: "key1", lable: "基本信息" },
          { name: "key2", lable: "操作记录" },
        ],
        tabNav: "key1",
      }, //table 数据 点击导航栏
      isShowkey: "key1", //点击的组件
      itemList: [
        { name: " 商品分类：", key: "productCategoryName", value: "测试" },
        { name: "供应商类型：", key: "supplierType", value: "测试" },
        { name: "国家：", key: "countryName", value: "测试" },
        { name: "创建人：", key: "createName", value: "测试" },
        { name: "创建时间：", key: "createTime", value: "测试" },
        { name: "备注:", key: "remark", value: "测试" },
      ],
      listByNoInfo: {
        businessNo: this.$route.query.id,
        businessModule: 105,
        businessType: 5,
      },
    };
  },

  created() {
    this.getData();
  },
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
    /**
     * 获取基本信息数据
     */
    async getData() {
      let { data, code } = await getSupplierAllotRuleInfo({
        id: this.id,
        showType: 0,
        functionCode: this.allocationFunctionCode || 0,
      });
      if (code == 0) this.setItemList(data);
    },
    /**
     * 处理基本信息数据
     */
    setItemList(obj) {
      this.itemList.forEach((item) => {
        for (let key in obj) {
          if (key == item.key) {
            key == "supplierType" ? (item.value = obj[key] == 1 ? "服务商" : "律师") : (item.value = obj[key]);
          }
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.info-block-wrapper {
  margin: 0px;
  margin-left: 10px;
  margin-top: 10px;

}
</style>