<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    title="资料导入"
    width="700px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <div class="title-step">1、操作指引</div>
      <div class="content">
        <a-table bordered size="small" :pagination="false" :dataSource="[{}]">
          <a-table-column width="130px" title="使用说明">
            <div class="list-item">
              <p>1、选择表格文件</p>
              <p>2、核对数据对应关系，简单调整</p>
              <p>3、确认导入</p>
            </div>
          </a-table-column>
          <a-table-column width="200px" title="导入规则说明">
            <div class="list-item">
              <p>1.文件后缀名必须为：xls或xlsx（Excel标准格式），文件大小&lt;20M。</p>
              <p>2.数据为空的将不会进行导入</p>
              <p>3.模板中的表头名称不可更改，表头行不能删除</p>
              <p>4.表格信息中如果已有重复数据，系统将自动覆盖历史数据信息</p>
            </div>
          </a-table-column>
        </a-table>
      </div>
      <div class="title-step">2、下载模板</div>
      <div class="content">
        <div class="link-text">
          <span @click="downLoadTemplate()">
            <DownloadOutlined style="margin: 0 5px" />
            <span>商标注册工单小类信息导入模板</span>
          </span>
        </div>
      </div>
      <div class="title-step">3、上传表格数据</div>
      <div class="content">
        <a-upload accept=".xls,.xlsx" :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
          <a-button>
            <UploadOutlined />
            上传文件
          </a-button>
        </a-upload>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { dataImportModal } from '@/api/workOrder/intellectualProperty/trademark';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  btnText: {
    type: String,
    default: '按钮名称',
  },
  serviceInfo: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showModal = ref(false);
const fileList: any = ref([]);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        file: null,
      };
    });
  } else {
    fileList.value = [];
    ruleFormRef.value?.resetFields();
  }
});

const handleRemove = () => {
  fileList.value = [];
};

const beforeUpload = (file: any) => {
  fileList.value = [file];
  return false;
};

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  if (fileList.value.length === 0) {
    message.error('请上传文件');
    return false;
  }
  const formData = new FormData();
  formData.append('file', fileList.value[0]);
  formData.append('serviceId', props.serviceInfo.serviceId);
  formData.append('nodeCode', props.serviceInfo.nodeCode);
  formData.append('countryCode', props.serviceInfo.countryCode);
  dataImportModal(formData).then(() => {
    message.success('操作成功');
    showModal.value = false;
    emit('submit');
    //+++++++++
  });
};

//下载模版
const downLoadTemplate = () => {
  window.open('https://file.itaxs.com/dev/20220617/5057e3ede5ee440290f4b160b7af622b/商标注册工单小类信息导入模板.xlsx');
};
</script>

<style scoped lang="less">
.wrap {
  padding: 10px;
  max-height: 60vh;
  overflow-y: auto;
  .title-step {
    font-size: 15px;
    font-weight: bold;
    line-height: 36px;
  }
  .content {
    padding: 4px;
    margin-bottom: 10px;
    .list-item {
      p {
        font-size: 12px;
        line-height: 20px;
      }
    }
    .link-text {
      span {
        color: #1890ff;
        cursor: pointer;
      }
    }
  }
}
</style>
