import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getCountrySelectList, getEnterpriseSelect, getSupplierList } from '@/api/base/basicsData';
import GoodsTypeCascader from '@/components/form/GoodsTypeCascader.vue';
import WorkOrderType from '@/components/form/WorkOrderType.vue';
import UserSelect from '@/components/form/UserSelect.vue';
export const rule: any = ref([
  {
    title: '所属主体',
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
    title: '工单类型',
    field: 'workFunctionCategoryIdList',
    type: 'component',
    component: shallowRef(WorkOrderType),
  },
  {
    title: '销售订单号',
    field: 'orderNoList',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '服务名称规格',
    field: 'specsNameList',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '商品分类',
    field: 'productCategoryIdList',
    type: 'component',
    component: shallowRef(GoodsTypeCascader),
    style: {
      width: '250px',
    },
  },
  {
    title: '律师、服务商简称',
    field: 'supplierIdList',
    type: 'select',
    options: async () => {
      return ((await getSupplierList()) as any).map((v: { id: string; shortName: string }) => {
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
    title: '服务商编码',
    field: 'supplierCodeList',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '国家',
    field: 'productCountryCodeList',
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
    title: '公司中文名',
    field: 'companyNameZh',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '服务完成时间',
    field: 'serviceCompletedTime',
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
    title: '公司英文名',
    field: 'companyNameEn',
    type: 'input',
    style: {
      width: '230px',
    },
  },
  {
    title: '服务号',
    field: 'serviceNoList',
    type: 'input',
    style: {
      width: '230px',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '所属主体',
    dataIndex: 'enterpriseName',
    width: 120,
  },
  {
    title: '销售订单号',
    dataIndex: 'orderNo',
    width: 120,
  },
  {
    title: '服务号',
    dataIndex: 'serviceNo',
    width: 120,
  },
  {
    title: '服务应收金额(元)',
    dataIndex: 'specsPaymentMoney',
    width: 140,
  },
  {
    title: '服务实收金额(元)',
    dataIndex: 'specsPaidMoney',
    width: 140,
  },
  {
    title: '开票情况',
    dataIndex: 'invoceRecord',
    width: 150,
  },
  {
    title: '工单类型',
    dataIndex: 'workFunctionCategoryName',
    width: 150,
  },
  {
    title: '服务名称规格',
    dataIndex: 'specsName',
    width: 150,
  },
  {
    title: '商品分类/二级分类',
    dataIndex: 'parentProductCategoryName',
    width: 150,
  },
  {
    title: '工单状态',
    dataIndex: 'workStatusName',
    width: 150,
  },
  {
    title: '律师/服务商简称',
    dataIndex: 'supplierShortName',
    width: 150,
  },
  {
    title: '律师/服务商编码',
    dataIndex: 'supplierCode',
    width: 150,
  },
  {
    title: '国家',
    dataIndex: 'productCountryName',
    width: 150,
  },
  {
    title: '公司中文名',
    dataIndex: 'companyNameZh',
    width: 150,
  },
  {
    title: '公司英文名',
    dataIndex: 'companyNameEn',
    width: 150,
  },
  {
    title: '税号/受理号',
    dataIndex: 'serviceWorkNumber',
    width: 150,
  },
  {
    title: '提交给服务商时间',
    dataIndex: 'submitServiceTime',
    width: 150,
  },
  {
    title: '税号下发日期',
    dataIndex: 'numberIssueDate',
    width: 150,
  },
  {
    title: '税号生效日期',
    dataIndex: 'numberEffectiveDate',
    width: 150,
  },
  {
    title: '申报开始月',
    dataIndex: 'declareBeginTime',
    width: 150,
  },
  {
    title: '申报结束月',
    dataIndex: 'declareEndTime',
    width: 150,
  },
  {
    title: '服务完成时间',
    dataIndex: 'serviceCompletedTime',
    width: 150,
  },
  {
    title: '销售订单状态',
    dataIndex: 'orderStatusName',
    width: 150,
  },
  {
    title: '申报周期',
    dataIndex: 'declarePeriodName',
    width: 150,
  },
]);
