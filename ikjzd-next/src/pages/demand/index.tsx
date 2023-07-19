import { getDemandPage, getDemandType } from "@/apis/demand";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SearchInput from "@/components/SearchInput";
import { Demand, DemandType } from "@/vo/Demand";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Avatar, Button, Card, Col, Divider, Empty, List, Pagination, Row, Space, Spin } from "antd";
import { SortAscendingOutlined, SortDescendingOutlined, TagOutlined } from "@ant-design/icons";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, Key, useContext, useEffect, useState } from "react";
import Icon from "@/components/Icon";
import moment from "moment";
import createEmotion from "@emotion/css/create-instance";
import Authorization from "@/components/Authorization";
import { getServicePage } from "@/apis/home";
import { Server } from "@/vo/Basic";
import { Commend } from "@/pages/server";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-demand-index` });

interface DemandIndexContextProps extends DemandIndexPageProps {
    params?: PageParams;
    setParams: (params: PageParams) => void;
    dataSource: PageSource<Demand>;
    loading: boolean;
}

const DemandIndexContext = React.createContext<DemandIndexContextProps>({} as DemandIndexContextProps);

interface DemandIndexPageProps {
    types: DemandType[];
    initDataSource: PageSource<Demand>;
}

/**海外需求首页 */
const DemandIndexPage: NextPage<DemandIndexPageProps> = (props) => {
    const [dataSource, setDataSource] = useState<PageSource<Demand>>(props.initDataSource);
    const [params, setParams] = useState<PageParams>();
    const [loading, setLoading] = useState<boolean>(false);

    const loadData = () => {
        if (!params) return;
        setLoading(true);
        getDemandPage(params)
            .then((res) => {
                setDataSource(res.data);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const ctxValue: DemandIndexContextProps = {
        ...props,
        dataSource,
        params,
        setParams,
        loading,
    }

    const onSearch = (title: string) => {
        setParams({ ...params, current: 1, title });
    }

    useEffect(loadData, [params]);

    return (
        <DemandIndexContext.Provider value={ctxValue}>
            <DefaultLayout>
                <Row gutter={15}>
                    <Col span={18}>
                        <Space
                            direction={"vertical"}
                            size={15}
                            className={"w-[100%]"}
                        >
                            {/* 搜索 */}
                            <SearchInput
                                size={"large"}
                                placeholder={"请输入搜索内容"}
                                onSearch={onSearch}
                            />

                            {/* 过滤 */}
                            <Filter />

                            {/* 排序 */}
                            <Sort />

                            {/* 分页 */}
                            <DataSources />
                        </Space>
                    </Col>
                    <Col span={6}>
                        {/* 推荐服务商 */}
                        <Commend />
                        {/* <CommendServers /> */}
                    </Col>
                </Row>
            </DefaultLayout>
        </DemandIndexContext.Provider>
    )
}

DemandIndexPage.getInitialProps = async (ctx) => {

    const types = (await getDemandType()).data;
    const initDataSource = (await getDemandPage({ current: 1, size: 10 })).data;

    return {
        types,
        initDataSource,
    }
}

export default DemandIndexPage;

const defaultParams: PageParams = {
    current: 1,
    size: 10
}

/**过滤 */
const Filter: React.FC = () => {
    const { types, params, setParams } = useContext(DemandIndexContext);

    const type = params?.type as Key;
    const searchType = params?.searchType as Key;
    const status = params?.status as Key;

    const activeCls = css`
        background-color: #F676A633 !important;
        color: #F676A6FF !important;
    `;

    const cls = css`
        display: grid;
        grid-template-columns: 50px 1fr;
    `;

    return (
        <Card bordered={false}>
            <div className={cx(cls, "mb-[10px]")}>
                <div className="h-[32px] fh-[32px] color-[#000000e6] fs-[16px]">
                    类型:
                </div>
                <Space wrap>
                    <Button
                        size={"small"}
                        type={"link"}
                        className={cx({ [activeCls]: !type })}
                        onClick={() => setParams({ ...params, current: 1, type: undefined })}
                    >
                        全部
                    </Button>
                    {types.map((item) => (
                        <Button
                            key={item.id}
                            size={"small"}
                            type={"link"}
                            className={cx({ [activeCls]: item.id === type })}
                            onClick={() => setParams({ ...params, current: 1, type: item.id })}
                        >
                            {item.name}
                        </Button>
                    ))}
                </Space>
            </div>
            <div className={cx(cls, "mb-[10px]")}>
                <div className="h-[32px] fh-[32px] color-[#000000e6] fs-[16px]">
                    时间:
                </div>
                <Space wrap>
                    <Button
                        size={"small"}
                        type={"link"}
                        className={cx({ [activeCls]: !searchType })}
                        onClick={() => setParams({ ...params, current: 1, searchType: undefined })}
                    >
                        全部
                    </Button>
                    <Button
                        size={"small"}
                        type={"link"}
                        className={cx({ [activeCls]: searchType === 1 })}
                        onClick={() => setParams({ ...params, current: 1, searchType: 1 })}
                    >
                        今天发布
                    </Button>
                    <Button
                        size={"small"}
                        type={"link"}
                        className={cx({ [activeCls]: searchType === 2 })}
                        onClick={() => setParams({ ...params, current: 1, searchType: 2 })}
                    >
                        三天内发布
                    </Button>
                    <Button
                        size={"small"}
                        type={"link"}
                        className={cx({ [activeCls]: searchType === 3 })}
                        onClick={() => setParams({ ...params, current: 1, searchType: 3 })}
                    >
                        一天内到期
                    </Button>
                    <Button
                        size={"small"}
                        type={"link"}
                        className={cx({ [activeCls]: searchType === 4 })}
                        onClick={() => setParams({ ...params, current: 1, searchType: 4 })}
                    >
                        三天内到期
                    </Button>
                </Space>
            </div>
            <div className={cls}>
                <div className="h-[32px] fh-[32px] color-[#000000e6] fs-[16px]">
                    状态:
                </div>
                <Space>
                    <Button
                        size={"small"}
                        type={"link"}
                        className={cx({ [activeCls]: !status })}
                        onClick={() => setParams({ ...params, current: 1, status: undefined })}
                    >
                        全部
                    </Button>
                    <Button
                        size={"small"}
                        type={"link"}
                        className={cx({ [activeCls]: status === "JXZ" })}
                        onClick={() => setParams({ ...params, current: 1, status: "JXZ" })}
                    >
                        进行中
                    </Button>
                    <Button
                        size={"small"}
                        type={"link"}
                        className={cx({ [activeCls]: status === "YJJ" })}
                        onClick={() => setParams({ ...params, current: 1, status: "YJJ" })}
                    >
                        已结束
                    </Button>
                </Space>
            </div>
        </Card >
    )
}

/**排序 */
const Sort: React.FC = () => {

    const { params, setParams } = useContext(DemandIndexContext);
    const { push } = useRouter();

    type orderType = "ASC" | "DESC" | undefined;
    type sortType = "created_at" | "end_time" | "participation_num" | undefined;

    interface SortQuery {
        order: orderType;
        sort: sortType;
    }

    const sort = params?.sort as sortType;
    const order = params?.order as orderType;

    const cls = css`
        display: grid;
        grid-template-columns: 45px 1fr 90px;
    `;

    return (
        <Card bordered={false} bodyStyle={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 24 }}>
            <div className={cls}>
                <div className="h-[32px] fh-[32px] color-[#000000e6] fs-[16px]">
                    排序:
                </div>
                <div>
                    <Button
                        type={"link"}
                        className={cx({ ["color-[primary]"]: sort === "created_at" })}
                        onClick={() => setParams({
                            ...params,
                            sort: "created_at",
                            order: order === "ASC" ? "DESC" : "ASC"
                        })}
                    >
                        发布时间
                        {
                            (sort === "created_at" && order === "ASC")
                                ? <SortAscendingOutlined />
                                : <SortDescendingOutlined />
                        }
                    </Button>
                    <Button
                        type={"link"}
                        className={cx({ ["color-[primary]"]: sort === "end_time" })}
                        onClick={() => setParams({
                            ...params,
                            sort: "end_time",
                            order: order === "ASC" ? "DESC" : "ASC"
                        })}
                    >
                        剩余时间
                        {
                            (sort === "end_time" && order === "ASC")
                                ? <SortAscendingOutlined />
                                : <SortDescendingOutlined />
                        }
                    </Button>
                    <Button
                        type={"link"}
                        className={cx({ ["color-[primary]"]: sort === "participation_num" })}
                        onClick={() => setParams({
                            ...params,
                            sort: "participation_num",
                            order: order === "ASC" ? "DESC" : "ASC"
                        })}
                    >
                        参与数
                        {
                            (sort === "participation_num" && order === "ASC")
                                ? <SortAscendingOutlined />
                                : <SortDescendingOutlined />
                        }
                    </Button>
                </div>
                <Authorization.Valid>
                    <Button
                        shape={"round"}
                        type={"primary"}
                        block
                        onClick={() => push(`/demand/publish`)}
                    >
                        发布需求
                    </Button>
                </Authorization.Valid>
            </div>
        </Card>
    )
}

/**分页 */
const DataSources: React.FC = () => {
    const { dataSource, loading, params, setParams } = useContext(DemandIndexContext);

    const onLoadMore = () => {
        setParams({ ...params, current: (Number(params?.current) || 1) + 1 });
    }

    if (!dataSource.total) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        )
    }

    const imgCla = css`
        position: relative;
        top:-2px;
        vertical-align: top;
        margin-right: 5px;
    `
    const jxzCls = css`
        border-color: #f676a6;
        color:#f676a6;
    `
    const sourceCls = css`
        .ikjzd-list-item:last-child{
            border-bottom: 1px solid #f0f0f0;
        }
    `

    const hasMore = dataSource.current < dataSource.pages;

    return (
        <Spin spinning={loading}>
            <Card bordered={false} bodyStyle={{ paddingTop: 0, paddingBottom: 20, paddingLeft: 0, paddingRight: 0 }}>
                <List
                    dataSource={dataSource.records}
                    className={sourceCls}
                    renderItem={(demand) => {
                        let status: string = "";
                        if (demand.status === "JXZ") status = "进行中";
                        if (demand.status === "YJJ") status = "已结束";

                        const diffDay = Math.abs(moment().diff(demand.endTime, "days"));

                        const title = (
                            <Link href={"/demand/[id]"} as={`/demand/${demand.id}`}>
                                <a target={"_blank"}>
                                    <span className="color-[#000000e6] fs-[18px] fw-500 mr-[15px] mb-[10px]">
                                        {demand.title}
                                    </span>
                                    {demand.status === "JXZ" && <Button className={jxzCls} size={"small"}>{status}</Button>}
                                    {demand.status === "YJJ" && <Button size={"small"}>{status}</Button>}
                                </a>
                            </Link>
                        )

                        const description = (
                            <Fragment>
                                <Link
                                    href={"/demand/[id]"}
                                    as={`/demand/${demand.id}`}
                                >
                                    <a className="mb-[10px] lc-3 db nohover" target={"_blank"}>
                                        {demand.content}
                                    </a>
                                </Link>
                                <div className="flot-left mt-[10px]">
                                    <span className="mr-[30px]">
                                        <Avatar
                                            className={imgCla}
                                            size={24}
                                            src={demand.avatar}
                                        />
                                        <span>{demand.name}</span>
                                    </span>
                                    <span className="mr-[30px]">
                                        <TagOutlined />
                                        {demand.typeName}
                                    </span>
                                    <span className="mr-[30px]">
                                        <Icon
                                            type={"icon-shijian"}
                                            className="fs-[16px]"
                                        />
                                        {demand.createdAt}发布
                                    </span>
                                </div>
                                <div className="float-right">
                                    {demand.status === "JXZ" ? (
                                        <span>
                                            <span className={"color-[primary]"}>
                                                {diffDay}
                                            </span>
                                            &nbsp; 天后截止
                                        </span>
                                    ) : (
                                        <span>已截止</span>
                                    )}
                                </div>
                            </Fragment>
                        );

                        return (
                            <List.Item key={demand.id} className={"py-[20px] px-[25px] hover"}>
                                <List.Item.Meta
                                    title={title}
                                    description={description}
                                />
                            </List.Item>
                        )
                    }}
                />
                {/* <Divider /> */}

                <div className="text-center mt-[20px]">
                    <Button
                        size={"large"}
                        type={"primary"}
                        ghost
                        shape={"round"}
                        disabled={!hasMore}
                        onClick={onLoadMore}
                        style={{ width: 160 }}
                    >
                        {hasMore ? "加载更多" : "没有更多了"}
                    </Button>
                </div>
            </Card>
        </Spin>
    )
}

const CommendServers: React.FC = () => {
    const [commendServersList, setCommendServersList] = useState<Server[]>()
    useEffect(() => {
        getServicePage({ current: 1, size: 3 }).then(res => {
            setCommendServersList(res.data.records)
        })
    }, [])
    return (
        <Card bordered={false} title={"推荐服务商"}>
            <Space
                direction={"vertical"}
                className={"w-[100%]"}
                size={16}
            >
                {commendServersList?.map((item) => {
                    const [src] = item.productImage;
                    return (
                        <Link
                            key={item.id}
                            href={`/server/${item.id}`}
                        >
                            <a>
                                <Avatar
                                    key={item.id}
                                    shape={"square"}
                                    style={{ height: 116 }}
                                    className={"w-[100%]"}
                                    src={src}
                                />
                            </a>
                        </Link>
                    )
                })}
            </Space>
        </Card>
    )
}