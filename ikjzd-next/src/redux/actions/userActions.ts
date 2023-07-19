import { userActionType } from "@/redux/type/actionType";
import { UserInfoResponseData } from "@/vo/Auth";
import { Dispatch } from "redux";

/**
 * 设置用户信息
 */
export const setUserInfo = (user?: UserInfoResponseData) => (dispatch: Dispatch<UserInfoResponseData>) => dispatch({
    type: userActionType.SET_USER_INFO,
    payload: user,
})