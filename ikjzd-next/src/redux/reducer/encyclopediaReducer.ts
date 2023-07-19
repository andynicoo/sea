import { encyclopediaActionType } from "@/redux/type/actionType";
import { EncyclopediaCategory } from "@/vo/Encyclopedia";

export interface State {
    encyclopediaCategorys?: EncyclopediaCategory[];
}

export const initialState: State = {
};

/**
 * 跨境百科全局状态
 */
const encyclopediaReducer = (state: State = initialState, action: any): State => {
    const { type, payload } = action;
    switch (type) {
        case encyclopediaActionType.SET_KJBK_CATEGORYS:
            return {
                ...state,
                encyclopediaCategorys: payload
            };
        default:
            return state;
    }
}

export default encyclopediaReducer;