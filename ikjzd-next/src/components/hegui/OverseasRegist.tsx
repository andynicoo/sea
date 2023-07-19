import { CountryCount } from "@/vo/Hegui";
import createEmotion from "@emotion/css/create-instance";
import { Col, Row, Space } from "antd";
import React, { Fragment } from "react";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});

const OverseasRegist: React.FC = () => {
  const cls = css`
    height: 582px;
    background: linear-gradient(148deg, #f4558c 0%, #ff7070 100%);
    border-radius: 4px;
    h2 {
      color: #ffffff;
      font-size: 28px;
    }
    .flagbox {
      margin-top: 50px;
    }
  `;

  const countryCount: CountryCount[] = [
    {
      name: "注册海外公司",
      flag: "cm.png",
      link: "",
    },
    {
      name: "注册香港公司",
      flag: "hk1.png",
      link: "",
    },
    {
      name: "注册美国公司",
      flag: "usa1.png",
      link: "",
    },
    {
      name: "注册英国公司",
      flag: "uk1.png",
      link: "",
    },
    {
      name: "注册纳闽公司",
      flag: "na.png",
      link: "",
    },
    {
      name: "注册BVI公司",
      flag: "bvi1.png",
      link: "",
    },
    {
      name: "注册开曼公司",
      flag: "cm.png",
      link: "",
    },
    {
      name: "注册新加坡公司",
      flag: "sg.png",
      link: "",
    },
    {
      name: "注册日本公司",
      flag: "jap.png",
      link: "",
    },
    {
      name: "注册澳大利亚公司",
      flag: "cm.png",
      link: "",
    },
    {
      name: "注册德国公司",
      flag: "gm.png",
      link: "",
    },
    {
      name: "注册印度公司",
      flag: "ind.png",
      link: "",
    },
    {
      name: "注册马来西亚公司",
      flag: "mal.png",
      link: "",
    },
    {
      name: "注册韩国公司",
      flag: "kor.png",
      link: "",
    },
  ];

  return (
    <div
      className={cx(cls, "pt-[14px] pb-[14px] pl-[16px] pb-[0px]  mb-[14px]")} id="海外公司注册"
    >
      <h2 className={cx("mt-[10px] mb-[10px]")}>海外公司注册</h2>
      <span className={cx("fs-[12px] color-[#ffffff]")}>
        发展跨国业务，提升企业形象，方便国际贸易
      </span>
      <div className="flagbox">
        <div>
          <Row>
            <Fragment>
              {countryCount.map(({ name, flag }) => {
                return (
                  <Col span={12} key={name}>
                    <div
                      className={
                        "h-[40px] mr-[16px] mb-[16px] fs-[16px] fh-[40px] color-[#1d1f1d] br-a-[4px] bg-color-[#ffffff]"
                      }
                    >
                      <Space>
                        <div className={"h-[25px] fh-[25px] ml-[8px]"}>
                          <img src={`/asset/image/flag/${flag}`} />
                        </div>
                        {name}
                      </Space>
                    </div>
                  </Col>
                );
              })}
            </Fragment>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default OverseasRegist;
