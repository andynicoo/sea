<template>
  <a-modal class="answer-modal" v-model:visible="props.visible" title="添加回答" @ok="confrim" @cancel="cancel">
    <a-form
      class="answer-form"
      ref="formRef"
      :model="data.formData"
      :rules="rules"
      :wrapper-col="{ span: 24 }"
      :label-col="{ span: 3 }"
    >
      <a-form-item label="回答者" :wrapper-col="{ span: 12 }" name="respondentName">
        <a-select v-model:value="data.formData.respondentName">
          <a-select-option v-for="item in option" :value="item.respondentName">
            <div class="answer">
              <span class="answer-avatar"><img :src="item.respondentAvatar" /></span>
              <span class="name">{{ item.respondentName }}</span>
            </div>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="回答内容" name="answerContext">
        <Editor ref="editorDom" v-model="data.formData.answerContext" />
      </a-form-item>
      <a-form-item label="最佳答案" name="isBestAnswer">
        <a-switch v-model:checked="data.formData.isBestAnswer" />
      </a-form-item>
      <a-form-item label="状态" name="answerStatus">
        <a-switch v-model:checked="data.formData.answerStatus" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, type Ref, watch, defineEmits } from 'vue';
import { message } from 'ant-design-vue';
import Editor from '@/components/wangeditor/Editor.vue';
import { getOption } from '@/api/saasManage/kownManage/qaList';
import { func } from 'vue-types';

interface option {
  value: string;
  label: string;
  avatar: string;
}

interface formData {
  id: string;
  answerId: string;
  respondentName: string;
  respondentAvatar: string;
  answerContext: string;
  isBestAnswer: string | boolean;
  answerStatus: string | boolean;
  createName: string;
  modifyName: string;
  updateTime: string;
  createTime: string;
}

const rules = {
  answerId: [{ required: true, message: '必填项', trigger: 'change' }],
  answerContext: [{ required: true, message: '必填项', trigger: 'change' }],
};

const props = defineProps({
  visible: {
    type: Boolean,
    defalut: false,
  },
  formData: {
    type: [Object, Boolean],
    default: false,
  },
  type: {
    type: String,
    default: 'add',
  },
});

watch(
  () => props.formData,
  newValue => {
    setTimeout(() => {
      if (!newValue) {
        clearForm();
        return;
      }
      data.formData = JSON.parse(JSON.stringify(newValue));
      data.formData.isBestAnswer = data.formData.isBestAnswer === 'true' ? true : false;
      data.formData.answerStatus = data.formData.answerStatus === 'true' ? true : false;
      if (data.formData.answerContext) {
        let editor = editorDom.value.editorRef;
        editor.setHtml(data.formData.answerContext);
      }
    }, 0);
  },
  { deep: true }
);

const data: any = reactive({
  formData: {
    id: '',
    respondentName: '',
    respondentAvatar: '',
    answerContext: '<p></p>',
    isBestAnswer: 'false',
    answerStatus: 'false',
    createName: '',
    modifyName: '',
    updateTime: '',
    createTime: '',
  },
});

const emits = defineEmits(['comfrim', 'update:visible']);
const editorDom: Ref = ref(null);
const formRef: Ref = ref(null);
async function confrim() {
  let editor = editorDom.value.editorRef;
  data.formData.answerContext = editor.getHtml();
  if (data.formData.answerContext === '<p><br></p>') {
    data.formData.answerContext = '';
  }
  try {
    const values = await formRef.value.validateFields();
    if (data.formData.id) {
      values.id = data.formData.id;
    }
    option.forEach(item => {
      if (item.respondentName === values.respondentName) {
        values.respondentAvatar = item.respondentAvatar;
      }
    });
    if (props.type === 'add') {
      let userInfo: any = localStorage.getItem('userInfo');
      values.createName = JSON.parse(userInfo).username;
      values.modifyName = data.formData.modifyName;
    }
    if (props.type === 'edit') {
      let userInfo: any = localStorage.getItem('userInfo');
      values.modifyName = JSON.parse(userInfo).username;
      values.createName = data.formData.createName;
    }
    values.updateTime = data.formData.updateTime;
    values.createTime = data.formData.createTime;
    if (typeof values.isBestAnswer === 'boolean') {
      values.isBestAnswer = String(values.isBestAnswer);
    }
    if (typeof values.answerStatus === 'boolean') {
      values.answerStatus = String(values.answerStatus);
    }
    emits('comfrim', values);
    clearForm();
    editor.setHtml('<p><br></p>');
  } catch (errorInfo: any) {
    if (errorInfo.name === 'AxiosError') {
      message.error(errorInfo.message);
      return;
    }
    message.error('请完善表单必填项');
  }
}

let option: Array<any> = [];
async function getAnswerOption() {
  option = (await getOption()) as never;
}
getAnswerOption();

function cancel() {
  emits('update:visible', false);
  let editor = editorDom.value.editorRef;
  editor.setHtml('<p><br></p>');
}

function clearForm() {
  data.formData = {
    id: '',
    respondentName: '',
    respondentAvatar: '',
    answerContext: '<p></p>',
    isBestAnswer: 'false',
    answerStatus: 'false',
    createName: '',
    modifyName: '',
    updateTime: '',
    createTime: '',
  };
}
</script>
<style scoped lang="less"></style>
