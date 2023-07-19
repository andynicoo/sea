import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { queryCountry, queryCategory } from '@/api/workOrder/intellectualProperty/trademarkName';

export const rule: any = ref([
  {
    title: '操作人',
    field: 'createUserName',
    type: 'input',
  },
  {
    title: '查询国家',
    field: 'queryCountryCodeList',
    type: 'select',
    options: async () => {
      return ((await queryCountry({})) as any).map((v: { countryCode: string; countryName: string }) => {
        return {
          value: v.countryCode,
          label: v.countryName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '查询类目',
    field: 'queryCategoryCodeList',
    type: 'select',
    options: async () => {
      return ((await queryCategory({})) as any).map((v: { categoryNum: string; categoryName: string }) => {
        return {
          value: v.categoryNum,
          label: v.categoryNum + '类' + '（' + v.categoryName + '）',
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '查询商标',
    field: 'queryTrademark',
    type: 'input',
  },
  {
    title: '查询时间',
    field: 'createTimeList',
    type: 'datePicker',
    value: [
      dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ],
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
]);

export const ruleBatch: any = ref([
  {
    title: '文件名称',
    field: 'fileName',
    type: 'input',
  },
  {
    title: '操作人',
    field: 'createUserName',
    type: 'input',
  },
  {
    title: '查询国家',
    field: 'countryCodeList',
    type: 'select',
    options: async () => {
      return ((await queryCountry({})) as any).map((v: { countryCode: string; countryName: string }) => {
        return {
          value: v.countryCode,
          label: v.countryName,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '上传时间',
    field: 'createTimeList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '查询时间',
    field: 'successfulTimeList',
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
    title: '操作人',
    dataIndex: 'createUserName',
    width: 130,
  },
  {
    title: '查询国家',
    dataIndex: 'queryCountryName',
    width: 100,
  },
  {
    title: '查询类目',
    dataIndex: 'queryCategory',
    width: 100,
  },
  {
    title: '查询商标',
    dataIndex: 'queryTrademark',
    width: 120,
  },
  {
    title: '近似商标',
    dataIndex: 'approximateTrademark',
    width: 100,
  },
  {
    title: '对应国家',
    dataIndex: 'correspondingCountryName',
    width: 100,
  },
  {
    title: '对应类目',
    dataIndex: 'correspondingCategory',
    width: 120,
  },
  {
    title: '商标状态',
    dataIndex: 'trademarkStatus',
    width: 100,
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    width: 160,
  },
  {
    title: '系统通过率',
    dataIndex: 'systemPassRate',
    width: 250,
  },
  {
    title: '查询时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '查询平台',
    dataIndex: 'enterpriseName',
    width: 120,
  },
]);

export const columnsBatch = ref<TableColumnsType>([
  {
    title: '文件名称',
    dataIndex: 'fileName',
    width: 200,
  },
  {
    title: '操作人',
    dataIndex: 'createUserName',
    width: 120,
  },
  {
    title: '查询国家',
    dataIndex: 'countryCodeName',
    width: 120,
  },
  {
    title: '查询商标总量',
    dataIndex: 'trademarkTotal',
    width: 120,
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '查询时间',
    dataIndex: 'successfulTime',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 120,
  },
]);

export const rule3: any = ref([
  {
    title: '查询国家',
    field: 'countryCode',
    type: 'select',
    value: 'US',
    validate: [{ message: '请选择查询国家', required: true }],
    options: async () => {
      return ((await queryCountry({})) as any).map((v: { countryCode: string; countryName: string }) => {
        return {
          value: v.countryCode,
          label: v.countryName,
          disabled: v.countryCode !== 'US',
        };
      });
    },
  },
  {
    title: '查询类目',
    field: 'catetoryNum',
    type: 'select',
    options: async () => {
      return ((await queryCategory({})) as any).map((v: { categoryNum: string; categoryName: string }) => {
        return {
          value: v.categoryNum,
          label: v.categoryNum + '类' + '（' + v.categoryName + '）',
        };
      });
    },
    validate: [
      {
        message: '请选择类目',
        trigger: 'change',
        required: true,
      },
    ],
  },
  {
    title: '商标名称',
    field: 'trademarkName',
    type: 'input',
    value: '',
    props: {
      maxlength: 50,
    },
    validate: [
      { message: '请输入商标名称', required: true },
      {
        message: '请输入3-30个字符的名称',
        validator: (rule: any, value: string, callback: (s?: boolean) => void) => {
          const str = value.replace(/ /g, '');
          console.log('object :>> ', JSON.stringify(str));
          if (str.length < 3 || str.length > 30) {
            callback(true);
          } else {
            callback();
          }
        },
      },
      { message: '仅支持数字,字母,空格的商品名称', pattern: /^[\u0000-\u4E00\u9FA5]{3,50}$/ },
    ],
  },
]);

export const columns3A = ref<TableColumnsType>([
  {
    title: '分类名称',
    dataIndex: 'trademarkCategory',
    width: 130,
  },
  {
    title: '命中关键词库商标英文名',
    dataIndex: 'trademarkNameEn',
    width: 200,
  },
  {
    title: '命中关键词库中文名',
    dataIndex: 'trademarkName',
    width: 200,
  },
]);
