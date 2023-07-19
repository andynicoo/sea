<template>
  <SearchForm :rule="rule" @submitParams="submitParams" :searchOpen="true"></SearchForm>
  <DataBox ref="dataBox" :params="data.params" />
  <a-row :gutter="20">
    <a-col :span="12">
      <!-- 部门统计 -->
      <Departments ref="departments" :params="data.params" />
    </a-col>
    <a-col :span="12">
      <!-- 销售人员统计 -->
      <SalesPersonnel ref="salesPersonnel" :params="data.params" />
    </a-col>
    <a-col :span="12">
      <!-- 商品分类统计 -->
      <Categorys ref="categorys" :params="data.params" />
    </a-col>
    <a-col :span="12">
      <!-- 国家统计 -->
      <Countries ref="countries" :params="data.params" />
    </a-col>
    <a-col :span="12">
      <!-- 原因统计 -->
      <Reasons ref="reasons" :params="data.params" />
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, onMounted, nextTick } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import { rule } from './config';
import { useButton } from '@/utils/utils';
import DataBox from './components/DataBox.vue';
import Departments from './components/echartBox/Departments.vue';
import SalesPersonnel from './components/echartBox/SalesPersonnel.vue';
import Categorys from './components/echartBox/Categorys.vue';
import Countries from './components/echartBox/Countries.vue';
import Reasons from './components/echartBox/Reasons.vue';
import { getSupplierRank, getProductRank, getAttributionRank } from '@/api/dataCenter/revenueAnalysis';
import { message } from 'ant-design-vue';

const data: any = reactive({
  params: {},
  record: {},
});

// onMounted(() => {
//   getList();
// });

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.expirationTimeList && data.params.expirationTimeList.length === 2) {
    data.params.expirationTimeList = [
      data.params.expirationTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.expirationTimeList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.departmentIdList) {
    data.params.departmentIdList = data.params.departmentIdList.params;
  }
  if (data.params.productCategoryIdList) {
    data.params.productCategoryIdList = data.params.productCategoryIdList.params;
  }

  if (!data.params.expirationTimeList) {
    message.error('服务截止日期为必填项');
    return false;
  }

  nextTick(() => {
    getList();
  });
};

const dataBox: Ref = ref(null);
const departments: Ref = ref(null);
const categorys: Ref = ref(null);
const countries: Ref = ref(null);
const salesPersonnel: Ref = ref(null);
const reasons: Ref = ref(null);
const getList = () => {
  dataBox.value.getList();
  departments.value.getList();
  salesPersonnel.value.getList();
  categorys.value.getList();
  countries.value.getList();
  reasons.value.getList();
};
</script>

<style scoped lang="less"></style>
