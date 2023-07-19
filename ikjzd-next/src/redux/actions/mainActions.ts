import { mainActionType } from "@/redux/type/actionType";
import { Menu } from "@/vo/Basic";
import { Dispatch } from "redux";

/**
 * 设置菜单信息
 */
export const setMenuInfo = (user?: Menu[]) => (dispatch: Dispatch<Menu[]>) => dispatch({
    type: mainActionType.SET_MENU_INFO,
    payload: user,
})