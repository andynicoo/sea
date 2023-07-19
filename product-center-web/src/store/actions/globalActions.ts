import { globalType } from "@/store/actions/actionsType"
import { Key } from "react";


/**
 * 设置按钮权限
 */
export const setButtonAuth = (auth: string[]) => (dispatch: any) => {
    return dispatch({
        type: globalType.SET_BUTTON_AUTH,
        payload: auth
    });
}

/**
 * 设置用户列表
 */
export const setUsersAll = (users: string[]) => (dispatch: any) => {
    return dispatch({
        type: globalType.SET_USERS_ALL,
        payload: users
    })
}

/**
 * 设置用户列表
 */
export const setCountryAll = (country: string[]) => (dispatch: any) => {
    return dispatch({
        type: globalType.SET_COUNTRY_ALL,
        payload: country
    })
}

/**
 * 设置商品分类
 */
 export const setProductCategory = (category: any) => (dispatch: any) => {
    return dispatch({
        type: globalType.SET_PRODUCT_CATEGORY,
        payload: category
    })
}

// /**
//  * 设置语言
//  */
//  export const setGlobalLang = (lang: string) => (dispatch: any) => dispatch({
//     type: globalType.SET_GLOBAL_LANG,
//     payload: lang
// });

// /**
//  * 设置语言
//  */
// export const setGlobalLang = (lang: string) => (dispatch: any) => dispatch({
//     type: globalType.SET_GLOBAL_LANG,
//     payload: lang
// });

/**
 * 设置当前选中的菜单
 */
// export const setMenuSelectedKeys = (keys: Key[]) => (dispatch: any) => {
//     localStorage.setItem(globalType.SET_MENU_SELECTED_KEYS, JSON.stringify(keys));
//     return dispatch({
//         type: globalType.SET_MENU_SELECTED_KEYS,
//         payload: keys
//     });
// }

// /**
//  * 设置当前展开的菜单
//  */
// export const setMenuOpenKeys = (keys: Key[]) => (dispatch: any) => {
//     localStorage.setItem(globalType.SET_MENU_OPEN_KEYS, JSON.stringify(keys));
//     return dispatch({
//         type: globalType.SET_MENU_OPEN_KEYS,
//         payload: keys
//     });
// }

// /**
//  * 设置布局收起状态
//  */
// export const setLayoutCollapsed = (collapsed: boolean) => (dispatch: any) => {
//     localStorage.setItem(globalType.SET_LAYOUT_COLLAPSED, JSON.stringify(collapsed));
//     return dispatch({
//         type: globalType.SET_LAYOUT_COLLAPSED,
//         payload: collapsed
//     });
// }