import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Button, Card, Divider, Form, Input, InputNumber, message, Select, Space } from "antd";
import { NextPage } from "next";
import React, { Key, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { kjzdEncyclopediaCategoryListAll } from "@/apis/encyclopedia";
import { ActivityPlatform } from "@/vo/Encyclopedia";
import TagsSelect from "@/components/TagsSelect";
import Upload from "@/components/Upload";
import { kjzdArticleDraftSave, kjzdArticlePublish } from "@/apis/article";
import Article, { ArticleCategory } from "@/vo/Article";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { css } from "@emotion/css";
import Link from "next/link";
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { kjzdArticleDraftGet, kjzdArticlePlatformListAll } from "@/apis/users";
import { cloneDeep } from "lodash";

const IkjzdBraftEditor = dynamic(() => import("@/components/BraftEditor"), { ssr: false });

interface ArticlesPublishPageProps {
    initArticle?: Article;
}

/**发布文章页面 */
const ArticlesPublishPage: NextPage<ArticlesPublishPageProps> = (props) => {

    const [platforms, setPlatforms] = useState<ActivityPlatform[]>([]);
    const [categorysSours, setCategorysSours] = useState<ArticleCategory[]>([]);
    const [categorys, setCategorys] = useState<ArticleCategory[]>([]);
    const [success, setSuccess] = useState<boolean>(false);
    const [putaway, setPutaway] = useState<boolean>(false);
    const [form] = Form.useForm<Article>();

    /**展开收起 */
    const onPutaway = () => {
        setPutaway(!putaway)
        if (putaway) {
            setCategorys(cloneDeep(categorysSours).splice(0, 20));
        } else {
            setCategorys(categorysSours)
        }
    }
    /**提交保存 */
    const onFinish = (values: Article) => {
        kjzdArticlePublish(values)
            .then(() => {
                message.success("发布成功");
                setSuccess(true)
            })
            .catch((error) => {
                message.error(error.response.data.message);
            })
    }

    /**存草稿箱 */
    const onDraftSave = () => {
        form.validateFields().then((value) => {
            kjzdArticleDraftSave(value)
                .then(() => {
                    message.success("草稿保存成功，请至【个人中心-我的创作】中查看");
                })
                .catch((error) => {
                    message.error(error.response.data.message);
                })
        })
    }

    /**预览 */
    const onPriview = () => {
        form.validateFields().then((value) => {
            const uid = uuid();
            localStorage.setItem(`priview_${uid}`, JSON.stringify(value));
            window.open(`/articles/priview/${uid}`, '_blank');
        })
    }

    useEffect(() => {
        kjzdArticlePlatformListAll().then(({ data }) => {
            setPlatforms(data);
        });

        kjzdEncyclopediaCategoryListAll().then(({ data }) => {
            setCategorysSours(data)
            setCategorys(cloneDeep(data).splice(0, 20));

        });
    }, []);

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
                <div className="fs-[18px] color-[#222222]">投稿成功</div>
                <p className="fs-[14px] color-[#999999] mt-[20px] mb-[20px]">感谢您的投稿，您的投稿将在我们审核后呈现在网站上</p>
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

    return (
        <DefaultLayout>
            <Card bordered={false}>
                <Form<Article>
                    form={form}
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 21 }}
                    onFinish={onFinish}
                    initialValues={props.initArticle}
                >
                    <Form.Item
                        name={"title"}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        rules={[{ required: true, message: "请输入标题" }]}
                    >
                        <Input
                            className="fs-[28px]"
                            size={"large"}
                            bordered={false}
                            placeholder={"请输入标题"}
                            style={{ height: 70 }}
                        />
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        name={"content"}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        rules={[{ required: true, message: "请输入内容" }]}
                    >
                        {/* @ts-ignore */}
                        <IkjzdBraftEditor />
                    </Form.Item>
                    <Form.Item
                        label={"文章平台"}
                        name={"articlePlatformId"}
                        rules={[{ required: true, message: "请选择文章平台" }]}
                    >
                        <Select
                            fieldNames={{ label: "name", value: "id" }}
                            options={platforms}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"文章分类"}
                        name={"articleTagIds"}
                        rules={[{ required: true, message: "请选择文章分类" }]}
                    >
                        <TagsSelect maxLength={3}>
                            {categorys.map(({ id, name }) => (
                                <TagsSelect.Item
                                    value={id as Key}
                                    key={id}
                                >
                                    {name}
                                </TagsSelect.Item>
                            ))}
                            <p
                                onClick={onPutaway}
                                className="cursor-pointer color-[#1072c6]"
                            >
                                {putaway
                                    ? <span>收起<CaretUpOutlined /></span>
                                    : <span>展开全部<CaretDownOutlined /></span>
                                }
                            </p>
                        </TagsSelect>
                    </Form.Item>
                    <Form.Item
                        label={"封面"}
                        name={"thumbPicUrl"}
                        rules={[{ required: true, message: "请上传封面" }]}
                    >
                        <Upload listType={"picture-card"} />
                    </Form.Item>
                    <Form.Item label={"积分阅读"} name={"integralNum"}>
                        <InputNumber precision={0} />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        className={"text-center"}
                    >
                        <Space>
                            <Button
                                htmlType="submit"
                                type={"primary"}
                            >
                                提交
                            </Button>
                            <Button onClick={onPriview}>
                                预览
                            </Button>
                            <Button onClick={onDraftSave}>
                                存草稿箱
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </DefaultLayout>
    )
}

ArticlesPublishPage.getInitialProps = async (ctx) => {
    let initArticle: Article | undefined;

    if (ctx.query.id) {
        initArticle = (await kjzdArticleDraftGet(ctx.query.id as string)).data;
    }

    return {
        initArticle
    }
}

export default ArticlesPublishPage;