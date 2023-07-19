import DefaultLayout from "@/components/layouts/DefaultLayout";
import { NextPage } from "next";
import React, { Fragment, Key, useContext, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import createEmotion from "@emotion/css/create-instance";
import { Avatar, Button, Card, Col, Form, FormInstance, Input, List, Modal, Row, Select, Space, Tabs, Pagination as AntdPagination, message } from "antd";
import TagsSelect from "@/components/TagsSelect";
import Link from "next/link";
import { useRouter } from "next/router";
import { PageParams, PageSource } from "@/vo/PageParams";
import { UrlObject } from "url";
import { bbsPages, bbsPlatformTypeList, bbsTypeList, saveBbs } from "@/apis/bbs";

import { Bbs, BbsType } from "@/vo/Bbs";
import { Tools as ToolsVo } from "@/vo/Tools";
import Authorization from "@/components/Authorization";
import Icon from "@/components/Icon";
import { kjzdToolsListAll } from "@/apis/tools";
import { pageAd } from "@/apis/home";
import { Advert } from "@/vo/Basic";
import SeoHead from "@/components/SeoHead";
import { Adverts } from "../articles/[id]";
import { bannerClick } from "@/utils/shenCe";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-k` });

SwiperCore.use([Autoplay, Pagination, Navigation]);

interface KRoundIndexContextProps extends KRoundIndexPageProps {
}

const KRoundIndexContext = React.createContext<KRoundIndexContextProps>({} as KRoundIndexContextProps);

interface KRoundIndexPageProps {
    types: BbsType[];
    sources: PageSource<Bbs>;
    platforms: BbsType[];
    hots: Bbs[];
    tools: ToolsVo[];
    ads: Advert[];
    ads2: Advert[];
}

/**K圈首页 */
const KRoundIndexPage: NextPage<KRoundIndexPageProps> = (props) => {

    const ctxValue: KRoundIndexContextProps = {
        ...props,
    }

    return (
        <KRoundIndexContext.Provider value={ctxValue}>
            <DefaultLayout>
                <SeoHead
                    title="跨境知道官网_360万新外贸人资源平台_跨境电商服务平台_跨境电商培训_跨境电商运营"
                    keyword="跨境知道官网,跨境知道,跨境电商,跨境百科,跨境论坛,跨境电商运营,跨境最新资讯,新外贸"
                    description="跨境知道官网是中国知名跨境电商平台、交流论坛,关注跨境电商一系列行业动态、平台政策、新闻资讯、运营干货、新外贸等讯息,提供跨境电商培训、运营,帮助跨境卖家最快掌握跨境行业动态,了解最全、最新的实操经验"
                />
                {/* 轮播图 */}
                <BannerSwiper />

                <Row gutter={20}>
                    <Col span={17}>
                        <DataSource />
                    </Col>
                    <Col span={7}>
                        {/* 提问、写想法 */}
                        <Actions />
                        {/* 广告 */}
                        <Adverts adverts={props.ads2} pageName={'K圈右边栏广告位'} />
                        {/* 热门帖子 */}
                        <HotBbs hots={props.hots} />
                        {/* 跨境圈子 */}
                        {/* <Round /> */}
                        {/* 热门工具 */}
                        <Tools />
                    </Col>
                </Row>
            </DefaultLayout>
        </KRoundIndexContext.Provider>
    )
}

KRoundIndexPage.getInitialProps = async (ctx) => {
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key;
    const bbsTypeId = ctx.query.bbsTypeId as Key;
    const searchType = ctx.query.searchType as Key ? ctx.query.searchType as Key : 1;;

    const params: PageParams = {
        current,
        size,
        bbsTypeId,
        searchType,
    }

    let bbsParams: PageParams = params
    bbsParams.size = 20

    const sources = (await bbsPages(bbsParams)).data;
    const types = (await bbsTypeList()).data;
    const platforms = (await bbsPlatformTypeList()).data;
    const hots = (await bbsPages({ searchType: 5 })).data.records;
    const tools = (await kjzdToolsListAll({ current: 1, size: 10, searchType: 5 })).data.records;
    const ads = (await pageAd({ adSiteKey: 'k_ad_001' })).data.records;
    /**右侧广告 */
    const ads2 = (await pageAd({ adSiteKey: "ba_dvert" })).data.records;
    return {
        types,
        sources,
        platforms,
        hots,
        tools,
        ads,
        ads2
    }
}

export default KRoundIndexPage;

/**顶部轮播 */
const BannerSwiper: React.FC = () => {
    const { ads } = useContext(KRoundIndexContext);
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    const cls = css`
        .swiper-button-prev,
        .swiper-button-next {
            transition: all 0.5s;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
            background-color: rgba(31, 45, 61, 0.11);

            &::after {
                color: #eee;
                font-size: 10px;
            }
        }

        .swiper-button-prev {
            transform: translateX(-40px);
            opacity: 0;
        }
        .swiper-button-next {
            transform: translateX(40px);
            opacity: 0;
        }

        &:hover {
            .swiper-button-prev {
                transform: translateX(0px);
                opacity: 1;
            }
            .swiper-button-next {
                transform: translateX(0px);
                opacity: 1;
            }
        }
    `;

    return (
        <Swiper
            autoplay
            pagination
            navigation
            loop
            className={cx(cls, "mb-[20px]")}
        >
            {ads.map((item) => (
                <SwiperSlide key={item.id}>
                    <a
                        href={item.url}
                        target={"_blank"}
                        className={"flex row-center colume-center h-[220px]"}
                        onClick={()=>bannerClick({
                            bannerID: item.id, bannerName: item.adSiteName, pageName:'K圈主广告位',userId: userInfo?.userId || '',mobile:userInfo?.mobile || ''
                        })}
                    >
                        <img
                            className="w-[100%]"
                            src={item.picUrl}
                        />
                    </a>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

/**话题数据列表 */
const DataSource: React.FC = () => {

    const { types, sources } = useContext(KRoundIndexContext);
    const { query } = useRouter();
    const type = query.type as (string | undefined);
    const bbsTypeId = query.bbsTypeId ? Number(query.bbsTypeId) : undefined;

    const defaultQuery: PageParams = {
        current: 1,
        size: 40
    }

    const Categorys: React.FC = () => {

        const activeCls = css`
            color: ${process.env.PRIMARY_COLOR};
            border-color: ${process.env.PRIMARY_COLOR};
        `;

        return (
            <Space wrap size={15} className={"mb-[20px]"}>
                <Link
                    href={{ query: { ...query, ...defaultQuery, bbsTypeId: null } }}
                    scroll={false}
                >
                    <a>
                        <Button className={cx({ [activeCls]: !Boolean(bbsTypeId) })}>
                            全部
                        </Button>
                    </a>
                </Link>
                {types.map(({ name, id }) => {
                    const href: UrlObject = { query: { ...query, ...defaultQuery, bbsTypeId: id } };
                    const active: boolean = bbsTypeId === id;
                    return (
                        <Link href={href} scroll={false} key={id}>
                            <a>
                                <Button
                                    className={cx({ [activeCls]: active })}
                                >
                                    {name}
                                </Button>
                            </a>
                        </Link>
                    )
                })}
            </Space>
        )
    }

    const TabsLink: React.FC<{ id: Key }> = ({ id, children }) => (
        <Link
            href={{ query: { ...query, ...defaultQuery, searchType: id } }}
            scroll={false}
        >
            <a>{children}</a>
        </Link>
    )

    const Participates: React.FC<{ items: string[] }> = ({ items }) => {

        if (!items?.length) return <Fragment />;

        const cls = css`
            border: 2px solid #fff;
            margin-left: -10px;
        `;

        return (
            <div className="flex row-center">
                <div className="relative ml-[10px] mr-[5px]">
                    {items.map((src) => (
                        <Avatar
                            className={cls}
                            src={src}
                            size={26}
                        />
                    ))}
                </div>
                <span>{items.length}人参与</span>
            </div>
        )
    }

    return (
        <Card title={"话题分类"} bordered={false}>
            {/* 话题分类标签 */}
            <Categorys />

            {/* 筛选标签 */}
            <Tabs activeKey={type}>
                <Tabs.TabPane
                    key={"1"}
                    tab={(<TabsLink id={1}>最新</TabsLink>)}
                />
                <Tabs.TabPane
                    key={"2"}
                    tab={(<TabsLink id={2}>当天热门</TabsLink>)}
                />
                <Tabs.TabPane
                    key={"3"}
                    tab={(<TabsLink id={3}>7天热门</TabsLink>)}
                />
                <Tabs.TabPane
                    key={"4"}
                    tab={(<TabsLink id={4}>30天热门</TabsLink>)}
                />
            </Tabs>

            {/* 列表内容 */}
            <List
                size={"large"}
                dataSource={sources.records}
                renderItem={(item) => {
                    const { avatar, readNum, readNumTrue, praiseNum, createdAt } = item;

                    const commentUserJson = item.commentUserJson ? JSON.parse(item.commentUserJson) : undefined;

                    const title = (
                        <Link href={"/k/[id]"} as={`/k/${item.id}`}>
                            <a className="fs-[16px] color-[#222222] lc-1 mb-[10px]" target={"_blank"}>
                                {item.title}
                            </a>
                        </Link>
                    );
                    const description = (
                        <div className="flex row-center colume-between fs-[12px] color-[#999999]">
                            <div className="flex row-center">
                                {/* {tags?.map((tag, index) => (
                                    <Tag
                                        className={cx(
                                            css`border: none;`,
                                            "bg-f5",
                                            "color-[#999999]"
                                        )}
                                        key={index}
                                    >
                                        {tag}
                                    </Tag>
                                ))} */}
                                <Participates items={commentUserJson} />
                            </div>
                            <Space className="float-right" size={20}>
                                <span>{createdAt}</span>
                                <Space>
                                    <Icon type={"icon-yanjing"} />
                                    {readNum}
                                </Space>
                                <Space>
                                    <Icon type={"icon-pinglun"} />
                                    {readNumTrue}
                                </Space>
                                <Space>
                                    <Icon type={"icon-aixin"} />
                                    {praiseNum}
                                </Space>
                            </Space>
                        </div>
                    )
                    return (
                        <List.Item style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <List.Item.Meta
                                avatar={<Avatar size={52} src={avatar} />}
                                title={title}
                                description={description}
                            />
                        </List.Item>
                    )
                }}
            />

            <div className="text-center mt-[20px]">
                <AntdPagination
                    className="mt-[10px] text-center"
                    current={sources?.current}
                    total={sources?.total}
                    pageSize={20}
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
            </div>
        </Card>
    )
}

/**提问、写想法 */
const Actions: React.FC = () => {

    const [askVisible, setAskVisible] = useState<boolean>(false);
    const [writeVisible, setWriteVisible] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const askRef = React.createRef<FormInstance>();
    const writeRef = React.createRef<FormInstance>();

    const AskTitle: React.FC = () => (
        <div className="flex row-center">
            <h2 className="fs-[24px] color-[#000000e6] fw-500 mr-[10px]">提问</h2>
            <p className="fs-[14px] color-[#00000099] fw-400">写下你的跨境问题,准确的描述更容易得到解答</p>
        </div>
    )

    const WriteTitle: React.FC = () => (
        <div className="flex row-center">
            <h2 className="fs-[24px] color-[#000000e6] fw-500 mr-[10px]">写想法</h2>
            <p className="fs-[14px] color-[#00000099] fw-400">分享你的跨境想法</p>
        </div>
    )

    const onAskOk = () => {
        setConfirmLoading(true);
        askRef.current?.validateFields().then((value) => {
            saveBbs({
                ...value,
                type: 1,
                articleTagIds: value.articleTagIds.join(",")
            }).then(() => {
                message.success("发布成功");
                setAskVisible(false);
            }).finally(() => {
                setConfirmLoading(false);
            })
        })
    }

    const onWriteOk = () => {
        setConfirmLoading(true);
        writeRef.current?.validateFields().then((value) => {
            saveBbs({
                ...value,
                type: 2,
                articleTagIds: value.articleTagIds.join(",")
            }).then(() => {
                message.success("发布成功");
                setWriteVisible(false);
            }).finally(() => {
                setConfirmLoading(false);
            })
        })
    }

    return (
        <Fragment>
            <Card bordered={false} className={"mb-[20px]"}>
                <div className="flex row-center colume-between">
                    <Authorization.Valid>
                        <div
                            className="flex row-center gap-[10px] pa-[10px] fs-[20px] cursor-pointer"
                            onClick={() => setAskVisible(!askVisible)}
                        >
                            <img src={"/asset/image/k/ask.png"} className={"wh-[28px]"} />
                            提问
                        </div>
                    </Authorization.Valid>
                    <Authorization.Valid>
                        <div
                            className="flex row-center gap-[10px] pa-[10px] fs-[20px] cursor-pointer"
                            onClick={() => setWriteVisible(!writeVisible)}
                        >
                            <img src={"/asset/image/k/write.png"} className={"wh-[28px]"} />
                            写想法
                        </div>
                    </Authorization.Valid>
                </div>
            </Card>

            {/* 提问模态框 */}
            <Modal centered
                width={900}
                title={<AskTitle />}
                visible={askVisible}
                onCancel={() => setAskVisible(!askVisible)}
                onOk={onAskOk}
                destroyOnClose
                confirmLoading={confirmLoading}
            >
                <AskForm ref={askRef} />
            </Modal>

            {/* 写想法模态框 */}
            <Modal centered
                width={900}
                title={<WriteTitle />}
                visible={writeVisible}
                onCancel={() => setWriteVisible(!writeVisible)}
                onOk={onWriteOk}
                destroyOnClose
                confirmLoading={confirmLoading}
            >
                <WriteForm ref={writeRef} />
            </Modal>
        </Fragment>
    )
}

/**提问表单 */
const AskForm = React.forwardRef<FormInstance>((_, ref) => {
    const { types, platforms } = useContext(KRoundIndexContext);
    return (
        <Form ref={ref}>
            <Form.Item
                label={"问题描述"}
                name={"title"}
                rules={[{ required: true, message: "请输入你的问题描述" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={"问题说明"}
                name={"content"}
                rules={[{ required: true, message: "请输入你的问题说明" }]}
            >
                <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
                label={"平台分类"}
                name={"bbsTypeId"}
                rules={[{ required: true, message: "请选择平台分类" }]}
            >
                <Select
                    options={platforms}
                    fieldNames={{ label: "name", value: "id" }}
                />
            </Form.Item>
            <Form.Item
                label={"内容分类"}
                name={"articleTagIds"}
                rules={[{ required: true, message: "请选择内容分类" }]}
            >
                <TagsSelect maxLength={3}>
                    {types.map(({ name, id }) => (
                        <TagsSelect.Item value={id} key={id}>
                            {name}
                        </TagsSelect.Item>
                    ))}
                </TagsSelect>
            </Form.Item>
        </Form>
    )
})

/**写想法表单 */
const WriteForm = React.forwardRef<FormInstance>((_, ref) => {
    const { types, platforms } = useContext(KRoundIndexContext);
    return (
        <Form ref={ref}>
            <Form.Item
                label={"想法"}
                name={"title"}
                rules={[{ required: true, message: "请输入你的想法" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label={"想法说明"}
                name={"content"}
                rules={[{ required: true, message: "请输入你的想法说明" }]}
            >
                <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
                label={"平台分类"}
                name={"bbsTypeId"}
                rules={[{ required: true, message: "请选择平台分类" }]}
            >
                <Select
                    options={platforms}
                    fieldNames={{ label: "name", value: "id" }}
                />
            </Form.Item>
            <Form.Item
                label={"内容分类"}
                name={"articleTagIds"}
                rules={[{ required: true, message: "请选择内容分类" }]}
            >
                <TagsSelect maxLength={3}>
                    {types.map(({ name, id }) => (
                        <TagsSelect.Item value={id} key={id}>
                            {name}
                        </TagsSelect.Item>
                    ))}
                </TagsSelect>
            </Form.Item>
        </Form>
    )
})


/**热门帖子 */
export const HotBbs: React.FC<{ hots: Bbs[] }> = ({ hots }) => {
    return (
        <Card title={"热门帖子"} bordered={false} className={"mb-[20px]"}>
            <List
                dataSource={hots}
                renderItem={(item) => {

                    const title = (
                        <Link href={"/k/[id]"} as={`/k/${item.id}`}>
                            <a className="block mb-[10px] lc-2 color-[#222222]" target={"_blank"}>
                                {item.title}
                            </a>
                        </Link>
                    )

                    const description = (
                        <div>
                            <Avatar className="mr-[10px]" src={item.avatar} />
                            <span>{item.author}</span>
                        </div>
                    )

                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={title}
                                description={description}
                            />
                        </List.Item>
                    )
                }}
            />
        </Card>
    )
}

/**跨境圈子 */
const Round: React.FC = () => {
    return (
        <Card title={"跨境圈子"} bordered={false} className={"mb-[20px]"}>

        </Card>
    )
}

/**热门工具 */
const Tools: React.FC = () => {

    const { tools } = useContext(KRoundIndexContext);

    return (
        <Card
            title={"热门工具"}
            bordered={false}
            className={"mb-[20px]"}
        >
            <List
                dataSource={tools}
                renderItem={(item) => (
                    <List.Item>
                        <Link href={"/tl/[id]"} as={`/tl/${item.id}`}>
                            <a target={"_blank"}>{item.title}</a>
                        </Link>
                    </List.Item>
                )}
            />
        </Card>
    )
}