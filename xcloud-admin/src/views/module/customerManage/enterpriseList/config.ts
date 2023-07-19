import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getDictList } from '@/api/customerManage/enterpriseList';
import ProvinceSelect from '@/components/form/ProvinceSelect.vue';

export const rule: any = ref([
  {
    title: '所在省份',
    field: 'provinceCodes',
    type: 'component',
    component: shallowRef(ProvinceSelect),
  },
  {
    title: '人员规模',
    field: 'companyPersonnelSizes',
    type: 'select',
    options: async () => {
      return (
        (await getDictList({
          code: 'staffSize',
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
    title: '年销售额',
    field: 'companyYearAmounts',
    type: 'select',
    options: async () => {
      return (
        (await getDictList({
          code: 'annualSales',
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
    title: '企业在售平台',
    field: 'shopSalePlatformNames',
    type: 'select',
    options: async () => {
      return (
        (await getDictList({
          code: 'onSalePlatform',
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
    title: '企业名称',
    field: 'companyName',
    type: 'input',
    props: {
      maxLength: 20,
    },
  },
  {
    title: 'OneID标识',
    field: 'oneidNumber',
    type: 'input',
    props: {
      maxLength: 20,
    },
  },
  {
    title: '社会信用代码',
    field: 'companyCreditCode',
    type: 'input',
    props: {
      maxLength: 20,
    },
  },
]);

export const columns = ref<TableColumnsType>([
  // {
  //   title: '编号',
  //   dataIndex: 'index',
  //   width: 80,
  // },
  {
    title: 'OneID标识',
    dataIndex: 'oneId',
    width: 200,
  },
  {
    title: '企业名称',
    dataIndex: 'companyName',
    width: 220,
    ellipsis: true,
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'companyCreditCode',
    width: 180,
  },
  {
    title: '成立日期',
    dataIndex: 'companyRegisterData',
    width: 120,
  },
  {
    title: '企业所在省份',
    dataIndex: 'companyAddressEnProvice',
    width: 120,
  },
  {
    title: '企业所在市',
    dataIndex: 'companyAddressEnCity',
    width: 120,
  },
  {
    title: '人员规模',
    dataIndex: 'companyPersonnelSizeTest',
    width: 120,
  },
  {
    title: '企业联系方式',
    dataIndex: 'companyTel',
    width: 150,
  },
  {
    title: '企业法人',
    dataIndex: 'companyLegalPersonZh',
    width: 150,
  },
  {
    title: '所属主体',
    dataIndex: 'enterpriseName',
    width: 150,
  },

  // {
  //   title: '企业年销售额',
  //   dataIndex: 'companyYearAmountTest',
  //   width: 120,
  // },
  // {
  //   title: '企业在售平台',
  //   dataIndex: 'shopSalePlatformNameTest',
  //   width: 200,
  //   ellipsis: true,
  // },
  // {
  //   title: '主要出口国家',
  //   dataIndex: 'mainSaleCountry',
  //   width: 200,
  //   ellipsis: true,
  // },

  // {
  //   title: '对接人（角色）',
  //   dataIndex: 'followUserTypeTest',
  //   width: 150,
  // },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 80,
  },
]);
