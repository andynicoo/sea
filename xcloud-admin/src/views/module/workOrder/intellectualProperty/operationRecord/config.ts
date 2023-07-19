import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getAllUsers } from '@/api/base/basicsData'

// 更新类型
export const updateTypes = [
  {
    label: '上传受理回执',
    value: 'upload_accept_receipt',
  },
  {
    label: '录入公告日期',
    value: 'add_publication_date',
  },
  {
    label: '录入注册号及注册日期',
    value: 'add_registration_number',
  },
  {
    label: '上传商标证书',
    value: 'upload_trademark_certificate',
  },
  {
    label: '发生OA',
    value: 'add_oa',
  },
];

export const rule: any = ref([
  {
    title: '服务号',
    field: 'serviceNo',
    type: 'input',
  },
  {
    title: '更新类型',
    field: 'autoOperateType',
    type: 'select',
    options: updateTypes,
  },
  {
    title: '商标名称',
    field: 'trademarkNameEn',
    type: 'input',
  },
  {
    title: '申请人',
    field: 'applyName',
    type: 'input',
  },  
  {
    title: '手机号',
    field: 'userMobile',
    type: 'input',
  },
  {
    title: '操作人',
    field: 'operationId',
    type: 'select',
    options: async () => {
      return ((await getAllUsers()) as any).map((v: { userId: string; nickName: string }) => {
        return {
          value: v.userId,
          label: v.nickName,
        };
      });
    },
  },
  {
    title: '更新时间',
    field: 'updateTimeList',
    type: 'datePicker',
    value: [],
    props: {
      range: true,
      defaultPickerValue: [],
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    title: '备注',
    field: 'remark',
    type: 'select',
    options: [
      {
        label: '全部',
        value: '',
      },
      {
        label: '系统自动更新',
        value: '系统自动更新',
      },
    ],
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '服务号',
    dataIndex: 'serviceNumber',
    width: 110,
  },
  {
    title: '商标',
    dataIndex: 'brandName',
    width: 100,
  },
  {
    title: '国家',
    dataIndex: 'countryName',
    width: 70,
  },
  {
    title: '申请人',
    dataIndex: 'applicant',
    width: 120,
  },
  {
    title: '手机号',
    dataIndex: 'userMobile',
    width: 100,
  },
  {
    title: '更新类型',
    dataIndex: 'updateType',
    width: 180,
  },
  {
    title: '销售人员',
    dataIndex: 'sales',
    width: 120,
  },
  {
    title: '归属交付人员',
    dataIndex: 'deliveryStrList',
    width: 130,
  },
  {
    title: '操作人',
    dataIndex: 'operation',
    width: 130,
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 150,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 160,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 80,
  },
]);
