import { useSelector } from "react-redux";

/**
 * 解析路由字符
 */
export function decodeUrlSearch(search: string) {
    if (/^\?/.test(search)) search = search.substring(1);
    const obj: any = {};
    search.split("&").forEach((searchItem) => {
        const [key, value] = searchItem.split("=");
        obj[key] = value;
    });
    return obj;
}

export function encodeUrlSearch(query: Object) {
    // @ts-ignore
    return Object.keys(query).filter((key) => query[key]).map((key) => `${key}=${query[key]}`).join("&");
}

//按钮权限
export function AuthVisible(auth: string) {
    let buttonAuth = []
    // @ts-ignore
    if (sessionStorage.buttonAuth) {
        buttonAuth = JSON.parse(sessionStorage.buttonAuth)
    }
    return buttonAuth.includes('ACTION_' + auth)
}