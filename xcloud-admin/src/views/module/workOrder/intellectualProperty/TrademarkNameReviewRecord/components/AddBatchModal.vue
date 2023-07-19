<template>
  <slot>
    <a-button
      type="primary"
      @click="openModal"
      v-if="useButton('workOrder_intellectualProperty_trademarkRecord_add_batch')"
      >+批量核名</a-button
    >
  </slot>

  <!-- 新建 弹窗 -->
  <a-modal
    title="批量导入"
    width="540px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="handleOk"
  >
    <div class="wrap">
      <p>
        点击下面的按钮上传文件，可以批量导入核名申请（<a
          @click="$emit('download')"
          v-if="useButton('workOrder_intellectualProperty_trademarkRecord_templete')"
          >批量上传核名记录模版</a
        >）
      </p>
      <a-upload
        v-model:file-list="fileInfo.fileList"
        name="file"
        :action="fileInfo.actionUrl"
        :beforeUpload="beforeUpload"
        accept=".xls,.xlsx"
        @change="handleChange"
      >
        <a-button>
          <upload-outlined />
          {{ fileInfo.fileList.length ? '重新上传' : '上传文件' }}
        </a-button>
      </a-upload>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { useButton } from '@/utils/utils';
import { reactive, ref, watch, nextTick } from 'vue';
import { message, type UploadChangeParam } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import { handleTrademarkRecordBatchCreate } from '@/api/workOrder/intellectualProperty/trademark';

const emit = defineEmits(['submit']);
const showModal = ref(false);
const fileInfo = reactive({
  actionUrl: import.meta.env.VITE_APP_API + '/file/oss/upload',
  fileList: [],
  file: [],
});

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      fileInfo.fileList = [];
    });
  }
});

//打开模态框
const openModal = () => {
  showModal.value = true;
};

//上传文件前
const beforeUpload = (file: any) => {
  fileInfo.fileList = [];
  const suffix = file.name.split('.')[1];
  if (!['xls', 'xlsx'].includes(suffix)) {
    message.error('请上传.xls,xlsx表格文件');
    return false;
  }

  const limit = file.size / 1024 / 1024 < 2;
  if (!limit) {
    message.error('请上传小于2MB的文件');
    return false;
  }
  fileInfo.file = [file];
  return limit;
};

// 上传
const handleChange = ({ file }: UploadChangeParam) => {
  if (!file.status) {
    fileInfo.fileList = [];
  }
  if (file.status === 'done') {
    if (file.response.code === 0) {
      message.success('上传成功');
    }
  }
};
// 提交
const handleOk = () => {
  if (fileInfo.fileList.length === 0) {
    message.error('请上传文件');
    return false;
  }
  const formData = new FormData();
  formData.append('file', fileInfo.file[0]);
  handleTrademarkRecordBatchCreate(formData).then(() => {
    message.success('操作成功');
    showModal.value = false;
    emit('submit');
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 10px 0 50px;
  p {
    margin-bottom: 10px;
  }
}
</style>
