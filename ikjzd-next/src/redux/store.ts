import { createStore, applyMiddleware, combineReducers, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";

import mainReducer, { State as MainState, initialState as mainInitialState } from "@/redux/reducer/mainReducer";
import userReducer, { State as UserState, initialState as userInitialState } from "@/redux/reducer/userReducer";
import encyclopediaReducer, { State as EncyclopediaState, initialState as encyclopediaInitialState } from "@/redux/reducer/encyclopediaReducer";
import domainReducer, { State as DomainState, initialState as domainInitialState } from "@/redux/reducer/domainReducer";
import platformReducer, { State as PlatformState, initialState as platformInitialState } from "@/redux/reducer/platformReducer";

export interface MainReduxState {
    mainReducer: MainState;
    userReducer: UserState;
    encyclopediaReducer: EncyclopediaState;
    domainReducer: DomainState;
    platformReducer: PlatformState;
}

const defaultState: MainReduxState = {
    mainReducer: mainInitialState,
    userReducer: userInitialState,
    encyclopediaReducer: encyclopediaInitialState,
    domainReducer: domainInitialState,
    platformReducer: platformInitialState,
}

export function initializeStore(initialState: MainReduxState = defaultState): Store<MainReduxState> {
    return createStore(combineReducers({
        mainReducer,
        userReducer,
        encyclopediaReducer,
        domainReducer,
        platformReducer,
    }), initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}