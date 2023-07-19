<template>
  <SearchForm class="search-form" ref="form" :rule="rule" @submitParams="submitParams">
    <template #bottomSlot>
      <div class="btns">
        <AttrwordGroupBtn
          :selected="data.selection"
          tip="请选择问答"
          @comfirm="getList"
          module="qa"
          add-url="/information/questionAttributeWordRelation/add"
          cover-url="/information/questionAttributeWordRelation/cover"
        />
        <UploadAndDownload
          api="/information/question/upload"
          :selection="data.selection"
          :refrensh-table="getList"
          url="/information/question/export"
          moduleName="批量上传问答"
          tip-text="500篇问答"
        />
        <a-button class="btn" v-if="useButton('xcloudplat_knowManage_qaList_publish')" type="danger" @click="publish">
          发布
        </a-button>
      </div>
    </template>
  </SearchForm>

  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getqaList"
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
        <span v-if="record.questionStatus === 'DISABLE'" @click="deleteRow({ text, record, index, column })">删除</span>
        <span @click="modifyStatus(record)">{{ record.questionStatus === 'DISABLE' ? '发布' : '取消发布' }}</span>
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
import { message, Modal } from 'ant-design-vue';
import { rule, columns } from './config';
import { jumpPage, useButton } from '@/utils/utils';
import DataTable from '@/components/page/DataTable.vue';
import SearchForm from '@/components/page/SearchForm.vue';
import UploadAndDownload from '../components/uploadAndDownload.vue';
import AttrwordGroupBtn from '../components/attrwordGroupBtn.vue';
import { getqaList, deleteReport, batchDel, updateQa } from '@/api/saasManage/kownManage/qaList';

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

const rowSelection = {
  onChange: (selectedRowKeys: any) => {
    console.log(selectedRowKeys)
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
  jumpPage(`/saasmanage/knowManage/qaList/detail?id=${rowData.record.id}`);
}

// 编辑
function editRow(rowData: any) {
  jumpPage(`/saasmanage/knowManage/qaList/addQa?id=${rowData.record.id}`);
}

// 修改发布状态
async function modifyStatus(record: any) {
  let isEnable = record.questionStatus === 'ENABLE';
  record.questionStatus = isEnable ? 'DISABLE' : 'ENABLE';
  let result = await updateQa(record);
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
  jumpPage('/saasmanage/knowManage/qaList/addQa');
}

// 批量删除
function batchDelete() {
  if (!data.selection.length) {
    message.warning('请选择要删除的问答');
    return;
  }
  Modal.confirm({
    title: '批量删除',
    content: '确认删除掉已选中的问答吗？删除后不可恢复。',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      let result = await batchDel({ ids: data.selection });
      result ? message.success('删除成功') : message.error('删除失败');
      getList();
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
.title {
  width: 160px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.btns {
  position: absolute;
  right: 30px;
  top: 16px;
  z-index: 1000;
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
