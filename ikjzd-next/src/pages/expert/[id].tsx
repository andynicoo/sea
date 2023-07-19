import { getArticlePage } from "@/apis/article";
import { getKjzdUser, follow, unFollow } from "@/apis/users";
import Authorization from "@/components/Authorization";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import Icon from "@/components/Icon";
import SearchInput from "@/components/SearchInput";
import { MainReduxState } from "@/redux/store";
import Cookie from "@/utils/cookie";
import Article from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import { UserInfo } from "@/vo/Users";
import { Avatar, Button, Card, Col, Divider, Empty, message, Pagination, Row, Space } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, Key, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomNextPageContext } from "@/pages/_app";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-expert-id` });

interface ExpertDetailContextProps extends ExpertDetailPageProps {

}

const ExpertDetailContext = React.createContext<ExpertDetailContextProps>({} as ExpertDetailContextProps);

interface ExpertDetailPageProps {
    userInfo: UserInfo;
    articles: PageSource<Article>;
}

/**专家详情 */
const ExpertDetailPage: NextPage<ExpertDetailPageProps> = (props) => {

    const { userInfo } = props;

    const ctxValue: ExpertDetailContextProps = {
        ...props
    }

    const bannerCls = css`
        width: 100%;
        height: 183px;
        background-image: url(${userInfo.personalCenterBackground});
        background-size: cover;
        background-position: center;
        background-color: #eee;
    `;

    return (
        <ExpertDetailContext.Provider value={ctxValue}>
            <MinHead />

            {/* 顶部banner */}
            <div className={bannerCls} />

            <Container style={{ minHeight: 700 }} className={"relative mt-[30px]"}>
                {/* 专家信息卡片 */}
                <InfoCard />

                {/* 文章 */}
                <Articles />
            </Container>

            <Footer />
        </ExpertDetailContext.Provider>
    )
}

ExpertDetailPage.getInitialProps = async (ctx: CustomNextPageContext) => {
    const userId = ctx.query.id as Key;
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key;
    const title = ctx.query.keyword as string;

    /**从请求中获取token */
    const token = Cookie.getToken(ctx);

    const params: PageParams = {
        userId,
        current,
        size,
        title,
        articleType: 1,
        auditStatus: 1,
    }

    const userInfo = (await getKjzdUser(userId, token)).data;
    const articles = (await getArticlePage(params)).data;

    return {
        userInfo,
        articles,
    }
}

export default ExpertDetailPage;


const InfoCard: React.FC = () => {
    const ctx = useContext(ExpertDetailContext);

    const [userInfo, setUserInfo] = useState<UserInfo>(ctx.userInfo);

    const selfInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    /**关注 */
    const onFollow = () => {
        if (userInfo.isFans) {
            /**已关注,取消关注 */
            unFollow({ userId: userInfo?.userId }).then(() => {
                message.success("取消关注成功");
                setUserInfo({ ...userInfo, isFans: false });
            })
        } else {
            /**未关注,进行关注 */
            follow({ userId: userInfo.userId, fansUid: selfInfo?.userId })
                .then(() => {
                    message.success("关注成功");
                    setUserInfo({ ...userInfo, isFans: true });
                })
        }
    }

    const cls = css`
        padding: 30px 60px;
        position: relative;
        background-color: #F0F7FDFF;
        margin: 20px 0;

        &::before,
        &::after {
            display: inline-block;
            content: "";
            width: 22px;
            height: 17px;
            background-position: center;
            background-size: cover;
            position: absolute;
        }

        &::before {
            background-image: url(/asset/image/quotation-start.png);
            left: 30px;
            top: 30px;
        }
        &::after {
            background-image: url(/asset/image/quotation-end.png);
            right: 30px;
            bottom: 30px;
        }
    `;

    return (
        <Card
            bordered={false}
            bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
            className={"absolute"}
            style={{ width: 345, left: -230, top: -100 }}
        >
            <Space className="text-center w-[100%]" direction={"vertical"}>
                <Avatar size={104} src={userInfo.avatar} />
                <p className="text-center mb-[5px] mt-[30px] fs-[16px] color-[#000000e6] fw-500">
                    {userInfo.nick}
                </p>
                <Row>
                    <Col span={11} className={"text-right"}>
                        <span className="mr-[5px]">文章</span>
                        <span>{userInfo.articleNum}</span>
                    </Col>
                    <Col span={2}>
                        <Divider type="vertical" />
                    </Col>
                    <Col span={11} className={"text-left"}>
                        <span className="mr-[5px]">阅读</span>
                        <span>{userInfo.readNum}</span>
                    </Col>
                </Row>
            </Space>
            <div className={cls}>
                <div className="lc-2">
                    {userInfo.individualResume}
                </div>
            </div>
            <p className="color-[#00000099] text-center mb-[10px]">扫一扫, 联系我们</p>
            <Space className="text-center w-[100%]" direction={"vertical"} size={20}>
                <Avatar size={166} shape={"square"} src={userInfo.wechatImg} />
                <Space size={20}>
                    <Authorization.Valid>
                        <Button
                            type={"primary"}
                            shape={"round"}
                            size={"large"}
                            ghost
                            className="px-[40px]"
                            onClick={onFollow}
                            disabled={userInfo.userId === selfInfo?.userId}
                        >
                            {userInfo.isFans ? "已关注" : "关注"}
                        </Button>
                    </Authorization.Valid>
                    <Button
                        type={"primary"}
                        shape={"round"}
                        size={"large"}
                        className="px-[40px]"
                    >
                        分享
                    </Button>
                </Space>
            </Space>
        </Card>
    )
}

const Articles: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const ctx = useContext(ExpertDetailContext);

    const defaultParams: PageParams = {
        userId: id,
        articleType: 1,
        auditStatus: 1,
    }

    const [pageParams, setPageParams] = useState<PageParams>();

    const [articles, setArticles] = useState<PageSource<Article>>(ctx.articles)

    const coverCls = css`
        width: 100%;
        height: 160px;
    `;

    const cls = css`
        margin-left: 125px !important;
    `;

    const onSearch = (title: string) => {
        setPageParams({ ...defaultParams, ...pageParams, current: 1, title });
    }

    const onChange = (current: number, size: number) => {
        setPageParams({ ...defaultParams, ...pageParams, current, size });
    }

    useEffect(() => {
        if (!pageParams) return;
        getArticlePage(pageParams).then((res) => {
            setArticles(res.data);
        })
    }, [pageParams])

    return (
        <Row
            gutter={[20, 20]}
            className={cls}
            align={"middle"}
        >
            <Col span={18} className={"fw-500"}>
                文章
            </Col>
            <Col span={6}>
                <SearchInput
                    defaultValue={router.query.keyword}
                    placeholder="请输入关键词"
                    onSearch={onSearch}
                />
            </Col>
            {(() => {
                if (!articles.total) {
                    return (
                        <Col span={24}>
                            <Card bordered={false}>
                                <Empty />
                            </Card>
                        </Col>
                    )
                }
                return <Fragment>
                    {articles.records.map((article) => {
                        const cover = (
                            <Avatar
                                src={article.thumbPicUrl}
                                shape={"square"}
                                className={coverCls}
                            />
                        );
                        return (
                            <Col span={6} key={article.id}>
                                <Link
                                    href={"/articles/[id]"}
                                    as={`/articles/${article.id}`}
                                >
                                    <a>
                                        <Card
                                            hoverable
                                            size={"small"}
                                            bordered={false}
                                            cover={cover}
                                        >
                                            <p className="ma-[0px] lc-2 h-[45px] color-[#000000e6] fs-[14px] fw-500">
                                                {article.title}
                                            </p>
                                            <p className="my-[5px] color-[#00000066] fs-[12px] flex colume-between">
                                                <span>{article.createdAt}</span>
                                                <Space>
                                                    <Icon type={"icon-yanjing"} />
                                                    {article.readNum}
                                                </Space>
                                            </p>
                                        </Card>
                                    </a>
                                </Link>
                            </Col>
                        )
                    })}
                    <Col span={24} className={"text-right"}>
                        <Pagination
                            className="mb-[20px]"
                            total={articles.total}
                            current={articles.current}
                            pageSize={articles.size}
                            onChange={onChange}
                        />
                    </Col>
                </Fragment>
            })()}
        </Row>
    )
}