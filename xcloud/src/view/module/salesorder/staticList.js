const tablist = [
  // {
  //   name: "全部订单",
  //   type: "-1"
  // },
  {
    name: "待审核",
    type: "12",
  },
  {
    name: "待付款",
    type: "0",
  },
  {
    name: "已付款 ",
    type: "2",
  },
  {
    name: "已取消 ",
    type: "3",
  },
];

const orderSourceList = [
  {
    name: "PC端",
    id: 1,
  },
  {
    name: "H5端",
    id: 2,
  },
  {
    name: "手工录单",
    id: 3,
  },
  // {
  //   name: "小程序",
  //   id: 4
  // }
  {
    name: '渠道系统',
    id: 5
  }
];

const paymentChannelList = [
  {
    name: "未知",
    id: 0,
  },
  {
    name: "微信",
    id: 1,
  },
  {
    name: "支付宝",
    id: 2,
  },
  {
    name: "银联",
    id: 3,
  },
];

const statusList = [
  // {
  //   name: "全部订单",
  //   id: "",
  // },
  {
    name: "待付款",
    id: "0",
  },
  {
    name: "付款待确认",
    id: "1",
  },
  {
    name: "已付款",
    id: "2",
  },
  {
    name: "已取消",
    id: "3",
  },
  {
    name: "部分付款",
    id: "4",
  },
  {
    name: "部分退款",
    id: "5",
  },
  {
    name: "全额退款",
    id: "6",
  },
  {
    name: "订单驳回",
    id: "10",
  },
  {
    name: "付款被驳回",
    id: "11",
  },
  {
    name: "待审核",
    id: "12",
  },
  {
    name: '付款被驳回-申请取消',
    id: '13'
  }
];

const paymentTypeList = [
  {
    id: 0,
    name: "正常付款",
  },
  {
    id: 1,
    name: "挂账付款",
  },
  {
    id: 2,
    name: "分期付款",
  },
];

const orderList = [
  {label: '正常订单', value: '0'},
  {label: '续费订单', value: '1'},
  {label: '项目制订单', value: '2'},
  {label: '溢价订单', value: '3'}
]

const invoiceStatusList = [
  {label: '待确认到账', value: '6'},
  {label: '待开票', value: '1'},
  {label: '已开票', value: '2'},
  {label: '付款被驳回', value: '8'},
  {label: '退款中', value: '5'},
  {label: '部分退款', value: '7'},
  {label: '全部退款', value: '3'},
  {label: '已取消', value: '4'},
]
export default {
  tablist,
  orderSourceList,
  paymentChannelList,
  statusList,
  paymentTypeList,
  orderList,
  invoiceStatusList
};
