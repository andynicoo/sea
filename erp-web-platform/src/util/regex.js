const HOSTNAME = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/

const IP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

const URL = /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/
// eslint-disable-next-line
const EMAIL = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/

// const PASSWORD = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/  // 必须密码加数字，不区分大小写

// const PASSWORD = /(?=.*[0-9])(?=.*[a-zA-Z])(?![^a-zA-Z0-9]).{6,30}/ // 密码加数字 加符号   符号可选

const PASSWORD = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[. @$!%*#_~?&^{}【】\-+/|\\':;])[\da-zA-Z. @$!%*#_~?&^{}【】\-+/|\\':;]{8,}$/ // 密码设置至少8个字符，且至少包含一个字母、一个数字和一个符号

const MOBILE = /^[0-9]*$/

const CHINA_MOBILE = /^1[3456789]\d{9}$/

///^[1][3-9][0-9]{9}$/

/**
 * 大于0正整数或最多两位小数(金额)
 */
const PRICE = /^([1-9][\d]{0,12}|0)(\.[\d]{1,2})?$/

/**
 * 数字与英文
 */
const NUMBERADNLETTER = /^[0-9a-zA-Z]*$/

/**
 * 大于0的数字
 */
const POSITIVE_NUMBER = /^\+?[1-9][0-9]*$/
/**
 * 正数（包括小数）
 */
const POSITIVE_NUMBER_2 = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/

const NUM20 = /^2[0]$|^[1]\d$|^[1-9]$/ //输入1-20的整数

const NUM50 = /^5[0]$|^[1-4]\d$|^[1-9]$/ //输入1-50的整数

const NONNEGATIVE_NUM = /^\d+$/ // 非负整数

const CN_CHAR = /^[\u4E00-\u9FA5]{1,}$/ // 中文字符
const EN_CHAR = /^[a-zA-Z]{1,}$/ // 英文字符

const ENV_URL_TEST = /^http(s)?:\/\/test-erp.emalacca.com/
const ENV_URL_UAT = /^http(s)?:\/\/pre-erp.emalacca.com/
const ENV_URL_PRO = /^http(s)?:\/\/erp.emalacca.com/

const PDD_LINK = /http(s)?:\/\/mobile\.yangkeduo\.com/ //拼多多
const TB_LINK = /http(s)?:\/\/.*\.?taobao\.com/ // 淘宝
const TM_LINK = /http(s)?:\/\/.*\.?tmall\.com/ //天猫
const T1688_LINK = /http(s)?:\/\/.*\.?1688\.com/ //1688

/**
 * 英文符号
 */
const EN_SIGN_CHAR = /[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/g

export {
  HOSTNAME,
  IP,
  URL,
  EMAIL,
  PASSWORD,
  MOBILE,
  NUM20,
  NUM50,
  PRICE,
  NONNEGATIVE_NUM,
  POSITIVE_NUMBER,
  POSITIVE_NUMBER_2,
  ENV_URL_TEST,
  ENV_URL_UAT,
  ENV_URL_PRO,
  CN_CHAR,
  EN_CHAR,
  PDD_LINK,
  TB_LINK,
  TM_LINK,
  T1688_LINK,
  EN_SIGN_CHAR,
  CHINA_MOBILE,
  NUMBERADNLETTER
}
