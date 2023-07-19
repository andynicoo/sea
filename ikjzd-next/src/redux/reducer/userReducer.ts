import { userActionType } from "@/redux/type/actionType";
import { UserInfo } from "@/vo/Users";

export interface State {
    info?: UserInfo;
}

export const initialState: State = {
};

/**
 * 用户全局状态
 */
const userReducer = (state: State = initialState, action: any): State => {
    const { type, payload } = action;
    switch (type) {
        case userActionType.SET_USER_INFO:
            return {
                ...state,
                info: payload
            };
        default:
            return state;
    }
}

export default userReducer;