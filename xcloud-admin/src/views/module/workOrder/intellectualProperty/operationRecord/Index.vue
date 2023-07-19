<template>
  <SearchForm :rule="rule" @submitParams="submitParams"> </SearchForm>
  <DataTable ref="dataTable" :columns="columns" :methodName="getTrademarkAutoOperateLog">
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'updateType'">
        {{ getUpdateType(record.updateType) }}
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <FileSearchOutlined v-if="useButton('workOrder_intellectualProperty_operationRecord_detail')" class="detail-btn" @click="goDetailsPage(record)" />
      </template>
    </template>
  </DataTable>
</template>

<script lang="ts" setup>
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns, updateTypes } from './config';
import router from '@/router';
import { useButton } from '@/utils/utils';
import { FileSearchOutlined } from '@ant-design/icons-vue';
import { getTrademarkAutoOperateLog } from '@/api/workOrder/intellectualProperty/trademark';

const dataTable: Ref = ref(null);

interface SearchType {
  serviceNo: string;
  autoOperateType: string;
  trademarkNameEn: string;
  applyName: string;
  userMobile: string;
  updateEndTime: string;
  updateStartTime: string;
  remark: string;
  updateTimeList: any;
}

const data = reactive<{ searchParams: SearchType }>({
  searchParams: {
    serviceNo: '',
    autoOperateType: '',
    trademarkNameEn: '',
    applyName: '',
    userMobile: '',
    updateEndTime: '',
    updateStartTime: '',
    remark: '',
    updateTimeList: [],
  },
});

//点击搜索
const submitParams = (p: SearchType) => {
  data.searchParams = p;
  const { updateTimeList } = data.searchParams;
  if (updateTimeList && updateTimeList.length === 2) {
    data.searchParams.updateStartTime = updateTimeList[0] + ' 00:00:00';
    data.searchParams.updateEndTime = updateTimeList[1] + ' 23:59:59';
  }
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.searchParams, resetCurrent);
};

//详情
const goDetailsPage = (record: any) => {
  const { serviceId, nodeCode, serviceStatus } = record
  router.push(`/trademark/detail?nodeCode=${nodeCode}&serviceId=${serviceId}&servicesStatus=${serviceStatus}`);
};

//转换更新类型
const getUpdateType = (type: string) => {
  return updateTypes.filter(o => o.value === type)[0].label;
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
}
.detail-btn {
  color: #1890ff;
  margin-left: 10px;
}
</style>
