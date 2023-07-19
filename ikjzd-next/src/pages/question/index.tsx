import { getQuestionPage, getQuestionCategory } from "@/apis/question";
import Adviser from "@/components/Adviser";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Question as QuestionVo, QuestionCategory } from "@/vo/Question";
import { Avatar, Button, Card, Col, Empty, List, message, Pagination, Row, Space } from "antd";
import { find, take } from "lodash";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, Key, useContext, useState } from "react";
import Icon from "@/components/Icon";
import { getArticlePage } from "@/apis/article";
import Article from "@/vo/Article";
import { CommendArticles, CommendReports } from "../reports";
import { getReportPage } from "@/apis/reports";
import { Report } from "@/vo/Reports";

import createEmotion from "@emotion/css/create-instance";
import Authorization from "@/components/Authorization";
import { operateCollect, operateCollectCancel, operatePraise, operatePraiseCancel } from "@/apis/public";
import Cookie from "@/utils/cookie";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-question-index` });

interface QuestionIndexContextProps extends QuestionIndexPageProps {

}

const QuestionIndexContext = React.createContext<QuestionIndexContextProps>({} as QuestionIndexContextProps);

interface QuestionIndexPageProps {
    categorys: QuestionCategory[];
    questions: PageSource<QuestionVo>;
    reports: Report[];
    articles: Article[];
}

/**出海百问 */
const QuestionIndexPage: NextPage<QuestionIndexPageProps> = (props) => {

    const ctxValue: QuestionIndexContextProps = {
        ...props,
    }

    return (
        <QuestionIndexContext.Provider value={ctxValue}>
            <DefaultLayout>
                <Filter />

                <Row gutter={20}>
                    <Col span={18}>
                        <DataSource />
                    </Col>
                    <Col span={6}>
                        <Space
                            size={20}
                            className={"w-[100%]"}
                            direction={"vertical"}
                        >
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
        </QuestionIndexContext.Provider>
    )
}

QuestionIndexPage.getInitialProps = async (ctx) => {

    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key || 30;
    let categoryIdHandle = ctx.query.categorys ? (ctx.query.categorys as string).split(",") : '';
    const categoryId = categoryIdHandle ? categoryIdHandle[categoryIdHandle.length - 1] : ''

    const categoryParams: PageParams = {
        current: 1,
        level: 1,
        size: 1000
    }

    const reportParams: PageParams = {
        current: 1,
        size: 10,
    }

    const articlesParams: PageParams = {
        current: 1,
        size: 10,
        articleType: 2,
        auditStatus: 1,
    }

    const questionCategory = (await getQuestionCategory(categoryParams)).data.records;

    const ids = ctx.query.categorys ? (ctx.query.categorys as string).split(",").map(Number) : [];

    const last = await findLastChild(questionCategory, ...ids);

    const params: PageParams = {
        // categoryId,
        current,
        size,
        levels: last?.levels
    }

    /**问答分页 */
    const token = Cookie.getToken(ctx);
    const questions = (await getQuestionPage(params, token)).data;


    /**推荐报告 */
    const reports = (await getReportPage(reportParams)).data.records;

    /**行业洞察 */
    const articles = (await getArticlePage(articlesParams)).data.records;

    return {
        categorys: questionCategory,
        questions,
        reports,
        articles,
    }
}

export default QuestionIndexPage;

/**根据id查找最后一级 */
function findLastChild(arrs?: QuestionCategory[], ...args: Key[]): Promise<QuestionCategory | undefined> {
    return new Promise(async (resolve) => {
        const [first, ...others] = args;
        const category = find(arrs, { id: Number(first) });
        if (!others.length) return resolve(category);
        const next = await findLastChild(category?.lowerHundredQuestionCategoryDTO, ...others);
        return resolve(next);
    })
}

/**过滤组件 */
const Filter: React.FC = () => {

    const { categorys } = useContext(QuestionIndexContext);
    const { query } = useRouter();

    const queryCategorys = ((query.categorys as string) || "").split(",");

    return (
        <Card
            bordered={false}
            size={"small"}
            className={"mb-[20px]"}
        >
            <Row gutter={[15, 15]}>
                {renderTree(categorys, queryCategorys, 0)}
            </Row>
        </Card>
    )
}

/**渲染过滤树结构 */
const renderTree = (categorys: QuestionCategory[], params: Key[], level: number) => {

    /**如果没有了则返回不渲染 */
    if (!categorys?.length) return <Fragment />;

    /**名称 */
    const names: string[] = ["业务分类", "一级分类", "二级分类", "三级分类", "四级分类", "五级分类"];
    const name = names[level] || "其他分类";

    /**选中样式 */
    const activeCls = css`
        background-color: #F676A633 !important;
        color: #F676A6FF !important;
    `;

    /**当前等级选中的id */
    const current = Number(params[level]);
    /**当前选中的分类 */
    const category = find(categorys, { id: current }) as QuestionCategory;

    /**全部按钮的参数 */
    const allQuery = { categorys: take(params, level).join(","), current: 1 };

    /**分类参数 */
    const queryCategorys = take(params, level + 1);

    return (
        <Fragment>
            <Col span={2}>
                <div className={"h-[32px] fh-[32px] pl-[5px] fs-[16px] fw-600"}>{name}:</div>
            </Col>
            <Col span={22}>
                <Space wrap>
                    <Link
                        href={{ query: allQuery }}
                        passHref
                    >
                        <Button
                            type={"link"}
                            className={cx({ [activeCls]: !current })}
                        >
                            全部
                        </Button>
                    </Link>
                    {categorys.map((category) => {
                        queryCategorys[level] = category.id;
                        const query = { categorys: queryCategorys.join(","), current: 1 };
                        const active = current === category.id;
                        return (
                            <Link
                                href={{ query }}
                                passHref
                                key={`${level}.${category.id}`}
                            >
                                <Button
                                    type={"link"}
                                    className={cx({ [activeCls]: active })}
                                >
                                    {category.name}
                                </Button>
                            </Link>
                        )
                    })}
                </Space>
            </Col>
            {/* 渲染下一级 */}
            {renderTree(category?.lowerHundredQuestionCategoryDTO, params, level + 1)}
        </Fragment>
    )
}

/**列表分页 */
const DataSource: React.FC = () => {
    const { query } = useRouter();
    const { questions } = useContext(QuestionIndexContext);

    if (!questions.total) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        )
    }

    const sourceCls=css`
        .ikjzd-list-item:last-child{
            border-bottom: 1px solid #f0f0f0;
        }
    `    
    return (
        <Card
            className={sourceCls}
            bordered={false}
            bodyStyle={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}
        >

            <List>
                {questions.records.map((question) => (<div className="px-[25px] hover border-bottom-show">
                    <List.Item key={question.id} className={"py-[30px]"}>
                        <QuestionItem {...question} />
                    </List.Item></div>
                ))}
            </List>
            <Pagination
                className="float-right mb-[30px] mt-[20px]"
                current={questions.current}
                total={questions.total}
                pageSize={questions.size}
                showSizeChanger={false}
                itemRender={(page, type, element) => {
                    return (
                        <Link href={{ query:{ ...query, current: page } }}>
                            <a>{ type === "page" ? page : element}</a>
                        </Link>
                    )
                }}
            />
        </Card>
    )
}

/**单个百问 */
export const QuestionItem: React.FC<QuestionVo> = (props) => {
    const { name, details, authorAvatar, authorName, id } = props;

    const [article, setArticle] = useState(props);
    const { isPraise, praiseNum, isCollection, collectNum } = article;
    const likeCollectionCls = css`
        width: 100%;
    `
    const infoCls = css`
        display: flex;
        flex-grow: 2;
`
    return <div className={likeCollectionCls}>
        <Link
            href={"/question/[id]"}
            as={`/question/${id}`}
        >
            <a className="block mb-[10px] w-[100%]" target={"_blank"}>
                <h2 className="color-[#000000E6] fs-[18px] fw-600 mb-[10px]">
                    {name}
                </h2>
                <div className="color-[#00000099] fh-[28px] lc-3 mb-[10px] nohover">
                    <span>
                        {details.replace(/(&nbsp;)|<\/?[^>]*>/g, '')}
                    </span>
                </div>
            </a>
        </Link>

        <Row>
            <div className={infoCls}>
                <Avatar size={24} src={authorAvatar} />
                <span className="mx-[10px] mr-[30px]">
                    {authorName}
                </span>
                <LikeCollectionBW
                    isPraise={isPraise}
                    praiseNum={praiseNum}
                    isCollection={isCollection}
                    collectNum={collectNum}
                    otherId={article.id}
                    onChange={(value) => setArticle({ ...article, ...value })}
                />
            </div>
            <Link
                href={"/question/[id]"}
                as={`/question/${id}`}
            >
                <a className="fs-[12px]">
                    查看详情
                    <Icon
                        type={"icon-youjiantou"}
                        className={"ml-[8px]"}
                    />
                </a>
            </Link>


        </Row>
    </div>
}

/**点赞收藏 */

interface LikeCollectionStatus {
    isPraise?: boolean;
    praiseNum?: number;
    isCollection?: boolean;
    collectNum?: number;
}
interface LikeCollectionProps extends LikeCollectionStatus {
    position?: "list" | "detail";
    onChange?: (status: LikeCollectionStatus) => void;
    type?: Key;
    otherId: Key;
    collectShow?: boolean;

}
export const LikeCollectionBW: React.FC<LikeCollectionProps> = (props) => {
    const { position, onChange, type, otherId, collectShow, ...args } = props;
    /**点赞 */
    const onPeratePraise = async (isPraise: boolean) => {
        if (!onChange) return;
        if (isPraise) {
            await operatePraiseCancel({ type: type as Key, otherId });
            onChange({ ...args, isPraise: false, praiseNum: Number(args.praiseNum) - 1 });
            message.success("取消点赞");
        } else {
            await operatePraise({ type: type as Key, otherId });;
            onChange({ ...args, isPraise: true, praiseNum: Number(args.praiseNum) + 1 });
            message.success("点赞成功");
        }
    }
    /**收藏 */
    const onCollection = async (isCollection: boolean) => {
        if (!onChange) return;
        if (isCollection) {
            await operateCollectCancel({ type: type as Key, otherId });;
            onChange({ ...args, isCollection: false, collectNum: Number(args.collectNum) - 1 });
            message.success("取消收藏");
        } else {
            await operateCollect({ type: type as Key, otherId });;
            onChange({ ...args, isCollection: true, collectNum: Number(args.collectNum) + 1 });
            message.success("收藏成功");
        }
    }


    if (position == "list") {
        return <>
            <Col span={3}>
                <Authorization.Valid>
                    <Space className={cx("color-[#00000099]", "cursor-pointer", { ["color-[#f676a6]"]: args.isPraise })}
                        onClick={() => onPeratePraise(args.isPraise as boolean)}
                    >
                        <Icon type={args.isPraise ? "icon-dianzan" : "icon-dianzan"} />
                        <span>好问题</span>
                        <span>{args.praiseNum}</span>
                    </Space>
                </Authorization.Valid>
            </Col>
            <Col span={3} offset={1}>
                <Authorization.Valid>
                    <Space className={cx("color-[#00000099]", "cursor-pointer", { ["color-[#f676a6]"]: args.isCollection })}
                        onClick={() => onCollection(args.isCollection as boolean)}
                    >
                        {args.isCollection ? <Icon type={"icon-shoucang1"} /> : <Icon type={"icon-shoucang"} />}
                        <span>收藏</span>
                        <span>{args.collectNum}</span>
                    </Space>
                </Authorization.Valid>
            </Col>
        </>
    } else {
        return <>
            <Authorization.Valid>
                <Space className={cx("mr-[35px]", "color-[#00000066]", "cursor-pointer", { ["color-[#f676a6]"]: args.isPraise })}
                    onClick={() => onPeratePraise(args.isPraise as boolean)}
                >
                    <Icon type={"icon-dianzan"} />
                    <span>好问题</span>
                    <span>{args.praiseNum}</span>
                </Space>
            </Authorization.Valid>
            <Authorization.Valid>
                <Space className={cx("color-[#00000066]", "cursor-pointer", { ["color-[#f676a6]"]: args.isCollection })}
                    onClick={() => onCollection(args.isCollection as boolean)}
                >
                    <Icon type={"icon-shoucang1"} />
                    <span>收藏</span>
                    <span>{args.collectNum}</span>
                </Space>
            </Authorization.Valid>
        </>
    }
}

LikeCollectionBW.defaultProps = {
    type: 8,
    position: "list"
}