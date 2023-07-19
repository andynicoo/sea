import { follow, getFans, getKjzdActivity, getKjzdArticle, getKjzdEncyclopedia, getKjzdQuestion, getKjzdToolsPage, getKjzdUser, getKjzdUserComment, unFollow } from "@/apis/users";
import Authorization from "@/components/Authorization";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { MainReduxState } from "@/redux/store";
import Article, { CommentProps, Question } from "@/vo/Article";
import Encyclopedia from "@/vo/Encyclopedia";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Activity, Resources, UserInfo } from "@/vo/Users";
import { Avatar, Button, Card, Col, List, message, Row, Space, Tabs } from "antd";
import { PaginationConfig } from "antd/lib/pagination";
import { NextPage } from "next";
import Link from "next/link";
import React, { Fragment, Key, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-users-comment` });

interface UsersIndexPageProps {

}

/**自己的主页 */
const UsersIndexPage: NextPage<UsersIndexPageProps> = () => {

    return (
        <Fragment>
            <MinHead />
            <InfoCard />
            <Container>
                <Card bordered={false}>
                    <Tabs size={"large"}>
                        <Tabs.TabPane tab={"动态"} key={1}>
                            <Dynamics />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"评论"} key={2}>
                            <Commend />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"粉丝"} key={3}>
                            <Fans />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={"关注"} key={4}>
                            <Like />
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </Container>
            <Footer />
        </Fragment>
    )
}

export default UsersIndexPage;
interface UserParams {
    userId?: Key
}

/**用户卡片信息 */
export const InfoCard: React.FC<UserParams> = (props) => {
    const { userId } = props;
    const selfInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    const [hisInfo, setHisInfo] = useState<UserInfo>();

    /**用户信息 */
    const userInfo = hisInfo || selfInfo;

    useEffect(() => {
        if (!userId) return;
        getKjzdUser(userId).then((res) => {
            setHisInfo(res.data);
        })
    }, []);

    const UserAvatar: React.FC = () => {

        const cls = css`
            padding: 10px;
            border-radius: 50%;
            background-color: #fff;
            position: absolute;
            left: 25px;
            top: -25px;
        `;



        return (
            <div className={cls}>
                <Avatar
                    size={130}
                    src={userInfo?.avatar}
                />
            </div>
        )
    }

    const contentCls = css`
        margin-left: 170px;
    `;

    const bannerCls = css`
        height: 240px;
        background-image: url(${userInfo?.personalCenterBackground});
        background-size: cover;
        background-position: center;
    `;

    const cls = css`
        margin-top: -20px;
    `;

    const onLike = () => {
        if (selfInfo?.isFans) {
            /**已关注则取消关注 */
            unFollow({ userId: hisInfo?.userId }).then(() => {
                message.success("取消关注成功");
                setHisInfo({ ...(hisInfo as UserInfo), isFans: false });
            })
        } else {
            /**未关注则关注 */
            follow({ userId: hisInfo?.userId, fansUid: selfInfo?.userId }).then(() => {
                message.success("关注成功");
                setHisInfo({ ...(hisInfo as UserInfo), isFans: true });
            })
        }
    }

    /**其他人主页按钮 */
    const HisButtons: React.FC = () => {
        return (
            <Space>
                <Authorization.Valid>
                    <Button onClick={onLike}>
                        {hisInfo?.isFans ? "已关注" : "关注"}
                    </Button>
                </Authorization.Valid>
                <Button>
                    私信
                </Button>
            </Space>
        )
    }

    /**自己的主页按钮 */
    const SelfButtons: React.FC = () => {
        return (
            <Space direction={"vertical"} size={20}>
                <Link href={"/users/setting"} passHref>
                    <Button type={"link"}>修改资料</Button>
                </Link>
                <Space>
                    <Link href={"/articles/publish"}>
                        <a>
                            <Button>发文章</Button>
                        </a>
                    </Link>
                    <Link href={"/w/words/publish"}>
                        <a>
                            <Button>创建词条</Button>
                        </a>
                    </Link>
                </Space>
            </Space>

        )
    }

    /**是否是自己的主页 */
    const isSelf = (!userId && !!selfInfo) || userId === selfInfo?.userId;

    return (
        <Fragment>
            <div className={bannerCls} />
            <Container className={cls}>
                <Card className="mb-[20px] relative" bordered={false}>
                    <UserAvatar />
                    <div className={contentCls}>
                        <Row>
                            <Col span={6}>
                                <h2 className={"fs-[24px]"}>{userInfo?.nick}</h2>
                                <p className={"color-[#999999]"}>简介: </p>
                                <p className={"color-[#999999]"}>微信公众号</p>
                                <Avatar shape={"square"} size={145} src={userInfo?.wechatImg} />
                            </Col>
                            <Col span={18} className={"text-right"}>
                                {isSelf ? <SelfButtons /> : <HisButtons />}
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Container>
        </Fragment>

    )
}

/**用户动态 */
export const Dynamics: React.FC<UserParams> = ({ userId }) => {

    /**文章分页 */
    const ArticlePages: React.FC = () => {

        const [pageSource, setPageSource] = useState<PageSource<Article>>();
        const [params, setParams] = useState<PageParams>({ current: 1, size: 10, userId });
        const [loading, setLoading] = useState<boolean>(false);

        const onChange = (current: number, size: number) => {
            setParams({ ...params, current, size });
        }

        useEffect(() => {
            setLoading(true);
            getKjzdArticle({ ...params, userId })
                .then((res) => {
                    setPageSource(res.data);
                })
                .finally(() => {
                    setLoading(false);
                })
        }, [params]);

        const pagination: false | PaginationConfig = pageSource?.total
            ? ({
                pageSize: pageSource?.size,
                current: pageSource?.current,
                total: pageSource?.total,
                onChange: onChange
            })
            : false;

        const avatarCls = css`
            width: 246px;
            height: 150px;
        `;

        return (
            <List
                loading={loading}
                dataSource={pageSource?.records}
                pagination={pagination}
                renderItem={(item) => {
                    const ArticleLink: React.FC = ({ children }) => (
                        <Link href={"/articles/[id]"} as={`/articles/${item.id}`}>
                            <a>{children}</a>
                        </Link>
                    )

                    const avatar = (
                        <ArticleLink>
                            <Avatar
                                shape={"square"}
                                className={avatarCls}
                                src={item.thumbPicUrl}
                            />
                        </ArticleLink>
                    );

                    const title = (
                        <ArticleLink>
                            <h2 className="fw-500 fs-[20px]">{item.title}</h2>
                        </ArticleLink>
                    )

                    return (
                        <List.Item>
                            <List.Item.Meta
                                avatar={avatar}
                                title={title}
                                description={item.description}
                            />
                        </List.Item>
                    )
                }}
            />
        )
    }

    /**提问分页 */
    const QuestionPages: React.FC = () => {

        const [pageSource, setPageSource] = useState<PageSource<Question>>();
        const [params, setParams] = useState<PageParams>({ current: 1, size: 10, type: 1, userId });
        const [loading, setLoading] = useState<boolean>(false);

        const onChange = (current: number, size: number) => {
            setParams({ ...params, current, size });
        }

        useEffect(() => {
            setLoading(true);
            getKjzdQuestion({ ...params, userId })
                .then((res) => {
                    setPageSource(res.data);
                })
                .finally(() => {
                    setLoading(false);
                })
        }, [params]);

        const pagination: false | PaginationConfig = pageSource?.total
            ? ({
                pageSize: pageSource?.size,
                current: pageSource?.current,
                total: pageSource?.total,
                onChange: onChange
            })
            : false;

        return (
            <List
                loading={loading}
                dataSource={pageSource?.records}
                pagination={pagination}
                renderItem={(item) => {
                    const QuestionLink: React.FC = ({ children }) => (
                        <Link href={"/question/[id]"} as={`/question/${item.id}`}>
                            <a>{children}</a>
                        </Link>
                    )

                    const title = (
                        <QuestionLink>
                            <h2 className="fw-500 fs-[20px]">{item.title}</h2>
                        </QuestionLink>
                    )

                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={title}
                                description={item.description}
                            />
                        </List.Item>
                    )
                }}
            />
        )
    }

    /**想法分页 */
    const IdeaPages: React.FC = () => {

        const [pageSource, setPageSource] = useState<PageSource<Question>>();
        const [params, setParams] = useState<PageParams>({ current: 1, size: 10, type: 2, userId });
        const [loading, setLoading] = useState<boolean>(false);

        const onChange = (current: number, size: number) => {
            setParams({ ...params, current, size });
        }

        useEffect(() => {
            setLoading(true);
            getKjzdQuestion({ ...params, userId })
                .then((res) => {
                    setPageSource(res.data);
                })
                .finally(() => {
                    setLoading(false);
                })
        }, [params]);

        const pagination: false | PaginationConfig = pageSource?.total
            ? ({
                pageSize: pageSource?.size,
                current: pageSource?.current,
                total: pageSource?.total,
                onChange: onChange
            })
            : false;

        return (
            <List
                loading={loading}
                dataSource={pageSource?.records}
                pagination={pagination}
                renderItem={(item) => {

                    const QuestionLink: React.FC = ({ children }) => (
                        <Link href={"/question/[id]"} as={`/question/${item.id}`}>
                            <a>{children}</a>
                        </Link>
                    )

                    const title = (
                        <QuestionLink>
                            <h2 className="fw-500 fs-[20px]">{item.title}</h2>
                        </QuestionLink>
                    )

                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={title}
                                description={item.description}
                            />
                        </List.Item>
                    )
                }}
            />
        )
    }

    /**百科分页 */
    const EncyclopediaPages: React.FC = () => {

        const [pageSource, setPageSource] = useState<PageSource<Encyclopedia>>();
        const [params, setParams] = useState<PageParams>({ current: 1, size: 10, userId });
        const [loading, setLoading] = useState<boolean>(false);

        const onChange = (current: number, size: number) => {
            setParams({ ...params, current, size });
        }

        useEffect(() => {
            setLoading(true);
            getKjzdEncyclopedia({ ...params, userId })
                .then((res) => {
                    setPageSource(res.data);
                })
                .finally(() => {
                    setLoading(false);
                })
        }, [params]);

        const pagination: false | PaginationConfig = pageSource?.total
            ? ({
                pageSize: pageSource?.size,
                current: pageSource?.current,
                total: pageSource?.total,
                onChange: onChange
            })
            : false;

        const avatarCls = css`
            width: 246px;
            height: 150px;
        `;

        return (
            <List
                loading={loading}
                dataSource={pageSource?.records}
                pagination={pagination}
                renderItem={(item) => {
                    const EncyclopediaLink: React.FC = ({ children }) => (
                        <Link href={"/w/[id]"} as={`/w/${item.id}`}>
                            <a>{children}</a>
                        </Link>
                    )

                    const avatar = (
                        <Avatar
                            shape={"square"}
                            src={item.thumbUrl}
                            className={avatarCls}
                        />
                    )

                    const title = (
                        <EncyclopediaLink>
                            <h2 className="fw-500 fs-[20px]">{item.title}</h2>
                        </EncyclopediaLink>
                    )

                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={title}
                                avatar={avatar}
                                description={item.seoDescription}
                            />
                        </List.Item>
                    )
                }}
            />
        )
    }

    /**资源分页 */
    const ResourcePages: React.FC = () => {

        const [pageSource, setPageSource] = useState<PageSource<Resources>>();
        const [params, setParams] = useState<PageParams>({ current: 1, size: 10, userId });
        const [loading, setLoading] = useState<boolean>(false);

        const onChange = (current: number, size: number) => {
            setParams({ ...params, current, size });
        }

        useEffect(() => {
            setLoading(true);
            getKjzdToolsPage({ ...params, userId })
                .then((res) => {
                    setPageSource(res.data);
                })
                .finally(() => {
                    setLoading(false);
                })
        }, [params]);

        const pagination: false | PaginationConfig = pageSource?.total
            ? ({
                pageSize: pageSource?.size,
                current: pageSource?.current,
                total: pageSource?.total,
                onChange: onChange
            })
            : false;

        const avatarCls = css`
            width: 256px;
            height: 150px;
        `;

        return (
            <List
                loading={loading}
                dataSource={pageSource?.records}
                pagination={pagination}
                renderItem={(item) => {
                    const ResourcesLink: React.FC = ({ children }) => (
                        <a>{children}</a>
                    )

                    const avatar = (
                        <Avatar
                            shape={"square"}
                            src={item.thumbPicUrl}
                            className={avatarCls}
                        />
                    )

                    const title = (
                        <ResourcesLink>
                            <h2 className="fw-500 fs-[20px]">{item.title}</h2>
                        </ResourcesLink>
                    )

                    return (
                        <List.Item>
                            <List.Item.Meta
                                avatar={avatar}
                                title={title}
                                description={item.description}
                            />
                        </List.Item>
                    )
                }}
            />
        )
    }
    /**活动分页 */
    const ActivityPages: React.FC = () => {

        const [pageSource, setPageSource] = useState<PageSource<Activity>>();
        const [params, setParams] = useState<PageParams>({ current: 1, size: 10, userId });
        const [loading, setLoading] = useState<boolean>(false);

        const onChange = (current: number, size: number) => {
            setParams({ ...params, current, size });
        }

        useEffect(() => {
            setLoading(true);
            getKjzdActivity({ ...params, userId })
                .then((res) => {
                    setPageSource(res.data);
                })
                .finally(() => {
                    setLoading(false);
                })
        }, [params]);

        const pagination: false | PaginationConfig = pageSource?.total
            ? ({
                pageSize: pageSource?.size,
                current: pageSource?.current,
                total: pageSource?.total,
                onChange: onChange
            })
            : false;

        const avatarCls = css`
            width: 245px;
            height: 150px;
        `;

        return (
            <List
                loading={loading}
                dataSource={pageSource?.records}
                pagination={pagination}
                renderItem={(item) => {

                    const ActivityLink: React.FC = ({ children }) => (
                        <Link href={"/acd/[id]"} as={`/acd/${item.id}`}>
                            <a>{children}</a>
                        </Link>
                    )

                    const avatar = (
                        <Avatar
                            shape={"square"}
                            src={item.posterUrl}
                            className={avatarCls}
                        />
                    )

                    const title = (
                        <ActivityLink>
                            <h2 className="fw-500 fs-[20px]">{item.title}</h2>
                        </ActivityLink>
                    )

                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={title}
                                avatar={avatar}
                                description={item.content}
                            />
                        </List.Item>
                    )
                }}
            />
        )
    }

    return (
        <Tabs size={"small"}>
            <Tabs.TabPane tab={"文章"} key={1}>
                <ArticlePages />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"提问"} key={2}>
                <QuestionPages />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"想法"} key={3}>
                <IdeaPages />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"百科"} key={4}>
                <EncyclopediaPages />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"资源"} key={5}>
                <ResourcePages />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"活动"} key={6}>
                <ActivityPages />
            </Tabs.TabPane>
        </Tabs>
    )
}

/**用户关注 */
export const Like: React.FC<UserParams> = ({ userId }) => {
    const [dataSource, setDataSource] = useState<PageSource<UserInfo>>();
    const [params, setParams] = useState<PageParams>({ current: 1, size: 10, userId, type: 2 });
    const [loading, setLoading] = useState<boolean>(false);

    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    }

    useEffect(() => {
        setLoading(true);
        getFans(params)
            .then((res) => {
                setDataSource(res.data);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [params]);

    const pagination: false | PaginationConfig = dataSource?.total
        ? ({
            current: dataSource.current,
            pageSize: dataSource.size,
            total: dataSource.total,
            onChange: onChange
        })
        : false;

    return (
        <List
            loading={loading}
            dataSource={dataSource?.records}
            pagination={pagination}
            renderItem={(item) => (
                <List.Item>
                    <Space align={"center"}>
                        <Avatar src={item.avatar} />
                        <span>{item.nick}</span>
                    </Space>
                </List.Item>
            )}
        />
    )
}

/**用户粉丝 */
export const Fans: React.FC<UserParams> = ({ userId }) => {

    const [dataSource, setDataSource] = useState<PageSource<UserInfo>>();
    const [params, setParams] = useState<PageParams>({ current: 1, size: 10, userId, type: 1 });
    const [loading, setLoading] = useState<boolean>(false);

    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    }

    useEffect(() => {
        setLoading(true);
        getFans(params)
            .then((res) => {
                setDataSource(res.data);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [params]);

    const pagination: false | PaginationConfig = dataSource?.total
        ? ({
            current: dataSource.current,
            pageSize: dataSource.size,
            total: dataSource.total,
            onChange: onChange
        })
        : false;

    return (
        <List
            loading={loading}
            dataSource={dataSource?.records}
            pagination={pagination}
            renderItem={(item) => (
                <List.Item>
                    <Space align={"center"}>
                        <Avatar src={item.avatar} />
                        <span>{item.nick}</span>
                    </Space>
                </List.Item>
            )}
        />
    )
}

/**用户评论 */
export const Commend: React.FC<UserParams> = ({ userId }) => {

    const [dataSource, setDataSource] = useState<PageSource<CommentProps>>();
    const [params, setParams] = useState<PageParams>({ current: 1, size: 10, userId });
    const [loading, setLoading] = useState<boolean>(false);

    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    }

    useEffect(() => {
        setLoading(true);
        getKjzdUserComment(params)
            .then((res) => {
                setDataSource(res.data);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [params]);

    const pagination: false | PaginationConfig = dataSource?.total
        ? ({
            total: dataSource.total,
            current: dataSource.current,
            pageSize: dataSource.size,
            onChange: onChange
        })
        : false;

    return (
        <List
            loading={loading}
            dataSource={dataSource?.records}
            pagination={pagination}
            renderItem={(item) => {
                return (
                    <List.Item>
                        <List.Item.Meta
                            title={item.content}
                            description={`您 回复了${item.nick} ${item.createdAt}`}
                        />
                    </List.Item>
                )
            }}
        />
    )
}