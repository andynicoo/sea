<template>
  <SearchForm :rule="rule" @submitParams="submitParams">
    <template #operationSlot>
      <a-space>
        <a-button v-if="useButton('xcloudplat_customer_setting_datapush_add')" type="primary" @click="add()">
          新增
        </a-button>
      </a-space>
    </template>
  </SearchForm>
  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getListPage"
    :pageKeyStr="{ currentKey: 'current', pageSizeKey: 'size' }"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'type'">
        {{ record.type === 'push' ? '推送任务' : '下载任务' }}
      </template>
      <template v-if="column.dataIndex === 'pushStatus'">
        <a-tag v-if="record.pushStatus === 'not_pushed'" color="error">未推送</a-tag>
        <a-tag v-else-if="record.pushStatus === 'push_failed'" color="error">推送失败</a-tag>
        <a-tag v-else-if="record.pushStatus === 'partial_push'" color="warning">部分推送成功</a-tag>
        <a-tag v-else-if="record.pushStatus === 'push_all'" color="success">全部推送成功</a-tag>
        <a-tag v-else-if="record.pushStatus === 'pushing'" color="processing">推送中</a-tag>
      </template>
      <template v-if="column.dataIndex === 'sendTime'">
        {{ record.sendTime || '--' }}
      </template>
      <template v-if="column.dataIndex === 'downloadLogNum'">
        <a-button type="link" @click="downloadRecord(record)"> {{ record.downloadLogNum }} </a-button>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-button
          v-if="useButton('xcloudplat_customer_setting_datapush_edit')"
          type="link"
          size="small"
          @click="edit(record)"
          :disabled="!!record.sqlStr"
          title="编辑"
        >
          <EditOutlined />
        </a-button>
        <a-button
          v-if="useButton('xcloudplat_customer_setting_datapush_download')"
          type="link"
          size="small"
          @click="download(record)"
          title="下载"
        >
          <CloudDownloadOutlined />
        </a-button>
        <a-button
          v-if="useButton('xcloudplat_customer_setting_datapush_push')"
          type="link"
          size="small"
          @click="push(record)"
          :disabled="record.type === 'download'"
          title="推送"
        >
          <SendOutlined />
        </a-button>
      </template>
    </template>
  </DataTable>
  <AddModal ref="addModal" @submit="getList()" />
  <FileRecordModal ref="fileRecordModal" :record="data.record" />
  <EditSqlModal ref="editSqlModal" :record="data.record" @submit="getList(false)" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { useButton } from '@/utils/utils';
import { getListPage, pushRecordExport, pushRecord } from '@/api/customerManage/datapush';
import AddModal from './components/AddModal.vue';
import FileRecordModal from './components/FileRecordModal.vue';
import EditSqlModal from './components/EditSqlModal.vue';
import { message, Modal } from 'ant-design-vue';
import { CloudDownloadOutlined, EditOutlined, SendOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
});

//点击搜索
const submitParams = (p: object) => {
  data.params = p;
  if (data.params.taskCreateTime) {
    data.params.createStartTime = data.params.taskCreateTime[0].split(' ')[0] + ' 00:00:00';
    data.params.createEndTime = data.params.taskCreateTime[1].split(' ')[0] + ' 23:59:59';
  }
  if (data.params.applyBys?.length === 0) {
    delete data.params.applyBys;
  }
  getList();
};

//获取列表
const getList = (resetCurrent = true) => {
  dataTable.value.getList(data.params, resetCurrent);
};

//下载文件记录
const fileRecordModal: Ref = ref(null);
const downloadRecord = (record: any) => {
  data.record = record;
  fileRecordModal.value.showModal = true;
};

//新增
const addModal: Ref = ref(null);
const add = () => {
  addModal.value.showModal = true;
};

//编辑
const editSqlModal: Ref = ref(null);
const edit = (record: any) => {
  data.record = record;
  editSqlModal.value.showModal = true;
};

// 下载
const download = (record: any) => {
  pushRecordExport({
    dataSqlTaskDownloadLog: {
      sqlTaskId: record.sqlTaskId,
    },
  }).then((res: any) => {
    window.open(res);
  });
};

// 推送
const push = (record: any) => {
  Modal.confirm({
    title: '提示',
    width: 400,
    content: '确认推送？',
    onOk() {
      return new Promise((resolve, reject) => {
        pushRecord({
          dataSqlTask: {
            sqlTaskId: record.sqlTaskId,
          },
        }).then((res: any) => {
          resolve(true);
          message.success('操作成功');
          getList(false);
        });
      });
    },
  });
};
</script>

<style scoped lang="less"></style>
