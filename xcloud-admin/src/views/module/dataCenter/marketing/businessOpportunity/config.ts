import { ref } from 'vue';
import type { TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import { departmentList } from '@/api/dataCenter/businessOpportunity';

export const rule: any = ref([
  {
    title: '选择时间',
    field: 'rageTime',
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
    title: '商品大类',
    field: 'opportunityCategoryIdList',
    type: 'select',
    options: [
      {
        value: 'VAT服务',
        label: 'VAT服务',
      },
      {
        value: '商标服务',
        label: '商标服务',
      },
      {
        value: '海外工商',
        label: '海外工商',
      },
      {
        value: '外观专利',
        label: '外观专利',
      },
      {
        value: '合规认证',
        label: '合规认证',
      },
      {
        value: '版权',
        label: '版权',
      },
      {
        value: '其他',
        label: '其他',
      },
    ],
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '部门层级',
    field: 'departmentLevel',
    type: 'select',
    value: 2,
    props: {
      allowClear: false,
      showSearch: false,
    },
    on: {
      change: (val: any) => {
        departmentList({
          level: val,
        }).then((res: any) => {
          const list = Array.isArray(res) ? res : [];
          rule.value[3].value = list;
          rule.value[3].options = (list as Array<string>).map((v: string) => {
            return {
              value: v,
              label: v,
            };
          });
        });
      },
    },
    options: [
      // {
      //   value: 1,
      //   label: '1级',
      // },
      {
        value: 2,
        label: '2级',
      },
      {
        value: 3,
        label: '3级',
      },
      {
        value: 4,
        label: '4级',
      },
      {
        value: 5,
        label: '5级',
      },
    ],
    style: {
      width: '100px',
    },
  },
  {
    title: '下级部门',
    field: 'departmentNameList',
    type: 'select',
    value: ['客户中心'],
    options: async () => {
      const res = await departmentList({
        level: rule.value[2].value,
      });
      const list = Array.isArray(res) ? res : [];
      rule.value[3].value = list;
      return (list as Array<string>).map((v: string) => {
        return {
          value: v,
          label: v,
        };
      });
    },
    props: {
      mode: 'multiple',
    },
  },
]);

export const columns = ref<TableColumnsType>([
  {
    title: '所属部门',
    dataIndex: 'departmentName',
    width: 100,
    fixed: true,
  },
  {
    title: '商品大类',
    dataIndex: 'productCategoryIdea',
    width: 100,
    fixed: true,
  },
  {
    title: '新增商机数量',
    dataIndex: 'addOpportunityCount',
    width: 100,
  },
  {
    title: '转化率',
    dataIndex: 'changeRatio',
    width: 100,
  },
  {
    title: '预计赢单金额',
    dataIndex: 'exceptAmount',
    width: 100,
  },
  {
    title: '预计赢单量',
    dataIndex: 'exceptOpportunityCount',
    width: 100,
  },
  {
    title: '实际赢单金额(按预计日期)',
    dataIndex: 'winningAmountByExceptDate',
    width: 170,
  },
  {
    title: '实际赢单金额(按实际日期)',
    dataIndex: 'winningAmountByWinningDate',
    width: 170,
  },
  {
    title: '实际赢单量(按预计日期)',
    dataIndex: 'winningOpportunityCountByExceptDate',
    width: 160,
  },
  {
    title: '实际赢单量(按实际日期)',
    dataIndex: 'winningOpportunityCountByWinningDate',
    width: 160,
  },
  {
    title: '平均转化时长',
    dataIndex: 'avgChangeTime',
    width: 100,
  },
]);
