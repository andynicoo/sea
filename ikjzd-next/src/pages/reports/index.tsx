import { getArticlePage } from "@/apis/article";
import { getIndustryCategory } from "@/apis/home";
import { getReportPage, getReprotUrl } from "@/apis/reports";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SearchInput from "@/components/SearchInput";
import Article from "@/vo/Article";
import { IndustryCategory } from "@/vo/Basic";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Report } from "@/vo/Reports";
import { Avatar, Button, Card, Col, Empty, List, message, Pagination, Row, Select, Space, Tag } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import React, { Fragment, Key, useContext, useEffect, useState } from "react";
import Adviser from "@/components/Adviser";

import createEmotion from "@emotion/css/create-instance";
import Authorization from "@/components/Authorization";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-question-index` });

interface ReportsIndexContextProps extends ReportsIndexPageProps {
    params?: PageParams;
    setParams: (params: PageParams) => void;
    reports: PageSource<Report>;
}

const ReportsIndexContext = React.createContext<ReportsIndexContextProps>({} as ReportsIndexContextProps);

const defaultParams: PageParams = {
    current: 1,
    size: 10
}

interface ReportsIndexPageProps {
    initReports: PageSource<Report>;
    industryCategorys: IndustryCategory[];
    commendArticles: Article[];
    commendReports: Report[];
}

export const onDownLoad = (id: string) => {
    if (id) {
        getReprotUrl({ id: id as string }).then((res) => {
            if (res.code == "0") {
                window.open(res.data);
            }
        }).catch((error) => {
            message.error(error.response.data.message);
        });
    }
};
/**行业报告  */
const ReportsIndexPage: NextPage<ReportsIndexPageProps> = (props) => {

    const [params, setParams] = useState<PageParams>();
    const [reports, setReports] = useState<PageSource<Report>>(props.initReports);

    const onSearchKw = (title: string) => {
        setParams({ ...params, title, current: 1 });
    }

    const loadMore = () => {
        if (!params) return;
        getReportPage(params).then(({ data }) => {
            let nextRecords: Report[];
            if (params.current == 1) nextRecords = [...data.records];
            else nextRecords = [...reports.records, ...data.records];
            setReports({
                ...data,
                records: nextRecords
            });
        })
    }

    useEffect(loadMore, [params]);

    const ctxValue: ReportsIndexContextProps = {
        ...props,
        params,
        setParams,
        reports,
    }

    return (
        <ReportsIndexContext.Provider value={ctxValue}>
            <DefaultLayout>
                <h2 className="mt-[10px] mb-[20px] fw-600">行业报告</h2>
                <Row gutter={15}>
                    <Col span={18}>
                        <Space
                            size={15}
                            direction={"vertical"}
                            className={"w-[100%]"}
                        >
                            {/* 搜索 */}
                            <SearchInput
                                onSearch={onSearchKw}
                                placeholder="请输入名称查询"
                                size={"large"}
                                enterButton={<span className="px-[10px]"><img width={30} src="/asset/image/search_ic.png" /></span>}
                            />

                            {/* 条件筛选 */}
                            <Filter />

                            {/* 分页列表 */}
                            <DataSource />
                        </Space>
                    </Col>
                    <Col span={6}>
                        <Space
                            size={15}
                            direction={"vertical"}
                            className={"w-[100%]"}
                        >
                            {/* 咨询卡片 */}
                            <Adviser.Card />

                            {/* 推荐报告 */}
                            <CommendReports reports={props.commendReports} />

                            {/* 推荐洞察 */}
                            <CommendArticles articles={props.commendArticles} />
                        </Space>
                    </Col>
                </Row>
            </DefaultLayout>
        </ReportsIndexContext.Provider>
    )
}

ReportsIndexPage.getInitialProps = async (ctx) => {
    /**筛选条件 */
    const industryCategorys = (await getIndustryCategory()).data;

    const initReports = (await getReportPage(defaultParams)).data;

    /**推荐报告 */
    const commendParams: PageParams = {
        current: 1,
        size: 6,
    }
    const commendReports = (await getReportPage(commendParams)).data.records;

    /**推荐洞察 */
    const articlesParams: PageParams = {
        current: 1,
        size: 6,
        articleType: 2,
    }
    const commendArticles = (await getArticlePage(articlesParams)).data.records;

    return {
        initReports,
        industryCategorys,
        commendArticles,
        commendReports,
    }
}

export default ReportsIndexPage;

/**条件筛选 */
const Filter: React.FC = () => {

    const { industryCategorys, params, setParams } = useContext(ReportsIndexContext);

    const reportCategory = params?.reportCategory || '';
    const sort = params?.sort || 'created_at';

    const onCategorysSelect = (reportCategory: Key) => {
        setParams({ ...params, current: 1, reportCategory })
    }

    const onCategorysClear = () => {
        setParams({ ...params, current: 1, reportCategory: null });
    }

    const sortOptions: { label: string; value: Key }[] = [
        { label: "最新上传", value: "created_at" },
        { label: "下载量最多", value: "download_num" },
    ];

    const onSortSelect = (sort: Key) => {
        setParams({ ...params, current: 1, sort });
    }

    const onSortClear = () => {
        setParams({ ...params, current: 1, sort: null });
    }

    return (
        <Card bordered={false} size={"small"}>
            <Space wrap size={15}>
                <span className="color-[#000000e6] fw-500">
                    筛选条件:
                </span>
                <Select
                    defaultValue={reportCategory}
                    style={{ width: 240 }}
                    options={[{ name: "全部", value: "" }, ...industryCategorys]}
                    fieldNames={{ label: "name", value: "value" }}
                    onSelect={onCategorysSelect}
                    onClear={onCategorysClear}
                    allowClear
                />
                <Select
                    defaultValue={sort}
                    style={{ width: 240 }}
                    options={sortOptions}
                    onSelect={onSortSelect}
                    onClear={onSortClear}
                    allowClear
                />
            </Space>
        </Card>
    )
}

/**分页列表 */
const DataSource: React.FC = () => {
    const { reports, params, setParams } = useContext(ReportsIndexContext);
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    const onLoadMore = () => {
        setParams({ ...params, current: Number(params?.current || 1) + 1 });
    }

    const hasMore = reports.current < reports.pages;

    if (!reports.records.length) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        )
    }

    const clsreports = css`
    .ikjzd-card-body {
        padding: 0px 20px 20px 0px;
        .ikjzd-list-item{
            padding:16px 0px ;
            border-bottom: none;
        }
        .lines{
            height: 1px;
            background: #E6E6E6;
        }
    }
    `;

    const cls = css`
        /* background: red; */
    `;

    return (
        <Card
            bordered={false}
            className={cx(
                clsreports,
            )}
            title={<span className="color-[#00000099] fs-[14px]">共{reports.records.length}篇文章</span>}
        >
            <List
                dataSource={reports.records}
                className={cx(
                    cls,
                )}
                renderItem={(report) => {
                    const avatar = (
                        <Avatar
                            shape={"square"}
                            src={report.thumbPicUrl}
                            style={{ width: 103, height: 130 }}
                            className="ml-[15px]"
                        />
                    )

                    const description = (
                        <Fragment>
                            <div style={{ height: 75 }}>

                                <p className="lc-2 mb-[0px] color-[#00000066]">
                                    {report.description}
                                </p>

                            </div>
                            <p className="mb-[0px]">
                                <Tag color={"#F676A6FF"} className='cursor-pointer'>下载</Tag>
                                <Tag color={"#F676A6FF"}>免费</Tag>
                                <Tag color='red' style={{ color: "#F676A6", background: "#fff", borderColor: "#F676A6" }}>{report.reportCategoryName}报告</Tag>
                                <span className="float-right color-[#00000066] fs-[12px]">{report.createdAt}</span>
                            </p>
                        </Fragment>
                    )
                    return <Authorization.Valid><div
                        onClick={() => onDownLoad(report.id)}
                    >
                        <List.Item key={report.id}>
                            <List.Item.Meta
                                avatar={avatar}
                                title={
                                    <h2 className="fs-[18px] fw-600">{report.title}</h2>}
                                description={description}
                            />
                        </List.Item>
                        <div className="lines ml-[15px]"></div>
                    </div>
                    </Authorization.Valid>
                }}
            />
            < div className="text-center mt-[20px]" >
                <Button
                    onClick={onLoadMore}
                    size={"large"}
                    shape={"round"}
                    disabled={!hasMore}
                >
                    {hasMore ? "加载更多..." : "没有更多了"}
                </Button>
            </div >
        </Card >
    )
}

/**推荐报告 */
export const CommendReports: React.FC<{ reports: Report[] }> = ({ reports }) => {
    const cls = css`
        cursor: pointer;
        display: grid;
        grid-template-columns: 15px 1fr;
        align-items: center;
        height: 44px;
        border-bottom: 1px solid #E9E9E9;

        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }

        &>span {
            display: block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            line-height: 15px;
            text-align: center;
            background-color: #AFB9C6FF;
            font-size: 10px;
            color: #fff;

        }

        &:nth-child(1) {
            span {
                background-color: #FF9700FF;
            }
        }

        &:nth-child(2) {
            span {
                background-color: #44B08BFF;
            }
        }

        &:nth-child(3) {
            span {
                background-color: #4D8AEAFF;
            }
        }

        &>P {
            margin: 0;
            margin-left: 10px;
            font-size: 14px;
            font-weight: 400;
            color: #000000E6;
        }
    `;
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    return (
        <Card bordered={false} title={"推荐报告"} className="cards">
            {reports.map((report, index) => {
                return (
                    userInfo ? <span
                        key={report.id}
                        className={cls}
                        onClick={() => onDownLoad(report.id)}
                    >
                        <span>{index + 1}</span>
                        <p className="lc-1">{report.title}</p>
                    </span> :
                        <Authorization.Valid><span
                            key={report.id}
                            className={cls}
                        >
                            <span>{index + 1}</span>
                            <p className="lc-1">{report.title}</p>
                        </span></Authorization.Valid>
                )
            })}
        </Card>
    )
}
/**推荐洞察 */
export const CommendArticles: React.FC<{ articles: Article[] }> = ({ articles }) => {

    const cls = css`
        color: #000000E6;
        height: 44px;
        line-height: 44px;
        position: relative;
        padding-left: 25px;
        border-bottom: 1px solid #E9E9E9;
        
        &::before {
            content: "";
            position: absolute;
            left: 7px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #AFB9C6FF;
            display: block;
            width: 4px;
            height: 4px;
            border-radius: 50%;
        }
    `;

    return (
        <Card bordered={false} title={"推荐洞察"} className={"mb-[20px] cards"}>
            {articles.map((article) => (
                <Link
                    key={article.id}
                    href={"/articles/[id]"}
                    as={`/articles/${article.id}`}
                >
                    <a className={cx(cls, "lc-1")} target={"_blank"}>
                        {article.title}
                    </a>
                </Link>
            ))}
        </Card>
    )
}