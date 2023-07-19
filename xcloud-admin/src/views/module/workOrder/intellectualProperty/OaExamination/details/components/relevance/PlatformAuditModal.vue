<template>
  <a-modal
    title="平台审核"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
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
            <FileLink :fileUrl="record.answerFile" fileName="审查意见答复资料.zip" />
          </div>
          <div class="scheme-tips">备注</div>
          <div class="scheme-text">
            {{ data.resData.remark || '-' }}
          </div>
        </div>

        <a-form-item label="平台审核">
          <a-radio-group v-model:value="formModal.operationType">
            <a-radio :value="2">审核通过</a-radio>
            <a-radio :value="1">审核不通过</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否需要签署授权书" v-if="formModal.operationType === 2">
          <a-radio-group v-model:value="formModal.signAuthorization">
            <a-radio :value="true">签署</a-radio>
            <a-radio :value="false">不签署</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="授权书模板文件"
          name="authorizationTemplateFile"
          :rules="[{ required: true, message: '请上传文件' }]"
          v-if="formModal.operationType === 2 && formModal.signAuthorization"
        >
          <Upload accept="application/pdf" @submitUrl="submitUrl($event, 'authorizationTemplateFile')" />
          <div style="margin-top: 8px" v-if="formModal.authorizationTemplateFile">
            {{
              formModal.authorizationTemplateFile.split('/')[formModal.authorizationTemplateFile.split('/').length - 1]
            }}
          </div>
          <div class="form-tips">请上传PDF文档，客户可下载并签字</div>
        </a-form-item>
        <a-form-item
          label="授权书示例文件"
          name="authorizationExampleFile"
          :rules="[{ required: true, message: '请上传文件' }]"
          v-if="formModal.operationType === 2 && formModal.signAuthorization"
        >
          <Upload accept="application/pdf" @submitUrl="submitUrl($event, 'authorizationExampleFile')" />
          <div style="margin-top: 8px" v-if="formModal.authorizationExampleFile">
            {{
              formModal.authorizationExampleFile.split('/')[formModal.authorizationExampleFile.split('/').length - 1]
            }}
          </div>
          <div class="form-tips">请上传PDF文档，指引客户签署授权书</div>
        </a-form-item>

        <a-form-item
          label="驳回原因"
          name="reason"
          :rules="[{ required: true, message: '请输入驳回原因' }]"
          v-if="formModal.operationType === 1"
        >
          <a-textarea v-model:value="formModal.reason" placeholder="请输入驳回原因" show-count :maxlength="500" />
        </a-form-item>
        <a-form-item label="驳回原因附件" v-if="formModal.operationType === 1">
          <Upload accept="application/pdf" @submitUrl="submitUrl($event, 'rejectFile')" />
          <div style="margin-top: 8px" v-if="formModal.rejectFile">
            {{ formModal.rejectFile.split('/')[formModal.rejectFile.split('/').length - 1] }}
          </div>
          <div class="form-tips">请上传PDF文档，便于客户查看驳回原因</div>
        </a-form-item>
        <a-form-item
          label="客户截止日期"
          name="customerDeadDate"
          :rules="[{ required: true, message: '请选择客户截止日期' }]"
          v-if="(formModal.operationType === 2 && formModal.signAuthorization) || formModal.operationType === 1"
        >
          <a-date-picker
            v-model:value="formModal.customerDeadDate"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 220px"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import Upload from '@/components/upload/Upload.vue';
import FileLink from '@/components/assembly/FileLink.vue';
import {
  getOaTrademarkReplyPlan,
  materials,
  rejectMaterials,
} from '@/api/workOrder/intellectualProperty/oaExamination';

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
        oaFileId: props.record.id,
        serviceId: props.record.serviceId, //服务id
        operationType: 2, //操作类型 1-平台驳回 2-平台审核通过 3-律师驳回 4-律师审核通过 5-仅驳回使用证据
        signAuthorization: true, //是否需要签署授权书 默认（是）
        authorizationTemplateFile: null, //授权书模板文件
        authorizationExampleFile: null, //授权书示列文件

        reason: null, //驳回原因
        rejectFile: null, //驳回原因附件
        customerDeadDate: null, //客户截止日期
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value
    ?.validate()
    .then(() => {
      const params = JSON.parse(JSON.stringify(formModal.value));
      if (params.customerDeadDate) {
        params.customerDeadDate = params.customerDeadDate.split(' ')[0] + ' 23:59:59';
      }
      let res: any = null;
      if (params.operationType === 1) {
        res = rejectMaterials(params);
      } else if (params.operationType === 2) {
        res = materials(params);
      }
      res.then((res: any) => {
        message.success('操作成功');
        showModal.value = false;
        emit('submit');
      });
    })
    .catch((err: any) => {
      if (err && err.errorFields) {
        ruleFormRef.value?.scrollToField(err.errorFields[0].name);
      }
    });
};

//获取答复信息
const getOaTrademarkReplyPlanFun = () => {
  getOaTrademarkReplyPlan({ oaId: props.record.id }).then((res: any) => {
    data.resData = res || {};
    data.planInfo = JSON.parse(res.planInfo);
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
  .form-tips {
    font-size: 14px;
    line-height: 30px;
    color: #666;
  }
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
