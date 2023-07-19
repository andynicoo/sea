import { ref, shallowRef } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getCountrySelectList } from '@/api/base/basicsData';
import GoodsTypeCascader from '@/components/form/GoodsTypeCascader.vue';

export const rule: any = ref([
  {
    title: '商品分类',
    field: 'productCategoryIdList',
    type: 'component',
    component: shallowRef(GoodsTypeCascader),
  },
  {
    title: '规格名称',
    field: 'specsName',
    type: 'input',
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
    title: '生效月份',
    field: 'effectiveMonth',
    type: 'datePicker',
    value: dayjs().format('YYYY-MM'),
    props: {
      picker: 'month',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
  },
  {
    title: '商品分类',
    dataIndex: 'categoryName',
    width: 120,
  },
  {
    title: '规格名称',
    dataIndex: 'productSpecsName',
    width: 150,
  },
  {
    title: '规格编码',
    dataIndex: 'productSpecsCode',
    width: 130,
  },
  {
    title: '国家',
    dataIndex: 'countryName',
    width: 100,
  },
  {
    title: '国家编码',
    dataIndex: 'countryCode',
    width: 100,
  },
  {
    title: '州',
    dataIndex: 'chauName',
    width: 130,
  },
  {
    title: '州编码',
    dataIndex: 'chauCode',
    width: 130,
  },
  {
    title: '官费',
    dataIndex: 'officialFee',
    width: 120,
  },
  {
    title: '官费币种',
    dataIndex: 'officialFeeCurrency',
    width: 150,
  },
  {
    title: '第三方服务费',
    dataIndex: 'thirdServiceFee',
    width: 120,
  },
  {
    title: '第三方服务费币种',
    dataIndex: 'thirdServiceFeeCurrency',
    width: 150,
  },
  {
    title: '生效月份',
    dataIndex: 'month',
    width: 130,
  },
  {
    title: '归属人',
    dataIndex: 'belongerList',
    width: 200,
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    width: 160,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 100,
  },
]);
