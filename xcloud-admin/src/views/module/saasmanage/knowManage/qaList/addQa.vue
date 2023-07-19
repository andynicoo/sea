<template>
  <div class="add-report">
    <label class="back-btn" @click="back"><LeftOutlined class="icon" /><span>返回列表</span></label>
    <h6>发布问答</h6>
    <a-form
      class="form"
      ref="formRef"
      :model="data.formData"
      :rules="rules"
      :wrapper-col="{ span: 24 }"
      :label-col="{ span: 3 }"
    >
      <a-form-item label="问答分类" :wrapper-col="{ span: 12 }" name="categoryId">
        <a-select v-model:value="data.formData.categoryId">
          <a-select-option v-for="item in data.options" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="问答标题" name="title">
        <a-input v-model:value="data.formData.title" maxlength="50"></a-input>
      </a-form-item>
      <a-form-item label="提问人" name="questioner" :wrapper-col="{ span: 12 }">
        <a-input v-model:value="data.formData.questioner"></a-input>
      </a-form-item>
      <a-form-item label="seo标题" name="seoTitle">
        <a-input v-model:value="data.formData.seoTitle"></a-input>
      </a-form-item>
      <a-form-item label="seo关键词" name="keyword">
        <a-tag class="tag" v-for="item in data.formData.keyword">{{ item }}</a-tag>
        <a-button type="primary" @click="data.visible = true">编辑关键词</a-button>
      </a-form-item>
      <a-form-item label="seo描述" name="seoDescribe">
        <a-textarea maxlength="500" v-model:value="data.formData.seoDescribe"></a-textarea>
      </a-form-item>
      <a-form-item label="问题描述" name="questionDescribe">
        <a-textarea v-model:value="data.formData.questionDescribe"></a-textarea>
      </a-form-item>
      <a-form-item label="回答" name="keyword">
        <a-button type="primary" @click="addAnswer">添加回答</a-button>
      </a-form-item>
    </a-form>
    <AnswerTable :dataSource="data.answerTableData" @editRow="editRow" @delRow="delRow" />
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
    <AnswerModal
      v-model:visible="data.answerModalVisible"
      :form-data="data.answerFormData"
      @comfrim="answerModalComfrim"
      :type="data.answerType"
    />
  </div>
</template>

<script setup>
import { message, Modal } from 'ant-design-vue';
import { reactive, ref, onBeforeMount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { jumpPage, useButton } from '@/utils/utils';
import { getCategoryOption, publishQa, getDetail, updateQa } from '@/api/saasManage/kownManage/qaList';
import TableModal from '../components/tableModal.vue';
import AnswerModal from './components/answerModal.vue';
import AnswerTable from './components/answerTable.vue';

const router = useRouter();
const data = reactive({
  baseUrl: import.meta.env.VITE_APP_API,
  type: 'publish',
  id: '',
  visible: false,
  answerType: 'add',
  answerEditId: -1,
  answerModalVisible: false,
  answerFormData: false,
  answerTableData: [],
  options: [],
  columns: [{ title: '关键词', dataIndex: 'labelName', align: 'center' }],
  formData: {
    categoryId: '',
    title: '',
    questioner: '',
    seoTitle: '',
    keyword: [],
    seoDescribe: '',
    questionDescribe: '',
    enabled: '',
    answerVOList: [],
  },
});

const rules = {
  categoryId: [{ required: true, message: '必填项', trigger: 'change' }],
  title: [{ required: true, message: '必填项', trigger: 'change' }],
  questioner: [{ required: true, message: '必填项', trigger: 'change' }],
  questionDescribe: [{ required: true, message: '必填项', trigger: 'change' }],
};

onBeforeMount(() => {
  const router = useRoute();
  data.id = router.query?.id || '';
  data.id && getqaDetail();
});

// 获取问答分类Options
async function getOption() {
  let result = await getCategoryOption();
  data.options = result.map(item => {
    return {
      value: item.id,
      label: item.categoryName,
    };
  });
}
getOption();

// 获取详情数据
async function getqaDetail() {
  let result = await getDetail({ id: data.id });
  result.keyword =result.keyword?result.keyword.split(','):[];
  data.formData = result || {};
  data.answerTableData = data.formData.answerDTOList;
  data.answerTableData.forEach((item, index) => {
    if (item.isBestAnswer === 'true') {
      data.answerTableData.splice(index, 1);
      data.answerTableData.unshift(item);
    }
  });
}

// 表格选择
function selectionKeyword(keywords) {
  data.formData.keyword = keywords;
}

// 添加回答
function addAnswer() {
  data.answerType = 'add';
  data.answerEditId = -1;
  data.answerModalVisible = true;
  data.answerFormData = false;
}

// 编辑回答
function editRow(index) {
  data.answerType = 'edit';
  data.answerEditId = index;
  data.answerModalVisible = true;
  data.answerFormData = data.answerTableData[index];
}

// 添加编辑回答确认处理
function answerModalComfrim(values) {
  data.answerModalVisible = false;
  if (values.isBestAnswer === 'true') {
    data.answerTableData.forEach(item => {
      item.isBestAnswer = false;
    });
    data.answerEditId !== -1 && data.answerTableData.splice(data.answerEditId, 1);
    data.answerTableData.unshift(values);
    return;
  }
  if (data.answerEditId === -1) {
    data.answerTableData.push(values);
  } else {
    data.answerTableData.splice(data.answerEditId, 1, values);
  }
}

// 删除单条回答
function delRow(index) {
  data.answerTableData.splice(index, 1);
}

const formRef = ref(null);

// 提交表单
async function submit(type) {
  try {
    const values = await formRef.value.validateFields();
    values.questionStatus = type;
    if (data.id) values.id = data.id;
    values.answerVOList = data.answerTableData;
    values.keyword = (values.keyword || []).join();
    let result = {};
    if (data.id) {
      result = await updateQa(values);
    } else {
      result = await publishQa(values);
    }
    if (result) {
      clearForm();
      message.success(type === 'ENABLE' ? '发布成功' : '保存成功');
      router.go(-1);
    } else {
      message.error(type === 'ENABLE' ? '发布失败' : '保存失败');
    }
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
  jumpPage(`/saasmanage/knowManage/qaList`);
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
<style lang="less">
.answer-modal {
  min-width: 800px !important;
}
.answer {
  display: flex;
  align-items: center;
}
.answer-avatar {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  > img {
    width: 100%;
  }
}
</style>
