declare namespace NodeJS {
    interface ProcessEnv {
        /**
         * 运行端口
         */
        readonly PORT: string;
        /**
         * 后台请求路径(客户端)
         */
        readonly CLIENT_API_URL: string;
        /**
         * 后台请求路径(服务端)
         */
        readonly SERVER_API_URL: string;
        /**
         * 认证token缓存key
         */
        readonly TOKEN_KEY: string;
        readonly EXPIRES_KEY: string;
        /**
         * 原来的页面
         */
        readonly ORIGINAL_PAGE: string;
        /**
         * 应用运行环境
         */
        readonly APP_ENV: "dev" | "prod" | "test";
        /**
         * ant design 自定义类名前缀
         */
        readonly CLASS_PREFIX: string;
        /**
         * 主题色
         */
        readonly PRIMARY_COLOR: string;
        /**
         * 链接颜色
         */
        readonly LINK_COLORl: string;
        /**
         * 背景色
         */
        readonly BACKGROUND_COLOR: string;
        /**
         * 主体宽度
         */
        readonly CONTAINER_WIDTH: string;
        /**
         * oauth2认证密钥
         */
        readonly CLIENT_SECRET: string;
        /**
         * oauth2认证客户端id
         */
        readonly CLIENT_ID: string;
    }
}

/**全局变量 */
interface Window {
    /**
     * 客户端redux全局存储
     */
    __NEXT_REDUX_STORE__: Store<MainReduxState>;
    /**
     * 人机验证相关
     */
    readonly AWSC: any;
}

declare module "braft-utils";
declare module "braft-finder";