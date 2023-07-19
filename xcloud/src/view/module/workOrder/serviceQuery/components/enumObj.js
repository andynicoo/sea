export const statusObj = {
  FAILURE: 9,
  WAIT_SUBMIT: 10,
  WAIT_AUDIT_DECLARE: 11,
  DECLARING: 12,
  WAIT_PAID: 13,
  WAIT_AUDIT: 14,
  DECLARE_DOCK_COMPLATE: 15,
  DECLARE_COMPLETE: 16,
  VOUCHER_REJECT: 17,
  Sub_REJECT: 18,
  Tax_REJECT: 19
}
export const statusList = [{
    label: '待提交申报',
    value: statusObj.WAIT_SUBMIT
  },
  {
    label: '待审核申报',
    value: statusObj.WAIT_AUDIT_DECLARE
  },
  {
    label: '申报中',
    value: statusObj.DECLARING
  },
  {
    label: '待缴纳税金',
    value: statusObj.WAIT_PAID
  },
  {
    label: '待审核税金',
    value: statusObj.WAIT_AUDIT
  },
  {
    label: '申报对接完成',
    value: statusObj.DECLARE_DOCK_COMPLATE
  },
  {
    label: '申报完成',
    value: statusObj.DECLARE_COMPLETE
  },
  {
    label: '转出代理',
    value: statusObj.VOUCHER_REJECT
  },
  {
    label: '待提交申报(驳回) ',
    value: statusObj.Sub_REJECT
  },
  {
    label: '待缴纳税金(驳回) ',
    value: statusObj.Tax_REJECT
  }
]
export const serviceStatusList = [{
    label: '服务中 ',
    value: '1'
  },
  {
    label: '注销税号 ',
    value: '3'
  },
  {
    label: '转出代理 ',
    value: '4'
  },
  {
    label: '待续费 ',
    value: '2'
  },
  {
    label: '已取消',
    value: '9'
  },
  {
    label: '取消中',
    value: '11'
  },
  {
    label: '确认转出',
    value: '13'
  }
]

export const ruleObj = {
  HAVE_DATA: 0,
  Two_DATA: 1
}
export const ruleList = [{
    label: '零申报',
    value: ruleObj.HAVE_DATA
  },
  {
    label: '有数据',
    value: ruleObj.Two_DATA
  }
]

export const typeList = [{
    label: 'C79/88',
    value: 1
  },
  {
    label: '发票抵扣',
    value: 2
  },
  {
    label: 'B2B发票',
    value: 4
  },
  {
    label: '其它',
    value: 3
  }
]
export const typeListGB = [{
    label: 'C79/88',
    value: 1
  },
  {
    label: '发票抵扣',
    value: 2
  },
  {
    label: 'PVA',
    value: 5
  },
  {
    label: '其它',
    value: 3
  }
]
export const typeListSA = [{
    label: '平台佣金',
    value: 6
  },
  {
    label: '运费',
    value: 7
  },
  {
    label: '仓储费',
    value: 8
  },
  {
    label: '推广费',
    value: 9
  },
  {
    label: '其它',
    value: 3
  }
]
// 27个欧盟国及其税率
export const otherOmCountryList = [{
    countryName: '奥地利',
    countryCode: 'AT',
    currency: 'EUR',
    sales: 0.00
  },
  // { countryName: '英国', countryCode: 'GB', currency: 'EUR', sales: '' },
  {
    countryName: '比利时',
    countryCode: 'BE',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '保加利亚',
    countryCode: 'BG',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '塞浦路斯',
    countryCode: 'CY',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '捷克共和国',
    countryCode: 'CZ',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '德国',
    countryCode: 'DE',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '丹麦',
    countryCode: 'DK',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '爱沙尼亚',
    countryCode: 'EE',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '希腊',
    countryCode: 'GR',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '西班牙',
    countryCode: 'ES',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '芬兰',
    countryCode: 'FI',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '法国',
    countryCode: 'FR',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '克罗地亚',
    countryCode: 'HR',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '匈牙利',
    countryCode: 'HU',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '爱尔兰',
    countryCode: 'IE',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '意大利',
    countryCode: 'IT',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '立陶宛',
    countryCode: 'LT',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '卢森堡',
    countryCode: 'LU',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '拉脱维亚',
    countryCode: 'LV',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '马耳他',
    countryCode: 'MT',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '荷兰',
    countryCode: 'NL',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '波兰',
    countryCode: 'PL',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '葡萄牙',
    countryCode: 'PT',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '罗马尼亚',
    countryCode: 'RO',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '瑞典',
    countryCode: 'SE',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '斯洛文尼亚',
    countryCode: 'SI',
    currency: 'EUR',
    sales: ''
  },
  {
    countryName: '斯洛伐克',
    countryCode: 'SK',
    currency: 'EUR',
    sales: ''
  }
]
