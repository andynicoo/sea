import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { baseDataType, getCountrySelectList, getEnterpriseSelect } from '@/api/base/basicsData';
import SelectTags from '@/components/form/SelectTags.vue';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';
import UserSelect from '@/components/form/UserSelect.vue';
import GoodsTypeCascader from '@/components/form/GoodsTypeCascader.vue';

export const rule: any = ref([
  {
    title: '订单号',
    field: 'orderNoList',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '退款状态',
    field: 'refundStatusList',
    type: 'select',
    options: async () => {
      return ((await baseDataType({ dataType: 'REFUND_STATUS_TYPE' })) as any).map(
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
    title: '申请时间',
    field: 'applyTimeList',
    type: 'datePicker',
    value: [dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '退款时间',
    field: 'refundTimeList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
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
    title: '客户手机号',
    field: 'customerPhoneList',
    type: 'component',
    component: shallowRef(SelectTags),
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
    field: 'attributionIdList',
    type: 'component',
    component: shallowRef(UserSelect),
  },
  {
    title: '付款类型',
    field: 'paymentTypeList',
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
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '订单类型',
    field: 'orderTypeList',
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
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '商品名称',
    field: 'parentProductName',
    type: 'input',
  },
  {
    title: '商品分类',
    field: 'productCategoryIds',
    type: 'component',
    component: shallowRef(GoodsTypeCascader),
  },
  {
    title: '商品经理',
    field: 'productAttributionIds',
    type: 'component',
    component: shallowRef(UserSelect),
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '退款单号',
    dataIndex: 'refundNo',
    width: 180,
    fixed: true,
  },
  {
    title: '销售订单号',
    dataIndex: 'orderNo',
    width: 150,
  },
  {
    title: '支付单号',
    dataIndex: 'paymentNo',
    width: 150,
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    width: 150,
  },
  {
    title: '申请人',
    dataIndex: 'proposer',
    width: 150,
  },
  {
    title: '申请人部门',
    dataIndex: 'department',
    width: 130,
  },
  {
    title: '商品经理',
    dataIndex: 'productAttributionName',
    width: 130,
  },
  {
    title: '客户手机号',
    dataIndex: 'customerPhone',
    width: 130,
  },
  {
    title: '国家',
    dataIndex: 'countryName',
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
    title: '商品分类',
    dataIndex: 'productTypeName',
    width: 120,
  },
  {
    title: '商品二级分类',
    dataIndex: 'productCategoryName',
    width: 120,
  },
  {
    title: '服务金额（元）',
    dataIndex: 'serviceAmount',
    width: 140,
    sorter: (a, b) => a.serviceAmount - b.serviceAmount,
  },
  {
    title: '已付金额（元）',
    dataIndex: 'paidAmount',
    width: 140,
    sorter: (a, b) => a.paidAmount - b.paidAmount,
  },
  {
    title: '退款金额（元）',
    dataIndex: 'refundAmount',
    width: 140,
    sorter: (a, b) => a.refundAmount - b.refundAmount,
  },
  {
    title: '退款状态',
    dataIndex: 'refundStatus',
    width: 120,
  },
  {
    title: '付款类型',
    dataIndex: 'paymentType',
    width: 150,
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    width: 120,
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    width: 120,
  },
  {
    title: '商机编号',
    dataIndex: 'opportunityNo',
    width: 120,
  },
]);
