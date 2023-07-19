<template>
  <a-modal
    title="代客户再次上传答复材料"
    width="800px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <div class="scheme-wrap">
          <div class="scheme-title">客户选择的答复方案</div>
          <div class="scheme-tips">答复建议</div>
          <div class="scheme-text">
            {{ data.planInfo.replyStr || '无答复建议' }}
          </div>
          <div class="scheme-tips">答复审查意见服务商品</div>
          <a-table
            size="small"
            :data-source="data.planInfo.oaServiceList"
            :pagination="false"
            bordered
            :locale="{ emptyText: '无服务商品' }"
          >
            <a-table-column :width="100" title="国家" data-index="oaCountry" />
            <a-table-column :width="100" title="售价" data-index="oaPrice" />
            <a-table-column :width="200" title="服务商品" data-index="evidenceComboName" />
          </a-table>
        </div>
        <div class="scheme-wrap">
          <div class="scheme-title">审查意见答复资料</div>
          <div class="scheme-tips">答复资料</div>
          <div class="scheme-text">
            <FileLink :fileUrl="data.resData.answerFile" fileName="审查意见答复资料.zip" />
          </div>
          <div class="scheme-tips">备注</div>
          <div class="scheme-text">
            {{ data.resData.remark || '-' }}
          </div>
        </div>
        <div class="scheme-wrap" v-if="record.rejectReason">
          <div class="scheme-title">驳回原因</div>
          <div class="scheme-tips">原因</div>
          <div class="scheme-text">
            {{ record.rejectReason || '-' }}
          </div>
          <div class="scheme-tips">附件</div>
          <div class="scheme-text">
            <FileLink :fileUrl="record.rejectFile" fileName="驳回原因附件.pdf" />
          </div>
        </div>

        <a-form-item label="答复资料" name="fileUrl" :rules="[{ required: true, message: '请上传答复资料' }]">
          <Upload accept="application/zip" @submitUrl="submitUrl" :fileSize="100" />
          <div style="margin-top: 8px" v-if="formModal.fileUrl">
            {{ formModal.fileUrl.split('/')[formModal.fileUrl.split('/').length - 1] }}
          </div>
          <div>提示：仅支持大小不超过100MB的ZIP格式文件</div>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formModal.remark" placeholder="请输入备注" show-count :maxlength="500" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import Upload from '@/components/upload/Upload.vue';
import FileLink from '@/components/assembly/FileLink.vue';
import { replaceMaterialsAgign, getOaTrademarkReplyPlan } from '@/api/workOrder/intellectualProperty/oaExamination';
import { message, type FormInstance } from 'ant-design-vue';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showModal = ref(false);
const data: any = reactive({
  resData: {},
  planInfo: {},
});

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getOaTrademarkReplyPlanFun();
      formModal.value = {
        chooseService: 0,
        chooseSource: 2,
        oaFileId: props.record.id,
        replyId: null,
        planJson: null,
        fileUrl: null,
        remark: null,
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
    replaceMaterialsAgign(formModal.value).then((res: any) => {
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

//获取答复信息
const getOaTrademarkReplyPlanFun = () => {
  getOaTrademarkReplyPlan({ oaId: props.record.id }).then((res: any) => {
    data.resData = res || {};
    data.planInfo = JSON.parse(res.planInfo);
    formModal.value.replyId = res.id;
    formModal.value.planJson = res.planInfo;
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 10px;
  max-height: 60vh;
  overflow-y: auto;
  .scheme-wrap {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #f1f1f1;
    border-radius: 4px;
    .scheme-title {
      font-size: 15px;
      font-weight: bold;
    }
    .scheme-tips {
      color: #999;
      margin: 4px 0;
    }
    .scheme-text {
      margin-bottom: 10px;
    }
  }
}
</style>
