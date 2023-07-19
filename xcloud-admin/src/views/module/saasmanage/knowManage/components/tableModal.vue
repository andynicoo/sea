<template>
  <a-modal
    v-model:visible="props.visible"
    :title="props.title"
    @cancel="$emit('update:visible', !props.visible)"
    @ok="confrim"
  >
    <a-table
      :columns="props.columns"
      :data-source="data.dataList"
      bordered
      :row-selection="{ selectedRowKeys: data.selectedRowKeys, onChange: onChange }"
      rowKey="id"
      :pagination="data.pagination"
      @change="change"
    >
      <template #title>
        <div class="table-header">
          <label
            ><a-input v-model:value="data.filterStr"></a-input
            ><a-button class="search" type="primary" @click="getDataList">搜索</a-button></label
          >
          <a class="download" href="/标签上传模版.xls">下载模板</a>
          <a-upload
            v-if="props.buttonType === 'upload'"
            accept="xlsx"
            :showUploadList="false"
            :headers="{ Authorization: Authorization,enterpriseId: data.enterpriseId }"
            :action="`${data.baseUrl}${props.uploadApi}`"
            @change="keywordUpload"
          >
            <a-button class="btn" type="primary">{{ props.button }}</a-button>
          </a-upload>
          <a-button v-else class="btn" type="primary" @click="data.visible = true">{{ props.button }}</a-button>
        </div>
      </template>
      <template #footer>
        <div class="table-footer">
          <span>已选择：</span>
          <span>{{ data.selectionItem.join('、') }}</span>
        </div>
      </template>
    </a-table>
  </a-modal>
  <a-modal v-model:visible="data.visible" :width="400" title="新增属性词" @ok="addAttr">
    <div class="add-attr">
      <div>
        <label>
          <i>*</i>
          <span>属性词</span>
        </label>
        <a-textarea
          :class="{ active: data.isVer }"
          v-model:value="data.attributeWordName"
          class="textarea"
          @change="data.isVer = !data.attributeWordName"
        ></a-textarea>
      </div>
      <p>请使用英文逗号“,”分割，每个词将生成一条属性词</p>
      <p v-if="data.isVer" class="err">请输入属性词</p>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineEmits, reactive } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { getData } from '@/api/saasManage/kownManage/reportList';
import { addnewAttr } from '@/api/saasManage/kownManage/qaList';
import { useStore } from "@/stores/store";
const Authorization = "Bearer " + useStore().getToken;

interface props {
  visible: boolean;
  title?: string;
  button: string;
  uploadApi?: string;
  url: string;
  selectedFiled: string;
  buttonType: 'upload' | 'button';
  columns: Array<any>;
}

const data = reactive({
  baseUrl: import.meta.env.VITE_APP_API,
  dataList: [],
  visible: false,
  isVer: false,
  attributeWordName: '',
  enterpriseId: '',
  selectionItem: [],
  selectedRowKeys: [],
  selecteddArr: [],
  filterStr: '',
  pagination: {
    current: 1,
    total: 0,
    pageSize: 10,
  },
});

data.enterpriseId=localStorage.enterpriseId

const props = withDefaults(defineProps<props>(), {
  visible: false,
  title: '设置属性词',
  button: '新增属性词',
  buttonType: 'button',
  selectedFiled: 'attributeWordName',
  url: '/information/attributeWord/getPage',
  columns: () => {
    return [{ title: '属性词', dataIndex: 'attributeWordName', align: 'center' }];
  },
});

const emit = defineEmits(['update:visible', 'selectedRow']);

// 模态框确认事件
function confrim() {
  emit('update:visible', !props.visible);
  emit('selectedRow', data.selectionItem, data.selecteddArr);
  data.selecteddArr = [];
  data.selectionItem = [];
  data.selectedRowKeys = [];
}

// 表格选择事件
function onChange(selectedRowKeys: [], selectedRow: []) {
  console.log(selectedRowKeys);
  data.selecteddArr = [];
  data.selectionItem = [];
  data.selectedRowKeys = [];
  data.selectedRowKeys = selectedRowKeys;
  data.selecteddArr = selectedRow;
  selectedRow.forEach((item: any) => {
    data.selectionItem.push(item[props.selectedFiled] as never);
  });
}

function change(pagination: { current: number; pageSize: number; total: number }) {
  data.pagination = pagination;
  data.filterStr = '';
  getDataList();
}

// 上传事件
function keywordUpload(info: any) {
  if (info?.file?.response?.code === 0) {
    Modal.confirm({
      title: '提示',
      content: `上传成功！`,
      okText: '确认',
    });
    getDataList();
  }
  if (info?.file?.response && info.file.response.code !== 0) {
    Modal.confirm({
      title: '提示',
      content: `上传失败${info.file.response?.message}`,
      okText: '确认',
    });
  }
}

// 新增属性词
async function addAttr() {
  if (!data.attributeWordName) {
    data.isVer = true;
    return;
  }
  data.isVer = false;
  let result: any = await addnewAttr({ attributeWordName: data.attributeWordName });
  if (result === true) {
    message.success('新增属性词成功');
    data.visible = false;
    data.filterStr = '';
    getDataList();
  }
}

// 获取表格数据
async function getDataList() {
  let params = {
    attributeWordName: data.filterStr,
    current: data.pagination.current,
    labelName: data.filterStr,
    size: data.pagination.pageSize,
  };
  let result: any = await getData(props.url, params);
  data.pagination.total = result.total || 0;
  data.dataList = result.records;
}
getDataList();
</script>

<style scoped lang="less">
.table-header {
  display: flex;
  justify-content: space-between;
  > label {
    flex: 1;
    display: flex;
    margin-right: 20px;
    > .search {
      flex-basis: 60px;
      margin-left: 15px;
    }
  }
  > .btn {
    flex-basis: 50px;
  }
}
.table-footer {
  display: flex;
  justify-content: flex-start;
  > span {
    flex: 1;
  }
  > span:nth-child(1) {
    max-width: 60px;
    width: 60px !important;
  }
}
.download {
  width: 80px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  border: 1px solid #1890ff;
  color: #1890ff;
  border-radius: 2px;
  margin-right: 10px;
  font-size: 14px;
  &:hover {
    color: #52aafd;
    border-color: #52aafd;
  }
}
.add-attr {
  text-align: right;
  > div {
    display: flex;
    > label {
      flex-basis: 70px;
      text-align: left;
      > i {
        display: inline-block;
        color: red;
        margin-right: 4px;
      }
    }
    > .textarea {
      height: 80px;
      &.active {
        border-color: red;
      }
    }
  }
  > p {
    width: 294px;
    display: inline-block;
    margin-top: 10px;
    color: #333;
    font-size: 12px;
    text-align: left;
  }
  > .err {
    color: red;
    margin-top: 0;
  }
}
:deep(.ant-pagination) {
  display: flex;
  flex-wrap: nowrap !important;
}
</style>
