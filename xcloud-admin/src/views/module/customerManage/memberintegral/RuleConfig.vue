<template>
  <a-modal
    :title="'积分规则设置'"
    width="800px"
    :okText="'保存'"
    v-model:visible="visible"
    :maskClosable="false"
    :keyboard="false"
    :destroyOnClose="true"
    :confirmLoading="sending"
    @ok="submit"
  >
    <div class="zt-card">
      <a-spin :spinning="spinning">
        <a-form
          :model="data.formState"
          :rules="rules"
          name="basic"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          @validate="handleValidate"
          labelAlign="left"
          ref="formRef"
        >
          <h2>积分通用规则</h2>
          <a-form-item label="自定义名称" name="name" has-feedback>
            <a-input v-model:value="data.formState.name" :disabled="nameEditable" class="zt-w200" />
          </a-form-item>
          <a-form-item label="积分通用有效期" name="validityDay">
            <a-input-number v-model:value="data.formState.validityDay" class="zt-w100" disabled /><span class="zt-ml-1"
              >天</span
            >
          </a-form-item>

          <h2>积分奖励</h2>
          <template v-for="item in data.formState.integralConfigDetailVO" :key="item.integralTypeEnum">
            <div>
              <a-checkbox v-model:checked="item.statusBool">{{ item.testOne }}</a-checkbox>
              <a-form-item :label="item.testTwo" :name="item.integralTypeEnum" v-show="item.statusBool">
                <a-input-number v-model:value="item.integral" :min="0" :max="999999" /><span class="zt-ml-1">积分</span>
              </a-form-item>
            </div>
          </template>

          <!-- <a-form-item label="商品封面" name="img">
            <UploadBox v-model="data.formState.img" />
          </a-form-item> -->

          <h2>积分消耗</h2>
          <a-form-item label="兑换比例" name="integralProportion">
            <a-input-number v-model:value="data.formState.integralProportion" :min="1" :max="999999" /><span
              class="zt-ml-1"
              >积分=1元</span
            >
          </a-form-item>
          <a-form-item name="radio-button" label="积分抵现">
            <a-radio-group v-model:value="data.formState.integralOffsetBool" disabled>
              <a-radio :value="true">开启</a-radio>
              <a-radio :value="false">关闭</a-radio>
            </a-radio-group>
          </a-form-item>

          <h2>积分规则</h2>
          <a-form-item label="规则标题" name="title">
            <a-input v-model:value="data.formState.title" class="zt-w300" />
          </a-form-item>
          <a-form-item label="规则说明" name="remark">
            <div style="width: 600px">
              <Editor :html="valueHtml" ref="editorDom" />
            </div>
          </a-form-item>
        </a-form>
      </a-spin>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { reactive, ref, type Ref, onMounted, watch } from 'vue';
import Editor from '@/components/wangeditor/Editor.vue';
import UploadBox from '@/components/upload/UploadBox.vue';
import { setMemberConfig, getMemberConfig } from '@/api/customerManage/memberConfig';
import type { Rule } from 'ant-design-vue/es/form';
import router from '@/router';
const editorDom: Ref = ref(null);
const visible = ref<boolean>(false);

watch(visible, async (newVal: boolean) => {
  if (newVal) {
    spinning.value = true;
    await getMemberConfigData();
    spinning.value = false;
  }
});

interface MethodType {
  integralConfigDetailId: number | null;
  integralTypeEnum: string;
  integral: number;
  statusBool: boolean;
  testOne: string;
  testTwo: string;
}
interface FormState {
  name?: string;
  validityDay?: number;
  integralConfigDetailVO?: MethodType[];
  integralConfigDetailDTO?: MethodType[];
  integralConfigId?: number | null;
  integralOffsetBool?: boolean;
  integralProportion?: number;
  img?: string;
  title?: string;
  remark?: string | undefined;
}
interface DataType {
  formState: FormState;
}

const data = reactive<DataType>({
  formState: {
    name: '积分', //名称
    validityDay: 365, // 积分有效期 天
    integralConfigDetailVO: [],
    integralConfigId: null, // item id
    integralOffsetBool: false, // 是否开启积分抵现
    integralProportion: 1, // 积分兑换比例
    img: '',
    title: '', // 积分规则标题
    remark: '', // 积分规则描述
  },
});

const spinning = ref<boolean>(false);
//自定义名称，获取的时候是空，可编辑，否则不可编辑
const nameEditable = ref<boolean>(false);

onMounted(async () => {
  spinning.value = true;
  await getMemberConfigData();
  spinning.value = false;
});

const getMemberConfigData = () => {
  getMemberConfig().then((res: any) => {
    data.formState = res;
    valueHtml.value = data.formState.remark;

    data.formState.name === '' ? (nameEditable.value = false) : (nameEditable.value = true);
  });
};

const formRef = ref<FormInstance | undefined>();
const valueHtml: Ref<string | undefined> = ref('<p></p>');

const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入自定义名称');
  } else {
    return Promise.resolve();
  }
};
const checkProportion = async (_rule: Rule, value: number) => {
  if (value < 1) {
    return Promise.reject('请输入大于0的比例值');
  } else {
    return Promise.resolve();
  }
};
const rules: Record<string, Rule[]> = {
  name: [{ required: true, validator: validatePass, trigger: 'change' }],
  integralProportion: [{ validator: checkProportion, trigger: 'change' }],
};

const sending = ref<boolean>(false);

const onFinish = async (values: unknown) => {
  console.log('Success:', values);
  const editor = editorDom.value.editorRef;
  if (editor !== null) {
    data.formState.remark = editor.getHtml();
  }
  sending.value = true;
  data.formState.integralConfigDetailDTO = data.formState.integralConfigDetailVO;
  await setMemberConfig(data.formState)
    .then((res: any) => {
      message.success('提交成功!');
    })
    .catch(() => {
      sending.value = false;
    });
  sending.value = false;
  visible.value = false;
};

const submit = () => {
  onFinish(null);
};

const onFinishFailed = (errorInfo: never) => {
  console.log('Failed:', errorInfo);
};

const handleValidate = (...args: any[]) => {
  console.log(args);
};

defineExpose({ visible });
</script>

<style scoped lang="less">
.zt-card {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 40px;
  h2 {
    font-size: 16px;
    font-weight: bold;
  }
  :deep(.ant-form-item) {
    margin-bottom: 10px;
  }
}
</style>
