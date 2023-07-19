import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Col, Row } from "antd";
import { NextPage } from "next";
import React, { Fragment, Key } from "react";
import { CustomNextPageContext } from "@/pages/_app";
import { getArticleDetail, getArticlePage, getCommendArticlePage } from "@/apis/article";
import {
    ArticleDetailsContent,
    ArticleDetailsContext,
    ArticleDetailsPageProps,
    HotArticles,
    RecommendedArticle,
} from "@/components/articles/Details";
import { PageParams } from "@/vo/PageParams";
import Commens from "@/components/Commens";
import { pageAd } from "@/apis/home";
import { Advert } from "@/vo/Basic";
import { HotInvitations } from "@/components/encyclopedia/Details";
import { bbsPages } from "@/apis/bbs";
import { Bbs } from "@/vo/Bbs";
import { HotTools } from "@/pages/tl";
import { kjzdToolsListAll } from "@/apis/tools";
import { Tools } from "@/vo/Tools";
import AuthorInfo from "@/components/AuthorInfo";
import Cookie from "@/utils/cookie";
import SeoHead from "@/components/SeoHead";
import { useRouter } from "next/router";
import { bannerClick } from "@/utils/shenCe";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";

interface ArticleDetailsProps extends ArticleDetailsPageProps {
    ads1: Advert[];
    ads2: Advert[];
    hotBbs: Bbs[];
    tools: Tools[];
}

/** 文章详情页面 */
const ArticleDetailsPage: NextPage<ArticleDetailsProps> = (props) => {
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
            location.replace(`https://m.ikjzd.com${asPath}`);
        }
    }
    const { commends, ads1, ads2, hotBbs, article } = props;

    // let { seoTitle, seoKeywords, seoDescription } = article;

    const ctxValue: ArticleDetailsProps = {
        ...props,
    };

    return (
        <Fragment>
            <ArticleDetailsContext.Provider value={ctxValue}>
                <DefaultLayout>
                    <Row gutter={[16, 16]}>
                        <Col span={17}>
                            {/* <ArticleDetailsContent /> */}
                            {article ? <ArticleDetailsContent /> : ''}
                            <Adverts adverts={ads1} pageName={'文章页底部广告位'} />
                            <RecommendedArticle articles={commends} />
                            <Commens type={1} />
                        </Col>
                        <Col span={7}>
                            <AuthorInfo
                                userId={article?article.user?.userId as Key:''}
                            />
                            <Adverts adverts={ads2} pageName={'文章页右边栏广告位'}  />
                            <HotTools tools={props.tools} />
                            <HotArticles articles={props.commends} />
                            {/* <HotCourses /> */}
                            <HotInvitations hots={hotBbs} />
                        </Col>
                    </Row>
                </DefaultLayout>
            </ArticleDetailsContext.Provider>
            <SeoHead
                title={article?article.seoTitle:''}
                description={article?article.seoDescription:''}
                keyword={article?article.seoKeywords:''}
            />
        </Fragment>
    );
};

ArticleDetailsPage.getInitialProps = async (ctx: CustomNextPageContext) => {
    const id = (ctx.query.id as string).split(".")[0];
    const token = Cookie.getToken(ctx);
    const article = (await getArticleDetail(id, token)).data;

    const commendParams = {
        articlePlatformId: article?article.articlePlatformId as string:'',
        articleTagId: article?article.articleTagIds && article.articleTagIds[0]:undefined,
    }

    const commends = (await getCommendArticlePage(commendParams)).data;
    const hotBbs = (await bbsPages({ searchType: 5 })).data.records;
    /**下侧广告 */
    const ads1 = (await pageAd({ adSiteKey: "ad_article_banner" })).data.records;
    /**右侧广告 */
    const ads2 = (await pageAd({ adSiteKey: "ba_dvert" })).data.records;
    /**热门工具 */
    const tools = (
        await kjzdToolsListAll({ current: 1, size: 10, searchType: 5 })
    ).data.records;

    return {
        article,
        commends,
        ads1,
        ads2,
        hotBbs,
        tools,
    };
};

export default ArticleDetailsPage;



export const Adverts: React.FC<{ adverts: Advert[]; pageName?: string  }> = ({ adverts, pageName = '-'}) => {
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    return (
        <Fragment>
            {adverts.map((advert) => (
                <a
                    target={"_blank"}
                    href={advert.url}
                    key={advert.id}
                    className={"mb-[10px] block"}
                    onClick={()=>bannerClick({
                        bannerID: advert.id, bannerName: advert.adSiteName, pageName: pageName,userId: userInfo?.userId || '',mobile:userInfo?.mobile || ''
                    })}
                >
                    <img src={advert.picUrl} className={"w-[100%]"} />
                </a>
            ))}
        </Fragment>
    )
};
