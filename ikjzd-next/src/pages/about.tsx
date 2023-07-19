import React, { Fragment, Key, useState, useEffect } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Card, Row, Col } from "antd";
import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-cs-header`,
});
import About1 from "@/components/about/About1";
import About2 from "@/components/about/About2";
import About3 from "@/components/about/About3";
import About4 from "@/components/about/About4";

interface AboutContentProps extends AboutPageProps {}

const AboutContent = React.createContext<AboutContentProps>(
  {} as AboutContentProps
);

interface AboutPageProps {}

const LoginPage: NextPage<AboutPageProps> = (props) => {
  const { push, query } = useRouter();
  const [activeKey, setActiveKey] = useState<number>(0);
  
  const ctxValue: AboutContentProps = {
    ...props,
  };

  const handleClick = (data: number) => {
    setActiveKey(data);
  };

  return (
    <AboutContent.Provider value={ctxValue}>
      <DefaultLayout>
        <Row gutter={15}>
          <Col span={6}>
            <Card
              bordered={false}
              bodyStyle={{
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              <LeftMenu activeKey={activeKey} handleClick={handleClick} />
            </Card>
          </Col>
          <Col span={18}>
            <Card bordered={false}>
              {activeKey === 0 ? <About1 /> : ""}
              {activeKey === 1 ? <About2 /> : ""}
              {activeKey === 2 ? <About3 /> : ""}
              {activeKey === 3 ? <About4 /> : ""}
            </Card>
          </Col>
        </Row>
      </DefaultLayout>
    </AboutContent.Provider>
  );
};

export default LoginPage;

const LeftMenu: React.FC<{ activeKey: number; handleClick: any }> = ({
  activeKey,
  handleClick,
}) => {
  const cls = css`
    position: fixed;
    width: 288px;
    background: #ffffff;
    z-index: 1;
    li {
      height: 50px;
      line-height: 50px;
      text-align: center;
      padding: 0px 10px;
      border-bottom: 1px solid #eeeeee;
      position: relative;
    }
    .active {
      height: 50px;
      transform: translateY(0px);
      background-color: #f676a6;
      position: absolute;
      width: 2px;
      top: 0px;
      left: 0px;
    }
  `;
  interface LiItemType {
    title: string;
    url: string;
  }
  const liItem: LiItemType[] = [
    {
      title: "关于跨境知道",
      url: "/about?name=about",
    },
    {
      title: "版权声明",
      url: "/about?name=about",
    },
    {
      title: "平台规则",
      url: "/about?name=about",
    },
    {
      title: "联系我们",
      url: "/about?name=about",
    },
  ];
  const liClick = (key: number) => {
    handleClick(key);
  };

  return (
    <div className={cx(cls)}>
      <ul>
        {liItem.map((item: LiItemType, index: number) => (
          <li onClick={() => liClick(index)} key={item.title}>
            {index === activeKey ? <div className="active"></div> : ""}
            <a>{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
