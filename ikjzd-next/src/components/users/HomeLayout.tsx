
import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Row, Space, Tabs } from "antd";
import Link from "next/link";
import { UserInfo } from "@/vo/Users";
import { PageSource } from "@/vo/PageParams";
import Article, { CommentProps, CountProps } from "@/vo/Article";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { getKjzdUserNewsCount } from "@/apis/users";
import { useRouter } from "next/router";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-users-home-layout` });

interface HomeLayoutProps {
}
export interface UsersPageContentProps {
    usersInfoData?: UserInfo;
    dynamicData?: PageSource<Article>;
    newsCountData?: CountProps[];
    commandData?: PageSource<CommentProps>;
}

export const UsersPageContent = React.createContext<UsersPageContentProps>({} as UsersPageContentProps);

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {

    interface TabsItemProps {
        tab: string;
        link: string;
    }

    const items: TabsItemProps[] = [
        { tab: "动态", link: "/users/dynamic" },
        { tab: "评论", link: "/users/comment" },
        { tab: "粉丝", link: "/users/fans" },
        { tab: "关注", link: "/users/like" },
    ];

    const TabsLink: React.FC<{ link: string }> = ({ children, link }) => {
        return <Link href={link}>
            <a>{children}</a>
        </Link>
    }

    const router = useRouter();

    return <Space
        className={"w-[100%] mt-[20px]"}
        direction="vertical"
        size={15}
    >
        <UserInformation />
        <Row gutter={[16, 16]} >
            <Col span={18}>
                <Card bordered={false}>
                    <Tabs activeKey={router.pathname}>
                        {items.map(({ tab, link }) => (
                            <Tabs.TabPane
                                tab={<TabsLink link={link}>{tab}</TabsLink>}
                                key={link}
                            />
                        ))}
                    </Tabs>
                    <Fragment>
                        {children}
                    </Fragment>
                </Card>
            </Col>
            <Col span={6}>
                <StatisticsInfo />
            </Col>
        </Row>
    </Space>
}

export default HomeLayout;

/**用户信息 */
const UserInformation: React.FC = () => {
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    const Avatar: React.FC = () => {

        const cls = css`
            width: 130px;
            position: relative;
        `;

        const borderCls = css`
            padding: 8px;
            background-color: #fff;
            border-radius: 50%;
            position: absolute;
            top: -65px;

            &>img {
                border-radius: 50%;
                width: 110px;
                height: 110px;
            }
        `;

        return (
            <div className={cls}>
                <div className={borderCls}>
                    <img src={userInfo?.avatar} />
                </div>
            </div>
        )
    }

    const UserInfo: React.FC = () => (
        <div className={"fs-[24px] color-[#222222]"}>
            <h3>{userInfo?.nick}</h3>
            <p>{"简介 : 作者很懒，还未填写简介"}</p>
        </div>
    )

    return (
        <Card bordered={false}>
            <Row justify={"space-between"} align={"top"}>
                <Col span={20}>
                    <Space size={20} align={"start"}>
                        <Avatar />
                        <UserInfo />
                    </Space>
                </Col>
                <Col span={4} className={"mt-[20px] text-right"}>
                    <Space
                        direction="vertical"
                        size={20}
                    >
                        <Link href={"/users/setting"}>
                            <a>修改资料</a>
                        </Link>
                        <Space>
                            <Link href={"/articles/publish"}>
                                <a>
                                    <Button>
                                        发文章
                                    </Button>
                                </a>
                            </Link>
                            <Link href={"/w/words/publish"}>
                                <a>
                                    <Button>
                                        创建词条
                                    </Button>
                                </a>
                            </Link>
                        </Space>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};


/**统计 */
const StatisticsInfo: React.FC = () => {
    const [newsCountData, setNewsCountData] = useState<CountProps[]>([])

    useEffect(() => {
        getKjzdUserNewsCount({}).then((res) => {
            setNewsCountData(res.data);
        });
    }, []);

    const likes: CountProps[] = newsCountData.filter(item => item.type == 1);
    const comments: CountProps[] = newsCountData.filter(item => item.type == 2);
    const articles: CountProps[] = newsCountData.filter(item => item.type == 4);

    return (
        <Card bordered={false}>
            <Row>
                <Col span={8}>
                    <h4>{likes[0]?.totalNum || 0}</h4>阅读总数
                </Col>
                <Col span={8}>
                    <h4>{comments[0]?.totalNum || 0}</h4>总获赞
                </Col>
                <Col span={8}>
                    <h4>{articles[0]?.totalNum || 0}</h4>总获评论
                </Col>
            </Row>
        </Card>
    );
};