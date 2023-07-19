import NextApp, { AppContext } from "next/app";
import { NextPageContext } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import React, { Fragment } from "react";
import { Store } from "redux";
import { Provider } from "react-redux";
import Router from "next/router";
import NoSSR from 'react-no-ssr';

/** ant design start */
import { ConfigProvider, message } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import "antd/dist/antd.less";
import moment from "moment";
moment.locale("zh-cn");
message.config({ maxCount: 1 });
ConfigProvider.config({ prefixCls: process.env.CLASS_PREFIX });
/** ant design end */

/** nprogress start */
import NProgress from "nprogress";
import "nprogress/nprogress.css";
Router.events.on("routeChangeStart", (url: string) => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});
/** nprogress end */

import { MainReduxState } from "@/redux/store";
import SeoHead from "@/components/SeoHead";
import { setUserInfo } from "@/redux/actions/userActions";
import { getUserInfo } from "@/apis/auth";
import Cookie from "@/utils/cookie";
import { getMenu } from "@/apis/home";
import { setMenuInfo } from "@/redux/actions/mainActions";
import WithReduxStore from "@/redux/lib/WithReduxStore";

/**样式 start */
import "reset-css";
import "@/styles/rewrite.less";
import "@/styles/global.less";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
/**样式 end */

import "@/utils/sensors.js";

/**右侧固定热键 */
const FixedHotkey = dynamic(() => import("@/components/FixedHotkey"), {
  ssr: false,
});

class App extends NextApp<any> {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Fragment>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <script
            dangerouslySetInnerHTML={{
              __html: `var _hmt = _hmt || [];
                    (function() {
                      var hm = document.createElement("script");
                      hm.src = "https://hm.baidu.com/hm.js?71fdc4a0262617cc5d8eea65dedacf85";
                      var s = document.getElementsByTagName("script")[0]; 
                      s.parentNode.insertBefore(hm, s);
                    })();`,
            }}
          />
          <NoSSR>
            {/* <script src="/libs/sensors.js" defer></script> */}
          </NoSSR>
        </Head>
        <SeoHead />
        <ConfigProvider prefixCls={process.env.CLASS_PREFIX} locale={zhCN}>
          <Provider store={reduxStore}>
            {/* @ts-ignore */}
            <FixedHotkey />
            <Component {...pageProps} />
          </Provider>
        </ConfigProvider>
      </Fragment>
    );
  }
}

export interface CustomNextPageContext extends NextPageContext {
  reduxStore: Store<MainReduxState>;
}

export type CustomAppContext = AppContext & {
  ctx: CustomNextPageContext;
};

/**@ts-ignore */
App.getInitialProps = async (appContext: CustomAppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  const state = appContext.ctx.reduxStore.getState();
  /**服务端环境初始化用户信息、菜单信息 */
  if (!process.browser) {
    /**应用初始化加载用户信息 */
    if (!state.userReducer.info) {
      try {
        const token = Cookie.getToken(appContext.ctx);
        if (token) {
          const res = await getUserInfo(token as string);
          setUserInfo(res.data)(appContext.ctx.reduxStore.dispatch);
        }
      } catch (error) {}
    }

    /**应用初始化加载菜单信息 */
    if (!state.mainReducer.menus) {
      const menus = (await getMenu()).data;
      setMenuInfo(menus)(appContext.ctx.reduxStore.dispatch);
    }
  }

  return { ...appProps };
};

export default WithReduxStore(App);
