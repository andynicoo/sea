import DefaultLayout from "@/components/layouts/DefaultLayout";
import SearchInput from "@/components/SearchInput";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { Avatar, Card, List, Pagination, Space } from "antd";
import { getArticlePage } from "@/apis/article";
import { PageParams, PageSource } from "@/vo/PageParams";
import Article from "@/vo/Article";
import Link from "next/link";
import SeoHead from "@/components/SeoHead";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-search` });

interface SearchPageProps {
    articles: PageSource<Article>;
}

const SearchPage: NextPage<SearchPageProps> = (props) => {
    const { articles } = props;
    const { query, replace } = useRouter();

    const onSearch = (keyword: string) => {
        replace({ pathname: "/search", query: { keyword, current: 1, size: 20 } });
    }

    const avatarCls = css`
        width: 240px;
        height: 150px;
    `;

    return (
        <DefaultLayout>
            <SeoHead
                title={`${query.keyword}_${query.keyword}新闻资讯_${query.keyword}最新消息_${query.keyword}相关知识_跨境知道`}
                keyword={`${query.keyword}`}
                description={`跨境知道专注于提供${query.keyword}方面最新新闻资讯，以及${query.keyword}相关知识、资料。`}
            />
            <SearchInput
                size={"large"}
                defaultValue={query.keyword}
                onSearch={onSearch}
                className={"mb-[20px]"}
                enterButton={<span className="px-[10px]"><img width={30} src="/asset/image/search_ic.png" /></span>}
            />

            <Card bordered={false}>
                <List
                    pagination={false}
                    dataSource={articles?.records}
                    renderItem={(article) => {
                        const ArticleLink: React.FC = ({ children }) => {
                            return (
                                <Link href={"/articles/[id]"} as={`/articles/${article.id}`}>
                                    <a target={"_blank"}>{children}</a>
                                </Link>
                            )
                        }

                        const avatar = (
                            <ArticleLink>
                                <Avatar
                                    className={avatarCls}
                                    shape={"square"}
                                    src={article.thumbPicUrl}
                                />
                            </ArticleLink>
                        )

                        const title = (
                            <ArticleLink>
                                <p className="color-[#000000e6] fw-500 fs-[20px] ma-[0px]">{article.title}</p>
                            </ArticleLink>
                        )

                        const description = (
                            <Fragment>
                                <p className="lc-3 mb-[10px] h-[70px]">{article.seoDescription}</p>
                                <Link
                                    href={"/users/index/[id]"}
                                    as={`/users/index/${article.user?.userId}`}
                                >
                                    <a target={"_blank"}>
                                        <Space size={20}>
                                            <Avatar src={article.user?.avatar} />
                                            <span>{article.user?.nick}</span>
                                        </Space>
                                    </a>
                                </Link>
                            </Fragment>
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
                    }}
                />
                {(() => {
                    const router = useRouter();
                    if (!articles?.total) return <Fragment />;
                    const pageChange = (current: any, size: any) => {
                        router.push(
                            {
                                pathname: `/search`,
                                query: { ...query, size: size, current: 1 },
                            },
                            {
                                pathname: `/search`,
                                query: { ...query, size: size, current: 1 },
                            }
                        );
                    }
                    return (
                        <Pagination
                            className={"mt-[20px] float-right"}
                            total={articles.total}
                            pageSize={articles.size}
                            current={articles.current}
                            onShowSizeChange={pageChange}
                            itemRender={(page, type, element) => (
                                <span>
                                    {type === "page" ? (
                                        <Link
                                            scroll={false}
                                            href={{ query: { ...router.query, current: page } }}
                                        >
                                            <a>{page}</a>
                                        </Link>
                                    ) : (
                                        <a>{element}</a>
                                    )}
                                </span>
                            )}
                        />
                    )
                })()}
            </Card>
        </DefaultLayout>
    )
}

SearchPage.getInitialProps = async (ctx) => {
    const current = ctx.query.current as string;
    const title = ctx.query.keyword as string;
    const size = ctx.query.size as string;

    const params: PageParams = {
        current: current || 1,
        size: size || 20,
        title,
        auditStatus: 1,
    }

    const articles = (await getArticlePage(params)).data;;

    return {
        articles
    }
}

export default SearchPage;