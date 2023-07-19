import React, { Fragment, Key, useContext, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import Header, { Navigation as NavigationMenu, UserInfoButton } from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import {
    Avatar,
    Button,
    Col,
    Popover,
    Row,
    Space,
    Card,
    List,
    Tag,
    Empty,
    Collapse,
    Spin,
    Divider,
    Carousel
} from "antd";
import {
    dictArea,
    getActivityPage,
    getArticlePlatformList,
    getNewsPage,
    getSnsConfig,
    getIndustryCategory,
    pageAd,
    serviceType,
    getServicePage
} from "@/apis/home";
import {
    Advert,
    Area,
    IndustryCategory,
    Menu as MenuVo,
    News,
    Server,
    ServerType,
    SnsConfig
} from "@/vo/Basic";
import { cloneDeep, first, slice, sortBy } from "lodash";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation as Savigation } from "swiper";
import Icon from "@/components/Icon";
import { getArticlePage } from "@/apis/article";
import Article from "@/vo/Article";
import moment from "moment";
import CardTitle from "@/components/CardTitle";
import Tabs from "@/components/Tabs";
import { useRouter } from "next/router";
import { Activity, Expert } from "@/vo/Users";
import { CustomNextPageContext } from "@/pages/_app";
import { PageParams, PageSource } from "@/vo/PageParams";
import { ActivityPlatform } from "@/vo/Encyclopedia";
import ScrollTags from "@/components/ScrollTags";
import Center from "@/components/Center";
import { getReportPage } from "@/apis/reports";
import { Report as ReportVo } from "@/vo/Reports";
import Adviser from "@/components/Adviser";
import AdviserVo from "@/vo/Adviser";
import { getExpert } from "@/apis/users";
import { getDemandPage } from "@/apis/demand";
import { Demand as DemandVo } from "@/vo/Demand";
import createEmotion from "@emotion/css/create-instance";
import QrCode from "@/components/QrCode";
import Authorization from "@/components/Authorization";
import { onDownLoad } from "./reports";
import { HotArticles } from "@/components/articles/Details";
import { bannerClick } from "@/utils/shenCe";

const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-index` });

SwiperCore.use([Autoplay, Pagination, Savigation]);
// import "swiper/swiper.min.css";
interface LinkProps {
        name?: string;
        href?: string;
    }
interface IndexProps {
    /**友情链接 */
    adLinks: LinkProps[];
    /**广告 */
    adverts: Advert[];
    /**文章 */
    articles: Article[];
    /**区域 */
    areas: Area[];
    /**服务分类 */
    serviceTypes: ServerType[];
    /**行业分类 */
    industrys: IndustryCategory[];
    /**文章平台 */
    articlePlatforms: ActivityPlatform[];
    /**24小时快讯 */
    news: News[];
    /**活动峰会 */
    activitys: Activity[];
    /**交流群 */
    snsConfig: SnsConfig[];
    /**专家专栏 */
    experts: Expert[];
    /**海外需求 */
    demands: DemandVo[];
    /**初始化服务 */
    initServices: Server[];
    /**初始化文章 */
    initArticles: PageSource<Article>;
    /**初始化行业报告 */
    initReports: ReportVo[];
    /**热门文章 */
    commends: Article[];
}

interface IndexPageContextProps extends IndexProps {

}



export const IndexPageContext = React.createContext<IndexPageContextProps>({} as IndexPageContextProps);

const Index: NextPage<IndexProps> = (props) => {
    const ctxValue: IndexPageContextProps = { ...props };
    const isServer = typeof window === "undefined";
    if (!isServer) {
        const isMobile = () => {
            let userAgentInfo = navigator.userAgent;
            let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
            let getArr = Agents.filter(i => userAgentInfo.includes(i));
            return getArr.length ? true : false;
        }
        const { pathname } = useRouter()
        if (isMobile() && pathname == '/') {
            window.location.href = 'https://m.ikjzd.com/'
        }
    }
    return <IndexPageContext.Provider value={ctxValue}>
        <Header />

        {/* 导航拦 */}
        <Navigation />

        {/* 顶部副导航、轮播、出海百问 */}
        <Banner />

        {/* 行业洞察 */}
        <IndustryInsights />

        {/* 行业报告 */}
        <IndustryReports />

        <Container className="mb-[30px]">
            <Row gutter={[20, 20]}>
                <Col span={18}>
                    {/* 找服务 */}
                    <Serves />

                    {/* 文章 */}
                    <Articles />
                </Col>
                <Col span={6}>
                    {/* 海外需求 */}
                    <OverseasDemand />

                    {/* 广告 */}
                    <AdvertBanner />

                    {/* 24小时快讯 */}
                    <Newsletter />

                    {/* 交流群 */}
                    <ExchangeGroup />

                    {/* 专家专栏 */}
                    <ExpertColumn />

                    {/* 热门文章 */}
                    <HotArticles articles={ctxValue.commends} />
                </Col>
            </Row>
        </Container>

        {/* 活动峰会 */}
        <Conference />

        <Footer linksShow={true} />
    </IndexPageContext.Provider>
}

Index.getInitialProps = async (ctx: CustomNextPageContext) => {

    /**文章参数 */
    const articlesParams: PageParams = {
        current: 1,
        size: 4,
        articleType: 2,
        auditStatus: 1,
    }

    /**活动峰会分页参数 */
    const activityPageParams: PageParams = {
        current: 1,
        size: 10,
        auditStatus: 1,
    }

    /**专家专栏分页 */
    const expertPageParams: PageParams = {
        current: 1,
        size: 10
    }

    /**推荐海外需求 */
    const demandParams: PageParams = {
        current: 1,
        size: 10,
    }

    /**24小时快讯分页 */
    const newsParams: PageParams = {
        current: 1,
        size: 6
    }

    /**初始化服务参数 */
    const initServiceParams: PageParams = {
        current: 1,
        size: 10,
    }

    /**初始化文章参数 */
    const initArticlesParams: PageParams = {
        current: 1,
        size: 40,
        articleType: 1,
        auditStatus: 1,
    }

    /**初始化行业报告参数 */
    const initReportParams: PageParams = {
        current: 1,
        size: 6,
    }
    /**热门文章 */
    const commendParams: PageParams = {
        current: 1,
        size: 10,
    }
    const adLinks = (await pageAd({ adSiteKey: "friendly_links",size:200,current:1 })).data.records?.map(item => {
        return {name:item.title,href:item.url,sort:item.sort}
    });
    const adverts = (await pageAd({ adSiteKey: "home_top_banner_01" })).data.records;
    const articles = (await getArticlePage(articlesParams)).data.records;
    const areas = (await dictArea()).data;
    const serviceTypes = (await serviceType()).data;
    const industrys = (await getIndustryCategory()).data;
    const articlePlatforms = (await getArticlePlatformList()).data;
    const news = (await getNewsPage(newsParams)).data.records;
    const activitys = (await getActivityPage(activityPageParams)).data.records;
    const snsConfig = (await getSnsConfig({ size: 8 })).data;
    const experts = (await getExpert(expertPageParams)).data;
    const demands = (await getDemandPage(demandParams)).data.records;
    const initServices = (await getServicePage({ ...initServiceParams, categoryId: serviceTypes[0]?.id, })).data.records;
    const initArticles = (await getArticlePage(initArticlesParams)).data;
    const initReports = (await getReportPage(initReportParams)).data.records;
    const commends = (await getArticlePage(commendParams)).data.records;
    return {
        adLinks:sortBy(adLinks,'sort'),
        adverts,
        articles,
        areas,
        serviceTypes,
        industrys,
        articlePlatforms,
        news,
        activitys,
        snsConfig,
        experts,
        demands,
        initServices,
        initArticles,
        initReports,
        commends,
    }
}

export default Index;

/**导航 */
const Navigation: React.FC = () => {
    const menus = useSelector((state: MainReduxState) => state.mainReducer.menus);

    /**第一个导航 */
    const firstMenu = first(menus);

    const FirstMenu: React.FC = () => {

        return (
            <div
                className={"w-[220px] h-[40px] color-[#ffffff] flex row-center px-[10px] br-tl-[5px] br-tr-[5px]"}
                style={{ background: "linear-gradient(180deg, #434343 0%, #231717 100%)" }}
            >
                <Icon
                    type={"icon-caidan"}
                    className={"fs-[20px]"}
                />
                <span className={"ml-[10px]"}>{firstMenu?.menuName}</span>
            </div>
        )
    }

    return <div className={"bg-color-[#ffffff]"}>
        <Container className={"grid"} style={{ gridTemplateColumns: "222px 1fr" }}>
            <FirstMenu />
            <Row align="middle">
                <Col span={20}>
                    <NavigationMenu spaceSize={23} />
                </Col>
                <Col span={4}>
                    <UserInfoButton />
                </Col>
            </Row>
        </Container>
    </div>
}

/**副导航、轮播、出海百问 */
const Banner: React.FC = () => {

    const { adverts } = useContext(IndexPageContext);
    const { push } = useRouter();

    const menus = useSelector((state: MainReduxState) => state.mainReducer.menus);

    const firstMenu = first(menus);

    const SubMenu: React.FC = () => {
        /**菜单组件 */
        const Menu: React.FC<MenuVo> = (props) => {
            const { menuName, remark, iconUrl } = props;

            return (
                <div
                    className={cx("w-[100%] grid row-center px-[20px]")}
                    style={{ gridTemplateColumns: "56px 1fr 20px" }}
                >
                    {menuName == "找顾问" ?
                        <span className={"py-[10px]"}>
                            <img
                                src={iconUrl}
                                className={"w-[50px]"}
                            />
                        </span> :
                        <Link href={props.href}>
                            <a className={"py-[10px]"}>
                                <img
                                    src={iconUrl}
                                    className={"w-[50px]"}
                                />
                            </a>
                        </Link>
                    }
                    <div className={"flex flex-column df-js-c"}>
                        {menuName == "找顾问" ?
                            <span className={"ma-[0px] color-[#000000e6] fs-[16px] fw-500"}>
                                {menuName}
                            </span>
                            : <Link href={props.href}>
                                <a className={"ma-[0px] color-[#000000e6] fs-[16px] fw-500"}>
                                    {menuName}
                                </a>
                            </Link>
                        }
                        <p className={"ma-[0px] color-[#00000099] fs-[12px] fw-500"}>
                            {remark}
                        </p>
                    </div>
                    <div>
                        <Icon
                            type={"icon-youjiantou"}
                            className={"ml-[8px]"}
                        />
                    </div>
                </div>
            )
        }

        const onClick = (props: AdviserVo) => {
            push("/adviser/[id]", `/adviser/${props.id}`);
        }

        /**顾问渲染 */
        const content = (
            <Adviser
                style={{ width: 628 }}
                onClick={onClick}
            />
        )

        const listCls = css`
            .ikjzd-list-item {
                position: relative;
                margin-bottom: 1px;
                transition: all 0.3s;
                border-bottom: none;

                &::before {
                    position: absolute;
                    content: "";
                    display: block;
                    width: calc(100% - 40px);
                    height: 1px;
                    background-color: #E7E7E7FF;
                    bottom: -1px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                &:last-child {
                    &::before {
                        display: none;
                    }
                }
            }
        `;

        return (
            <Card
                bordered={false}
                bodyStyle={{ padding: 0 }}
            >
                <List
                    className={listCls}
                >
                    {firstMenu?.children.map((menu) => {
                        if (menu.menuName === "找顾问") {
                            return (
                                <Popover
                                    key={menu.menuId}
                                    title={false}
                                    content={content}
                                    placement={"rightBottom"}
                                >
                                    <List.Item
                                        className={"hover pt-[16px] pb-[16px] cursor-pointer"}
                                    >
                                        <Menu {...menu} />
                                    </List.Item>
                                </Popover>
                            )
                        } else {
                            return (
                                <List.Item
                                    key={menu.menuId}
                                    className={"hover pt-[16px] pb-[16px]"}
                                >
                                    <Menu {...menu} />
                                </List.Item>
                            )
                        }
                    })}
                </List>
            </Card>
        )
    }

    const BannerSwiper: React.FC = () => {
        const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
        return (
            <div style={{ width: 630 }} className={"br-a-[3px] hidden home-swiper-box"}>
                <Swiper autoplay loop pagination={{ clickable: true }} navigation>
                    {adverts.map((advert) => (
                        <SwiperSlide key={advert.id}>
                            <a
                                title={advert.title}
                                target={"_blank"}
                                href={advert.url}
                                style={{ width: 630, height: 330 }}
                                className={"hidden flex row-center colume-center"}
                                onClick={()=>bannerClick({
                                    bannerID: advert.id,bannerName: advert.adSiteName,pageName:'首页主banner广告位',userId: userInfo?.userId || '',mobile:userInfo?.mobile || ''
                                })}
                            >
                                <div
                                    className={"scale-[1.05] w-[100%] bg-center bg-cover"}
                                    style={{ backgroundImage: `url(${advert.picUrl})`, height: 330 }}
                                />
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        )
    }

    const Question: React.FC = () => {

        return <div>
            <Card
                bordered={false}
                className={"h-[160px] br-tl-[2px] br-tr-[2px] bg-center bg-cover"}
                style={{ backgroundImage: "url(/asset/image/index-banner-question.png)" }}
                bodyStyle={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%"
                }}
            >
                <Link href={"/question"}>
                    <a
                        className={"absolute flex row-center fs-[12px]"}
                        style={{ right: 10, top: 23 }}
                        target="_blank"
                    >
                        查看更多
                        <Icon className={"fs-[10px] ml-[10px]"} type={"icon-youjiantou"} />
                    </a>
                </Link>
                <div
                    className={"color-[#ffffff] fs-[26px] fw-500"}
                    style={{ transform: "rotate(5deg) translate(3px, 7px)" }}
                >
                    3000+
                </div>
            </Card>
            <Adviser.Card
                style={{ borderTop: "1px solid #eee" }}
                className={"br-bl-[2px] br-br-[2px]"}
                modalStyle={{
                    transformOrigin: "none"
                }}
            />
        </div>
    }

    return (
        <div
            className={"py-[15px] mb-[30px]"}
            style={{ background: "linear-gradient(180deg, #FAFAFA 0%, #EDF3F8 100%)" }}
        >
            <Container
                className={"grid gap-[15px]"}
                style={{ gridTemplateColumns: "222px 1fr 318px" }}
            >
                {/* 子菜单 */}
                <SubMenu />
                {/* 轮播 */}
                <BannerSwiper />
                {/* 出海百问 */}
                <Question />
            </Container>
        </div>
    )
}

/**行业洞察 */
const IndustryInsights: React.FC = () => {

    const { articles } = useContext(IndexPageContext);

    const cardExtra = (
        <Link href={"/insights"}>
            <a className="fs-[14px] color-[#00000099]" target="_blank">
                查看更多
                <Icon
                    type={"icon-youjiantou"}
                    className={"ml-[8px]"}
                />
            </a>
        </Link>
    )
    return (
        <Container>
            <CardTitle
                bordered={false}
                title={<span className={cx("fw-500 fs-[24px]")}>行业洞察</span>}
                extra={cardExtra}
            />

            <Row
                gutter={28}
                className={"mt-[10px] mb-[30px]"}
            >
                {articles.map((article) => (
                    <Col span={6} key={article.id}>
                        <Link
                            href={"/articles/[id]"}
                            as={`/articles/${article.id}`}
                        >
                            <a target="_blank">
                                <ArticleCard {...article} />
                            </a>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

/**文章卡片 */
const ArticleCard: React.FC<Article> = (props) => {
    let timeStr: string = "";
    const hours = moment().diff(moment(props.pushTime || props.updatedAt), "hours");
    const days = moment().diff(moment(props.pushTime || props.updatedAt), "days");
    const weeks = moment().diff(moment(props.pushTime || props.updatedAt), "weeks");
    const months = moment().diff(moment(props.pushTime || props.updatedAt), "months");

    if (hours == 0) timeStr = `1小时前`;
    if (hours >= 1) timeStr = `${hours}小时前`;
    if (days >= 1) timeStr = `${days}天前`;
    if (weeks >= 1) timeStr = `${weeks}周前`;
    if (months >= 1) timeStr = `${months}月前`;
    if (!timeStr) timeStr = `最近`;
    const InsightCls = css`
        white-space:normal;
        min-height: 45px;
    `
    return (
        <Card
            size={"small"}
            bordered={false}
            className={"hover"}
            cover={(
                <div className={"w-[100%] h-[155px] hidden"}>
                    <Avatar
                        shape={"square"}
                        src={props.thumbPicUrl}
                        className={"w-[100%] h-[155px] hidden scale-[1.05]"}
                    />
                </div>
            )}
        >
            <Card.Meta
                className="block"
                title={(
                    <div className={cx(InsightCls, "fs-[14px] fw-500 color-[#000000e6] lc-2")}>
                        {props.title}
                    </div>
                )}
                description={(
                    <div className={"flex colume-between row-center fs-[12px]"}>
                        <span className={"color-[#00000066]"}>{timeStr}</span>
                        <Space size={15}>
                            <span className={"color-[#00000066] flex row-center"}>
                                <Icon type={"icon-yanjing"} className={"mr-[5px] fs-[16px] color-[#d8d8d8]"} />
                                {props.readNum}
                            </span>
                            <span className={"color-[#00000066] flex row-center"}>
                                <Icon type={"icon-aixin"} className={"mr-[5px] fs-[16px] color-[#d8d8d8]"} />
                                {props.praiseNum}
                            </span>
                        </Space>
                    </div>
                )}
            />
        </Card>
    )
}

/**行业报告 */
const IndustryReports: React.FC = () => {
    const { industrys, initReports } = useContext(IndexPageContext);
    const [activeKey, setActiveKey] = useState<Key>();
    const [reportSource, setReportSource] = useState<ReportVo[]>(initReports);

    useEffect(() => {
        if (!activeKey) return;
        const params: PageParams = {
            current: 1,
            size: 10,
            reportCategory: activeKey
        }

        getReportPage(params).then((res) => {
            setReportSource(res.data.records);
        })
    }, [activeKey]);

    const cardExtra = (
        <Link href={"/reports"}>
            <a className={cx("fs-[14px] color-[#00000099]")} target="_blank">
                查看更多
                <Icon
                    type={"icon-youjiantou"}
                    className={"ml-[8px]"}
                />
            </a>
        </Link>
    )

    const Report: React.FC<ReportVo> = (props) => {
        const { title, reportOriginal, downloadFee, reportUrl, id, index } = props;

        const classns = css`
            grid-template-columns: 40px 1fr;
        `;
        const blCls = css`
            position: relative;
            &::after{
                content: '';
                position: absolute;
                bottom:0;
                left:50%;
                width: 96%;
                height: 1px;
                background-color: #e6e6e6;
                margin-left: -48%;
            }
            &:hover{
                &::after{
                    display: none;
                }
            }
        `
        return <Authorization.Valid>
            <div className={cx(classns, (index as number < 3 ? blCls : ''), "hover grid row-center relative pa-[10px] cursor-pointer")}
                onClick={() => onDownLoad(id)}
            >
                <img
                    className={"w-[40px] h-[50px]"}
                    src={"/asset/image/report-file.png"}
                />
                <div>
                    <p className={"fs-[14px] fw-500 color-[#000000e6] ma-[0px] lc-1"}>
                        {title}
                    </p>
                    <div className={"flex colume-between"}>
                        <Space size={8}>
                            {!downloadFee && (
                                <a className={cx(
                                    "color-[#9c9c9c]",
                                    "bg-color-[#f4f4f4]",
                                    "fh-[15px]",
                                    "px-[8px]",
                                    "fs-[12px]",
                                    "br-a-[2px]",
                                )}>
                                    免费
                                </a>
                            )}
                            {reportOriginal === 1 && (
                                <a className={cx(
                                    "color-[primary]",
                                    "bg-color-[#fde8f0]",
                                    "fh-[15px]",
                                    "px-[8px]",
                                    "fs-[12px]",
                                    "br-a-[2px]",
                                )}>
                                    原创
                                </a>
                            )}
                        </Space>
                        <span className={"flex row-center float-right fs-[12px] color-[#00000066]"}>
                            <Icon
                                className="fs-[15px]"
                                type={"icon-xiazai"}
                            />
                            <span>下载</span>
                        </span>
                    </div>
                </div>
            </div>
        </Authorization.Valid>
    }

    /**切换的tab */
    const TabsTitle: React.FC = () => {
        return <Space size={40}>
            <h5 className={cx("fs-[24px] color-[#000000e6]")}>
                行业报告
            </h5>
            <Tabs
                activeKey={activeKey}
                onChange={setActiveKey}
            >
                {industrys.map(({ name, value }) => {
                    return (
                        <Tabs.Item
                            key={value}
                            tabKey={value}
                            tabName={name}
                        />
                    )
                })}
            </Tabs>
        </Space>
    }

    const Reports: React.FC = () => {
        if (!reportSource?.length) {
            return (
                <Card bordered={false}>
                    <Empty />
                </Card>
            )
        }
        return <Row className='hidden'>
            {reportSource.map((report, index) => (
                <Col span={8} key={report.id}>
                    <Report index={index} {...report} />
                </Col>
            ))}
        </Row>
    }

    return (
        <Container>
            <CardTitle
                bordered={false}
                title={<TabsTitle />}
                extra={cardExtra}
            />
            <Card
                bordered={false}
                className={"mt-[10px] mb-[30px]"}
                bodyStyle={{ padding: 0 }}
            >
                <Reports />
            </Card>
        </Container>
    )
}

/**找服务 */
const Serves: React.FC = () => {

    const { areas, serviceTypes, initServices } = useContext(IndexPageContext);
    const [serversSource, setServersSource] = useState<Server[]>(initServices);
    const [areaCode, setAreaCode] = useState<Key>();
    const [serverCategoryId, setServerCategoryId] = useState<Key>(serviceTypes[0]?.id);

    const tabsExtra = (
        <Link href={"/server"}>
            <a className={cx("fs-[14px] color-[#00000099]")} target="_blank">
                更多
                <Icon
                    type={"icon-youjiantou"}
                    className={"ml-[8px]"}
                />
            </a>
        </Link>
    )

    /**客户端加载服务 */
    const loadServersSource = () => {

        if (!serverCategoryId && !areaCode) return;

        const params: PageParams = {
            current: 1,
            size: 10,
            categoryId: serverCategoryId,
            area: areaCode
        }

        getServicePage(params).then((res) => {
            setServersSource(res.data.records);
        })
    }

    useEffect(loadServersSource, [serverCategoryId, areaCode]);

    const TabsTitle: React.FC = () => {

        return <Space size={40}>
            <h5 className={cx("fs-[24px] fw-500 color-[#000000e6]")}>
                找服务
            </h5>
            <Tabs
                activeKey={serverCategoryId}
                onChange={setServerCategoryId}
            >
                {slice(serviceTypes, 0, 7).map(({ id, name }) => {
                    return (
                        <Tabs.Item
                            key={id}
                            tabKey={id}
                            tabName={name}
                        />
                    )
                })}
            </Tabs>
        </Space>
    }

    const Areas: React.FC = () => {
        const AreaItem: React.FC<Area & { onClick?: (id?: Key) => void; active?: boolean; }> = (area) => {

            const contentClassns = css`
                grid-template-columns: 32px 1fr 19px;
            `;

            const classns = css`
                transition: all 0.5s;
                &:hover div{
                    color: rgba(0,0,0,0.9000);
                }
                &:last-child {
                    margin-bottom: 0px;
                    padding-bottom: 22px;
                }

                &::after {
                    content: "";
                    display: block;
                    width: calc(100% - 40px);
                    height: 1px;
                    background-color: #E7E7E7FF;
                    position: absolute;
                    bottom: -1px;
                }

                &:last-child {
                    &::after {
                        display: none;
                    }
                }
            `;

            const activeCls = css`
                background-color: #F0F7FDFF;
                div {color: rgba(0,0,0,0.9000);}
                &:hover{
                    box-shadow:none;
                }
            `;

            const onClick = () => {
                area.onClick && area.onClick(area.id)
            }

            return (
                <div
                    className={cx(classns,
                        "hover",
                        "px-[18px]",
                        "py-[15px]",
                        "cursor-pointer",
                        "relative",
                        "block",
                        "mb-[1px]",
                        { [activeCls]: area.active }
                    )}
                    onClick={onClick}
                >
                    <div className={cx(
                        contentClassns,
                        "grid",
                        "row-center",
                        "gap-[8px]",
                        "w-[100%]",
                        "fs-[14px]",
                        "color-[#00000099]",
                        "fw-500",
                        "py-[4px]"
                    )}>
                        {area.iconUrl
                            ? <img
                                src={area.iconUrl}
                                style={{ width: 26, height: 19 }}
                            />
                            : <div />
                        }
                        <div>
                            {area.name}
                        </div>
                        <div>
                            <Icon
                                type={"icon-youjiantou"}
                            />
                        </div>
                    </div>
                </div>
            )
        }

        const more: Area = {
            name: "更多"
        }

        return (
            <Card
                bordered={false}
                bodyStyle={{ padding: 0 }}
            >
                {slice(areas, 0, 5).map((area) => {
                    return (
                        <AreaItem
                            {...area}
                            key={area.id}
                            onClick={setAreaCode}
                            active={areaCode === area.id}
                        />
                    )
                })}
                <Link href={"/server"}>
                    <a>
                        <AreaItem
                            {...more}
                            onClick={setAreaCode}
                        />
                    </a>
                </Link>
            </Card>
        )
    }

    const Servers: React.FC = () => {

        const CardCover: React.FC<{ src: string }> = ({ src }) => {

            const cls = css`
                border: 1px solid #eee;
            `;

            return (
                <div className={cx(cls, "br-a-[2px] h-[75px] w-[100%] hidden")}>
                    <Avatar
                        src={src}
                        shape={"square"}
                        className={cx("scale-[1.05]", "w-[100%]", "h-[75px]")}
                    />
                </div>
            )
        }

        if (!serversSource.length) {
            return (
                <Card bordered={false}>
                    <Empty style={{ margin: '97px auto' }} />
                </Card>
            )
        }

        return (
            <Card bordered={false} style={{ height: 374, overflow: "hidden" }}>
                <Row gutter={[24, 24]}>
                    {serversSource.map((item) => {
                        const [avatar] = item.productImage;
                        return <Col span={8} key={item.id}>
                            <Link
                                href={"/server/[id]"}
                                as={`/server/${item.id}`}
                            >
                                <a target="_blank">
                                    <Card
                                        cover={<CardCover src={avatar} />}
                                        bodyStyle={{
                                            padding: "11px 8px",
                                            minHeight: 75
                                        }}
                                        className={"hover"}
                                    >
                                        <p className="fs-[14px] fw-500 color-[#000000e6] ma-[0px] lc-1">
                                            {item.name}
                                        </p>
                                        <div className="block h-[34px]">
                                            <p className="nohover fs-[12px] fw-400 color-[#00000066] ma-[0px] lc-2">
                                                {item.description}
                                            </p>
                                        </div>
                                    </Card>
                                </a>
                            </Link>
                        </Col>
                    })}
                </Row>
            </Card>
        )
    }

    return (
        <Fragment>
            <CardTitle
                bordered={false}
                title={<TabsTitle />}
                extra={tabsExtra}
            />
            <Row gutter={8} className={"mt-[10px] mb-[30px]"}>
                <Col span={7}>
                    <Areas />
                </Col>
                <Col span={17}>
                    <Servers />
                </Col>
            </Row>
        </Fragment>
    )
}

/**海外需求 */
const OverseasDemand: React.FC = () => {
    const { demands } = useContext(IndexPageContext);
    const Demand: React.FC<DemandVo> = (props) => {

        return (
            <Link href={"/demand/[id]"} as={`/demand/${props.id}`}>
                <a className={"lc-1 flex row-center"} target="_blank">
                    <Icon type={"icon-sanjiaoright"} className={"color-[primary] mr-[5px]"} />
                    <span>{props.content}</span>
                </a>
            </Link>
        )
    }

    const extra = (
        <Link href={"/demand"}>
            <a target="_blank">
                查看更多
                <Icon
                    type={"icon-youjiantou"}
                    className={"ml-[8px]"}
                />
            </a>
        </Link>
    )
    const ODClas = css`
    height: 317px;
    `
    return <Card
        bordered={false}
        title={"跨境乔帮主"}
        className={cx(ODClas, "mb-[15px] hidden")}
        extra={extra}
    >
        <Swiper style={{ height: "217px", marginTop: '-5px' }} speed={200} autoplay={{ reverseDirection: true }} loop pagination slidesPerView={5} direction={'vertical'}>
            {demands.map((demand) => (
                <SwiperSlide key={demand.id}>
                    <List.Item key={demand.id}>
                        <Demand {...demand} />
                    </List.Item>
                </SwiperSlide>
            ))}
        </Swiper>
    </Card >
}

/**文章 */
const Articles: React.FC = () => {
    const { articlePlatforms, initArticles } = useContext(IndexPageContext);
    const [articles, setArticles] = useState<PageSource<Article>>(initArticles);
    const [params, setParams] = useState<PageParams>();
    const [loading, setLoading] = useState<boolean>(false);

    /**加载更多 */
    const loadMore = () => {
        setParams({
            ...params,
            size: 10,
            articleType: 1,
            auditStatus: 1,
            current: Number(params?.current || 4) + 1
        });
    }

    /**条件参数修改 */
    const loadDataSource = () => {
        if (!params) return;
        setLoading(true);
        getArticlePage(params)
            .then((res) => {
                const { records } = res.data;
                const nextRecords = [...articles.records, ...records];
                setArticles({ ...res.data, records: nextRecords });
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const onSetActiveKey = (activeKey: Key) => {
        setParams({ ...params, current: 1, articlePlatformId: activeKey });
        setArticles({ ...articles, records: [] });
    }

    useEffect(loadDataSource, [params]);

    useEffect(() => {
        setArticles(initArticles);
    }, [initArticles]);

    const lasts = slice(articles.records, 0, 3);
    const other = slice(articles.records, 3, articles.records.length);

    const Tags: React.FC = () => {
        return (
            <Fragment>
                {/* @ts-ignore */}
                <ScrollTags
                    activeKey={params?.articlePlatformId}
                    onChange={onSetActiveKey}
                >
                    {articlePlatforms.map(({ id, name }) => {
                        return (
                            <ScrollTags.Item
                                tagsKey={id}
                                key={id}
                            >
                                {name}
                            </ScrollTags.Item>
                        )
                    })}
                </ScrollTags >
            </Fragment>

        )
    }

    const Last: React.FC = () => {
        if (!lasts.length) {
            return (
                <Card bordered={false} className={"mt-[10px]"}>
                    <Empty />
                </Card>
            )
        }
        return (
            <Row gutter={16} className={"mt-[10px]"}>
                {lasts.map((article) => (
                    <Col span={8} key={article.id}>
                        <Link
                            href={"/articles/[id]"}
                            as={`/articles/${article.id}`}
                        >
                            <a target="_blank">
                                <ArticleCard {...article} />
                            </a>
                        </Link>
                    </Col>
                ))}
            </Row>
        )
    }

    const Other: React.FC = () => {

        const hasMore: boolean = articles.current >= articles.pages;

        if (!other.length) return <Fragment />;

        return (
            <Card
                bordered={false}
                className={"mt-[15px] card-pd0"}
            >
                <List
                    dataSource={other}
                    renderItem={(item) => {
                        const { id, thumbPicUrl, userId, user, updatedAt, readNum, collectNum } = item;
                        const OtherLink: React.FC = ({ children }) => (
                            <Link
                                href={"/articles/[id]"}
                                as={`/articles/${id}`}
                            >
                                <a target="_blank">{children}</a>
                            </Link>
                        )

                        const avatar = (
                            <OtherLink>
                                <div className="w-[240px] h-[150px] hidden">
                                    <Avatar
                                        src={thumbPicUrl}
                                        shape={"square"}
                                        className={"w-[240px] h-[150px] scale-[1.05]"}
                                    />
                                </div>
                            </OtherLink>
                        )

                        const title = (
                            <OtherLink>
                                <h4 className="lc-1 h-[30px] ma-[0px] color-[#000000e6] fs-[18px] fw-600">
                                    {item.title}
                                </h4>
                            </OtherLink>
                        )

                        const description = (
                            <Fragment>
                                <p className="lc-2 color-[#999999] fs-[14px] fw-400 mt-[10px] mb-[35px] h-[45px] fh-[24px]">
                                    {item.description}
                                </p>
                                <Link href={"/users/index/[id]"} as={`/users/index/${userId}`}>
                                    <a target="_blank">
                                        <Space
                                            align={"center"}
                                            className="color-[#00000066] fs-[12px] fw-400"
                                        >
                                            <Avatar src={user?.avatar} />
                                            <span>{user?.nick}</span>
                                            <span>{updatedAt}</span>
                                            <span className="ml-[30px] flex row-center">
                                                <Icon
                                                    type={"icon-yanjing"}
                                                    className={"fs-[16px] mr-[8px] color-[#d8d8d8]"}
                                                />
                                                <span>{readNum}</span>
                                            </span>
                                            <span className="flex row-center">
                                                <Icon
                                                    type={"icon-aixin"}
                                                    className={"fs-[16px] mr-[8px] color-[#d8d8d8]"}
                                                />
                                                <span>{collectNum}</span>
                                            </span>
                                        </Space>
                                    </a>
                                </Link>
                            </Fragment>
                        )

                        return (
                            <List.Item className="pa-[25px] hover">
                                <List.Item.Meta
                                    avatar={avatar}
                                    title={title}
                                    description={description}
                                />
                            </List.Item>
                        )
                    }}
                />

                <Divider />

                <Center>
                    <Button
                        shape={"round"}
                        onClick={loadMore}
                        size={"large"}
                        disabled={hasMore}
                        style={{ width: 160 }}
                        type={"primary"}
                        ghost
                    >
                        {hasMore ? "没有更多了" : "加载更多"}
                    </Button>
                </Center>
            </Card>
        )
    }

    return <Spin spinning={loading}>
        <Tags />
        <Last />
        <Other />
    </Spin>
}

/**右侧广告 */
const AdvertBanner: React.FC = () => {
    const [ads1, setAds1] = useState<Advert[]>([])
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    useEffect(() => {
        pageAd({ adSiteKey: "home_right_banner_01" }).then(res => {
            setAds1(res.data.records)
        });

    }, [])
    return <Fragment>
        <Carousel className="mb-[25px]">
            {ads1.map((advert) => (
                <a
                    target={"_blank"}
                    href={advert.url}
                    key={advert.id}
                    className={"block"}
                    onClick={()=>bannerClick({
                        bannerID: advert.id,bannerName: advert.adSiteName,pageName:'首页右边栏乔帮主广告位',userId: userInfo?.userId || '',mobile:userInfo?.mobile || ''
                    })}
                >
                    <img src={advert.picUrl} className={"w-[285px] h-[120px] br-a-[5px]"} />
                </a>
            ))}
        </Carousel>
    </Fragment>
}

/**24小时快讯 */
const Newsletter: React.FC = () => {
    const { news } = useContext(IndexPageContext);

    const classns = css`
        border-left: 1px dashed #C7C8CEFF;
        border-radius: 0;
    `;

    const itemClassns = css`
        position: relative;
        .ikjzd-collapse-header{
            padding-bottom:5px!important;
        }
        &::before {
            content: "";
            display: block;
            width: 14px;
            height: 14px;
            border: 3px solid ${process.env.PRIMARY_COLOR};
            background-color: #fff;
            border-radius: 50%;
            position: absolute;
            left: -8px;
            top: 16.5px;
        }
        &:hover{
            &+span{
                a{
                    display:flex;
                }
            }
        }
    `;
    const news24Cls = css`
        height: 24px;
        a{display:none}
        &:hover{
            a{
                display:flex;
            }
        }
    `
    const extra = (
        <Link href={"/news"}>
            <a target="_blank">
                查看更多
                <Icon
                    type={"icon-youjiantou"}
                    className={"ml-[8px]"}
                />
            </a>
        </Link>
    )

    return <Card
        title={"24小时快讯"}
        bordered={false}
        className={"mb-[15px]"}
        extra={extra}
    >
        <Collapse ghost className={classns}>
            {news.map((item) => {
                const { title, createdAt, description, id } = item;
                let timeStr: string = "";
                const hours = moment().diff(moment(createdAt), "hours");
                const days = moment().diff(moment(createdAt), "days");
                const weeks = moment().diff(moment(createdAt), "weeks");
                const months = moment().diff(moment(createdAt), "months");
                if (hours >= 1) timeStr = `${hours}小时前`;
                if (days >= 1) timeStr = `${days}天前`;
                if (weeks >= 1) timeStr = `${weeks}周前`;
                if (months >= 1) timeStr = `${months}月前`;
                if (!timeStr) timeStr = `最近`;

                const header = (
                    <p className="color-[#000000e6] fs-[14px] ma-[0px] break-all pl-[5px]">{title}</p>
                )
                const showQrCode = () => {
                    const href = `${window.location.origin}/news/${id}`;
                    QrCode.modal({
                        content: href,
                        width: 200,
                    })
                }

                return (
                    <Fragment key={item.id}>
                        <Collapse.Panel
                            className={itemClassns}
                            key={id}
                            header={header}
                            showArrow={false}
                        >
                            <p className={"ma-[0px]"}>
                                {description}
                            </p>
                        </Collapse.Panel>
                        <span className={cx(news24Cls, "block", "px-[10px] pl-[15px]", "color-[#00000066]", "fs-[12px]")}>
                            {timeStr}
                            <a
                                className="ml-[10px] flex row-center color-[#bbbbbb] float-right"
                                onClick={showQrCode}
                            >
                                分享至
                                <Icon className="fs-[20px] ml-[10px]" type={"icon-logo-wechat"} />
                            </a>
                        </span>
                    </Fragment>
                )
            })}
        </Collapse>
    </Card>
}

/**交流群 */
const ExchangeGroup: React.FC = () => {

    const { snsConfig } = useContext(IndexPageContext);

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
            className={"mb-[15px]"}
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

/**专家专栏 */
const ExpertColumn: React.FC = () => {
    const { experts } = useContext(IndexPageContext);
    return (
        <Card
            title={"专家专栏"}
            bordered={false}
            className={"mb-[15px]"}
        >
            {experts.map((item) => {
                const ExpertLink: React.FC = ({ children }) => (
                    <Link href={"/users/index/[id]"} as={`/users/index/${item.userId}`}>
                        <a target="_blank">{children}</a>
                    </Link>
                )

                const title = (
                    <ExpertLink>
                        {item.nick}
                    </ExpertLink>
                )

                const description = (
                    <ExpertLink>
                        <Row className={"fs-[12px] color-[#00000066]"}>
                            <Col span={14}>
                                发表了 {item.pushSum}篇
                            </Col>
                            <Col span={10}>
                                <Icon type={"icon-yanjing"} />
                                <span className="ml-[5px]">{item.readSum}</span>
                            </Col>
                        </Row>
                    </ExpertLink>
                )

                const avatar = (
                    <ExpertLink>
                        <Avatar src={item.avatar} size={40} />
                    </ExpertLink>
                )

                return (
                    <List.Item key={item.userId}>
                        <List.Item.Meta
                            avatar={avatar}
                            title={title}
                            description={description}
                        />
                    </List.Item>
                )
            })}
        </Card>
    )
}

/**活动峰会 */
const Conference: React.FC = () => {

    const { activitys } = useContext(IndexPageContext);

    const cardExtra = (
        <Link href={"/acd"}>
            <a className={cx("fs-[14px] fw-400 color-[#00000099]")} target="_blank">
                查看更多
                <Icon
                    type={"icon-youjiantou"}
                    className={"ml-[8px]"}
                />
            </a>
        </Link>
    )

    const firsts = slice(activitys, 0, 4);
    const other = slice(activitys, 4, activitys.length);

    const ConferenceCard: React.FC<Activity> = (props) => {
        const { title, createdAt, posterUrl, province } = props;

        const contentClassns = css`
            bottom: 0;
            background: rgba(0, 0, 0, 0.2000);
            backdrop-filter: blur(5px);
        `;

        return <div className={"hover h-[135px] bg-color-[#eeeeee] br-a-[3px] hidden relative"}>
            <Avatar
                shape={"square"}
                className={"w-[100%] h-[100%] scale-[1.05]"}
                src={posterUrl}
            />
            <div className={cx(contentClassns, "h-[45px] w-[100%] absolute py-[2px] px-[16px] color-[#ffffff]")}>
                <a className="mb-[0px] lc-1 color-[#ffffff]">{title}</a>
                <Row className="fs-[12px]">
                    <Col span={14} className={"flex row-center"}>
                        <Icon
                            type={"icon-shijian"}
                            className={"fs-[16px] mr-[6px]"}
                        />
                        {createdAt}
                    </Col>
                    <Col span={10} className={"flex row-center"}>
                        <Icon
                            type={"icon-position"}
                            className={"fs-[16px] mr-[6px]"}
                        />
                        {province}
                    </Col>
                </Row>
            </div>
        </div>
    }
    const hoverCls = css`
        &:hover{
           *{ color: #fff;}
        }
    `
    return (
        <Container className="mb-[30px]">
            <CardTitle
                bordered={false}
                title={<span className={cx("fs-[24px] fw-500 color-[#000000e6]")}>活动峰会</span>}
                extra={cardExtra}
            />

            <Card
                bordered={false}
                className={"mt-[10px]"}
                bodyStyle={{ padding: 0 }}
            >
                <Row
                    gutter={16}
                    className={"mb-[15px]"}
                >
                    {firsts.map((item) => (
                        <Col span={6} key={item.id}>
                            <Link
                                href={"/acd/[id]"}
                                as={`/acd/${item.id}`}
                            >
                                <a target="_blank" className={hoverCls}>
                                    <ConferenceCard {...item} />
                                </a>
                            </Link>
                        </Col>
                    ))}
                </Row>
                <List
                    dataSource={other}
                    pagination={false}
                    renderItem={(item) => {

                        const ActivityLink: React.FC<{ className?: string }> = ({ children, className }) => (
                            <Link href={"/acd/[id]"} as={`/acd/${item.id}`}>
                                <a className={className} target="_blank">{children}</a>
                            </Link>
                        )

                        return (
                            <List.Item className="hover">
                                <List.Item.Meta
                                    avatar={(
                                        <ActivityLink>
                                            <div className="w-[145px] h-[65px] hidden br-a-[3px]">
                                                <Avatar
                                                    shape="square"
                                                    className="w-[145px] h-[65px] scale-[1.05]"
                                                    src={item.posterUrl}
                                                />
                                            </div>
                                        </ActivityLink>
                                    )}
                                    title={(
                                        <ActivityLink className={"color-[#000000]f fs-[18px]"}>
                                            {item.title}
                                        </ActivityLink>
                                    )}
                                    description={(
                                        <Fragment>
                                            <div className={"color-[#00000099] mb-[5px]"}>
                                                {item.address}
                                            </div>
                                            <Row className={"color-[#00000066] fs-[12px]"}>
                                                <Col span={4} className="flex row-center">
                                                    <Icon type={"icon-shijian"} className={"fs-[16px] mr-[6px]"} />
                                                    {item.startTime}
                                                </Col>
                                                <Col span={3} className="flex row-center">
                                                    <Icon type={"icon-position"} className={"fs-[16px] mr-[6px]"} />
                                                    {item.province}
                                                </Col>
                                            </Row>
                                        </Fragment>
                                    )}
                                />
                            </List.Item>
                        )
                    }}
                >
                </List>
            </Card>
        </Container>
    )
}
