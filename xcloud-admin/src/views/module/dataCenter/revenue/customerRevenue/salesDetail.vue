<template>
  <div class="btn-wrapper">
    <div class="back-page" @click="returnPage()">
      <LeftOutlined class="icon" />
      <span class="text">返回</span>
    </div>
    <a-button
      v-if="useButton('xcloudplat_dataCenter_customerRevenue_export')"
      type="primary"
      danger
      @click="downLoadFile()"
    >
      导出
    </a-button>
  </div>
  <DataTable ref="dataTable" :columns="salesDetailColumns" :methodName="orderDetailList">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'userMobile'">
        <span v-hidden>{{ record.userMobile }}</span>
      </template>
    </template>
    <template #summary>
      <a-table-summary-cell :index="0">合计</a-table-summary-cell>
      <a-table-summary-cell :col-span="5"></a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.specsMoneyTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.specsPaymentMoneyTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.specsPaidMoneyTotal || 0 }} </a-table-summary-cell>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, type Ref } from 'vue';
import DataTable from '@/components/page/DataTable.vue';
import { salesDetailColumns } from './config';
import { useButton, downloadFile, jumpPage } from '@/utils/utils';
import { orderDetailList, orderDetailListTotal, serviceCompanyExport } from '@/api/dataCenter/customerRevenue';
import { useRoute } from 'vue-router';
import { LeftOutlined } from '@ant-design/icons-vue';
import { useStore } from '@/stores/store';
import type { ITabsRecord } from '@/types';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {
    companyName: '',
  },
  record: {},
  totalObj: {},
});

onMounted(() => {
  const router = useRoute();
  data.params.companyName = router.query.companyName;
  getList();
  getTotal();
});

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//获取统计
const getTotal = () => {
  orderDetailListTotal(data.params).then((res: any) => {
    data.totalObj = res || {};
  });
};

//导出
const downLoadFile = () => {
  serviceCompanyExport(data.params).then((res: any) => {
    downloadFile(res, '下载文件.xlsx');
  });
};

//返回
const returnPage = () => {
  jumpPage('/dataCenter/revenue/customerRevenue');
  const list: Array<ITabsRecord> = JSON.parse(JSON.stringify(useStore().tabsList));
  const index = list.findIndex((v: ITabsRecord) => v.path === '/dataCenter/revenue/customerRevenue/salesDetail');
  list.splice(index, 1);
  useStore().setTabsList(list);
};
</script>

<style scoped lang="less">
.btn-wrapper {
  background-color: #fff;
  padding: 10px 10px 0;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .back-page {
    line-height: 22px;
    font-size: 14px;
    cursor: pointer;
    .icon {
      margin: 4px;
    }
    .text {
      margin-left: 2px;
    }
  }
}
</style>
