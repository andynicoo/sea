<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button
          v-if="useButton('xcloudplat_dataCenter_salesDetails_exportBusiness')"
          type="danger"
          @click="downLoadFileBusiness()"
        >
          业务收入导出
        </a-button>
        <a-button
          v-if="useButton('xcloudplat_dataCenter_salesDetails_exportSale')"
          type="danger"
          @click="downLoadFileSale()"
        >
          财务销售导出
        </a-button>
        <a-button
          v-if="useButton('xcloudplat_dataCenter_salesDetails_export')"
          type="danger"
          @click="downLoadFileDetail()"
        >
          导出
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="selectRenewalMessageRead">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'userMobile'">
        <span v-hidden>{{ record.userMobile }}</span>
      </template>
      <template v-if="column.dataIndex === 'userLevel'">
        <span v-if="record.userLevel === 1">SMB客户</span>
        <span v-else-if="record.userLevel === 2">KA客户</span>
        <span v-else-if="record.userLevel === 3">品牌客户</span>
        <span v-else-if="record.userLevel === 4">渠道客户</span>
      </template>
      <template v-if="column.dataIndex === 'renewFlag'">
        <span v-if="record.renewFlag">是</span>
        <span v-else>否</span>
      </template>
      <!-- 分期处理 start -->
      <template v-if="column.dataIndex === 'partPaymentMoney'">
        <template v-if="record?.partPaymentInfo?.length">
          <p v-for="(partItem, partIndex) in record.partPaymentInfo" :key="partIndex">
            {{ `第${partIndex + 1}期：${partItem.paymentMoney}` }}
          </p>
        </template>
        <template v-else> 0 </template>
      </template>
      <template v-if="record?.partPaymentInfo?.length">
        <!-- 分期 付款时间 -->
        <template v-if="column.dataIndex === 'paymentTime'">
          <p v-for="(timeItem, timeIndex) in record.partPaymentInfo" :key="timeIndex">
            {{ `第${timeIndex + 1}期：${dealPayTime(timeItem.paymentTime)}` }}
          </p>
        </template>
        <!-- 分期 到账时间 -->
        <template v-if="column.dataIndex === 'gatheringTime'">
          <p v-for="(getItem, getIndex) in record.partPaymentInfo" :key="getIndex">
            {{ `第${getIndex + 1}期：${dealPayTime(getItem.gatheringTime)}` }}
          </p>
        </template>
        <!-- 支付方式 -->
        <template v-if="column.dataIndex === 'paymentChannel'">
          <p v-for="(payItem, payIndex) in record.partPaymentInfo" :key="payIndex">
            {{ `第${payIndex + 1}期：${payItem.paymentChannel}` }}
          </p>
        </template>
      </template>
      <!-- 分期处理 end -->
    </template>

    <template #summary>
      <a-table-summary-cell :index="0">合计</a-table-summary-cell>
      <a-table-summary-cell :col-span="8"></a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.serviceAmountTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.payableAmountTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell> {{ data.totalObj.actuallyAmountTotal || 0 }} </a-table-summary-cell>
      <a-table-summary-cell :col-span="12"></a-table-summary-cell>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import {
  selectRenewalMessageRead,
  selectSalesAmount,
  salesDetailExport,
  financialSalesExport,
  financialBusinessExport,
} from '@/api/dataCenter/salesDetails';
import { useButton, downloadFile } from '@/utils/utils';
import dayjs from 'dayjs';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
  totalObj: {},
});
const dealPayTime = (time: string) => {
  if (time) {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  } else {
    return '';
  }
};
//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.orderTimeList && data.params.orderTimeList.length === 2) {
    data.params.orderTimeList = [
      data.params.orderTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.orderTimeList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.paymentTimeList && data.params.paymentTimeList.length === 2) {
    data.params.paymentTimeList = [
      data.params.paymentTimeList[0].split(' ')[0] + ' 00:00:00',
      data.params.paymentTimeList[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.accountingTime && data.params.accountingTime.length === 2) {
    data.params.accountingTime = [
      data.params.accountingTime[0].split(' ')[0] + ' 00:00:00',
      data.params.accountingTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.departmentIdList) {
    data.params.departmentIdList = data.params.departmentIdList.params;
  }
  if (data.params.productCategoryIdList) {
    data.params.productCategoryIdList = data.params.productCategoryIdList.params;
  }

  getList();
  getTotal();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//获取统计
const getTotal = () => {
  selectSalesAmount(data.params).then((res: any) => {
    data.totalObj = res || {};
  });
};

//导出
const downLoadFileDetail = () => {
  salesDetailExport(data.params).then((res: any) => {
    downloadFile(res, '销售明细导出.xlsx');
  });
};

//财务销售导出
const downLoadFileSale = () => {
  financialSalesExport(data.params).then((res: any) => {
    downloadFile(res, '财务销售导出.xlsx');
  });
};

//业务导出
const downLoadFileBusiness = () => {
  financialBusinessExport(data.params).then((res: any) => {
    downloadFile(res, '业务导出.xlsx');
  });
};
</script>

<style scoped lang="less"></style>
