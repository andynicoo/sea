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

interface ArticleDetailsProps extends ArticleDetailsPageProps {
    ads1: Advert[];
    ads2: Advert[];
    hotBbs: Bbs[];
    tools: Tools[];
}

/** 文章详情页面 */
const ArticleDetailsPage: NextPage<ArticleDetailsProps> = (props) => {
    const { commends, ads1, ads2, hotBbs, article } = props;

    let { seoTitle, seoKeywords, seoDescription } = article;

    const ctxValue: ArticleDetailsProps = {
        ...props,
    };

    return (
        <Fragment>
            <ArticleDetailsContext.Provider value={ctxValue}>
                <DefaultLayout>
                    <Row gutter={[16, 16]}>
                        <Col span={17}>
                            <ArticleDetailsContent />
                            <Adverts adverts={ads1} />
                            <RecommendedArticle articles={commends} />
                            <Commens type={1} />
                        </Col>
                        <Col span={7}>
                            <AuthorInfo
                                userId={article.user?.userId as Key}
                            />
                            <Adverts adverts={ads2} />
                            <HotTools tools={props.tools} />
                            <HotArticles articles={props.commends} />
                            {/* <HotCourses /> */}
                            <HotInvitations hots={hotBbs} />
                        </Col>
                    </Row>
                </DefaultLayout>
            </ArticleDetailsContext.Provider>
            <SeoHead
                title={seoTitle}
                description={seoDescription}
                keyword={seoKeywords}
            />
        </Fragment>
    );
};

ArticleDetailsPage.getInitialProps = async (ctx: CustomNextPageContext) => {
    const id = ctx.query.id as string;
    const token = Cookie.getToken(ctx);
    const article = (await getArticleDetail(id, token)).data;

    const commendParams = {
        articlePlatformId: article.articlePlatformId as string,
        articleTagId: article.articleTagIds && article.articleTagIds[0],
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

export const Adverts: React.FC<{ adverts: Advert[] }> = ({ adverts }) => (
    <Fragment>
        {adverts.map((advert) => (
            <a
                target={"_blank"}
                href={advert.url}
                key={advert.id}
                className={"mb-[10px] block"}
            >
                <img src={advert.picUrl} className={"w-[100%]"} />
            </a>
        ))}
    </Fragment>
);
