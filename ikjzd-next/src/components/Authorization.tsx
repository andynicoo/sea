import { Button, ConfigProvider, Form, FormInstance, Input, message, Modal as AntdModal, Tabs } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import zhCN from "antd/lib/locale/zh_CN";
import { Provider as ReduxProvider, useDispatch, useSelector } from "react-redux";
import AuthParams, { AuthResponse } from "@/vo/Auth";
import { createQrcode, getQrcode, getUserInfo, oauthToken, qrcodeRegbind, sendSms } from "@/apis/auth";
import initAwsc from "@/utils/awsc";
import { AxiosResponse } from "axios";
import Cookie from "cookie_js";
import { setUserInfo } from "@/redux/actions/userActions";
import { MainReduxState } from "@/redux/store";
import { SyncOutlined } from '@ant-design/icons';
import createEmotion from "@emotion/css/create-instance";
import { ResetPhone } from "@/pages/users/setting";
import moment from "moment";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-authorization` });

interface AuthorizationProps {
    element?: HTMLElement;
    onSuccess?: (data: AuthResponse, destroy: () => void) => void;
    onError?: (error: ErrorResult, destroy: () => void) => void;
    closable?: boolean;
}

export interface ErrorResult {
    response: AxiosResponse
}

const AuthorizationModal: React.FC<AuthorizationProps> = ({ element, onSuccess, onError, closable }) => {
    const [visible, setVisible] = useState<boolean>(true);

    const destroy = () => {
        setVisible(false);
        if (!element) return;
        setTimeout(() => document.body.removeChild(element), 1000);
    }

    const handlerSuccess = (data: AuthResponse) => {
        onSuccess && onSuccess(data, destroy);
    }

    const handlerError = (error: ErrorResult) => {
        onError && onError(error, destroy);
    }

    return <AntdModal
        destroyOnClose
        visible={visible}
        onCancel={destroy}
        footer={false}
        width={428}
        getContainer={element}
        closable={!!closable}
        keyboard={!!closable}
        maskClosable={!!closable}
    >
        <AuthorizationContent
            onSuccess={handlerSuccess}
            onError={handlerError}
        />
    </AntdModal>
}

interface AuthorizationContentProps {
    onSuccess?: (data: AuthResponse) => void;
    onError?: (error: ErrorResult) => void;
}

/**登录组件主体 */
const AuthorizationContent: React.FC<AuthorizationContentProps> = ({ onSuccess, onError }) => {

    const [hasWetchLogin, setHasWetchLogin] = useState<boolean>(false);
    // const onSwitchType = () => setHasWetchLogin(!hasWetchLogin);
    const wxstate = (len: number) => {
        len = len || 32
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        var maxPos = $chars.length
        var pwd = ''
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
        }
        sessionStorage.wxpwd = pwd
        return pwd
    }
    const onSwitchType = () => {
        setHasWetchLogin(!hasWetchLogin);
        window.open(`https://open.weixin.qq.com/connect/qrconnect?appid=wx8943a81b12070712&redirect_uri=${encodeURIComponent('https://ikjzd.com/back')}&response_type=code&scope=snsapi_login&state=${wxstate(29)}#wechat_redirect`)
    };

    const btnCls = css`
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #bbb;
    `;

    const iconCls = css`
        width: 40px;
        height: 40px;
        background-position: center;
        background-size: cover;
        cursor: pointer;
        margin-bottom: 10px;

        &[data-type="phone"] {
            background-image: url(/asset/image/icon/ps-log.png);

            &:hover {
                background-image: url(/asset/image/icon/ps-hover-log.png);
            }
        }

        &[data-type="wetch"] {
            background-image: url(/asset/image/icon/wv-wechat.png);

            &:hover {
                background-image: url(/asset/image/icon/wv-hover-wechat.png);
            }
        }
    `;

    const validCodeClassns = css`
        .${process.env.CLASS_PREFIX}-form-item {
            width: calc(100% - 130px);
        }

        .${process.env.CLASS_PREFIX}-btn {
            width: 130px;
        }
    `;

    const actionsClassns = css`

        .${process.env.CLASS_PREFIX}-form-item-control-input-content {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;

            &>a {
                &:nth-child(1) {
                    color: #818792;
                }

                &:nth-child(2) {
                    color: #6493ED;
                }
            }
        }
    `;

    /**手机号码登录按钮 */
    const PhoneBtn: React.FC = () => {


        return <div className={btnCls}>
            <div
                className={iconCls}
                data-type="phone"
                onClick={onSwitchType}
            />
            <p>手机号码登录</p>
        </div>
    }

    /**微信登录按钮 */
    const WetchBtn: React.FC = () => {

        return <div className={btnCls}>
            <div
                className={iconCls}
                data-type="wetch"
                onClick={onSwitchType}
            />
            <p>微信登录</p>
        </div>
    }

    /**账号密码、短信验证码登录 */
    const AuthorizationTabs: React.FC = () => {


        /**账号密码登录 */
        const AuthorizationByPwd: React.FC = () => {

            const [loading, setLoading] = useState<boolean>(false);

            /**登录提交 */
            const onFinish = (values: AuthParams) => {
                setLoading(true);
                oauthToken(values)
                    .then((res) => {
                        onSuccess && onSuccess(res);
                    })
                    .catch((error) => {
                        onError && onError(error);
                        setLoading(false);
                    })
            }

            return <Form<AuthParams>
                onFinish={onFinish}
                initialValues={{
                    grant_type: "password",
                    client_secret: process.env.CLIENT_SECRET,
                    client_id: process.env.CLIENT_ID,
                }}
            >
                <Form.Item hidden name="grant_type">
                    <Input />
                </Form.Item>
                <Form.Item hidden name="client_secret">
                    <Input />
                </Form.Item>
                <Form.Item hidden name="client_id">
                    <Input />
                </Form.Item>
                <Form.Item
                    name={"username"}
                    rules={[{ required: true, message: "请输入账号" }]}
                >
                    <Input size={"large"} placeholder={"手机号"} />
                </Form.Item>
                <Form.Item
                    name={"password"}
                    rules={[{ required: true, message: "请输入密码" }]}
                >
                    <Input.Password placeholder="密码" size={"large"} />
                </Form.Item>
                <Form.Item noStyle>
                    <Button
                        htmlType="submit"
                        type={"primary"}
                        block
                        size="large"
                        loading={loading}
                    >
                        登录
                    </Button>
                </Form.Item>
                <Form.Item className={cx(actionsClassns, "fs-[12px]")}>
                    <a target={"_blank"} href={"/resetpwd"}>忘记密码?</a>
                    <a target={"_blank"} href={"/register"}>账号注册</a>
                </Form.Item>
            </Form>
        }

        /**验证码登录 */
        const AuthorizationBySms: React.FC = () => {

            const [loading, setLoading] = useState<boolean>(false);

            const defaultTime = 60;

            const [form] = Form.useForm<AuthParams>();
            const [codeTime, setCodeTime] = useState<number>(defaultTime);
            const [codeRun, setCodeRun] = useState<boolean>(false);

            let nvc = useRef<any>();

            useEffect(() => {
                initAwsc().then((_nvc_: any) => {
                    nvc.current = _nvc_;
                });
            }, []);

            const rumTime = () => {
                setCodeRun(true);
                const interval = setInterval(() => {
                    setCodeTime((codeTime) => {
                        let nextTime = codeTime - 1;
                        if (nextTime < 0) {
                            setCodeRun(false);
                            clearInterval(interval);
                            nextTime = defaultTime;
                        }
                        return nextTime;
                    });
                }, 1000);
            }

            const onSendSms = () => {
                form.validateFields(["username"]).then((data) => {
                    /**人机验证 */
                    nvc.current.getNVCValAsync(function (nvcVal: any) {
                        sendSms({
                            data: decodeURIComponent(nvcVal),
                            mobile: data.username,
                            type: 1,
                            prefixCode: "86"
                        }).then(() => {
                            message.success("验证码发送成功");
                            rumTime();
                        }).catch((error) => {
                            message.error(error.response.data.message);
                        })
                    });
                })
            }

            const onFinish = (value: AuthParams) => {
                setLoading(true);
                oauthToken(value)
                    .then((res) => {
                        onSuccess && onSuccess(res);
                    })
                    .catch((error) => {
                        onError && onError(error);
                        setLoading(false);
                    })
            }

            const GetSmsCodeBtn: React.FC = () => {
                if (codeRun) return (
                    <Button size={"large"}>
                        重新获取 {codeTime}
                    </Button>
                )
                return (
                    <Button
                        onClick={onSendSms}
                        type={"primary"}
                        size={"large"}
                    >
                        获取验证码
                    </Button>
                )
            }

            return <Form<AuthParams>
                form={form}
                onFinish={onFinish}
                initialValues={{
                    grant_type: "password",
                    client_secret: process.env.CLIENT_SECRET,
                    client_id: process.env.CLIENT_ID,
                    ati: 6499920776673,
                    authType: "smsVerifyCode",
                    scope: "all"
                }}
            >
                <Form.Item hidden name="grant_type">
                    <Input />
                </Form.Item>
                <Form.Item hidden name="client_secret">
                    <Input />
                </Form.Item>
                <Form.Item hidden name="client_id">
                    <Input />
                </Form.Item>
                <Form.Item hidden name="ati">
                    <Input />
                </Form.Item>
                <Form.Item hidden name="authType">
                    <Input />
                </Form.Item>
                <Form.Item hidden name="scope">
                    <Input />
                </Form.Item>
                <Form.Item
                    name={"username"}
                    rules={[
                        { required: true, message: "请输入手机号" },
                        { pattern: /^\d{11}$/, message: "请输入正确的手机号码", validateTrigger: "blue" }
                    ]}
                >
                    <Input size={"large"} placeholder={"手机号"} />
                </Form.Item>
                <Form.Item noStyle>
                    <Input.Group
                        size="large"
                        compact
                        className={validCodeClassns}
                    >
                        <Form.Item
                            name={"smsVerifyCode"}
                            rules={[{ required: true, message: "请输入验证码" }]}
                        >
                            <Input

                                placeholder={"请输入验证码"}
                                size={"large"}
                            />
                        </Form.Item>
                        <GetSmsCodeBtn />
                    </Input.Group>
                </Form.Item>
                <Form.Item noStyle>
                    <Button
                        size="large"
                        type={"primary"}
                        block
                        htmlType="submit"
                        loading={loading}
                    >
                        登录
                    </Button>
                </Form.Item>
                <Form.Item className={cx(actionsClassns, "fs-[12px]")}>
                    <a target={"_blank"} href={"/resetpwd"}>忘记密码?</a>
                    <a target={"_blank"} href={"/register"}>账号注册</a>
                </Form.Item>
            </Form>
        }

        const tabsClassns = css`
            .${process.env.CLASS_PREFIX}-tabs-nav-wrap {
                display: flex;
                justify-content: center;
            }
        `;

        return <Tabs
            destroyInactiveTabPane
            className={tabsClassns}
        >
            <Tabs.TabPane tab={"账号密码登录"} key={"pwd"}>
                <AuthorizationByPwd />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"验证码登录"} key={"sms"}>
                <AuthorizationBySms />
            </Tabs.TabPane>
        </Tabs>
    }

    /**微信扫码登录 */
    let time: any

    const AuthorizationByQrCode: React.FC = () => {
        const [phoneVisible, setPhoneVisible] = useState<boolean>(false);
        const [phoneLoading, setPhoneLoading] = useState<boolean>(false);
        const [ticketCode, setTicketCode] = useState<string>('')
        const phoneRef = React.createRef<FormInstance>();

        const getStatus = () => {
            time = setInterval(() => {
                getQrcode({ state: sessionStorage.wxpwd }).then(res => {
                    if (res.data.loginTokenVo) {
                        clearInterval(time)
                        onSuccess && onSuccess({ ...res.data.loginTokenVo });
                    } else if (res.data.status == 4) {
                        // setIsoverdue(true)
                    } else if (res.data.status == 3) {
                        setPhoneVisible(true)
                        clearInterval(time)
                    }
                })
            }, 2000);
            return () => {
                clearInterval(time)
            }
        }
        /**绑定电话提交 */
        const submitSetPhone = () => {
            phoneRef.current?.validateFields().then((value) => {
                setPhoneLoading(true);
                let params = {
                    "mobile": value.mobile,
                    "mobileCode": value.mobileCode,
                    "scene": 4,
                    "state": sessionStorage.wxpwd
                }
                qrcodeRegbind(params)
                    .then((res) => {
                        message.success("绑定成功");
                        setPhoneVisible(false);
                        onSuccess && onSuccess({ ...res.data.loginTokenVo });
                    }).catch((error) => {
                        message.error(error.response.data.message);
                    })
                    .finally(() => {
                        setPhoneLoading(false);
                    })
            })
        }

        useEffect(getStatus, []);

        return (
            <Fragment>
                <AntdModal
                    visible={phoneVisible}
                    title={"绑定手机"}
                    onCancel={() => setPhoneVisible(false)}
                    destroyOnClose
                    onOk={submitSetPhone}
                    confirmLoading={phoneLoading}
                >
                    <ResetPhone ref={phoneRef} type={4} />
                </AntdModal>
            </Fragment>
        )
    }

    const logoCls = css`
        width: 140px;
        margin: 30px auto 20px;
        display: block;
    `;

    return <Fragment>
        <img
            className={logoCls}
            src="/asset/image/logo.png"
        />
        {/* {
            hasWetchLogin
                ? <AuthorizationByQrCode /> */}
        <AuthorizationTabs />

        {/* {
            hasWetchLogin
                ? <PhoneBtn />: */}
        <WetchBtn />
        {hasWetchLogin ? <AuthorizationByQrCode /> : ""}
    </Fragment>
}

/**弹窗 */
interface ModalProps {
    onSuccess?: (data: AuthResponse, destroy: () => void) => void;
    onError?: (error: ErrorResult, destroy: () => void) => void;
    closable?: boolean;
}

interface ModalResult {
    element: HTMLElement
}

/**弹出框 */
const modal = (props?: ModalProps): ModalResult => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    ReactDOM.render(
        <ConfigProvider prefixCls={process.env.CLASS_PREFIX} locale={zhCN}>
            <ReduxProvider store={window.__NEXT_REDUX_STORE__}>
                <AuthorizationModal
                    onSuccess={props?.onSuccess}
                    onError={props?.onError}
                    element={element}
                    closable={props?.closable}
                />
            </ReduxProvider>
        </ConfigProvider>,
        element
    );

    return {
        element
    };
}

/**获取用户信息, 设置本地存储 */
const local = (data: AuthResponse, handle?: () => void) => {
    Cookie.set(process.env.TOKEN_KEY, data.access_token, { path: "/", expires: 7 });
    Cookie.set(process.env.EXPIRES_KEY, moment(moment().add(7, 'days')).valueOf().toString(), { path: "/", expires: 7 });
    getUserInfo().then((res) => {
        const redux = window.__NEXT_REDUX_STORE__;
        setUserInfo(res.data)(redux.dispatch);
        handle && handle();
    });
}

/**验证登录(未登录则先弹出登录模态框,登录成功后后自动调用一级子组件的点击事件,已经登录则直接调用一级子组件的点击事件) */
const Valid: React.FC = (props) => {

    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    const children = React.Children.map(props.children, (child) => {
        const childElement = child as React.FunctionComponentElement<any>;

        const onClick = (...args: any[]) => {
            const propsClick = childElement.props.onClick;
            if (userInfo) {
                /**如果已经登录,则直接调用字组件方法 */
                propsClick && propsClick(args);
            } else {
                /**如果没有登录过,则先登录再调用字组件方法 */
                Authorization.modal({
                    closable: true,
                    onSuccess: (data, destroy) => {
                        message.success("登录成功");
                        Authorization.local(data, destroy);
                        propsClick && propsClick(args);
                    },
                    onError(error, destroy) {
                        message.error(error.response.data.message);
                    },
                })
            }
        }

        return React.cloneElement(childElement, {
            ...childElement.props,
            onClick
        });
    });

    return <Fragment>{children}</Fragment>;
}

/**强制登录 */
const Confirm: React.FC = ({ children }) => {

    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    useEffect(() => {
        if (!userInfo) {
            Authorization.modal({
                onSuccess(data, destroy) {
                    message.success("登录成功");
                    Authorization.local(data, destroy);
                },
                onError(error, destroy) {
                    message.error(error.response.data.message)
                },
            });
        }
    }, [userInfo]);

    return (
        <Fragment>{children}</Fragment>
    )
}

type authorizationType = React.FC<AuthorizationContentProps> & {
    modal: (props?: ModalProps) => ({ element: HTMLElement });
    local: (data: AuthResponse, handle?: () => void) => void;
    Valid: React.FC;
    Confirm: React.FC;
}

const Authorization = AuthorizationContent as authorizationType;
Authorization.modal = modal;
Authorization.local = local;
Authorization.Valid = Valid;
Authorization.Confirm = Confirm;

export default Authorization;


