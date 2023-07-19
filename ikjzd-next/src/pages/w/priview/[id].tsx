import { getArticlePage } from "@/apis/article";
import { bbsPages } from "@/apis/bbs";
import { Articles, Banner, Details, HotArticle, HotCourse, HotInvitations, HotWords, WordInfo } from "@/components/encyclopedia/Details";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Article from "@/vo/Article";
import { Bbs } from "@/vo/Bbs";
import Encyclopedia from "@/vo/Encyclopedia";
import { Col, Row } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";

interface EncyclopediaPriviewPageProps {
    articles: Article[];
    hotBbs: Bbs[];
}

/**跨境百科预览 */
const EncyclopediaPriviewPage: NextPage<EncyclopediaPriviewPageProps> = ({ articles, hotBbs }) => {

    const [detail, setDetail] = useState<Encyclopedia>();
    const router = useRouter();

    useEffect(() => {
        const detail = localStorage.getItem(`priview_${router.query.id}`);
        if (!detail) return;
        setDetail(JSON.parse(detail));
    }, []);

    if (!detail) return <DefaultLayout>
        <Fragment />
    </DefaultLayout>;

    return <DefaultLayout>
        <Row gutter={[16, 16]}>
            <Col span={17}>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Details detail={detail} />
                    </Col>
                    <Col span={24}>
                        <Articles articles={articles} />
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
                        <HotWords />
                    </Col>
                    <Col span={24}>
                        <HotArticle articles={articles} />
                    </Col>
                    <Col span={24}>
                        <HotInvitations hots={hotBbs} />
                    </Col>
                    <Col span={24}>
                        <HotCourse />
                    </Col>
                </Row>
            </Col>
        </Row>
    </DefaultLayout>
}

EncyclopediaPriviewPage.getInitialProps = async () => {
    const articles = (await getArticlePage({ current: 1, size: 10 })).data.records;
    const hotBbs = (await bbsPages({ searchType: 5 })).data.records;
    return {
        articles,
        hotBbs,
    }
}

export default EncyclopediaPriviewPage;