<template>
  <a-modal
    title="上传海报"
    width="800px"
    okText="保存"
    v-model:visible="visible"
    :maskClosable="false"
    :keyboard="false"
    :destroyOnClose="true"
    :confirmLoading="sending"
    @ok="submit"
    @cancel="resetForm"
  >
    <a-spin :spinning="spinning">
      <a-form
        :model="formData"
        :rules="rules"
        autocomplete="off"
        name="base"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        @validate="handleValidate"
        :labelCol="{ span: 3 }"
        ref="formRef"
      >
        <a-form-item label="海报分类" name="type">
          <a-select v-model:value="formData.type" class="zt-w200">
            <a-select-option v-for="opt in Options" :value="opt.value" :key="opt.value">{{
              opt.label
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="海报名称" name="drpTitle">
          <a-input v-model:value="formData.drpTitle" class="zt-w200" />
        </a-form-item>
        <a-form-item label="上传海报" name="drpImage">
          <UploadBox v-model="formData.drpImage" />
        </a-form-item>
        <a-form-item label="启用/禁用" name="status">
          <a-switch v-model:checked="formData.status" checkedValue="ENABLED" unCheckedValue="DISABLED"></a-switch>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, type Ref, reactive, onMounted, watch } from 'vue';
import { getAllCategory } from '@/api/base/basicsData';
import { useStore } from '@/stores/store';
import type { Rule } from 'ant-design-vue/es/form';
import { savePoster, drpPosterArticleDetail } from '@/api/customerManage/distribution';
import type { Detail } from '@/types/distribution';
import { message } from 'ant-design-vue';
import UploadBox from '@/components/upload/UploadBox.vue';
import type { Poster } from '@/types/distribution';

const formRef = ref<any>();

interface Emits {
  (e: 'submit'): void;
}
interface Props {
  id?: string;
}
const Options = reactive([
  { value: 'INVITATION_POSTER', label: '邀请海报' },
  { value: 'PROMOTION_POSTER', label: '获客海报' },
]);
const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const {
  enterprise: {
    record: { id: enterpriseId },
  },
} = useStore();
interface FormData {
  drpTitle: string;
  drpImage: string;
  type: Poster;
  /** 状态 启用：ENABLED 禁用 DISABLED */
  status: 'ENABLED' | 'DISABLED';
  enterpriseId: number;
}
const spinning = ref<boolean>(false);
const categoryList = ref<{ categoryName: string; id: string }[]>([]);
const formData = reactive<FormData>({
  drpTitle: '',
  drpImage: '',
  type: 'INVITATION_POSTER', // 默认邀请海报
  status: 'ENABLED', // 默认开启
  enterpriseId: +enterpriseId,
});

const visible = ref<boolean>(false);
const sending = ref<boolean>(false);
// 详情
const getDetail = async (id: string) => {
  const res: any = await drpPosterArticleDetail(id);
  formData.drpTitle = res.drpTitle;
  formData.type = res.type as Poster;
  formData.status = res.status;
  formData.drpImage = res.drpImage;
  formData.enterpriseId = res.enterpriseId;
};
watch(props, v => {
  if (v.id) {
    getDetail(v.id);
  }
});
watch(visible, v => {
  !v && resetForm();
});
onMounted(async () => {
  const res: any = await getAllCategory({
    current: 1,
    page: 1,
    size: 20,
    status: 'ENABLE' as const,
  });
  categoryList.value = res.records;
});
const rules: Record<string, Rule[]> = {
  drpTitle: [{ required: true, message: '海报名称不能为空', trigger: 'change' }],
  drpImage: [{ required: true, message: '没有上传海报', trigger: 'change' }],
};
const handleValidate = (...args: any[]) => {
  console.log(args);
};
const onFinish = async (values: unknown) => {
  const params = {
    drpId: props.id || '0',
    ...formData,
  };
  try {
    sending.value = true;
    const res = await savePoster(params);
    sending.value = false;
    visible.value = false;
    message.success('保存成功');
    emit('submit');
    //resetForm();
  } catch (error) {
    //resetForm();
    sending.value = false;
    visible.value = false;
  }
};
const onFinishFailed = (errorInfo: never) => {
  console.log('Failed:', errorInfo);
};
const submit = async () => {
  onFinish(null);
};
const resetForm = () => {
  formRef.value.resetFields();
  formData.drpImage = '';
};
defineExpose({ visible });
</script>
