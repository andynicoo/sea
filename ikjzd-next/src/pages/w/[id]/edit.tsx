import { getEncyclopediaCategoryList, getEncyclopediaEncyclopediaDetail, kjzdConsoleSave } from "@/apis/encyclopedia";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { CustomNextPageContext } from "@/pages/_app";
import Encyclopedia, { BaseInfo } from "@/vo/Encyclopedia";
import { Button, Card, Checkbox, Col, Form, Input, message, Modal, Row, Select, Space } from "antd";
import { NextPage } from "next";
import React, { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import Upload from "@/components/Upload";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { setEncyclopediaCategorys } from "@/redux/actions/encyclopediaActions";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { useRouter } from "next/router";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { RuleObject } from "antd/lib/form";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-encyclopedia-id-edit` });

const BraftEditor = dynamic(() => import("@/components/BraftEditor"), { ssr: false });

interface EncyclopediaDetailEditProps {
    detail: Encyclopedia;
}

const EncyclopediaDetailEdit: NextPage<EncyclopediaDetailEditProps> = (props) => {

    const [form] = Form.useForm<Encyclopedia>();
    const [loading, setLoading] = useState<boolean>(false);
    const [reasonVisible, setReasonVisible] = useState<boolean>(false);
    const [reasons, setReasons] = useState<CheckboxValueType[]>([]);
    const [draft, setDraft] = useState<number>(0);
    const encyclopediaCategorys = useSelector((state: MainReduxState) => state.encyclopediaReducer.encyclopediaCategorys);
    const router = useRouter();

    const DubleTitle: React.FC<{ title: string; subTitle: string }> = ({ title, subTitle }) => {
        return <p>{title}<span style={{ fontSize: 10, marginLeft: 10, color: "#999" }}>{subTitle}</span></p>
    }

    const onSubmit = () => {
        const value = form.getFieldsValue();
        value.reason = reasons.join(",");
        setLoading(true);
        kjzdConsoleSave({ ...value, draft, encyclopediaId: props.detail.id }).then(() => {
            message.success("提交成功");
            router.back();
        }).finally(() => {
            setLoading(false);
        })
    }

    const onBeforeSubmit = () => {
        setDraft(0);
        form.validateFields().then(() => {
            setReasonVisible(true);
        })
    }

    const baseInfoValidator = (rule: RuleObject, value: BaseInfo[]) => {
        if (!value.length) return Promise.reject("请添加信息");
        return Promise.resolve();
    }

    const countCls = css`
        &::after {
            transform: translate(-10px, -25px);
        }
    `;

    return <Fragment>
        <Modal centered
            title={<DubleTitle title="修改原因" subTitle="恶意修改或刷内链将导致账号被封" />}
            visible={reasonVisible}
            width={800}
            onOk={onSubmit}
            onCancel={() => setReasonVisible(false)}
        >
            <Checkbox.Group onChange={setReasons}>
                <Row>
                    <Col span={4}>
                        <Checkbox value={"扩充内容"}>扩充内容</Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox value={"修改图册/图片"}>修改图册/图片</Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox value={"更正错误"}>更正错误</Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox value={"删除多余重复"}>删除多余重复</Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox value={"编辑参考资料"}>编辑参考资料</Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox value={"调整排版"}>调整排版</Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox value={"增加文字内链"}>增加文字内链</Checkbox>
                    </Col>
                    <Col span={4}>
                        <Checkbox value={"其他"}>其他</Checkbox>
                    </Col>
                </Row>
            </Checkbox.Group>
        </Modal>

        <DefaultLayout>
            <Form<Encyclopedia>
                form={form}
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 20 }}
                initialValues={props.detail}
            >
                <Space
                    direction="vertical"
                    className={"w-[100%]"}
                    size={20}
                >
                    <Card title={"词条基本信息"} bordered={false}>
                        <Form.Item
                            label={"词条名称"}
                            name={"title"}
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={"词条描述"}
                            name={"summary"}
                            rules={[{ required: true }]}
                        >
                            <Input.TextArea
                                rows={10}
                                maxLength={600}
                                showCount
                                className={countCls}
                            />
                        </Form.Item>
                        <Form.Item
                            label={"词条分类"}
                            name={"encyclopediaCategoryId"}
                            rules={[{ required: true }]}
                            wrapperCol={{ span: 6 }}
                        >
                            <Select>
                                {encyclopediaCategorys?.map((category) => (
                                    <Select.Option key={category.id}>
                                        {category.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={"词条封面"}
                            name={"thumbUrl"}
                            rules={[{ required: true }]}
                        >
                            <Upload />
                        </Form.Item>
                    </Card>

                    <Card
                        title={<DubleTitle title="基本信息" subTitle="用于展示词条如：网址、性质、创始人、成立日期等直观的重要信息" />}
                        bordered={false}
                    >
                        <Form.List name={"baseInfo"} rules={[{ validator: baseInfoValidator }]}>
                            {(fields, { add, remove }, { errors }) => (
                                <Fragment>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Fragment key={key}>
                                            <Form.Item required label={"必填选项"} style={{ marginBottom: 0 }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "title"]}
                                                    rules={[{ required: true, message: "请填写自定义标题" }]}
                                                    style={{ display: "inline-block", width: 200, marginRight: 20 }}
                                                >
                                                    <Input placeholder="请填写自定义标题" />
                                                </Form.Item>
                                                <Form.Item

                                                    {...restField}
                                                    name={[name, "content"]}
                                                    rules={[{ required: true, message: "请填写自定义内容" }]}
                                                    style={{ display: "inline-block", width: 200, marginRight: 20 }}
                                                >
                                                    <Input placeholder="请填写自定义内容" />
                                                </Form.Item>
                                                {(() => {
                                                    if (fields.length <= 1) return <Fragment />
                                                    return <Form.Item style={{ display: "inline-block" }}>
                                                        <Button shape="circle" onClick={() => remove(name)}>
                                                            <DeleteOutlined />
                                                        </Button>
                                                    </Form.Item>
                                                })()}
                                            </Form.Item>
                                        </Fragment>
                                    ))}
                                    {(() => {
                                        if (!errors.length) return <Fragment />;
                                        return <Form.Item wrapperCol={{ offset: 2 }}>
                                            <Form.ErrorList errors={errors} />
                                        </Form.Item>
                                    })()}
                                    <Form.Item wrapperCol={{ offset: 2 }}>
                                        <Button onClick={() => add({ title: "", content: "" })}>
                                            <PlusOutlined />
                                            添加信息
                                        </Button>
                                    </Form.Item>
                                </Fragment>
                            )}
                        </Form.List>
                    </Card>

                    <Card title={"正文信息"} bordered={false}>
                        <Form.Item name={"content"} wrapperCol={{ span: 24 }}>
                            {/* @ts-ignore */}
                            <BraftEditor />
                        </Form.Item>
                    </Card>

                    <Card title={"参考资料"} bordered={false}>
                        <Form.List name={"refer"}>
                            {(fields, { add, remove }) => (
                                <Fragment>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Fragment key={key}>
                                            <Form.Item style={{ marginBottom: 0 }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "title"]}
                                                    rules={[{ required: true, message: "请填写自定义标题" }]}
                                                    style={{ display: "inline-block", width: 200, marginRight: 20 }}
                                                >
                                                    <Input placeholder="标题" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "url"]}
                                                    rules={[{ required: true, message: "请填写连接" }]}
                                                    style={{ display: "inline-block", width: 200, marginRight: 20 }}
                                                >
                                                    <Input placeholder="请输入链接，必须包含http:// 或https://" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "source"]}
                                                    rules={[{ required: true, message: "请填写来源" }]}
                                                    style={{ display: "inline-block", width: 200, marginRight: 20 }}
                                                >
                                                    <Input placeholder="来源" />
                                                </Form.Item>
                                                {(() => {
                                                    if (fields.length <= 1) return <Fragment />
                                                    return <Form.Item style={{ display: "inline-block" }}>
                                                        <Button shape="circle" onClick={() => remove(name)}>
                                                            <DeleteOutlined />
                                                        </Button>
                                                    </Form.Item>
                                                })()}
                                            </Form.Item>
                                        </Fragment>
                                    ))}
                                    <Form.Item>
                                        <Button onClick={() => add({
                                            title: "",
                                            url: "",
                                            source: "",
                                        })}>
                                            <PlusOutlined />
                                            添加信息
                                        </Button>
                                    </Form.Item>
                                </Fragment>
                            )}
                        </Form.List>
                    </Card>

                    <div className={"text-center"}>
                        <Space>
                            <Button
                                loading={loading}
                                onClick={onBeforeSubmit}
                                type="primary"
                            >
                                提交
                            </Button>
                            <Button>预览</Button>
                            <Button>存草稿箱</Button>
                        </Space>
                    </div>
                </Space>
            </Form>
        </DefaultLayout>
    </Fragment>
}

EncyclopediaDetailEdit.getInitialProps = async (ctx: CustomNextPageContext) => {
    const res = await getEncyclopediaEncyclopediaDetail(ctx.query.id as string);

    const state = ctx.reduxStore.getState();
    let categorys = state?.encyclopediaReducer.encyclopediaCategorys;
    if (!categorys) {
        categorys = (await getEncyclopediaCategoryList()).data;
        setEncyclopediaCategorys(categorys)(ctx.reduxStore.dispatch);
    }

    return {
        detail: res.data
    }
}

export default EncyclopediaDetailEdit;