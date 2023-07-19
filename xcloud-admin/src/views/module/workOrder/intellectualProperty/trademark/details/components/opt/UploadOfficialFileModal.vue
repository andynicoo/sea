<template>
  <slot>
    <a-button type="primary" size="small" @click="showModal = true">{{ btnText }}</a-button>
  </slot>
  <a-modal
    :title="btnText"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="文件类型" name="fileType" :rules="[{ required: true, message: '请选择文件类型' }]">
          <a-select
            v-model:value="formModal.fileType"
            placeholder="请选择"
            allowClear
            :disabled="formModal.oaFileId !== undefined"
          >
            <a-select-option :value="1"> 受理回执 </a-select-option>
            <a-select-option :value="2"> 受理书 </a-select-option>
            <a-select-option :value="3"> 审查意见（OA） </a-select-option>
            <a-select-option :value="4"> 审查意见官方回执文件(OA) </a-select-option>
            <a-select-option :value="7"> 暂停审查 </a-select-option>
            <a-select-option :value="8"> 商标证书 </a-select-option>
            <a-select-option :value="9"> 公告期延长通知 </a-select-option>
            <a-select-option :value="10"> 放弃审查意见 </a-select-option>
            <a-select-option :value="11"> 对方律师通知函 </a-select-option>
            <a-select-option :value="12"> 收到异议通知函 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="上传文件">
          <Upload accept=".jpg,.pdf,.zip,.png" @submitUrl="submitUrl($event, 'fileUrl')" />
          <div style="margin-top: 8px" v-if="formModal.fileUrl">
            {{ formModal.fileUrl.split('/')[formModal.fileUrl.split('/').length - 1] }}
          </div>
          <div>文件限制：文件大小不超过5M</div>
        </a-form-item>
        <a-form-item label="上传翻译件" v-if="[4, 9, 10, 11, 12].includes(formModal.fileType)">
          <Upload @submitUrl="submitUrl($event, 'translateFileUrl')" />
          <div style="margin-top: 8px" v-if="formModal.translateFileUrl">
            {{ formModal.translateFileUrl.split('/')[formModal.translateFileUrl.split('/').length - 1] }}
          </div>
          <div>文件限制：文件大小不超过5M</div>
        </a-form-item>
        <a-form-item label="官方日期" name="officialDate" :rules="[{ required: true, message: '请选择官方日期' }]">
          <a-date-picker
            v-model:value="formModal.officialDate"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item
          label="官方结束日期"
          name="officialExpirationDate"
          :rules="[{ required: true, message: '请选择官方结束日期' }]"
          v-if="formModal.fileType === 3"
        >
          <a-date-picker
            v-model:value="formModal.officialExpirationDate"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 220px"
          />
        </a-form-item>
        <a-form-item label="备注" v-if="formModal.fileType === 3">
          <a-textarea v-model:value="formModal.remark" placeholder="请输入备注" show-count :maxlength="200" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { addFileOaAPI, updateFileOaAPI } from '@/api/workOrder/intellectualProperty/trademark';

const props = defineProps({
  btnText: {
    type: String,
    default: '按钮名称',
  },
  serviceInfo: {
    type: Object,
    default: null,
  },
  record: {
    type: Object,
    default: null,
  },
});
const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showModal = ref(false);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      if (props.serviceInfo && props.serviceInfo.workOrderId) {
        formModal.value = {
          workOrderId: props.serviceInfo.workOrderId,
          oaFileId: undefined,
          fileType: null,
          fileUrl: null,
          translateFileUrl: null,
          officialDate: null,
          officialExpirationDate: null,
          remark: null,
        };
      } else {
        formModal.value = {
          workOrderId: props.record.prentId,
          oaFileId: props.record.id,
          fileType: props.record.fileType,
          fileUrl: props.record.fileUrl,
          translateFileUrl: props.record.translateFileUrl,
          officialDate: props.record.officeDate,
          officialExpirationDate: props.record.officialExpirationDate,
          remark: props.record.remark,
        };
      }
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    if (!formModal.value.fileUrl && ![9, 10, 11, 12].includes(formModal.value.fileType)) {
      message.error('请上传文件');
      return false;
    }
    if (!formModal.value.translateFileUrl && [9, 10, 11, 12].includes(formModal.value.fileType)) {
      message.error('请上传翻译件');
      return false;
    }
    formModal.value.officialDate = formModal.value.officialDate.split(' ')[0] + ' 00:00:00';
    if (formModal.value.officialExpirationDate) {
      formModal.value.officialExpirationDate = formModal.value.officialExpirationDate.split(' ')[0] + ' 23:59:59';
    }
    let res = null;
    if (formModal.value.oaFileId) {
      res = updateFileOaAPI(formModal.value);
    } else {
      res = addFileOaAPI(formModal.value);
    }
    res.then(() => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//上传图片
const submitUrl = (url: string, keyStr: string) => {
  formModal.value[keyStr] = url;
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 10px;
  max-height: 60vh;
  overflow-y: auto;
}
</style>
