<template>
  <a-modal
    title="创建文章"
    width="800px"
    okText="保存"
    v-model:visible="visible"
    :maskClosable="false"
    :keyboard="false"
    :destroyOnClose="true"
    :confirmLoading="sending"
    @ok="submit"
    @cancel="resetForm()"
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
        <a-form-item label="文章标题" name="drpTitle">
          <a-input v-model:value="formData.drpTitle" class="zt-w200" />
        </a-form-item>
        <a-form-item v-if="categoryList" name="productCategoryId" label="文章板块">
          <a-select v-model:value="formData.productCategoryId" class="zt-w200">
            <a-select-option v-for="opt in categoryList" :value="opt.id" :key="opt.id">{{
              opt.categoryName
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上传主图" name="drpImage">
          <UploadBox v-model="formData.drpImage" />
        </a-form-item>
        <a-form-item label="编辑文章" name="drpContent">
          <Editor v-model:value="formData.drpContent" :html="valueHtml" ref="editorDom" />
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
import Editor from '@/components/wangeditor/Editor.vue';
import { getAllCategory } from '@/api/base/basicsData';
import { useStore } from '@/stores/store';
import type { Rule } from 'ant-design-vue/es/form';
import { saveArticle, drpPosterArticleDetail } from '@/api/customerManage/distribution';
import { message } from 'ant-design-vue';
import UploadBox from '@/components/upload/UploadBox.vue';

const editorDom: Ref = ref(null);
const valueHtml: Ref<string | undefined> = ref('');
const formRef = ref<any>();

interface Emits {
  (e: 'submit'): void;
}
interface Props {
  id?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const {
  enterprise: {
    record: { id: enterpriseId },
  },
} = useStore();
interface FormData {
  drpTitle: string;
  drpContent: string;
  /** 板块id */
  productCategoryId: string;
  /** 状态 启用：ENABLED 禁用 DISABLED */
  status: 'ENABLED' | 'DISABLED';
  enterpriseId: number;
  drpImage: string;
}
const spinning = ref<boolean>(false);
const categoryList = ref<{ categoryName: string; id: string }[]>([]);
const formData = reactive<FormData>({
  drpTitle: '',
  drpContent: '',
  productCategoryId: '',
  status: 'ENABLED', // 默认开启
  enterpriseId: +enterpriseId,
  drpImage: '',
});

const visible = ref<boolean>(false);
const sending = ref<boolean>(false);
// 详情
const getDetail = async (id: string) => {
  const res: any = await drpPosterArticleDetail(id);
  formData.drpTitle = res.drpTitle;
  formData.productCategoryId = res.productCategoryId;
  formData.status = res.status;
  formData.enterpriseId = res.enterpriseId;
  formData.drpImage = res.drpImage;
  formData.drpContent = res.drpContent;
  valueHtml.value = res.drpContent;
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
const validateEdit = async (_rule: Rule, value: string) => {
  if (value === '<p><br></p>') {
    return Promise.reject('文章内容不能为空');
  } else {
    return Promise.resolve();
  }
};
const rules: Record<string, Rule[]> = {
  drpTitle: [{ required: true, message: '文章标题不能为空', trigger: 'change' }],
  drpImage: [{ required: true, message: '文章主图不能为空', trigger: 'change' }],
  productCategoryId: [{ required: true, message: '文章板块不能为空', trigger: 'change' }],
  drpContent: [{ required: true, validator: validateEdit, trigger: 'change' }],
};
const handleValidate = (...args: any[]) => {
  console.log(args);
};
const onFinish = async (values: unknown) => {
  const { productCategoryId } = formData;
  const curCate = categoryList.value.filter(v => v.id === productCategoryId)[0];
  const params = {
    productCategoryName: curCate.categoryName,
    drpId: props.id || '0',
    ...formData,
  };
  try {
    sending.value = true;
    const res = await saveArticle(params);
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
  const editor = editorDom.value.editorRef;
  if (editor !== null) {
    formData.drpContent = editor.getHtml();
  } else {
    formData.drpContent = '';
  }
  await formRef.value.validateFields(['drpTitle', 'productCategoryId', 'drpImage', 'drpContent']);
  onFinish(null);
};
const resetForm = () => {
  formRef.value.resetFields();
  formData.drpImage = '';
  formData.drpContent = '';
  valueHtml.value = '';
};
defineExpose({ visible });
</script>
