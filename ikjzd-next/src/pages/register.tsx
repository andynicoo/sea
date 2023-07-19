import DefaultLayout from "@/components/layouts/DefaultLayout";
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import initAwsc from "@/utils/awsc";
import { oauthRegister, sendSms } from "@/apis/auth";
import { RegisterParams } from "@/vo/Auth";
import { useRouter } from "next/router";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-register` });

const defaultTime = 60;

interface RegisterPageProps {

}

/**
 * 注册账号页面
 */
const RegisterPage: NextPage<RegisterPageProps> = () => {
    const [form] = Form.useForm<RegisterParams>();
    const [codeTime, setCodeTime] = useState<number>(defaultTime);
    const [codeRun, setCodeRun] = useState<boolean>(false);
    const router = useRouter();

    const nvc = useRef<any>();

    /**获取验证码计时 */
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

    /**发送验证码点击事件 */
    const onSendSms = () => {
        form.validateFields(["mobile"]).then((data) => {
            nvc.current.getNVCValAsync(function (nvcVal: any) {
                sendSms({
                    data: decodeURIComponent(nvcVal),
                    mobile: data.mobile,
                    type: 2,
                    prefixCode: "86"
                })
                    .then((res) => {
                        message.success("验证码发送成功");
                        rumTime();
                    })
                    .catch((error) => {
                        message.error(error.response.data.message);
                    })
            })
        })
    }

    /**注册提交 */
    const onFinish = (data: RegisterParams) => {
        oauthRegister(data).then((res) => {
            message.success("注册成功");
            router.push("/");
        }).catch((error) => {
            message.error(error.response.data.message);
        })
    }

    /**获取验证码按钮 */
    const GetSmsCodeBtn: React.FC = () => {
        if (codeRun) return (
            <Button size={"large"} >
                重新获取 {codeTime}
            </Button>
        )
        return (
            <Button
                type="primary"
                size={"large"}
                onClick={onSendSms}
            >
                获取验证码
            </Button>
        )
    }

    /**初始化人机验证 */
    useEffect(() => {
        initAwsc().then((nvcVal) => {
            nvc.current = nvcVal;
        });
    }, []);

    const cls = css`
        max-width: 900px;
        margin: 0 auto;

        .${process.env.CLASS_PREFIX}-form {
            max-width: 350px;
            margin: 0 auto;
        }
    `;

    const validCodeCls = css`
        .${process.env.CLASS_PREFIX}-form-item {
            width: calc(100% - 130px);
        }

        .${process.env.CLASS_PREFIX}-btn {
            width: 130px;
        }
    `;

    return <DefaultLayout>
        <Card className={cls} title={"注册账号"}>
            <Form<RegisterParams> form={form} onFinish={onFinish}>
                <Form.Item
                    name={"mobile"}
                    rules={[
                        { required: true, message: "手机号不能为空" },
                        { pattern: /^\d{11}$/, message: "请输入正确的手机号码", validateTrigger: "blue" }
                    ]}
                >
                    <Input
                        size={"large"}
                        placeholder={"请输入手机号"}
                    />
                </Form.Item>
                <Form.Item noStyle>
                    <Input.Group
                        size={"large"}
                        compact
                        className={validCodeCls}
                    >
                        <Form.Item
                            name={"mobileCode"}
                            rules={[{ required: true, message: "请输入验证码" }]}
                        >
                            <Input
                                maxLength={6}
                                placeholder="请输入验证码"
                            />
                        </Form.Item>
                        <GetSmsCodeBtn />
                    </Input.Group>
                </Form.Item>
                <Form.Item
                    name={"password"}
                    rules={[{ required: true, message: "请设置6至12位登录密码" }]}
                >
                    <Input.Password
                        placeholder="设置6至12位登录密码"
                        size={"large"}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        htmlType="submit"
                        type={"primary"}
                        size={"large"}
                        block
                    >
                        立即注册
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </DefaultLayout>
}

export default RegisterPage;