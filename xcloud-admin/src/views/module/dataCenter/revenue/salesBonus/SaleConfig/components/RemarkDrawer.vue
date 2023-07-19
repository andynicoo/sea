<template>
  <a-drawer v-model:visible="showDrawer" placement="right" :closable="false" width="36%">
    <template #title>
      <div class="title-head">
        <span class="text">页面备注</span>
        <span class="close-icon" @click="showDrawer = false">
          <CloseOutlined />
        </span>
      </div>
    </template>
    <div style="border: 1px solid #ccc; margin: 6px 16px 48px 18px">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>

    <div class="btn-wrap">
      <a-space :size="24">
        <a-button @click="showDrawer = false">取消</a-button>
        <a-button type="primary" @click="submit()">完成</a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, type Ref, onBeforeUnmount, shallowRef, onMounted } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const props = defineProps({
  remark: {
    default: '',
  },
});
const emit = defineEmits(['submit']);

const showDrawer = ref(false);

const mode = ref('simple'); // default 或 'simple'
const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const valueHtml = ref(''); // 内容 HTML
const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };

watch(showDrawer, newVal => {
  if (newVal) {
    nextTick(() => {
      valueHtml.value = props.remark || '';
    });
  }
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

//完成
const submit = () => {
  emit('submit', {
    keyStr: 'remark',
    value: valueHtml.value || '',
  });
  showDrawer.value = false;
};

defineExpose({ showDrawer });
</script>

<style scoped lang="less">
.title-head {
  .text {
    font-size: 14px;
    color: #333;
  }
  .close-icon {
    float: right;
    cursor: pointer;
  }
}
.btn-wrap {
  text-align: right;
  padding: 0 16px;
}
</style>
