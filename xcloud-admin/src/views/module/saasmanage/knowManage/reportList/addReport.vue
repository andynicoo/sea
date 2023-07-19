<template>
  <div class="add-report">
    <label class="back-btn" @click="back"><LeftOutlined class="icon" /><span>返回列表</span></label>
    <h6>发布报告</h6>
    <a-form
      class="form"
      ref="formRef"
      :model="data.formData"
      :rules="rules"
      :wrapper-col="{ span: 24 }"
      :label-col="{ span: 3 }"
      dis
    >
      <a-form-item label="报告分类" :wrapper-col="{ span: 12 }" name="categoryId">
        <a-select v-model:value="data.formData.categoryId">
          <a-select-option v-for="item in data.options1" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所属地域" name="region" :wrapper-col="{ span: 12 }">
        <a-select v-model:value="data.formData.region">
          <a-select-option v-for="item in data.options2" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="报告标题" name="title">
        <a-input v-model:value="data.formData.title" maxlength="50"></a-input>
      </a-form-item>
      <a-form-item label="作者" name="author" :wrapper-col="{ span: 12 }">
        <a-input v-model:value="data.formData.author"></a-input>
      </a-form-item>
      <a-form-item label="seo标题" name="seoTitle">
        <a-input v-model:value="data.formData.seoTitle"></a-input>
      </a-form-item>
      <a-form-item label="关键词" name="keyword">
        <a-tag class="tag" v-for="item in data.formData.keyword">{{ item }}</a-tag>
        <a-button type="primary" @click="data.visible = true">编辑关键词</a-button>
      </a-form-item>
      <a-form-item label="摘要" name="summary">
        <a-textarea v-model:value="data.formData.summary" maxlength="500"></a-textarea>
      </a-form-item>
      <a-form-item label="主图" name="mainPicUrl">
        <a-upload
          accept="image/png, image/jpeg"
          :showUploadList="false"
          :action="`${data.baseUrl}/file/oss/upload`"
          @change="mainChange"
        >
          <div class="upload">
            <plus-outlined v-if="!data.formData.mainPicUrl" class="icon"></plus-outlined>
            <img v-if="data.formData.mainPicUrl" :src="data.formData.mainPicUrl" />
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="内容" name="content">
        <Editor ref="editorDom" v-model="data.formData.content" />
      </a-form-item>
    </a-form>
    <div class="btns">
      <a-button class="btn" type="primary" @click="submit('DISABLE')">保存</a-button>
      <a-button class="btn" @click="submit('ENABLE')">立即发布</a-button>
    </div>
    <TableModal
      title="编辑关键词"
      button="上传标签"
      upload-api="/information/label/upload"
      url="/information/label/getPage"
      buttonType="upload"
      :columns="data.columns"
      selected-filed="labelName"
      @selectedRow="selectionKeyword"
      v-model:visible="data.visible"
    />
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { jumpPage, useButton } from '@/utils/utils';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons-vue';
import Editor from '@/components/wangeditor/Editor.vue';
import { getCategoryOption, publishReport, getDetail, updateReport } from '@/api/saasManage/kownManage/reportList';
import TableModal from '../components/tableModal.vue';

const router = useRouter();

const data = reactive({
  baseUrl: import.meta.env.VITE_APP_API,
  type: 'publish',
  id: '',
  visible: false,
  options1: [],
  options2: [
    { value: 'WEUR', label: '西欧' },
    { value: 'SEA', label: '东南亚' },
    { value: 'JK', label: '日韩' },
    { value: 'NA', label: '北美' },
    { value: 'AFRICA', label: '非洲' },
    { value: 'LAT', label: '拉丁美洲' },
    { value: 'CHN', label: '中国' },
  ],
  columns: [{ title: '标签', dataIndex: 'labelName', align: 'center' }],
  formData: {
    categoryId: '',
    region: '',
    title: '',
    author: '',
    seoTitle: '',
    keyword: [],
    summary: '',
    mainPicUrl: '',
    content: '<p></p>',
    rqCord: '',
    enabled: '',
  },
});

const rules = {
  categoryId: [{ required: true, message: '必填项', trigger: 'change' }],
  region: [{ required: true, message: '必填项', trigger: 'change' }],
  title: [{ required: true, message: '必填项', trigger: 'change' }],
  author: [{ required: true, message: '必填项', trigger: 'change' }],
  mainPicUrl: [{ required: true, message: '必填项', trigger: 'change' }],
  content: [{ required: true, message: '必填项', trigger: 'change' }],
};

onBeforeMount(() => {
  const router = useRoute();
  data.id = router.query?.id || '';
  data.id && getReportDetail();
});

const editorDom = ref();

// 获取报告分类Options
async function getOption() {
  let result = await getCategoryOption();
  data.options1 = result.map(item => {
    return {
      value: item.id,
      label: item.categoryName,
    };
  });
}
getOption();

// 获取编辑数据
async function getReportDetail() {
  let result = await getDetail({ id: data.id });
  result.keyword = result.keyword.split(',');
  data.formData = result || {};
  const editor = editorDom.value.editorRef;
  editor.setHtml(data.formData.content);
}

// 主图上传
function mainChange(fileData) {
  if (fileData?.file?.response) {
    data.formData.mainPicUrl = fileData.file.response.data.fileUrl;
  }
}

// 二维码上传
function qdChange(fileData) {
  if (fileData?.file?.response) {
    data.formData.rqCord = fileData.file.response.data.fileUrl;
  }
}

// 表格选择
function selectionKeyword(keywords) {
  data.formData.keyword = keywords;
}

const formRef = ref(null);

// 提交表单
async function submit(type) {
  const editor = editorDom.value.editorRef;
  let content = editor.getHtml();
  data.formData.content = editor.getHtml();
  if (data.formData.content === '<p><br></p>') {
    data.formData.content = '';
  }
  try {
    const values = await formRef.value.validateFields();
    values.enabled = type;
    values.keyword = (values.keyword || []).join();
    if (data.id) values.id = data.id;
    let result = {};
    if (data.id) {
      result = await updateReport(values);
    } else {
      result = await publishReport(values);
    }
    clearForm();
    editor.setHtml('<p><br></p>');
    message.success(type === 'ENABLE' ? '发布成功' : '保存成功');
    router.go(-1);
  } catch (errorInfo) {
    if (errorInfo.name === 'AxiosError') {
      message.error(errorInfo.message);
      return;
    }
    message.error('请完善表单必填项');
  }
}

function clearForm() {
  Object.keys(data.formData).forEach(item => {
    data.formData[item] = item === 'content' ? '<p></p>' : '';
  });
}

function back() {
  jumpPage(`/saasmanage/knowManage/reportList`);
}
</script>

<style scoped lang="less">
.add-report {
  background: #fff;
  padding: 20px;
  .back-btn {
    color: #333;
    font-size: 14px;
    display: inline-block;
    line-height: 30px;
    margin-bottom: 6px;
    cursor: pointer;
    &:hover {
      color: #2090ff;
    }
    .icon {
      margin-right: 5px;
    }
  }
  > h6 {
    font-size: 14px;
    color: #333;
    font-weight: bold;
    line-height: 40px;
    padding-left: 4px;
    margin-bottom: 5px;
  }
  .form {
    width: 75%;
    padding-left: 16px;
    background: #fff;
    :deep(textarea) {
      height: 150px;
    }
    :deep(.tag) {
      color: #1890ff;
      background: #e8f4ff;
      border-color: #d1e9ff;
      margin-bottom: 6px;
    }
    .upload {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 168px;
      height: 168px;
      border: 1px solid #d9d9d9;
      cursor: pointer;
      .icon {
        font-size: 28px;
      }
      > img {
        width: 168px;
        height: 168px;
      }
    }
    :deep(.ant-btn-primary) {
      padding: 0;
      > span {
        display: inline-block;
        width: 100%;
        height: 100%;
        padding: 4px 15px;
      }
    }
  }
  .btns {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    > .btn {
      margin-right: 10px;
    }
  }
}
</style>
