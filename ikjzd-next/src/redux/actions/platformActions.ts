import { platformActionType } from "@/redux/type/actionType";
import { PlatformStatus } from "@/vo/Platform";
import { Dispatch } from "redux";

/**
 * 设置平台状态
 */
export const setPlatformStatus = (status: PlatformStatus[]) => (dispatch: Dispatch<PlatformStatus[]>) => dispatch({
    type: platformActionType.SET_PLATFORM_STATUS,
    payload: status,
})