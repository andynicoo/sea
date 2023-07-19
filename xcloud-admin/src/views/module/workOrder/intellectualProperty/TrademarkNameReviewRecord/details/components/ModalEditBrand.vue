<template>
  <a-modal v-model:visible="visible" title="修改商标核名信息" @cancel="close" width="900px">
    <a-form ref="formRef" :model="formData" :rules="rules" :labelCol="{ span: 4 }">
      <a-row>
        <a-col :span="12">
          <a-form-item label="商标名称" name="name" :labelCol="{ span: 8 }">
            <a-input v-model:value="formData.name"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="国家" name="country" :labelCol="{ span: 6 }">
            <a-select v-model:value="formData.country" :options="countryList"></a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="类别（最多十个）" name="types">
        <a-select
          v-model:value="formData.types"
          :options="cateList"
          :maxTagCount="10"
          mode="multiple"
          @change="onChange"
        ></a-select>
      </a-form-item>
      <a-form-item label="是否有商标含义" name="remark">
        <a-textarea v-model:value="formData.remark" type="textarea"></a-textarea>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="close">取消</a-button>
      <a-button type="primary" :loading="loading" @click="onOk">提交</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue/lib/form/Form';
import type { Rule } from 'ant-design-vue/lib/form/interface';
import { ref, reactive, onMounted, inject } from 'vue';
import { getCountrySelectList } from '@/api/base/basicsData';
import { getAllCategoryList, EditTrademarkRecord } from '@/api/workOrder/intellectualProperty/trademark';
import { message } from 'ant-design-vue';

interface Emits {
  (e: 'close'): void;
  (e: 'update'): void;
}
const emit = defineEmits<Emits>();
const visible = ref(true);
const formData = reactive<any>({
  name: '',
  country: '',
  types: [],
  remark: '',
});
const detail = inject('detail') as any;
const cateList = ref<any>([]);
const countryList = ref<any>([]);
const formRef = ref<FormInstance>();
const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '商标名称不能为空', trigger: 'change' }],
  country: [{ required: true, message: '国家不能为空', trigger: 'change' }],
  types: [{ required: true, message: '类别不能为空', trigger: 'change' }],
};
const loading = ref(false);
const close = () => {
  emit('close');
};
const onOk = async () => {
  await formRef.value?.validate();
  loading.value = true;
  try {
    const params = {
      id: detail.value.id,
      enterpriseId: detail.value.enterpriseId,
      country: formData.country,
      trademarkMeaning: formData.remark,
      trademarkCategoryNums: formData.types.join(','),
      trademarkName: formData.name,
    };
    await EditTrademarkRecord(params);
    loading.value = false;
    message.success('提交成功');
    emit('close');
    emit('update');
  } catch (error) {
    loading.value = false;
  }
};
const getInt = async () => {
  if (detail.value) {
    formData.name = detail.value.trademarkName;
    formData.country = detail.value.country;
    formData.types = detail.value.trademarkCategories.map((item: any) => item.categoryNum);
    formData.remark = detail.value.trademarkMeaning;
  }
  const cateRes = await getAllCategoryList();
  if (cateRes.length) {
    cateList.value = cateRes.map((item: any) => {
      const temp = {
        value: item.categoryNum,
        label: item.categoryNum + '类 ' + item.categoryName,
        disabled: false,
      };
      return temp;
    });
  }
  const countryRes: any = await getCountrySelectList();
  if (countryRes.length) {
    countryList.value = countryRes.map((item: any) => {
      const temp = {
        value: item.countryCode,
        label: item.countryNameZh,
      };
      return temp;
    });
    // 初始化选项判断禁用
    onChange();
  }
};
const onChange = () => {
  if (formData.types.length > 9) {
    cateList.value.forEach((item: any) => {
      if (formData.types.includes(item.value)) {
        item.disabled = false;
      } else {
        item.disabled = true;
      }
    });
  } else {
    cateList.value.forEach((item: any) => {
      item.disabled = false;
    });
  }
};
onMounted(() => {
  getInt();
});
</script>
<style lang="less" scoped></style>
