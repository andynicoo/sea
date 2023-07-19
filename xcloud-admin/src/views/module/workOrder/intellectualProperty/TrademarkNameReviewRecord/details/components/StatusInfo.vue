<template>
  <div class="status-info" v-if="detail">
    <a-row type="flex" justify="space-between">
      <h4>状态：{{ recordStatusMap[detail.recordStatus] }}</h4>
      <div class="button-group">
        <a-button
          v-if="
            (detail.recordStatus === 'WAIT_CONFIRM' ||
              detail.recordStatus === 'RECHECK_WAIT_CONFIRM' ||
              detail.recordStatus === 'AUDIT_WAIT_CONFIRM') &&
            useButton('workOrder_intellectualProperty_trademarkDetail_report_confirm')
          "
          type="primary"
          @click="confirmVisible = true"
          >线下确认报告</a-button
        >
        <a-button
          type="primary"
          @click="visible = true"
          v-if="allReport?.checkResult && useButton('trademarkDetail_report_preview')"
          >预览报告</a-button
        >
        <a-button
          type="primary"
          @click="handleBtn(2)"
          v-if="['WAIT_RECHECK'].includes(detail.recordStatus) && useButton('trademarkDetail_report_check_recheck')"
          >复核报告</a-button
        >
        <a-button
          type="primary"
          @click="handleBtn(2)"
          v-if="['CONFIRM_WAIT_AUDIT'].includes(detail.recordStatus) && useButton('trademarkDetail_report_check_last')"
          >终审报告</a-button
        >
        <a-button
          v-if="
            allReport?.reportStatus === 'SUBMITTED' &&
            detail.recordStatus === 'WAIT_CHECK' &&
            !detail.forceRecheckFlag &&
            detail.createType !== 'WORK' &&
            useButton('trademarkDetail_report_create')
          "
          type="primary"
          @click="handleBtn(3)"
          >生成报告链接</a-button
        >
        <a-button
          v-if="allReport?.createLink && useButton('trademarkDetail_report_copy')"
          type="primary"
          @click="textCopy(allReport.lastLinkUrl)"
          >复制报告链接</a-button
        >
        <a-button
          type="primary"
          @click="handleBtn(4)"
          v-if="
            detail.recordStatus === 'WAIT_CHECK' &&
            allReport?.checkResult &&
            detail.checkUserId !== detail.createId &&
            useButton('trademarkDetail_report_check_submit')
          "
          >提交复核</a-button
        >
      </div>
    </a-row>
    <a-row :gutter="70">
      <a-col :span="6"
        >创建人：<span>{{ detail.createName }}</span></a-col
      >
      <a-col :span="6"
        >创建类型：<span>{{ createTypeMap[detail.createType] }}</span></a-col
      >
      <a-col :span="6"
        >创建时间：<span>{{ detail.createTime }}</span></a-col
      >
    </a-row>
    <a-modal
      v-model:visible="visible"
      title="报告预览"
      width="1300px"
      :bodyStyle="{ height: '700px', 'overflow-y': 'auto', padding: 0 }"
      :footer="null"
    >
      <iframe v-if="previewUrl" :src="previewUrl" frameborder="0" width="100%" height="694px"></iframe>
    </a-modal>

    <!-- 线下确认报告弹窗 -->
    <a-modal
      title="线下确认核名报告"
      width="700px"
      v-model:visible="confirmVisible"
      :maskClosable="false"
      :keyboard="false"
      @ok="handleUserConfirm"
    >
      <div class="modal-wrap">
        <p class="tips">确认核名报告前，请确保您已取得客户的同意，并有相关的凭证记录（如聊天记录截图）。</p>
        <a-form ref="ruleFormRef" layout="vertical" :model="formData" name="basic">
          <a-form-item name="userConfirmStatus" :rules="[{ required: true, message: '请选择核名报告确认结果' }]">
            <template #label><strong>选择核名报告确认结果</strong></template>
            <a-radio-group v-model:value="formData.userConfirmStatus" name="radioGroup">
              <template
                v-if="allReport?.checkResult !== '不建议注册，商标名为敏感词（商标重名、著名品牌、宗教、人名、地名等）'"
              >
                <a-radio
                  value="PERSIST"
                  v-if="allReport?.checkPassRate === '小于50%' || allReport?.checkPassRate === '不建议'"
                  >坚持注册</a-radio
                >
                <a-radio value="CONFIRM" v-else>确认注册</a-radio>
              </template>
              <a-radio value="DISCARD">放弃，换个商标名</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="remark" :rules="[{ required: true, message: '备注不能为空' }]">
            <template #label><strong>添加备注</strong></template>
            <a-textarea
              v-model:value="formData.remark"
              placeholder="请输入备注信息"
              show-count
              :maxlength="300"
              :rows="4"
            />
          </a-form-item>
          <a-form-item name="remarkUrl" :rules="[{ required: true, message: '请上传凭证' }]">
            <template #label>
              <strong>上传凭证</strong>
              <span class="upload-tips">支持JPG、JPEG、BMP、PNG，最大不超过5M</span>
            </template>
            <UploadImgPreview
              v-if="confirmVisible"
              v-model="formData.remarkUrl"
              accept="image/jpeg,image/png,image/jpg,image/bmp"
              :maxCount="10"
              :fileSize="5"
            ></UploadImgPreview>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, inject, computed } from 'vue';
import type { StatusBtnTypes } from '../index';
import { textCopy, useButton } from '@/utils/utils';
import { createTypeMap, recordStatusMap } from '../common';
import { useStore } from '@/stores/store';
import UploadImgPreview from '@/components/upload/UploadImgPreview.vue';
import { handleReportConfirm } from '@/api/workOrder/intellectualProperty/trademark';
import { message } from 'ant-design-vue';

interface Emits {
  (e: 'handle', v: StatusBtnTypes): void;
  (e: 'update'): void;
}
const emit = defineEmits<Emits>();
const detail = inject('detail') as any;
const visible = ref(false);
const handleBtn = (type: StatusBtnTypes) => {
  emit('handle', type);
};
const allReport = inject('allReport') as any;
const previewUrl = computed(() => {
  const kbyClientUrl = ref(import.meta.env.VITE_APP_IIPTO_CLIENT_URL);
  const sgClientUrl = ref(import.meta.env.VITE_APP_IIPTO_SG_CLIENT_URL);
  const enterpriseId = useStore().enterprise.record.id;
  // 预览报告地址区分跨标云、卖家成长商标
  const host = enterpriseId === 30 ? kbyClientUrl.value : sgClientUrl.value;
  if (allReport.value) {
    const { id: linkId, recordId } = allReport.value;
    return `${host}client/trademarkNameReviewReport?recordId=${recordId}&linkId=${linkId}&type=preview`;
  } else {
    return '';
  }
});

const confirmVisible = ref(false);
const formData = ref<any>({
  userConfirmStatus: null,
  remark: '',
  remarkUrl: [],
});
const ruleFormRef = ref<any>();
watch(confirmVisible, newVal => {
  if (newVal) {
    ruleFormRef.value?.resetFields();
    formData.value = {
      userConfirmStatus: null,
      remark: null,
      remarkUrl: [],
    };
  }
});
// 提交
const handleUserConfirm = () => {
  emit('update');
  ruleFormRef.value?.validate().then(() => {
    const imgs = formData.value.remarkUrl.map((item: any) => {
      if (item.url) {
        return item.url;
      } else {
        return item.response.data.fileUrl;
      }
    });
    handleReportConfirm({
      userConfirmStatus: formData.value.userConfirmStatus,
      id: allReport.value.id,
      trademarkSearchRecordRemarkAddDTO: {
        remark: formData.value.remark,
        recordId: detail.value.id,
        remarkType: 'Customer_Communication_Record',
        remarkUrl: imgs.join(','),
      },
    }).then(res => {
      confirmVisible.value = false;
      message.success('操作成功');
      emit('update');
    });
  });
};
</script>
<style lang="less" scoped>
.status-info {
  padding: 20px 10px;
  background: #fff;
  margin-bottom: 10px;
  h4 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  span {
    color: #999;
  }
  .button-group {
    .ant-btn {
      margin-left: 10px;
    }
  }
}
.modal-wrap {
  .tips {
    color: red;
  }
  .upload-tips {
    color: #999;
    font-size: 12px;
    margin-left: 15px;
  }
  :deep(.ant-form-item) {
    margin-bottom: 32px;
  }
}
</style>
