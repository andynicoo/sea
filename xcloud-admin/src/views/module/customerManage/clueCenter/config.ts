import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { findDictByCodeList, getBrandList, getSourceList } from '@/api/base/basicsData';
import { leadFollowStatusList } from '@/api/customerManage/clueCenter';
import SelectTags from '@/components/form/SelectTags.vue';
import SourceCascader from '@/components/form/SourceCascader.vue';
import UserSelect from '@/components/form/UserSelect.vue';
import MarketingSelect from '@/components/form/MarketingSelect.vue';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';

export const rule: any = ref([
  {
    title: '手机号',
    field: 'mobiles',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '跟进状态',
    field: 'leadFollowStatusEnum',
    type: 'select',
    options: async () => {
      return ((await leadFollowStatusList({})) as any).map((v: { key: string; value: string }) => {
        return {
          value: v.key,
          label: v.value,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '跟进人',
    field: 'followUserIds',
    type: 'component',
    props: {
      emptySelect: true,
    },
    component: shallowRef(UserSelect),
  },
  {
    title: '跟进部门',
    field: 'followDepIds',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
  {
    title: '数据源',
    field: 'platform',
    type: 'select',
    options: async () => {
      return ((await getSourceList()) as any).map((v: { key: string; value: string }) => {
        return {
          value: v.key,
          label: v.value,
        };
      });
    },
  },
  {
    title: '品牌',
    field: 'brandId',
    type: 'select',
    options: async () => {
      return ((await getBrandList()) as any).map((v: { key: string; value: string }) => {
        return {
          value: v.key,
          label: v.value,
        };
      });
    },
  },
  {
    title: '线索大类',
    field: 'sourceLargeEnum',
    type: 'select',
    options: async () => {
      return (
        (await findDictByCodeList({
          code: 'leadSourceLarge',
        })) as any
      ).map((v: { dictKey: string; dictValue: string }) => {
        return {
          value: v.dictKey,
          label: v.dictValue,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '线索小类',
    field: 'sourceSmallEnum',
    type: 'component',
    component: shallowRef(SourceCascader),
  },
  {
    title: '注册来源',
    field: 'registerSources',
    type: 'select',
    options: [
      {
        value: 0,
        label: 'PC网页端',
      },
      {
        value: 1,
        label: 'H5端',
      },
      {
        value: 2,
        label: '微信小程序',
      },
      {
        value: 5,
        label: '后台录入',
      },
      {
        value: 6,
        label: '销售易',
      },
    ],
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '市场活动',
    field: 'campaigns',
    type: 'component',
    component: shallowRef(MarketingSelect),
  },
  {
    title: '邀请人',
    field: 'inviteUserIds',
    type: 'component',
    props: {
      emptySelect: true,
    },
    component: shallowRef(UserSelect),
  },
  {
    title: '推送状态',
    field: 'lxyStatuss',
    type: 'select',
    options: [
      {
        value: 1,
        label: '未推送',
      },
      {
        value: 2,
        label: '已推送',
      },
      {
        value: 3,
        label: '无需推送',
      },
      {
        value: 4,
        label: '推送失败',
      },
    ],
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '创建时间',
    field: 'createTimeQuery',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '转换时间',
    field: 'changeTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '潜客转化时间',
    field: 'opportunityTime',
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
    title: '手机号',
    dataIndex: 'mobile',
    width: 140,
    fixed: true,
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
    width: 110,
    fixed: true,
  },
  {
    title: '数据源',
    dataIndex: 'platformDes',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
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
    title: '注册来源',
    dataIndex: 'registerSource',
    width: 130,
  },
  {
    title: '市场活动',
    dataIndex: 'campaignDes',
    width: 200,
  },
  {
    title: '跟进状态',
    dataIndex: 'leadFollowStatusDes',
    width: 100,
  },
  {
    title: '跟进人',
    dataIndex: 'followUserName',
    width: 130,
  },
  {
    title: '跟进人部门',
    dataIndex: 'followDepartmentName',
    width: 120,
  },
  {
    title: '邀请人',
    dataIndex: 'inviteUserName',
    width: 130,
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: '潜客转化时间',
    dataIndex: 'opportunityTime',
    width: 160,
  },
  {
    title: '客户转换时间',
    dataIndex: 'changeTime',
    width: 160,
  },
  {
    title: '推送状态',
    dataIndex: 'lxyStatusDes',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 80,
  },
]);
