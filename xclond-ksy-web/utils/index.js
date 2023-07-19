import store from "@/store";
import countryCode from "@/utils/countryCode.json";
import countryCodeHot from "@/utils/countryCodeHot.json";

/**
 * 根据传进的key查询key模块的显示状态
 * @param modulesData 模块数组
 * @param key string
 */
export function getModulesStatus(modulesData, key) {
  console.log(modulesData.length, store);
  if (modulesData.length) {
    let keyValue = modulesData.filter((ele) => ele.moduleKey === key);
    return keyValue[0].status;
  } else {
    return false;
  }
}

/**
 * 根据传进的key查询对应的国旗，如果没有返回undefined图片
 * @param code 传入的国旗code
 * @param type type!==1时，热门服务正方形国旗
 */
export function getImgByCountryCode(code, type = 1) {
  let countryJson = type === 1 ? countryCode : countryCodeHot;
  let country = countryJson.filter((ele) => ele.code === code);
  var flag = "";
  if (country.length) {
    flag = country[0].code;
  } else {
    flag = "undefined";
  }
  return flag;
}

// 在线客服统一处理
export function customerFunc() {
  let PLA = process.env.NODE_PLA;
  let configId = "";
  switch (PLA) {
    case "kby":
      configId = "b4a50b72-c5a2-498b-a617-8b4357dafd95";
      break;
    case "ksy":
      configId = "f69a32e9-64dd-4d7d-b787-9b2753de99d0";
      break;
    case "wg":
      configId = "b4a50b72-c5a2-498b-a617-8b4357dafd95";
      break;
    case "kqy":
      configId = "1afaacf9-84e7-408c-8e6c-297fb9aded10";
      break;
    default:
      break;
  }
  easemobim.bind({ configId });
}

// 配置信息
export let configInfo = {
  kby: {
    siteName: "跨标云",
    userAgreementUrl: "https://ori.iipto.com/agreement.html", //用户协议
    userAgreementName: "《跨标云用户协议》",
    privacyPolicyUrl: "https://ori.iipto.com/privacy.html", //隐私政策
    privacyPolicyName: "《跨标云隐私策略》",
    logo: require("@/assets/images/login/logo.svg"),
    slogan: "助力跨境电商卖家开启全球品牌之路",
  },
  wg: {
    siteName: "辰知云",
    userAgreementUrl: "https://chenhaiip.itaxs.com/agreementwg.html", //用户协议
    userAgreementName: "《盛骁科技用户协议》",
    privacyPolicyUrl: "https://chenhaiip.itaxs.com/privacyagreementwg.html", //隐私政策
    privacyPolicyName: "《盛骁科技隐私政策》",
    logo: require("@/assets/images/login/wglogo.svg"),
    slogan: "",
  },
  ksy: {
    siteName: "跨税云",
    userAgreementUrl: "https://ori.itaxs.com/agreement.html", //用户协议
    userAgreementName: "《跨税云用户协议》",
    privacyPolicyUrl: "https://ori.itaxs.com/privacy.html", //隐私政策
    privacyPolicyName: "《跨税云隐私策略》",
    logo: require("@/assets/images/login/ksylogo.png"),
    slogan: "推动跨境电商税务合规化、标准化、智能化",
  },
  kqy: {
    siteName: "跨企云",
    userAgreementUrl: "https://www.iebsvip.com/privacyagreementkqy.html", //用户协议
    userAgreementName: "《跨企云用户协议》",
    privacyPolicyUrl: "https://www.iebsvip.com/agreementkqy.html", //隐私政策
    privacyPolicyName: "《跨企云隐私策略》",
    logo: require("@/assets/images/login/kqylogo.png"),
    slogan: "国际工商SaaS平台",
  },
};
//时间格式的转化
export function formatDate(date, fmt) {
  function padLeftZero(str) {
    return ("00" + str).substr(str.length);
  }
  if (!date) {
    return "";
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + "";
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
}

// 过滤热门国家
const hot = ['中国','美国','英国','德国','法国','意大利'];
export function getHotCountryList(countryList){
  return countryList.filter(v => hot.some(val => v.countryZh === val))
}
// 过滤非热门国家
export function getCountryList(countryList){
  return countryList.filter(v => hot.every(val => v.countryZh !== val))
}

// 转换商标类别
export function getTrademarkCategory(val){
  let _val = parseInt(val)
  return `${_val < 10 ? '0' + _val : val}类`
}