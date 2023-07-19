import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { NextPage } from "next";
import React, { Fragment, useContext } from "react";
import { Avatar, Card, Col, Row, Space } from "antd";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { getPlatformStatus } from "@/apis/platform";
import qs from "qs";
import { CustomNextPageContext } from "@/pages/_app";
import { setPlatformStatus } from "@/redux/actions/platformActions";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { getArticlePlatformList } from "@/apis/home";
import { ActivityPlatform, SupplierServiceTypeDto } from "@/vo/Encyclopedia";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-platform-index` });

interface PlatformIndexContextProps extends PlatformIndexPageProps {

}

const PlatformIndexContext = React.createContext<PlatformIndexContextProps>({} as PlatformIndexContextProps);

interface PlatformIndexPageProps {
    platforms: ActivityPlatform[];
}

type platformType = "mainstream" | "new" | "b2b" | "independence";

const PlatformIndexPage: NextPage<PlatformIndexPageProps> = (props) => {

    const ctxValue: PlatformIndexContextProps = {
        ...props
    }

    return (
        <PlatformIndexContext.Provider value={ctxValue}>
            <SeoHead
                title="跨境电商平台入驻__跨境知道"
                keyword="跨境电商,账号注册,平台入驻"
                description="跨境知道关注跨境电商一系列行业动态、平台政策、新闻资讯、运营干货、新外贸等讯息，帮助跨境卖家最快掌握跨境行业动态，了解最全、最新的实操经验!"
            />
            <MinHead />

            {/* 顶部banner */}
            <img
                src={"/asset/image/platform-index-banner.png"}
                className={"w-[100%]"}
            />

            <Container>
                {/* 顶部tab、搜索 */}
                <Tabs />

                {/* 服务 */}
                <Servers />
            </Container>
            <Footer />
        </PlatformIndexContext.Provider>
    )
}

PlatformIndexPage.getInitialProps = async (ctx: CustomNextPageContext) => {
    const platformStatus = ctx.query.platformStatus as platformType;
    const name = ctx.query.name as string;

    let platforms: ActivityPlatform[] = [];

    /**设置平台状态 */
    let statusArray = ctx.reduxStore.getState().platformReducer.status;
    if (!statusArray) {
        statusArray = (await getPlatformStatus()).data;
        setPlatformStatus(statusArray)(ctx.reduxStore.dispatch);
    }

    const [last] = statusArray;
    if (!platformStatus) {
        /**没有平台类型参数则重定向 */
        const location = `${ctx.asPath}?${qs.stringify({ ...ctx.query, platformStatus: last.value })}`;
        if (process.browser) {
            router.push(location);
        } else {
            ctx.res?.writeHead(302, { location });
        }
    } else {
        /**获取平台数据 */
        platforms = (await getArticlePlatformList({ platformStatus, name })).data;
    }

    return {
        platforms,
    }
}

export default PlatformIndexPage;

/**顶部tab、搜索 */
const Tabs: React.FC = () => {

    const router = useRouter();
    const statusArray = useSelector((state: MainReduxState) => state.platformReducer.status);

    const TabsContent: React.FC = () => {

        const platform = router.query.platformStatus;

        const activeCls = css`
            &::after {
                content: "";
                display: block;
                position: absolute;
                width: 12px;
                height: 2px;
                background: ${process.env.PRIMARY_COLOR};
                border-radius: 100px 100px 100px 100px;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
            }
        `;

        return (
            <Space size={40}>
                {statusArray?.map(({ name, value }, index) => {
                    const query = { ...router.query, platformStatus: value };
                    const active = platform === value;
                    return (
                        <Link href={{ query }} key={index} scroll={false}>
                            <a className={cx("color-[#000000e6] fs-[16px] relative", { [activeCls]: active })}>
                                {name}
                            </a>
                        </Link>
                    )
                })}
            </Space>
        )
    }

    const onSearch = (value: string) => {
        const { pathname, query } = router;
        router.replace({ pathname, query: { ...query, name: value } });
    }

    return (
        <Row className="mt-[30px] mb-[20px]" align={"middle"}>
            <Col span={19}>
                <TabsContent />
            </Col>
            <Col span={5}>
                <SearchInput
                    defaultValue={router.query.name}
                    size={"large"}
                    placeholder={"请输入想找的平台"}
                    onSearch={onSearch}
                    enterButton={<span className="px-[10px]"><img width={30} src="/asset/image/search_ic.png" /></span>}
                />
            </Col>
        </Row>
    )
}

/**平台服务 */
const Servers: React.FC = () => {
    const { platforms } = useContext(PlatformIndexContext);

    const PlatformCard: React.FC<ActivityPlatform> = (props) => {

        const title = (
            <CardTitle
                title={`${props.name}一站式服务`}
                desc={props.platformDescription}
            />
        )

        const cls = css`
            height: 98px;
            background: #F6F9FB;
            box-shadow: 0px 2px 2px 1px rgba(41, 41, 41, 0.0300);
        `;

        const Server: React.FC<SupplierServiceTypeDto> = (props) => {
            const { coinUrl, description, name } = props;
            const [src] = coinUrl;
            return (
                <Row className={cx(
                    cls,
                    "pa-[15px] hover"
                )}>
                    <Col span={6}>
                        <Avatar
                            src={src}
                            size={56}
                            className={"inline-block"}
                        />
                    </Col>
                    <Col span={18} className={"pl-[10px]"}>
                        <p className={cx(
                            "fs-[14px]",
                            "fw-500",
                            "mb-[0px]",
                            "color-[#000000e6]"
                        )}>
                            {name}
                        </p>
                        <p className={cx(
                            "fs-[12px]",
                            "fw-400",
                            "mb-[0px]",
                            "lc-2",
                            "color-[#00000099] nohover",
                        )}>
                            {description}
                        </p>
                    </Col>
                </Row>
            )
        }

        const DefaultServer: React.FC<{ title: string; description: string; }> = (props) => {
            const { title, description } = props;
            const bgcls = css`
                background-image: url(/asset/image/4f23b069-65df-4073-9acb-7deabe5e6a0b.png);
                background-size: cover;
                background-position: center;
            `;
            return (
                <div
                    className={cx(
                        cls,
                        bgcls,
                        "pa-[15px] hover",
                    )}
                >
                    <p className={cx(
                        "fs-[14px]",
                        "fw-500",
                        "mb-[0px]",
                        "color-[#000000e6]"
                    )}>
                        {title}
                    </p>
                    <p className={cx(
                        "fs-[12px]",
                        "fw-400",
                        "mb-[0px]",
                        "lc-2",
                        "color-[#00000099] nohover"
                    )}>
                        {description}
                    </p>
                </div>
            )
        }

        return (
            <Card bordered={false} className={"mb-[28px]"} title={title}>
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <a href={`/platformdetails/${props.id}?type=1`} target="_blank">
                            <DefaultServer
                                title={`${props.name}专区`}
                                description={
                                    "最新头条资讯、干货文章、操作技巧，助力卖家成长"
                                }
                            />
                        </a>
                        {/* </Link> */}
                    </Col>
                    <Col span={6}>
                        {/* <Link href={"/industry"}> */}
                        <a href={`/industry`} target="_blank">
                            <DefaultServer
                                title={"产业带专区"}
                                description={"整合国内产业带，深度链接工厂卖家地方政府"}
                            />
                        </a>
                        {/* </Link> */}
                    </Col>
                    {props.supplierServiceTypeDTO?.map((item) => {
                        const query = { categoryId: item.id, platformId: props.id };
                        return (
                            <Col span={6} key={item.id}>
                                {/* <Link href={{ pathname: "/server", query }}> */}
                                <a href={`/server?categoryId=${item.id}&platformId=${props.id}`} target="_blank">
                                    <Server {...item} />
                                </a>
                                {/* </Link> */}
                            </Col>
                        );
                    })}
                </Row>
            </Card>
        );
    }

    return (
        <Fragment>
            {platforms.map((platform) => (
                <PlatformCard {...platform} key={platform.id} />
            ))}
        </Fragment>
    )
}

/**卡片样式头 */
const CardTitle: React.FC<{ title: string; desc: string }> = ({ title, desc }) => {
    return (
        <Space size={30} align={"center"}>
            <h4
                className={cx(
                    "mb-[0px]",
                    "fs-[18px]",
                    "fw-600",
                    "color-[#000000E6]"
                )}
            >
                {title}
            </h4>
            <p
                className={cx(
                    "mb-[0px]",
                    "fs-[12px]",
                    "fw-400",
                    "color-[#00000099]"
                )}
            >
                {desc}
            </p>
        </Space>
    )
}