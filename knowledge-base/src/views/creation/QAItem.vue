<template>
  <div :class="`border-b w-full border-black/10 ${isAnswer && 'bg-stone-200'}`">
    <div class="max-w-3xl py-3 mx-auto">
      <div class="flex justify-between">
        <span :class="`w-[30px] h-[30px] rounded-full bg-gray-${isAnswer ? '900' : '300'}`"></span>
        <div class="w-[calc(100%-50px)] leading-7 text-sm">
          <a-textarea
            v-model:value="content"
            :bordered="editStatus"
            class="resize-none overflow-y-hidden"
            autoSize
            :readOnly="!editStatus"
          />
        </div>
      </div>
      <div class="text-right text-lg mt-2" v-if="isAnswer">
        <div v-if="!editStatus">
          <FormOutlined class="cursor-pointer" title="编辑" @click="editStatus = true" />
          <CopyOutlined class="ml-3 cursor-pointer" title="复制" @click="handleCopy" />
        </div>
        <div v-else>
          <CheckOutlined class="cursor-pointer" title="完成编辑" @click="editStatus = false" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { FormOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons-vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';

  const props = {
    type: { type: String, default: '' },
    content: { type: String },
  };

  export default defineComponent({
    name: 'QuestionAnswerItem',
    components: { FormOutlined, CopyOutlined, CheckOutlined },
    props,
    emits: [],
    setup(props, { emit }) {
      const isAnswer = computed(() => props.type === 'A'); // 是否为“答复”
      const content = ref<string>(props.content || ''); // 内容
      const editStatus = ref<Boolean>(false); // 编辑状态
      const { createMessage } = useMessage(); // 提示模块
      const { clipboardRef, copiedRef } = useCopyToClipboard(); // 粘贴板

      // 复制
      function handleCopy() {
        clipboardRef.value = unref(content);
        if (unref(copiedRef)) {
          createMessage.success('内容复制成功');
        }
      }

      return { isAnswer, content, editStatus, handleCopy };
    },
  });
</script>
