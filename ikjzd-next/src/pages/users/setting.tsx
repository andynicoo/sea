import DefaultLayout from "@/components/layouts/DefaultLayout";
import { NextPage } from "next";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Button, Tabs, Input, Form, Checkbox, Radio, Space, Card, FormInstance, message, Avatar, Modal, Row, Col } from "antd";
import MineLayout from "@/components/users/MineLayout";
import Upload from "@/components/Upload";
import { useDispatch, useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { UserInfo } from "@/vo/Users";
import { updateMobile, updatePassword, updateUserInfo } from "@/apis/users";
import { getUserInfo, sendSms } from "@/apis/auth";
import { setUserInfo } from "@/redux/actions/userActions";
import initAwsc from "@/utils/awsc";
interface UsersMinePageProps {

}

const UsersMine: NextPage<UsersMinePageProps> = () => {
    return (
        <DefaultLayout>
            <MineLayout>
                <Setting />
            </MineLayout>
        </DefaultLayout>
    );
};

export default UsersMine;


/**设置 */
const Setting: React.FC = () => {
    return (
        <Card bordered={false}>
            <Tabs size={'large'}>
                <Tabs.TabPane tab='个人资料' key="1">
                    <PersonalData />
                </Tabs.TabPane>
                <Tabs.TabPane tab='账户安全' key="4">
                    <AccountSecurity />
                </Tabs.TabPane>
            </Tabs>
        </Card>
    )
}

/**个人资料 */
const PersonalData: React.FC = () => {

    const [form] = Form.useForm<UserInfo>();

    const dispatch = useDispatch();

    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    const onFinish = (values: UserInfo) => {
        updateUserInfo(values).then(() => {
            message.success("修改成功");
            getUserInfo().then(({ data }) => {
                setUserInfo(data)(dispatch);
            })
        })
    };

    useEffect(() => {
        if (!userInfo) return;
        form?.setFieldsValue(userInfo);
    }, []);

    return (
        <Form
            form={form}
            onFinish={onFinish}
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 10 }}
        >
            <Form.Item
                label="头像"
                name="avatar"
                rules={[{ required: false }]}
            >
                <Upload listType={"picture-card"} />
            </Form.Item>
            <Form.Item
                label="昵称"
                name="nick"
                rules={[{ required: true, message: '请输入昵称' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="性别"
                name="sex"
                rules={[{ required: true }]}
            >
                <Radio.Group>
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="微信" style={{ marginBottom: 0 }}>
                <Space size={10}>
                    <Form.Item name="wechat">
                        <Input />
                    </Form.Item>
                    <Form.Item name="wechatShow" valuePropName="checked">
                        <Checkbox>公开</Checkbox>
                    </Form.Item>
                </Space>
            </Form.Item>

            <Form.Item
                label="电话"
                name="mobile"
                rules={[{ required: true, message: '请输入昵称' }]}
            >
                <Input readOnly />
            </Form.Item>

            <Form.Item label="邮箱" style={{ marginBottom: 0 }}>
                <Space size={10}>
                    <Form.Item name="email">
                        <Input />
                    </Form.Item>
                    <Form.Item name="emailShow" valuePropName="checked">
                        <Checkbox>公开</Checkbox>
                    </Form.Item>
                </Space>
            </Form.Item>

            <Form.Item
                label="简介"
                name="individualResume"
                rules={[{ required: true, message: '请输入您的简介,建议少于30字' }]}
            >
                <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>

            <Form.Item label="更多">
                <Space size={60}>
                    <Form.Item
                        name="personalCenterBackground"
                        rules={[{ required: false }]}
                        help={<HelpText help="主页自定义背景图" make="建议尺寸: 1920 * 240" />}
                    >
                        <Upload listType={"picture-card"} />
                    </Form.Item>
                    <Form.Item
                        name="wechatImg"
                        rules={[{ required: false }]}
                        help={<HelpText help="微信公众号二维码" make="建议尺寸: 120 * 120" />}
                    >
                        <Upload listType={"picture-card"} />
                    </Form.Item>
                </Space>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2, span: 10 }}>
                <Button type="primary" htmlType="submit">
                    保存并更新
                </Button>
            </Form.Item>
        </Form>
    )
}

const HelpText: React.FC<{ help: string; make: string }> = ({ help, make }) => {
    return <Fragment>
        <p style={{ marginBottom: 0 }}>{help}</p>
        <p style={{ marginBottom: 0 }}>{make}</p>
    </Fragment>
}

/**账户安全 */
const AccountSecurity: React.FC = () => {

    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    const mobile = userInfo?.mobile;
    const [pwdVisible, setPwdVisible] = useState<boolean>(false);
    const [pwdLoading, setPwdLoading] = useState<boolean>(false);
    const [phoneVisible, setPhoneVisible] = useState<boolean>(false);
    const [phoneLoading, setPhoneLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    const pwdRef = React.createRef<FormInstance>();
    const phoneRef = React.createRef<FormInstance>();

    const phone = mobile?.substring(0, 3) + "****" + mobile?.substring(7);

    /**修改密码提交 */
    const submitSetPwd = () => {
        pwdRef.current?.validateFields().then((value) => {
            setPwdLoading(true);
            updatePassword(value)
                .then(() => {
                    message.success("修改成功");
                    setPwdVisible(false);
                })
                .finally(() => {
                    setPwdLoading(false);
                })
        })
    }

    /**修改电话提交 */
    const submitSetPhone = () => {
        phoneRef.current?.validateFields().then((value) => {
            setPhoneLoading(true);
            updateMobile(value)
                .then(() => {
                    message.success("修改成功");
                    setPhoneVisible(false);
                    /**重新获取用户信息 */
                    getUserInfo().then(({ data }) => {
                        setUserInfo(data)(dispatch);
                    })
                })
                .finally(() => {
                    setPhoneLoading(false);
                })
        })
    }

    return (
        <Fragment>
            <ul className={"flex row-center my-[30px]"}>
                <li className="text-center mx-[40px]">
                    <Avatar
                        size={70}
                        src="/asset/image/icon/is-bind.png"
                    />
                    <p className="my-[10px]">登录密码</p>
                    <p className="my-[10px]">已设置</p>
                    <Button
                        type={"link"}
                        className={"color-[primary]"}
                        onClick={() => setPwdVisible(true)}
                    >
                        修改密码
                    </Button>
                </li>
                <li className="text-center mx-[40px]">
                    <Avatar
                        size={70}
                        src="/asset/image/icon/is-phone.png"
                    />
                    <p className="my-[10px]">手机验证</p>
                    <p className="my-[10px]">{phone}</p>
                    <Button
                        type={"link"}
                        className={"color-[primary]"}
                        onClick={() => setPhoneVisible(true)}
                    >
                        更换手机
                    </Button>
                </li>
            </ul>

            <Modal centered
                visible={pwdVisible}
                title={"修改密码"}
                onCancel={() => setPwdVisible(false)}
                destroyOnClose
                onOk={submitSetPwd}
                confirmLoading={pwdLoading}
            >
                <ResetPwd ref={pwdRef} />
            </Modal>

            <Modal centered
                visible={phoneVisible}
                title={"更换手机"}
                onCancel={() => setPhoneVisible(false)}
                destroyOnClose
                onOk={submitSetPhone}
                confirmLoading={phoneLoading}
            >
                <ResetPhone ref={phoneRef} />
            </Modal>
        </Fragment>
    )
}

const defaultTime = 60;

/**重置密码表单 */
const ResetPwd = React.forwardRef<FormInstance>((_, ref) => {

    const [form] = Form.useForm();

    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    const [codeTime, setCodeTime] = useState<number>(defaultTime);
    const [codeRun, setCodeRun] = useState<boolean>(false);

    let nvc = useRef<any>();

    useEffect(() => {
        initAwsc().then((_nvc_: any) => {
            nvc.current = _nvc_;
        });
    }, []);

    const onSendSms = () => {
        form.validateFields(["mobile"]).then(({ mobile }) => {
            nvc.current.getNVCValAsync(function (nvcVal: any) {
                sendSms({
                    data: decodeURIComponent(nvcVal),
                    mobile: mobile,
                    type: 3,
                    prefixCode: "86"
                }).then(() => {
                    message.success("验证码发送成功");
                    rumTime();
                }).catch((error) => {
                    message.error(error.response.data.message);
                })
            })
        })
    }

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

    const GetSmsCodeBtn: React.FC = () => {
        if (codeRun) return (
            <Button
                block
                size={"large"}
            >
                重新获取 {codeTime}
            </Button>
        )
        return (
            <Button
                block
                onClick={onSendSms}
                type={"primary"}
                size={"large"}
            >
                获取验证码
            </Button>
        )
    }

    const validSubPassword = (_: any, value: string) => {
        const password = form.getFieldValue("password");
        if (password === value) return Promise.resolve();
        return Promise.reject("两次密码输入不一致");
    }

    return (
        <Form
            form={form}
            ref={ref}
            initialValues={{
                mobile: userInfo?.mobile
            }}
        >
            <Form.Item
                name={"mobile"}
                rules={[{ required: true }]}
            >
                <Input readOnly size={"large"} />
            </Form.Item>
            <Form.Item noStyle>
                <Row gutter={20}>
                    <Col span={16}>
                        <Form.Item
                            name={"mobileCode"}
                            rules={[{ required: true, message: "请输入验证码" }]}
                        >
                            <Input
                                size={"large"}
                                placeholder={"请输入验证码"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item>
                            <GetSmsCodeBtn />
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item
                name={"password"}
                rules={[{ required: true, message: "请输入密码" }]}
            >
                <Input.Password size={"large"} placeholder={"请输入密码"} />
            </Form.Item>
            <Form.Item
                name={"subPassword"}
                rules={[
                    { required: true, message: "请再次输入密码" },
                    { validator: validSubPassword, validateTrigger: "blur" }
                ]}
            >
                <Input.Password size={"large"} placeholder="请再次输入密码" />
            </Form.Item>
        </Form>
    )
})

interface ResetPhoneProps {
    type?: number
}

/**重置电话表单 */
export const ResetPhone = React.forwardRef<FormInstance, ResetPhoneProps>((props, ref) => {

    const [form] = Form.useForm();

    const [codeTime, setCodeTime] = useState<number>(defaultTime);
    const [codeRun, setCodeRun] = useState<boolean>(false);

    let nvc = useRef<any>();

    useEffect(() => {
        initAwsc().then((_nvc_: any) => {
            nvc.current = _nvc_;
        });
    }, []);

    const onSendSms = () => {
        form.validateFields(["mobile"]).then(({ mobile }) => {
            nvc.current.getNVCValAsync(function (nvcVal: any) {
                sendSms({
                    data: decodeURIComponent(nvcVal),
                    mobile: mobile,
                    type: props.type || 2,
                    prefixCode: "86"
                }).then(() => {
                    message.success("验证码发送成功");
                    rumTime();
                }).catch((error) => {
                    message.error(error.response.data.message);
                })
            })
        })
    }

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

    const GetSmsCodeBtn: React.FC = () => {
        if (codeRun) return (
            <Button
                block
                size={"large"}
            >
                重新获取 {codeTime}
            </Button>
        )
        return (
            <Button
                block
                onClick={onSendSms}
                type={"primary"}
                size={"large"}
            >
                获取验证码
            </Button>
        )
    }

    return (
        <Form
            form={form}
            ref={ref}
        >
            <Form.Item
                name={"mobile"}
                rules={[{ required: true, message: "请输入手机号码" }]}
            >
                <Input size={"large"} placeholder={"请输入手机号码"} />
            </Form.Item>
            <Form.Item noStyle>
                <Row gutter={20}>
                    <Col span={16}>
                        <Form.Item
                            name={"mobileCode"}
                            rules={[{ required: true, message: "请输入验证码" }]}
                        >
                            <Input
                                size={"large"}
                                placeholder="请输入验证码"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item>
                            <GetSmsCodeBtn />
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    )
})