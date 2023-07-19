import { kjzdActivityPlatformListAll } from "@/apis/encyclopedia";
import { getActivityPage, pageAd } from "@/apis/home";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { Advert } from "@/vo/Basic";
import { ActivityPlatform } from "@/vo/Encyclopedia";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Activity, Sponsor } from "@/vo/Users";
import { NextPage } from "next";
import React, { Key, useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import { Avatar, Card, Col, List, Row, Space, Tag, Pagination as AntdPagination, Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { PlusOutlined } from "@ant-design/icons";

import createEmotion from '@emotion/css/create-instance'
import Authorization from "@/components/Authorization";
import SearchInput from "@/components/SearchInput";
import { getKjzdActivitySponsorList } from "@/apis/users";
const { cx, css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-activity` });

SwiperCore.use([Autoplay, Pagination]);

interface ActivityIndexContentProps extends ActivityIndexPageProps {

}

const ActivityIndexContent = React.createContext<ActivityIndexContentProps>({} as ActivityIndexContentProps);

interface ActivityIndexPageProps {
    activitys: PageSource<Activity>;
    platforms: ActivityPlatform[];
    adverts: Advert[];
}

/**活动峰会主页 */
const ActivityIndexPage: NextPage<ActivityIndexPageProps> = (props) => {
    const ctxValue: ActivityIndexContentProps = {
        ...props
    }
    const acdDefaultLayout = css`
        width: auto!important;
        padding-top: 0!important;
`
    return (
        <ActivityIndexContent.Provider value={ctxValue}>
            <SeoHead
                title="跨境电商活动__跨境知道"
                keyword="跨境电商活动,亚马逊活动,ebay活动"
                description="跨境知道电商活动平台全行业(亚马逊、ebay、wish、Jumia、速卖通等)活动信息发布窗口，汇集各类平台活动、高峰论坛、卖家聚会、行业展会和选品大会等。"
            />
            <MinHead />
            <Container className={acdDefaultLayout}>
                <SwiperContent />

                <div style={{ width: "1200px", margin: '0 auto' }}><ListContent /></div>
            </Container>
            <Footer />
        </ActivityIndexContent.Provider>
    )
}

ActivityIndexPage.getInitialProps = async (ctx) => {
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key;
    const platform = ctx.query.platform as Key;
    const type = ctx.query.type as Key;
    const keyword = ctx.query.keyword as string;

    /**活动参数 */
    const params: PageParams = {
        current,
        size,
        platform,
        type,
        keyword,
    }

    /**广告参数 */
    const advertParams: PageParams = {
        current: 1,
        size: 10,
        adSiteKey: "activity_top_banner_01"
    }

    const activitys = (await getActivityPage(params)).data;
    const platforms = (await kjzdActivityPlatformListAll()).data;
    const adverts = (await pageAd({ adSiteKey: 'activity_top_banner_01' })).data.records;

    return {
        activitys,
        platforms,
        adverts,
    }
}

export default ActivityIndexPage;

/**广告轮播 */
const SwiperContent: React.FC = () => {
    const { adverts } = useContext(ActivityIndexContent);

    return (
        <Swiper autoplay loop pagination>
            {adverts.map((advert) => {

                const cls = css`
                    display: block;
                    background-image: url(${advert.picUrl});
                    width: 100%;
                    height: 300px;
                    background-size: cover;
                    background-position: center;
                `;

                return (
                    <SwiperSlide key={advert.id}>
                        <a
                            className={cls}
                            target={"_blank"}
                            href={advert.url}
                        />
                    </SwiperSlide>
                )
            })}
        </Swiper>

    )
}

/**主体内容 */
const ListContent: React.FC = () => {

    const { platforms, activitys } = useContext(ActivityIndexContent);
    const { query, replace, push } = useRouter();

    const Extra: React.FC = () => {

        const onSearch = (keyword: string) => {
            replace({ pathname: "/acd", query: { ...query, keyword, current: 1 } });
        }
        const [sponsorList, setSponsorList] = useState<PageSource<Sponsor>>();
        useEffect(() => {
            getKjzdActivitySponsorList({ current: 1, size: 100, status: 1 }).then((res) => {
                setSponsorList(res.data);
            });
        }, [])
        return (
            <Space size={20}>
                <SearchInput
                    className="w-[300px]"
                    size={"large"}
                    onSearch={onSearch}
                    defaultValue={query.keyword}
                    enterButton={<span className="px-[10px]"><img width={30} src="/asset/image/search_ic.png" /></span>}
                />
                <Authorization.Valid>
                    <Button
                        shape={"round"}
                        size={"large"}
                        type={"primary"}
                        onClick={() => window.open(sponsorList?.records.length ? "/acd/publish" : '/acd/sponsor', '_blank')}
                    >
                        <PlusOutlined />
                        免费发布
                    </Button>
                </Authorization.Valid>
            </Space>
        )
    }

    const Filter: React.FC = () => {

        interface TagProps {
            label: string;
            value?: Key;
        }

        const platformList: TagProps[] = platforms.map(({ id, name }) => ({ label: name, value: id }));
        platformList.unshift({ label: "全部" });

        const typeList: TagProps[] = [
            { label: "全部" },
            { label: "线上活动", value: "0" },
            { label: "线下活动", value: "1" },
        ]

        const TagItem: React.FC<TagProps & { queryKey: string }> = ({ value, label, queryKey }) => {
            const active = (query[queryKey] || undefined) === value;
            return (
                <Link
                    href={{ query: { ...query, [queryKey]: value, current: 1 } }}
                    scroll={false}
                >
                    <a>
                        <Tag className={cx(
                            "fs-[14px]",
                            "px-[10px]",
                            "border-none",
                            { ["color-[primary]"]: active },
                            { ["bg-color-[#fef1f6]"]: active },
                        )}>
                            {label}
                        </Tag>
                    </a>
                </Link>
            )
        }

        return (
            <Row gutter={[10, 20]} className={"mb-[20px]"}>
                <Col className="tx-r fw-500" span={1}>平台:</Col>
                <Col span={23}>
                    <Space wrap size={20}>
                        {platformList.map((item, index) => (
                            <TagItem {...item} key={index} queryKey={"platform"} />
                        ))}
                    </Space>
                </Col>
                <Col className="tx-r fw-500" span={1}>类型:</Col>
                <Col span={23}>
                    <Space wrap size={20}>
                        {typeList.map((item, index) => (
                            <TagItem {...item} key={index} queryKey={"type"} />
                        ))}
                    </Space>
                </Col>
            </Row>
        )
    }

    const Item: React.FC<Activity> = (props) => {
        const ActivityLink: React.FC = ({ children }) => {
            return (
                <Link
                    href={"/acd/[id]"}
                    as={`/acd/${props.id}`}
                    scroll={false}
                >
                    <a target={"_blank"}>{children}</a>
                </Link>
            )
        }

        const avatarCls = css`
            width: 144px;
            height: 67px;
        `;

        const avatar = (
            <ActivityLink>

                <Avatar
                    className={avatarCls}
                    src={props.posterUrl}
                    shape={"square"}
                />
            </ActivityLink>
        )

        const title = (
            <ActivityLink>
                <span className="db h-[30px] fw-500 fs-[18px]">{props.title}</span>
            </ActivityLink>
        )

        const description = (
            <Space size={30}>
                <span>{props.startTime}</span>
                <span>{props.province}</span>
            </Space>
        )

        return (
            <List.Item>
                <List.Item.Meta
                    avatar={avatar}
                    title={title}
                    description={description}
                />
            </List.Item>
        )
    }

    return (
        <Card
            title={"活动精选"}
            bordered={false}
            className={"my-[20px]"}
            extra={<Extra />}
        >
            <Filter />

            <List
                dataSource={activitys.records}
                pagination={false}
                renderItem={(item) => (
                    <Item {...item} />
                )}
            />
            <AntdPagination
                className="mt-[10px] float-right"
                current={activitys.current}
                total={activitys.total}
                pageSize={activitys.size}
                showSizeChanger={false}
                itemRender={(page, type, element) => (
                    <Link
                        href={{ query: { ...query, current: page } }}
                        scroll={false}
                    >
                        <a>{type === 'page' ? page : element}</a>
                    </Link>
                )}
            />
        </Card>
    )
}
