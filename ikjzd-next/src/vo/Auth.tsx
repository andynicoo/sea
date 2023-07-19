type grantType = "pwssword";
type authType = "smsVerifyCode";
type scopeType = "all";

/**登录参数 */
export default interface AuthParams {
    grant_type: grantType;
    client_secret: string;
    username: string;
    password?: string;
    client_id: string;
    ati: string;
    authType: authType;
    smsVerifyCode: string;
    scope: scopeType;
}

/**登录成功参数 */
export interface AuthResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
}

/**用户信息 */
export interface UserInfoResponseData {
    id: number;
    userId: string;
    mobile: string;
    password: string;
    nick: string;
    name: string;
    email: string;
    emailShow: boolean;
    company: string;
    wechat: string;
    wechatShow: boolean;
    wechatImg: string;
    sex: boolean;
    sign: string;
    individualResume: string;
    type: boolean;
    avatar: string;
    personalCenterBackground: string;
    level: number;
    integral: number;
    exponent: number;
    admire: number;
    fansNum: number;
    posts: number;
    articleNum: number;
    replyPosts: number;
    serviceNum: number;
    loginDay: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    bindMobile: string;
    isFans: boolean;
}

/**发送短信验证码参数 */
export interface SmsParams {
    data: string;
    mobile: string;
    type: number;
    prefixCode: string;
}

/**注册参数 */
export interface RegisterParams {
    /**区号 */
    prefixCode: string;
    /**手机 */
    mobile: string;
    /**手机验证码 */
    mobileCode: string;
    /**密码 */
    password: string;
}

/**重置密码参数 */
export interface ResetPwdParams {
    /**手机 */
    mobile: string;
    /**手机验证码 */
    mobileCode: string;
    /**密码 */
    password: string;
}

/**公众号二维码绑定用户中心 */
export interface QrcodeRegbindProps {
    mobile: string;
    mobileCode: string;
    scene: number;
    state: string;
}

/**发私信参数 */
export interface OperateLetterProps {
    sendUserId: string;
    receiveUserId: string;
    content: string;
}