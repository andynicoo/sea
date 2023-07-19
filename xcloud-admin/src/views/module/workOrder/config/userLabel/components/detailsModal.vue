<template>
  <a-modal
    :title="title + '标签'"
    v-model:visible="visible"
    @cancel="cancelModel"
    :maskClosable="false"
    :keyboard="false"
  >
    <form-create
      :rule="rule"
      v-model="data.formModal"
      v-model:api="data.fApi"
      :option="data.option"
      @function-code-change="funCodeChange"
    >
    </form-create>
    <template #footer>
      <a-button @click="submit">确认</a-button>
      <a-button @click="visible = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineEmits, onMounted } from 'vue';
import { business, workOrderType } from '../config';
import { saveOrUpdate, getWorkCategory } from '../../../../../../api/workOrder/intellectualProperty/cofing/userLabel';
import { message } from 'ant-design-vue';

const data = reactive({
  fApi: {
    submit: (parmas: any) => {},
    fields: () => {
      return [];
    },
    setValue: (parmas: object) => {},
    getValue: () => {},
    reload: () => {},
    resetFields: () => {},
  },
  formModal: {},
  option: {
    submitBtn: {
      show: false,
    },
  },
});

const emit = defineEmits(['close']);
interface props {
  show: boolean;
  title: string;
  detailData?: { id: string };
}

const props = withDefaults(defineProps<props>(), {
  visible: false,
  title: '新建',
  detailData: () => {
    return { id: '' };
  },
});

const rule = ref([
  {
    title: '所属业务',
    field: 'functionCode',
    type: 'select',
    value: '',
    emit: ['change'],
    wrap: {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    options: async () => {
      const data = (await getWorkCategory()) as any;
      return data.map((item: any) => {
        return { value: item.id, label: item.name };
      });
    },
  },
  workOrderType,
  {
    title: '标签名称',
    field: 'labelName',
    type: 'input',
    wrap: {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    validate: [{ type: 'string', required: true, message: '请标签名称' }],
    props: {
      props: '请输入',
      maxlength: '180',
    },
    value: '',
  },
  {
    title: '标签状态',
    field: 'status',
    type: 'select',
    validate: [{ type: 'string', required: true, message: '请选择标签状态' }],
    value: '',
    wrap: {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    options: [
      {
        value: 'ENABLE',
        label: '启用',
      },
      {
        value: 'STOP',
        label: '停用',
      },
    ],
  },
  {
    title: '备注',
    field: 'remark',
    type: 'input',

    wrap: {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    validate: [{ type: 'string', required: true, message: '请输入标签备注' }],
    value: '',
    props: {
      type: 'textarea',
      placeholder: '请输入',
    },
  },
]);

function cancelModel(e: object) {}

type submitLeabel = {
  functionCode: string;
  id?: string;
  functionName: string;
  typeId: string;
};

const submit = () => {
  data.fApi.submit(async (formData: submitLeabel) => {
    const { typeId, functionCode } = formData;
    if (functionCode == '') {
      message.error('请选择所属业务');
      return;
    }
    if (typeId == '') {
      message.error('请选择工单类型');
    }
    const workList = (await getWorkCategory()) as any,
      isEdit = Boolean(Object.keys(props.detailData).length > 0);
    const item: { name: string; id: string } = workList.find(({ id }: { id: string }) => id == functionCode);
    let parmas: submitLeabel = { ...formData };
    parmas = { ...formData, functionName: item.name };
    if (isEdit) {
      parmas = { id: props.detailData.id, ...parmas };
    }
    await saveOrUpdate(parmas);
    visible.value = false;
  });
};
const visible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('close', value);
  },
});

function funCodeChange() {
  // console.log('重置');
  data.fApi.resetFields('typeId');
  // console.log(data.fApi);

  data.fApi.reload();

  // data.fApi.refresh();
}
onMounted(() => {
  const { detailData } = props;
  const filds = data.fApi.fields() || [];
  if (detailData && Object.keys(detailData)) {
    data.fApi.resetFields();
    let value = {};
    for (let index = 0; index < filds.length; index++) {
      const element = detailData[filds[index]];
      value[filds[index]] = element;
    }
    data.fApi.setValue(value);
    data.fApi.reload();
  }
});
</script>

<style lang="scss" scoped></style>
