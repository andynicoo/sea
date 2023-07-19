import { getArticlePage } from "@/apis/article";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SearchInput from "@/components/SearchInput";
import Article from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Avatar, Button, Card, Col, Empty, List, Row, Space } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import React, { Fragment, Key, useContext, useEffect, useState } from "react";
import { CommendArticles, CommendReports } from "@/pages/reports";
import { getReportPage } from "@/apis/reports";
import { Report } from "@/vo/Reports";
import Icon from "@/components/Icon";

interface InsightsIndexContextProps extends InsightsIndexPageProps {
    articles: PageSource<Article>;
    params?: PageParams;
    setParams: (params: PageParams) => void;
}

const InsightsIndexContext = React.createContext<InsightsIndexContextProps>({} as InsightsIndexContextProps);

interface InsightsIndexPageProps {
    initArticles: PageSource<Article>;
    commendReports: Report[];
    commendArticles: Article[];
}

const articleType = 2;
const auditStatus = 1;

/**行业洞察 */
const InsightsIndexPage: NextPage<InsightsIndexPageProps> = (props) => {

    const [articles, setArticles] = useState<PageSource<Article>>(props.initArticles);
    const [params, setParams] = useState<PageParams>();

    const ctxValue: InsightsIndexContextProps = {
        ...props,
        articles,
        params,
        setParams,
    }

    const onSearch = (title: string) => {
        setParams({ ...params, title, current: 1 });
    }

    const loadMore = () => {

        if (!params) return;

        const nextParams = {
            articleType,
            auditStatus,
            ...params,
        }

        getArticlePage(nextParams).then(({ data }) => {
            let nextRecords: Article[];
            if (params.current == 1) nextRecords = [...data.records];
            else nextRecords = [...articles.records, ...data.records];
            setArticles({ ...data, records: nextRecords });
        })
    }

    useEffect(loadMore, [params]);

    return (
        <InsightsIndexContext.Provider value={ctxValue}>
            <DefaultLayout>
                <h2 className="fs-[16px] fw-600 pb-[15px]">行业洞察</h2>
                <Row gutter={15}>
                    <Col span={18}>
                        <Space
                            direction={"vertical"}
                            size={15}
                            className={"w-[100%]"}
                        >
                            <SearchInput
                                size={"large"}
                                placeholder="请输入名称查询"
                                onSearch={onSearch}
                            />

                            {/* 文章列表 */}
                            <Articles />
                        </Space>
                    </Col>
                    <Col span={6}>
                        {/* 推荐文章 */}
                        <CommendArticles articles={props.commendArticles} />

                        {/* 推荐报告 */}
                        <CommendReports reports={props.commendReports} />
                    </Col>
                </Row>
            </DefaultLayout>
        </InsightsIndexContext.Provider>
    )
}

InsightsIndexPage.getInitialProps = async (ctx) => {
    const title = ctx.query.keyword as string;
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key;

    const params: PageParams = {
        current,
        size,
        articleType,
        auditStatus,
        title,
    }

    const initArticles = (await getArticlePage(params)).data;

    const reportParams: PageParams = {
        current: 1,
        size: 10,
    }

    const articlesParams: PageParams = {
        current: 1,
        size: 10,
        articleType,
        auditStatus,
    }

    /**推荐报告 */
    const commendReports = (await getReportPage(reportParams)).data.records;

    /**行业洞察 */
    const commendArticles = (await getArticlePage(articlesParams)).data.records;

    return {
        initArticles,
        commendReports,
        commendArticles,
    }
}

export default InsightsIndexPage;

/**文章列表 */
const Articles: React.FC = () => {

    const { articles, params, setParams } = useContext(InsightsIndexContext);

    const onLoadMore = () => {
        setParams({ ...params, current: Number(params?.current || 1) + 1 });
    }

    const hasMore = articles.current < articles.pages;

    const title = <p className="color-[#00000099] fs-[14px] mb-[0px]">共{articles.records.length}篇文章</p>;

    if (!articles.total) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        )
    }

    return (
        <Card bordered={false} title={title} className="card-pd0">
            <List
                dataSource={articles.records}
                renderItem={(article) => {
                    const ArticleLink: React.FC = ({ children }) => (
                        <Link
                            href={"/articles/[id]"}
                            as={`/articles/${article.id}`}
                        >
                            <a target={"_blank"}>
                                {children}
                            </a>
                        </Link>
                    )

                    const avatar = (
                        <ArticleLink>
                            <Avatar
                                src={article.thumbPicUrl}
                                shape={"square"}
                                style={{ width: 168, height: 112 }}
                            />
                        </ArticleLink>
                    )

                    const title = (
                        <ArticleLink>
                            <a className="h-[30px] block fs-[18px] color-[#000000e6] fw-600 lc-1">{article.title}</a>
                        </ArticleLink>
                    )

                    const description = (
                        <Fragment>
                            <ArticleLink>
                                <a className="lc-2 mb-[10px] color-[#00000099] h-[45px] db nohover">
                                    {article.description}
                                </a>
                            </ArticleLink>
                            <Space size={20}>
                                <span className="fs-[12px]">
                                    {article.updatedAt}
                                </span>
                                <span className="color-[#bbbbbb] fs-[12px]">
                                    <Icon type={"icon-yanjing"} className="fs-[14px]" /> {article.readNum}
                                </span>
                            </Space>
                        </Fragment>
                    )

                    return <div className="hover px-[25px] border-bottom-show"><List.Item key={article.id}>
                        <List.Item.Meta
                            avatar={avatar}
                            title={title}
                            description={description}
                        />
                    </List.Item>
                    </div>
                }}
            />
            <div className="text-center mt-[20px]">
                <Button
                    size={"large"}
                    shape={"round"}
                    onClick={onLoadMore}
                    disabled={!hasMore}
                >
                    {hasMore ? "加载更多" : "没有更多了"}
                </Button>
            </div>
        </Card>
    )
}