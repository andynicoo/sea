
import React, { Fragment, useEffect } from "react";
import { Avatar, Card, Col, Row, Space } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-users-mine-layout` });

interface MineLayoutProps {
    className?: string;
}

const MineLayout: React.FC<MineLayoutProps> = ({ children, className }) => {

    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    const { push } = useRouter();

    useEffect(() => {
        if (!userInfo) push("/");
    }, []);

    return (
        <Row gutter={[16, 16]}>
            <Col span={5}>
                <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={16}
                >
                    <UserInformation />
                    <MineLeftMenu />
                </Space>
            </Col>
            <Col span={19}>
                {children}
            </Col>
        </Row>
    )
}

export default MineLayout;

/**用户信息 */
const UserInformation: React.FC = (props) => {
    const usersInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    if (!usersInfo) return <Fragment />;
    return <Card bordered={false}>
        <Space
            direction="vertical"
            className={"w-[100%] text-center"}
        >
            <Avatar src={usersInfo.avatar} size={120} />
            <p className="ma-[0px]">{usersInfo.nick}</p>
            <p className="ma-[0px]">积分：{usersInfo.integral}</p>
        </Space>
    </Card>
}

//左侧菜单
const MineLeftMenu: React.FC = () => {
    const { pathname } = useRouter();
    interface TabItemProps {
        text: string;
        link: string;
    }

    const items: TabItemProps[] = [
        { text: "我的创作", link: "/users/creation" },
        { text: "我的资源", link: "/users/resources" },
        { text: "我的活动", link: "/users/activity" },
        { text: "我的收藏", link: "/users/collection" },
        { text: "我的消息", link: "/users/message" },
        { text: "设置", link: "/users/setting" },
    ]

    const TabLink: React.FC<{ link: string }> = ({ children, link }) => {
        return <Link href={link} as={link}><a>{children}</a></Link>;
    }

    return (
        <Card
            bordered={false}
            bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
            size={"small"}
        >
            <ul className={ulCls}>
                {items.map(({ link, text }) => (
                    <li
                        className={liCls}
                        data-active={pathname === link}
                        key={link}
                    >
                        <TabLink link={link}>
                            {text}
                        </TabLink>
                    </li>
                ))}
            </ul>
        </Card>
    )
}

const ulCls = css`
    margin: 0;
`;

const liCls = css`
    padding-left: 20px;
    padding-right: 20px;
    position: relative;

    & > {
        a {
            display: block;
            color: #666;
            height: 45px;
            line-height: 45px;

            &:hover {
                color: ${process.env.PRIMARY_COLOR};
            }
        }
    }

    &[data-active="true"] {
        background-color: #F0F7FDFF;

        &::before {
            content: "";
            display: block;
            width: 2px;
            height: 20px;
            background-color: ${process.env.PRIMARY_COLOR};
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
        }

        a {
            display: block;
            color: ${process.env.PRIMARY_COLOR};
            height: 45px;
            line-height: 45px;
        }
    }
`;
