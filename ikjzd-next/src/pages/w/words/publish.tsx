import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Button, Card, Col, Form, Input, message, Row, Select, Space } from "antd";
import { NextPage } from "next";
import React, { Fragment, useEffect, useState } from "react";
import Upload from "@/components/Upload";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Encyclopedia, { EncyclopediaCategory } from "@/vo/Encyclopedia";
import { getEncyclopediaCategoryList, kjzdConsoleSave } from "@/apis/encyclopedia";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import Authorization from "@/components/Authorization";

import createEmotion from "@emotion/css/create-instance";
import Link from "next/link";
import { kjzdEncyclopediaDraftDetail } from "@/apis/users";
import Cookie from "@/utils/cookie";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-encyclopedia-words-publish` });

const IkjzdBraftEditor = dynamic(() => import("@/components/BraftEditor"), { ssr: false });

interface EncyclopediaWordsPublishPageProps {
    initArticle?: Encyclopedia;
}

/**发布词条页面 */
const EncyclopediaWordsPublishPage: NextPage<EncyclopediaWordsPublishPageProps> = (props) => {
    const [success, setSuccess] = useState<boolean>(false);
    const [categorys, setCategorys] = useState<EncyclopediaCategory[]>([]);
    const [form] = Form.useForm<Encyclopedia>();
    const router = useRouter();

    const BaseInfoTitle: React.FC = () => {
        return (
            <div className={"flex row-center"}>
                <h2 className="ma-[0px] color-[#1d1f1d] fs-[18px]">
                    基本信息
                </h2>
                <p className="ma-[0px] color-[#bbbbbb] fs-[12px] ml-[10px]">
                    用于展示词条如：网址、性质、创始人、成立日期等直观的重要信息
                </p>
            </div>
        )
    }

    const validateForm = () => {
        return new Promise<Encyclopedia>((resolve, reject) => {
            form.validateFields()
                .then(resolve)
                .catch((error) => {
                    form.scrollToField(error.errorFields[0].name);
                    reject(error);
                })
        })
    }

    /**提交 */
    const onSubmit = () => {
        validateForm().then((data) => {
            /**不是草稿 */
            data.draft = 0;
            if (router.query.id) {
                data.id = router.query.id as string
            }
            kjzdConsoleSave(data)
                .then(() => {
                    message.success("提交成功");
                    setSuccess(true)
                    // router.back();
                }).catch((error) => {
                    message.error(error.response.data.message);
                })
        })
    }

    /**预览 */
    const onPreview = () => {
        validateForm().then((data) => {
            const uid = uuid();
            localStorage.setItem(`priview_${uid}`, JSON.stringify(data));
            window.open(`/w/priview/${uid}`, '_blank');
        })
    }

    /**存草稿箱 */

    const onSave = () => {
        validateForm().then((data) => {
            /**不是草稿 */
            data.draft = 1;
            kjzdConsoleSave(data)
                .then(() => {
                    message.success("草稿保存成功，请至【个人中心-我的创作】中查看");
                }).catch((error) => {
                    message.error(error.response.data.message);
                })
        })
    }

    useEffect(() => {
        getEncyclopediaCategoryList().then((res) => {
            setCategorys(res.data);
        });
    }, []);

    const summaryCls = css`
        &::after {
            margin: 0;
            position: absolute;
            right: 10px;
            bottom: 30px;
        }
    `;
    if (success) {
        const successCls = css`
             width: 920px;
             margin: 0 auto!important;
             min-height: 500px;
             display: flex;
             flex-wrap: wrap;
             align-items: center;
             text-align: center;
             box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
             div,p{
                width: 100%;
             }
        `
        return <DefaultLayout>
            <Card className={successCls}>
                <div className="fs-[18px] color-[#222222]">编辑百科提交成功</div>
                <p className="fs-[14px] color-[#999999] mt-[20px] mb-[20px]">系统需要花费一段时间检查你的版本，以确保不包含任何违反法律法规的内容。您发布的词条在通过后成为词条的最新版本</p>
                <div>
                    <Link href={'/users/creation'}>
                        <a>
                            <Button size="large" className="mr-[50px] w-[140px]">查看我的创作</Button>
                        </a>
                    </Link>
                    <Link href={'/'}>
                        <a>
                            <Button size="large" type="primary" className="w-[140px]">返回主页</Button>
                        </a>
                    </Link>
                </div>
            </Card>
        </DefaultLayout>
    }

    return <DefaultLayout>
        <Form<Encyclopedia> form={form} initialValues={props.initArticle}>
            <Space direction="vertical" size={20} className={"w-[100%]"}>
                <Card title={"词条基本信息"} bordered={false}>
                    <Form.Item
                        name={"title"}
                        label={"词条名称"}
                        rules={[{ required: true, message: "请输入词条名称" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={"summary"}
                        label={"词条描述"}
                        rules={[{ required: true, message: "请输入词条描述" }]}
                    >
                        <Input.TextArea
                            className={summaryCls}
                            rows={10}
                            showCount
                            maxLength={600}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ span: 10 }}
                        name={"encyclopediaCategoryId"}
                        label={"词条分类"}
                        rules={[{ required: true, message: "请选择词条分类" }]}
                    >
                        <Select
                            options={categorys}
                            fieldNames={{ label: "title", value: "id" }}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"thumbUrl"}
                        label={"词条封面"}
                        rules={[{ required: true, message: "请上传词条封面" }]}
                    >
                        <Upload listType={"picture-card"} />
                    </Form.Item>
                </Card>

                <Card title={<BaseInfoTitle />} bordered={false}>
                    <Form.List name={"baseInfo"}>
                        {(fields, { add, remove }) => (
                            <Fragment>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Form.Item
                                        key={key}
                                        label={"必填选项"}
                                        required
                                        className={"mb-[0px]"}
                                    >
                                        <Row gutter={10}>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "title"]}
                                                    rules={[{ required: true, message: "请填写自定义标题" }]}
                                                >
                                                    <Input placeholder="请填写自定义标题" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "content"]}
                                                    rules={[{ required: true, message: "请填写自定义内容" }]}
                                                >
                                                    <Input placeholder="请填写自定义内容" />
                                                </Form.Item>
                                            </Col>
                                            {fields.length > 1 && (
                                                <Col span={2}>
                                                    <Button
                                                        shape="circle"
                                                        onClick={() => remove(name)}
                                                    >
                                                        <DeleteOutlined />
                                                    </Button>
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                ))}
                                <Button onClick={() => add({ title: "", content: "" })}>
                                    <PlusOutlined />
                                    添加信息
                                </Button>
                            </Fragment>
                        )}
                    </Form.List>
                </Card>

                <Card title={"正文信息"} bordered={false} >
                    <Form.Item name={"content"} rules={[{ required: true, message: "请输入词条内容" }]}>
                        {/* @ts-ignore */}
                        <IkjzdBraftEditor />
                    </Form.Item>
                </Card>

                <Card title={"参考资料"} bordered={false}>
                    <Form.List name={"refer"}>
                        {(fields, { add, remove }) => {
                            const onAdd = () => add({ title: "", url: "", source: "" });
                            if (!fields.length) return <EmptyRefer onClick={onAdd} />;
                            return <Fragment>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={10}>
                                        <Col span={6}>
                                            <Form.Item
                                                name={[name, "title"]}
                                                rules={[{ message: "请输入标题" }]}
                                            >
                                                <Input placeholder="标题" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name={[name, "url"]}
                                                rules={[{ message: "请输入链接" }]}
                                            >
                                                <Input placeholder="请输入链接，必须包含http:// 或https://" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name={[name, "source"]}
                                                rules={[{ message: "请输入来源" }]}
                                            >
                                                <Input placeholder="来源" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Form.Item>
                                                <Button
                                                    shape="circle"
                                                    onClick={() => remove(name)}
                                                >
                                                    <DeleteOutlined />
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ))}
                                <Button onClick={onAdd}>
                                    <PlusOutlined />
                                    添加信息
                                </Button>
                            </Fragment>
                        }}
                    </Form.List>
                </Card>

                <Card
                    size={"small"}
                    bordered={false}
                    style={{ textAlign: "center" }}
                >
                    <Space className={"w-[100%]"}>
                        <Authorization.Valid>
                            <Button
                                type="primary"
                                onClick={onSubmit}
                            >
                                提交
                            </Button>
                        </Authorization.Valid>
                        <Authorization.Valid>
                            <Button onClick={onPreview}>
                                预览
                            </Button>
                        </Authorization.Valid>
                        <Authorization.Valid>
                            <Button onClick={onSave}>
                                存草稿箱
                            </Button>
                        </Authorization.Valid>
                    </Space>
                </Card>
            </Space>
        </Form>
    </DefaultLayout>
}


EncyclopediaWordsPublishPage.getInitialProps = async (ctx) => {
    let initArticle: Encyclopedia | undefined;

    if (ctx.query.id) {
        const token = Cookie.getToken(ctx);
        initArticle = (await kjzdEncyclopediaDraftDetail(ctx.query.id as string, token)).data;
    }

    return {
        initArticle
    }
}


export default EncyclopediaWordsPublishPage;

const EmptyRefer: React.FC<{ onClick: React.MouseEventHandler<HTMLElement> }> = ({ onClick }) => {

    return (
        <div className={"py-[30px] text-center color-[#999999]"}>
            <p>如果您有词条的参考来源资料请添加，若没有，请跳过</p>
            <Button type="link" onClick={onClick} className={"color-[primary]"}>
                <PlusOutlined />
                点击添加
            </Button>
        </div>
    )
}