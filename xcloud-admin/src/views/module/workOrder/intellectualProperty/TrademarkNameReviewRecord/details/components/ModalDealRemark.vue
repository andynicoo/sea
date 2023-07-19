<template>
  <a-modal v-model:visible="visible" title="添加备注" @cancel="close" width="900px">
    <a-form ref="formRef" :model="formData" :rules="rules">
      <a-form-item label="备注类型" name="remarkType" :labelCol="{ span: 2.5 }" :colon="false">
        <a-select v-model:value="formData.remarkType" :options="typeOptions" style="width: 30%"></a-select>
      </a-form-item>
      <a-form-item label="添加备注" name="remark" :labelCol="{ span: 24 }">
        <a-textarea v-model:value="formData.remark" :maxlength="300" :showCount="true"></a-textarea>
      </a-form-item>
      <a-row>
        <a-col class="upload-tips" :span="24">上传图片<span>支持JPG、JPEG、BMP、PNG，最大不超过5M</span></a-col>
        <UploadImgPreview
          v-model="formData.remarkUrl"
          accept="image/jpeg,image/png,image/jpg,image/bmp"
          :maxCount="10"
          :fileSize="5"
        ></UploadImgPreview>
      </a-row>
    </a-form>
    <template #footer>
      <a-button @click="close">取消</a-button>
      <a-button type="primary" @click="onOk" :loading="loading">提交</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, onMounted, computed } from 'vue';
import type { FormInstance } from 'ant-design-vue/lib/form/Form';
import type { Rule } from 'ant-design-vue/lib/form/interface';
import UploadImgPreview from '@/components/upload/UploadImgPreview.vue';
import {
  addTrademarkRemark,
  updateTrademarkRemark,
  delTrademarkRemark,
} from '@/api/workOrder/intellectualProperty/trademark';
import { isEmpty } from 'lodash-es';

interface Emits {
  (e: 'close'): void;
  (e: 'update'): void;
}
const emit = defineEmits<Emits>();
const props = defineProps({
  item: {
    type: Object,
    default: () => null,
  },
});
const isEdit = computed(() => !isEmpty(props.item));
const id = inject('id');
const visible = ref(true);
const formData = reactive<any>({
  remarkType: '',
  remark: '',
  remarkUrl: [],
});
onMounted(() => {
  if (props.item) {
    formData.remark = props.item.remark;
    formData.remarkType = props.item.remarkType;
    const imgs = props.item.remarkUrl;
    if (imgs) {
      imgs.split(',').map((item: any) => {
        formData.remarkUrl.push({ url: item });
      });
    }
  }
});
const typeOptions = reactive([
  {
    value: 'Customer_Communication_Record',
    label: '客户沟通记录',
  },
  {
    value: 'Internal_Collaboration',
    label: '内部协作',
  },
]);
const formRef = ref<FormInstance>();
const rules: Record<string, Rule[]> = {
  remarkType: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  remark: [{ required: true, message: '备注不能为空', trigger: 'change' }],
};

const useFn = (params: any) => {
  return isEdit.value ? updateTrademarkRemark(params) : addTrademarkRemark(params);
};
const loading = ref(false);
const close = () => {
  emit('close');
};
const onOk = async () => {
  await formRef.value?.validate();
  loading.value = true;
  const imgs = formData.remarkUrl.map((item: any) => {
    if (item.url) {
      return item.url;
    } else {
      return item.response.data.fileUrl;
    }
  });
  const paramsCom = {
    remarkType: formData.remarkType,
    remark: formData.remark,
    remarkUrl: imgs.join(','),
  };
  const paramsEdit = {
    id: props.item.id,
    ...paramsCom,
  };
  const paramsAdd = {
    recordId: id,
    ...paramsCom,
  };
  const useParams = isEdit.value ? paramsEdit : paramsAdd;
  try {
    await useFn(useParams);
    emit('update');
  } finally {
    loading.value = false;
  }
};
</script>
<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.type-panel {
  margin-bottom: 20px;
  .label {
    font-size: 12px;
  }
}
.upload-tips {
  margin-bottom: 10px;
  span {
    font-size: 12px;
    color: #999;
    margin-left: 10px;
  }
}
</style>
