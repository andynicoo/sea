import { domainActionType } from "@/redux/type/actionType";
import { IndustrialBelt } from "@/vo/Domain";
import { Dispatch } from "redux";

/**
 * 设置产业带分类
 */
export const setDomainCategorys = (categorys: IndustrialBelt[]) => (dispatch: Dispatch<IndustrialBelt[]>) => dispatch({
    type: domainActionType.SET_DOMAIN_CATEGORYS,
    payload: categorys,
})