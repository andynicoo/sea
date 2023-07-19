const unitArray = [
  {
    id: 1,
    name: "年"
  },
  {
    id: 2,
    name: "个"
  },
  {
    id: 3,
    name: "次"
  },
  {
    id: 4,
    name: "类"
  },
  {
    id: 5,
    name: "季"
  },
  {
    id: 6,
    name: "月"
  },
  {
    id: 7,
    name: "year"
  },
  {
    id: 8,
    name: "piece"
  },
  {
    id: 9,
    name: "class"
  },
  {
    id: 10,
    name: "quarter"
  },
  {
    id: 11,
    name: "month"
  }
];

const targetArray = [
  {
    id: 1,
    name: "PC端"
  },
  {
    id: 2,
    name: "H5页面"
  },
  {
    id: 3,
    name: "线下"
  }
];
const stateArray = [
  {
    id: 1,
    name: "已上架"
  },
  {
    id: 2,
    name: "已下架"
  },
  {
    id: 3,
    name: "待上架"
  },
  {
    id: 4, 
    name: '交接中'
  },
  {
    id: 5,
    name: '已售出'
  },
];

const oalistArray = [
  {
    id: 2,
    name: "转代理申报"
  },
  {
    id: 3,
    name: "税务补缴"
  },
  {
    id: 4,
    name: "转代理"
  },
  {
    id: 5,
    name: "注册+申报"
  },
  {
    id: 6,
    name: "税号注销"
  },
  {
    id: 7,
    name: "税务稽查"
  },
  {
    id: 13,
    name: "海牙认证"
  },
  {
    id: 16,
    name: "授权代表(英代,欧代)"
  }
];

// 币别
const currencyList = [
  {
    label: '人民币',
    value: '￥'
  },
  {
    label: '美元',
    value: '$'
  },
  {
    label: '欧元',
    value: '€'
  },
  {
    label: '英镑',
    value: '£'
  }
]

export default {
  unitArray,
  targetArray,
  stateArray,
  oalistArray,
  currencyList
};
