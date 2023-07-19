import { getArticlePage } from "@/apis/article";
import { HotArticles } from "@/components/articles/Details";
import Icon from "@/components/Icon";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Article from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Avatar, Card, Col, List, Pagination, Row, Space } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import React, { Fragment, Key, useContext } from "react";

import createEmotion from '@emotion/css/create-instance'
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-articles-index` });

interface ArticleIndexContextProps extends ArticleIndexPageProps {

}

const ArticleIndexContext = React.createContext<ArticleIndexContextProps>({} as ArticleIndexContextProps);

interface ArticleIndexPageProps {
    articles: PageSource<Article>;
    commends: Article[];
}

/**文章列表 */
const ArticleIndexPage: NextPage<ArticleIndexPageProps> = (props) => {

    const ctxValue: ArticleIndexContextProps = {
        ...props
    }

    return (
        <ArticleIndexContext.Provider value={ctxValue}>
            <DefaultLayout>
                <Row gutter={20}>
                    <Col span={18}>
                        <Articles />
                    </Col>
                    <Col span={6}>
                        <HotArticles articles={props.commends} />
                    </Col>
                </Row>
            </DefaultLayout>
        </ArticleIndexContext.Provider>
    )
}

ArticleIndexPage.getInitialProps = async (ctx) => {
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key || 20;

    const params: PageParams = {
        current,
        size,
    }

    const commendParams: PageParams = {
        current: 1,
        size: 10,
    }

    const articles = (await getArticlePage(params)).data;
    const commends = (await getArticlePage(commendParams)).data.records;
    return {
        articles,
        commends,
    }
}

export default ArticleIndexPage;

/**文章分页 */
const Articles: React.FC = () => {
    const { articles } = useContext(ArticleIndexContext);
    return (
        <Card bordered={false}>
            <List
                dataSource={articles.records}
                pagination={false}
                renderItem={(article) => {

                    const LinkUrl: React.FC<{ className?: string }> = ({ children, className }) => (
                        <Link
                            href={"/articles/[id]"}
                            as={`/articles/${article.id}`}
                        >
                            <a className={className}>{children}</a>
                        </Link>
                    )

                    const avatarCls = css`
                        width: 256px;
                        height: 150px;
                    `;

                    const avatar = (
                        <LinkUrl>
                            <Avatar
                                className={avatarCls}
                                shape={"square"}
                                src={article.thumbPicUrl}
                            />
                        </LinkUrl>
                    )

                    const title = (
                        <LinkUrl className="fw-500 fs-[20px] lc-1">
                            {article.title}
                        </LinkUrl>
                    )

                    const description = (
                        <Fragment>
                            <p className="mb-[5px] lc-3 h-[75px]">
                                {article.description}
                            </p>
                            <Space>
                                <Avatar src={article.user?.avatar} />
                                <span>{article.user?.nick}</span>
                                <Space className="ml-[20px]">
                                    <span>
                                        <Icon type={"icon-yanjing"} className={"mr-[5px]"} />
                                        {article.readNum}
                                    </span>
                                    <span>
                                        <Icon type={"icon-aixin"} className={"mr-[5px]"} />
                                        {article.praiseNum}
                                    </span>
                                </Space>
                            </Space>
                        </Fragment>
                    )

                    return (
                        <List.Item>
                            <List.Item.Meta
                                avatar={avatar}
                                title={title}
                                description={description}
                            />
                        </List.Item>
                    )
                }}
            />

            <Pagination
                className="float-right mt-[20px]"
                current={articles.current}
                total={articles.total}
                pageSize={articles.size}
                showSizeChanger={false}
                itemRender={(page, type, element) => (
                    <Link
                        href={{ query: { current: page } }}
                        scroll={false}
                    >
                        <a>{type === 'page' ? page : element}</a>
                    </Link>
                )}
            />
        </Card>
    )
}