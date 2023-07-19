import { getArticlePage } from "@/apis/article";
import { getNewsHot, getNewsPage } from "@/apis/home";
import HotArticleComponent from "@/components/encyclopedia/HotArticle";
import Icon from "@/components/Icon";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import QrCode from "@/components/QrCode";
import Article from "@/vo/Article";
import { News } from "@/vo/Basic";
import { PageParams, PageSource } from "@/vo/PageParams";
import createEmotion from "@emotion/css/create-instance";
import { Button, Card, Col, List, Row } from "antd";
import { debounce, groupBy, range } from "lodash";
import moment from "moment";
import { NextPage } from "next";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";

const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-news` });

interface NewsIndexContextProps extends NewsIndexPageProps {

}

const NewsIndexContext = React.createContext<NewsIndexContextProps>({} as NewsIndexContextProps);

interface NewsIndexPageProps {
    news: PageSource<News>;
    articles: Article[];
    hots: News[];
}

/**24小时快讯 */
const NewsIndexPage: NextPage<NewsIndexPageProps> = (props) => {

    const ctxValue: NewsIndexContextProps = {
        ...props
    }

    return (
        <NewsIndexContext.Provider value={ctxValue}>
            <DefaultLayout>
                <Row gutter={20}>
                    <Col span={18}>
                        <DataSources />
                    </Col>
                    <Col span={6}>
                        {/* 72小时热榜 */}
                        <TopRanking news={props.hots} />
                        {/* 热门文章 */}
                        <HotArticle articles={props.articles} />
                    </Col>
                </Row>
            </DefaultLayout>
        </NewsIndexContext.Provider>
    )
}

/**热门文章 */
export const HotArticle: React.FC<{ articles: Article[] }> = (props) => {
    const { articles } = props;
    return <Card bordered={false} title={"热门文章"}>
        {articles.map((article, index) => (
            <Link
                href={`/articles/[id]`}
                as={`/articles/${article.id}`}
                key={article.id}
            >
                <a className="py-[10px] block" target={"_blank"}>
                    <HotArticleComponent
                        {...article}
                        thumbPicUrl={index === 0 ? article.thumbPicUrl : ""}
                        index={index + 1}
                    />
                </a>
            </Link>
        ))}
    </Card>
}

NewsIndexPage.getInitialProps = async () => {

    const params: PageParams = {
        current: 1,
        size: 10,
    }

    const articlesParams: PageParams = {
        current: 1,
        size: 10,
    }

    const news = (await getNewsPage(params)).data;
    const articles = (await getArticlePage(articlesParams)).data.records;
    const hots = (await getNewsHot()).data;

    return {
        news,
        articles,
        hots: hots.splice(0, 5),
    }
}

export default NewsIndexPage;

interface NextNews extends News {
    time: string
}

const DataSources: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const ctx = useContext(NewsIndexContext);
    const news = useRef<News[]>(ctx.news.records);
    const current = useRef<number>(ctx.news.current);
    const pages = useRef<number>(ctx.news.pages);

    const hasNext = current.current >= pages.current;

    /**格式化日期后分组 */
    const _news_: NextNews[] = news.current.map((news) => {
        const time = moment(news.createdAt).format("YYYY-MM-DD");
        return { ...news, time };
    });

    const newsGroup = groupBy(_news_, "time");
    /**加载下一页 */
    const loadNextPage = () => {
        if (hasNext) return;
        setLoading(true);
        getNewsPage({
            current: current.current + 1,
            size: 10,
        }).then((res) => {
            news.current = [...news.current, ...res.data.records];
            current.current = res.data.current;
            pages.current = res.data.pages;
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleLoad = debounce(() => {
        const __next = document.getElementById("__next");
        if (!__next) return;
        const { top, height } = __next.getBoundingClientRect();
        const d = (height - Math.abs(top))
        if (d < 1350) loadNextPage();
    }, 100)

    useEffect(() => {
        document.addEventListener("scroll", handleLoad);
    }, []);

    return (
        <Card bordered={false} className={"mb-[20px]"}>
            <h1 className="fs-[28px] color-[#1d1d1d]">
                24小时快讯
            </h1>
            {Object.keys(newsGroup).map((key) => (
                <NewsGroup
                    news={newsGroup[key]}
                    time={key}
                    key={key}
                />
            ))}
            <div className="text-center mt-[20px]">
                <Button
                    shape={"round"}
                    size={"large"}
                    loading={loading}
                    disabled={hasNext}
                    onClick={loadNextPage}
                    className='w-[160px]'
                >
                    {hasNext ? "没有更多了" : "加载更多..."}
                </Button>
            </div>
        </Card>
    )
}

/**72小时热榜 */
export const TopRanking: React.FC<{ news: News[] }> = ({ news }) => {
    return (
        <Card title={"72小时热榜"} bordered={false} className={"mb-[20px]"}>
            <List
                dataSource={news}
                renderItem={(news, index) => {
                    return (
                        <List.Item>
                            <Link href={"/news/[id]"} as={`/news/${news.id}`}>
                                <a className="flex row-center color-[#333333]" target={'_blank'}>
                                    <span className={cx(
                                        "block",
                                        "wh-[18px]",
                                        "fh-[18px]",
                                        "text-center",
                                        "color-[#ffffff]",
                                        "br-a-[1px]",
                                        "mr-[10px]",
                                        index < 3 ? "bg-color-[#f676a6]" : "bg-color-[#b7b7b7]"
                                    )}>
                                        {index + 1}
                                    </span>
                                    <span className="w-[200px] lc-1">
                                        {news.title}
                                    </span>
                                </a>
                            </Link>
                        </List.Item>
                    )
                }}
            />
        </Card>
    )
}

const NewsGroup: React.FC<{ news: NextNews[]; time: string }> = ({ news, time }) => {

    const [year, month, day] = time.split("-");

    return (
        <Row>
            <Col span={2}>
                <div
                    className={cx(
                        "mt-[30px]",
                        "w-[45px]",
                        "h-[30px]",
                        "bg-color-[#fff1f6]",
                        "color-[#f676a6]",
                        "pt-[6px]",
                        "fh-[24px]",
                        "text-center",
                    )}
                >
                    {month}月
                </div>
                <div className={cx(
                    "w-[45px]",
                    "h-[30px]",
                    "bg-color-[#f676a6]",
                    "color-[#ffffff]",
                    "text-center",
                    "fh-[30px]",
                    "fs-[18px]",
                )}>
                    {day}
                </div>
            </Col>
            <Col span={22}>
                {news.map((item) => (
                    <NewsItem {...item} key={item.id} />
                ))}
            </Col>
        </Row>
    )
}

const NewsItem: React.FC<NextNews> = (props) => {
    const { title, description, time, id } = props;

    const clx = css`
        border-bottom: 1px solid #eee;
    `;

    const showQrCode = () => {
        const href = `${window.location.href}/${id}`;
        QrCode.modal({
            content: href,
            width: 200,
        })
    }

    return (
        <div className={cx(clx, "py-[30px]")}>
            <Link href={"/news/[id]"} as={`/news/${id}`}>
                <a target={'_blank'}>
                    <h3 className="fs-[20px] color-[#1d1d1d] fw-600 lc-2 mb-[10px]">
                        {title}
                    </h3>
                </a>
            </Link>
            <div className="fs-[12px] color-[#bbbbbb] flex row-center mb-[10px]">
                {time}
                <a
                    className="ml-[10px] flex row-center color-[#bbbbbb]"
                    onClick={showQrCode}
                >
                    分享至
                    <Icon className="fs-[20px] ml-[10px]" type={"icon-logo-wechat"} />
                </a>
            </div>
            {description && (
                <Link href={"/news/[id]"} as={`/news/${id}`}>
                    <a className="fs-[14px] color-[#999999] fh-[24px] mt-[15px] nohover" target={'_blank'}>
                        {description}
                    </a>
                </Link>
            )}
        </div>
    )
}