<template>
  <SearchForm class="search-form" ref="form" :rule="rule" @submitParams="submitParams">
    <template #bottomSlot>
      <div class="btns">
        <a-button
          class="btn"
          v-if="useButton('xcloudplat_saasManage_activity_create')"
          type="danger"
          @click="createActivity"
        >
          创建活动
        </a-button>
      </div>
    </template>
  </SearchForm>

  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getReportList"
    :page-key-str="{ currentKey: 'current', pageSizeKey: 'size' }"
    @lookup="lookup"
    @edit="editRow"
    @deleteRow="deleteRow"
  >
    <template #bodyCell="{ text, record, index, column }">
      <a-tooltip v-if="column.dataIndex === 'title'" :title="text">
        <div class="title">{{ text }}</div>
      </a-tooltip>
      <div v-if="column.dataIndex === 'activityTime'">{{ record.startTime }} - {{ record.endTime }}</div>
      <div v-if="column.key === 'opration'">
        <span class="operation-btn" @click="lookup({ text, record, index, column })">查看</span>
        <span class="operation-btn" @click="editRow({ text, record, index, column })">编辑</span>
        <span class="operation-btn" @click="deleteRow({ text, record, index, column })">删除</span>
      </div>
    </template>
  </DataTable>
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
import { getReportList, deleteReport, batchDel } from '@/api/saasManage/kownManage/activityList';
import { jumpPage, useButton } from '@/utils/utils';
import { message, Modal } from 'ant-design-vue';

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
  });
  data.params = formData;
  getList();
}

//获取列表
function getList(resetCurrent = true) {
  dataTable.value.getList(data.params, resetCurrent);
  data.selection = [];
}

// 查看
function lookup(rowData: any) {
  jumpPage(`/saasmanage/knowManage/activityList/detail?id=${rowData.record.id}`);
}

// 编辑
function editRow(rowData: any) {
  jumpPage(`/saasmanage/knowManage/activityList/addActivity?id=${rowData.record.id}`);
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

// 创建活动
function createActivity() {
  jumpPage('/saasmanage/knowManage/activityList/addActivity');
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
  z-index: 1000;
}
.title {
  width: 160px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.operation-btn {
  color: #666;
  display: inline-block;
  margin-right: 10px;
  cursor: pointer;
}
.operation-btn:hover {
  color: #1890ff;
}
.footer {
  padding-left: 10px;
  margin: 10px 0;
  font-size: 12px;
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
