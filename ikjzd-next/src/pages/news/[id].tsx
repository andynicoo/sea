import { getArticlePage } from "@/apis/article";
import { getNews, getNewsHot } from "@/apis/home";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { PageParams } from "@/vo/PageParams";
import { Card, Col, Row } from "antd";
import { NextPage } from "next";
import React, { Fragment, Key, useContext } from "react";
import { HotArticle, TopRanking } from "@/pages/news";
import Article from "@/vo/Article";
import { News } from "@/vo/Basic";
import Icon from "@/components/Icon";
import QrCode from "@/components/QrCode";
import { useRouter } from "next/router";

import createEmotion from "@emotion/css/create-instance";
import moment from "moment";
import Link from "next/link";
import SeoHead from "@/components/SeoHead";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-news-id` });

interface NewsDetailContextProps extends NewsDetailPageProps {

}

const NewsDetailContext = React.createContext<NewsDetailContextProps>({} as NewsDetailContextProps)

interface NewsDetailPageProps {
    articles: Article[];
    hots: News[];
    news: News;
}

const NewsDetailPage: NextPage<NewsDetailPageProps> = (props) => {

    const ctxValue: NewsDetailContextProps = {
        ...props
    }
    let { seoTitle, seoKeywords, seoDescription } = props.news;
    return (
        <NewsDetailContext.Provider value={ctxValue}>
            <SeoHead
                title={seoTitle}
                description={seoDescription}
                keyword={seoKeywords}
            />
            <DefaultLayout>
                <Row gutter={20}>
                    <Col span={18}>
                        {/* 详情 */}
                        <Details />
                        {/* 上一篇下一篇 */}
                        <NextAndPrefix />
                    </Col>
                    <Col span={6}>
                        {/* 72小时快讯 */}
                        <TopRanking news={props.hots} />
                        {/* 热门文章 */}
                        <HotArticle articles={props.articles} />
                    </Col>
                </Row>
            </DefaultLayout>
        </NewsDetailContext.Provider>
    )
}

NewsDetailPage.getInitialProps = async (ctx) => {

    const articlesParams: PageParams = {
        current: 1,
        size: 10,
    }

    const articles = (await getArticlePage(articlesParams)).data.records;
    const hots = (await getNewsHot()).data;
    const id = (ctx.query.id as string).split(".")[0];
    const news = (await getNews(id)).data;

    return {
        articles,
        hots: hots.splice(0, 5),
        news,
    }
}

export default NewsDetailPage;

/**详情 */
const Details: React.FC = () => {
    const { news } = useContext(NewsDetailContext);

    const { query } = useRouter();

    const showQrCode = () => {
        QrCode.modal({
            content: window.location.href,
            width: 200,
        })
    }

    return (
        <Card bordered={false}>
            <h1 className="fs-[20px] color-[#000000e6] fw-500 mb-[20px]">{news.title}</h1>
            <p className="color-[#bbbbbb] flex row-center colume-between mb-[20px]">
                <span>
                    {news.createdAt}
                </span>
                <a className="flex row-center color-[#bbbbbb]" onClick={showQrCode}>
                    <span className="mr-[10px]">分享至</span>
                    <Icon
                        className="fs-[30px] ml-[5px]"
                        type={"icon-logo-wechat"}
                    />
                </a>
            </p>
            <div
                dangerouslySetInnerHTML={{ __html: news.content }}
                className="rich-text"
            />
        </Card>
    )
}

const NextAndPrefix: React.FC = () => {

    const { news } = useContext(NewsDetailContext);

    const { prefixId, prefixDate, prefixName, nextId, nextDate, nextName } = news;

    const borderCls = css`
        border-top: 3px solid ${process.env.PRIMARY_COLOR};
    `;

    const lineCls = css`
        position: relative;
        margin-bottom: 20px;

        &::after {
            content: "";
            display: block;
            width: 24px;
            height: 2px;
            background-color: #bbbbbb;
            position: absolute;
            left: 0;
            bottom: -12px;
        }
    `;

    const FMT = "YYYY-MM-DD";

    /**上一篇 */
    const PrefixPage: React.FC = () => {
        if (!prefixId) return <Fragment />;
        return (
            <Card bordered={false} className={cx("br-a-[0px]", borderCls)}>
                <div className={cx(
                    "flex",
                    "row-center",
                    "colume-between",
                    lineCls,
                )}>
                    <Link href={"/news/[id]"} as={`/news/${prefixId}`}>
                        <a className="fs-[20px] color-[#000000e6]">上一篇</a>
                    </Link>
                    <span className="fs-[12px] color-[#bbbbbb]">
                        {moment(prefixDate).format(FMT)}
                    </span>
                </div>
                <Link href={"/news/[id]"} as={`/news/${prefixId}`}>
                    <a className="fs-[16px] color-[#34374c] lc-2 h-[50px]">
                        {prefixName}
                    </a>
                </Link>
            </Card>
        )
    }

    /**下一篇 */
    const NextPage: React.FC = () => {
        if (!nextId) return <Fragment />;
        return (
            <Card bordered={false} className={cx("br-a-[0px]", borderCls)}>
                <div className={cx(
                    "flex",
                    "row-center",
                    "colume-between",
                    lineCls,
                )}>
                    <Link href={"/news/[id]"} as={`/news/${nextId}`}>
                        <a className="fs-[20px] color-[#000000e6]">下一篇</a>
                    </Link>
                    <span className="fs-[12px] color-[#bbbbbb]">
                        {moment(nextDate).format(FMT)}
                    </span>
                </div>
                <Link href={"/news/[id]"} as={`/news/${nextId}`}>
                    <a className="fs-[16px] color-[#34374c] lc-2 h-[50px]">
                        {nextName}
                    </a>
                </Link>
            </Card>
        )
    }

    return (
        <Row gutter={20} className={"mt-[20px]"}>
            <Col span={12}>
                <PrefixPage />
            </Col>
            <Col span={12}>
                <NextPage />
            </Col>
        </Row>
    )
}