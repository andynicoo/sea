import DefaultLayout from "@/components/layouts/DefaultLayout";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { ArticleDetails } from "@/vo/Article";
import { ArticleDetailsContent, ArticleDetailsContext, ArticleDetailsContextProps } from "@/components/articles/Details";
import { Col, Row } from "antd";
import { NextPage } from "next";
import { HotInvitations } from "@/components/encyclopedia/Details";
import { bbsPages } from "@/apis/bbs";
import { Bbs } from "@/vo/Bbs";
import { kjzdToolsListAll } from "@/apis/tools";
import { Tools } from "@/vo/Tools";
import { HotTools } from "@/pages/tl";

interface ArticlesPriviewProps {
    hotBbs: Bbs[];
    tools: Tools[];
}

/**文章预览 */
const ArticlesPriview: NextPage<ArticlesPriviewProps> = ({ hotBbs, tools }) => {

    const router = useRouter();

    const [article, setArticle] = useState<ArticleDetails>();

    useEffect(() => {
        const article = localStorage.getItem(`priview_${router.query.id}`);
        if (!article) return;
        setArticle(JSON.parse(article));
    }, []);

    if (!article) return <Fragment />;

    const ctxValue: ArticleDetailsContextProps = {
        article,
        commends: []
    }

    return <DefaultLayout>
        <ArticleDetailsContext.Provider value={ctxValue}>
            <Row gutter={[16, 16]}>
                <Col span={17}>
                    <ArticleDetailsContent />
                </Col>
                <Col span={7}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <HotTools tools={tools} />
                        </Col>
                        <Col span={24}>
                            <HotInvitations hots={hotBbs} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ArticleDetailsContext.Provider>
    </DefaultLayout>
}

ArticlesPriview.getInitialProps = async () => {
    const hotBbs = (await bbsPages({ searchType: 5 })).data.records;
    const tools = (await kjzdToolsListAll({ current: 1, size: 10, searchType: 5 })).data.records;
    return {
        hotBbs,
        tools,
    }
}


export default ArticlesPriview;