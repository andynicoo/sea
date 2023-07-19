<template>
  <div class="spokesman">
    <SearchForm :rule="rule" @submitParams="submitParams"> </SearchForm>

    <DataTable
      ref="dataTable"
      :columns="columns"
      :methodName="recordPageList"
      :pageKeyStr="{ currentKey: 'current', pageSizeKey: 'size' }"
    >
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'sendStatus'">
          {{ record.sendStatus == 'SUCCESS' ? '发送成功' : record.sendStatus == 'FAIL' ? '失败' : '' }}
        </template>

        <template v-if="column.dataIndex === 'enterpriseName'">
          {{ filterEnterpriseName(record.enterpriseId) }}
        </template>

        <template v-if="column.dataIndex === 'functionCode'">
          {{ filterFunName(record.functionCode) }}
        </template>

        <template v-if="column.dataIndex === 'sendModel'">
          {{ $filters.filterSendModel(record.sendModel) }}
        </template>

        <template v-if="column.dataIndex === 'sendType'">
          {{ $filters.filterSendType(record.sendType) }}
        </template>
        <template v-if="column.dataIndex === 'messageType'">
          {{ $filters.filterMessageType(record.messageType) }}
        </template>
        <template v-if="column.dataIndex === 'messageStatus'">
          <span v-if="record.sendModel == 'CLIENT'">
            {{ record.messageStatus == 'YES' ? '已读' : record.messageStatus == 'NO' ? '未读' : '' }}
          </span>
          <span v-else-if="record.sendModel == 'PENDING'"
            >{{ record.messageStatus == 'YES' ? '已处理' : record.messageStatus == 'NO' ? '未处理' : '' }}
          </span>
          <span v-else></span>
        </template>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import { rule, columns, enterpriseIdList, optArr } from './config';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { recordPageList } from '@/api/messageCenter/messageRecord';

const dataTable: Ref = ref(null);

const data: any = reactive({
  params: {},
  record: {},
});
//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.createTimeTimeList && data.params.createTimeTimeList.length) {
    data.params.createTimeStart = data.params.createTimeTimeList[0];
    data.params.createTimeEnd = data.params.createTimeTimeList[1];
  } else {
    data.params.createTimeStart = '';
    data.params.createTimeEnd = '';
  }
  if (data.params.workOrderType && data.params.workOrderType.length) {
    data.params.parentFunctionCode = data.params.workOrderType[0];
    data.params.functionCode = data.params.workOrderType[1];
  } else {
    data.params.parentFunctionCode = '';
    data.params.functionCode = '';
  }

  getList();
};

const filterEnterpriseName = (enterpriseId: number) => {
  return (enterpriseIdList.find((el: any) => el.value == enterpriseId) || {}).label;
};

const filterFunName = (functionCode: number) => {
  return (optArr.find(el => el.code == functionCode) || {}).name;
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};
//暴露方法
defineExpose({ filterEnterpriseName, filterFunName });
</script>
