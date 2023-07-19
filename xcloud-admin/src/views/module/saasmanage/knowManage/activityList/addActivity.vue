<template>
  <div class="add-report">
    <label class="back-btn" @click="back"><LeftOutlined class="icon" /><span>返回列表</span></label>
    <h6>创建活动</h6>
    <a-form
      class="form"
      ref="formRef"
      :model="data.formData"
      :rules="rules"
      :wrapper-col="{ span: 24 }"
      :label-col="{ span: 3 }"
      dis
    >
      <a-form-item label="活动标题" name="title">
        <a-input v-model:value="data.formData.title" maxlength="50"></a-input>
      </a-form-item>
      <a-form-item label="活动时间" name="startTime" :wrapper-col="{ span: 12 }">
        <a-space direction="vertical" :size="12">
          <a-range-picker
            :disabledDate="disabledDate"
            showTime
            v-model:value="data.formData.startTime"
            valueFormat="YYYY-MM-DD HH:mm:ss"
          />
          <!-- <a-range-picker v-model:value="data.formData.startTime" valueFormat="YYYY-MM-DD HH:mm:ss" /> -->
        </a-space>
      </a-form-item>
      <a-form-item label="参与对象" name="participants" :wrapper-col="{ span: 12 }">
        <a-input v-model:value="data.formData.participants"></a-input>
      </a-form-item>
      <a-form-item label="seo标题" name="seoTitle">
        <a-input v-model:value="data.formData.seoTitle"></a-input>
      </a-form-item>
      <a-form-item label="seo关键词" name="keyword">
        <a-input v-model:value="data.formData.keyword"></a-input>
      </a-form-item>
      <a-form-item label="seo描述" name="seoDescribe">
        <a-textarea maxlength="500" v-model:value="data.formData.seoDescribe"></a-textarea>
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
      <a-form-item label="报名二维码" name="applyCord">
        <a-upload
          accept="image/png, image/jpeg"
          :showUploadList="false"
          :action="`${data.baseUrl}/file/oss/upload`"
          @change="qdChange"
        >
          <div class="upload">
            <plus-outlined v-if="!data.formData.applyCord" class="icon"></plus-outlined>
            <img v-if="data.formData.applyCord" :src="data.formData.applyCord" />
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item label="活动详情" name="activityDetail">
        <Editor ref="editorDom" v-model="data.formData.activityDetail" />
      </a-form-item>
      <a-form-item label="是否启用" name="enabled">
        <a-switch v-model:checked="data.formData.enabled" />
      </a-form-item>
    </a-form>
    <div class="btns">
      <a-button class="btn" @click="back">取消</a-button>
      <a-button class="btn" type="primary" @click="submit('ENABLE')">提交</a-button>
    </div>
    <TableModal
      title="编辑关键词"
      button="上传关键词"
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
import { LeftOutlined, PlusOutlined } from '@ant-design/icons-vue';
import Editor from '@/components/wangeditor/Editor.vue';
import { jumpPage, useButton } from '@/utils/utils';
import dayjs, { Dayjs } from 'dayjs';
import { publishReport, getDetail, updateReport } from '@/api/saasManage/kownManage/activityList';
import TableModal from '../components/tableModal.vue';

const router = useRouter();

const data = reactive({
  baseUrl: import.meta.env.VITE_APP_API,
  type: 'publish',
  id: '',
  visible: false,
  options2: [
    { value: 'all', label: '全部' },
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
    title: '',
    startTime: [],
    participants: '',
    seoTitle: '',
    keyword: '',
    seoDescribe: '',
    mainPicUrl: '',
    activityDetail: '<p></p>',
    applyCord: '',
    enabled: true,
  },
});

const rules = {
  title: [{ required: true, message: '必填项', trigger: 'change' }],
  startTime: [{ required: true, message: '必填项', trigger: 'change' }],
  participants: [{ required: true, message: '必填项', trigger: 'change' }],
  mainPicUrl: [{ required: true, message: '必填项', trigger: 'change' }],
  applyCord: [{ required: true, message: '必填项', trigger: 'change' }],
  activityDetail: [{ required: true, message: '必填项', trigger: 'change' }],
};

onBeforeMount(() => {
  const router = useRoute();
  data.id = router.query?.id || '';
  data.id && getReportDetail();
});

function disabledDate(current) {
  let curDate = new Date();
  return current && current < dayjs(new Date(curDate.getTime() - 60 * 60 * 24 * 1000));
}

const editorDom = ref();

// 获取编辑数据
async function getReportDetail() {
  let result = await getDetail({ id: data.id });
  result.keyword = result.keyword.split(',');
  data.formData = result || {};
  data.formData.startTime = [data.formData.startTime, data.formData.endTime];
  data.formData.enabled = data.formData.enabled === 'ENABLE' ? true : false;
  const editor = editorDom.value.editorRef;
  editor.setHtml(data.formData.activityDetail);
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
    data.formData.applyCord = fileData.file.response.data.fileUrl;
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
  data.formData.activityDetail = editor.getHtml();
  if (data.formData.activityDetail === '<p><br></p>') {
    data.formData.activityDetail = '';
  }
  try {
    const values = await formRef.value.validateFields();
    values.enabled = values.enabled ? 'ENABLE' : 'DISABLE';
    if (data.id) values.id = data.id;
    values.endTime = data.formData.startTime[1];
    values.startTime = data.formData.startTime[0];
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
    console.log(errorInfo);
    message.error('请完善表单必填项');
  }
}

function clearForm() {
  Object.keys(data.formData).forEach(item => {
    data.formData[item] = item === 'content' ? '<p></p>' : '';
  });
}

function back() {
  jumpPage(`/saasmanage/knowManage/activityList`);
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
