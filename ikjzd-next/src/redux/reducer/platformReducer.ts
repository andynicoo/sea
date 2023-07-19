import { platformActionType } from "@/redux/type/actionType";
import { PlatformStatus } from "@/vo/Platform";

export interface State {
    status?: PlatformStatus[];
}

export const initialState: State = {
};

/**
 * 平台带全局状态
 */
const platformReducer = (state: State = initialState, action: any): State => {
    const { type, payload } = action;
    switch (type) {
        case platformActionType.SET_PLATFORM_STATUS:
            return {
                ...state,
                status: payload
            };
        default:
            return state;
    }
}

export default platformReducer;