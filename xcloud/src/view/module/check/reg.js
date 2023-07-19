export const regList = [
  // 手机号
  {
    reg: /^1((3|8)[0-9]|4[014-9]|(5|9)[0-35-9]|6[25-7]|7[0-8])\d{8}$/,
    type: '0',
  },
  // 订单号
  {
    reg: /^([MKCJSGXP]|MW|KBY|KSY)\d{12}$|^KSY\d{20}$/,
    type: '1',
  },
  // 税号
  {
    reg: /^N\d{7}[A-Z]$|^\d{2}\s\d{3}\/\d{4}$|^NL\d{9}B\d{2}$|^[A-Z]{3}[0-9A-Z]{9}$|^(FR|IT)?\d{11}$|^(CZ)?\d{9}$|^(PL|IM|BE)\d{10}$|^\d{15}$|^SE\d{12}$|^\d{9}RT001$|^TFN:\d{9}$|^ABN:\d{11}$|^\d{8}[A-Z]$|^\d{2,3}\/\d{3}\/\d{3}$|^\d{2}\/\d{3}\/\d{5}$/,
    type: '3',
  },
  // 服务号
  {
    reg: /^(000|FW0|RG|TH|TMS)?\d{18}$|^CS\d{10}$|^FW0\d{20}$/,
    type: '4',
  },
  // 公司名
  // {
  //   reg: /^[\u4e00-\u9fa5a-zA-Z]+$/,
  //   type: '5',
  // },
];

export function matchReg(val) {
  let type = '5';
  for (let item of regList) {
    if (item.reg.test(val)) {
      type = item.type;
      break;
    }
  }
  return type;
}
