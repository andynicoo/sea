<template>
  <a-modal
    :title="record.id ? '编辑' : '新增'"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="工单类型" name="workOrderType" :rules="[{ required: true, message: '请选择工单类型' }]">
          <a-cascader
            v-model:value="data.workOrderTypeArr"
            :options="data.workOrderList"
            placeholder="请选择"
            :fieldNames="{
              label: 'name',
              value: 'code',
              children: 'children',
            }"
            allowClear
            showSearch
            @change="changeWorkOrder"
          ></a-cascader>
        </a-form-item>
        <a-form-item label="国家" name="countryCode" :rules="[{ required: true, message: '请选择国家' }]">
          <a-select
            v-model:value="formModal.countryCode"
            :options="data.countryList"
            placeholder="请选择"
            showSearch
            optionFilterProp="label"
            style="width: 220px"
          >
            <a-select-option value="DAY">天</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时效单位" name="timeUnit" :rules="[{ required: true, message: '请选择时效单位' }]">
          <a-select v-model:value="formModal.timeUnit" placeholder="请选择" style="width: 220px">
            <a-select-option value="DAY">天</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="监控区间">
          <div>{{ workOrderTypeFilter(formModal.workOrderType) }}</div>
        </a-form-item>
        <a-form-item label="预警时效" name="warnDuration" :rules="[{ required: true, message: '请输入预警时效' }]">
          <a-input-number v-model:value="formModal.warnDuration" placeholder="请输入" :min="1" addon-after="天" />
        </a-form-item>
        <a-form-item label="交付时效" name="deliverDuration" :rules="[{ required: true, message: '请输入交付时效' }]">
          <a-input-number v-model:value="formModal.deliverDuration" placeholder="请输入" :min="1" addon-after="天" />
        </a-form-item>
        <div class="tips-text">提示：预警时效小于交付时效，且都是大于0的正整数</div>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue';
import { monitorEnum } from '../config';
import { saveConfig, editConfig } from '@/api/dataCenter/supplierConfig';
import { getCountrySelectList, listByCategory } from '@/api/base/basicsData';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';

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
  workOrderList: [], //工单选项
  countryList: [], //国家选项
  workOrderTypeArr: [],
});

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getWorkOrderList();
      getCountryList();
      formModal.value = {
        // id: props.record.id || null,
        workOrderType: props.record.workOrderType ? String(props.record.workOrderType) : null,
        countryCode: props.record.countryCode || null,
        countryName: props.record.countryName || null, //国家名称
        timeUnit: props.record.timeUnit || null,
        warnDuration: props.record.warnDuration || null,
        deliverDuration: props.record.deliverDuration || null,
      };
    });
  } else {
    data.workOrderTypeArr = [];
    ruleFormRef.value?.resetFields();
    formModal.value = {};
  }
});

//提交
const submit = () => {
  ruleFormRef.value?.validate().then(() => {
    if (formModal.value.warnDuration >= formModal.value.deliverDuration) {
      message.error('交付时效要大于预警时效！');
      return false;
    }
    formModal.value.countryName = data.countryList.find(
      (v: { value: string }) => v.value === formModal.value.countryCode
    )?.label;
    let res: any = null;
    if (props.record.id) {
      res = editConfig(
        {
          id: props.record.id,
        },
        formModal.value
      );
    } else {
      res = saveConfig(formModal.value);
    }
    res.then((res: any) => {
      showModal.value = false;
      message.success('操作成功');
      emit('submit');
    });
  });
};

//获取工单数据
const getWorkOrderList = () => {
  listByCategory().then((res: any) => {
    const idArr = monitorEnum.map((v: any) => String(v.id));
    data.workOrderList = (res || [])
      .map((v: any) => {
        return {
          code: 'p1_' + v.id,
          name: v.name,
          children: (v.workFunctionList || []).filter((c: { code: string }) => idArr.indexOf(c.code) !== -1),
        };
      })
      .filter((v: any) => v.children.length > 0);
    if (formModal.value.workOrderType) {
      const parent = data.workOrderList.find((v: any) => {
        const idArr = v.children.map((v: { code: string }) => v.code);
        return idArr.indexOf(formModal.value.workOrderType) !== -1;
      });
      data.workOrderTypeArr = [parent.code, formModal.value.workOrderType];
    }
  });
};

//获取国家数据
const getCountryList = () => {
  getCountrySelectList().then((res: any) => {
    data.countryList = (res || []).map((v: { countryCode: string; countryNameZh: string }) => {
      return {
        value: v.countryCode,
        label: v.countryNameZh,
      };
    });
  });
};

//改变工单类型
const changeWorkOrder = (val: Array<string>) => {
  formModal.value.workOrderType = val[1];
};

//监控区间过滤
const workOrderTypeFilter = (key: number) => {
  const record = monitorEnum.find((v: { id: number }) => v.id == key);
  return record ? record.section : '-';
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
