<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <!-- 批量修改弹窗 -->
      <ChangeHandlerModal :ids="selectedRowKeys.map((v: any) => v.id)" @submit="getList(false)" />
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :rowSelection="{
      selectedRowKeys: selectedRowKeys,
      onChange: (selectRows:any)=> selectedRowKeys = selectRows
    }"
    :methodName="getTrademarkRecordList"
  >
    <template #topSlot>
      <a-space>
        <!-- 新增核名弹窗 -->
        <AddModal @submit="getList(false)" />

        <!-- 批量核名弹窗 -->
        <AddBatchModal @submit="getList(false)" @download="downloadBatchTemplete" />

        <a @click="downloadBatchTemplete" v-if="useButton('workOrder_intellectualProperty_trademarkRecord_templete')"
          >批量上传核名记录模版</a
        >
      </a-space>
      <a-alert :message="`已选择 ${selectedRowKeys.length} 项`" type="info" show-icon class="alert-msg" />
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'batchNo'">
        {{ record.batchNo || '--' }}
      </template>
      <!-- 用户确认记录、检索通过率、检索结果 -->
      <template v-if="['userConfirmStatus', 'checkPassRate', 'checkResult'].includes(column.dataIndex)">
        <div v-html="getFieldString(record, column)"></div>
      </template>
      <template v-if="column.dataIndex === 'recordStatus'">
        {{ statusMap[record.recordStatus] }}
      </template>
      <template v-if="column.dataIndex === 'lastRemark'">
        {{ record.lastRemark || '--' }}
      </template>
      <template v-if="column.dataIndex === 'saleUserName'">
        {{ record.saleUserName || '--' }}
      </template>
      <template v-if="column.dataIndex === 'customerServiceUserName'">
        {{ record.customerServiceUserName || '--' }}
      </template>
      <template v-if="column.dataIndex === 'checkUserName'">
        {{ record.checkUserName || '--' }}
      </template>
      <template v-if="column.dataIndex === 'workUserName'">
        {{ record.workUserName || '--' }}
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <a-button
          type="link"
          @click="goDetailsPage(record)"
          v-if="useButton('workOrder_intellectualProperty_trademarkRecord_detail')"
          >详情</a-button
        >
        <a-button
          type="link"
          @click="showDeleteConfirm(record)"
          v-if="
            useButton('workOrder_intellectualProperty_trademarkRecord_delete') && record.recordStatus === 'WAIT_CHECK'
          "
          >删除</a-button
        >
        <a-button
          v-if="
            record.recordStatus === 'WAIT_RECHECK' &&
            useButton('workOrder_intellectualProperty_trademarkRecord_recheck')
          "
          type="link"
          @click="goDetailsPage(record)"
        >
          复核
        </a-button>
      </template>
    </template>
  </DataTable>
</template>

<script lang="ts" setup>
import { ref, reactive, type Ref, createVNode } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import ChangeHandlerModal from './components/ChangeHandlerModal.vue';
import AddModal from './components/AddModal.vue';
import AddBatchModal from './components/AddBatchModal.vue';
import { rule, columns, statusMap, userConfirmStatusMap, reportTypeMap } from './config';
import router from '@/router';
import { Modal, message } from 'ant-design-vue';
import { useButton, jumpPage } from '@/utils/utils';
import { FileSearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import {
  getTrademarkRecordList,
  handleTrademarkRecordDelete,
  handleDownloadTemplete,
} from '@/api/workOrder/intellectualProperty/trademark';

const selectedRowKeys = ref([]);
const dataTable: Ref = ref(null);

interface SearchType {
  keyword: string;
  trademarkName: string;
  recordStatusList: any;
  recordStatus: string;
  countryList: any;
  countries: string;
  userConfirmsList: any;
  userConfirms: string;
  passRatesList: any;
  passRates: string;
  updateEndTime: string;
  updateStartTime: string;
  curCheckUserList: any;
  curCheckUserIds: string;
  customerServiceUserList: any;
  customerServiceUserIds: string;
  saleUserList: any;
  saleUserIds: string;
  checkUserList: any;
  checkUserIds: string;
  workUserList: any;
  workUserIds: string;
  createTimeList: any;
  createList: any;
  createIds: string;
}

const data = reactive<{ searchParams: SearchType }>({
  searchParams: {
    keyword: '',
    trademarkName: '',
    recordStatusList: [],
    recordStatus: '',
    countryList: [],
    countries: '',
    userConfirmsList: [],
    userConfirms: '',
    passRatesList: [],
    passRates: '',
    updateEndTime: '',
    updateStartTime: '',
    curCheckUserList: [],
    curCheckUserIds: '',
    saleUserList: [],
    saleUserIds: '',
    customerServiceUserList: [],
    customerServiceUserIds: '',
    checkUserList: [],
    checkUserIds: '',
    workUserList: [],
    workUserIds: '',
    createTimeList: [],
    createList: [],
    createIds: '',
  },
});

//点击搜索
const submitParams = (p: SearchType) => {
  data.searchParams = p;
  const {
    recordStatusList = [],
    countryList = [],
    userConfirmsList = [],
    passRatesList = [],
    createList = [],
    createTimeList = [],
    curCheckUserList = [],
    saleUserList = [],
    customerServiceUserList = [],
    checkUserList = [],
    workUserList = [],
  } = data.searchParams;
  if (createTimeList && createTimeList.length === 2) {
    data.searchParams.updateStartTime = createTimeList[0] + ' 00:00:00';
    data.searchParams.updateEndTime = createTimeList[1] + ' 23:59:59';
  }
  data.searchParams = {
    ...data.searchParams,
    curCheckUserIds: curCheckUserList.length ? curCheckUserList.join(',') : undefined,
    saleUserIds: saleUserList.length ? saleUserList.join(',') : undefined,
    customerServiceUserIds: customerServiceUserList.length ? customerServiceUserList.join(',') : undefined,
    checkUserIds: checkUserList.length ? checkUserList.join(',') : undefined,
    workUserIds: workUserList.length ? workUserList.join(',') : undefined,
    recordStatus: recordStatusList.length ? recordStatusList.join(',') : undefined,
    countries: countryList.length ? countryList.join(',') : undefined,
    userConfirms: userConfirmsList.length ? userConfirmsList.join(',') : undefined,
    passRates: passRatesList.length ? passRatesList.join(',') : undefined,
    createIds: createList.length ? createList.join(',') : undefined,
  };
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  selectedRowKeys.value = [];
  dataTable.value.getList(data.searchParams, resetCurrent);
};

//详情
const goDetailsPage = (record: any) => {
  jumpPage(
    `/workOrder/intellectualProperty/trademarkNameReviewRecord/details?id=${record.id}&recordNo=${record.recordNo}`
  );
};

// 获取用户确认记录、通过率、检索结果
const getFieldString = (record: any, column: any) => {
  if (!record.reportList.length) {
    return '--';
  }
  return record.reportList
    .map((item: any) => {
      const result =
        column.dataIndex === 'userConfirmStatus'
          ? userConfirmStatusMap[item[column.dataIndex]] || '--'
          : item[column.dataIndex] || '--';
      return `${reportTypeMap[item.reportType]}：${result}<br/>`;
    })
    .join('');
};

// 删除记录
const showDeleteConfirm = (record: any) => {
  Modal.confirm({
    title: '确定要删除此项吗？',
    icon: createVNode(ExclamationCircleOutlined),
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      handleTrademarkRecordDelete({
        ids: [record.id],
      }).then(() => {
        message.success('操作成功');
        getList();
      });
    },
  });
};

// 下载模板
const downloadBatchTemplete = () => {
  handleDownloadTemplete().then(res => {
    window.open(res, '_blank');
  });
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
}
.operate-btn {
  color: #1890ff;
  margin-left: 10px;
}
.alert-msg {
  margin: 10px 0;
}
</style>
