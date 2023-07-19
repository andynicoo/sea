import Axios, { Response } from "@/apis";
import AuthParams, { AuthResponse, OperateLetterProps, QrcodeRegbindProps, RegisterParams, ResetPwdParams, SmsParams, UserInfoResponseData } from "@/vo/Auth";
import { UserInfo } from "@/vo/Users";
import { Key } from "react";

/**oauth2认证 */
export const oauthToken = (params: AuthParams): Promise<AuthResponse> => Axios.post("/oauth/token", null, { params });

/**获取用户信息 */
export const getUserInfo = (token?: string): Promise<Response<UserInfoResponseData>> => Axios.post(
    "/kjzdUser/kjzdUsers/getUserInfo",
    {},
    token ? { headers: { authorization: token && `Bearer ${token}` } } : {}
);

/**发送验证码 */
export const sendSms = (params: SmsParams): Promise<Response> => Axios.post("/oauth/kjzd/sendSms", params);

/**注册 */
export const oauthRegister = (params: RegisterParams): Promise<Response> => Axios.post("/oauth/kjzd/register", params);

/**重置密码 */
export const resetPassword = (params: ResetPwdParams): Promise<Response> => Axios.post("/kjzdUser/kjzdIgnore/findPwd", params);

/**微信登入获取二维码 */
export const createQrcode = (): Promise<Response> => Axios.post("/kjzdUser/wx/gzh/create/qrcode");

/**微信登入获取二维码扫码结果 */
export const getQrcode = (params: { state: string }): Promise<Response> => Axios.post("/kjzdUser/wx/gzh/get/qrcode", params);

/**微信登入获取二维码扫码结果 */
export const qrcodeRegbind = (params: QrcodeRegbindProps): Promise<Response> => Axios.post("/kjzdUser/wx/gzh/qrcode/regbind", params);

/**给作者发私信 */
export const operateLetter = (params: OperateLetterProps): Promise<Response<any>> => Axios.post(
    "/console/user/operate/letter", params
);
