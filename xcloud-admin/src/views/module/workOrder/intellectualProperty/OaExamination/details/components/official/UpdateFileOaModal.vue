<template>
  <a-modal
    title="修改官方文件"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="文件类型"> OA审查意见 </a-form-item>
        <a-form-item label="上传文件" name="fileUrl" :rules="[{ required: true, message: '请上传文件' }]">
          <Upload @submitUrl="submitUrl" />
          <div style="margin-top: 8px; font-size: 16px" v-if="formModal.fileUrl">
            {{ formModal.fileUrl.split('/')[formModal.fileUrl.split('/').length - 1] }}
          </div>
          <div class="form-tips">文件限制：文件大小不超过5M</div>
        </a-form-item>
        <a-form-item
          label="官方开始日期"
          name="officialDate"
          :rules="[{ required: true, message: '请选择官方开始日期' }]"
        >
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
        >
          <a-date-picker
            v-model:value="formModal.officialExpirationDate"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 220px"
          />
          <div class="form-tips">提示：美标OA答复时间为6个月，英国、欧盟为2个月</div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import { updateFileOaAPI } from '@/api/workOrder/intellectualProperty/oaExamination';
import dayjs from 'dayjs';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});
const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        oaFileId: props.record.id,
        workOrderId: props.record.workId,
        translateFileUrl: props.record.translateFileUrl,
        fileType: props.record.fileType,
        lastDealDate: props.record.lastDealDate,
        fileUrl: props.record.fileUrl,
        officialDate: props.record.officeDate,
        officialExpirationDate: props.record.officialExpirationDate,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    const date1 = dayjs(formModal.value.officialDate);
    const date2 = dayjs(formModal.value.officialExpirationDate);
    if (date2.diff(date1, 'day') < 0) {
      message.error('结束时间应在开始时间之后');
      return false;
    }
    const params = JSON.parse(JSON.stringify(formModal.value));
    params.officialDate = params.officialDate.split(' ')[0] + ' 00:00:00';
    params.officialExpirationDate = params.officialExpirationDate.split(' ')[0] + ' 23:59:59';
    updateFileOaAPI(params).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//上传图片
const submitUrl = (url: string) => {
  formModal.value.fileUrl = url;
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 20px 0;
  .form-tips {
    font-size: 14px;
    line-height: 30px;
    color: #666;
  }
}
</style>
