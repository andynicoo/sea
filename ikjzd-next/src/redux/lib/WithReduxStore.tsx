import React from "react";
import { initializeStore, MainReduxState } from "@/redux/store";
import { CustomAppContext } from "@/pages/_app";
import { Store } from "redux";

const isServer = typeof window === "undefined";


export function getOrCreateStore(initialState?: MainReduxState): Store<MainReduxState> {
    if (isServer) return initializeStore(initialState);
    if (!window.__NEXT_REDUX_STORE__) {
        window.__NEXT_REDUX_STORE__ = initializeStore(initialState);
    }
    return window.__NEXT_REDUX_STORE__;
}

const withReduxStore = (App: any) => {
    return class AppWithRedux extends React.Component {
        reduxStore?: Store<MainReduxState>;
        token?: string;
        static async getInitialProps(appContext: CustomAppContext) {
            const reduxStore = getOrCreateStore();
            appContext.ctx.reduxStore = reduxStore;

            let appProps: any;
            /**注入 redux */
            if (typeof App.getInitialProps === "function") {
                appProps = await App.getInitialProps(appContext)
            }

            return {
                ...appProps,
                initialReduxState: reduxStore.getState(),
            }
        }

        constructor(props: any) {
            super(props);
            this.reduxStore = getOrCreateStore(props.initialReduxState);
        }

        render() {
            return <App {...this.props} reduxStore={this.reduxStore} />
        }
    }
}

export default withReduxStore;