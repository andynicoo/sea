import { Avatar, Button, Card, Col, Row, Space } from "antd";
import React, { useContext } from "react";
import { UnorderedListOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import ServerPageContext from "@/components/server/PageContext";
import { Store } from "@/vo/Domain";
import createEmotion from "@emotion/css/create-instance";
import moment from "moment";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-server-layout` });


interface PageLayoutProps {

}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    const { pathname, query } = useRouter();

    const { store } = useContext(ServerPageContext);
    const { provinceCode, cityCode, areaCode, companyUrl, name, establishDate, detailAddress } = store as Store;
    const [src] = companyUrl;

    const activeCls = css`
        color: #000000E6;
        background-color: #EFF7FDFF;
        font-weight: 500;
    `;

    const btnCls = css`
        height: 50px;
        line-height: 50px;
        padding: 0;
    `;

    const address = [provinceCode, cityCode, areaCode, detailAddress].join("")

    return (
        <Space
            direction={"vertical"}
            className={"w-[100%]"}
            size={20}
        >
            <Card bordered={false}>
                <Space size={30} className={"w-[100%]"} align={"start"}>
                    <Avatar
                        src={src}
                        shape={"square"}
                        style={{ height: 132, width: 288 }}
                    />
                    <div>
                        <p className="color-[#000000e6] fw-500 fs-[16px] mb-[5px]">
                            {name}
                        </p>
                        <p className="mb-[5px]">
                            <span className="color-[#000000e6]">成立时间: </span>
                            <span className="color-[#00000099]">{moment(establishDate).format("YYYY-MM-DD")}</span>
                        </p>
                        <p className="mb-[5px]">
                            <span className="color-[#000000e6]">公司地址: </span>
                            <span className="color-[#00000099]">{address}</span>
                        </p>
                    </div>
                </Space>
            </Card>

            <Row gutter={28}>
                <Col span={4}>
                    <Card
                        title={(
                            <Space>
                                <UnorderedListOutlined />
                                供应商档案
                            </Space>
                        )}
                        bordered={false}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Link
                            href={"/industry/store/[id]/infos"}
                            as={`/industry/store/${query.id}/infos`}
                        >
                            <a>
                                <Button
                                    type={"text"}
                                    block
                                    size={"large"}
                                    className={cx(btnCls, {
                                        [activeCls]: pathname === "/industry/store/[id]/infos"
                                    })}
                                >
                                    基础信息
                                </Button>
                            </a>
                        </Link>
                        {/* <Link
                            href={"/industry/store/[id]/products"}
                            as={`/industry/store/${query.id}/products`}
                        >
                            <a>
                                <Button
                                    type={"text"}
                                    block
                                    size={"large"}
                                    className={cx(btnCls, {
                                        [activeCls]: pathname === "/industry/store/[id]/products"
                                    })}
                                >
                                    产品介绍
                                </Button>
                            </a>
                        </Link> */}
                    </Card>
                </Col>
                <Col span={20}>
                    {children}
                </Col>
            </Row>
        </Space>
    )
}

export default PageLayout;