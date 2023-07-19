import { globalType } from "@/store/actions/actionsType"

export interface GlobalReducerProps {
    buttonAuth: any;
    usersAll: any;
    countryAll: any;
    productCategory: any
}

const initialState: any = {
    buttonAuth: [],
    usersAll: [],
    countryAll: [],
    productCategory: []
};


const globalReducer = (state: GlobalReducerProps = initialState, action: any) => {
    const { type, payload } = action;
    switch (type) {
        case globalType.SET_BUTTON_AUTH:
            return {
                ...state,
                buttonAuth: payload
            }
        case globalType.SET_USERS_ALL:
            return {
                ...state,
                usersAll: payload
            }
        case globalType.SET_COUNTRY_ALL:
            return {
                ...state,
                countryAll: payload
            }
        case globalType.SET_PRODUCT_CATEGORY:
            return {
                ...state,
                productCategory: payload
            }    
        default:
            return state;
    }
}

export default globalReducer;