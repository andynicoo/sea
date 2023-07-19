/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ["admin", "editor"];
  return valid_map.indexOf(str.trim()) >= 0;
}
/**
 * 检测浏览器是否是手机端，是手机会跳转到H5端
 */
export function isMobile() {
  return Boolean(navigator.userAgent.match(/AppleWebKit.*Mobile.*/));
}
