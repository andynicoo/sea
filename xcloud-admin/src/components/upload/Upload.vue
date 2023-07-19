<template>
  <a-upload
    v-model:file-list="fileList"
    :show-upload-list="false"
    :action="uploadUrl"
    :accept="accept"
    :maxCount="maxCount"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <slot>
      <a-button>
        <upload-outlined></upload-outlined>
        上传文件
      </a-button>
    </slot>
  </a-upload>
</template>

<script lang="ts" setup>
import { UploadOutlined } from '@ant-design/icons-vue';
import { message, type UploadChangeParam } from 'ant-design-vue';
import { ref } from 'vue';

const props = defineProps({
  accept: {
    type: String,
    default: null,
  },
  maxCount: {
    default: 1,
    type: Number,
  },
  fileSize: {
    default: 5,
    type: Number,
  },
});

const uploadUrl = ref(import.meta.env.VITE_APP_API + '/file/oss/upload2');
const fileList = ref([]);

const emit = defineEmits(['submitUrl']);

const handleChange = ({ file, fileList }: UploadChangeParam) => {
  if (file.status === 'done') {
    if (file.response.code === 0) {
      emit('submitUrl', file.response.data.fileUrl);
    } else {
      message.error(file.response.message);
    }
  }
};

const beforeUpload = (file: any) => {
  const isLt2M = file.size / 1024 / 1024 < props.fileSize;
  if (!isLt2M) {
    message.error(`请上传小于${props.fileSize}MB的图片！`);
    return false;
  }
  if (file.name.includes('+') || file.name.includes(',') || file.name.includes('%')) {
    message.error('您的文件名包含不能识别的 “+”、“,”、“%” 等特殊字符,请修改文件名后重新上传');
    return false;
  }
  return isLt2M;
};
</script>

<style lang="less" scoped></style>
