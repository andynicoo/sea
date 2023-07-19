import { dictArea, getArticlePlatformList, getServicePage, pageAd, serviceType } from "@/apis/home";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SearchInput from "@/components/SearchInput";
import { Avatar, Button, ButtonProps, Card, Col, Empty, Pagination, Row, Space } from "antd";
import { NextPage } from "next";
import React, { Fragment, Key, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { Advert, Area, Server, ServerType } from "@/vo/Basic";
import { ActivityPlatform } from "@/vo/Encyclopedia";
import { Store } from "@/vo/Domain";
import { PageSource, PageParams } from "@/vo/PageParams";
import { getServerPistPage } from "@/apis/server";

import createEmotion from "@emotion/css/create-instance";
import Adviser from "@/components/Adviser";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-server-index` });

type sortType = undefined | "create_at" | "praise_num";
type orderType = undefined | "asc" | "desc";
interface SupplierIndexContextProps extends SupplierIndexPageProps {

}

const SupplierIndexContext = React.createContext<SupplierIndexContextProps>({} as SupplierIndexContextProps);

interface SupplierIndexPageProps {
    types: ServerType[];
    platforms: ActivityPlatform[];
    areas: Area[];
    pageData: PageSource<Server>;
    commends: Store[];
}

/**找服务 -> 服务商列表 */
const SupplierIndexPage: NextPage<SupplierIndexPageProps> = (props) => {

    const { push, query } = useRouter();

    const ctxValue: SupplierIndexContextProps = {
        ...props
    }

    const onSearch = (value: string) => {
        push({ pathname: "/server", query: { ...query, current: 1, name: value } })
    }

    return (
        <SupplierIndexContext.Provider value={ctxValue}>
            <DefaultLayout>
                <Row gutter={15}>
                    <Col span={18}>
                        {/* 搜索框 */}
                        <SearchInput
                            size={"large"}
                            placeholder="请输入名称查询"
                            onSearch={onSearch}
                            className={"mb-[20px]"}
                            enterButton={<span className="px-[10px]"><img width={30} src="/asset/image/search_ic.png" /></span>}
                        />

                        {/* 条件过滤 */}
                        <Filter />

                        {/* 排序 */}
                        <Sort />

                        {/* 分页数据 */}
                        <DataSource />
                    </Col>
                    <Col span={6}>
                        {/* 咨询广告 */}
                        <Adviser.Card className="mb-[20px]" />
                        {/* 推荐 */}
                        <Commend />
                    </Col>
                </Row>
            </DefaultLayout>
        </SupplierIndexContext.Provider>
    )
}

SupplierIndexPage.getInitialProps = async (ctx) => {
    const {
        current,
        size,
        categoryId,
        area,
        platformId,
        name,
        sort,
        order,
    } = ctx.query as { [key: string]: string };

    const pageParams: PageParams = {
        current,
        size: size || 30,
        categoryId,
        area,
        platformId,
        name,
        sort,
        order,
    }

    const commendParams: PageParams = {
        current: 1,
        size: 4,
        type: 'SERVICE'
    }

    const types = (await serviceType()).data;
    const platforms = (await getArticlePlatformList()).data;
    const areas = (await dictArea()).data;
    const pageData = (await getServicePage(pageParams)).data;
    const commends = (await getServerPistPage(commendParams)).data.records;
    return {
        types,
        platforms,
        areas,
        pageData,
        commends,
    }
}

export default SupplierIndexPage;

const dftpg: PageParams = { current: 1 };

/**条件过滤 */
const Filter: React.FC = () => {

    const { types, platforms, areas } = useContext(SupplierIndexContext);
    const { query } = useRouter();
    const categoryId = query.categoryId as Key;
    const platformId = query.platformId as Key;

    const areaId = Number(query.area) as Key;

    return (
        <Card
            className="mb-[20px]"
            size={"small"}
            bordered={false}
        >
            <Row gutter={[24, 24]}>
                <Col
                    className="color-[#000000e6] fw-500 fs-[16px] text-right py-[5px]"
                    span={2}
                >
                    类型:
                </Col>
                <Col span={22}>
                    <Link
                        href={{ query: { ...query, ...dftpg, categoryId: null } }}
                        scroll={false}
                    >
                        <a>
                            <FilterBtn active={!categoryId}>
                                全部
                            </FilterBtn>
                        </a>
                    </Link>
                    {types.map((type) => {
                        const active = categoryId == type.id;
                        const href = { query: { ...query, ...dftpg, categoryId: type.id } };
                        return (
                            <Link
                                href={href}
                                key={type.id}
                                scroll={false}
                            >
                                <a>
                                    <FilterBtn active={active}>
                                        {type.name}
                                    </FilterBtn>
                                </a>
                            </Link>
                        )
                    })}
                </Col>
                <Col
                    className="color-[#000000e6] fw-500 fs-[16px] text-right py-[5px]"
                    span={2}
                >
                    平台:
                </Col>
                <Col span={22}>
                    <Link
                        href={{ query: { ...query, ...dftpg, platformId: null } }}
                        scroll={false}
                    >
                        <a>
                            <FilterBtn active={!platformId}>
                                全部
                            </FilterBtn>
                        </a>
                    </Link>
                    {platforms.map((platform) => {
                        const active = platformId == platform.id;
                        const href = { query: { ...query, ...dftpg, platformId: platform.id } };
                        return (
                            <Link
                                href={href}
                                key={platform.id}
                                scroll={false}
                            >
                                <a>
                                    <FilterBtn active={active}>
                                        {platform.name}
                                    </FilterBtn>
                                </a>
                            </Link>
                        )
                    })}
                </Col>
                <Col
                    className="color-[#000000e6] fw-500 fs-[16px] text-right py-[5px]"
                    span={2}
                >
                    区域:
                </Col>
                <Col span={22}>
                    <Link
                        href={{ query: { ...query, ...dftpg, area: null } }}
                        scroll={false}
                    >
                        <a>
                            <FilterBtn active={!areaId}>
                                全部
                            </FilterBtn>
                        </a>
                    </Link>
                    {areas.map((area) => {
                        const active = area.id == areaId;
                        const href = { query: { ...query, ...dftpg, area: area.id } };
                        return (
                            <Link
                                href={href}
                                key={area.id}
                                scroll={false}
                            >
                                <a>
                                    <FilterBtn active={active}>
                                        {area.name}
                                    </FilterBtn>
                                </a>
                            </Link>
                        )
                    })}
                </Col>
            </Row>
        </Card>
    )
}

/**排序 */
const Sort: React.FC = () => {
    const { query } = useRouter();
    const order = query.order as orderType;
    const sort = query.sort as sortType;

    return (
        <Card
            size={"small"}
            bordered={false}
            className={"mb-[20px]"}
        >
            <Space size={15}>
                {(() => {
                    const timeSort = { ...query, sort: "create_at", order: order === "asc" ? "desc" : "asc" };
                    const active: boolean = sort === "create_at";
                    return (
                        <Link href={{ query: timeSort }}>
                            <a>
                                <Button
                                    type={"link"}
                                    className={cx({ ["color-[primary]"]: active })}
                                >
                                    综合
                                    {
                                        (active && order === "asc")
                                            ? <SortAscendingOutlined />
                                            : <SortDescendingOutlined />
                                    }
                                </Button>
                            </a>
                        </Link>
                    )
                })()}
                {(() => {
                    const timeSort = { ...query, sort: "praise_num", order: order === "asc" ? "desc" : "asc" };
                    const active: boolean = sort === "praise_num";
                    return (
                        <Link href={{ query: timeSort }}>
                            <a>
                                <Button
                                    type={"link"}
                                    className={cx({ ["color-[primary]"]: active })}
                                >
                                    人气
                                    {
                                        (active && order === "asc")
                                            ? <SortAscendingOutlined />
                                            : <SortDescendingOutlined />
                                    }
                                </Button>
                            </a>
                        </Link>
                    )
                })()}
            </Space>
        </Card>
    )
}

/**分页数据 */
const DataSource: React.FC = () => {

    const { query } = useRouter();
    const { pageData } = useContext(SupplierIndexContext);

    if (!pageData.total) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        )
    }
    const mainClassns = css`
      img{
        object-fit:initial
      }
    `;
    return (
        <Fragment>
            <Row gutter={[16, 20]} className={"mb-[20px]"}>
                {pageData.records.map((item) => {
                    const [image] = item.productImage;
                    const cover = (
                        <Avatar
                            src={image}
                            className={cx(mainClassns, "br-a-[5px]")}
                            shape={"square"}
                            style={{ height: 160 }}
                        />
                    );
                    return <Col span={8} key={item.id}>
                        <Link
                            href={"/server/[id]"}
                            as={`/server/${item.id}`}
                        >
                            <a target={"_blank"}>
                                <Card
                                    bordered={false}
                                    cover={cover}
                                    size={"small"}
                                    className={"br-a-[5px] hover"}
                                >
                                    <h5 className="mb-[0px] color-[#000000e6] fs-[14px] fw-500 lc-1">
                                        {item.name}
                                    </h5>
                                    <p className="mb-[0px] color-[#00000099] fs-[14px] fw-500 lc-1 nohover">
                                        {item.description}
                                    </p>
                                    {/* <p className="color-[#00000066] fs-[12px]">
                                        { }
                                    </p> */}
                                </Card>
                            </a>
                        </Link>
                    </Col>
                })}
            </Row>

            <Pagination
                className="float-right"
                total={pageData.total}
                current={pageData.current}
                pageSize={pageData.size}
                showSizeChanger={false}
                itemRender={(current: number, type, element) => {
                    const href = { query: { ...query, current } }
                    return <Link
                        href={href}
                        scroll={false}
                    >
                        <a className="pa-[0px]">
                            {type === 'page' ? current : element}
                        </a>
                    </Link>
                }}
            />
        </Fragment>
    )
}

/**推荐供应商 */
export const Commend: React.FC = () => {
    // const { commends } = useContext(SupplierIndexContext);
    const [ads2, setAds2] = useState<Advert[]>()
    /**右侧广告 */
    useEffect(() => {
        pageAd({ adSiteKey: "server_right_banner_01" }).then(res => {
            setAds2(res.data.records)
        })
    }, [])
    return (
        <Card bordered={false} title={"推荐供应商/服务"}>
            <Space
                direction={"vertical"}
                className={"w-[100%]"}
                size={16}
            >
                {ads2?.map((advert) => (
                    <a
                        target={"_blank"}
                        href={advert.url}
                        key={advert.id}
                        className={"block"}
                    >
                        <img src={advert.picUrl} className={"w-[100%]"} />
                    </a>
                ))}
                {/* {commends.map((item) => {
                const [src] = item.companyUrl;
                return (
                    <Link
                        key={item.id}
                        href={"/industry/store/[id]/infos"}
                        as={`/industry/store/${item.id}/infos`}
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
            })} */}
            </Space>
        </Card>
    )
}

interface FilterBtn extends ButtonProps {
    active?: boolean;
}

const FilterBtn: React.FC<FilterBtn> = ({ children, active }) => {

    const classns = css`
        background-color: #F676A633;
        color: ${process.env.PRIMARY_COLOR} !important;
    `;

    return (
        <Button
            className={cx({ [classns]: active })}
            type={"text"}
        >
            {children}
        </Button>
    )
}