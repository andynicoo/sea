<template>
  <div class="upload" :class="{ disabled: true }">
    <label>
      <span>批量上传/下载</span>
    </label>
    <ul>
      <li>
        <a-upload
          accept="xlsx"
          :beforeUpload="beforeUpload"
          :showUploadList="false"
          :action="baseUrl + props.api"
          @change="change"
          :headers="{ Authorization: Authorization,enterpriseId: data.enterpriseId }"
        >
          <span>批量上传</span>
        </a-upload>
      </li>
      <li @click="downloadReport">批量下载</li>
      <li><a :href="data.baseUrl + props.moduleName + '.xlsx'">模板下载</a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { message, Modal } from "ant-design-vue";
import { useStore } from "@/stores/store";
import { download } from "@/api/saasManage/kownManage/reportList";

const data = reactive({
  baseUrl: import.meta.env.VITE_APP_BASEURL,
  enterpriseId:40
});

data.enterpriseId=localStorage.enterpriseId

const props = defineProps({
  api: {
    type: String,
    require: true,
  },
  selection: {
    type: Array,
    default() {
      return [];
    },
  },
  moduleName: {
    type: String,
    default: "模板.xlsx",
  },
  refrenshTable: {
    type: Function,
    default() {},
  },
  url: {
    type: String,
    default: "/information/report/export",
  },
  tipText:{
    type:String,
    default:'500篇报告'
  }
});

const baseUrl = import.meta.env.VITE_APP_API;
const Authorization = "Bearer " + useStore().getToken;

function change(info: any) {
  if (info?.file?.response?.code === 0) {
    Modal.confirm({
      title: "提示",
      content: `上传成功！`,
      okText: "确认",
    });
    props.refrenshTable()
  }
  if (info?.file?.response && info.file.response.code !== 0) {
    Modal.confirm({
      title: "提示",
      content: `上传失败${info.file.response?.message}`,
      okText: "确认",
    });
  }
}

function beforeUpload() {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: "提示",
      content: `当前主体为${localStorage.enterpriseName}，确定上传吗？`,
      okText: "确认",
      cancelText: "取消",
      async onOk() {
        resolve(true);
      },
      onCancel() {
        resolve(false);
      },
    });
  });
}

function downloadReport() {
  if (props.selection.length > 500) {
    message.success("一次最多下载"+props.tipText);
    return;
  }
  if (props.selection.length) {
    downloadFile(props.selection);
  }
  if (!props.selection.length) {
    Modal.confirm({
      title: "提示",
      content: `当前未选中任何${props.moduleName.slice(
        -2
      )}，是否直接下载当前列表中前${props.tipText}`,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        downloadFile(props.selection);
      },
    });
  }
}
async function downloadFile(selction: any[]) {
  let result: any = await download(props.url, { ids: selction });
  let a = document.createElement("a");
  const blob = new Blob([result], { type: "application/vnd.ms-excel" });
  a.href = URL.createObjectURL(blob);
  a.download = props.moduleName as any;
  a.click();
  props.refrenshTable();
}
</script>

<style scoped lang="less">
.upload {
  font-size: 12px;
  color: #fff;
  background: #b8b8b8;
  margin-right: 10px;
  border-radius: 2px;
  height: auto;
  padding: 0;
  cursor: no-drop;
  display: inline-block;
  position: relative;
  &.disabled {
    background: #1890ff;
    cursor: pointer;
    &:hover {
      > ul {
        display: block;
      }
    }
    > label {
      cursor: pointer;
      > i,
      span {
        cursor: pointer;
      }
    }
  }
  label {
    display: block;
    height: 32px;
    padding: 0 15px;
    line-height: 34px;
    cursor: no-drop;
    > i {
      cursor: no-drop;
    }
    > span {
      line-height: 32px;
      cursor: no-drop;
    }
  }
  > ul {
    display: none;
    width: 107px;
    position: absolute;
    top: 33px;
    left: 0;
    background: #fff;
    text-align: center;
    border: 1px solid #d8d8d8;
    list-style: none;
    padding: 0;
    margin: 0;
    > li {
      line-height: 30px;
      border-bottom: 1px solid #d8d8d8;
      color: #333;
      cursor: pointer;
      margin: 0;
      padding: 0;
      &:hover {
        background: #d8d8d8;
      }
      :deep(.ant-upload) {
        > span {
          font-size: 12px;
        }
      }
    }
    > li:last-child {
      border: none;
      a {
        color: #333;
      }
    }
  }
}
</style>
