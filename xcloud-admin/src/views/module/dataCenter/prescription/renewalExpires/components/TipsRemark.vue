<template>
  <a-modal title="注意事项" width="800px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <template v-if="editFlag">
        <div style="border: 1px solid #ccc; margin: 6px 16px 48px 18px">
          <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="{}" mode="simple" />
          <Editor
            style="height: 400px; overflow-y: hidden"
            v-model="mattersNeedingAttention"
            :defaultConfig="{ placeholder: '请输入内容...' }"
            mode="simple"
            @onCreated="handleCreated"
          />
        </div>
        <div class="btn">
          <a-button size="small" danger type="primary" @click="editSubmit">提交编辑内容</a-button>
        </div>
      </template>
      <template v-else>
        <div class="html-wrap" v-html="mattersNeedingAttention"></div>
        <div class="btn" v-if="useButton('xcloudplat_dataCenter_renewalExpires_tipsEdit')">
          <a-button size="small" danger type="primary" @click="editFlag = true">点击编辑内容</a-button>
        </div>
      </template>
    </div>

    <template #footer>
      <a-button type="primary" @click="showModal = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, onBeforeUnmount, shallowRef } from 'vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { getMattersNeedingAttention, setMattersNeedingAttention } from '@/api/dataCenter/renewalExpires';
import { message } from 'ant-design-vue';
import { decode, encode } from 'js-base64';
import { useButton } from '@/utils/utils';

const showModal = ref(false);
const editFlag = ref(false);
const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const mattersNeedingAttention = ref(''); // 内容 HTML

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      editFlag.value = false;
      getTipsInfo();
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

//提交编辑注意事项
const editSubmit = () => {
  setMattersNeedingAttention({
    mattersNeedingAttention: encode(mattersNeedingAttention.value),
  }).then((res: any) => {
    message.success('操作成功');
    getTipsInfo();
  });
};

//获取注意事项
const getTipsInfo = () => {
  getMattersNeedingAttention({}).then((res: any) => {
    mattersNeedingAttention.value = decode(res || '');
    editFlag.value = false;
  });
};

defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 40px;
  .html-wrap {
    min-height: 200px;
  }
}
</style>
