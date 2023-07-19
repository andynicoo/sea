<template>
  <div style="border: 1px solid #cccccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="'simple'"
    />
    <Editor
      style="height: 300px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="'simple'"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script lang="ts" setup>
import { watch, onBeforeUnmount, ref, shallowRef, onMounted, type Ref } from 'vue';
// @ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import type { IToolbarConfig } from '@wangeditor/editor';
import { decode } from 'js-base64';
import { Form } from 'ant-design-vue';

const props = defineProps({
  html: {
    default: '',
    type: String,
  },
});

const formItemContext = Form.useInjectFormItemContext();

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

const htmlContent: string = decode(props.html);

// 内容 HTML
const valueHtml: Ref<string> = ref(htmlContent);
const emit = defineEmits<{
  (e: 'update:value', v: string): void;
}>();
watch(valueHtml, () => {
  emit('update:value', valueHtml.value);
  formItemContext.onFieldChange();
});
watch(props, (newValue, oldValue) => {
  valueHtml.value = decode(newValue.html);
});

onMounted(() => {
  console.log('editor start');
});

const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: ['group-video', 'insertVideo', 'fullScreen'],
};

const uploadUrl = ref(import.meta.env.VITE_APP_API + '/file/oss/feign/upload2');
console.log(uploadUrl.value);
const editorConfig: any = { placeholder: '请输入内容...', MENU_CONF: {} };

type InsertFnType = (url: string, alt: string, href: string) => void;
editorConfig.MENU_CONF['uploadImage'] = {
  server: uploadUrl.value,

  timeout: 5 * 1000, // 5s

  fieldName: 'file',
  // meta: { token: 'xxx', a: 100 },
  metaWithUrl: false, // join params to url

  headers: { Accept: 'application/json;charset=UTF-8' },

  maxFileSize: 10 * 1024 * 1024, // 10M

  // 最多可上传几个文件，默认为 100
  maxNumberOfFiles: 1,

  base64LimitSize: 5 * 1024, // insert base64 format

  onBeforeUpload(file: File) {
    console.log('onBeforeUpload', file);

    return file; // will upload this file
    // return false // prevent upload
  },
  onProgress(progress: any) {
    console.log('onProgress', progress);
  },
  onSuccess(file: any, res: any) {
    console.log('onSuccess', file, res);
  },
  onFailed(file: any, res: { message: any }) {
    alert(res.message);
    console.log('onFailed', file, res);
  },
  onError(file: any, err: { message: any }, res: any) {
    alert(err.message);
    console.error('onError', file, err, res);
  },
  // 自定义插入图片
  customInsert(res: any, insertFn: InsertFnType) {
    const data: any = res.data;
    insertFn(data.fileUrl, data.origFileName, '');
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

defineExpose({ editorRef });
</script>
