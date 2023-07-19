<template>
  <a-modal
    title="修改服务商"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    :centered="true"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 13 }">
        <a-form-item label="国家"> {{ detailsInfo.countryNameZh || '-' }} </a-form-item>
        <a-form-item label="选择服务商" name="supplierId" :rules="[{ required: true, message: '请选择服务商' }]">
          <a-select
            v-model:value="formModal.supplierId"
            placeholder="请选择服务商"
            allowClear
            showSearch
            optionFilterProp="label"
          >
            <a-select-option v-for="(li, index) of data.supplierList" :key="index" :value="li.id" :label="li.shortName">
              {{ li.shortName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <div class="tips-text">变更服务商后，服务流程会刷新为新服务商流程</div>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { getSupplierList } from '@/api/workOrder/intellectualProperty/trademark';
import { changeSupplier } from '@/api/workOrder/vatServices/taxRegister';

const props = defineProps({
  detailsInfo: {
    type: Object,
    default: () => null,
  },
});
const emit = defineEmits(['submit']);

const data: any = reactive({
  supplierList: [], //服务商
});
const formModal: any = ref({});
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getSupplierListFun();
      formModal.value = {
        supplierId: null,
        workIdColl: [props.detailsInfo.workId],
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
    changeSupplier(formModal.value).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//获取 服务商
const getSupplierListFun = () => {
  getSupplierList({
    countryCodeList: [props.detailsInfo.countryCode],
    flow: true,
    functionCode: props.detailsInfo.functionCode,
    supplierType: 1,
  }).then((res: any) => {
    data.supplierList = res || [];
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 20px 0;
  .tips-text {
    line-height: 30px;
    text-align: center;
  }
}
</style>
