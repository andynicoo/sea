import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Button, Card, Form, Input, InputNumber, Select, Space, Row, Col } from "antd";
import dynamic from "next/dynamic";
import React, { Fragment, useEffect, useState } from "react";
import { addKjzdTools, getKjzdTools, listToolsPlatform, updateKjzdTools } from "@/apis/users";
import Link from "next/link";
import { useRouter } from "next/router";
import { PlatformListProps, ResourcesDataProps } from "@/vo/Users";
import Upload from "@/components/Upload";
import { UploadOutlined } from "@ant-design/icons";
import { NextPage } from "next";
import Authorization from "@/components/Authorization";
import Cookie from "@/utils/cookie";
import { cloneDeep } from "lodash";

const IkjzdBraftEditor = dynamic(() => import("@/components/BraftEditor"), { ssr: false });

interface AddResourcesPageProps {
    resources?: ResourcesDataProps
}

/**新增编辑资源页面 */
const AddResourcesPage: NextPage<AddResourcesPageProps> = (props) => {
    const router = useRouter()
    const [form] = Form.useForm<ResourcesDataProps>();
    const [pulishStatus, setPulishStatus] = useState<boolean>(false);
    const [platformList, setPlatformList] = useState<PlatformListProps[]>();

    useEffect(() => {
        listToolsPlatform().then((res) => {
            setPlatformList(res.data);
        });
    }, []);

    const onPublish = () => {
        form.validateFields()
            .then(async (values) => {
                let params = cloneDeep(values)
                let resourcesInfo: string[] = values.enclosureUrl?.split(",") as []
                params.enclosureUrl = resourcesInfo[0] as string
                params.enclosureName = resourcesInfo[1] as string
                params.enclosureSize = resourcesInfo[2] as string
                if (router.query.id) {
                    await updateKjzdTools({ id: Number(router.query.id), ...params });
                } else {
                    await addKjzdTools(params);
                }
                setPulishStatus(true)
            })
            .catch((error) => {
                form.scrollToField(error.errorFields[0].name);
            })
    };

    if (pulishStatus) {
        return (
            <DefaultLayout>
                <UploadSuccess />
            </DefaultLayout>
        )
    }

    return (
        <Fragment>
            <Authorization.Confirm />
            <DefaultLayout>
                <Form<ResourcesDataProps>
                    form={form}
                    initialValues={props.resources}
                >
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Card title="上传资源" bordered={false}>
                            <Form.Item
                                label="资源名称"
                                name="title"
                                rules={[{ required: true, message: "请输入资源名称" }]}
                            >
                                <Input showCount maxLength={50} />
                            </Form.Item>
                            <Form.Item
                                label="上传资源"
                                name="enclosureUrl"
                                rules={[{ required: true, message: "请上传资源" }]}
                            >
                                <Upload updataType={'resources'} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>点击上传附件</Button>
                                    <p>支持上传txt、xlsx、pdf、rar、zip、ppt格式，不得超过30M</p>
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                label="所属平台"
                                required
                                style={{ marginBottom: 0 }}
                            >
                                <Row gutter={15}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="toolsPlatformId"
                                            rules={[{ required: true, message: "请选择" }]}
                                        >
                                            <Select className="pg-w404">
                                                {platformList?.map(item => (
                                                    <Select.Option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="resourceType"
                                            rules={[{ required: true, message: "请选择" }]}
                                        >
                                            <Select className="pg-w404">
                                                <Select.Option value={2}>文档类</Select.Option>
                                                <Select.Option value={1}>工具类</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item
                                label="所需积分"
                                name="integralNum"
                                rules={[{ required: true, message: "请输入下载积分" }]}
                            >
                                <InputNumber className="pg-w404" min={0} max={100} />
                            </Form.Item>
                        </Card>

                        <Card title="正文信息" bordered={false}>
                            <Form.Item
                                name="content"
                                rules={[{ required: true, message: "请输入正文信息" }]}
                            >
                                {/* @ts-ignore */}
                                <IkjzdBraftEditor />
                            </Form.Item>
                        </Card>

                        <Card
                            size={"small"}
                            bordered={false}
                            style={{ textAlign: "center" }}
                        >
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={onPublish}
                                >
                                    确认发布
                                </Button>
                                <Button onClick={router.back}>
                                    取消
                                </Button>
                            </Space>
                        </Card>
                    </Space>
                </Form>
            </DefaultLayout>
        </Fragment>
    )
}

AddResourcesPage.getInitialProps = async (ctx) => {
    let resources: ResourcesDataProps | undefined;

    const token = Cookie.getToken(ctx);

    if (ctx.query.id) {
        resources = (await getKjzdTools({ id: ctx.query.id as string }, token)).data;
    }

    return {
        resources
    }
}

export default AddResourcesPage;

/**上传成功提示组件 */
const UploadSuccess: React.FC = () => {
    return (
        <Card bordered={false}>
            <div className="text-center py-[30px]">
                <img src="/asset/image/ac-success.png" />
                <h2 className="fs-[25px] my-[20px] fw-500">上传成功</h2>
                <p className="mb-[20px]">感谢你上传的资源，本次获得10积分,用户下载此资源支付的积分将全部由您收取</p>
                <p className="mb-[20px]">温馨提示：发布资源后我们会审核， 审核通过后您可以查到发布的资源</p>
                <Space size={20}>
                    <Link href={"/users/resources"}>
                        <a>
                            <Button size={"large"}>
                                查看我的资源
                            </Button>
                        </a>
                    </Link>
                    <Link href={"/"}>
                        <a>
                            <Button
                                size={"large"}
                                type="primary"
                            >
                                返回首页
                            </Button>
                        </a>
                    </Link>
                </Space>
            </div>
        </Card >
    )
}