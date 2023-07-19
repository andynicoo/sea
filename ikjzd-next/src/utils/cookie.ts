import { isString } from "lodash";
import cookiejs from "cookie_js";
import { NextPageContext } from "next";
import moment from "moment";

type TokenResult = string;

type TokenArgs = string | NextPageContext;

type TokenResultSet = { [key: string]: string };

const TOKEN_KEY = process.env.TOKEN_KEY as string;
const EXPIRES_KEY = process.env.EXPIRES_KEY as string;
export default class Cookie {
    /**
     * 解析cookie
     */
    public static fmtCookie(cookie: string): TokenResultSet {
        const obj: TokenResultSet = {};
        cookie = cookie.replace(/\s/g, "");
        cookie.split(";").forEach((str) => {
            const [key, value] = str.split("=");
            obj[key] = value;
        });
        return obj;
    }

    /**
     * 从上下文中或cookie字符串中获取token
     */
    public static getToken(arg: string): TokenResult;
    public static getToken(arg: NextPageContext): TokenResult;
    public static getToken(arg: TokenArgs): TokenResult {
        let cookie;
        /**客户端 */
        if (process.browser) return cookiejs.get(TOKEN_KEY)
        /**服务端 */
    
    
        if (isString(arg)) cookie = arg;
        else cookie = arg?.req?.headers.cookie;
        if (!cookie) return "";
        const cookies = Cookie.fmtCookie(cookie);
        if(cookies[EXPIRES_KEY]){
            let time = Number(cookies[EXPIRES_KEY]) - moment(moment()).valueOf()
            if(time < 10000 ) return ""
        }
        
        return cookies[TOKEN_KEY];
    }
}