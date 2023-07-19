import React, { Fragment, useEffect, useState } from "react";
import { Avatar, Button, Col, Dropdown, Popover, Row, Space, Menu as AntMenu, message } from "antd";
import Container from "@/components/Container";
import Link from "next/link";
import CustomSearchInput from "@/components/SearchInput";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { slice } from "lodash";
import Icon from "@/components/Icon";
import { Menu } from "@/vo/Basic";
import Authorization from "@/components/Authorization";
import cookieJs from "cookie_js";
import { setUserInfo } from "@/redux/actions/userActions";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-header` });

interface HeadProps {

}

const Head: React.FC<HeadProps> = () => {

    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        const { top } = document.body.getBoundingClientRect();
        setShow(Math.abs(top) >= 116);

        document.addEventListener("scroll", () => {
            const { top } = document.body.getBoundingClientRect();
            setShow(Math.abs(top) >= 116);
        })

        return () => {
            document.removeEventListener("scroll", () => { });
        }
    }, []);

    return (
        <div className={"h-[115px]"}>
            <MinHead
                style={{
                    position: "fixed",
                    top: 0,
                    transition: "all 0.3s",
                    transform: "translateY(-75px)",
                    ...(show && { transform: "translateY(0px)" })
                }}
            />
            <MaxHead
                style={{
                    position: "fixed",
                    top: "0",
                    transition: "all 0.3s",
                    transform: "translateY(0)",
                    ...(show && { transform: "translateY(-115px)" })
                }}
            />
        </div>
    )
}

export default Head;

/**大的导航栏 */
export const MaxHead: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {

    /**logo */
    const Logo: React.FC = () => {

        return <Link href={"/"}>
            <a>
                <img
                    className={"w-[220px] h-[65px]"}
                    src="/asset/image/company-logo.png"
                />
            </a>
        </Link>
    }

    return (
        <div
            className={cx(
                "w-[100%]",
                "bg-color-[#ffffff]",
                "h-[115px]",
                "flex",
                "row-center",
                "sticky",
                className,
            )}
            style={{ zIndex: 999, top: 0, ...style }}
        >
            <Container>
                <Row gutter={20} className={"w-max"}>
                    <Col span={5}>
                        <Logo />
                    </Col>
                    <Col span={14}>
                        <SearchInput />
                    </Col>
                    <Col span={5}>
                        <Slogon />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

/**小导航 */
export const MinHead: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {

    const { push } = useRouter();

    /**logo */
    const Logo: React.FC = () => {

        return <Link href={"/"}>
            <a>
                <img
                    className={"w-[140px]"}
                    src="/asset/image/company-logo.png"
                />
            </a>
        </Link>
    }

    const onSearch = (value: string) => {
        push({ pathname: "/search", query: { keyword: value } });
    }

    return (
        <div
            className={cx(
                "w-[100%]",
                "bg-color-[#ffffff]",
                "h-[75px]",
                "flex",
                "row-center",
                "sticky",
                className,
            )}
            style={{ zIndex: 999, top: 0, ...style }}
        >
            <Container>
                <Row gutter={20} align={"middle"} className={"w-max"}>
                    <Col span={3}>
                        <Logo />
                    </Col>
                    <Col span={15}>
                        <Navigation />
                    </Col>
                    <Col span={4}>
                        <CustomSearchInput onSearch={onSearch} />
                    </Col>
                    <Col span={2}>
                        <UserInfoButton />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

interface NavigationProps {
    spaceSize?: number
}

/**菜单 */
export const Navigation: React.FC<NavigationProps> = ({ spaceSize }) => {

    const menus = useSelector((state: MainReduxState) => state.mainReducer.menus);

    const menuList = slice(menus, 1, 7);

    const otherList = slice(menus, 7, menus?.length);

    const btnCls = css`
        &:hover {
            color: ${process.env.PRIMARY_COLOR} !important;
        }
    `;
    const { pathname } = useRouter();
    return (
        <Space size={spaceSize} className={"ml-[15px]"}>
            {menuList.map((menu) => {
                const { menuId, menuName, href } = menu;

                if (menu.children.length) {
                    return (
                        <Popover
                            placement={"bottomRight"}
                            content={<ChildMenu menus={menu.children} />}
                        >
                            <Button
                                className="fw-500 color-[#000000e6] fs-[16px]"
                                type={"link"}
                            >
                                {menuName}
                                <Icon type={"icon-xiajiantou"} />
                            </Button>
                        </Popover>
                    )
                }

                if (/http(s):\/\//.test(menu.href)) {
                    return (
                        <Button
                            href={menu.href}
                            target={"_blank"}
                            className={cx("fw-500", "color-[#000000e6]", "fs-[16px]", btnCls)}
                            type={"link"}
                        >
                            {menuName}
                        </Button>
                    )
                }
                return (
                    <Link passHref href={href} key={menuId}>
                        <Button
                            className={cx("fw-500", "color-[#000000e6]", "fs-[16px]", btnCls)}
                            type={"link"}
                        >
                            <span className={cx({ 'color-[#f676a6]': pathname == href })}>{menuName}</span>
                        </Button>
                    </Link>
                )
            })}
            {
                (() => {
                    if (!otherList.length) return <Fragment />;
                    return (
                        <Popover
                            placement={"bottomRight"}
                            content={<ChildMenu menus={otherList} />}
                        >
                            <Button
                                type={"link"}
                                className="fw-500 color-[#000000e6] fs-[16px]"
                            >
                                <a className="color-[#000000e6]">更多</a>
                                <Icon type={"icon-xiajiantou"} />
                            </Button>
                            <div style={{ 'display': "none" }} >
                                <ChildMenu menus={otherList} />
                            </div>
                        </Popover>
                    )
                })()
            }
        </Space >
    )
}

Navigation.defaultProps = {
    spaceSize: 10
}

/**子菜单 */
export const ChildMenu: React.FC<{ menus: Menu[] }> = ({ menus }) => {

    const cls = css`
        width: 390px;
    `;
    const { pathname } = useRouter();
    return (
        <Row className={cls} gutter={[20, 20]}>
            {menus.map((menu) => (
                <Col span={12} key={menu.menuId}>
                    {(() => {
                        if (/http(s):\/\//.test(menu.href)) {
                            return (
                                <a href={menu.href} target={"_blank"} rel={['卖家精灵', 'AMZ123导航'].includes(menu.menuName) ? 'nofollow' : ''}>
                                    <Space align={"center"} size={20}>
                                        <Avatar
                                            src={menu.iconUrl}
                                            size={42}
                                            shape={"square"}
                                        />
                                        <span>{menu.menuName}</span>
                                    </Space>
                                </a>
                            )
                        }
                        return (
                            <Link href={menu.href}>
                                <a>
                                    <Space align={"center"} size={20}>
                                        <Avatar
                                            src={menu.iconUrl}
                                            size={42}
                                            shape={"square"}
                                        />
                                        <span className={cx({ 'color-[#f676a6]': pathname == menu.href })}>{menu.menuName}</span>
                                    </Space>
                                </a>
                            </Link>
                        )
                    })()}
                </Col>
            ))}
        </Row>
    )
}

/**搜索框 */
const SearchInput: React.FC = () => {

    const { push } = useRouter();

    const prefix = process.env.CLASS_PREFIX;

    const classns = css`
        .${prefix}-input-wrapper.${prefix}-input-group {
            border-radius: 42px;
            overflow: hidden;

            .${prefix}-input-group-addon:last-child {
                left: 0;
            }
        }
    `;

    const onSearch = (value: string) => {
        push({ pathname: "/search", query: { keyword: value } });
    }

    return <Space
        direction="vertical"
        className={cx(classns, "w-[100%]")}
        size={6}
    >
        <CustomSearchInput
            size={"large"}
            enterButton={<span className="px-[10px] fs-[12px]">搜索</span>}
            onSearch={onSearch}
        />
        <Space size={30}>
            <Link href={{ pathname: "/search", query: { keyword: "亚马逊" } }}>
                <a className="color-[#00000066] fs-[12px]">
                    亚马逊
                </a>
            </Link>
            <Link href={{ pathname: "/search", query: { keyword: "TikTok" } }}>
                <a className="color-[#00000066] fs-[12px]">
                    TikTok
                </a>
            </Link>
            <Link href={{ pathname: "/search", query: { keyword: "独立站" } }}>
                <a className="color-[#00000066] fs-[12px]">
                    独立站
                </a>
            </Link>
            <Link href={{ pathname: "/search", query: { keyword: "物流" } }}>
                <a className="color-[#00000066] fs-[12px]">
                    物流
                </a>
            </Link>
            <Link href={{ pathname: "/search", query: { keyword: "供应链" } }}>
                <a className="color-[#00000066] fs-[12px]">
                    供应链
                </a>
            </Link>
            <Link href={{ pathname: "/search", query: { keyword: "选品" } }}>
                <a className="color-[#00000066] fs-[12px]">
                    选品
                </a>
            </Link>
            <Link href={{ pathname: "/search", query: { keyword: "开店" } }}>
                <a className="color-[#00000066] fs-[12px]">
                    开店
                </a>
            </Link>
            <a href="https://iipto.com/fastResult/brandLike?channel=KJZD" target="_blank" className="color-[#00000066] fs-[12px] flex mt-[1px]">
                商标检索<img className={"h-[18px] ml-[2px]"} src={"/asset/image/icon/hot.svg"} />
            </a>
        </Space>
    </Space>
}

/**slogon */
const Slogon: React.FC = () => {
    return <Space size={18} align="start">
        <img
            className={"wh-[75px] bg-color-[#f2f2f2] border-none br-a-[5px]"}
            src={"/asset/image/kjzd_gzh2.png"}
        />
        <div>
            <p className={"color-[#000000e6] fs-[14px] mb-[15px] mt-[15px]"}>
                跨境知道公众号
            </p>
            <p className="color-[#00000099] fs-[12px]">
                扫一扫，领资料
            </p>
        </div>
    </Space>
}

/**用户信息、登录按钮 */
export const UserInfoButton: React.FC = () => {
    const { push } = useRouter()
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    const loginBtnClassns = css`
        &:hover {
            background-color: ${process.env.PRIMARY_COLOR} !important;
            color: #fff !important;
        }
    `;

    const dispatch = useDispatch();

    const onLogout = () => {
        cookieJs.set(process.env.TOKEN_KEY, "", { path: "/" });
        setUserInfo(undefined)(dispatch);
        message.success("退出登录成功!");
        push('/')
    }

    /**用户菜单 */
    const menuElement = (
        <AntMenu>
            <AntMenu.Item key={1}>
                <Link
                    href={`/users/index/${userInfo?.userId}`}
                >
                    <a>我的主页</a>
                </Link>
            </AntMenu.Item>
            <AntMenu.Divider />
            <AntMenu.Item key={2}>
                <Link href={"/users/creation"}>
                    <a>我的创作</a>
                </Link>
            </AntMenu.Item>
            <AntMenu.Item key={3}>
                <Link href={"/users/resources"}>
                    <a>我的资源</a>
                </Link>
            </AntMenu.Item>
            <AntMenu.Item key={4}>
                <Link href={"/users/activity"}>
                    <a>我的活动</a>
                </Link>
            </AntMenu.Item>
            <AntMenu.Item key={5}>
                <Link href={"/users/collection"}>
                    <a>我的收藏</a>
                </Link>
            </AntMenu.Item>
            <AntMenu.Item key={6}>
                <Link href={"/users/setting"}>
                    <a>设置</a>
                </Link>
            </AntMenu.Item>
            <AntMenu.Divider />
            <AntMenu.Item
                key={7}
                onClick={onLogout}
            >
                <a>退出</a>
            </AntMenu.Item>
        </AntMenu>
    )

    if (!!userInfo) {
        return <div className="w-[160px]">
            <Dropdown overlay={menuElement}>
                <Space className="cs-p">
                    <Avatar src={userInfo.avatar} />
                    <span className="lc-1 w-[60px]">{userInfo.nick}</span>
                </Space>
            </Dropdown>

            <Button
                type={"primary"}
                className={cx(loginBtnClassns, [
                    "float-right",
                    "px-[10px]",
                    "py-[0px]",
                    "h-[30px]",
                    "fh-[30px]",
                    "br-bl-[0px]",
                ])}
                shape={"round"}
                ghost
            >
                <Link href={'/articles/publish'}><a>投稿</a></Link>
            </Button>

        </div>
    }

    return <div className="w-[160px]">
        <Authorization.Valid>
            <Button
                type={"primary"}
                className={cx(loginBtnClassns, [
                    "float-right",
                    "ml-[10px]",
                    "px-[10px]",
                    "py-[0px]",
                    "h-[30px]",
                    "fh-[30px]",
                    "br-bl-[0px]",
                ])}
                shape={"round"}
                ghost
            >
                投稿
            </Button>
        </Authorization.Valid>
        <Authorization.Valid>
            <Button
                type={"primary"}
                className={cx(loginBtnClassns, [
                    "float-right",
                    "px-[10px]",
                    "py-[0px]",
                    "h-[30px]",
                    "fh-[30px]",
                    "br-bl-[0px]",
                ])}
                shape={"round"}
                ghost
            >
                登录/注册
            </Button>
        </Authorization.Valid>
    </div>
}