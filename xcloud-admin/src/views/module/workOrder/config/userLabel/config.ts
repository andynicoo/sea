import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getWorkCategory, getListByCategory } from '../../../../../api/workOrder/intellectualProperty/cofing/userLabel';
export const business = {
  title: '所属业务',
  field: 'functionCode',
  type: 'select',
  value: '',
  on: {
    change: (val: any) => {
      rule.value[2].value = '';
      // workOrderType.value = '';
    },
  },
  options: async () => {
    const data = (await getWorkCategory()) as any;
    return data.map((item: any) => {
      return { value: item.id, label: item.name };
    });
  },
};

export const workOrderType = {
  title: '工单类型',
  field: 'typeId',
  type: 'select',
  link: ['functionCode'],
  wrap: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  },
  value: '',
  update(val: any, rule: any, fApi: any) {
    setTimeout(async () => {
      const categoryId = fApi.getValue('functionCode');
      if (categoryId) {
        const data: any = await getListByCategory({ categoryId });
        const options = data.map((item: any) => {
          return { value: item.code, label: item.name };
        });
        rule.options = options;
        fApi.reload();
      }
    });
  },
};
export const rule = ref([
  {
    title: '标签名称',
    field: 'labelName',
    type: 'input',
  },
  business,
  workOrderType,
]);

export const columns = ref<TableColumnsType>([
  {
    title: '序号',
    dataIndex: 'index',
    width: 150,
  },
  {
    title: '标签名称',
    dataIndex: 'labelName',
    width: 150,
  },
  {
    title: '所属业务',
    dataIndex: 'functionName',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 150,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 150,
  },

  {
    title: '创建人',
    dataIndex: 'createBy',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'btns',
    width: 150,
  },
]);
