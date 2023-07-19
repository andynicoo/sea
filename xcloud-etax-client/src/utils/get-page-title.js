import defaultSettings from "@/settings";

const title = defaultSettings.title;
/**
 * 返回页面title
 * @param {*} pageTitle
 * @returns
 */
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
