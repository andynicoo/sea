import { NextPage } from "next";
import React, { Fragment, Key, useContext, useState, useEffect } from "react";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { useRouter } from "next/router";
import {
    Card,
    Col,
    Row,
    Empty,
    Pagination,
    List,
    Avatar,
    Button,
    Space,
    Divider,
} from "antd";
import Center from "@/components/Center";
import Link from "next/link";
import createEmotion from "@emotion/css/create-instance";
import { getTagsPage } from "@/apis/hegui";
import { getArticlePage } from "@/apis/article";
import { TagsCategory } from "@/vo/Article";
import Article from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import LazyLoad from "react-lazyload";
import { TagOutlined } from "@ant-design/icons";
import Icon from "@/components/Icon";

const { css, cx } = createEmotion({
    key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});

import HotArticle from "@/components/hegui/HotArticle";
import HeguiService from "@/components/hegui/HeguiService";
import HotTags from "@/components/hegui/HotTags";

interface HeguiDetailContentProps extends HeguiDetailPageProps { }

const HeguiDetailContent = React.createContext<HeguiDetailContentProps>(
    {} as HeguiDetailContentProps
);

interface HeguiDetailPageProps {
    /**文章 */
    articles: PageSource<Article>;
    hots: Article[];
    tags: TagsCategory[]; //TagsCategory[];
}

// 合规分类页
const HeguiDetailPage: NextPage<HeguiDetailPageProps> = (props) => {
    const { query, push } = useRouter();
    const keyword = (query.id as string).split("_") || []
    const ctxValue: HeguiDetailContentProps = {
        ...props,
    };
    return (
        <HeguiDetailContent.Provider value={ctxValue}>
            <SeoHead
                title={`${keyword[1]}_${keyword[1]}相关知识_${keyword[1]}最新新闻资讯_跨境知道`}
                keyword={`${keyword[1]}`}
                description={`跨境知道专注于提供${keyword[1]}方面最新新闻资讯，以及${keyword[1]}相关知识、资料。`}
            />
            <MinHead />
            <Container>
                <div className="fs-[12px] color-[#333333] fh-[50px] clearfix">
                    <div className="float-left">当前位置:</div>
                    <div className="float-left">合规资讯{">"}</div>
                    <div className="float-left">{keyword[1]}</div>
                </div>
                {/* <img
          src={"https://www.ikjzd.com/web-com/images/news_banner.png"}
          alt={"搭建高价值合规架构"}
        /> */}
                {/* {query.id} */}
                <Row gutter={20} className="mt-[20px]">
                    <Col span={18}>
                        <HeguiContentLeft />
                    </Col>
                    <Col span={6}>
                        <div>
                            <HeguiService />
                            <HotArticle hots={props.hots} />
                            <HotTags tags={props.tags} />
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </HeguiDetailContent.Provider>
    );
};

export default HeguiDetailPage;

HeguiDetailPage.getInitialProps = async (ctx) => {
    // const id = ctx.query.id as Key;
    const { current, id } = (ctx.query || {}) as PageParams;
    const articleTagId = (id as string).split("_") || []
    /**文章参数 */
    const articlesParams: PageParams = {
        current: current,
        size: 10,
        articleType: 1,
        auditStatus: 1,
        articleTagId: articleTagId[0],
    };

    /**热门文章参数 */
    const hotArticles: PageParams = {
        articleType: 1,
        auditStatus: 1,
        current: 1,
        order: "DESC",
        size: 10,
        sort: "created_at",
    };

    const tagsParams: PageParams = {
        current: 1,
        order: "DESC",
        size: 10,
    };

    const articles = (await getArticlePage(articlesParams)).data;
    const hots = (await getArticlePage(hotArticles)).data.records;
    const tags = (await getTagsPage(tagsParams)).data.records;

    return {
        articles,
        hots,
        tags,
    };
};

const HeguiContentLeft: React.FC = () => {
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
        width: 240px;
        height: 150px;
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
        max-width: 100px;
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
    const router = useRouter();

    const { articles: firstPage } = useContext(HeguiDetailContent);
    const [articles, setArticles] = useState<PageSource<Article>>(firstPage);
    const [params, setParams] = useState<PageParams>();
    const [loading, setLoading] = useState<boolean>(false);

    const hasMore = articles.current === articles.pages;


    /**加载更多 */
    const onLoadMore = () => {
        setParams({
            ...params,
            size: 10,
            articleType: 1,
            auditStatus: 1,
            current: Number(params?.current || 1) + 1,
        });
    };

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
            });
    };

    useEffect(loadDataSource, [params]);

    if (!articles.records.length) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        );
    }

    return (
        <Card
            bordered={false}
            title={
                <span className="color-[#00000099] fs-[14px]">
                    共{articles.total}篇
                </span>
            }
        >
            <List
                dataSource={articles.records}
                renderItem={(item) => {
                    const {
                        id,
                        thumbPicUrl,
                        userId,
                        user,
                        createdAt,
                        readNum,
                        collectNum,
                    } = item;
                    const OtherLink: React.FC = ({ children }) => (
                        <Link href={"/articles/[id]"} as={`/articles/${id}`}>
                            <a target="_blank">{children}</a>
                        </Link>
                    );

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
                    );

                    const title = (
                        <OtherLink>
                            <h4 className="lc-1 h-[30px] ma-[0px] color-[#000000e6] fs-[18px] fw-600">
                                {item.title}
                            </h4>
                        </OtherLink>
                    );

                    const description = (
                        <Fragment>
                            <p className="lc-3 color-[#00000099] fs-[14px] fw-400 mb-[15px] h-[65px]">
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
                                        <span>{createdAt}</span>
                                        <span className="ml-[30px] flex row-center">
                                            <Icon
                                                type={"icon-yanjing"}
                                                className={"fs-[16px] mr-[8px]"}
                                            />
                                            <span>{readNum}</span>
                                        </span>
                                        <span className="flex row-center">
                                            <Icon
                                                type={"icon-aixin"}
                                                className={"fs-[16px] mr-[8px]"}
                                            />
                                            <span>{collectNum}</span>
                                        </span>
                                    </Space>
                                </a>
                            </Link>
                        </Fragment>
                    );

                    return (
                        <List.Item className="py-[20px]">
                            <List.Item.Meta
                                avatar={avatar}
                                title={title}
                                description={description}
                            />
                        </List.Item>
                    );
                }}
            />

            <Divider />

            <Center>
                <Button
                    shape={"round"}
                    onClick={onLoadMore}
                    size={"large"}
                    disabled={hasMore}
                    style={{ width: 160 }}
                    type={"primary"}
                    ghost
                >
                    {
                        loading ? '加载中...' : hasMore ? "没有更多了" : "加载更多"
                    }
                </Button>
            </Center>
        </Card>
    );
};
