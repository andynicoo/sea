import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { baseDataType, getCountrySelectList, getEnterpriseSelect } from '@/api/base/basicsData';
import SelectTags from '@/components/form/SelectTags.vue';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';
import GoodsTypeCascader from '@/components/form/GoodsTypeCascader.vue';
import UserSelect from '@/components/form/UserSelect.vue';

export const rule: any = ref([
  {
    title: '销售订单号',
    field: 'orderNoList',
    type: 'component',
    component: shallowRef(SelectTags),
    style: {
      width: '210px',
    },
  },
  {
    title: '客户手机号',
    field: 'userMobileList',
    type: 'component',
    component: shallowRef(SelectTags),
    style: {
      width: '210px',
    },
  },
  {
    title: '下单时间',
    field: 'orderTimeList',
    type: 'datePicker',
    value: [
      dayjs().date(1).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
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
    title: '选择部门',
    field: 'departmentIdList',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
  {
    title: '跟进人',
    field: 'attributionIdSelectList',
    type: 'component',
    component: shallowRef(UserSelect),
  },
  {
    title: '订单来源',
    field: 'orderSource',
    type: 'select',
    options: async () => {
      return ((await baseDataType({ dataType: 'ORDER_SOURCE_TYPE' })) as any).map(
        (v: { dataCode: string; dataValue: string }) => {
          return {
            value: v.dataCode,
            label: v.dataValue,
          };
        }
      );
    },
  },
  {
    title: '支付方式',
    field: 'paymentChannel',
    type: 'select',
    options: async () => {
      return ((await baseDataType({ dataType: 'PAYMENT_CHANNEL_TYPE' })) as any).map(
        (v: { dataCode: string; dataValue: string }) => {
          return {
            value: v.dataCode,
            label: v.dataValue,
          };
        }
      );
    },
  },
  {
    title: '选择国家',
    field: 'countryCodeList',
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
    title: '商品分类',
    field: 'productCategoryIdList',
    type: 'component',
    component: shallowRef(GoodsTypeCascader),
  },
  {
    title: '商品规格名称',
    field: 'productName',
    type: 'input',
  },
  {
    title: '付款时间',
    field: 'paymentTimeList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '付款类型',
    field: 'paymentType',
    type: 'select',
    options: async () => {
      return ((await baseDataType({ dataType: 'PAYMENT_TYPE' })) as any).map(
        (v: { dataCode: string; dataValue: string }) => {
          return {
            value: v.dataCode,
            label: v.dataValue,
          };
        }
      );
    },
  },
  {
    title: '订单类型',
    field: 'orderType',
    type: 'select',
    options: async () => {
      return ((await baseDataType({ dataType: 'ORDER_TYPE' })) as any).map(
        (v: { dataCode: string; dataValue: string }) => {
          return {
            value: v.dataCode,
            label: v.dataValue,
          };
        }
      );
    },
  },
  {
    title: '订单明细状态',
    field: 'orderStatusList',
    type: 'select',
    options: async () => {
      return ((await baseDataType({ dataType: 'ORDER_STATUS_TYPE' })) as any).map(
        (v: { dataCode: string; dataValue: string }) => {
          return {
            value: v.dataCode,
            label: v.dataValue,
          };
        }
      );
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '订单状态',
    field: 'orderStatus',
    type: 'select',
    options: async () => {
      return ((await baseDataType({ dataType: 'ORDER_STATUS_TYPE' })) as any).map(
        (v: { dataCode: string; dataValue: string }) => {
          return {
            value: v.dataCode,
            label: v.dataValue,
          };
        }
      );
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '到账时间',
    field: 'accountingTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '客户公司名称',
    field: 'serviceCompanyName',
    type: 'input',
  },
  {
    title: '商品经理',
    field: 'productAttributionIds',
    type: 'component',
    component: shallowRef(UserSelect),
  },
  {
    title: '客户等级',
    field: 'userLevels',
    type: 'select',
    options: [
      {
        label: 'SMB客户',
        value: 1,
      },
      {
        label: 'KA客户',
        value: 2,
      },
      {
        label: '品牌客户',
        value: 3,
      },
      {
        value: 4,
        label: '渠道客户',
      },
    ],
    props: {
      mode: 'multiple',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '销售订单号',
    dataIndex: 'orderNo',
    width: 150,
    fixed: true,
  },
  {
    title: '客户公司名称',
    dataIndex: 'serviceCompanyName',
    width: 180,
  },
  {
    title: '客户等级',
    dataIndex: 'userLevel',
    width: 120,
  },
  {
    title: '支付单号',
    dataIndex: 'paymentOrder',
    width: 120,
  },
  {
    title: '服务号',
    dataIndex: 'serviceNo',
    width: 120,
  },
  {
    title: '商品名称',
    dataIndex: 'parentProductName',
    width: 200,
  },
  {
    title: '商品规格名称',
    dataIndex: 'productName',
    width: 200,
  },
  {
    title: '国家',
    dataIndex: 'countryName',
    width: 100,
  },
  {
    title: '商品一级分类',
    dataIndex: 'parentProductCategoryName',
    width: 120,
  },
  {
    title: '服务金额（元）',
    dataIndex: 'productOldMoney',
    width: 150,
    sorter: (a, b) => a.productOldMoney - b.productOldMoney,
  },
  {
    title: '应付金额（元）',
    dataIndex: 'totalOrderMoney',
    width: 150,
    sorter: (a, b) => a.totalOrderMoney - b.totalOrderMoney,
  },
  {
    title: '实付金额（元）',
    dataIndex: 'totalAmountMoney',
    width: 150,
    sorter: (a, b) => a.totalAmountMoney - b.totalAmountMoney,
  },
  {
    title: '税额',
    dataIndex: 'productInvoiceMoney',
    width: 150,
  },
  {
    title: '分期金额（元）',
    dataIndex: 'partPaymentMoney',
    width: 150,
  },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    width: 160,
  },
  {
    title: '付款时间',
    dataIndex: 'paymentTime',
    width: 200,
  },
  {
    title: '到账时间',
    dataIndex: 'gatheringTime',
    width: 200,
  },
  {
    title: '商品分类',
    dataIndex: 'productCategoryName',
    width: 120,
  },
  {
    title: '是否续费',
    dataIndex: 'renewFlag',
    width: 120,
  },
  {
    title: '订单归属人',
    dataIndex: 'attributionName',
    width: 120,
  },
  {
    title: '所属部门',
    dataIndex: 'departmentName',
    width: 120,
  },
  {
    title: '商品经理',
    dataIndex: 'productAttributionName',
    width: 120,
  },
  {
    title: '客户手机号',
    dataIndex: 'userMobile',
    width: 120,
  },
  {
    title: '支付方式',
    dataIndex: 'paymentChannel',
    width: 120,
  },
  {
    title: '订单来源',
    dataIndex: 'orderSource',
    width: 120,
  },
  {
    title: '付款类型',
    dataIndex: 'paymentTypeName',
    width: 160,
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    width: 120,
  },
  {
    title: '订单明细状态',
    dataIndex: 'orderStatusName',
    width: 120,
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatusDesc',
    width: 120,
  },
  {
    title: '服务状态',
    dataIndex: 'serviceStatus',
    width: 120,
  },
  {
    title: '商机编号',
    dataIndex: 'opportunityNo',
    width: 120,
  },
]);
