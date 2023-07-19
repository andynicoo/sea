import { NextPage } from "next";
import React, { Key, useContext, useEffect } from "react";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { Col, Row, Space } from "antd";
import OverseasRegist from "@/components/hegui/OverseasRegist";
import OverseasRegistCon from "@/components/hegui/OverseasRegistCon";
import ServerItem from "@/components/hegui/ServerItem";
import NewsList from "@/components/hegui/NewsList";
import OptionBox from "@/components/hegui/OptionBox";
import { CateListType } from "@/vo/Hegui";
import { getHeguiList } from "@/apis/hegui";
import { useRouter } from "next/router";
interface HeguiIndexContentProps extends HeguiIndexPageProps {}
const HeguiIndexContent = React.createContext<HeguiIndexContentProps>(
  {} as HeguiIndexContentProps
);

interface HeguiIndexPageProps {
  /**合规分类list */
  // cateList: CateListType[];
  heguiNews: CateListType[];
}
// 合规主页测试
const HeguiIndexPage: NextPage<HeguiIndexPageProps> = (props) => {
  const ctxValue: HeguiIndexPageProps = {
    ...props,
  };

  return (
    <HeguiIndexContent.Provider value={ctxValue}>
      <SeoHead
        title="香港公司注册处_离岸账户开设_美国商标注册_离岸公司注册_跨境知道合规"
        description="跨境知道精选业内知名服务商，为卖家提供香港公司注册、香港公司审计、离案账户开户、离岸公司注册、海外做账报税、国际商标注册等服务。"
        keyword="香港公司注册处，离岸账户开设，美国商标注册，注册美国公司,离岸公司注册"
      />
      <MinHead />
      <div className="">
        <img src={"/asset/image/banner_index.png"} className={"w-[100%]"} />
        <div className="w-max mx-auto relative">
          <OptionBox />
        </div>
      </div>
      <Container>
        <HeguiContent />
      </Container>

      <div className="bg-color-[#ffffff] mt-[50px] pt-[50px] pb-[50px]">
        <div className="text-center">
          <h2 className={"fs-[30px] mt-[30px] fw-600"}>合规资讯</h2>
          <h5 className={"fs-[14px] mt-[15px] mb-[40px]"}>
            致力于为企业提供一站式商业服务，为企业提供全方位的管理知识，并为企业在经营过程中遇到财税规划和企业架构搭建等问题提供合理化建议和解决方案。
          </h5>
        </div>

        <Container>
          <Row gutter={32}>
            {props.heguiNews.map((ele) => {
              return (
                <Col span={12} key={ele.id}>
                  {/* <div>{ele.name}</div> */}
                  <NewsList cateList={ele} />
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>

      <Footer />
    </HeguiIndexContent.Provider>
  );
};
export default HeguiIndexPage;

HeguiIndexPage.getInitialProps = async (ctx) => {
  const cateList = (await getHeguiList()).data;
  // 取前四个合规分类做参数，渲染页面下方四个资讯模块
  const heguiNews = cateList.slice(0, 4);
  return {
    heguiNews,
  };
};

const HeguiContent: React.FC = () => {
  return (
    <div className="pt-[50px] mt-[40px]">
      <Row gutter={16}>
        <Col span={8}>
          <OverseasRegist />
        </Col>
        <Col span={16}>
          <OverseasRegistCon />
        </Col>
        <Col span={12}>
          {/* ServerItem 参数 type  1秘书服务 2银行开户 3商标及专利 4其他服务 */}
          <ServerItem type={1} />
        </Col>
        <Col span={12}>
          <ServerItem type={2} />
        </Col>
        <Col span={12}>
          <ServerItem type={3} />
        </Col>
        <Col span={12}>
          <ServerItem type={4} />
        </Col>
      </Row>
    </div>
  );
};
