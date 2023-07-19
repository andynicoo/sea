import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Col, Row } from "antd";
import { NextPage } from "next";
import React from "react";
import {
    getEncyclopediaEncyclopediaDetail,
    getEncyclopediaHots,
    getEncyclopediaSource,
} from "@/apis/encyclopedia";
import Encyclopedia, {
    EncyclopediaCategory,
    EncyclopediaHot,
} from "@/vo/Encyclopedia";
import { CustomNextPageContext } from "@/pages/_app";
import { getArticlePage } from "@/apis/article";
import ArticleVo from "@/vo/Article";
import {
    Articles,
    Banner,
    Details,
    HotArticle,
    HotInvitations,
    WordInfo,
    WordTabs,
} from "@/components/encyclopedia/Details";
import { HotWords } from "@/pages/w";
import { bbsPages } from "@/apis/bbs";
import { Bbs } from "@/vo/Bbs";
import SeoHead from "@/components/SeoHead";
import Cookie from "@/utils/cookie";
import { useRouter } from "next/router";
import { pageAd } from "@/apis/home";
import { Advert } from "@/vo/Basic";
import { Adverts } from "../../articles/[id]";

interface EncyclopediaDetailProps {
    /**百科详情 */
    detail: Encyclopedia;
    /**感兴趣的文章 */
    articles: ArticleVo[];
    /**热门词条 */
    hots: EncyclopediaCategory[];
    /**热门帖子 */
    hotBbs: Bbs[];
    /**热门词条 */
    hotWords: EncyclopediaHot[];
    /**最新词条 */
    news: EncyclopediaCategory[];
    /**最新词条 */
    ads1:Advert[];
}

/**跨境百科详情 */
const EncyclopediaDetail: NextPage<EncyclopediaDetailProps> = ({
    detail,
    articles,
    hots,
    hotBbs,
    hotWords,
    news,
    ads1
}) => {
    let { seoDescription, seoKeywords, seoTitle, title } = detail;
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
    return (
        <div>
            <DefaultLayout>
                <Row gutter={[16, 16]}>
                    <Col span={17}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Details detail={detail} />
                            </Col>
                            <Col span={24}>
                                <Adverts adverts={ads1} pageName={'百科详情下方广告位'} />
                            </Col>
                            <Col span={24}>
                                <Articles articles={articles} />
                            </Col>
                            <Col span={24}>
                                <WordTabs hots={hotWords} news={news} />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={7}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Banner src={detail.thumbUrl} />
                            </Col>
                            <Col span={24}>
                                <WordInfo detail={detail} />
                            </Col>
                            <Col span={24}>
                                <HotWords hots={hots} />
                            </Col>
                            <Col span={24}>
                                <HotArticle articles={articles} />
                            </Col>
                            <Col span={24}>
                                <HotInvitations hots={hotBbs} />
                            </Col>
                            {/* 热门课程 */}
                            {/* <Col span={24}>
                        <HotCourse />
                    </Col> */}
                        </Row>
                    </Col>
                </Row>
            </DefaultLayout>
            <SeoHead title={seoTitle || title} description={seoDescription} keyword={seoKeywords} />
        </div>
    );
};

EncyclopediaDetail.getInitialProps = async (ctx: CustomNextPageContext) => {
    const detail = (
        await getEncyclopediaEncyclopediaDetail((ctx.query.id as string).split(".")[0])
    ).data;
    const articles = (await getArticlePage({ current: 1, size: 10 })).data
        .records;
    const hots = (
        await getEncyclopediaSource({
            current: 1,
            size: 10,
            order: "DESC",
            sort: "read_num",
        })
    ).data.records;
    const hotBbs = (await bbsPages({ searchType: 5 })).data.records;
    const hotWords = (await getEncyclopediaHots()).data;
    const news = (
        await getEncyclopediaSource({
            current: 1,
            size: 10,
            order: "DESC",
            sort: "created_at",
        })
    ).data.records;
    const ads1 = (await pageAd({ adSiteKey: "ad_wiki_banner" })).data.records;
    return {
        detail,
        articles,
        hots,
        hotBbs,
        hotWords,
        news,
        ads1
    };
};

export default EncyclopediaDetail;
