import createEmotion from "@emotion/css/create-instance";
import { Col, Row, Space } from "antd";
import React, { Fragment, Key } from "react";
import { SomeService } from "@/vo/Hegui";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});

// 参数 type  1秘书服务 2银行开户 3商标及专利 4其他服务
const ServerItem: React.FC<{ type: number }> = ({ type }) => {
  const cls = css`
    background: #ffffff;
    margin-right: 20px;
    margin-bottom: 20px;
    padding-left: 26px;
    padding-top: 26px;
    padding-right: 26px;
    height: 390px;
    .content {
      border-top: 1px solid #ebebeb;
      padding-top: 10px;
    }
    .itembg {
      background: #f5f5f5;
      width: 100%;
      margin-bottom: 10px;
      padding-left: 10px;
    }
  `;
  let title: string = "";
  let subTitle: string = "";
  let serviceList: SomeService[] = [];

  switch (type) {
    case 1:
      title = "秘书服务";
      subTitle = "提供香港秘书服务、商务秘书服务以及办公室秘书服务";
      serviceList = [
        {
          title: "香港公司审计",
          flag: "hk1.png",
          link: "",
        },
        {
          title: "境外投资备案",
          flag: "service_abroad.png",
          link: "",
        },
        {
          title: "海外公司年审",
          flag: "service_overseas.png",
          link: "",
        },
        {
          title: "香港公司年审",
          flag: "hk1.png",
          link: "",
        },
        {
          title: "离岸豁免",
          flag: "uk1.png",
          link: "",
        },
        {
          title: "红筹架构搭建",
          flag: "service_hong.png",
          link: "",
        },
      ];
      break;

    case 2:
      title = "银行开户";
      subTitle =
        "与香港及海外众多国际银行建立良好合作伙伴关系，安排境外银行开户及相关服务";
      serviceList = [
        {
          title: "离岸开户",
          flag: "bank_offshore.png",
          link: "",
        },
        {
          title: "香港银行开户",
          flag: "hk1.png",
          link: "",
        },
        {
          title: "汇丰银行开户",
          flag: "bank_hui.png",
          link: "",
        },
        {
          title: "恒生银行开户",
          flag: "bank_heng.png",
          link: "",
        },
        {
          title: "瑞士银行开户",
          flag: "bank_ubs.png",
          link: "",
        },
        {
          title: "美国银行开户",
          flag: "usa1.png",
          link: "",
        },
        {
          title: "新加坡银行开户",
          flag: "sg.png",
          link: "",
        },
      ];
      break;

    case 3:
      title = "商标及专利";
      subTitle = "打开国际市场，保护品牌及知识产权";
      serviceList = [
        {
          title: "国际商标注册",
          flag: "mark_world.png",
          link: "",
        },
        {
          title: "香港商标注册",
          flag: "hk1.png",
          link: "",
        },
        {
          title: "申请专利",
          flag: "mark_apply.png",
          link: "",
        },
      ];
      break;

    default:
      title = "其他服务";
      subTitle = "跨境电商VAT申请，出口退税首单辅导等";
      serviceList = [
        {
          title: "出口退税",
          flag: "other_export.png",
          link: "",
        },
        {
          title: "VAT税号注册",
          flag: "other_vat.png",
          link: "",
        },
        {
          title: "CE认证",
          flag: "other_ce.png",
          link: "",
        },
        {
          title: "CRS全球征税",
          flag: "other_crs.png",
          link: "",
        },
        {
          title: "公司注销",
          flag: "other_cancel.png",
          link: "",
        },
        {
          title: "跨境电商服务",
          flag: "other_kj.png",
          link: "",
        },
      ];
      break;
  }

  return (
    <div className={cx(cls, "")}>
      <h2 className={"fs-[28px] color-[#1d1f1d] fw-600 fh-[40px]"} id={title}>{title}</h2>
      <h4 className={"fs-[14px] color-[#222222] mt-[4px] mb-[27px]"}>
        {subTitle}
      </h4>
      <div className="content">
        <Row gutter={16}>
          <Fragment>
            {serviceList.map(({ title, flag, link }) => {
              return (
                <Col span={12} key={title}>
                  <Space className={"h-[50px] br-a-[4px] itembg"}>
                    <div>
                      <img
                        src={`/asset/image/flag/${flag}`}
                        alt={title}
                        className={"h-[30px] w-[30px]"}
                      />
                    </div>
                    <div className={"fh-[50px]"}>
                      <div className={"fs-[16px] fh-[50px]"}>{title}</div>
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

export default ServerItem;
