import DefaultLayout from "@/components/layouts/DefaultLayout";
import ServerPageContext, { ServerPageContextProps } from "@/components/server/PageContext";
import ServerPageLayout from "@/components/server/PageLayout";
import { Avatar, Button, Card, Col, Empty, Row, Space } from "antd";
import { NextPage } from "next";
import React, { Fragment, Key, useContext } from "react";
import { getServerSupplierDetail } from "@/apis/server";
import { Store } from "@/vo/Domain";

import createEmotion from "@emotion/css/create-instance";
import moment from "moment";
import Authorization from "@/components/Authorization";
import { onShowConnect } from "@/pages/server/[id]";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-domain-store-id-infos` });

interface SupplierInfosPageProps {
    store: Store;
}

/**供应商信息 */
const SupplierInfosPage: NextPage<SupplierInfosPageProps> = (props) => {

    const ctx: ServerPageContextProps = {
        ...props
    }

    return (
        <ServerPageContext.Provider value={ctx}>
            <DefaultLayout>
                <ServerPageLayout>
                    <SupplierInfosCard />
                </ServerPageLayout>
            </DefaultLayout>
        </ServerPageContext.Provider>
    )
}

SupplierInfosPage.getInitialProps = async (ctx) => {
    const id = ctx.query.id as Key;
    const store = (await getServerSupplierDetail(id)).data;
    return {
        store
    }
}

export default SupplierInfosPage;

const SupplierInfosCard: React.FC = () => {

    const labelCls = css`
        margin-left: 10px;
        position: relative;
        font-size: 14px;
        font-weight: 500;
        color: #000000E6;
        margin-bottom: 10px;

        &::before {
            content: "";
            display: block;
            width: 2px;
            height: 14px;
            background-color: ${process.env.PRIMARY_COLOR};
            position: absolute;
            left: -10px;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 2px;
        }
    `;

    const { store } = useContext(ServerPageContext);

    const ServerContent: React.FC = () => {
        if (!store?.serviceContent?.length) return <Empty />;
        return (
            <Space wrap size={20} className={"mb-[20px] ml-[10px] w-[100%]"}>
                {store.serviceContent.map((item) => (
                    <Space
                        direction={"vertical"}
                        size={10}
                        key={item.id}
                        className={"text-center"}
                    >
                        <Avatar />
                        <span className="color-[#00000099]">
                            {item.name}
                        </span>
                    </Space>
                ))}
            </Space>
        )
    }
    return (
        <Card title={"基础信息"} bordered={false}>
            <p className={labelCls}>
                公司介绍
            </p>
            <Row>
                <Col span={11} className={"mb-[20px]"}>
                    <p className="mb-[5px]">
                        <span className="color-[#000000e6] mr-[10px]">公司名称:</span>
                        <span className="color-[#00000099]">{store?.name}</span>
                    </p>
                    <p>
                        <span className="color-[#000000e6] mr-[10px]">所在城市:</span>
                        <span className="color-[#00000099]">{store?.cityCode == '市辖区' ? store?.provinceCode : store?.cityCode}</span>
                    </p>
                    {/* <p>
                        <span className="color-[#000000e6] mr-[10px]">注册资金:</span>
                        <span className="color-[#00000099]">148万(美元)</span>
                    </p>
                    <p>
                        <span className="color-[#000000e6] mr-[10px]">登记状态:</span>
                        <span className="color-[#00000099]">{store?.isShow ? "开业" : "停业"}</span>
                    </p> */}

                    {/* <p>
                        <span className="color-[#000000e6] mr-[10px]">统一社会信用代码:</span>
                        <span className="color-[#00000099]">911101056259121496</span>
                    </p> */}
                </Col>
                <Col span={13} className={"mb-[20px]"}>
                    <p className="mb-[5px]">
                        <span className="color-[#000000e6] mr-[10px]">公司人数:</span>
                        <span className="color-[#00000099]">{store?.companyScale}</span>
                    </p>
                    <p>
                        <span className="color-[#000000e6] mr-[10px]">成立时间:</span>
                        <span className="color-[#00000099]">{moment(store?.establishDate).format("YYYY-MM-DD")}</span>
                    </p>
                    {/* <p>
                        <span className="color-[#000000e6] mr-[10px]">主营业务:</span>
                        <span className="color-[#00000099]">承办海运、空运进出口货物的国际运输代理业务</span>
                    </p>
                    <p>
                        <span className="color-[#000000e6] mr-[10px]">经营范围:</span>
                        <span className="color-[#00000099]">承办海运、空运进出口货物的国际运输代理业务，包括揽</span>
                    </p>
                    <p>
                        <span className="color-[#000000e6] mr-[10px]">企业类型:</span>
                        <span className="color-[#00000099]">多式联运和运输代理业</span>
                    </p>
                    <p>
                        <span className="color-[#000000e6] mr-[10px]">公司法人:</span>
                        <span className="color-[#00000099]">高禧</span>
                    </p>
                    <p>
                        <span className="color-[#000000e6] mr-[10px]">公司官网:</span>
                        <span className="color-[#00000099]">www.vincent-international.com</span>
                    </p>
                    <p>
                        <span className="color-[#000000e6] mr-[10px]">企业邮箱:</span>
                        <span className="color-[#00000099]">804935993@QQ.COM</span>
                    </p> */}
                </Col>
            </Row>
            <p className={labelCls}>
                公司简介
            </p>
            {/* <p className="ml-[10px] color-[#00000099] fh-[28px] mb-[20px]">
                {store?.description}
            </p> */}
            <div className={"rich-text ml-[10px] color-[#00000099] fh-[28px] mb-[20px]"} dangerouslySetInnerHTML={{ __html: store?.description as string }}>
            </div>
            {/* {(() => {
                if (store?.type === "SERVICE") {
                    return (
                        <Fragment>
                            <p className={labelCls}>
                                服务内容
                            </p>
                            <ServerContent />
                        </Fragment>
                    )
                }
                return <Fragment />
            })()} */}
            <p className={labelCls}>
                联系方式
            </p>
            <p className="ml-[10px] mb-[5px]">
                <span className="color-[#000000e6] mr-[10px]">联系人:</span>
                <span className="color-[#00000099]">{store?.contacts}</span>
            </p>
            <p className="ml-[10px] mb-[5px]">
                <span className="color-[#000000e6] mr-[10px]">手 机:</span>
                <span className="color-[#00000099]">{store?.phone ? store?.phone.slice(0, 5) + "******" : '--'}</span>
            </p>
            <p className="ml-[10px] mb-[20px]">
                <span className="color-[#000000e6] mr-[10px]">电 话:</span>
                <span className="color-[#00000099]">{store?.telephone ? store?.telephone.slice(0, 5) + "******" : '--'}</span>
            </p>
            <Authorization.Valid>
                <Button
                    type={"primary"}
                    shape={"round"}
                    size={"large"}
                    onClick={onShowConnect}
                >
                    免费咨询
                </Button>
            </Authorization.Valid>
        </Card>
    )
}