import React, { Fragment, Key } from "react";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Head from "@/components/Header";
import Container from "@/components/Container";
import { useRouter } from "next/router";
import ScrollTags from "@/components/ScrollTags";
import qs from "qs";
import { PageParams } from "@/vo/PageParams";
import Link from "next/link";
import { Avatar, Card, Col, Row, Space } from "antd";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { find } from "lodash";
import { IndustrialBelt } from "@/vo/Domain";
import { UrlObject } from "url";

import createEmotion from "@emotion/css/create-instance";

const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-domain-layout` });

const dftpg: PageParams = { current: 1, size: 10 };

interface DomainPageLayoutProps {
}

const DomainPageLayout: React.FC<DomainPageLayoutProps> = ({ children }) => {

    const classns = css`
        margin-top: -45px;
    `;

    return (
        <Fragment>
            <Head />
            <Banner />
            <Container className={cx(classns, "relative")}>
                {/* 类目 */}
                <Tags />

                {/* 二级分类 */}
                <Categorys />

                {/* 左侧服务商、商品切换 */}
                <TypeSwitch />

                {children}
            </Container>
            <Footer />
        </Fragment>
    )
}

export default DomainPageLayout;

const Banner: React.FC = () => {
    const cls = css`
        height: 183px;
    `;
    return (
        <div className={cx("w-[100%]", cls)} />
    )
}

/**类目 */
export const Tags: React.FC = () => {
    const router = useRouter();
    const href: UrlObject = { query: { ...router.query, categoryId: undefined, area: undefined, ...dftpg } };
    const categorys = useSelector((state: MainReduxState) => state.domainReducer.categorys);

    const cls = css`
        padding: 0 !important;
        margin-bottom: 15px;
    `;

    const itemCls = css`
        padding: 0 !important;

        &::before {
            display: none;
        }

        &:hover {
            background-color: #F0F7FDFF;
        }
    `;

    const acls = css`
        height: 87px;
        justify-content: center;
        padding: 0 40px;
    `;

    const active = css`
        background-color: #F0F7FDFF;
    `;

    return (
        <Fragment>
            {/* @ts-ignore */}
            <ScrollTags
                activeKey={router.query.categoryId as Key}
                className={cls}
            >
                <ScrollTags.Item
                    tagsKey={"all"}
                    className={itemCls}
                    activeClassName={active}
                >
                    <Link href={href} scroll={false}>
                        <a className={cx(
                            "flex",
                            "flex-column",
                            "row-center",
                            "dg-js-c",
                            acls,
                        )}>
                            <Avatar
                                shape={"square"}
                                className={"mb-[5px]"}
                            />
                            <div className="color-[#00000099] fs-[14px]">
                                全部
                            </div>
                        </a>
                    </Link>
                </ScrollTags.Item>
                {categorys?.map((category) => {
                    const [image] = category.coinUrl;
                    const query = qs.stringify({ ...router.query, categoryId: category.id, area: undefined, ...dftpg });
                    const href = `${router.pathname}?${query}`;
                    return <ScrollTags.Item
                        tagsKey={category.id}
                        key={category.name}
                        className={itemCls}
                        activeClassName={active}
                    >
                        <Link href={href} scroll={false}>
                            <a className={cx(
                                "flex",
                                "flex-column",
                                "row-center",
                                "dg-js-c",
                                acls,
                            )}>
                                <Avatar
                                    src={image}
                                    shape={"square"}
                                    className={"mb-[5px]"}
                                />
                                <div className="color-[#00000099] fs-[14px]">
                                    {category.name}
                                </div>
                            </a>
                        </Link>
                    </ScrollTags.Item>
                })}
            </ScrollTags>
        </Fragment>
    )
}

/**二级分类筛选 */
const Categorys: React.FC = () => {

    const router = useRouter();
    const categorys = useSelector((state: MainReduxState) => state.domainReducer.categorys);
    const categoryId = router.query.categoryId;

    const current = find(categorys, { id: categoryId }) as IndustrialBelt;
    if (!current) return <Fragment />;

    const query = { ...router.query, area: undefined, ...dftpg };
    const className = !router.query.area ? "color-[#000000e6] fw-500" : "color-[#00000099]";

    return (
        <Card
            bordered={false}
            className={"mt-[20px] mb-[20px]"}
            size={"small"}
        >
            <Row>
                <Col span={1}>
                    区域:
                </Col>
                <Col span={23}>
                    <Space size={20} wrap>
                        <Link href={{ query }}>
                            <a className={className}>全部</a>
                        </Link>
                        {current.secondCategoryList.map((category) => {
                            const query = { ...router.query, area: category.id, ...dftpg };
                            const active = router.query.area === category.id;
                            const className = active ? "color-[#000000e6] fw-500" : "color-[#00000099]";
                            return <Link href={{ query }}>
                                <a className={className}>
                                    {category.name}
                                </a>
                            </Link>
                        })}
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}

/**左侧服务商、商品切换 */
const TypeSwitch: React.FC = () => {

    const router = useRouter();

    interface SwitchItem {
        text: string;
        type: string;
    }

    const items: SwitchItem[] = [
        { text: "找商品", type: "/industry/product" },
        { text: "找服务商", type: "/industry/store" },
    ];

    const activeClassns = css`
        background-color: ${process.env.PRIMARY_COLOR};
        color: #fff;

        &::after {
            content: "";
            display: block;
            width: 0;
            height: 0;
            border: 5px solid ${process.env.PRIMARY_COLOR};
            border-color: transparent transparent transparent ${process.env.PRIMARY_COLOR};
            position: absolute;
            right: -10px;
            top: 50%;
            transform: translateY(-50%);
        }
    `;

    const cls = css`
        position: absolute;
        top: 180px;
        left: -75px;
        background: #FFFFFF;
        border-radius: 2px;
    `;

    const itemCls = css`
        padding: 10px;
        display: block;
        width: 57px;
        height: 64px;
        text-align: center;
        position: relative;
        border-radius: 2px;
    `;

    return (
        <div className={cls}>
            {items.map((item, index) => {
                const query = { ...router.query, ...dftpg };
                const pathname = item.type;
                const active = router.pathname === item.type;
                return <Link href={{ pathname, query }} key={index}>
                    <a className={cx(itemCls, { [activeClassns]: active })}>
                        {item.text}
                    </a>
                </Link>
            })}
        </div>
    )
}