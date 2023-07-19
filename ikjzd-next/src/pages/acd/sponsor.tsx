import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import { Col, Form, FormInstance, Input, Modal, Row, Button as AntdButton, message, Cascader, Button } from "antd";
import { NextPage } from "next";
import React, { createRef, Fragment, useEffect, useState } from "react";

import createEmotion from '@emotion/css/create-instance'
import { addKjzdActivitySponsor } from "@/apis/users";
import { AddSponsorParams } from "@/vo/Users";
import provinceAndCityData from "@/utils/area";
import initAwsc from "@/utils/awsc";
import { sendSms } from "@/apis/auth";
import { MainReduxState } from "@/redux/store";
import { useSelector } from "react-redux";
import Authorization from "@/components/Authorization";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-activity-sponsor` });

interface ActivitySponsorPageProps {

}

const defaultTime = 60;

/**申请成为主办方 */
const ActivitySponsorPage: NextPage<ActivitySponsorPageProps> = () => {

    const [visible, setVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const formRef = createRef<FormInstance<AddSponsorParams>>();

    const onSwitch = () => {
        setVisible(!visible);

    }

    const onOk = () => {
        formRef.current?.validateFields().then((value) => {
            const _value_: AddSponsorParams = {
                ...value,
                address: `${value.addCode?.join(",")}${value.address}`
            }
            setLoading(true);
            addKjzdActivitySponsor(_value_)
                .then(() => {
                    message.success("申请成功");
                    setVisible(false);
                })
                .finally(() => {
                    setLoading(false);
                })
        })
    }

    return (
        <Fragment>
            <Authorization.Confirm />
            <MinHead />
            <div className={contentCls}>
                <h1 className={titleCls}>免费发布活动</h1>
                <a className={buttonCls} onClick={onSwitch}>
                    申请成为主办方
                </a>
                <p className={descriptCls}>
                    点击申请填写申请资料表，官方审核通过
                </p>
                <p className={descriptCls}>
                    成为主办方后，可在跨境知道活动频道免费发布活动
                </p>
            </div>
            <Footer />

            <Modal centered
                visible={visible}
                onCancel={onSwitch}
                onOk={onOk}
                width={975}
                title={"申请成为主办方"}
                confirmLoading={loading}
            >
                <ActivityApplayForm ref={formRef} />
            </Modal>
        </Fragment>
    )
}

const contentCls = css`
    height: 1077px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url(/asset/image/activity-sponsor-publishbg.png);
    background-size: cover;
    background-position: center;
`;

const titleCls = css`
    color: #ffffff;
    font-size: 68px;
    margin: 0 auto;
    font-weight: bold;
    font-style: italic;
    line-height: 92px;
    text-shadow: -2px 1px 4px #161371;
    background-image: url(/asset/image/activity-sponsor-title-bg.png);
    background-size: 100% 100%;
    padding: 10px 80px;
    margin-bottom: 60px;
`;

const buttonCls = css`
    font-size: 24px;
    padding: 20px 50px;
    background-color: ${process.env.PRIMARY_COLOR};
    color: #fff;
    border-radius: 100px;
    transition: all 0.2s;
    margin-bottom: 60px;

    &:hover {
        color: #fff;
        opacity: 0.9;
    }
`;

const descriptCls = css`
    color: #9b92e6;
    font-size: 14px;
    line-height: 26px;
`;

export default ActivitySponsorPage;

interface ActivityApplayFormProps {

}

/**申请成为主办方 */
const ActivityApplayForm = React.forwardRef<FormInstance<AddSponsorParams>, ActivityApplayFormProps>((_, ref) => {

    const [form] = Form.useForm<AddSponsorParams>();
    const [loading, setLoading] = useState<boolean>(false);
    const [codeTime, setCodeTime] = useState<number>(defaultTime);
    const [codeRun, setCodeRun] = useState<boolean>(false);

    let nvc = React.useRef<any>();

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
        form.validateFields(["mobile"]).then((data) => {
            /**人机验证 */
            nvc.current.getNVCValAsync(function (nvcVal: any) {
                setLoading(true);
                sendSms({
                    data: decodeURIComponent(nvcVal),
                    mobile: data.mobile,
                    type: 4,
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

    const GetSmsCodeBtn: React.FC = () => {
        if (codeRun) return (
            <Button loading={loading}>
                重新获取 {codeTime}
            </Button>
        )
        return (
            <Button
                loading={loading}
                onClick={onSendSms}
                type={"primary"}
            >
                获取验证码
            </Button>
        )
    }

    return (
        <Form<AddSponsorParams>
            wrapperCol={{ span: 18 }}
            labelCol={{ span: 4 }}
            ref={ref}
            form={form}
        >
            <Form.Item
                label={"主办方名称"}
                name={"name"}
                rules={[{ required: true, message: "主办方名称不能为空" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item label={"详细地址"} className={"mb-[0px]"}>
                <Row gutter={10}>
                    <Col span={6}>
                        <Form.Item
                            name={"addCode"}
                            rules={[{ required: true, message: "请选择省市区" }]}
                        >
                            <Cascader
                                options={provinceAndCityData}
                                placeholder="请选择"
                                fieldNames={{ label: "label", value: "label", children: "children" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Form.Item
                            name={"address"}
                            rules={[{ required: true, message: "请填写详细地址" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item
                label={"手机号"}
                name={"mobile"}
                rules={[{ required: true, message: "请填写手机号" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 20 }} className={"mb-[0px]"}>
                <Row gutter={10}>
                    <Col span={8}>
                        <Form.Item
                            name={"mobileCode"}
                            rules={[{ required: true, message: "请填写验证码" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <GetSmsCodeBtn />
                    </Col>
                </Row>
            </Form.Item>
            <Form.Item
                label={"联系人名称"}
                name={"contacts"}
                rules={[{ required: true, message: "请填写联系人名称" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={"申请理由"}
                name={"reason"}
                rules={[{ required: true, message: "请填写申请理由" }]}
            >
                <Input.TextArea rows={6} />
            </Form.Item>
        </Form>
    )
})
