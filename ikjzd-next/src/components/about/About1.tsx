import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});
import Link from "next/link";
import { Card, Row, Col } from "antd";

const About1: React.FC = () => {
  const cls = css`
    .com_line {
      width: 17px;
      height: 1px;
      background-color: #575757;
      margin: 0 auto;
      margin-bottom: 30px;
    }
    .card {
      background-color: #f8f8f8;
      height: 270px;
      margin-bottom: 20px;
      padding: 0px 20px;
      position: relative;
      .eight_content {
        width: 156px;
        margin: 0 auto;
      }
      .eight_title {
        font-size: 18px;
        margin: 0;
        padding-top: 30px;
      }
      .eight_sub {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .eight_sub,
      .eight_desc {
        font-size: 12px;
        color: #666666;
      }
      .eight_desc {
        line-height: 22px;
        margin-top: 30px !important;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
      }
      .link {
        font-size: 12px;
        color: #f676a6;
        position: absolute;
        left: 20px;
        bottom: 20px;
      }
    }
  `;
  return (
    <div className={cx(cls)}>
      <p className="fs-[22px] mt-[25px] text-center">关于跨境知道</p>
      <p className="fs-[14px] mt-[10px] mb-[15px] text-center color-[#999999]">
        ABOUT IKJZD.COM
      </p>
      <p className="com_line"></p>

      <p className="fs-[16px] mt-[10px] text-left color-[#333333]">
        跨境知道是出口跨境电商行业领先的互联网资源服务平台，致力于为用户提供全面优质的资源服务、运营干货和前沿资讯，为用户洞察行业趋势动向，深度解读平台政策，提供选品数据报告，一直如朋友般陪伴跨境卖家快速学习成长。
      </p>
      <p className="fs-[16px] mt-[10px] text-left color-[#333333]">
        跨境知道采用先进的个性化推荐引擎技术，通过大数据对行业进行分析，持续提供深受卖家欢迎的资源和内容，不断吸引和凝聚高质量社群用户。目前平台覆盖超过300万精准出口跨境电商行业人群（包PC网站、公众号、社区），月访问量大于400万，微信粉丝50万，社区活跃用户26万，成为行业最大流量平台。
      </p>
      <p className="fs-[16px] mt-[10px] text-left color-[#333333]">
        跨境知道秉持“全面开放，合作共赢”的理念，围绕Amazon、Ebay、Wish、Aliexpress、Jumia、Souq等全球电子商务平台商，携手行业伙伴，建立开放资源服务，为中国卖家出海提供有力支持。跨境知道是深圳市跨境电子商务协会战略合作伙伴，广东省网商会常务理事单位。
      </p>

      <p className="fs-[22px] mt-[25px] text-center">跨境知道八大板块简介</p>
      <p className="fs-[14px] mt-[10px] mb-[15px] text-center color-[#999999]">
        BRIEF
      </p>
      <p className="com_line"></p>
      <div>
        <Row gutter={20}>
          <Col span={6}>
            <div className="card">
              <p className="eight_title">跨境风向标</p>{" "}
              <p className="eight_sub">INDICATOR</p>{" "}
              <p className="eight_desc">
                聚合行业最新资讯、平台政策信息、运营干货、大V原创文章、热销案例解析，提供最新的行业动态、政策解读和深度观点等。
              </p>
              <a href="/" target="_blank" className="link">
                了解更多&gt;
              </a>
            </div>
          </Col>
          <Col span={6}>
            <div className="card">
              <p className="eight_title">跨境百科</p>
              <p className="eight_sub">BAKE</p>
              <p className="eight_desc">
                跨境行业的“维基百科”，行业大咖执笔撰写，
                词条开放编辑功能，用户可参与更新，汇集行业智慧。
              </p>
              <a href="/w" target="_blank" className="link">
                了解更多&gt;
              </a>
            </div>
          </Col>
          <Col span={6}>
            <div className="card">
              <p className="eight_title">直播</p>{" "}
              <p className="eight_sub">LIVE</p>{" "}
              <p className="eight_desc">
                Wish、Ebay官方合作直播平台，深圳市跨境电子商务协会官方首选直播平台，汇集行业重要活动，第一时间现场直播，为全国卖家同步观看提供平台支持。
              </p>
              <a
                href="https://www.kjyunke.com/"
                target="_blank"
                className="link"
              >
                了解更多&gt;
              </a>
            </div>
          </Col>
          <Col span={6}>
            <div className="card">
              <p className="eight_title">K圈</p>
              <p className="eight_sub">CROSS-BORDER CIRCLE </p>
              <p className="eight_desc">
                聚集跨境电商行业的大V和原创作者，影响辐射超300万行业人士，是最受卖家欢迎的行业交流社区。
              </p>
              <a href="/k" target="_blank" className="link">
                了解更多&gt;
              </a>
            </div>
          </Col>
          <Col span={6}>
            <div className="card">
              <p className="eight_title">活动</p>
              <p className="eight_sub">ACTIVITY</p>
              <p className="eight_desc">
                全行业活动信息发布窗口，汇集各类平台活动、高峰论坛、卖家聚会、行业展会和选品大会等。
              </p>{" "}
              <a href="/acd" target="_blank" className="link">
                了解更多&gt;
              </a>
            </div>
          </Col>
          <Col span={6}>
            <div className="card">
              <p className="eight_title">资源工具</p>
              <p className="eight_sub">RESOURCES</p>
              <p className="eight_desc">
                优选Amazon、Ebay、Wish、Aliexpress、Jumia、Souq等全球电子商务平台商运营所需的资源和工具软，助力卖家提高效率，节省时间。
              </p>
              <a href="/tl" target="_blank" className="link">
                了解更多&gt;
              </a>
            </div>
          </Col>
          <Col span={6}>
            <div className="card">
              <p className="eight_title">在线开店</p>
              <p className="eight_sub">SHOP ONLINE</p>
              <p className="eight_desc">
                聚合行业最新资讯、平台政策信息、运营干货、大V原创文章、热销案例解析，提供最新的行业动态、政策解读和深度观点等。
              </p>
              <a href="/stores" target="_blank" className="link">
                了解更多&gt;
              </a>
            </div>
          </Col>
          <Col span={6}>
            <div className="card">
              <p className="eight_title">百宝箱</p>
              <p className="eight_sub">TRESURE BOX</p>
              <p className="eight_desc">
                涵盖行业服务和供应链上下游的资源库，沉淀行业重要专题内容，
                针对常见问题提供快速解决方案，推荐优质服务。
              </p>
              <a href="/" target="_blank" className="link">
                了解更多&gt;
              </a>
            </div>
          </Col>
        </Row>
      </div>

      <p className="fs-[22px] mt-[25px] text-center">更多方式关注我们</p>
      <p className="fs-[14px] mt-[10px] mb-[15px] text-center color-[#999999]">
        MORE
      </p>
      <p className="com_line"></p>
      <Row gutter={40}>
        <Col span={6} className="text-center">
          <img src={"/asset/image/wb.png"} className="w-[125px]" />
          <h3>跨境知道微博</h3>
        </Col>
        <Col span={6} className="text-center">
          <img src={"/asset/image/wx-code.png"} className="w-[125px]" />
          <h3>官方微信公众号</h3>
        </Col>
        <Col span={6} className="text-center">
          <img src={"/asset/image/kf.png"} className="w-[125px]" />
          <h3>官方客服</h3>
        </Col>
      </Row>
    </div>
  );
};

export default About1;
