import { domainActionType } from "@/redux/type/actionType";
import { IndustrialBelt } from "@/vo/Domain";

export interface State {
    categorys?: IndustrialBelt[];
}

export const initialState: State = {
};

/**
 * 产业带全局状态
 */
const domainReducer = (state: State = initialState, action: any): State => {
    const { type, payload } = action;
    switch (type) {
        case domainActionType.SET_DOMAIN_CATEGORYS:
            return {
                ...state,
                categorys: payload
            };
        default:
            return state;
    }
}

export default domainReducer;