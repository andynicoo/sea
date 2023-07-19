import { encyclopediaActionType } from "@/redux/type/actionType";
import { EncyclopediaCategory } from "@/vo/Encyclopedia";
import { Dispatch } from "redux";

/**
 * 设置跨境百科分类
 */
export const setEncyclopediaCategorys = (categorys: EncyclopediaCategory[]) => (dispatch: Dispatch<EncyclopediaCategory[]>) => dispatch({
    type: encyclopediaActionType.SET_KJBK_CATEGORYS,
    payload: categorys,
})