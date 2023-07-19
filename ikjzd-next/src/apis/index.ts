import { setUserInfo } from "@/redux/actions/userActions";
import { message } from "antd";
import Axios, { AxiosInstance } from "axios";
import cookie from "cookie_js";
import router from "next/router";
import { useDispatch } from "react-redux";

let baseUrl: string | undefined;

if (process.browser) {
  baseUrl = process.env.CLIENT_API_URL;
} else {
  baseUrl = process.env.SERVER_API_URL;
}

const request: AxiosInstance = Axios.create({
  baseURL: baseUrl,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

request.interceptors.request.use(
  (config) => {
    if (process.browser) {
      /**获取token */
      const token = cookie.get(process.env.TOKEN_KEY);
      if (Boolean(token)) {
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${token}`,
        };
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    response.status;
    if (process.browser) {
      if (response.request.responseURL.indexOf("useraction") > -1) {
        window.location.href = response.request.responseURL;
        // router.replace(response.request.responseURL);
      }
    } else {
      if (
        response.request.responseURL &&
        response.request.responseURL.indexOf("useraction") > -1
      ) {
        router.replace(response.request.responseURL);
      }
    }
    return Promise.resolve(response.data);
  },
  (error) => {
    if (!error.response) {
      const dispatch = useDispatch();
      message.error("登入信息失效,请重新登入!");
      cookie.set(process.env.TOKEN_KEY, "", { path: "/" });
      setUserInfo(undefined)(dispatch);
      router.push("/");
    }
    if (error.response.status === 500) {
      message.error("系统繁忙,请稍后重试!");
    }
    if (error.response.status === 400) {
      message.error(error.response?.data?.message);
    }

    return Promise.reject(error);
  }
);

export default request;

export interface Response<T = any> {
  code: string;
  message: string;
  data: T;
  timestamp: number;
}
