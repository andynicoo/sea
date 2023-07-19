import { NextPage } from "next";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { kjzdToolsPlatformListAll } from "@/apis/tools";
import React, { Fragment, Key, useContext, useEffect, useState } from "react";
import { Row, Col, Button, Input, Tabs, Space, Card, Tag, List, Avatar, Pagination as AntdPagination, Popover } from "antd";
import Link from "next/link";
import createEmotion from "@emotion/css/create-instance";
import { Tools, Toolsrecord, ToolsPlatform } from "@/vo/Tools";
import { Swiper, SwiperSlide } from "swiper/react";
import Authorization from "@/components/Authorization";
import { HotArticles } from "@/components/articles/Details";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import { PageParams, PageSource } from "@/vo/PageParams";
import { getArticlePage } from "@/apis/article";
import ArticleVo from "@/vo/Article";
import { AdRecords } from "@/vo/Adverts";
import { kjzdToolsListAll } from "@/apis/tools";
import { bbsPages } from "@/apis/bbs";
import { Bbs } from "@/vo/Bbs";
import { useRouter } from "next/router";
import { getSnsConfig, pageAd } from "@/apis/home";
import { Advert, SnsConfig } from "@/vo/Basic";
import SeoHead from "@/components/SeoHead";
import SearchInput from "@/components/SearchInput";
import { Adverts } from "../articles/[id]";
import { bannerClick } from "@/utils/shenCe";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
SwiperCore.use([Autoplay, Pagination]);
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-header` });

interface ToolsPageContextProps extends ToolsProps {

}

const ToolsPagContext = React.createContext<ToolsPageContextProps>({} as ToolsPageContextProps);

interface ToolsProps {
    toolsList: PageSource<Tools>,
    platforms: ToolsPlatform[];
    snsConfig: SnsConfig[];
    commends: ArticleVo[];
    adData: AdRecords[];
    bannerAd: AdRecords[];
    tools: Tools[];
    hots: Bbs[];
    ads2: Advert[];
}

const ToolsPage: NextPage<ToolsProps> = (props) => {
    const ctxValue: ToolsPageContextProps = {
        ...props
    }
    return (
        <ToolsPagContext.Provider value={ctxValue}>
            <SeoHead
                title="跨境电商资料工具_推广运营视频下载_软件工具网盘_跨境知道"
                keyword="工具包,软件,资源,资料,跨境知道"
                description="提供跨境电商卖家开店当中常见的运营工具下载，并带有这些软件的使用方法。分享的资料包可以让新手卖家更快的学会如何操作各个跨境平台"
            />
            <DefaultLayout>
                <Row gutter={16}>
                    <Col span={17}>
                        {/* 广告图片 */}
                        <ToolsAd />
                        {/* 内容 */}
                        <ToolsContetnt />
                    </Col>
                    <Col span={7}>
                        {/* 上传资源 */}
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <ToolsUpload />
                            </Col>
                            <Col span={24}>
                                <Adverts adverts={props.ads2} pageName={'资源&工具右边栏广告位'} />
                            </Col>
                            <Col span={24}>
                                <HotTools tools={props.tools} />
                            </Col>
                            <Col span={24}>
                                <ExchangeGroup />
                            </Col>
                            <Col span={24}>
                                <HotArticles articles={props.commends} />
                            </Col>
                            <Col span={24}>
                                <HotBbs />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </DefaultLayout>
        </ToolsPagContext.Provider>
    )
}

ToolsPage.getInitialProps = async (ctx) => {
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key || 20;
    const toolsPlatformId = ctx.query.toolsPlatformId as Key;
    const resourceType = ctx.query.resourceType as Key;
    const searchType = ctx.query.searchType as Key ? ctx.query.searchType as Key : 1;
    const title = ctx.query.title as string;
    /**右侧广告 */
    const ads2 = (await pageAd({ adSiteKey: "ba_dvert" })).data.records;
    // /**活动参数 */
    const params: PageParams = {
        current,
        size,
        toolsPlatformId,
        resourceType,
        searchType,
        title,
    }
    const commendParams: PageParams = {
        current: 1,
        size: 10,
        sort: "created_at",
        order: "DESC",
        auditStatus: 1,
        articleType: 1,
    }

    const toolsList = (await kjzdToolsListAll(params)).data;
    const platforms = (await kjzdToolsPlatformListAll()).data;
    const commends = (await getArticlePage(commendParams)).data.records;
    const adData = (await pageAd({ adSiteKey: "tools_download" })).data.records;
    const bannerAd = (await pageAd({ adSiteKey: "tools_top_banner_ad_001" })).data.records;
    const snsConfig = (await getSnsConfig({})).data;
    const tools = (await kjzdToolsListAll({ current: 1, size: 10, searchType: 5 })).data.records;
    const hots = (await bbsPages({ searchType: 5 })).data.records;
    return {
        toolsList,
        platforms,
        snsConfig,
        commends,
        adData,
        bannerAd,
        tools,
        hots,
        ads2
    }
}

/**头部广告 */
const ToolsAd: React.FC = () => {
    const { bannerAd } = useContext(ToolsPagContext);
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    if (!bannerAd.length) return <Fragment />;
    return (
        <Swiper autoplay loop pagination className="mb-[20px]">
            {bannerAd.map((item) => (
                <SwiperSlide key={item.id}>
                    <a
                        className={"flex row-center column-center w-[100%] h-[210px]"}
                        target={"_blank"}
                        href={item.url}
                        onClick={()=>bannerClick({
                            bannerID: item.id,bannerName: item.adSiteName,pageName:'资源&工具页主广告位',userId: userInfo?.userId || '',mobile:userInfo?.mobile || ''
                        })}
                    >
                        <img className="w-[100%] h-[210px]" src={item.picUrl} />
                    </a>
                </SwiperSlide>
            ))}
        </Swiper>

    )
}

/**主体内容 */
const ToolsContetnt: React.FC = () => {
    const { query, replace } = useRouter();
    const { toolsList } = useContext(ToolsPagContext);
    /**搜索框 */
    const Extra: React.FC = () => {

        const onSearch = (title: string) => {
            replace({ pathname: "/tl", query: { ...query, title, current: 1 } });
        }

        return (
            <SearchInput
                className="w-[350px]"
                size={"large"}
                onSearch={onSearch}
                defaultValue={query.title}
                enterButton={<span className="px-[10px]"><img width={30} src="/asset/image/search_ic.png" /></span>}
            />
        )
    }

    return (
        <Card
            title={"资源工具"}
            bordered={false}
            className={"mb-[20px]"}
            extra={<Extra />}
        >
            <Filter />
            <ListContent />
            <AntdPagination
                className=" text-center mt-[20px]"
                current={toolsList.current}
                total={toolsList.total}
                showSizeChanger={false}
                pageSize={toolsList.size}
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

/**平台部分 */
const Filter: React.FC = () => {
    const { query, replace } = useRouter();
    const { platforms } = useContext(ToolsPagContext);

    interface TagProps {
        label: string;
        value?: Key;
    }

    const platformList: TagProps[] = platforms.map(({ id, name }) => ({ label: name, value: id }));
    platformList.unshift({ label: "全部" });

    const typeList: TagProps[] = [
        { label: "全部" },
        { label: "文档类", value: "1" },
        { label: "工具类", value: "2" },
    ]

    const defaultCls = css`
        color: #666;
        font-size: 14px;
        padding: 2px 10px;
        background-color: rgba(0,0,0,0);
        border: none;
    `;

    const activeCls = css`
        background-color: #fef1f6;
        color: #f676a6;
    `;

    const TagItem: React.FC<TagProps & { queryKey: string }> = ({ value, label, queryKey }) => {
        const active = (query[queryKey] || undefined) == value;
        return (
            <Link
                href={{ query: { ...query, [queryKey]: value, current: 1 } }}
                scroll={false}
            >
                <a>
                    <Tag
                        className={cx(
                            defaultCls,
                            { [activeCls]: active },
                        )}
                    >
                        {label}
                    </Tag>
                </a>
            </Link>
        )
    }

    const cls = css`
        grid-template-columns: 45px 1fr;
    `;

    return (
        <Fragment>
            <div className={cx("mb-[20px]", "grid", cls)}>
                <div className="fw-500 mr-[10px]">平台:</div>
                <Space wrap size={15}>
                    {platformList.map((item, index) => (
                        <TagItem {...item} key={index} queryKey={"toolsPlatformId"} />
                    ))}
                </Space>
            </div>
            <div className={cx("mb-[20px]", "grid", cls)}>
                <span className="fw-500 mr-[10px]">类型:</span>
                <Space wrap size={15}>
                    {typeList.map((item, index) => (
                        <TagItem {...item} key={index} queryKey={"resourceType"} />
                    ))}
                </Space>
            </div>
        </Fragment>
    )
}

/**列表部分 */
const ListContent: React.FC = () => {
    const { toolsList } = useContext(ToolsPagContext);
    const { query, replace } = useRouter();

    const itemCls = css`
        background: #FFFFFF;
        border-radius: 10px;
        margin-bottom: 20px;
    `;

    const item: any = [
        {
            id: "1",
            name: "最新",
        },
        {
            id: "2",
            name: "当天",
        },
        {
            id: "3",
            name: "7天热门",
        },
        {
            id: "4",
            name: "30天热门",
        }
    ]
    const onChange = (key: string) => {
        const searchType = key
        replace({ pathname: "/tl", query: { ...query, searchType, current: 1 } });
    };
    const index: any = query.searchType ? query.searchType : "1"
    const Item: React.FC<Toolsrecord> = (props) => {
        const [type, setType] = useState<number>(9);
        const ToolsLink: React.FC = ({ children }) => {
            return (
                <Link
                    href={"/tl/[id]"}
                    as={`/tl/${props.id}`}
                    scroll={false}
                >
                    <a target={"_blank"}>{children}</a>
                </Link>
            )
        }
        const icon1 = css`
            background-image: url(/asset/image/icon/pdf.png) !important;
        `;
        const icon2 = css`
            background-image: url(/asset/image/icon/xlsx.png) !important;
        `;
        const icon3 = css`
            background-image: url(/asset/image/icon/ppt.png) !important;
        `;
        const icon4 = css`
            background-image: url(/asset/image/icon/txt.png) !important;
        `;
        const icon5 = css`
            background-image: url(/asset/image/icon/doc.png) !important;
        `;
        const icon6 = css`
            background-image: url(/asset/image/icon/zip.png) !important;
        `;
        const icon7 = css`
            background-image: url(/asset/image/icon/rar.png) !important;
        `;
        const icon8 = css`
            background-image: url(/asset/image/icon/movie.png) !important;
        `;
        const icon9 = css`
            background-image: url(/asset/image/icon/pic.png) !important;
        `;
        const icon10 = css`
            background-image: url(/asset/image/icon/unknow.png) !important;
        `;
        const avatarCls = css`
            width: 56px !important;
            height: 64px !important;
            background-size: cover !important;
            border-radius: 5px !important;
        `;
        const size: any = (parseInt(props.enclosureSize) / 1024).toFixed(2) + 'M'
        const loadType = () => {
            if (props.enclosureName) {
                if (props.enclosureName.indexOf("pdf") !== -1) {
                    setType(0)
                } else if (props.enclosureName.indexOf("xlsx") !== -1) {
                    setType(1)
                } else if (props.enclosureName.indexOf("ppt") !== -1) {
                    setType(2)
                } else if (props.enclosureName.indexOf("txt") !== -1) {
                    setType(3)
                } else if (props.enclosureName.indexOf("doc") !== -1) {
                    setType(4)
                } else if (props.enclosureName.indexOf("zip") !== -1) {
                    setType(5)
                } else if (props.enclosureName.indexOf("rar") !== -1) {
                    setType(6)
                } else if (props.enclosureName.indexOf("movie") !== -1) {
                    setType(7)
                } else if (props.enclosureName.indexOf("png") !== -1) {
                    setType(8)
                } else {
                    setType(9)
                }
            } else {
                setType(9)
            }
        }
        useEffect(loadType, []);

        const cls = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10][type];
        const avatar = (
            <ToolsLink>
                <Avatar
                    className={cx(avatarCls, { [cls]: true })}
                    shape={"square"}
                />
            </ToolsLink>
        )

        const title = (
            <ToolsLink>
                <span className="block h-[30px] fw-500 fs-[18px] mb-[10px] lc-1">{props.title}</span>
            </ToolsLink>
        )
        const description = (
            <Space size={30}>
                <span>{props.createdAt}</span>
                <span>{"资源大小: " + size}</span>
                <span>{"下载次数: " + props.enclosureDownloadNum}</span>
                <span>{"所需积分: " + props.integralNum}</span>
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
        <Row className={cx("mt-[20px]", itemCls)}>
            <Tabs defaultActiveKey={index} className="w-[100%]" onChange={onChange}>
                {
                    item.map((value: any, index: number) => {
                        return (<Tabs.TabPane tab={value.name} key={index + 1}>
                            <List
                                dataSource={toolsList.records}
                                pagination={false}
                                renderItem={(item: any) => (
                                    <Item {...item} />
                                )}
                            />
                        </Tabs.TabPane>)
                    })
                }
            </Tabs>
        </Row>
    )
}

/**上传资源部分 */
const ToolsUpload: React.FC = () => {
    const { adData } = useContext(ToolsPagContext);
    const { push } = useRouter();
    const uplaodCls = css`
        border-radius: 4px;
        padding: 20px;
        
    `;
    const titleCls = css`
        border-bottom: 1px solid #ededed;
    `;
    const itemImg = css`
        width: 44px;
        height: 44px;
        margin: 0 auto;
        margin-top: 15px;
        display: block;
    `;

    return (
        <div
            className={cx(
                "pt-[15px]",
                "w-[100%]",
                "bg-color-[#ffffff]",
                uplaodCls
            )}
        >
            <Row >
                <div className={cx("w-[100%] mb-[20px] pb-[16px]", titleCls)}>
                    <h2 className="fs-[18px] color-[#222222 mt-[10px] text-center">跨境知道下载频道</h2>
                    <p className="fs-[14px] color-[#999999] mt-[20px] text-center">跨境资源第一站</p>
                </div>
                {
                    adData.slice(0, 4).map((item, index: number) => (
                        <Col key={index} span={6}>
                            <a href={item.url} target="_blank">
                                <img src={item.picUrl} alt="" className={(itemImg)} />
                                <div className="lc-1 fs-[12px] color-[#999999] mb-[20px] mt-[10px] text-center">{item.title}</div>
                            </a>
                        </Col>
                    ))
                }
                <Authorization.Valid>
                    <Button
                        type="primary" className="h-[100%] w-[100%] fs-[16px]"
                        onClick={() => push("/users/resources/add")}
                    >
                        上传资源
                    </Button>
                </Authorization.Valid>
            </Row>
        </div>
    )
}

/**交流群 */
const ExchangeGroup: React.FC = () => {

    const { snsConfig } = useContext(ToolsPagContext);

    const Exchange: React.FC<SnsConfig & { index: number }> = (props) => {

        const icon1 = css`
            background-image: url(/asset/image/icon/commend-1.png);
        `;

        const icon2 = css`
            background-image: url(/asset/image/icon/commend-2.png);
        `;

        const icon3 = css`
            background-image: url(/asset/image/icon/commend-3.png);
        `;

        const index = props.index % 3;
        const cls = [icon1, icon2, icon3][index];

        const content = (
            <div className="text-center">
                <p className="mb-[5px] color-[primary] fs-[12px]">
                    添加微信，邀您进群
                </p>
                <Avatar
                    shape={"square"}
                    size={120}
                    src={props.snsQrCode}
                />
            </div>
        )

        return (
            <Row>
                <Col span={3}>
                    <div className={cx("wh-[25px] bg-color-[#f3f3f3] br-round bg-center bg-cover", cls)} />
                </Col>
                <Col span={14}>
                    {props.snsName}
                </Col>
                <Col span={7}>
                    <Popover
                        placement="left"
                        content={content}
                        trigger="click"
                    >
                        <Button
                            size={"small"}
                            shape={"round"}
                            type={"primary"}
                            block
                        >
                            加入
                        </Button>
                    </Popover>
                </Col>
            </Row>
        )
    }

    return (
        <Card
            title={"交流群"}
            bordered={false}
        >
            <Space className="w-[100%]" direction={"vertical"} size={20}>
                {snsConfig.map((item, index) => (
                    <Exchange
                        {...item}
                        index={index}
                        key={item.id}
                    />
                ))}
            </Space>
        </Card>
    )
}

/**热门工具 */
export const HotTools: React.FC<{ tools: Tools[] }> = ({ tools }) => {
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

/**热门帖子 */
const HotBbs: React.FC = () => {
    const { hots } = useContext(ToolsPagContext);
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

export default ToolsPage;