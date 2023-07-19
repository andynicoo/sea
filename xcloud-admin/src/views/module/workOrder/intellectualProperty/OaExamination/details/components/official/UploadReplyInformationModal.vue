<template>
  <a-modal
    title="代客户上传答复材料"
    width="800px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="客户答复截止日期"> {{ record.lastDealDate }} </a-form-item>
        <a-form-item label="翻译OA"> {{ record.interpretFileContent }} </a-form-item>
        <a-form-item label="审查意见翻译文件">
          <div v-if="schemeList.length > 0">
            <div v-for="(item, index) in schemeList" :key="index">
              <a
                v-if="record.fileUrl"
                :href="record.fileUrl"
                target="_blank"
                style="word-break: keep-all; color: #00a3ff"
              >
                {{ item.oldFileName }}
              </a>
              <span v-else>-</span>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="OA处理方案" name="replyId" :rules="[{ required: true, message: '请选择OA处理方案' }]">
          <div
            class="scheme-cell"
            v-for="(li, index) of planList"
            :key="index"
            @click="choosePlan(li)"
            :class="{ active: formModal.replyId === li.id }"
          >
            <div class="icon-wrap">
              <CheckCircleFilled />
            </div>
            <div class="scheme-title">
              <span class="text">方案{{ index + 1 }}</span>
            </div>
            <div class="scheme-wrap">
              <div class="scheme-tips">答复建议</div>
              <div class="scheme-text">
                {{ li.planInfo.replyStr }}
              </div>
              <div class="scheme-tips">答复审查意见服务商品</div>
              <a-table
                size="small"
                :data-source="li.planInfo.oaServiceList"
                :pagination="false"
                bordered
                :locale="{ emptyText: '无需OA付费' }"
              >
                <a-table-column :width="80" title="国家" data-index="oaCountry" />
                <a-table-column :width="80" title="售价" data-index="oaPrice" />
                <a-table-column title="服务商品" data-index="evidenceComboName" />
              </a-table>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="答复资料">
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

  <a-modal v-model:visible="showPaymentLink" title="操作成功" :footer="false">
    <p>付款链接：{{ paymentLink || '-' }}</p>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import Upload from '@/components/upload/Upload.vue';
import { getFileDetails, replaceMaterials, getPaymentLink } from '@/api/workOrder/intellectualProperty/oaExamination';
import { message, type FormInstance } from 'ant-design-vue';
import { CheckCircleFilled } from '@ant-design/icons-vue';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);

const formModal: any = ref({});
const showModal = ref(false);
const schemeList: any = ref([]);
const planList: any = ref([]);
const showPaymentLink = ref(false);
const paymentLink = ref('');

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getPlanList();
      if (props.record.hlepDocument) {
        schemeList.value = JSON.parse(props.record.hlepDocument);
      }
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
    replaceMaterials(formModal.value).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
      if (res.id) {
        getPaymentLinkFun(res.id);
      }
    });
  });
};

//获取付款链接弹窗提示
const getPaymentLinkFun = (id: any) => {
  getPaymentLink({
    id: id,
  }).then((res: any) => {
    paymentLink.value = res.orderPayUrl;
    showPaymentLink.value = true;
  });
};

//选择方案
const choosePlan = (li: any) => {
  formModal.value.replyId = li.id;
  formModal.value.planJson = JSON.stringify(li.planInfo);
};

//上传图片
const submitUrl = (url: string) => {
  formModal.value.fileUrl = url;
};

//获取方案
const getPlanList = () => {
  getFileDetails({
    id: props.record.id,
  }).then((res: any) => {
    planList.value = res.planList
      .map((item: { planInfo: string }) => {
        if (item.planInfo != '') {
          item.planInfo = JSON.parse(item.planInfo);
        }
        return item;
      })
      .filter((item: { planInfo: string }) => item.planInfo != '');
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
  .scheme-cell {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    .icon-wrap {
      display: none;
    }
    .scheme-title {
      border-bottom: 1px solid #ccc;
      padding: 4px;
      .text {
        font-weight: bold;
      }
    }
    .scheme-wrap {
      .scheme-tips {
        color: #999;
        margin: 4px 0;
      }
      .scheme-text {
        margin-bottom: 10px;
      }
    }
  }
  .scheme-cell.active {
    position: relative;
    border: 1px solid #1890ff;
    .icon-wrap {
      display: block;
      position: absolute;
      right: 10px;
      top: 4px;
      z-index: 1;
      font-size: 24px;
      color: #1890ff;
    }
  }
}
</style>
