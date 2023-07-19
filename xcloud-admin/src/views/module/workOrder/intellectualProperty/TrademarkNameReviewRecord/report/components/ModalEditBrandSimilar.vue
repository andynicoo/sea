<template>
  <a-modal v-model:visible="visible" title="修改近似商标" @cancel="close" :maskClosable="false" :centered="true">
    <a-form ref="formRef" :model="formData">
      <a-form-item
        label="商标名称"
        :colon="false"
        :labelCol="{ span: 24 }"
        name="name"
        :rules="[{ required: true, message: '商标名称不能为空' }]"
      >
        <a-select
          @search="handleSearch"
          placeholder="请搜索商标名称"
          v-model:value="formData.name"
          :showSearch="true"
          :filter-option="false"
          :options="options"
          style="width: 80%"
        >
          <template #suffixIcon><SearchOutlined /></template>
        </a-select>
      </a-form-item>
      <template v-if="curTrademark">
        <a-form-item>
          <dl>
            <dt>商标受理号</dt>
            <dd>{{ curTrademark.remarkNumber }}</dd>
          </dl>
        </a-form-item>
        <a-form-item>
          <dl>
            <dt>商标大类</dt>
            <dd>
              <template v-if="curTrademark.trademarkCategoryList.length">
                <span v-for="(cate, index) in curTrademark.trademarkCategoryList" :key="index"
                  >{{ cate.categoryName
                  }}{{ index === curTrademark.trademarkCategoryList.length - 1 ? '' : '，' }}</span
                >
              </template>
              <template v-else> -- </template>
            </dd>
          </dl>
        </a-form-item>
        <a-form-item>
          <dl>
            <dt>商标申请人</dt>
            <dd>{{ curTrademark.ownerName }}</dd>
          </dl>
        </a-form-item>
      </template>
    </a-form>
    <template #footer>
      <a-button @click="close">取消</a-button>
      <a-button type="primary" :loading="loading" @click="handleOk">提交</a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { getPrefixTrademarkName } from '@/api/workOrder/intellectualProperty/trademark';
import _ from 'lodash';

interface Emits {
  (e: 'close'): void;
  (e: 'change', v: any): void;
}
const emit = defineEmits<Emits>();
const props = defineProps({
  keyWord: {
    type: String,
    default: '',
  },
});
const visible = ref(true);
const loading = ref(false);
const formRef = ref<FormInstance>();
const formData = reactive({
  name: '',
});
const prefixList = ref<any>([]);
const options = ref<any>([]);
const data = reactive({
  comCategoryNum: inject('comCategoryNum') as string,
  useTableType: inject('useTableType') as string,
});
const handleSearch = _.debounce(async value => {
  if (!value) return;
  const params: any = {
    country: 'US',
    keyWord: value,
    pageSize: 50,
  };
  if (data.useTableType === 'com') {
    params.categoryNum = data.comCategoryNum;
  }
  const res = await getPrefixTrademarkName(params);
  prefixList.value = res;
  if (res?.length) {
    options.value = res.map((item: any) => {
      return {
        value: item.id,
        label: item.similarRemark,
      };
    });
  }
}, 300);
const curTrademark = computed(() => {
  if (prefixList.value.length && formData.name) {
    return prefixList.value.filter((item: any) => item.id === formData.name)[0];
  } else {
    return null;
  }
});
const handleOk = async () => {
  await formRef.value?.validate();
  emit('change', curTrademark.value);
  emit('close');
};
const close = () => {
  emit('close');
};
</script>
<style lang="less" scoped>
dd {
  font-size: 12px;
  color: #666;
}
</style>
