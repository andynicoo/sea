import { NextPage } from "next";
import React, { Fragment, Key, useState, useContext, useEffect } from "react";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { useRouter } from "next/router";
import ScrollTags from "@/components/ScrollTags";
import {
    Card,
    Col,
    Row,
    Empty,
    Pagination,
    Tabs,
    Tag,
    Avatar,
    Space,
    List,
} from "antd";
import { ArticleCategory } from "@/vo/Article";
import Link from "next/link";
import createEmotion from "@emotion/css/create-instance";
import { getArticleCateList } from "@/apis/platform";
import { getArticlePage } from "@/apis/article";
import Article from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import LazyLoad from "react-lazyload";
import { TagOutlined } from "@ant-design/icons";
import SearchInput from "@/components/SearchInput";

const { css, cx } = createEmotion({
    key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});

import HotArticle from "@/components/hegui/HotArticle";
import EntryChannel from "@/components/hegui/EntryChannel";
import { HotInvitations } from "@/components/encyclopedia/Details";
import { bbsPages } from "@/apis/bbs";
import { Bbs } from "@/vo/Bbs";
import { Articles } from "@/components/encyclopedia/Details";
import { Tools, Toolsrecord, ToolsPlatform } from "@/vo/Tools";
import {
    kjzdToolsListAll,
    kjzdToolsPlatformListAll,
    getPlatformInfoById,
} from "@/apis/tools";
import { ActivityPlatform } from "@/vo/Encyclopedia";
import { platform } from "os";

interface PlatformDetailContentProps extends PlatformDetailPageProps { }

const PlatformDetailContent = React.createContext<PlatformDetailContentProps>(
    {} as PlatformDetailContentProps
);

interface PlatformDetailPageProps {
    /**跨境 taglist */
    cateList: ArticleCategory[];
    /**文章 分页 */
    articles: PageSource<Article>;
    hots: Article[];
    hotBbs: Bbs[];
    /**感兴趣的文章 */
    interest: Article[];
    /**资源工具 分页 */
    toolsList: PageSource<Tools>;
    //   资源下载 平台
    platforms: ToolsPlatform[];
    // 平台信息
    platformInfo: ActivityPlatform;
}

// 跨境分类页
const PlatformDetailPage: NextPage<PlatformDetailPageProps> = (props) => {
    const { query, push } = useRouter();
    const router = useRouter();
    let { type } = query;
    if (!type) type = "1";
    const [activeKey, setActiveKey] = useState<string>(type.toString());

    const ctxValue: PlatformDetailContentProps = {
        ...props,
    };
    const { TabPane } = Tabs;

    const onChange = (key: string) => {
        if (key === "4") {
            window.open(
                "https://www.kjyunke.com/courses-search?keyword=%E4%BA%9A%E9%A9%AC%E9%80%8A"
            );
        } else if (key === "5") {
            router.push({ pathname: "/k" });
        } else {
            setActiveKey(key);
            router.push(
                {
                    pathname: `/platformdetails/[id]`,
                    query: { type: key, platformid: query.platformid },
                },
                {
                    pathname: `/platformdetails/${query.id}`,
                    query: { type: key, platformid: query.platformid },
                }
            );
        }
    };

    return (
        <PlatformDetailContent.Provider value={ctxValue}>
            <SeoHead
                title={ctxValue.platformInfo.platformSeotitle}
                description={ctxValue.platformInfo.platformSeodescribe}
                keyword={ctxValue.platformInfo.platformTag}
            />
            <MinHead />
            <TopBrand />
            <Container className="h-[50px] pl-[200px]">
                <Tabs defaultActiveKey={activeKey} onChange={onChange}>
                    <TabPane tab="首页" key="1"></TabPane>
                    <TabPane tab="简介" key="2"></TabPane>
                    <TabPane tab="资源工具" key="3"></TabPane>
                    <TabPane tab="课程" key="4"></TabPane>
                    <TabPane tab="K圈" key="5"></TabPane>
                </Tabs>
            </Container>
            <Container className="my-[20px]">
                <Row gutter={20}>
                    <Col span={18}>
                        {
                            // activeKey==='1'? <div>11</div> : activeKey==='2'? <div>22</div> : <div>33</div>
                        }
                        {activeKey === "1" ? (
                            <div>
                                <Fragment>
                                    {/* @ts-ignore */}
                                    <ScrollTags activeKey={query.platformid}
                                        onChange={(activeKey) =>
                                            push(
                                                {
                                                    pathname: `/platformdetails/[id]`,
                                                    query: { type: "1", platformid: activeKey },
                                                },
                                                {
                                                    pathname: `/platformdetails/${query.id}`,
                                                    query: { type: "1", platformid: activeKey },
                                                }
                                            )
                                        }
                                    >
                                        {props.cateList.map(({ id, name }) => {
                                            return (
                                                <ScrollTags.Item tagsKey={id} key={id}>
                                                    {name}
                                                </ScrollTags.Item>
                                            );
                                        })}
                                    </ScrollTags>
                                </Fragment>
                                <PlatformContentLeft articles={props.articles} />
                            </div>
                        ) : activeKey === "2" ? (
                            <div>
                                <DescContent />
                                <div className="mt-[20px]">
                                    <Articles articles={props.interest} />
                                </div>
                            </div>
                        ) : (
                            <ToolsContent />
                        )}
                    </Col>
                    <Col span={6}>
                        <div>
                            <EntryChannel platformInfo={props.platformInfo} />
                            <HotInvitations hots={props.hotBbs} />
                            <HotArticle hots={props.hots} />
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </PlatformDetailContent.Provider>
    );
};

export default PlatformDetailPage;

PlatformDetailPage.getInitialProps = async (ctx) => {
    const { current, id, platformid, title } = (ctx.query || {}) as PageParams;
    /**文章参数 */
    const articlesParams: PageParams =
    {
        current: current,
        size: 30,
        articleType: 1,
        auditStatus: 1,
        articleTagId: platformid,
        articlePlatformId: id,
    }

    /**热门文章参数 */
    const hotArticles: PageParams = {
        articleType: 1,
        auditStatus: 1,
        current: 1,
        order: "DESC",
        size: 10,
        sort: "created_at",
    };

    const params: PageParams = {
        current: current,
        size: 20,
        searchType: 1,
        title: title,
    };

    const cateList = (await getArticleCateList()).data;
    const articles = (await getArticlePage(articlesParams)).data;
    const hots = (await getArticlePage(hotArticles)).data.records;
    const hotBbs = (await bbsPages({ searchType: 5 })).data.records;
    const interest = articles.records.slice(0, 10);
    const toolsList = (await kjzdToolsListAll(params)).data;
    const platforms = (await kjzdToolsPlatformListAll()).data;
    const platformInfo = (await getPlatformInfoById({ id: id })).data;

    return {
        cateList,
        articles,
        hots,
        hotBbs,
        interest,
        toolsList,
        platforms,
        platformInfo,
    };
};

const PlatformContentLeft: React.FC<{ articles: PageSource<Article> }> = ({
    articles,
}) => {
    /**原始站复制来的样式 */
    const cls = css`
    margin: 20px 0;
    & a.outdiv {
      display: flex;
    }

    & div.item-img {
      width: 240px;
      height: 150px;
      overflow: hidden;
    }

    & div.el-image {
      position: relative;
      display: inline-block;
      overflow: hidden;

      & img {
        width: 100%;
        height: 100%;
      }
    }
    & div.item-box {
      flex: 1;
      margin-left: 20px;
      height: 150px;
      position: relative;

      & div.title {
        font-size: 20px;
        margin: 10px 0;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #323336;
        line-height: 28px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      & div.text {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #8a8e99;
        line-height: 23px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    & .item-bottom {
      position: absolute;
      left: 0;
      bottom: 5px;
      width: 100%;
      & span.user-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;
        & img {
          width: 100%;
          height: 100%;
        }
      }
      & .user-text {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #828999;
        line-height: 32px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      & .origin-icon {
        margin-left: 29px;
        width: 14px;
        height: 14px;
        background-size: cover;
        margin-right: 5px;
        margin-top: 6px;
      }
      & .origin-name {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #989fb3;
        margin-right: 5px;
        line-height: 32px;
        max-width: 350px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      & .tags {
        color: #555;
        margin-right: 2px;
      }
    }
  `;

    const { query, push } = useRouter();

    const Page: React.FC = () => {
        if (!articles.total) return <Fragment />;
        return (
            <Pagination
                className="float-right mt-[20px]"
                current={articles.current}
                total={articles.total}
                pageSize={30}
                showSizeChanger={false}
                disabled={false}
                onChange={() => { }}
                itemRender={(page: any, type: any, originalElement: any) => (
                    <Link
                        scroll={false}
                        href={{
                            pathname: `/platformdetails/[id]`,
                            query: { type: "1", platformid: query.platformid, current: page },
                        }}
                        as={{
                            pathname: `/platformdetails/${query.id}`,
                            query: { type: "1", platformid: query.platformid, current: page },
                        }}
                    >
                        <a>{type === 'page' ? page : originalElement}</a>
                    </Link>
                )}
            />
        );
    };

    if (!articles.records.length) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        );
    }

    return (
        <Card bordered={false}>
            <ul>
                {articles.records.map((article) => {
                    const {
                        id,
                        title,
                        thumbPicUrl,
                        description,
                        readNum,
                        user,
                        articleTagName,
                        articleTagIds,
                    } = article;

                    return (
                        <li key={id} className={cx(cls)}>
                            <a className="outdiv db">
                                <Link href={"/articles/[id]"} as={`/articles/${id}`}>
                                    <a>
                                        <LazyLoad height={150}>
                                            <div className={"item-img scale-[1.1]"}>
                                                <div className={"el-image"}>
                                                    <img src={thumbPicUrl} />
                                                </div>
                                            </div>
                                        </LazyLoad>
                                    </a>
                                </Link>
                                <div className={"item-box"}>
                                    <Link href={"/articles/[id]"} as={`/articles/${id}`}>
                                        <a>
                                            <div className={"title"}>{title}</div>
                                            <div className={"text"}>{description}</div>
                                        </a>
                                    </Link>
                                    <div className="clearfix item-bottom">
                                        <a target="_blank" className="float-left clearfix">
                                            <span className="user-icon float-left">
                                                <img src={user?.avatar} />
                                            </span>
                                            <div className="user-text float-left">{user?.nick}</div>
                                        </a>
                                        <span className="origin-icon float-left">
                                            <TagOutlined />
                                        </span>
                                        <div className="origin-name float-left">
                                            <a>
                                                {articleTagName?.split(",").map((tag, index) => {
                                                    return (
                                                        <Link
                                                            href={`/hegui/tagarticle/[id]`}
                                                            as={`/hegui/tagarticle/${articleTagIds ? articleTagIds[index] : ""
                                                                }`}
                                                        >
                                                            <a>
                                                                <span className="tags pr-[5px]">{tag}</span>
                                                            </a>
                                                        </Link>
                                                    );
                                                })}
                                            </a>
                                        </div>
                                        <div className="care-num float-right">{readNum}</div>
                                        <span className="care-icon float-right"></span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    );
                })}
            </ul>
            <Page />
        </Card>
    );
};

/**顶部tab、搜索 */
const TopBrand: React.FC = () => {
    const cls = css`
    height: 200px;
    background: #2d3144;
    padding-top: 48px;
    .icon {
      width: 200px;
      height: 152px;
      position: relative;
      img {
        width: 100%;
        height: 200px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .text {
      color: #ffffff;
      width: 800px;
    }
  `;
    const { platformInfo } = useContext(PlatformDetailContent);

    return (
        <div className={cx(cls)}>
            <Container>
                <div className="icon float-left">
                    <img src={platformInfo?.platformIcon} alt={platformInfo?.name} />
                </div>
                <div className="float-left ml-[20px] text">
                    <h2 className="fw-[600px] fs-[28px] mt-[30px] color-[#ffffff]">
                        {platformInfo?.name}
                    </h2>
                    <p className="fs-[16px] mt-[10px] lc-1">
                        {platformInfo?.platformDescription}
                    </p>
                </div>
            </Container>
        </div>
    );
};

/**顶部tab、简介 */
const DescContent: React.FC = () => {
    const cls = css`
    background: #fff;
    padding: 40px 30px;
    h2 {
      font-size: 28px;
      color: #1d1d1b;
      font-weight: 400;
      margin-right: 8px;
      margin-bottom: 35px;
    }
    h5 {
      margin-bottom: 35px;
      font-size: 14px;
      color: #1d1d1b;
      text-align: justify;
    }
    p {
      margin: 20px 0;
      line-height: 30px;
      padding: 40px 0px;
    }
  `;

    const { platformInfo } = useContext(PlatformDetailContent);
    return (
        <div className={cx(cls)}>
            <h2>{platformInfo.name}</h2>
            <h5>{platformInfo.platformDescription}</h5>
            <div
                className={"rich-text"}
                dangerouslySetInnerHTML={{
                    __html: platformInfo.platformBrief as string,
                }}
            ></div>
        </div>
    );
};

/**顶部tab、资源工具 */
const ToolsContent: React.FC = () => {
    return (
        <div>
            <ToolsContetnt />
        </div>
    );
};

/**主体内容 */
export const ToolsContetnt: React.FC = () => {
    const { query, replace } = useRouter();
    const { toolsList } = useContext(PlatformDetailContent);
    /**搜索框 */
    const Extra: React.FC = () => {
        const onSearch = (title: string) => {
            // replace({ pathname: "/tl", query: { ...query, title, current: 1 } });
            replace({
                pathname: `/platformdetails/${query.id}`,
                query: {
                    ...query,
                    title,
                    current: 1,
                    type: "3",
                    platformid: query.platformid,
                },
                // query: { type: '3', platformid: query.platformid },
            });
        };

        return (
            <SearchInput
                className="w-[250px]"
                size={"large"}
                onSearch={onSearch}
                defaultValue={query.title}
            />
        );
    };

    let queryParams = { ...query };
    queryParams.type = "3";
    return (
        <Card
            title={"资源工具"}
            bordered={false}
            className={"mb-[20px]"}
            extra={<Extra />}
        >
            <Filter />
            <ListContent />
            <Pagination
                className=" text-center mt-[20px]"
                current={toolsList.current}
                total={toolsList.total}
                showSizeChanger={false}
                pageSize={toolsList.size}
                onChange={() => { }}
                disabled={false}
                itemRender={(page, type, element) => (
                    <Link
                        href={{ query: { ...queryParams, current: page } }}
                        scroll={false}
                    >
                        <a>{type === 'page' ? page : element}</a>
                    </Link>
                )}
            />
        </Card>
    );
};

/**平台部分 */
const Filter: React.FC = () => {
    const { query, replace } = useRouter();
    const { platforms } = useContext(PlatformDetailContent);

    interface TagProps {
        label: string;
        value?: Key;
    }

    const platformList: TagProps[] = platforms.map(({ id, name }) => ({
        label: name,
        value: id,
    }));
    platformList.unshift({ label: "全部" });

    const typeList: TagProps[] = [
        { label: "全部" },
        { label: "文档类", value: "1" },
        { label: "工具类", value: "2" },
    ];

    const defaultCls = css`
    color: #666;
    font-size: 14px;
    padding: 2px 10px;
    background-color: rgba(0, 0, 0, 0);
    border: none;
  `;

    const activeCls = css`
    background-color: #fef1f6;
    color: #f676a6;
  `;

    let queryParams = { ...query };
    queryParams.type = "3";

    const TagItem: React.FC<TagProps & { queryKey: string }> = ({
        value,
        label,
        queryKey,
    }) => {
        const active = (query[queryKey] || undefined) == value;
        return (
            <Link
                href={{ query: { ...queryParams, [queryKey]: value, current: 1 } }}
                scroll={false}
            >
                <a>
                    <Tag className={cx(defaultCls, { [activeCls]: active })}>{label}</Tag>
                </a>
            </Link>
        );
    };

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
    );
};

/**列表部分 */
const ListContent: React.FC = () => {
    const { toolsList } = useContext(PlatformDetailContent);
    const { query, replace } = useRouter();

    const itemCls = css`
    background: #ffffff;
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
        },
    ];

    let queryParams = { ...query };
    queryParams.type = "3";

    const onChange = (key: string) => {
        const searchType = key;
        replace({
            pathname: `/platformdetails/${query.id}`,
            query: { ...queryParams, searchType, current: 1 },
        });
    };
    const index: any = query.searchType ? query.searchType : "1";
    const Item: React.FC<Toolsrecord> = (props) => {
        const [type, setType] = useState<number>(9);
        const ToolsLink: React.FC = ({ children }) => {
            return (
                <Link href={"/tl/[id]"} as={`/tl/${props.id}`} scroll={false}>
                    <a>{children}</a>
                </Link>
            );
        };
        const icon1 = css`
      background-image: url(/asset/image/icon/pdf.png);
    `;
        const icon2 = css`
      background-image: url(/asset/image/icon/xlsx.png);
    `;
        const icon3 = css`
      background-image: url(/asset/image/icon/ppt.png);
    `;
        const icon4 = css`
      background-image: url(/asset/image/icon/txt.png);
    `;
        const icon5 = css`
      background-image: url(/asset/image/icon/doc.png);
    `;
        const icon6 = css`
      background-image: url(/asset/image/icon/zip.png);
    `;
        const icon7 = css`
      background-image: url(/asset/image/icon/rar.png);
    `;
        const icon8 = css`
      background-image: url(/asset/image/icon/movie.png);
    `;
        const icon9 = css`
      background-image: url(/asset/image/icon/pic.png);
    `;
        const icon10 = css`
      background-image: url(/asset/image/icon/unknow.png);
    `;
        const avatarCls = css`
      width: 56px;
      height: 64px;
      background-size: cover;
      border-radius: 5px;
    `;
        const loadType = () => {
            if (props.enclosureUrl) {
                if (props.enclosureUrl.indexOf("pdf") !== -1) {
                    setType(0);
                } else if (props.enclosureUrl.indexOf("xlsx") !== -1) {
                    setType(1);
                } else if (props.enclosureUrl.indexOf("ppt") !== -1) {
                    setType(2);
                } else if (props.enclosureUrl.indexOf("txt") !== -1) {
                    setType(3);
                } else if (props.enclosureUrl.indexOf("doc") !== -1) {
                    setType(4);
                } else if (props.enclosureUrl.indexOf("zip") !== -1) {
                    setType(5);
                } else if (props.enclosureUrl.indexOf("rar") !== -1) {
                    setType(6);
                } else if (props.enclosureUrl.indexOf("movie") !== -1) {
                    setType(7);
                } else if (props.enclosureUrl.indexOf("png") !== -1) {
                    setType(8);
                } else {
                    setType(9);
                }
            } else {
                setType(9);
            }
        };
        useEffect(loadType, []);

        const cls = [
            icon1,
            icon2,
            icon3,
            icon4,
            icon5,
            icon6,
            icon7,
            icon8,
            icon9,
            icon10,
        ][type];
        const avatar = (
            <ToolsLink>
                <Avatar className={cx(avatarCls, { [cls]: true })} shape={"square"} />
            </ToolsLink>
        );

        const title = (
            <ToolsLink>
                <span className="block h-[30px] fw-500 fs-[18px] mb-[10px] lc-1">
                    {props.title}
                </span>
            </ToolsLink>
        );
        const size: any = (parseInt(props.enclosureSize) / 1024).toFixed(2) + "M";
        const description = (
            <Space size={30}>
                <span>{props.createdAt}</span>
                <span>{"资源大小: " + size}</span>
                <span>{"下载次数: " + props.enclosureDownloadNum}</span>
                <span>{"所需积分: " + props.integralNum}</span>
            </Space>
        );

        return (
            <List.Item>
                <List.Item.Meta
                    avatar={avatar}
                    title={title}
                    description={description}
                />
            </List.Item>
        );
    };
    return (
        <Row className={cx("mt-[20px]", itemCls)}>
            <Tabs defaultActiveKey={index} className="w-[100%]" onChange={onChange}>
                {item.map((value: any, index: number) => {
                    return (
                        <Tabs.TabPane tab={value.name} key={index + 1}>
                            <List
                                dataSource={toolsList.records}
                                pagination={false}
                                renderItem={(item: any) => <Item {...item} />}
                            />
                        </Tabs.TabPane>
                    );
                })}
            </Tabs>
        </Row>
    );
};
