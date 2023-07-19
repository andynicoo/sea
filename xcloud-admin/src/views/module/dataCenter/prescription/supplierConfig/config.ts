import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import { getCountrySelectList, listByCategory } from '@/api/base/basicsData';

export const rule: any = ref([
  {
    title: '工单类型',
    field: 'workOrderType',
    type: 'cascader',
    props: {
      fieldNames: { label: 'name', value: 'code', children: 'children' },
      options: [],
    },
    effect: {
      fetch: async () => {
        const idArr = monitorEnum.map((v: any) => String(v.id));
        rule.value[0].props.options = ((await listByCategory()) as any)
          .map((v: any) => {
            return {
              code: 'p1_' + v.id,
              name: v.name,
              children: (v.workFunctionList || []).filter((c: { code: string }) => idArr.indexOf(c.code) !== -1),
            };
          })
          .filter((v: any) => v.children.length > 0);
      },
    },
  },
  {
    title: '国家',
    field: 'countryCode',
    type: 'select',
    options: async () => {
      return ((await getCountrySelectList()) as any).map((v: { countryCode: string; countryNameZh: string }) => {
        return {
          value: v.countryCode,
          label: v.countryNameZh,
        };
      });
    },
  },
  {
    title: '状态',
    field: 'isUse',
    type: 'select',
    options: [
      {
        value: 1,
        label: '开启',
      },
      {
        value: 0,
        label: '禁用',
      },
    ],
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '工单类型',
    dataIndex: 'workOrderTypeName',
    width: 140,
  },
  {
    title: '国家',
    dataIndex: 'countryCodeName',
    width: 140,
  },
  {
    title: '监控区间',
    dataIndex: 'workOrderType',
    width: 180,
  },
  {
    title: '预警时效',
    dataIndex: 'warnDuration',
    width: 120,
  },
  {
    title: '交付时效',
    dataIndex: 'deliverDuration',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'isUse',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 180,
  },
]);

/**工单监控区间 */
export const monitorEnum = [
  { id: 5, section: '注册中 - 注册完成' }, //注册税号
  { id: 2, section: '转代理中 - 转代理完成' }, //税务转代理
  { id: 24, section: '退税中 - 退税完成' }, //海牙认证
  { id: 6, section: '注销中 - 已完成' }, //税号注销
  { id: 31, section: '注册中 - 注册完成' }, //ERP注册
  { id: 7, section: '处理中 - 已完成' }, //税务稽查
  { id: 61, section: '律师审核 - 审核期' }, //国际商标注册
  { id: 13, section: '海牙认证 - 海牙认证完成' }, //海牙认证
  { id: 16, section: '已审核 - 待授权' }, //授权代表
  { id: 1, section: '待上传回执 - 申报完成' }, //vat申报
  { id: 100, section: '下载资料 - 上传专利证书' }, //外观专利
];
