<template>
  <div v-if="imageUrl" class="icons">
    <div class="hoverbox"><delete-outlined @click="removeImg"></delete-outlined></div>
    <img :src="imageUrl" alt="avatar" class="zt-w100" />
  </div>
  <a-upload
    v-else
    v-model:file-list="fileList"
    name="file"
    accept="image/png, image/jpeg"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :action="uploadUrl"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <div v-if="imageUrl" class="">
      <img :src="imageUrl" alt="avatar" />
    </div>
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">Upload</div>
    </div>
  </a-upload>
</template>

<script lang="ts" setup>
import { watch, ref, type Ref } from 'vue';

import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useVModel } from '@vueuse/core';

const props = defineProps({
  // 文件大小限制 默认2MB
  fileSize: {
    default: 2,
    type: Number,
  },
  modelValue: {
    default: '',
    type: String,
  },
});

const uploadUrl = ref(import.meta.env.VITE_APP_API + '/file/oss/feign/upload2');
const fileList = ref([]);
const loading = ref<boolean>(false);

const emit = defineEmits(['update:modelValue']);

const imageUrl = useVModel(props, 'modelValue', emit);

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    const { response } = info.file;
    const { data } = response;
    imageUrl.value = data.fileUrl;
    loading.value = false;
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('上传失败请稍后重试！');
  }
};
const beforeUpload = (file: any) => {
  const isLt2M = file.size / 1024 / 1024 < props.fileSize;
  if (!isLt2M) {
    message.error(`请上传小于${props.fileSize}MB的图片！`);
  }
  return isLt2M;
};

const removeImg = () => {
  imageUrl.value = '';
};
</script>

<style lang="less" scoped>
.icons {
  position: relative;
  max-width: 100px;
  .hoverbox {
    display: none;
  }
  img {
    z-index: 90;
  }
}
.icons:hover {
  .hoverbox {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;
    opacity: 0.5;
    z-index: 100;
    span {
      top: 40%;
      left: 40%;
      cursor: pointer;
      position: absolute;
    }
  }
}
.avatar-uploader {
}
</style>
