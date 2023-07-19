import { getAdviserIgonre } from "@/apis/home";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Adviser from "@/vo/Adviser";
import { Avatar, Card, Col, Row, Space } from "antd";
import { NextPage } from "next";
import React, { Key, useContext } from "react";

import createEmotion from '@emotion/css/create-instance'
import SeoHead from "@/components/SeoHead";
import { cloneDeep } from "lodash";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-adviser-id` });

interface AdviserDetailContextProps extends AdviserDetailPageProps {

}

const AdviserDetailContext = React.createContext<AdviserDetailContextProps>({} as AdviserDetailContextProps);

interface AdviserDetailPageProps {
    advert: Adviser;
}

/**顾问详情 */
const AdviserDetailPage: NextPage<AdviserDetailPageProps> = (props) => {

    const ctxValue: AdviserDetailContextProps = {
        ...props
    }
    let { seoTitle, seoKeywords, introduction } = props.advert;
    return (
        <AdviserDetailContext.Provider value={ctxValue}>
            <DefaultLayout>
                <Row gutter={15}>
                    <Col span={18}>
                        {/* 介绍 */}
                        <Descript />

                        {/* 提示 */}
                        {/* <Tips /> */}
                    </Col>
                    <Col span={6}>
                        {/* 顾问卡片 */}
                        <AdviserCard />
                    </Col>
                </Row>
            </DefaultLayout>
            <SeoHead
                title={seoTitle}
                description={introduction}
                keyword={seoKeywords}
            />
        </AdviserDetailContext.Provider>
    )
}

AdviserDetailPage.getInitialProps = async (ctx) => {
    const id = ctx.query.id as Key;
    const advert = (await getAdviserIgonre(id)).data;
    return {
        advert,
    }
}

export default AdviserDetailPage;

/**介绍 */
const Descript: React.FC = () => {

    const { advert } = useContext(AdviserDetailContext);

    return (
        <Card bordered={false} className={"mb-[20px]"}>
            <h1 className={"fs-[18px] fw-500 color-[#000000e6] mb-[16px]"}>
                {advert.name}
            </h1>
            <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: advert.details }}
            />
        </Card>
    )
}

/**提示 */
const Tips: React.FC = () => {
    const { advert } = useContext(AdviserDetailContext);
    return (
        <Card bordered={false} className={"mb-[20px]"}>
            <Space align={"start"}>
                <Avatar size={76} shape={"square"} src={advert.qrCode} />
                <Space direction={"vertical"}>
                    <p className={"fs-[16px] fw-500 color-[#000000e6]"}>
                        温馨提示
                    </p>
                    <p className={"fs-[14px] color-[#00000099]"}>
                        扫码联系顾问帮您解决问题
                    </p>
                </Space>
            </Space>
        </Card>
    )
}

/**顾问卡片 */
const AdviserCard: React.FC = () => {

    const { advert } = useContext(AdviserDetailContext);

    const listCls = css`
      img {
        width: 55px;
        height: 55px;
        border:1px solid #dcdcdc;
        border-radius: 100%;
      }
    `;

    return (
        <Card bordered={false} title={"专业顾问"}>
            <div className="text-center">
                {/* <Avatar size={55} src={advert.headImg} /> */}
                <div className={cx(listCls)}>
                    <img src={advert.headImg} />
                </div>
                <p className={"fs-[14px] color-[#000000FF] fw-500 my-[10px]"}>
                    {advert.name}
                </p>
                <p className="fs-[14px] color-[#00000099] text-left">
                    {advert.introduction}
                </p>
                <div className={lineCls} />
                <Avatar size={166} shape={"square"} src={advert.qrCode} />
                <p className={"fw-500 fs-[14px] color-[#00000099]"}>
                    扫一扫，联系我们
                </p>
            </div>
        </Card>
    )
}

const lineCls = css`
    width: 100%;
    height: 1px;
    background-image: linear-gradient(to right, #ccc 0%, #ccc 50%, transparent 50%);
    background-size: 8px 1px;
    background-repeat: repeat-x;
    margin-bottom: 15px;
    margin-top: 15px;
`;