import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';

export const rule: any = ref([
  {
    title: '数据源',
    field: 'platformName',
    type: 'input',
  },

  {
    title: '创建时间',
    field: 'createTimeQuery',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs().startOf('day'), dayjs().endOf('day')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '编号',
    dataIndex: 'index',
    width: 80,
  },
  {
    title: '数据源',
    dataIndex: 'platformName',
    width: 150,
  },
  {
    title: '数据源标识ID',
    dataIndex: 'platform',
    width: 150,
  },
  {
    title: '线索来源(大类)',
    dataIndex: 'sourceLargeDes',
    width: 130,
  },
  {
    title: '线索来源(小类)',
    dataIndex: 'sourceSmallDes',
    width: 130,
  },
  {
    title: '线索跟进状态',
    dataIndex: 'leadFollowStatusName',
    width: 130,
  },
  {
    title: '说明',
    dataIndex: 'explainRemarks',
    width: 200,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 200,
  },
  {
    title: '授权API',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: 'API密钥',
    dataIndex: 'secret',
    width: 200,
  },
  {
    title: '推送CRM',
    dataIndex: 'pushCrm',
    width: 120,
  },
  {
    title: '推送励销云',
    dataIndex: 'pushLxy',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 150,
  },
]);
