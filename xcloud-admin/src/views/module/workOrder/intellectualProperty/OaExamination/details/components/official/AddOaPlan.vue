<template>
  <a-modal
    title="答复审查意见处理方案"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="data" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="答复建议" name="replyStr" :rules="[{ required: true, message: '请输入答复建议' }]">
          <a-textarea v-model:value="data.replyStr" placeholder="请输入翻译OA内容" show-count :maxlength="500" />
        </a-form-item>

        <a-form-item label="OA处理方案">
          <a-table size="small" :data-source="data.oaServiceList" :pagination="false" bordered>
            <a-table-column :width="100" title="国家" #default="{ record }">
              {{ record.oaCountry || '-' }}
            </a-table-column>
            <a-table-column :width="100" title="售价" #default="{ record }">
              {{ record.oaPrice || '-' }}
            </a-table-column>
            <a-table-column title="服务商品" #default="{ record }">
              <a-select
                v-model:value="record.productId"
                placeholder="请选择服务"
                allowClear
                style="width: 220px; margin-bottom: 10px"
                @change="changeSelect($event, record)"
              >
                <a-select-option
                  v-for="(li, index) of data.selectList"
                  :key="index"
                  :value="li.id"
                  :label="li.productName"
                >
                  {{ li.productName }}
                </a-select-option>
              </a-select>
              <a-select
                v-model:value="record.productSkuId"
                placeholder="请选择服务项目"
                allowClear
                style="width: 220px"
                @change="changeSelectChild($event, record)"
              >
                <a-select-option
                  v-for="(li, index) of data.selectChildList"
                  :key="index"
                  :value="li.id"
                  :label="li.specsName"
                >
                  {{ li.specsName }}
                </a-select-option>
              </a-select>
            </a-table-column>
          </a-table>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import { getproductInfoList } from '@/api/base/basicsData';
import { addTrademarkReplyPlan } from '@/api/workOrder/intellectualProperty/oaExamination';
import { message, Modal, type FormInstance } from 'ant-design-vue';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});
const emit = defineEmits(['submit']);
const showModal = ref(false);
const data: any = reactive({
  selectList: [],
  selectChildList: [],
  replyStr: null,
  oaServiceList: [],
});
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getPlanList();
      data.replyStr = null;
      data.oaServiceList = [
        {
          productId: null,
          oaCountry: null,
          oaServiceName: null,
          skuId: null,
          productSkuId: null,
          oaPrice: null,
          evidenceComboName: null,
        },
      ];
    });
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    Modal.confirm({
      title: '提示',
      content: '确认采用此方案？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        return new Promise<void>((resolve, reject) => {
          addTrademarkReplyPlan({
            serviceId: props.record.serviceId,
            workId: props.record.workId,
            oaFileId: props.record.id,
            planInfo: JSON.stringify({
              replyStr: data.replyStr,
              oaServiceList: data.oaServiceList[0].productSkuId ? data.oaServiceList : [],
              otherServiceList: [],
            }),
          }).then((res: any) => {
            message.success('操作成功');
            showModal.value = false;
            emit('submit');
          });
          resolve();
        });
      },
    });
  });
};

//改变服务
const changeSelect = (value: any, li: any) => {
  const record = data.selectList.find((v: { id: string }) => v.id === value);
  if (record) {
    li.productId = record.id;
    li.oaCountry = record.countryCodeName;
    li.oaServiceName = record.productName;
    data.selectChildList = record.productSpecsDTOList || [];
  } else {
    li.productId = null;
    li.oaCountry = null;
    li.oaServiceName = null;
    data.selectChildList = [];
  }
  changeSelectChild(null, li);
};

//改变服务项目
const changeSelectChild = (value: any, li: any) => {
  const record = data.selectChildList.find((v: { id: string }) => v.id === value);
  if (record) {
    li.skuId = record.id;
    li.productSkuId = record.id;
    li.oaPrice = record.servicePrice;
    li.evidenceComboName = li.oaServiceName + '-' + record.specsName;
  } else {
    li.skuId = null;
    li.productSkuId = null;
    li.oaPrice = null;
    li.evidenceComboName = null;
  }
};

//获取方案
const getPlanList = () => {
  getproductInfoList({
    functionCode: 200,
    isCombinationProduct: 'NOT_COMBINATION_PRODUCT',
  }).then((res: any) => {
    data.selectList = res.records || [];
    data.selectChildList = [];
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
}
</style>
