<template>
  <SearchForm :rule="rule" @submitParams="submitParams" :searchOpen="true">
    <template #operationSlot>
      <a-button
        class="bg-yellow"
        v-if="useButton('xcloudplat_workOrder_revenueAnalysis_statisticsDesc')"
        type="danger"
        @click="statisticsDesc()"
      >
        统计说明
      </a-button>
    </template>
  </SearchForm>
  <DataBox ref="dataBox" :params="data.params" />
  <a-row :gutter="20">
    <a-col :span="24">
      <GoodsSalesTrend ref="goodsSalesTrend" :params="data.params" />
    </a-col>
    <a-col :span="12">
      <DepartmentSales ref="departmentSales" :params="data.params" />
    </a-col>
    <a-col :span="12">
      <CategorySales ref="categorySales" :params="data.params" />
    </a-col>
    <a-col :span="12">
      <CountrySales ref="countrySales" :params="data.params" />
    </a-col>
    <a-col :span="12">
      <TransverseBar
        ref="serviceSaleRank"
        title="服务商销售排行"
        tips="默认展示所选项下前10的服务商排名"
        columnTitle="服务商"
        :params="data.params"
        :methodName="getSupplierRank"
      />
    </a-col>
    <a-col :span="12">
      <TransverseBar
        ref="goodsSaleRank"
        title="商品销售排行"
        tips="默认展示所选项下前10的商品排名"
        columnTitle="商品"
        :params="data.params"
        :methodName="getProductRank"
      />
    </a-col>
    <a-col :span="12">
      <TransverseBar
        ref="userSaleRank"
        title="人员销售排行"
        tips="默认展示所选项下前10的销售人员排名"
        columnTitle="人员"
        :params="data.params"
        :methodName="getAttributionRank"
      />
    </a-col>
    <a-col :span="12">
      <RefundReason ref="refundReason" :params="data.params" />
    </a-col>
  </a-row>
  <StatisticsDescDrawer ref="statisticsDescDrawer" :params="data.params" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, onMounted, nextTick } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import { rule } from './config';
import { useButton } from '@/utils/utils';
import DataBox from './components/DataBox.vue';
import StatisticsDescDrawer from './components/StatisticsDescDrawer.vue';
import GoodsSalesTrend from './components/echartBox/GoodsSalesTrend.vue';
import DepartmentSales from './components/echartBox/DepartmentSales.vue';
import CategorySales from './components/echartBox/CategorySales.vue';
import CountrySales from './components/echartBox/CountrySales.vue';
import TransverseBar from './components/echartBox/TransverseBar.vue';
import RefundReason from './components/echartBox/RefundReason.vue';
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
  if (data.params.statisticsTime && data.params.statisticsTime.length === 2) {
    data.params.statisticsTime = [
      data.params.statisticsTime[0].split(' ')[0] + ' 00:00:00',
      data.params.statisticsTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.arrivalTime && data.params.arrivalTime.length === 2) {
    data.params.arrivalTime = [
      data.params.arrivalTime[0].split(' ')[0] + ' 00:00:00',
      data.params.arrivalTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.refundTime && data.params.refundTime.length === 2) {
    data.params.refundTime = [
      data.params.refundTime[0].split(' ')[0] + ' 00:00:00',
      data.params.refundTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.departmentIdList) {
    data.params.departmentIdList = data.params.departmentIdList.params;
  }
  if (data.params.productCategoryIdList) {
    data.params.productCategoryIdList = data.params.productCategoryIdList.params;
  }

  if (!data.params.statisticsTime && !data.params.arrivalTime && !data.params.refundTime) {
    message.error('统计时间、到账时间、退款时间必填一项');
    return false;
  }

  nextTick(() => {
    getList();
  });
};

//统计说明
const statisticsDescDrawer: Ref = ref(null);
const statisticsDesc = () => {
  statisticsDescDrawer.value.showDrawer = true;
};

const dataBox: Ref = ref(null);
const goodsSalesTrend: Ref = ref(null);
const departmentSales: Ref = ref(null);
const categorySales: Ref = ref(null);
const countrySales: Ref = ref(null);
const serviceSaleRank: Ref = ref(null);
const goodsSaleRank: Ref = ref(null);
const userSaleRank: Ref = ref(null);
const refundReason: Ref = ref(null);
const getList = () => {
  dataBox.value.getList();
  goodsSalesTrend.value.getList();
  departmentSales.value.getList();
  categorySales.value.getList();
  countrySales.value.getList();
  serviceSaleRank.value.getList();
  goodsSaleRank.value.getList();
  userSaleRank.value.getList();
  refundReason.value.getList();
};
</script>

<style scoped lang="less"></style>
