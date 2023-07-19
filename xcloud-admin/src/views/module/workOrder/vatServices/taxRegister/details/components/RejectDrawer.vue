<template>
  <a-drawer
    title="驳回原因"
    placement="bottom"
    :visible="showDrawer"
    :maskClosable="false"
    :keyboard="false"
    :closable="false"
    height="80vh"
    :bodyStyle="{ padding: '10px 24px' }"
  >
    <template #extra>
      <CloseOutlined class="icon-close" @click="showDrawer = false" />
    </template>
    <div class="content-wrap">
      <div class="reject-list">
        <div class="key-select">
          <a-select
            ref="select"
            v-model:value="formModal.columnKey"
            placeholder="请选择驳回字段"
            style="width: 220px"
            @change="changeColumnKey()"
          >
            <a-select-option v-for="(item, index) of data.keyValueSelect" :key="index" :value="item.columnKey">
              {{ item.columnName }}
            </a-select-option>
          </a-select>
          <span class="btn-add" @click="addRejectTempFun()">增加</span>
        </div>
        <div class="text-list">
          <div class="li" v-for="(item, index) of data.columnList" :key="index" @click="chooseTemplate(item.content)">
            {{ index + 1 }}、 {{ item.content || '-' }}
          </div>
        </div>
      </div>
      <div class="reject-form">
        <div class="tips-text">
          <span>您好，你的</span>
          <span class="color-blue">{{ formModal.columnName }}</span>
          <span>有以下信息建议修改：</span>
          <span class="clear-btn" @click="formModal.rejects = ''">清空</span>
        </div>
        <div class="form-wrap">
          <a-textarea
            class="input-textarea"
            v-model:value="formModal.rejects"
            placeholder="请在左边选择驳回原因，也可以粘贴截图在此处。"
            :rows="13"
            @paste="pasteFun($event)"
          />
          <span class="upload-btn">
            <Upload accept=".jpg,.png" @submitUrl="submitUrl">
              <span style="color: #3a7fff; cursor: pointer">上传附件</span>
            </Upload>
          </span>
        </div>
        <div class="img-list">
          <div class="li" v-for="(li, index) of formModal.annexs" :key="index">
            <img :src="li" />
            <CloseCircleFilled class="icon-close" @click="removeImg(index)" />
          </div>
        </div>
        <div class="opt-btn">
          <a-space :size="24">
            <a-button type="primary" ghost @click="showDrawer = false"> 取 消 </a-button>
            <a-button type="primary" @click="submit()"> 确 定 </a-button>
          </a-space>
        </div>
      </div>
    </div>
  </a-drawer>
  <AddRejectTempModal
    ref="addRejectTempModal"
    :moduleKey="keyStr"
    :columnKey="formModal.columnKey"
    :columnName="formModal.columnName"
    @submit="getColumnListFun()"
  />
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch, type Ref } from 'vue';
import { CloseOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
import router from '@/router';
import { message } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { selecterKeyStrList, getColumnList, editDetailsStatusInfo } from '@/api/workOrder/vatServices/taxRegister';
import AddRejectTempModal from './AddRejectTempModal.vue';
import { importFileApi } from '@/api/base/basicsData';

const props = defineProps({
  statusList: {
    type: Object,
    default: () => null,
  },
  keyStr: {
    default: 'companyInfo',
    type: String,
  },
});

const emit = defineEmits(['submit']);
const showDrawer = ref(false);
const formModal: any = ref({});
const data: any = reactive({
  keyValueSelect: [],
  columnList: [],
});

watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        audit: 2,
        columnKey: null, //驳回字段
        columnName: '', //字段名称
        rejects: '', //驳回原因
        annexs: [], //驳回附件图片
      };
      data.keyValueSelect = [];
      data.columnList = [];
      if (['shopConsoleScreenshot', 'storageAddressImg', 'storageContract'].includes(props.keyStr)) {
        if (props.keyStr === 'shopConsoleScreenshot') {
          data.keyValueSelect = [
            {
              columnKey: 'shopConsoleScreenshot',
              columnName: '店铺信息截图',
            },
          ];
        } else if (props.keyStr === 'storageAddressImg') {
          data.keyValueSelect = [
            {
              columnKey: 'storageAddressImg',
              columnName: '仓储地址截图',
            },
          ];
        } else if (props.keyStr === 'storageContract') {
          data.keyValueSelect = [
            {
              columnKey: 'storageContract',
              columnName: '仓储合同',
            },
          ];
        }
        formModal.value.columnKey = data.keyValueSelect[0].columnKey;
        changeColumnKey();
      } else {
        selecterKeyStrListFun();
      }
    });
  }
});

//驳回提交确认
const submit = () => {
  if (!formModal.value.rejects) {
    message.error('请输入驳回原因');
    return false;
  }
  const params = JSON.parse(JSON.stringify(props.statusList));
  let keyStr = props.keyStr;
  if (['shopConsoleScreenshot', 'storageAddressImg', 'storageContract'].includes(props.keyStr)) {
    keyStr = 'fileExamine';
  }
  if (params[keyStr] && params[keyStr].columns) {
    params[keyStr].audit = 2;
    const index = params[keyStr].columns.findIndex(
      (v: { columnKey: string }) => v.columnKey === formModal.value.columnKey
    );
    if (index === -1) {
      params[keyStr].columns.push(formModal.value);
    } else {
      params[keyStr].columns.splice(index, 1, formModal.value);
    }
  }
  editDetailsStatusInfo(
    {
      id: router.currentRoute.value.query.id,
    },
    params
  ).then(() => {
    emit('submit');
    showDrawer.value = false;
    message.success('操作成功');
  });
};

//选择模版
const chooseTemplate = (str: string) => {
  if (formModal.value.rejects) {
    formModal.value.rejects += '\n' + str;
  } else {
    formModal.value.rejects = str;
  }
};

//改变模版字段
const changeColumnKey = () => {
  const curObj = data.keyValueSelect.find((v: { columnKey: string }) => v.columnKey === formModal.value.columnKey);
  formModal.value.columnName = curObj ? curObj.columnName : '';

  const params = JSON.parse(JSON.stringify(props.statusList));
  let keyStr = props.keyStr;
  if (['shopConsoleScreenshot', 'storageAddressImg', 'storageContract'].includes(props.keyStr)) {
    keyStr = 'fileExamine';
  }
  if (params[keyStr] && params[keyStr].columns) {
    const obj = params[keyStr].columns.find((v: { columnKey: string }) => v.columnKey === formModal.value.columnKey);
    formModal.value.rejects = obj ? obj.rejects : '';
    formModal.value.annexs = obj ? obj.annexs : [];
  }
  getColumnListFun();
};

//获取下拉字段
const selecterKeyStrListFun = () => {
  selecterKeyStrList({
    keyStr: props.keyStr,
  }).then((res: any) => {
    data.keyValueSelect = res || [];
    if (data.keyValueSelect.length > 0) {
      formModal.value.columnKey = data.keyValueSelect[0].columnKey;
      changeColumnKey();
    }
  });
};

//获取模板-根据字段key
const getColumnListFun = () => {
  getColumnList({
    column: formModal.value.columnKey,
  }).then((res: any) => {
    data.columnList = res || [];
  });
};

//上传文件
const submitUrl = (url: string) => {
  formModal.value.annexs.push(url);
};

//删除图片
const removeImg = (index: number) => {
  formModal.value.annexs.splice(index, 1);
};

//增加模版
const addRejectTempModal: Ref = ref(null);
const addRejectTempFun = () => {
  addRejectTempModal.value.showModal = true;
};

//粘贴事件
const pasteFun = (event: any) => {
  const clipboardData = event.clipboardData || (window as any).clipboardData;
  const items = clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf('image') !== -1) {
      const formData = new FormData();
      formData.append('file', item.getAsFile());
      importFileApi(formData).then(res => {
        if (res && res.fileUrl) {
          formModal.value.annexs.push(res.fileUrl);
        }
      });
    }
  }
};

defineExpose({ showDrawer });
</script>

<style scoped lang="less">
.icon-close {
  font-size: 16px;
  cursor: pointer;
}
.content-wrap {
  display: flex;
  height: 100%;
  .reject-list {
    flex: 1;
    border-right: 1px solid #ddd;
    .key-select {
      margin-bottom: 15px;
      .btn-add {
        float: right;
        font-size: 14px;
        color: #3a7fff;
        line-height: 32px;
        margin-right: 20px;
        font-weight: 400;
        cursor: pointer;
      }
    }
    .text-list {
      height: calc(100% - 50px);
      overflow-y: auto;
      padding-right: 15px;
      margin-right: 15px;
      .li {
        font-size: 14px;
        color: #333;
        line-height: 20px;
        margin-bottom: 15px;
        cursor: pointer;
      }
      .li:hover {
        color: #3a7fff;
      }
    }
  }
  .reject-form {
    flex: 1;
    padding-left: 24px;
    padding-right: 10px;
    position: relative;
    .tips-text {
      line-height: 30px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      overflow: hidden;
      margin-bottom: 10px;
      .color-blue {
        color: #1890ff;
        padding: 0 4px;
      }
      .clear-btn {
        color: #1890ff;
        cursor: pointer;
        float: right;
      }
    }
    .form-wrap {
      position: relative;
      margin-bottom: 10px;
      .input-textarea {
        padding-bottom: 40px;
      }
      .upload-btn {
        position: absolute;
        bottom: 1px;
        left: 1px;
        right: 1px;
        color: #1890ff;
        background-color: #fff;
        padding: 10px 15px;
      }
    }
    .img-list {
      overflow: hidden;
      .li {
        position: relative;
        width: 100px;
        height: 100px;
        border: 1px solid #ccc;
        overflow: hidden;
        border-radius: 4px;
        line-height: 100px;
        float: left;
        margin-right: 10px;
        img {
          max-width: 100%;
          max-height: 100%;
        }
        .icon-close {
          position: absolute;
          right: 9px;
          top: 12px;
          cursor: pointer;
          font-size: 20px;
          opacity: 0.6;
        }
      }
    }
    .opt-btn {
      position: absolute;
      bottom: 15px;
      right: 0;
      left: 0;
      text-align: right;
    }
  }
}
</style>
