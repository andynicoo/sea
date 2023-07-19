import {
    getIndustrialBeltList,
    getServerPistPage,
    getServerProductPage,
    postIndustrialBeltList,
} from "@/apis/server";
import { PageParams, PageSource } from "@/vo/PageParams";
import { NextPage } from "next";
import React, { Fragment, Key, useContext } from "react";
import { compact, find } from "lodash";
import { CustomNextPageContext } from "../_app";
import qs from "qs";
import router, { useRouter } from "next/router";
import {
    IndustrialBelt,
    IndustrialBeltArea,
    Product,
    Store,
} from "@/vo/Domain";
import { setDomainCategorys } from "@/redux/actions/domainActions";
import { MinHead } from "@/components/Header";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { Avatar, Card, Col, Empty, Pagination, Popover, Row, Space } from "antd";
import Link from "next/link";
import { UrlObject } from "url";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import ScrollTags from "@/components/ScrollTags";
import Icon from "@/components/Icon";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
    key: `${process.env.CLASS_PREFIX}-pg-domain-store-id-infos`,
});

interface DomainIndexContextProps extends DomainIndexPageProps { }

const DomainIndexContext = React.createContext<DomainIndexContextProps>(
    {} as DomainIndexContextProps
);

interface DomainIndexPageProps {
    areas: IndustrialBeltArea[];
    productDataSources?: PageSource<Product>;
    supplierDataSources?: PageSource<Store>;
}

/**产业带 */
const DomainIndexPage: NextPage<DomainIndexPageProps> = (props) => {
    const ctxValue: DomainIndexContextProps = {
        ...props,
    };

    const cls = css`
    margin-top: -27px !important;
    margin-bottom: 15px !important;
  `;

    return (
        <DomainIndexContext.Provider value={ctxValue}>
            <MinHead />
            <Banner />
            <Container className={cls}>
                {/* 一级类目 */}
                <Tags />

                <Row gutter={15}>
                    {/* 区域 */}
                    <Col span={4}>
                        <Areas />
                    </Col>

                    {/* 内容主体 */}
                    <Col span={20}>
                        {/* 产业广告图*/}
                        <BeltAD />
                        {/* 条件过滤 */}
                        <Filter />

                        {/* 商品分页 */}
                        <Products />

                        {/* 供应商分页 */}
                        <Suppliers />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </DomainIndexContext.Provider>
    );
};

type pageType = "products" | "suppliers" | undefined;

DomainIndexPage.getInitialProps = async (ctx: CustomNextPageContext) => {
    const type = ctx.query.type as pageType;
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key || 40;
    const parentCategoryId = ctx.query.parentCategoryId as Key;
    const categoryId = ctx.query.categoryId as Key;
    const betIds = compact([ctx.query.area as Key]);

    /**默认选中找商品 */
    if (!type) {
        const defaultQuery: PageParams = {
            current: 1,
            size: 40,
            type: "products",
            parentCategoryId: "",
            categoryId: "",
            betIds: "",
        };
        if (process.browser) {
            router.push({ pathname: "/industry", query: defaultQuery });
        } else {
            const location = `/industry?${qs.stringify(defaultQuery)}`;
            ctx.res?.writeHead(302, { location });
        }

        return {} as DomainIndexPageProps;
    }

    const areaParams: PageParams = {
        current: 1,
        size: 1000,
        categoryId: parentCategoryId,
    };

    const pageParams: PageParams = {
        current,
        size,
        betIds,
        categoryId,
        parentCategoryId,
        status: "NORMAL",
    };

    let categorys = ctx.reduxStore.getState().domainReducer.categorys;
    let productDataSources: PageSource<Product> | undefined;
    let supplierDataSources: PageSource<Store> | undefined;

    /**类目 */
    if (!categorys) {
        categorys = (await getIndustrialBeltList()).data;
        setDomainCategorys(categorys)(ctx.reduxStore.dispatch);
    }

    /**产业带区域 */
    const areas = (await postIndustrialBeltList(areaParams)).data.records;
    if (type === "products") {
        /**查商品 */
        productDataSources = (await getServerProductPage(pageParams)).data;
    } else if (type === "suppliers") {
        /**查供应商 */
        supplierDataSources = (await getServerPistPage({ ...pageParams, type: 'INDUSTRIAL_BELT' })).data;
    }

    return {
        areas,
        productDataSources,
        supplierDataSources,
    };
};

export default DomainIndexPage;

const defpp: PageParams = {
    current: 1,
    size: 40,
};

/**一级类目 */
const Tags: React.FC = () => {
    const router = useRouter();
    const { query } = router;
    const href: UrlObject = {
        query: {
            ...query,
            ...defpp,
            parentCategoryId: null,
            categoryId: null,
            area: null,
        },
    };
    const categorys = useSelector(
        (state: MainReduxState) => state.domainReducer.categorys
    );
    const itemCls = css`
    padding: 0 !important;

    &::before {
      display: none;
    }

    &:hover {
      background-color: #f0f7fdff;
       a div {color: #000;}
    }
  `;

    const acls = css`
    height: 87px;
    justify-content: center;
    padding: 0 40px;
  `;

    const active = css`
    background-color: #f0f7fdff;
    a div {color: #000;}
  `;

    return (
        <Fragment>
            {/* @ts-ignore */}
            <ScrollTags
                activeKey={query.parentCategoryId as Key}
                className={"mb-[15px]"}
                style={{ padding: 0 }}
            >
                {categorys?.map((category) => {
                    const [image] = category.coinUrl;
                    const href: UrlObject = {
                        query: {
                            ...query,
                            ...defpp,
                            parentCategoryId: category.id,
                            categoryId: null,
                            area: null,
                        },
                    };
                    return (
                        <ScrollTags.Item
                            tagsKey={category.id}
                            key={category.name}
                            className={itemCls}
                            activeClassName={active}
                        >
                            <Link href={href} scroll={false}>
                                <a className={cx("flex", "flex-column", "row-center", acls)}>
                                    <Avatar
                                        src={image}
                                        shape={"square"}
                                        className={"mb-[5px]"}
                                        size={36}
                                    />
                                    <div className="color-[#00000099] fs-[14px]">
                                        {category.name}
                                    </div>
                                </a>
                            </Link>
                        </ScrollTags.Item>
                    );
                })}
            </ScrollTags>
        </Fragment>
    );
};

/**顶部banner */
const Banner: React.FC = () => {
    const cls = css`
    height: 183px;
    background: linear-gradient(14deg, #3d99ff 0%, #bd03fe 99%, #bd03fe 100%);
    box-shadow: 0px 4px 4px 1px rgba(0, 0, 0, 0.01);
    border-radius: 0px 0px 0px 0px;
    background-image: url(/asset/image/domain-banner.png);
    background-position: center;
    background-size: cover;
  `;

    return <div className={cls}></div>;
};

/**区域 */
const Areas: React.FC = () => {
    const { areas } = useContext(DomainIndexContext);
    const { query } = useRouter();
    const area = query.area as Key;

    interface AreaProps {
        id?: Key;
    }

    const Area: React.FC<AreaProps> = (props) => {
        const { id, children } = props;

        const cls = css`
      padding: 0 16px 0 24px;
      height: 50px;
      line-height: 50px;
      display: block;
      margin-bottom: 1px;
      position: relative;

      &:hover {
        background-color: #f0f7fdff;
      }

      &::after {
        content: "";
        display: block;
        margin: 0 16px 0 24px;
        height: 1px;
        width: calc(100% - 40px);
        background-color: #e6e6e6ff;
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translateY(1px);
      }

      &:last-child {
        margin-bottom: 0;

        &::after {
          display: none;
        }
      }
    `;

        const activeCls = css`
      background-color: #f0f7fdff;
    `;

        const active = props.id === area;

        const href: UrlObject = { query: { ...query, area: id } };

        return (
            <Link href={href}>
                <a className={cx(cls, { [activeCls]: active })}>
                    <Row>
                        <Col span={22}>{children}</Col>
                        <Col span={2}>
                            <Icon type={"icon-youjiantou"} />
                        </Col>
                    </Row>
                </a>
            </Link>
        );
    };

    Area.defaultProps = { id: "" };
    const listCls = css`
    max-height: 610px;
    overflow-y: auto;
    `

    return (
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
            <Area>全部</Area>
            <div className={cx(listCls)}>
                {areas?.map((area) => (
                    <Area key={area.id} id={area.id}>
                        {area.nickName}
                    </Area>
                ))}
            </div>
        </Card>
    );
};
/**产业带广告图 */
const BeltAD: React.FC = () => {
    const { query } = useRouter();
    const parentCategoryId = query.parentCategoryId as Key;
    const { areas } = useContext(DomainIndexContext);
    const area = query.area as Key;
    const categorys: any = useSelector(
        (state: MainReduxState) => state.domainReducer.categorys
    );
    let categorysItem = { adUrl: [] };
    let areaItem: any = {};
    if (parentCategoryId) {
        categorysItem = categorys.filter(
            (item: any) => item.id == parentCategoryId
        )[0];
    } else {
        categorysItem = categorys[0];
    }
    if (area) {
        areaItem = areas.filter((item: any) => item.id == area)[0];
    } else {
        areaItem = areas[0];
    }
    const itemTitle = css`
        top: 0px;
        left: 0px;
        width: 362px;
        height: 160px;
        background: linear-gradient(90deg, #0A0A0A 0%, rgba(40,40,40,0.7900) 100%);
        border-radius: 3px 0px 0px 3px;
        backdrop-filter: blur(5px);
        padding: 24px 24px 0 24px;
        line-height: 16px;
  `;
    const itemText = css`
    border-left: 3px solid #fff;
  `;
    const desCls = css`
    width: 360px;
    padding:10px ;
   `
    return (
        <Fragment>

            <div
                className={cx(
                    "w-[100%]",
                    "bg-color-[#ffffff]",
                    "mb-[20px]",
                    "color-[#ffffff]",
                    "relative",
                    "h-[160px]"
                )}
            >
                <img
                    src={categorysItem.adUrl[0]}
                    alt=""
                    className="w-[100%] h-[100%]"
                />
                {/* <Popover placement="rightTop" content={<div
                    className={cx(desCls, "rich-text")}
                    dangerouslySetInnerHTML={{ __html: areaItem?.description as string }}
                />}> */}
                <div className={cx("absolute", itemTitle)}>
                    <div className={cx("fw-600 pl-[10px] fh-[16px]", itemText)}>
                        {areaItem?.nickName}
                    </div>
                    {areaItem?.categoryName && <p className="fw-400 fs-[12px] mt-[15px] lc-2">
                        {"< " + areaItem?.categoryName.join(",") + " >"}
                    </p>}
                    {/* <p className="text-left fs-[12px] mt-[10px] lc-3">
                            {areaItem?.description.replace(/(&nbsp;)|<\/?[^>]*>/g, '')}
                        </p> */}
                </div>
                {/* </Popover> */}
            </div>
        </Fragment >
    );
};

/**条件过滤 */
const Filter: React.FC = () => {
    const { query } = useRouter();
    const categoryId = query.categoryId as Key;
    const parentCategoryId = query.parentCategoryId as Key;
    const type = query.type as pageType;

    const categorys = useSelector(
        (state: MainReduxState) => state.domainReducer.categorys
    );
    const category = find(categorys, { id: parentCategoryId }) as IndustrialBelt;

    interface CategoryProps {
        id?: Key;
    }

    /**二级分类 */
    const Categorys: React.FC = () => {
        const Category: React.FC<CategoryProps> = (props) => {
            const href: UrlObject = {
                query: { ...query, categoryId: props.id, current: 1 },
            };
            const active = props.id === categoryId;
            const cls = cx({ ["color-[#000000e6] fw-600"]: active });
            return (
                <Link href={href}>
                    <a className={cls}>{props.children}</a>
                </Link>
            );
        };

        Category.defaultProps = { id: "" };

        if (!category) return <Fragment />;

        return (
            <Fragment>
                <Col className="fs-[16px] text-right" span={3}>
                    涉及行业:
                </Col>
                <Col span={21}>
                    <Space size={20} wrap>
                        <Category>全部</Category>
                        {category?.secondCategoryList.map((category) => (
                            <Category id={category.id}>{category.name}</Category>
                        ))}
                    </Space>
                </Col>
            </Fragment>
        );
    };

    /**商品、供应商分类 */
    const Types: React.FC = () => {
        const types: { name: string; type: pageType }[] = [
            { name: "找商品", type: "products" },
            { name: "找供应商", type: "suppliers" },
        ];

        interface TypeProps {
            type: pageType;
        }

        const Type: React.FC<TypeProps> = (props) => {
            const active = props.type === type;
            const cls = cx({ ["color-[#000000e6] fw-600"]: active });
            const href: UrlObject = {
                query: { ...query, type: props.type, current: 1 },
            };
            return (
                <Link href={href} key={props.type}>
                    <a className={cls}>{props.children}</a>
                </Link>
            );
        };

        return (
            <Fragment>
                <Col className="fs-[16px] text-right" span={3}>
                    服务类型:
                </Col>
                <Col span={21}>
                    <Space size={20} wrap>
                        {types.map((item) => (
                            <Type type={item.type} key={item.type}>
                                {item.name}
                            </Type>
                        ))}
                    </Space>
                </Col>
            </Fragment>
        );
    };

    return (
        <Fragment>
            <Card size={"small"} bordered={false} className={"mb-[15px]"}>
                <Row gutter={[20, 20]} align={"middle"} className={"color-[#00000099]"}>
                    <Categorys />
                    <Types />
                </Row>
            </Card>
        </Fragment>
    );
};

/**商品分页 */
const Products: React.FC = () => {
    const { query } = useRouter();
    const type = query.type as pageType;

    const { productDataSources } = useContext(DomainIndexContext);

    const Product: React.FC<Product> = (props) => {
        const [src] = props.productImage;
        const cover = <Avatar style={{ height: 237, width: 237 }} shape={"square"} src={src} />;
        return (
            <Link
                href={"/industry/product/[id]"}
                as={`/industry/product/${props.id}`}
            >
                <a target={"_blank"}>
                    <Card cover={cover} bordered={false} size={"small"} className="hover">
                        <p className="ma-[0px] color-[#000000e6] fw-500 lc-1">
                            {props.name}
                        </p>
                        {/* <p className="ma-[0px] color-[#00000099] fw-400 fs-[12px] lc-2 h-[35px]">
                            {props.description}
                        </p> */}
                        <p
                            className="ma-[0px] color-[#00000099] fw-400 fs-[12px] lc-2 h-[35px] rich-text"
                            dangerouslySetInnerHTML={{ __html: props.description as string }}
                        ></p>
                    </Card>
                </a>
            </Link>
        );
    };

    if (type !== "products" || !productDataSources) {
        return <Fragment />;
    }

    const { current, records, size, total } = productDataSources;

    if (!records.length) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        );
    }

    return (
        <Fragment>
            <Row gutter={[16, 16]}>
                {records.map((item) => (
                    <Col span={6} key={item.id}>
                        <Product {...item} />
                    </Col>
                ))}
            </Row>
            <Pagination
                className="float-right mt-[10px]"
                current={current}
                pageSize={size}
                total={total}
                showSizeChanger={false}
                itemRender={(page, type, element) => {
                    const href: UrlObject = { query: { ...query, current: page } };
                    return (
                        <Link href={href}>
                            <a>{type === 'page' ? page : element}</a>
                        </Link>
                    );
                }}
            />
        </Fragment>
    );
};

/**供应商分页 */
const Suppliers: React.FC = () => {
    const { query } = useRouter();
    const type = query.type as pageType;
    const { supplierDataSources } = useContext(DomainIndexContext);

    const Supplier: React.FC<Store> = (props) => {
        const [src] = props.companyUrl;
        const cover = <Avatar shape={"square"} style={{ height: 237, width: 237 }} src={src} />;
        return (
            <Link
                href={"/industry/store/[id]/infos"}
                as={`/industry/store/${props.id}/infos`}
            >
                <a>
                    <Card cover={cover} bordered={false} size={"small"}>
                        <Row>
                            <Col span={17} className="ma-[0px] color-[#000000e6] fw-500 lc-1">
                                {props.name}
                            </Col>
                            <Col span={7} className={"color-[#00000066] fs-[12px]"}>
                                <Icon type={"icon-position"} />
                                {props.cityCode}
                            </Col>
                        </Row>
                        {/* <p className="ma-[0px] color-[#00000099] fw-400 fs-[12px] lc-2 h-[35px]">
              {props.description}
            </p> */}
                        <p
                            className="ma-[0px] color-[#00000099] fw-400 fs-[12px] lc-2 h-[35px] rich-text"
                            dangerouslySetInnerHTML={{ __html: props.description as string }}
                        ></p>
                    </Card>
                </a>
            </Link>
        );
    };

    if (type !== "suppliers" || !supplierDataSources) {
        return <Fragment />;
    }

    const { current, records, size, total } = supplierDataSources;

    if (!records.length) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        );
    }

    return (
        <Fragment>
            <Row gutter={[16, 16]}>
                {records.map((item) => (
                    <Col key={item.id} span={6}>
                        <Supplier {...item} />
                    </Col>
                ))}
            </Row>
            <Pagination
                className="float-right mt-[10px]"
                current={current}
                pageSize={size}
                total={total}
                showSizeChanger={false}
                itemRender={(page, type, element) => {
                    const href: UrlObject = { query: { ...query, current: page } };
                    return (
                        <Link href={href}>
                            <a>{type === 'page' ? page : element}</a>
                        </Link>
                    );
                }}
            />
        </Fragment>
    );
};
