import { NextPage } from "next";
import React, { Fragment, Key } from "react";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { useRouter } from "next/router";
import { Card, Col, Row } from "antd";
import Link from "next/link";
import LazyLoad from "react-lazyload";
import OptionBox from "@/components/hegui/OptionBox";
import RegisterServe from "@/components/hegui/RegisterServe";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});

interface HeguiRegistProps extends HeguiRegistPageProps {}

const HeguiDetailContent = React.createContext<HeguiRegistProps>(
  {} as HeguiRegistProps
);

interface HeguiRegistPageProps {}

// 合规注册页
const HeguiRegistPage: NextPage<HeguiRegistPageProps> = (props) => {
  const { query, push } = useRouter();

  const ctxValue: HeguiRegistProps = {
    ...props,
  };
  return (
    <HeguiDetailContent.Provider value={ctxValue}>
      <MinHead />
      <div className="">
        <img src={"/asset/image/banner_index.png"} className={"w-[100%]"} />
        <div className="w-max mx-auto relative">
          <OptionBox />

          <RegisterServe />
        </div>
      </div>
      <div style={{ background: "#F2F2F5",marginTop: "180px" }}>
        <Container className="my-[20px]">
          <div style={{ height: "800px", background: "#d5c2c2" }}>
            sfd
          </div>
        </Container>
      </div>

      <Footer />
    </HeguiDetailContent.Provider>
  );
};

export default HeguiRegistPage;
