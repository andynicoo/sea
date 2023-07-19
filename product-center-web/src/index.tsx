import React from "react";
import ReactDOM from "react-dom";
import Router from "@/router"
import "@/index.scss";
import Store from "@/store";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as BusProvider } from "react-bus"
import { delPageCache } from "./utils/commonUtils";
import { loginToken } from "./api/public";
const APP_ENV = process.env.APP_ENV;
const NODE_ENV = process.env.NODE_ENV;
const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY as string;
console.log(`
    APP_ENV: ${APP_ENV}
    NODE_ENV: ${NODE_ENV}
`);

//刷新清除分页缓存
delPageCache()

const loaded = document.getElementById("loader-wrapper");
loaded?.parentNode?.removeChild(loaded);

function render(props: any) {
    const { container } = props;
    ReactDOM.render(<ReduxProvider store={Store}>
        <BusProvider>
            <Router />
        </BusProvider>
    </ReduxProvider>, container ? container.querySelector('#root') : document.getElementById("root"));
}
//@ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
    loginToken().then(res => {
        localStorage.setItem(process.env.REACT_APP_TOKEN_KEY as string, res.data.access_token as string);
    })
    render({});
}
export async function bootstrap() {
    console.log('[react16] react app bootstraped');
}

export async function mount(props: any) {
    console.log('[react16] props from main framework', props);
    localStorage.setItem(TOKEN_KEY, props.token as string);
    render(props);
}

export async function unmount(props: any) {
    console.log('unmount')
    const { container } = props;
    ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.getElementById("root"));
}