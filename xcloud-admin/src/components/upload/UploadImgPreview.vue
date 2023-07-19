<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      name="file"
      list-type="picture-card"
      class="avatar-uploader"
      :accept="accept"
      :maxCount="maxCount"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      @change="handleChange"
      @preview="handlePreview"
    >
      <div v-if="fileList.length < maxCount && !isView">
        <plus-outlined />
        <div style="margin-top: 8px">上传图片</div>
      </div>
    </a-upload>
    <div style="display: none">
      <a-image-preview-group
        v-if="previewVisible"
        :preview="{ visible: previewVisible, onVisibleChange: (vis: any) => (previewVisible = vis),current: imgsCur }"
      >
        <a-image v-for="(imgView, imgIndex) in imgsArr" :key="imgIndex" :src="imgView.url" />
      </a-image-preview-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue';
import { message, Upload } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { useVModel } from '@vueuse/core';
import { PlusOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/jpg,image/bmp',
  },
  maxCount: {
    default: 1,
    type: Number,
  },
  fileSize: {
    default: 5,
    type: Number,
  },
  modelValue: {
    default: () => [],
    type: Array,
  },
  isView: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue', 'update']);
const uploadUrl = ref(import.meta.env.VITE_APP_API + '/file/oss/feign/upload2');
const fileList = ref<any>([]);
const imgsCur = ref(0);
const imgsArr = computed(() => {
  if (fileList.value?.length) {
    return fileList.value.map((item: any) => {
      if (item.url) {
        return {
          url: item.url,
        };
      } else {
        return {
          url: item.response.data.fileUrl,
        };
      }
    });
  } else {
    return null;
  }
});
onMounted(() => {
  fileList.value = props.modelValue;
});
const imgLoading = ref<boolean>(false);
const imageUrl = useVModel(props, 'modelValue', emit);
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
const handlePreview = async (file: any) => {
  console.log('indexindex', file);
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  const imgUrl = file?.response?.data?.fileUrl || file.url;
  if (imgsArr.value?.length) {
    const index = imgsArr.value.findIndex((item: any) => item.url === imgUrl);
    imgsCur.value = index > -1 ? index : 0;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    imgLoading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    const { response } = info.file;
    const { data } = response;
    imageUrl.value = data.fileUrl;
    imgLoading.value = false;
  }
  if (info.file.status === 'error') {
    imgLoading.value = false;
    message.error('upload error');
  }
  emit('update:modelValue', fileList.value);
  emit('update');
};

const beforeUpload = (file: any) => {
  const isLt2M = file.size / 1024 / 1024 < props.fileSize;
  if (!isLt2M) {
    message.error(`请上传小于${props.fileSize}MB的图片！`);
  }
  return isLt2M || Upload.LIST_IGNORE;
};
</script>
<style lang="less" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
