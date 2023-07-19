<template>
  <a-modal title="批量导入" width="1000px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <div class="upload-wrap">
        <p class="text">上传文件</p>
        <div class="upload-content">
          <a-upload-dragger
            v-model:fileList="fileInfo.fileList"
            accept=".xls,.xlsx"
            :action="fileInfo.actionUrl"
            :maxCount="1"
            @change="handleChange"
          >
            <div class="text-tips">支持扩展名：xls或xlsx</div>
          </a-upload-dragger>
        </div>

        <div class="file-name">
          <span :href="fileInfo.fileUrl === '' ? 'javascript:void(0)' : fileInfo.fileUrl">
            {{ fileInfo.origFileName || '请上传文件...' }}
          </span>
          <a-button v-if="fileInfo.fileUrl" type="link" @click="deleteFIle()"> 删除 </a-button>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button @click="showModal = false">取消</a-button>
      <a-button type="primary" :disabled="fileInfo.fileUrl === ''" @click="submit()"> 确定 </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { addDataBatchTask } from '@/api/customerManage/clueCenter';

defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const showModal = ref(false);
const fileInfo = reactive({
  actionUrl: import.meta.env.VITE_APP_API + '/file/oss/upload',
  fileList: [],
  origFileName: '',
  fileUrl: '',
});

watch(showModal, newVal => {
  if (newVal) {
    deleteFIle();
  }
});

//提交
const submit = () => {
  addDataBatchTask({
    path: fileInfo.fileUrl,
  }).then((res: any) => {
    message.success('操作成功');
    deleteFIle();
  });
};

//上传
const handleChange = (file: any) => {
  if (file.file.status == 'done') {
    const res = file.file.response;
    if (res.code == 0) {
      fileInfo.fileList = [];
      fileInfo.origFileName = res.data.origFileName || '';
      fileInfo.fileUrl = res.data.fileUrl || '';
    } else {
      message.error('上传失败');
    }
  }
};

//删除上传文件
const deleteFIle = () => {
  fileInfo.fileList = [];
  fileInfo.origFileName = '';
  fileInfo.fileUrl = '';
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 20px;
  .upload-wrap {
    margin-top: 20px;
    .text {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .upload-content {
      width: 500px;
      height: 80px;
      margin-bottom: 10px;
      overflow: hidden;
      .text-tips {
        line-height: 40px;
      }
    }
    .file-name {
      font-size: 16px;
    }
  }
}
</style>
