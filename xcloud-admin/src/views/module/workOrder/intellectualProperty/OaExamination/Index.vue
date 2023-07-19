<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <ChangeHandlerModal
          v-if="useButton('workOrder_intellectualProperty_OaExamination_changeHandlerBatch')"
          :serviceIdsArr="selectedRowKeys.map((v: any) => v.serviceId)"
          @submit="getList(false)"
        />
      </a-space>
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
    :methodName="getListPage"
  >
    <template #topSlot>
      <a-tabs v-model:activeKey="data.order" @change="getList()">
        <a-tab-pane v-for="li of data.statusList" :key="li.order" :tab="li.statusDesc" />
      </a-tabs>
    </template>

    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'trademarkInfo'">
        <div>订单号：{{ record.orderNo }}</div>
        <div>服务编号：{{ record.serviceNo }}</div>
        <div>商标名称：{{ record.trademarkNameEn }}</div>
        <div>服务名称：{{ record.serviceName }}</div>
      </template>
      <template v-if="column.dataIndex === 'acceptInfo'">
        <div>受理号：{{ record.acceptNum }}</div>
        <div>日期：{{ record.acceptTime }}</div>
      </template>
      <template v-if="column.dataIndex === 'handleInfo'">
        <div
          v-for="(item, index) in record.workorderHandlerList || []"
          :key="index"
          style="margin: 2px 0; font-size: 12px"
        >
          <span>{{ item.handleTypeName }}</span>
          <span>：</span>
          <span>{{ item.handlerUserName }}</span>
        </div>
      </template>

      <template v-if="column.dataIndex === 'operation'">
        <FileSearchOutlined
          style="color: #1890ff; margin-left: 10px"
          @click="goDetailsPage(record)"
          v-if="useButton('workOrder_intellectualProperty_OaExamination_details')"
        />
      </template>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, onMounted } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { jumpPage, useButton } from '@/utils/utils';
import { getListPage, getOaStatusList } from '@/api/workOrder/intellectualProperty/oaExamination';
import { FileSearchOutlined } from '@ant-design/icons-vue';
import ChangeHandlerModal from '../components/ChangeHandlerModal.vue';
import { message } from 'ant-design-vue';

const selectedRowKeys = ref([]);
const dataTable: Ref = ref(null);
const data: any = reactive({
  statusList: [], //状态列表
  order: -1, //状态
  params: {},
  record: {},
});

onMounted(() => {
  getOaStatusListFun();
});

//点击搜索
const submitParams = (params: any) => {
  if (params.createTime && params.createTime.length === 2) {
    params.createStartTime = params.createTime[0].split(' ')[0] + ' 00:00:00';
    params.createEndTime = params.createTime[1].split(' ')[0] + ' 23:59:59';
    params.createTime = undefined;
  }
  if (params.updateTime && params.updateTime.length === 2) {
    params.updateStartTime = params.updateTime[0].split(' ')[0] + ' 00:00:00';
    params.updateEndTime = params.updateTime[1].split(' ')[0] + ' 23:59:59';
    params.updateTime = undefined;
  }
  if (params.acceptTime && params.acceptTime.length === 2) {
    params.acceptStartTime = params.acceptTime[0].split(' ')[0] + ' 00:00:00';
    params.acceptEndTime = params.acceptTime[1].split(' ')[0] + ' 23:59:59';
    params.acceptTime = undefined;
  }
  if (params.customerExpiryTime && params.customerExpiryTime.length === 2) {
    params.customerExpiryStartDate = params.customerExpiryTime[0].split(' ')[0] + ' 00:00:00';
    params.customerExpiryEndDate = params.customerExpiryTime[1].split(' ')[0] + ' 23:59:59';
    params.customerExpiryTime = undefined;
  }
  if (params.officialExpirationDateTime && params.officialExpirationDateTime.length === 2) {
    params.officialExpirationDateStartDate = params.officialExpirationDateTime[0].split(' ')[0] + ' 00:00:00';
    params.officialExpirationDateEndDate = params.officialExpirationDateTime[1].split(' ')[0] + ' 23:59:59';
    params.officialExpirationDateTime = undefined;
  }
  data.params = params;
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  data.params.order = data.order;
  selectedRowKeys.value = [];
  dataTable.value.getList(data.params, resetCurrent);
};

//详情
const goDetailsPage = (record: any) => {
  jumpPage(`/workOrder/intellectualProperty/OaExamination/details?title=OA工单详情&serviceId=${record.serviceId}`);
};

//获取状态
const getOaStatusListFun = () => {
  getOaStatusList().then((res: any) => {
    data.statusList = res || [];
  });
};
</script>

<style scoped lang="less"></style>
