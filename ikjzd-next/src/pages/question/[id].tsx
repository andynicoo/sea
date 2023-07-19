import DefaultLayout from "@/components/layouts/DefaultLayout";
import {
    Avatar,
    Button,
    Card,
    Col,
    Empty,
    List,
    Pagination,
    Row,
    Space,
} from "antd";
import { NextPage } from "next";
import React, { Key, useContext, useState } from "react";
import { CommendArticles, CommendReports } from "@/pages/reports";
import Adviser from "@/components/Adviser";
import { getNewQuestionPage, getQuestion } from "@/apis/question";
import { Question } from "@/vo/Question";
import { PageParams, PageSource } from "@/vo/PageParams";
import { getReportPage } from "@/apis/reports";
import { getArticlePage } from "@/apis/article";
import { Report } from "@/vo/Reports";
import Article from "@/vo/Article";
import { LikeCollectionBW, QuestionItem } from "@/pages/question";
import Link from "next/link";
import SeoHead from "@/components/SeoHead";

import createEmotion from "@emotion/css/create-instance";
import Cookie from "@/utils/cookie";
const { css } = createEmotion({
    key: `${process.env.CLASS_PREFIX}-pg-platform-index`,
});

interface QuestionIndexDetailContextProps
    extends QuestionIndexDetailPageProps { }

const QuestionIndexDetailContext =
    React.createContext<QuestionIndexDetailContextProps>(
        {} as QuestionIndexDetailContextProps
    );

interface QuestionIndexDetailPageProps {
    question: Question;
    reports: Report[];
    articles: Article[];
    questions: PageSource<Question>;
}

/**出海百问详情 */
const QuestionIndexDetailPage: NextPage<QuestionIndexDetailPageProps> = (props) => {
    const ctxValue: QuestionIndexDetailContextProps = {
        ...props,
    };

    const { seoKeywords, seoTitle, seoDescribe } = props.question;
    return (
        <QuestionIndexDetailContext.Provider value={ctxValue}>
            <DefaultLayout>
                <DetailsCard />

                <div className={labelCls}>最新百问</div>

                <Row gutter={15}>
                    <Col span={18}>
                        {/* 分页数据 */}
                        <DataSources />
                    </Col>
                    <Col span={6}>
                        <Space direction={"vertical"} size={15} className={"w-[100%]"}>
                            {/* 咨询 */}
                            <Adviser.Card />

                            {/* 推荐报告 */}
                            <CommendReports reports={props.reports} />

                            {/* 推荐洞察 */}
                            <CommendArticles articles={props.articles} />
                        </Space>
                    </Col>
                </Row>
            </DefaultLayout>
            <SeoHead title={seoTitle} keyword={seoKeywords} description={seoDescribe} />
        </QuestionIndexDetailContext.Provider>
    );
};

QuestionIndexDetailPage.getInitialProps = async (ctx) => {
    const id = ctx.query.id as Key;
    const token = Cookie.getToken(ctx);
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key;

    const question = (await getQuestion(id, token)).data;

    const reportParams: PageParams = {
        current: 1,
        size: 10,
    };

    const articlesParams: PageParams = {
        current: 1,
        size: 10,
    };

    /**推荐报告 */
    const reports = (await getReportPage(reportParams)).data.records;

    /**行业洞察 */
    const articles = (await getArticlePage(articlesParams)).data.records;

    const params: PageParams = {
        current,
        size,
    };

    /**获取最新百问列表 */
    const questions = (await getNewQuestionPage(params, token)).data;
    return {
        question,
        reports,
        articles,
        questions,
    };
};

export default QuestionIndexDetailPage;

const DetailsCard: React.FC = () => {
    const { question } = useContext(QuestionIndexDetailContext);
    const [article, setArticle] = useState(question);
    const { isPraise, praiseNum, isCollection, collectNum } = article;
    return (
        <Card bordered={false}>
            <h1 className="fs-[24px] fw-600">{question.name}</h1>
            <p className="mt-[12px] mb-[15px]">
                <Avatar size={40} className="mr-[10px]" src={question.authorAvatar} />
                <span>{question.authorName || question.author}</span>
            </p>
            <div
                className={"rich-text mb-[55px]"}
                dangerouslySetInnerHTML={{ __html: question.details as string }}
            />
            <p className="ma-[0px] color-[#00000066]">
                <span>{question.createTime}</span>
                <Space size={20} className={"float-right"}>
                    <LikeCollectionBW
                        isPraise={isPraise}
                        praiseNum={praiseNum}
                        isCollection={isCollection}
                        collectNum={collectNum}
                        otherId={article.id}
                        position="detail"
                        onChange={(value) => setArticle({ ...article, ...value })}
                    />
                </Space>
            </p>
        </Card>
    );
};

const labelCls = css`
  height: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 24px;
  margin: 20px 0;
  position: relative;
  padding-left: 10px;

  &::before {
    content: "";
    height: 16px;
    width: 2px;
    display: block;
    background-color: ${process.env.PRIMARY_COLOR};
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`;

/**分页数据 */
const DataSources: React.FC = () => {
    const { questions } = useContext(QuestionIndexDetailContext);

    if (!questions.total) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        );
    }

    return (
        <Card bordered={false} size={"small"}>
            <List>
                {questions.records.map((question) => {
                    return (
                        <List.Item key={question.id}>
                            <QuestionItem {...question} />
                        </List.Item>
                    );
                })}
            </List>
            <Pagination
                className="float-right mt-[30px]"
                current={questions.current}
                total={questions.total}
                pageSize={questions.size}
                showSizeChanger={false}
                itemRender={(page, type, element) => (
                    <Link href={{ query: { current: page } }}>
                        <a>{type === 'page' ? page : element}</a>
                    </Link>
                )}
            />
        </Card>
    );
};
