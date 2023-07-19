<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-button v-if="useButton('xcloudplat_customerManage_ClueCenter_add')" type="danger" @click="goAddPage()">
        新增线索
      </a-button>
      <a-button
        v-if="useButton('xcloudplat_customerManage_ClueCenter_batchImport')"
        type="danger"
        @click="batchImport()"
      >
        批量导入
      </a-button>
      <a-button v-if="useButton('xcloudplat_customerManage_ClueCenter_follow')" type="danger" @click="editFollow()">
        修改跟进人
      </a-button>
      <a-button v-if="useButton('xcloudplat_customerManage_ClueCenter_manualPush')" type="danger" @click="manualPush()">
        手动推送
      </a-button>
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getClueCenterList"
    :totalMethodName="getPageListCount"
    :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectRows:any)=> selectedRowKeys = selectRows
      }"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'mobile'">
        <div v-if="record.leadCount > 1" @click="mobileDetails(record)" style="cursor: pointer">
          <a-tooltip placement="top">
            <template #title>
              <div style="font-size: 12px">疑似重复线索</div>
            </template>
            <ExclamationCircleOutlined style="color: rgb(252, 202, 0); margin-right: 8px" />
            <span v-hidden> {{ record.mobile }}</span>
          </a-tooltip>
        </div>
        <div v-else>
          <span v-hidden>{{ record.mobile }}</span>
        </div>
      </template>
      <template v-if="column.dataIndex === 'registerSource'">
        <span v-if="record.registerSource === 0">PC网页端</span>
        <span v-else-if="record.registerSource === 1">H5端</span>
        <span v-else-if="record.registerSource === 2">微信小程序</span>
        <span v-else-if="record.registerSource === 5">后台录入</span>
        <span v-else-if="record.registerSource === 6">销售易</span>
        <span v-else></span>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <FileSearchOutlined style="color: #1890ff; margin-left: 10px" @click="goDetailsPage(record)" />
      </template>
    </template>
  </DataTable>
  <BatchImportModal ref="batchImportModal" :record="data.record" />
  <EditFollowModal ref="editFollowModal" :selectedRowKeys="selectedRowKeys" @submit="getList(false)" />
  <ManualPushModal ref="manualPushModal" :selectedRowKeys="selectedRowKeys" @submit="getList(false)" />
  <RecordModal ref="recordModal" :record="data.record" @submit="getList(false)" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { useButton, jumpPage } from '@/utils/utils';
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined, FileSearchOutlined } from '@ant-design/icons-vue';
import { getClueCenterList, getPageListCount } from '@/api/customerManage/clueCenter';
import BatchImportModal from './components/BatchImportModal.vue';
import EditFollowModal from './components/EditFollowModal.vue';
import ManualPushModal from './components/ManualPushModal.vue';
import RecordModal from './components/RecordModal.vue';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});
const selectedRowKeys = ref([]);

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.followDepIds) {
    data.params.followDepIds = data.params.followDepIds.params;
  }
  if (data.params.sourceSmallEnum) {
    data.params.sourceSmallEnum = data.params.sourceSmallEnum.params;
  }
  if (data.params.createTimeQuery && data.params.createTimeQuery.length === 2) {
    data.params.createTimeQuery = [
      data.params.createTimeQuery[0].split(' ')[0] + ' 00:00:00',
      data.params.createTimeQuery[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.changeTime && data.params.changeTime.length === 2) {
    data.params.changeTime = [
      data.params.changeTime[0].split(' ')[0] + ' 00:00:00',
      data.params.changeTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  if (data.params.opportunityTime && data.params.opportunityTime.length === 2) {
    data.params.opportunityTime = [
      data.params.opportunityTime[0].split(' ')[0] + ' 00:00:00',
      data.params.opportunityTime[1].split(' ')[0] + ' 23:59:59',
    ];
  }
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  selectedRowKeys.value = [];
  dataTable.value.getList(data.params, resetCurrent);
};

//新增
const goAddPage = () => {
  jumpPage('/customerManage/clueCenter/AddClue');
};

//批量导入
const batchImportModal: Ref = ref(null);
const batchImport = () => {
  data.record = {};
  batchImportModal.value.showModal = true;
};

//修改跟进人
const editFollowModal: Ref = ref(null);
const editFollow = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择线索');
    return false;
  }
  editFollowModal.value.showModal = true;
};

//手动推送
const manualPushModal: Ref = ref(null);
const manualPush = () => {
  if (selectedRowKeys.value.length === 0) {
    message.error('请选择线索');
    return false;
  }
  manualPushModal.value.showModal = true;
};

//手机号点击详情
const recordModal: Ref = ref(null);
const mobileDetails = (record: any) => {
  data.record = record;
  recordModal.value.showModal = true;
};

//详情
const goDetailsPage = (record: any) => {
  jumpPage(
    '/customerManage/clueCenter/Details?id=' +
      record.customerLeadId +
      '&mobile=' +
      record.mobile +
      '&brandId=' +
      record.brandId
  );
};
</script>

<style scoped lang="less"></style>
