import type { TableColumnsType } from 'ant-design-vue';
import {  getEnterpriseSelect, listByCategory } from '@/api/base/basicsData';
import { ref } from 'vue';
import dayjs from 'dayjs';

export const columns: TableColumnsType = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 50,
  },
  {
    title: '所属主体',
    dataIndex: 'enterpriseName',
    width: 150,
  },
  {
    title: '消息类型',
    dataIndex: 'messageType',
  },
  {
    title: '所属业务',
    dataIndex: 'functionCode',
  },
  {
    title: '通知方式',
    dataIndex: 'sendModel',
  },
  {
    title: '通知对象',
    dataIndex: 'sendType',
  },
  {
    title: '消息标题',
    dataIndex: 'messageTitle',
    width: 180,
    ellipsis: true,
  },
  {
    title: '消息内容',
    dataIndex: 'content',
    width: 180,
    ellipsis: true,
  },
  {
    title: '客户名称',
    dataIndex: 'userName',
  },
  {
    title: '手机号',
    dataIndex: 'userMobile',
    width: 120,
  },
  {
    title: '发送时间',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '发送状态',
    dataIndex: 'sendStatus',
  },
  {
    title: '消息状态',
    dataIndex: 'messageStatus',
  },
  
];


let enterpriseIdList:any = []
let workOrderTypeOpt:any = []
let optArr: Array<any> = [];

export const rule: any = ref([
  {
    title: '工单类型',
    field: 'workOrderType',
    type: 'cascader',
    props: {
      fieldNames: { label: 'name', value: 'code', children: 'children' },
      options: [],
    },
    options: async () => {
      workOrderTypeOpt = await listByCategory()
      workOrderTypeOpt.forEach((item: any) => {
        if (item.workFunctionList && item.workFunctionList.length) {
          optArr = optArr.concat(item.workFunctionList);
        }
      });
      rule.value[0].props.options  = (workOrderTypeOpt as any)
        .map((v: any) => {
          return {
            code: v.id,
            name: v.name,
            children: (v.workFunctionList || []),
          };
        });
    },
  },
  {
    title: '所属主体',
    field: 'enterpriseIdList',
    type: 'select',
    options: async () => {
      enterpriseIdList = ((await getEnterpriseSelect()) as any).map((v: { id: string; name: string }) => {
        return {
          value: v.id,
          label: v.name,
        };
      });

      return enterpriseIdList
    },
    props: {
      mode: 'multiple',
    },
  },
  {
    title: '消息类型',
    field: 'messageType',
    type: 'select',
    options: [
      {
        value: null,
        label: '全部',
      },
      {
        value: 'SERVICE',
        label: '服务通知',
      },
      {
        value: 'RENEWAL',
        label: '续费通知',
      },
      {
        value: 'ORDER',
        label: '订单消息',
      },
    ],
  },
  {
    title: '通知方式',
    field: 'sendModel',
    type: 'select',
    value: '',
    options: [
      {
        value: null,
        label: '全部',
      },
      {
        value: 'SMS',
        label: '短信',
      },
      {
        value: 'CLIENT',
        label: '客户端',
      },
      {
        value: 'PENDING',
        label: '待办',
      },
    ],
    on: {
      change: (val: any) => {
        rule.value[8].value = '';
      },
    },
  },

  {
    title: '消息标题',
    field: 'messageTitle',
    type: 'input',
  },
  

  {
    title: '客户名称',
    field: 'userName',
    type: 'input',
  },
  {
    title: '客户手机号',
    field: 'userMobile',
    type: 'input',
  },
  {
    title: '发送状态',
    field: 'sendStatus',
    type: 'select',
    options: [
      {
        value: null,
        label: '全部',
      },
      {
        value: 'SUCCESS',
        label: '发送成功',
      },
      {
        value: 'FAIL',
        label: '发送失败',
      },
    ],
  },
  {
    title: '消息状态',
    field: 'messageStatus',
    type: 'select',
    link: ['sendModel'],
    value: '',
    update(val: any, rule: any, fApi: any) {
      setTimeout( ()=> {
      let messageTypeVal = fApi.getValue('sendModel');
      var options = null

      if (messageTypeVal == 'CLIENT') {

        options =[
          {
            value: null,
            label: '全部',
          },
          {
            value: 'YES',
            label: '已读',
          },
          {
            value: 'NO',
            label: '未读',
          },
        ]
        rule.options = options;
        fApi.reload();
        
      } else if (messageTypeVal == 'PENDING')  {
        options =[
          {
            value: null,
            label: '全部',
          },
          {
            value: 'YES',
            label: '已处理',
          },
          {
            value: 'NO',
            label: '未处理',
          },
        ]
        rule.options = options;
        fApi.reload();
      } else {
        rule.options = [];
        fApi.reload();
      }
      
    })
    },
  },

  {
    title: '发送时间',
    field: 'createTimeTimeList',
    type: 'datePicker',
    props: {
      range: true,
      defaultPickerValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
]);


export {enterpriseIdList , optArr};