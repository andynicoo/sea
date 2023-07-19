import React, { Fragment, useContext, useEffect, useState } from "react";
import { Col, Row, Divider as AntdDivider, Space } from "antd";
import Container from "@/components/Container";

import createEmotion from "@emotion/css/create-instance";
import { pageAd } from "@/apis/home";
import { sortBy } from "lodash";
import { IndexPageContext } from "@/pages";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-footer` });
interface FooterProps {
    linksShow?: boolean
}
 

const Footer: React.FC<FooterProps> = (props) => {

    const cls = css`
        background-color: #272B2E;
        color: #8D8D8D;
    `;

    const logoCls = css`
        width: 164px;
    `;

    const dividerCls = css`
        border-color: #37373AFF;
    `;
    
    return <div className={cx(cls, "pt-[50px] pb-[20px]")}>
        <Container>
            <Row gutter={20}>
                <Col span={5}>
                    <img
                        className={logoCls}
                        src="/asset/image/company-logo-footer.png"
                    />
                </Col>
                <Col span={15}>
                    <Content />
                </Col>
                <Col span={4}>
                    <QrCode />
                </Col>
            </Row>
            <AntdDivider className={dividerCls} />
            <Links linksShow={props.linksShow} />
        </Container>
    </div>
}

export default Footer;

/**内容 */
const Content: React.FC = () => {

    const cls = css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    `;

    const orgHref = process.env.ORIGINAL_PAGE;

    interface LinkItemProps {
        name: string;
        href: string;
    }

    interface LinkProps {
        name: string;
        items: LinkItemProps[]
    }

    const links: LinkProps[] = [
        {
            name: "关于我们",
            items: [
                { name: "关于跨境知道", href: `${orgHref}about?name=about` }
            ]
        },
        {
            name: "跨境知识",
            items: [
                { name: "行业洞查", href: "/insights" },
                { name: "研究报告", href: "/reports" },
                { name: "出海百问", href: "/question" },
                { name: "跨境百科", href: "/w" },
                { name: "直播课程", href: "https://www.kjyunke.com/" },
                { name: "K圈论坛", href: `/k?searchType=1` },
            ]
        },
        {
            name: "行业资源",
            items: [
                { name: "跨境平台", href: "/cbplatform?platformStatus=1" },
                { name: "服务商", href: "/server" },
                { name: "产业带", href: "/industry" },
                { name: "跨境活动", href: "/acd" },
                { name: "资源工具", href: `/tl` },
            ]
        },
    ]

    return <div className={cls}>
        {links.map(({ name, items }, index) => (
            <ul key={index}>
                <label className={cx("color-[#ffffff] fs-[14px] fw-600", "block", "mb-[15px]")}>{name}</label>
                {items.map(({ name, href }, index) => (
                    <li
                        key={index}
                        className={cx("fs-[12px]", "mb-[15px]")}
                    >
                        <a href={href} target={"_blank"} >
                            {name}
                        </a>
                    </li>
                ))}
            </ul>
        ))}
    </div>
}

/**公众号二维码 */
const QrCode: React.FC = () => {

    return <div className={cx("w-[100px]", "text-center", "fs-[14px]", "color-[#ffffff]", "float-right")}>
        <p className={"mb-[10px] fs-[14px]"}>官方微信公众号</p>
        <img className={cx("wh-[100px]", "br-a-[2px]")} src="/asset/image/code.jpg" />
    </div>
}

/**友情链接 */
const Links: React.FC<FooterProps> = (props) => {
    const { adLinks } = useContext(IndexPageContext);
    return <Fragment>
        {props.linksShow && <div className={cx("flex", "ai-fs")}>
            <span className={cx("block", "h-[22px]", "fh-[22px]", "fs-[12px]", "w-[90px]", "color-[#ffffff]")}>
                友情链接:
            </span>
            <span
                className={cx("w-[100%]", "fs-[12px]", "mb-[45px]")}
            >
                {adLinks.map(({ name, href }, index) => (
                    <a
                        target={"_blank"}
                        href={href}
                        key={index}
                        className={cx("block", "h-[22px]", "fh-[22px]", "fs-[12px] float-left mr-[25px] mb-[5px]")}
                    >
                        {name}
                    </a>
                ))}
            </span>
        </div>
        }

        <p className={cx("text-center", "fs-[12px]", "color-[#929092FF]")}>
            Copyright 2015-2023 ikjzd.com,All Rights Reserved
            <a
                className={cx("ml-[5px]")}
                target={"_blank"}
                href={"http://beian.miit.gov.cn/"}
            >
                粤ICP备18005586
            </a>
        </p>
    </Fragment>
}
