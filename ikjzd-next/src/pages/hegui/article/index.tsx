import { NextPage } from "next";
import React, { Fragment, Key } from "react";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { useRouter } from "next/router";
import ScrollTags from "@/components/ScrollTags";
import { Card, Col, Row, Empty, Pagination } from "antd";
import { CateListType } from "@/vo/Hegui";
import Link from "next/link";
import createEmotion from "@emotion/css/create-instance";
import { getHeguiList, getTagsPage } from "@/apis/hegui";
import { getArticlePage } from "@/apis/article";
import { TagsCategory } from "@/vo/Article";
import Article from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import LazyLoad from "react-lazyload";
import { TagOutlined } from "@ant-design/icons";

const { css, cx } = createEmotion({
    key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});

import HotArticle from "@/components/hegui/HotArticle";
import HeguiService from "@/components/hegui/HeguiService";
import HotTags from "@/components/hegui/HotTags";
import Icon from "@/components/Icon";

interface HeguiDetailContentProps extends HeguiDetailPageProps { }

const HeguiDetailContent = React.createContext<HeguiDetailContentProps>(
    {} as HeguiDetailContentProps
);

interface HeguiDetailPageProps {
    /**合规分类list */
    cateList: CateListType[];
    /**文章 */
    articles: PageSource<Article>;
    hots: Article[];
    tags: TagsCategory[]; //TagsCategory[];
}

// 合规分类页
const HeguiDetailPage: NextPage<HeguiDetailPageProps> = (props) => {
    const { query, push } = useRouter();

    const ctxValue: HeguiDetailContentProps = {
        ...props,
    };
    return (
        <HeguiDetailContent.Provider value={ctxValue}>
            <SeoHead
                title="海外工商注册_海外公司注册_做账报税审计_产品认证合规_离岸银行开户"
                description="跨境知道合规栏目，专业提供海外工商注册,海外公司注册,做账报税审计,产品认证合规,离岸银行开户等方面的知识和服务"
                keyword="海外工商注册,海外公司注册,做账报税审计,产品认证合规,离岸银行开户"
            />
            <MinHead />
            <Container className="my-[20px]">
                <Row gutter={20}>
                    <Col span={18}>
                        <Fragment>
                            {/* @ts-ignore */}
                            <ScrollTags activeKey={query.id}
                                onChange={(activeKey) =>
                                    push({ pathname: "/hegui/article", query: { id: activeKey } })
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
                        <HeguiContentLeft articles={props.articles} />
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
    /**文章参数 */
    const articlesParams: PageParams = {
        current: current,
        size: 20,
        articleType: 1,
        auditStatus: 1,
        articleCategoryId: id,
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

    const cateList = (await getHeguiList()).data;
    const articles = (await getArticlePage(articlesParams)).data;
    const hots = (await getArticlePage(hotArticles)).data.records;
    const tags = (await getTagsPage(tagsParams)).data.records;

    return {
        cateList,
        articles,
        hots,
        tags,
    };
};

const HeguiContentLeft: React.FC<{ articles: PageSource<Article> }> = ({ articles }) => {
    /**原始站复制来的样式 */
    const cls = css`
        margin-bottom: 20px;
        & div.outdiv {
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
                margin-right: 10px;
            }
        }
    `;

    const router = useRouter();

    const Page: React.FC = () => {
        if (!articles.total) return <Fragment />;
        return (
            <Pagination
                className="float-right mt-[20px]"
                current={articles.current}
                total={articles.total}
                pageSize={articles.size}
                showSizeChanger={false}
                disabled={false}
                onChange={() => { }}
                itemRender={(page: any, type: any, originalElement: any) => (
                    <Link
                        scroll={false}
                        key={originalElement}
                        href={{ query: { ...router.query, current: page } }}
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
                            <div className="outdiv db">
                                <Link href={"/articles/[id]"} as={`/articles/${id}`}>
                                    <a target={'_blank'}>
                                        <LazyLoad height={150}>
                                            <div className={"item-img scale-[1.1]"}>
                                                <div className={"el-image w-[240px] h-[150px]"}>
                                                    <img src={thumbPicUrl} />
                                                </div>
                                            </div>
                                        </LazyLoad>
                                    </a>
                                </Link>
                                <div className={"item-box"}>
                                    <Link href={"/articles/[id]"} as={`/articles/${id}`}>
                                        <a target={'_blank'}>
                                            <div className={"title"}>{title}</div>
                                            <div className={"text"}>{description}</div>
                                        </a>
                                    </Link>
                                    <div className="clearfix item-bottom">
                                        <Link href={"/users/index/[id]"} as={`/users/index/${user?.userId}`}>
                                            <a target="_blank" className="float-left clearfix">
                                                <span className="user-icon float-left">
                                                    <img src={user?.avatar} />
                                                </span>
                                                <div className="user-text float-left">{user?.nick}</div>
                                            </a>
                                        </Link>
                                        <span className="origin-icon float-left">
                                            <TagOutlined />
                                        </span>
                                        <div className="origin-name float-left">
                                            <>
                                                {articleTagName?.split(",").map((tag, index) => {
                                                    return (
                                                        <Link
                                                            href={`/hegui/tagarticle/[id]`}
                                                            as={`/hegui/tagarticle/${articleTagIds ? articleTagIds[index] + '_' + tag : ""
                                                                }`}
                                                            scroll={false}
                                                        >
                                                            <a target={'_blank'}>
                                                                <span className="tags">{tag}</span>
                                                            </a>
                                                        </Link>
                                                    );
                                                })}
                                            </>
                                        </div>
                                        <div className="care-num float-right color-[#999999] mt-[5px]"><Icon type={"icon-aixin"} /> {readNum}</div>
                                        <span className="care-icon float-right"></span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                }
                )}
            </ul>
            <Page />
        </Card>
    );
};
