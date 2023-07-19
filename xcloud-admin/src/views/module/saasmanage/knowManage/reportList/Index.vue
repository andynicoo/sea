<template>
  <SearchForm class="search-form" ref="form" :rule="rule" @submitParams="submitParams">
    <template #bottomSlot>
      <div class="btns">
        <UploadAndDownload
          api="/information/report/upload"
          :selection="data.selection"
          :refrensh-table="getList"
          moduleName="批量上传报告"
        />
        <a-button
          class="btn"
          v-if="useButton('xcloudplat_knowManage_reportList_publish')"
          type="danger"
          @click="publish"
        >
          发布报告
        </a-button>
      </div>
    </template>
  </SearchForm>

  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getReportList"
    :rowSelection="rowSelection"
    :page-key-str="{ currentKey: 'current', pageSizeKey: 'size' }"
    @lookup="lookup"
    @edit="editRow"
    @deleteRow="deleteRow"
  >
    <template #bodyCell="{ text, record, index, column }">
      <a-tooltip v-if="column.dataIndex === 'title'" :title="text">
        <div class="title">{{ text }}</div>
      </a-tooltip>
      <div class="operation" v-if="column.key === 'operation'">
        <span @click="lookup({ text, record, index, column })">查看</span>
        <span @click="editRow({ text, record, index, column })">编辑</span>
        <span v-if="record.enabled === 'DISABLE'" @click="deleteRow({ text, record, index, column })">删除</span>
        <span @click="modifyStatus(record)">{{ record.enabled === 'DISABLE' ? '发布' : '取消发布' }}</span>
      </div>
    </template>
  </DataTable>  
  <div class="footer">
    <a-button type="primary" size="small" @click="batchDelete">删除</a-button>
    <span>选中 {{ data.selection.length }} 条数</span>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getReportList, deleteReport, batchDel, updateReport } from '@/api/saasManage/kownManage/reportList';
import { jumpPage, useButton } from '@/utils/utils';
import { message, Modal } from 'ant-design-vue';
import UploadAndDownload from '../components/uploadAndDownload.vue';

const form = ref(null);
const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
  selection: [],
});

//点击搜索
function submitParams(formData: any) {
  const keys = Object.keys(formData);
  keys.forEach(key => {
    if (formData.createTimeStart && key === 'createTimeStart') {
      let start = formData[key][0].split(' ')[0];
      let end = formData[key][1].split(' ')[0];
      formData.createTimeEnd = `${end} 23:59:59`;
      formData.createTimeStart = `${start} 00:00:00`;
    }
    if (!formData[key]) {
      formData[key] = undefined;
    }
    if (formData.region === 'all') {
      formData[key] = undefined;
    }
  });
  data.params = formData;
  getList();
}

const rowSelection = {
  onChange: (selectedRowKeys: any) => {
    data.selection = [];
    selectedRowKeys.forEach((item: any) => {
      data.selection.push(item.id);
    });
  },
};

//获取列表
function getList(resetCurrent = true) {
  dataTable.value.getList(data.params, resetCurrent);
  data.selection = [];
}

// 查看
function lookup(rowData: any) {
  jumpPage(`/saasmanage/knowManage/reportList/detail?id=${rowData.record.id}`);
}

// 编辑
function editRow(rowData: any) {
  jumpPage(`/saasmanage/knowManage/reportList/addReport?id=${rowData.record.id}`);
}

// 修改发布状态
async function modifyStatus(record: any) {
  let isEnable = record.enabled === 'ENABLE';
  record.enabled = isEnable ? 'DISABLE' : 'ENABLE';
  let result = await updateReport(record);
  getList();
  if (result) message.success(isEnable ? '取消发布成功' : '发布成功');
}

//删除
function deleteRow(rowData: any) {
  Modal.confirm({
    title: '确认框',
    content: '确认删除吗？',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      let result = await deleteReport({ id: rowData.record.id });
      result ? message.success('删除成功') : message.error('删除失败');
      getList();
    },
  });
}

// 发布
function publish() {
  jumpPage('/saasmanage/knowManage/reportList/addReport');
}

// 批量删除
function batchDelete() {
  if (!data.selection.length) {
    message.warning('请选择要删除的报告');
    return;
  }
  Modal.confirm({
    title: '批量删除',
    content: '确认删除掉已选中的报告吗？删除后不可恢复。',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      let result = await batchDel({ ids: data.selection });
      if (result) {
        getList();
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
    },
  });
}
</script>

<style scoped lang="less">
.btn {
  background: #ffc100 !important;
  border: none !important;
  font-size: 13px !important;
  color: #fafafa !important;
}
:deep(.main-img) {
  width: 120px;
  height: 120px;
}

.btns {
  position: absolute;
  right: 30px;
  top: 16px;
  z-index: 100;
}
.title {
  width: 160px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.operation {
  > span {
    color: #666;
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    &:hover {
      color: #1890ff;
    }
  }
}

.footer {
  padding-left: 10px;
  margin: 10px 0;
  font-size: 12px;
  position: absolute !important;
  bottom: 8px;
  margin-left: 10px;
  :deep(.ant-btn) {
    font-size: 12px;
  }
  > span {
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
<style>
.ivu-select-dropdown {
  z-index: 10000 !important;
}
</style>
