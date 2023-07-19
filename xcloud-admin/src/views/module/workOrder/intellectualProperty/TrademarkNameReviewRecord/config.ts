import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getAllUsers, getCountrySelectList } from '@/api/base/basicsData';
import { getPassRateList } from '@/api/workOrder/intellectualProperty/trademark';

// 核名状态类型
export const statusMap: any = {
  WAIT_CHECK: '待核名',
  WAIT_RECHECK: '待复核',
  WAIT_CONFIRM: '待确认',
  RECHECK_WAIT_CONFIRM: '已复核待确认',
  CONFIRM_WAIT_AUDIT: '已确认待终审',
  AUDIT_WAIT_CONFIRM: '已终审待确认',
  CONFIRM: '已确认',
  COMPLETE: '已完成',
};

// 用户确认记录类型
export const userConfirmStatusMap: any = {
  WAIT_CONFIRM: '待确认',
  CONFIRM: '确认注册',
  PERSIST: '坚持注册',
  DISCARD: '放弃注册',
};

// 报告类型
export const reportTypeMap: any = {
  FIRST_CHECK: '初核',
  RE_CHECK: '复核',
  LAST_CHECK: '终审',
};

export const rule: any = ref([
  {
    title: '综合搜索',
    field: 'keyword',
    type: 'input',
    props: {
      placeholder: '可搜索手机和核名单号',
    },
  },
  {
    title: '商标名称',
    field: 'trademarkName',
    type: 'input',
  },
  {
    title: '状态',
    field: 'recordStatusList',
    type: 'select',
    options: Object.keys(statusMap).map(key => {
      return {
        label: statusMap[key],
        value: key,
      };
    }),
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '国家',
    field: 'countryList',
    type: 'select',
    options: async () => {
      return ((await getCountrySelectList()) as any).map((v: { countryCode: string; countryNameZh: string }) => {
        return {
          value: v.countryCode,
          label: v.countryNameZh,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '用户确认记录',
    field: 'userConfirmsList',
    type: 'select',
    options: Object.keys(userConfirmStatusMap).map(key => {
      return {
        label: userConfirmStatusMap[key],
        value: key,
      };
    }),
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '通过率',
    field: 'passRatesList',
    type: 'select',
    options: async () => {
      const arr = ((await getPassRateList({ type: '1' })) as any).map((v: { checkPassRate: string }) => {
        return {
          value: v.checkPassRate,
          label: v.checkPassRate,
        };
      });
      return [
        {
          value: 'empty',
          label: '未填写通过率',
        },
        ...arr,
      ];
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '当前处理人',
    field: 'curCheckUserList',
    type: 'select',
    options: async () => {
      return ((await getAllUsers()) as any).map((v: { userId: string; nickName: string }) => {
        return {
          value: v.userId,
          label: v.nickName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '销售',
    field: 'saleUserList',
    type: 'select',
    options: async () => {
      return ((await getAllUsers()) as any).map((v: { userId: string; nickName: string }) => {
        return {
          value: v.userId,
          label: v.nickName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '客服',
    field: 'customerServiceUserList',
    type: 'select',
    options: async () => {
      return ((await getAllUsers()) as any).map((v: { userId: string; nickName: string }) => {
        return {
          value: v.userId,
          label: v.nickName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '专员',
    field: 'checkUserList',
    type: 'select',
    options: async () => {
      return ((await getAllUsers()) as any).map((v: { userId: string; nickName: string }) => {
        return {
          value: v.userId,
          label: v.nickName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '交付',
    field: 'workUserList',
    type: 'select',
    options: async () => {
      return ((await getAllUsers()) as any).map((v: { userId: string; nickName: string }) => {
        return {
          value: v.userId,
          label: v.nickName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '创建时间',
    field: 'createTimeList',
    type: 'datePicker',
    value: [],
    props: {
      range: true,
      defaultPickerValue: [],
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    title: '创建人',
    field: 'createList',
    type: 'select',
    options: async () => {
      return ((await getAllUsers()) as any).map((v: { userId: string; nickName: string }) => {
        return {
          value: v.userId,
          label: v.nickName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '备注',
    field: 'existRemarks',
    type: 'select',
    options: [
      {
        label: '全部',
        value: '',
      },
      {
        label: '有备注',
        value: true,
      },
      {
        label: '无备注',
        value: false,
      },
    ],
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '核名单号',
    dataIndex: 'recordNo',
    width: 110,
    fixed: 'left',
  },
  {
    title: '批次号',
    dataIndex: 'batchNo',
    width: 100,
  },
  {
    title: '手机号',
    dataIndex: 'userMobile',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'recordStatus',
    width: 120,
  },
  {
    title: '商标名称',
    dataIndex: 'trademarkName',
    width: 100,
  },
  {
    title: '国家',
    dataIndex: 'countryName',
    width: 80,
  },
  {
    title: '类别',
    dataIndex: 'trademarkCategoryNums',
    width: 120,
  },
  {
    title: '用户确认记录',
    dataIndex: 'userConfirmStatus',
    width: 130,
  },
  {
    title: '通过率',
    dataIndex: 'checkPassRate',
    width: 130,
  },
  {
    title: '核名结果',
    dataIndex: 'checkResult',
    width: 150,
  },
  {
    title: '备注',
    dataIndex: 'lastRemark',
    width: 160,
  },
  {
    title: '当前处理人',
    dataIndex: 'curCheckUserName',
    width: 100,
  },
  {
    title: '销售',
    dataIndex: 'saleUserName',
    width: 100,
  },
  {
    title: '客服',
    dataIndex: 'customerServiceUserName',
    width: 100,
  },
  {
    title: '专员',
    dataIndex: 'checkUserName',
    width: 100,
  },
  {
    title: '交付',
    dataIndex: 'workUserName',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '创建人',
    dataIndex: 'createName',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 120,
    fixed: 'right',
  },
]);
