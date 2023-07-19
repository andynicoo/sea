<template>
  <SearchForm :rule="rule" @submitParams="submitParams" />
  <DataTable ref="dataTable" :columns="columns" :methodName="getListPage">
    <template #topSlot>
      <a-tabs v-model:activeKey="data.order" @change="getList()">
        <a-tab-pane v-for="li of data.statusList" :key="li.order" :tab="li.statusDesc" />
      </a-tabs>
    </template>

    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'trademarkInfo'">
        <div>订单号：{{ record.orderNo }}</div>
        <div>服务编号：{{ record.serviceNo }}</div>
        <div>服务名称：{{ record.serviceName }}</div>
      </template>

      <template v-if="column.dataIndex === 'operation'">
        <FileSearchOutlined
          style="color: #1890ff; margin-left: 10px"
          @click="goDetailsPage(record)"
          v-if="useButton('workOrder_intellectualProperty_TakeAnOath_details')"
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
import { getListPage, getOaStatusList } from '@/api/workOrder/intellectualProperty/takeAnOath';
import { FileSearchOutlined } from '@ant-design/icons-vue';

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
  data.params = params;
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  data.params.order = data.order;
  dataTable.value.getList(data.params, resetCurrent);
};

//详情
const goDetailsPage = (record: any) => {
  jumpPage(`/workOrder/intellectualProperty/TakeAnOath/details?title=商标五年宣誓详情&serviceId=${record.serviceId}`);
};

//获取状态
const getOaStatusListFun = () => {
  getOaStatusList().then((res: any) => {
    data.statusList = res || [];
  });
};
</script>

<style scoped lang="less"></style>
