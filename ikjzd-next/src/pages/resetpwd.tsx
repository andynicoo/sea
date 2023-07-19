import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Button, Card, Form, Input, message } from "antd";
import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import initAwsc from "@/utils/awsc";
import { useRouter } from "next/router";
import { ResetPwdParams } from "@/vo/Auth";
import { resetPassword, sendSms } from "@/apis/auth";
import { RuleObject } from "antd/lib/form";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-resetpwd` });

interface ResetpwdPageProps {

}

const defaultTime = 60;

/**找回密码、重置密码 */
const ResetpwdPage: NextPage<ResetpwdPageProps> = () => {
    const [form] = Form.useForm<ResetPwdParams>();
    const [codeTime, setCodeTime] = useState<number>(defaultTime);
    const [codeRun, setCodeRun] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const router = useRouter();

    const nvc = useRef<any>();

    /**发送验证码 */
    const onSendSms = () => {
        form.validateFields(["mobile"]).then((data) => {
            nvc.current.getNVCValAsync(function (nvcVal: any) {
                setLoading(true);
                sendSms({
                    data: decodeURIComponent(nvcVal),
                    mobile: data.mobile,
                    type: 3,
                    prefixCode: "86"
                }).then(() => {
                    message.success("验证码发送成功");
                    rumTime();
                }).catch((error) => {
                    message.error(error.response.data.message);
                }).finally(() => {
                    setLoading(false);
                })
            })
        })
    }

    /**提交 */
    const onFinish = (value: ResetPwdParams) => {
        setConfirmLoading(true);
        resetPassword(value)
            .then((res) => {
                message.success("修改密码成功");
                router.push("/");
            })
            .catch((error) => {
                message.error(error.response.data.message);
            })
            .finally(() => {
                setConfirmLoading(false);
            })
    }

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

    /**获取验证码按钮 */
    const GetSmsCodeBtn: React.FC = () => {
        if (codeRun) return (
            <Button size={"large"}>
                重新获取 {codeTime}
            </Button>
        )
        return (
            <Button
                type="primary"
                size={"large"}
                onClick={onSendSms}
                loading={loading}
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

    const validSubPassword = (rule: RuleObject, value: string) => {
        const password = form.getFieldValue("password");
        if (password === value) return Promise.resolve();
        return Promise.reject("请确认两次密码输入是否一致");
    }

    const cls = css`
        margin: 0 auto;
        max-width: 900px;

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
        <Card title={"找回密码"} className={cls}>
            <Form<ResetPwdParams>
                form={form}
                onFinish={onFinish}
            >
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
                        placeholder="设置密码"
                        size={"large"}
                    />
                </Form.Item>

                <Form.Item
                    name={"subPassword"}
                    rules={[
                        { required: true, message: "请设置6至12位登录密码" },
                        { validator: validSubPassword, validateTrigger: "blue" }
                    ]}
                >
                    <Input.Password
                        placeholder="确认密码"
                        size={"large"}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        htmlType="submit"
                        type={"primary"}
                        size={"large"}
                        block
                        loading={confirmLoading}
                    >
                        确定
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </DefaultLayout>
}

export default ResetpwdPage;