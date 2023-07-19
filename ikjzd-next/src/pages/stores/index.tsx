import DefaultLayout from "@/components/layouts/DefaultLayout";
import { PageParams, PageSource } from "@/vo/PageParams";
import { css } from "@emotion/css";
import { Button, Card, Carousel, List, Menu, MenuProps, Pagination as AntdPagination, Space, Tabs } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import React, { Key, useContext, useEffect, useState } from "react";
import { ShopOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons';
import { investmentGetPage, shopeAreaList, shopList } from "@/apis/stores";
import { AreaListInfo, PlatformInfo } from "@/vo/Stores";
import { useRouter } from "next/router";
import Article from "@/vo/Article";
import { Advert } from "@/vo/Basic";
import SeoHead from "@/components/SeoHead";
import { pageAd } from "@/apis/home";
const prefix = process.env.CLASS_PREFIX;
interface ArticleIndexContextProps extends ArticleIndexPageProps {

}

const StoresIndexContext = React.createContext<ArticleIndexContextProps>({} as ArticleIndexContextProps);

interface ArticleIndexPageProps {
    areaList: AreaListInfo[];
    platformList: PageSource<PlatformInfo>;
    bannerList: PageSource<Advert>;
    commends: Article[];
}

/**开店列表 */
const StoresIndexPage: NextPage<ArticleIndexPageProps> = (props) => {

    const ctxValue: ArticleIndexContextProps = {
        ...props
    }
    const storesDefaultLayout = css`
        width: auto!important;
        padding-top: 0!important;
        position: relative;
        .${prefix}-stores-menu{
            position:absolute;
            height: 392px;
            margin-left: -600px;
            top: 20px;
            left: 50%;
            z-index: 2;
            >dd{
                >h2{
                    padding: 20px 0 10px 14px;
                }
                width: 240px;
                background-color: #fff;
            }
            
        }
    `;
    return (
        <StoresIndexContext.Provider value={ctxValue}>
            <DefaultLayout className={storesDefaultLayout}>
                <SeoHead
                    title={'跨境电商平台入驻__跨境知道'}
                    keyword={'跨境电商,账号注册,平台入驻'}
                    description={'跨境知道关注跨境电商一系列行业动态、平台政策、新闻资讯、运营干货、新外贸等讯息，帮助跨境卖家最快掌握跨境行业动态，了解最全、最新的实操经验!'}
                />
                <FixAreaMenu />
                <CarouselComponent />
                <div style={{ width: "1200px", margin: '20px auto' }}>
                    <AreaContent />
                    <InvestmentPoliciesComponent />
                </div>
            </DefaultLayout>
        </StoresIndexContext.Provider>
    )
}

StoresIndexPage.getInitialProps = async (ctx) => {
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key;

    const params: PageParams = {
        current,
        size: 20,
        isRecommend: 1
    }
    let areaList = (await shopeAreaList({ current: 1, size: 100 })).data
    let platformList = (await shopList(params)).data
    let bannerList = (await pageAd({ adSiteKey: "shop_top_banner_01" })).data

    const commends = (await investmentGetPage({
        current: 1,
        size: 100,
    })).data.records;

    return {
        areaList,
        platformList,
        bannerList,
        commends
    }
}

export default StoresIndexPage;

//漂浮区域导航
const FixAreaMenu: React.FC = () => {
    const storesMenuLogo = css`
        dd{
            display: flex;
            flex-wrap: wrap;
            cursor: pointer;
            align-items: center;
            text-align: center;
            img{
                width: 130px;
        }
    }`;
    type MenuItem = Required<MenuProps>['items'][number];
    function getItem(
        label: React.ReactNode,
        key?: React.Key | null,
        icon?: React.ReactNode,
        children?: MenuItem[],
        popupClassName?: string,
        type?: 'group',
    ): MenuItem {
        return {
            key,
            icon,
            children,
            label,
            popupClassName,
            type,

        } as MenuItem;
    }
    let { areaList } = useContext(StoresIndexContext)
    let areaListHandle = areaList.map((item: AreaListInfo) => {
        let platformMenuList = item.shopSimpleDTOList.map(platform => {
            return <div key={platform.id}><Link href={`/stores/${platform.id}`}><a target={"_blank"}><img src={platform.iconUrl} /></a></Link></div>
        })
        return getItem(item.name, 'sub' + item.id, null, [getItem(null, item.id, <dl className={storesMenuLogo}>
            <dt>{item.name}</dt>
            <dd>{platformMenuList}</dd>
        </dl>)], 'stores-menu-sub')
    })
    const items: MenuItem[] = areaListHandle

    return <dl className={`${prefix}-stores-menu`}>
        <dd>
            <h2><ShopOutlined /> 免费全球开店</h2>
            <Menu className="aaaa" style={{ height: "346px", overflow: "auto" }} mode="vertical" items={items} />
        </dd>

    </dl>
}

//轮播图
const CarouselComponent: React.FC = () => {
    const { bannerList } = useContext(StoresIndexContext)
    if (!bannerList.records.length) return <></>
    return <Carousel className="cs-p">
        {bannerList.records?.map((item, key) => <div key={key}>
            <a href={item.url} target="_blank"><img height={430} src={item.picUrl} alt={item.title} /></a>
        </div>)}
    </Carousel>
}

//店铺区域
const AreaContent: React.FC = () => {
    const storesOpeningPlatforms = css`
    display: flex;
    flex-wrap: wrap;
    >li{
        width: 360px;
        border: 1px solid #eee;
        height: 348px;
        padding:20px;
        text-align: center;
        margin-bottom: 20px;
        margin-right: 20px;
        &:hover{
            box-shadow: 0px 4px 7px 0px #d4d4d4;
        }
        .stores-platform-title{
            color: #222;
            font-size: 16px;
            line-height:28px;
            &:hover{
                color: #f676a6;
            }
        }
        .stores-platform-content{
            color: #999;
            line-height:28px;
            min-height: 56px;
        }
        .stores-platform-work {
            display: inline-block;
            font-size: 12px;
            background-color: #EEEEEE;
            margin: 20px auto;
            padding:5px 10px;
            border-radius: 12px;
            color: #999;
            span{
                color: #4790cf;
                font-size: 12px;
            }
        }
    }
`
    const [areaActiveKey, setAreaActiveKey] = useState<string>('999')
    let { areaList, platformList } = useContext(StoresIndexContext)
    const { query, replace } = useRouter();
    const [platformListHandel, setPlatformListHandel] = useState(platformList)
    //区域切换
    const areaChange = async (value: string) => {
        setAreaActiveKey(value)
        let params: PageParams = {
            isRecommend: value === "999" ? 1 : 0,
            size: 20
        }
        if (value !== "999") params.regionId = value
        let { data } = await shopList(params)
        setPlatformListHandel(data)
    }
    useEffect(() => {
        setPlatformListHandel(platformList)
    }, [platformList])
    const openStoresBtn = css`
        width: 320px;
        color: #999;
        &:hover{
            span{
                color: #fff!important;
            }
            background-color: #f676a6;
        }
    `
    return <Card>
        <Tabs size="large" activeKey={areaActiveKey} onChange={areaChange}>
            <Tabs.TabPane tab="推荐" key="999">
            </Tabs.TabPane>
            {areaList.map(item => {
                return <Tabs.TabPane tab={item.name} key={item.id}>
                </Tabs.TabPane>
            })}
        </Tabs>
        <ul className={storesOpeningPlatforms}>
            {platformListHandel?.records.map((item, key) => <li key={key}>
                <Link href={`/stores/${item.id}`}>
                    <a target={'_blank'}>
                        <img src={item.iconUrl} className="w-[320px] h-[105px]" />
                        <p className="stores-platform-title lc-1">{item.title}</p>
                        <p className="stores-platform-content lc-2">{item.description}</p>
                        <p className="stores-platform-work"><span>{item.registerUrlTime}</span>下发注册链接</p>
                        <Button size="large" className={openStoresBtn}>我要开店</Button>
                    </a>
                </Link>
            </li>)}
        </ul>
        <AntdPagination
            className="mt-[10px] text-center"
            current={platformListHandel?.current}
            total={platformListHandel?.total}
            pageSize={platformListHandel?.size}
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
}

//招商政策
const InvestmentPoliciesComponent: React.FC = () => {
    const InvestmentPolicies = css`
        .ikjzd-list-items{
            display: flex;
            justify-content: space-between;
            flex-wrap:wrap;
        }
        .ikjzd-list-item{
            width: 48%;
            flex-direction: row-reverse;
            cursor: pointer;
            h4 div{
                &:hover{
                    color: #f676a6;
                }
            }
            .stores-investment-policies-desc{
                div,span{
                    color: #999;
                }
                .lc-2{
                    min-height: 44px;
                }
            }
        }
        .ikjzd-list-item:last-child{
            border-bottom: 1px solid #f0f0f0;
        }
    `
    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space className="ml-[15px]">
            {React.createElement(icon)}
            {text}
        </Space>
    );
    const { commends } = useContext(StoresIndexContext)
    return <Card title="招商政策" className="mt-[20px]">
        <List
            className={InvestmentPolicies}
            itemLayout="horizontal"
            dataSource={commends}
            renderItem={item => (
                <List.Item
                    extra={<Link href={`/articles/${item.id}`}>
                        <a target={"_blank"}>
                            <img
                                width={216}
                                height={140}
                                alt={item.title}
                                src={item.thumbPicUrl}
                            /></a>
                    </Link>}>
                    <List.Item.Meta
                        title={<Link href={`/articles/${item.id}`}>
                            <a target={"_blank"}><div className="lc-1 ml-[20px] mb-[20px]">{item.title}</div></a>
                        </Link>}
                        description={
                            <Link href={`/articles/${item.id}`}>
                                <a target={"_blank"}>
                                    <div className="stores-investment-policies-desc ml-[20px]">
                                        <div className="lc-2">{item.description}</div>
                                        <div className="mt-[20px]">
                                            <span>{item.author}</span>
                                            <IconText icon={EyeOutlined} text={String(item.readNum as number)} key="list-vertical-like-o" />
                                            <IconText icon={MessageOutlined} text={String(item.commentNum as number)} key="list-vertical-message" />
                                        </div>
                                    </div>
                                </a>
                            </Link>}
                    />
                </List.Item>
            )}
        />

    </Card>
}