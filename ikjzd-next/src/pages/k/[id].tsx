import { getArticlePage } from "@/apis/article";
import { bbsPages, getBbs } from "@/apis/bbs";
import { HotArticles, LikeCollection } from "@/components/articles/Details";
import Icon from "@/components/Icon";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Article from "@/vo/Article";
import { Bbs } from "@/vo/Bbs";
import { Avatar, Card, Col, Divider, Row, Space } from "antd";
import { NextPage } from "next";
import React, { Fragment, Key, useContext, useState } from "react";
import { HotBbs } from "@/pages/k";
import createEmotion from "@emotion/css/create-instance";
import QrCode from "@/components/QrCode";
import Commens from "@/components/Commens";
import AuthorInfo from "@/components/AuthorInfo";
import { Advert } from "@/vo/Basic";
import { pageAd } from "@/apis/home";
import { Adverts } from "../articles/[id]";
import SeoHead from "@/components/SeoHead";
import Cookie from "@/utils/cookie";
import { useRouter } from "next/router";

const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-k` });

interface KRoundDetailContextProps extends KRoundDetailPageProps {

}

const KRoundDetailContext = React.createContext<KRoundDetailContextProps>({} as KRoundDetailContextProps);

interface KRoundDetailPageProps {
    hots: Bbs[];
    articles: Article[];
    bbs: Bbs;
    ads2: Advert[];
}
/**k圈详情 */
const KRoundDetailPage: NextPage<KRoundDetailPageProps> = (props) => {
    const isServer = typeof window === "undefined";
    if (!isServer) {
        const isMobile = () => {
            let userAgentInfo = navigator.userAgent;
            let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
            let getArr = Agents.filter(i => userAgentInfo.includes(i));
            return getArr.length ? true : false;
        }
        const { asPath } = useRouter()
        if (isMobile() && asPath) {
            window.location.href = 'https://m.ikjzd.com' + asPath
        }
    }
    const { ads2, bbs } = props;

    const ctxValue: KRoundDetailContextProps = {
        ...props
    }

    let { title, description, seoTitle, seoKeywords, seoDescription } = bbs
    return (
        <KRoundDetailContext.Provider value={ctxValue}>
            <DefaultLayout>
                <Row gutter={20}>
                    <Col span={17}>
                        {/* 详情 */}
                        <Details />
                        {/* 评论 */}
                        <Commens type={3} />
                    </Col>
                    <Col span={7}>
                        {/* 作者 */}
                        <AuthorInfo
                            userId={bbs?.userId as Key}
                        />
                        <Adverts adverts={ads2} pageName={'K圈文章页右侧广告位'}  />
                        {/* 热门文章 */}
                        <HotArticles
                            className="mb-[20px]"
                            articles={props.articles}
                        />
                        {/* 热门帖子 */}
                        <HotBbs hots={props.hots} />
                    </Col>
                </Row>
            </DefaultLayout>
            <SeoHead
                title={seoTitle || title}
                keyword={seoKeywords}
                description={seoDescription || description}
            />
        </KRoundDetailContext.Provider>
    )
}

KRoundDetailPage.getInitialProps = async (ctx) => {
    const token = Cookie.getToken(ctx);
    const id = (ctx.query.id as string).split(".")[0];
    const hots = (await bbsPages({ searchType: 5 })).data.records;
    const articles = (await getArticlePage({ current: 1, size: 10 })).data.records;
    const bbs = (await getBbs(id, token)).data;
    /**右侧广告 */
    const ads2 = (await pageAd({ adSiteKey: "ba_dvert" })).data.records;
    return {
        hots,
        articles,
        bbs,
        ads2
    }
}

export default KRoundDetailPage;

/**详情 */
const Details: React.FC = () => {
    const { bbs } = useContext(KRoundDetailContext);
    const {
        title,
        avatar,
        author,
        createdAt,
        readNum,
        commentNum,
        content,
        id,
    } = bbs;

    const onShare = () => {
        QrCode.modal({
            content: `${window.location.origin}/k/${id}`
        })
    }
    const [article, setArticle] = useState(bbs);
    const { isPraise, praiseNum, isCollection, collectNum } = article;
    const Title: React.FC = () => (
        <Fragment>
            <h1 className="fs-[28px] color-[#1d1d1d] mb-[20px]">{title}</h1>
            <Space className="mb-[20px] color-[#bbbbbb]" size={20}>
                <Avatar src={avatar} size={30} />
                <span className="color-[#1d1d1d]">{author}</span>
                <span>{createdAt}</span>
                <span className="color-[#999999]  fs-[12px]">
                    <Icon
                        type={"icon-yanjing"}
                        className="mr-[5px] fs-[16px]"
                    />
                    {readNum}
                </span>
                <LikeCollection
                    isPraise={isPraise}
                    praiseNum={praiseNum}
                    isCollection={isCollection}
                    collectNum={collectNum as number}
                    otherId={article.id}
                    position={"top"}
                    type={3}
                    onChange={(value) => setArticle({ ...article, ...value })}
                />
                <span className="color-[#999999]  fs-[12px]">
                    <a href="#commenList"><Icon
                        type={"icon-pinglun"}
                        className="mr-[5px] fs-[16px]"
                    />
                        {commentNum || 0}
                    </a>
                </span>
            </Space>
        </Fragment>
    )

    return (
        <Card bordered={false} className={"mb-[20px]"}>
            <Title />
            <div
                dangerouslySetInnerHTML={{ __html: content }}
                className="rich-text"
            />
            <div className="text-center my-[40px]">
                <Space size={20}>
                    <LikeCollection
                        isPraise={isPraise}
                        praiseNum={praiseNum}
                        isCollection={isCollection}
                        collectNum={collectNum as number}
                        otherId={article.id}
                        type={3}
                        onChange={(value) => setArticle({ ...article, ...value })}
                    />
                </Space>
            </div>
            <p className="text-right color-[#bbbbbb]">
                <span>
                    评论
                    <Icon type={"icon-pinglun"} className={"ml-[5px] mr-[5px] fs-[16px]"} />
                    {commentNum || 0}
                </span>
                <Divider
                    type={"vertical"}
                    className={"mx-[20px]"}
                />
                <a className={"color-[#bbbbbb]"} onClick={onShare}>
                    分享至
                    <Icon type={"icon-logo-wechat"} className={"ml-[5px]"} />
                </a>
            </p>
        </Card>
    )
}
