import { getDemandType, saveDemand } from "@/apis/demand";
import Authorization from "@/components/Authorization";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { DemandType } from "@/vo/Demand";
import { Button, Card, Checkbox, DatePicker, Form, Input, InputNumber, message, Radio } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";

import createEmotion from "@emotion/css/create-instance";
import { cloneDeep } from "lodash";
import moment from "moment";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-demand-publish` });

interface DemandPublishPageProps {
    types: DemandType[];
}

const DemandPublishPage: NextPage<DemandPublishPageProps> = (props) => {

    const [methods, setMethods] = useState<CheckboxValueType[]>([]);
    const router = useRouter();

    const onFinish = (values: any) => {
        let params = cloneDeep(values)
        params.endTime = moment(params.endTime).format('YYYY-MM-DD HH:mm:ss')
        saveDemand(params).then(() => {
            message.success("发布成功，审核后即可显示");
            router.back();
        })
    }

    const wcls = css`
        width: 300px;
    `;

    const ccls = css`
        background-color: #F6F9FAFF;
    `;

    const wxcls = css`
    max-width: 376px;
    `;

    const formcls = css`
    padding-top: 20px;
    padding-bottom: 20px;
    label{
        font-weight: bold;
        span{
            font-weight: normal;
        }
    }
    `;

    return (
        <Fragment>
            <MinHead />

            <img src={"/asset/image/demand-publish-banner.png"} className={"w-[100%]"} />

            <Container className={formcls}>
                <Card bordered={false}>
                    <Form
                        layout={"vertical"}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label={"1、选择您所需的服务类型"}
                            name={"type"}
                            rules={[{ required: true, message: "请选择您所需的服务类型" }]}
                        >
                            <Radio.Group>
                                {props.types.map((type) => (
                                    <Radio
                                        key={type.id}
                                        value={type.id}
                                    >
                                        {type.name}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={"2、明确需求标题与详情"}
                            required
                        >
                            <Form.Item
                                wrapperCol={{ span: 18 }}
                                name={"title"}
                                rules={[{ required: true, message: "请输入标题" }]}
                            >
                                <Input placeholder="请输入标题" />
                            </Form.Item>
                            <Form.Item
                                name={"content"}
                                rules={[{ required: true, message: "请输入详情" }]}
                            >
                                <Input.TextArea rows={6} placeholder={"请输入详情"} />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item
                            name={"endTime"}
                            label={"3、需求截止时间"}
                            rules={[{ required: true, message: "请选择日期时间" }]}
                        >
                            {/* @ts-ignore */}
                            <DatePicker
                                showTime
                                placeholder="请选择日期时间"
                                className={wcls}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"4、联系手机号与其他联系方式"}
                            required
                        >
                            <Form.Item
                                name={"mobile"}
                                rules={[{ required: true, message: "请输入手机号" }]}
                            >
                                <InputNumber
                                    placeholder="请输入手机号"
                                    className={wcls}
                                />
                            </Form.Item>
                            <Card className={ccls} bordered={false}>
                                <Form.Item
                                    label={"希望如何联系您"}
                                    rules={[{ required: true, message: "请选择联系方式" }]}
                                >
                                    <Checkbox.Group onChange={setMethods}>
                                        <Checkbox value={"wechat"}>微信方式</Checkbox>
                                        <Checkbox value={"email"}>邮箱方式</Checkbox>
                                        <Checkbox value={"qq"}>QQ方式</Checkbox>
                                    </Checkbox.Group>
                                </Form.Item>
                                {/* 微信方式 */}
                                {(() => {
                                    if (methods.includes("wechat")) {
                                        return (
                                            <Form.Item
                                                label={"微信"}
                                                name={"wechat"}
                                                rules={[{ required: true, message: "请输入微信" }]}
                                            >
                                                <Input placeholder="请输入微信" className={wxcls} />
                                            </Form.Item>
                                        )
                                    }
                                    return <Fragment />;
                                })()}
                                {/* 邮箱方式 */}
                                {(() => {
                                    if (methods.includes("email")) {
                                        return (
                                            <Form.Item
                                                label={"邮箱"}
                                                name={"email"}
                                                rules={[{ required: true, message: "请输入邮箱" }]}
                                            >
                                                <Input placeholder="请输入邮箱" className={wxcls} />
                                            </Form.Item>
                                        )
                                    }
                                    return <Fragment />;
                                })()}
                                {/* QQ方式 */}
                                {(() => {
                                    if (methods.includes("qq")) {
                                        return (
                                            <Form.Item
                                                label={"QQ"}
                                                name={"qq"}
                                                rules={[{ required: true, message: "请输入QQ" }]}
                                            >
                                                <Input placeholder="请输入QQ" className={wxcls} />
                                            </Form.Item>
                                        )
                                    }
                                    return <Fragment />;
                                })()}
                            </Card>
                        </Form.Item>
                        <Form.Item
                            label={"5、服务商如何称呼您"}
                            wrapperCol={{ span: 8 }}
                            name={"name"}
                            rules={[{ required: true, message: "请输入您的称呼" }]}
                        >
                            <Input placeholder="跨境知道卖家" />
                        </Form.Item>
                        <Form.Item>
                            <Authorization.Valid>
                                <Button
                                    type={"primary"}
                                    shape={"round"}
                                    size={"large"}
                                    htmlType={"submit"}
                                >
                                    立即发布
                                </Button>
                            </Authorization.Valid>
                        </Form.Item>
                    </Form>
                </Card>
            </Container>
            <Footer />
        </Fragment>
    )
}

DemandPublishPage.getInitialProps = async () => {
    const types = (await getDemandType()).data;
    return {
        types
    }
}

export default DemandPublishPage;
