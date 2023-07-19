import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Col, Row } from "antd";
import { NextPage } from "next";
import React from "react";
import { CustomNextPageContext } from "@/pages/_app";
import { StoreDetailsContent, StoreDetailsContextProps, StoreDetailsContext, RecommendedArticle } from "@/components/stores/Details";
import { investmentGetPage, shopDetail } from "@/apis/stores";
import { PageParams } from "@/vo/PageParams";
import { getArticlePage } from "@/apis/article";
import SeoHead from "@/components/SeoHead";
import { HotArticles } from "@/components/articles/Details";

/** 文章详情页面 */
const StoreDetailsPage: NextPage<StoreDetailsContextProps> = (props) => {

    const ctxValue: StoreDetailsContextProps = {
        ...props
    }

    return <DefaultLayout>
        <StoreDetailsContext.Provider value={ctxValue}>
            <SeoHead title={props.article.seoTitle} keyword={props.article.seoKeywords} description={props.article.description} />
            <Row gutter={[16, 16]}>
                <Col span={17}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <StoreDetailsContent />
                        </Col>
                    </Row>
                </Col>
                <Col span={7}>
                    <Row gutter={[16, 16]}>

                        <Col span={24}>
                            {/* 热门文章 */}
                            <HotArticles articles={props?.commends as []} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </StoreDetailsContext.Provider>
    </DefaultLayout>
}

StoreDetailsPage.getInitialProps = async (ctx: CustomNextPageContext) => {
    const id = (ctx.query.id as string).split(".")[0];
    /**文章参数 */
    const articlesParams: PageParams = {
        current: 1,
        size: 10,
        articlePlatformId: id
    };
    /**热门文章 */
    const commendParams: PageParams = {
        current: 1,
        size: 10,
    }
    const article = (await shopDetail('id=' + id)).data;
    const InvestmentArticles = (await investmentGetPage({
        current: 1,
        size: 100,
    })).data.records;
    const RelatedArticles = (await getArticlePage(articlesParams)).data.records;
    const commends = (await getArticlePage(commendParams)).data.records;
    return {
        article,
        InvestmentArticles,
        RelatedArticles,
        commends
    }
}

export default StoreDetailsPage;