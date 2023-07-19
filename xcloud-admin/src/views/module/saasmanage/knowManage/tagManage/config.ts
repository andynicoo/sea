import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';

export const rule: any = ref([
  {
    title: '标签名称',
    field: 'labelName',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '创建时间',
    field: 'createTimeStart',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: 'ID',
    dataIndex: 'id',
    width: 150,
    align: 'center',
  },
  {
    title: '标签名',
    dataIndex: 'labelName',
    width: 150,
    align: 'center',
  },
  {
    title: 'seo标题',
    dataIndex: 'seoTitle',
    width: 130,
    align: 'center',
  },
  {
    title: '关键词',
    dataIndex: 'keyword',
    width: 110,
    align: 'center',
  },
  {
    title: '属性词',
    dataIndex: 'attributeWord',
    width: 150,
    align: 'center',
  },
  {
    title: 'seo描述',
    dataIndex: 'seoDescribe',
    width: 200,
    align: 'center',
  },

  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    align: 'center',
  },
  {
    title: '创建人',
    dataIndex: 'createName',
    width: 110,
    align: 'center',
  },
  {
    title: '操作',
    key: 'opration',
    width: 160,
    align: 'center',
  },
]);
