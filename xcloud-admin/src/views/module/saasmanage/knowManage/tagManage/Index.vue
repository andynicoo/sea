<template>
  <SearchForm class="search-form" ref="form" :rule="rule" @submitParams="submitParams">
    <template #bottomSlot>
      <div class="btns">
        <AttrwordGroupBtn :selected="data.selection" tip="请选择标签" @comfirm="getList" />
        <UploadAndDownload
          api="/information/label/upload"
          url="/information/label/export"
          :selection="data.selection"
          :refrensh-table="getList"
          moduleName="批量上传标签"
          tip-text="10000个标签"
        />
      </div>
    </template>
  </SearchForm>

  <DataTable
    ref="dataTable"
    :columns="columns"
    :methodName="getTagList"
    :rowSelection="rowSelection"
    :page-key-str="{ currentKey: 'current', pageSizeKey: 'size' }"
    @edit="editTag"
    @setSeo="editSeoInfo"
    @deleteRow="deleteRow"
  >
    <template #bodyCell="{ text, record, index, column }">
      <a-tooltip v-if="column.dataIndex === 'seoDescribe'" :title="text">
        <div class="title">{{ text }}</div>
      </a-tooltip>
      <div v-if="column.key === 'opration'">
        <span class="operation-btn" @click="editTag({ text, record, index, column })">编辑</span>
        <span class="operation-btn" @click="deleteRow({ text, record, index, column })">删除</span>
        <span class="operation-btn" @click="editSeoInfo({ text, record, index, column })">设置seo</span>
      </div>
    </template>
  </DataTable>
  <div class="footer">
    <a-button type="primary" size="small" @click="batchDelete">删除</a-button>
    <span>选中 {{ data.selection.length }} 条数</span>
  </div>
  <a-modal class="tag-modal" v-model:visible="data.tagVisible" :width="400" title="编辑标签" @ok="confrimEditTag">
    <div class="content">
      <span>标签名：</span>
      <a-input v-model:value="data.editItem.labelName"></a-input>
    </div>
  </a-modal>
  <a-modal class="seo-modal" v-model:visible="data.seoVisible" :width="600" title="编辑标签" @ok="confrimSeo">
    <div class="content">
      <label><span>seo标题：</span> <a-input v-model:value="data.editItem.seoTitle"></a-input></label>
      <label><span>关键词：</span> <a-input v-model:value="data.editItem.keyword"></a-input></label>
      <label><span>描述：</span> <a-textarea :rows="8" v-model:value="data.editItem.seoDescribe"></a-textarea> </label>
    </div>
  </a-modal>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { ref, reactive, type Ref, computed, unref } from 'vue';
import SearchForm from '@/components/page/SearchForm.vue';
import DataTable from '@/components/page/DataTable.vue';
import { rule, columns } from './config';
import { getTagList, deleteReport, batchDel, editTagName, setSeo } from '@/api/saasManage/kownManage/tagManage';
import { message, Modal } from 'ant-design-vue';
import UploadAndDownload from '../components/uploadAndDownload.vue';
import AttrwordGroupBtn from '../components/attrwordGroupBtn.vue';

const form = ref(null);
const dataTable: Ref = ref(null);
const data: any = reactive({
  params: {},
  record: {},
  selection: [],
  selectedRowKeys: [],
  editItem: {},
  tagVisible: false,
  seoVisible: false,
  isSwitchPage: false,
});

//点击搜索
function submitParams(formData: any) {
  const keys = Object.keys(formData);
  keys.forEach(key => {
    if (formData.createTimeStart && key === 'createTimeStart') {
      let start = formData[key][0].split(' ')[0];
      let end = formData[key][1].split(' ')[0];
      formData.endTime = `${end} 23:59:59`;
      formData.startTime = `${start} 00:00:00`;
    }
    if (!formData[key]) {
      formData[key] = undefined;
    }
  });
  data.params = formData;
  getList();
}

const rowSelection = {
  onChange(selectedRowKeys: [], selectedRow: []) {
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

// 编辑
function editTag(rowData: any) {
  data.tagVisible = true;
  data.editItem = JSON.parse(JSON.stringify(rowData.record));
}

//设置seo
function editSeoInfo(rowData: any) {
  data.seoVisible = true;
  data.editItem = JSON.parse(JSON.stringify(rowData.record));
}

// 编辑标签确认
async function confrimEditTag() {
  let result: any = await editTagName({
    id: data.editItem.id,
    labelName: data.editItem.labelName,
  });
  if (result) {
    message.success('编辑成功');
    data.tagVisible = false;
    getList();
  } else {
    message.error('编辑失败');
    data.tagVisible = false;
  }
}

// 确认seo
async function confrimSeo() {
  let result: any = await setSeo({
    id: data.editItem.id,
    seoTitle: data.editItem.seoTitle,
    seoDescribe: data.editItem.seoDescribe,
    keyword: data.editItem.keyword,
  });
  if (result) {
    message.success('编辑成功');
    data.seoVisible = false;
    getList();
  } else {
    message.error('编辑失败');
    data.seoVisible = false;
  }
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
.tag-modal {
  .content {
    display: flex;
    align-items: center;
    > span {
      flex-basis: 70px;
    }
  }
}
.seo-modal {
  .content {
    > label {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      > span {
        flex-basis: 80px;
        text-align: right;
      }
    }
    > label:last-child {
      align-items: flex-start;
    }
  }
}
</style>
<style>
.ivu-select-dropdown {
  z-index: 10000 !important;
}
</style>
