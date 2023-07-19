<template>
  <a-modal
    title="分佣比例配置（佣金=分享订单金额*分佣比例）"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="使用范围">
          <a-radio-group v-model:value="formModal.type" name="type">
            <a-radio value="1">默认</a-radio>
            <a-radio value="2">部分商品</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="选择佣金比列分类"
          name="productCategoryId"
          :rules="[{ required: true, message: '请选择佣金比列分类' }]"
          v-if="formModal.type == 2"
        >
          <a-select
            v-model:value="formModal.productCategoryId"
            placeholder="请选择"
            showSearch
            optionFilterProp="label"
          >
            <a-select-option :value="item.value" :key="index" v-for="(item, index) in data.goodsList">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="代言人分佣比例"
          name="spokesmanPercentage"
          :rules="[{ required: true, message: '请输入代言人分佣比' }]"
        >
          <a-input-number v-model:value="formModal.spokesmanPercentage" placeholder="请输入" :min="0" :max="100" />
        </a-form-item>
        <a-form-item
          label="代理人分佣比例"
          name="agentPercentage"
          :rules="[{ required: true, message: '请输入代理人分佣比例' }]"
        >
          <a-input-number v-model:value="formModal.agentPercentage" placeholder="请输入" :min="0" :max="100" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, reactive } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { saveUpdate } from '@/api/customerManage/distribution';
import { message } from 'ant-design-vue';
import { useStore } from '@/stores/store';
import { getAllCategory } from '@/api/base/basicsData';
//传入参数
const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);

const showModal = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>();
const formModal: any = ref({});
const data: any = reactive({
  goodsList: [], //国家选项
});
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        spokesmanPercentage: props.record.spokesmanPercentage || '',
        productCategoryId: props.record.productCategoryId == -1 ? '' : props.record.productCategoryId,
        agentPercentage: props.record.agentPercentage || '',
        drpId: props.record.drpId || '',
        status: props.record.status || '',
        type: props.record.productCategoryId == -1 || !props.record.productCategoryId ? '1' : '2',
      };
    });
    getGoodsList();
  } else {
    ruleFormRef.value?.resetFields();
    formModal.value = {};
  }
});

//获取分类
const getGoodsList = () => {
  getAllCategory({
    current: 1,
    size: 100,
    status: 'ENABLE',
  }).then((res: any) => {
    data.goodsList = (res.records || []).map((v: any) => {
      return {
        value: v.id,
        label: v.categoryName,
      };
    });
  });
};

//提交
const submit = () => {
  ruleFormRef.value?.validate().then(() => {
    formModal.value.productCategoryName = data.goodsList.find(
      (v: { value: string }) => v.value === formModal.value.productCategoryId
    )?.label;
    let res: any = null;
    const json: any = {
      enterpriseId: useStore().enterprise.record.id,
      spokesmanPercentage: formModal.value.spokesmanPercentage,
      agentPercentage: formModal.value.agentPercentage,
      productCategoryName: formModal.value.type == '1' ? '' : formModal.value.productCategoryName,
      productCategoryId: formModal.value.type == '1' ? -1 : formModal.value.productCategoryId,
    };
    if (props.record.drpId) {
      json.drpId = formModal.value.drpId;
      json.status = formModal.value.status;
    }
    res = saveUpdate(json);
    res.then((res: any) => {
      showModal.value = false;
      message.success('操作成功');
      emit('submit');
    });
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 56vh;
  overflow-y: auto;
  padding: 0 10px;
  .tips-text {
    color: #ffc100;
  }
}
</style>
