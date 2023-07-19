import { mainActionType } from "@/redux/type/actionType";
import { Menu } from "@/vo/Basic";


export interface State {
    menus?: Menu[];
}

export const initialState: State = {
};

/**
 * 主体全局状态
 */
const userReducer = (state: State = initialState, action: any): State => {
    const { type, payload } = action;
    switch (type) {
        case mainActionType.SET_MENU_INFO:
            return {
                ...state,
                menus: payload
            };
        default:
            return state;
    }
}

export default userReducer;