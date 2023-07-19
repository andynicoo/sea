import { combineReducers } from "redux";

import globalReducer, { GlobalReducerProps } from "@/store/reducers/globalReducer";

export interface MainState {
    global: GlobalReducerProps
}

export default combineReducers<MainState>({
    global: globalReducer
});