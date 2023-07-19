<template>
  <slot v-if="showButton">
    <a-button type="primary" :size="btnSize" @click="openModal()">{{ btnText }}</a-button>
  </slot>
  <a-modal
    title="修改律师"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="选择新律师" name="attorenyId" :rules="[{ required: true, message: '请选择新律师' }]">
          <a-select
            v-model:value="formModal.attorenyId"
            placeholder="请选择新律师"
            allowClear
            showSearch
            optionFilterProp="label"
          >
            <a-select-option v-for="(li, index) of data.supplierList" :key="index" :value="li.id" :label="li.shortName">
              {{ li.shortName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="原律师服务费" name="consumed" :rules="[{ required: true, message: '请选择原律师服务费' }]">
          <div style="padding: 5px 0">
            <a-radio-group v-model:value="formModal.consumed">
              <a-radio :value="true">已产生服务费</a-radio>
              <a-radio :value="false">未产生服务费</a-radio>
            </a-radio-group>
          </div>
          <div class="text-warning">选择已产生服务费时，会另外生成一条转代理工单</div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { h, nextTick, reactive, ref, watch } from 'vue';
import { message, Modal, type FormInstance } from 'ant-design-vue';
import { batchUpdAttorneyApi, getSupplierList } from '@/api/workOrder/intellectualProperty/trademark';
import { textCopy } from '@/utils/utils';

const props = defineProps({
  btnText: {
    type: String,
    default: '按钮名称',
  },
  btnSize: {
    type: String,
    default: 'middle',
  },
  serviceIds: {
    type: String,
    default: '',
  },
  countryCode: {
    type: String,
    default: '',
  },
  functionCode: {
    type: String,
    default: '61',
  },
  showButton: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['submit']);

const data: any = reactive({
  supplierList: [], //律师
});
const formModal: any = ref({});
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getSupplierListFun();
      formModal.value = {
        serviceId: props.serviceIds,
        attorenyId: null,
        consumed: false,
        isInit: false,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//打开模态框
const openModal = () => {
  showModal.value = true;
};

//提交确认
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    Modal.confirm({
      title: '提示',
      width: 500,
      content: '确认进行更换律师信息吗？',
      onOk() {
        return new Promise(resolve => {
          submitForm(resolve);
        });
      },
    });
  });
};

//提交
const submitForm = (resolveFun: any) => {
  batchUpdAttorneyApi(formModal.value)
    .then((res: any) => {
      resolveFun(true);
      if (res && res.data) {
        message.success('操作成功');
        showModal.value = false;
        emit('submit');
        if (res.data.length > 0) {
          const arr = [h('p', '新的转代理工单为：')];
          for (const li of res.data) {
            arr.push(h('p', li));
          }
          Modal.success({
            title: '律师修改成功',
            okText: '复制服务号并关闭弹窗',
            content: h('div', {}, arr),
            onOk() {
              return new Promise(resolve => {
                textCopy(res.data.join(','));
                resolve(true);
              });
            },
          });
        }
      } else {
        Modal.confirm({
          title: '确认更换律师',
          width: 500,
          content: '现有数据与更换律师数据不相符，将初始化工单信息，确认进行操作吗？',
          onOk() {
            return new Promise(resolve => {
              submitForm(resolve);
            });
          },
        });
      }
    })
    .catch(() => {
      resolveFun(true);
    });
};

//获取供应商 、律师
const getSupplierListFun = () => {
  getSupplierList({
    supplierType: 2,
    functionCode: props.functionCode,
    countryCode: props.countryCode,
    countryCodeList: [props.countryCode],
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
  .text-warning {
    color: #ffc100;
  }
}
</style>
