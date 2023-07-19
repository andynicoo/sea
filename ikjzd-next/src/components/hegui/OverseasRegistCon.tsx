import createEmotion from "@emotion/css/create-instance";
import { Col, Row, Space } from "antd";
import React, { Fragment } from "react";
import { CountryCount2 } from "@/vo/Hegui";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});

const OverseasRegistCon: React.FC = () => {
  const cls = css`
    .box {
      width: 100%;
    }
  `;

  const registList: CountryCount2[] = [
    {
      title: "注册澳门公司",
      subtitle: "提高国际品牌吸引外资",
      flag: "ma.png",
      link: "",
    },
    {
      title: "注册迪拜公司",
      subtitle: "迪拜位于亚、欧、非三大洲交汇的战略位置，",
      flag: "dub.png",
      link: "",
    },
    {
      title: "注册加拿大公司",
      subtitle: "取名自由、无需验资、外汇",
      flag: "can.png",
      link: "",
    },
    {
      title: "注册越南公司",
      subtitle: "弹性经济、蓬勃发展的劳动密集型产业、劳动",
      flag: "vie.png",
      link: "",
    },
    {
      title: "注册泰国公司",
      subtitle: "掘金东南亚第二大电子商务市场",
      flag: "tha.png",
      link: "",
    },
    {
      title: "注册海南公司",
      subtitle: "海南公司注册、银行开户、做账审计、会计报",
      flag: "hainan.png",
      link: "",
    },
    {
      title: "注册欧洲公司",
      subtitle: "公司注册 银行开户、年审报税、VAT服务",
      flag: "eur.png",
      link: "",
    },
    {
      title: "注册东南亚公司",
      subtitle: "东南亚公司注册 /年审/开户、投资建厂",
      flag: "aus.png",
      link: "",
    },
  ];

  return (
    <div className={cx(cls, "")}>
      <div className="content">
        <Row gutter={16}>
          <Fragment>
            {registList.map(({ title, flag, subtitle, link }) => {
              return (
                <Col span={12} key={title}>
                  <Space
                    className={
                      "h-[130px]  pt-[30px]  pb-[30px] pl-[24px]  pr-[24x]  mb-[20px] br-a-[4px] bg-color-[#ffffff] box"
                    }
                  >
                    <div>
                      <img
                        src={`/asset/image/flag/${flag}`}
                        className={"h-[70px] w-[70px]"}
                        alt={title}
                      />
                    </div>
                    <div className={"ml-[10px]"}>
                      <div className={"fs-[20px]  mb-[11px]"}>{title}</div>
                      <div className={"fs-[12px]"}>{subtitle}</div>
                    </div>
                  </Space>
                </Col>
              );
            })}
          </Fragment>
        </Row>
      </div>
    </div>
  );
};

export default OverseasRegistCon;
