// VAT服务;

// 税号注册;

// 税务转代理;

// 海牙认证;

// 税号注销;

// 税务稽查;

// VAT退税;

// 知识产权;

// 国际商标注册;

// OA审查意见;

// 合规服务;

// 授权代表;

// EPR注册;
export const workTypeEnum = [
  { key: 1, value: "税号注册" },
  { key: 2, value: "税务转代理" },
  { key: 3, value: "海牙认证" },
  { key: 4, value: "税号注销" },
  { key: 5, value: "税务稽查" },
  { key: 6, value: "VAT退税" },
  { key: 7, value: "国际商标注册" },
  { key: 8, value: "授权代表" },
  { key: 9, value: "EPR注册" },
];

export const detailEnum = [
  { key: 5, path: "taxRegisterInfo" }, //1 税号注册
  { key: 2, path: "taxInfo" }, //2 税务转代理
  { key: 13, path: "hyCertificationDetail" }, //3 海牙认证
  { key: 31, path: "EPRManageDetail" }, //4  EPR注册
  { key: 16, path: "authorizedRepresentDetail" }, //5 授权代表
  { key: 6, path: "logoutTaxNumDetail" }, //6 税号注销
  { key: 7, path: "taxInspectionDetail" }, //7 税务稽查
  { key: 24, path: "taxRefundDetail" }, //8 VAT退税
  { key: 61, path: "trademarkDetail" }, //9 国际商标注册
];
