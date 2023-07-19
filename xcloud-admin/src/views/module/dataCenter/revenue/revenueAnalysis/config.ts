import { ref, shallowRef } from 'vue';
import dayjs from 'dayjs';
import { getEnterpriseSelect, getCountrySelectList, getSupplierList } from '@/api/base/basicsData';
import DepartmentCascader from '@/components/form/DepartmentCascader.vue';
import GoodsTypeCascader from '@/components/form/GoodsTypeCascader.vue';
import SelectTags from '@/components/form/SelectTags.vue';
import UserSelect from '@/components/form/UserSelect.vue';

export const rule: any = ref([
  {
    title: '企业',
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
    title: '统计时间',
    field: 'statisticsTime',
    type: 'datePicker',
    value: [
      dayjs().subtract(6, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    on: {
      change: () => {
        rule.value[2].value = null;
        rule.value[3].value = null;
      },
    },
  },
  {
    title: '到账时间',
    field: 'arrivalTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    on: {
      change: () => {
        rule.value[1].value = null;
        rule.value[3].value = null;
      },
    },
  },
  {
    title: '退款成功时间',
    field: 'refundTime',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    on: {
      change: () => {
        rule.value[1].value = null;
        rule.value[2].value = null;
      },
    },
  },
  {
    title: '统计维度',
    field: 'timeType',
    type: 'select',
    options: [
      {
        value: 1,
        label: '按天',
      },
      {
        value: 2,
        label: '按周',
      },
      {
        value: 3,
        label: '按月',
      },
      {
        value: 4,
        label: '按季度',
      },
      {
        value: 5,
        label: '按年',
      },
    ],
  },
  {
    title: '部门',
    field: 'departmentIdList',
    type: 'component',
    component: shallowRef(DepartmentCascader),
  },
  {
    title: '人员',
    field: 'attributionIdList',
    type: 'component',
    component: shallowRef(UserSelect),
  },
  {
    title: '商品分类',
    field: 'productCategoryIdList',
    type: 'component',
    component: shallowRef(GoodsTypeCascader),
  },
  {
    title: '商品',
    field: 'productSkuNameList',
    type: 'component',
    component: shallowRef(SelectTags),
  },
  {
    title: '国家',
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
    title: '服务商',
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
]);
