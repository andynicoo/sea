import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getCountrySelectList, getEnterpriseSelect, getSupplierList } from '@/api/base/basicsData';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';
import SelectTags from '@/components/form/SelectTags.vue';
import UserSelect from '@/components/form/UserSelect.vue';
import GoodsTypeCascader from '@/components/form/GoodsTypeCascader.vue';

export const rule: any = ref([
  {
    title: '所属企业',
    field: 'enterpriseIdList',
    type: 'select',
    options: async () => {
      return ((await getEnterpriseSelect()) as any).map((v: { id: string; name: string }) => {
        return {
          value: v.id,
          label: v.name,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '订单号',
    field: 'orderNoList',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '订单归属人',
    field: 'attributionName',
    type: 'input',
  },
  {
    title: '备注',
    field: 'remakeList',
    type: 'select',
    options: [
      {
        value: 'CustomerWriteOff',
        label: '客户已注销',
      },
      {
        value: 'CustomerTransferAgent',
        label: '客户转代理',
      },
      {
        value: 'CustomerStoreClosed',
        label: '客户店铺关闭',
      },
      {
        value: 'ProductPricesTooExpensive',
        label: '产品价格太贵',
      },
      {
        value: 'CompanyServiceisNotGood',
        label: '公司服务不行',
      },
      {
        value: 'CustomerRenewed',
        label: '客户已在中台续费',
      },
      {
        value: 'Empty',
        label: '空',
      },
    ],
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '服务截止日期',
    field: 'expirationTimeList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '税号生效日期',
    field: 'taxEffectiveDateList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '服务号',
    field: 'serviceNoList',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '销售所属部门',
    field: 'departmentIdList',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
  {
    title: '客户手机号',
    field: 'userMobile',
    type: 'input',
  },
  {
    title: '服务商品名称',
    field: 'orderProductName',
    type: 'input',
  },
  {
    title: '续费日期',
    field: 'renewalDateList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '公司中文名',
    field: 'companyNameZh',
    type: 'input',
  },
  {
    title: '续费状态',
    field: 'renewalStatusList',
    type: 'select',
    options: [
      {
        value: 'OverdueNotRenewal',
        label: '过期未续费',
      },
      {
        value: 'ContinuedFee',
        label: '待续费',
      },
      {
        value: 'HaveRenewal',
        label: '已续费',
      },
    ],
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '申报服务状态',
    field: 'statuss',
    type: 'select',
    options: [
      {
        label: '未购买',
        value: 0,
      },
      {
        label: '正常（服务中）',
        value: 1,
      },
      {
        label: '待续费',
        value: 2,
      },
      {
        label: '税号注销',
        value: 3,
      },
      {
        label: '已转出',
        value: 4,
      },
      {
        label: '已取消',
        value: 9,
      },
      {
        label: '封存',
        value: 10,
      },
      {
        label: '取消中',
        value: 11,
      },
      {
        label: '已续费',
        value: 12,
      },
      {
        label: '确认转出',
        value: 13,
      },
    ],
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '客服',
    field: 'customerSupportIds',
    type: 'component',
    component: shallowRef(UserSelect),
  },
  {
    title: '客服所属部门',
    field: 'customerDepartmentIds',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
  {
    title: '国家',
    field: 'countryCodes',
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
    title: '服务商',
    field: 'supplierIds',
    type: 'select',
    options: async () => {
      return ((await getSupplierList()) as any).map((v: { id: number; shortName: string }) => {
        return {
          value: v.id,
          label: v.shortName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '商品分类',
    field: 'productCategoryIds',
    type: 'component',
    component: shallowRef(GoodsTypeCascader),
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '服务公司中文名',
    dataIndex: 'companyNameZh',
    width: 180,
    resizable: true,
    fixed: true,
  },
  {
    title: '客户手机号',
    dataIndex: 'userMobile',
    width: 120,
    resizable: true,
    fixed: true,
  },
  {
    title: '商品一级分类',
    dataIndex: 'parentProductCategoryName',
    width: 150,
    resizable: true,
    fixed: true,
  },
  {
    title: '商品二级分类',
    dataIndex: 'productCategoryName',
    width: 150,
    resizable: true,
    fixed: true,
  },
  {
    title: '服务商品名称',
    dataIndex: 'orderProductName',
    width: 180,
    resizable: true,
    fixed: true,
  },
  {
    title: '国家',
    dataIndex: 'countryNameZh',
    width: 120,
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 200,
    resizable: true,
  },
  {
    title: '服务号',
    dataIndex: 'serviceNo',
    width: 200,
    resizable: true,
  },
  {
    title: '税号生效日期',
    dataIndex: 'taxEffectiveDate',
    width: 160,
  },
  {
    title: '服务截止日期',
    dataIndex: 'expirationTime',
    width: 160,
  },
  {
    title: '到期天数',
    dataIndex: 'daysNumber',
    width: 120,
  },
  {
    title: '周期类型',
    dataIndex: 'declarePeriodName',
    width: 120,
  },
  {
    title: '续费状态',
    dataIndex: 'renewalStatus',
    width: 120,
  },
  {
    title: '申报服务状态',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: '跟进情况',
    dataIndex: 'followUpRecord',
    width: 180,
  },
  {
    title: '备注',
    dataIndex: 'remake',
    width: 180,
  },
  {
    title: '订单归属人',
    dataIndex: 'attributionName',
    width: 130,
    resizable: true,
  },
  {
    title: '所属部门',
    dataIndex: 'departmentName',
    width: 130,
    resizable: true,
  },
  {
    title: '客服',
    dataIndex: 'customerSupportName',
    width: 120,
  },
  {
    title: '客服所属部门',
    dataIndex: 'customerDepartmentName',
    width: 120,
  },
  {
    title: '服务金额',
    dataIndex: 'orderAmount',
    width: 120,
  },
  {
    title: '实付金额',
    dataIndex: 'actuallyOrderAmount',
    width: 120,
  },
  {
    title: '续费日期',
    dataIndex: 'renewalDate',
    width: 160,
  },
  {
    title: '服务商',
    dataIndex: 'supplierName',
    width: 120,
  },
  {
    title: '所属企业',
    dataIndex: 'enterpriseName',
    width: 120,
    resizable: true,
  },
]);
