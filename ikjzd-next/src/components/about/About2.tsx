import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});
import Link from "next/link";
import { Card, Button } from "antd";

const About2: React.FC = () => {
  const cls = css`
    .com_line {
      width: 17px;
      height: 1px;
      background-color: #575757;
      margin: 0 auto;
      margin-bottom: 30px;
    }
  `;
  return (
    <div className={cx(cls)}>
      <p className="fs-[22px] mt-[25px] text-center">版权申明</p>
      <p className="fs-[14px] mt-[10px] mb-[15px] text-center color-[#999999]">
        COPYRIGHT
      </p>
      <p className="com_line"></p>

      <p className="fs-[16px] mt-[10px] text-left color-[#333333]">
        跨境知道隶属于深圳市亚马逊信息科技有限公司，是出口跨境电商行业领先的互联网资源服务平台，致力于为用户提供全面优质的资源服务、运营干货和前沿资讯，为用户洞察行业趋势动向，深度解读平台政策，提供选品数据报告，一直如朋友般陪伴跨境卖家快速学习成长。跨境知道采用先进的个性化推荐引擎技术，通过大数据对行业进行分析，持续提供深受卖家欢迎的资源和内容，不断吸引和凝聚高质量社群用户。
      </p>
      <p className="fs-[16px] mt-[10px] text-left color-[#333333]">
        跨境知道秉持“全面开放，合作共赢”的理念，围绕Amazon、Ebay、Wish、Aliexpress、Shopee、Jumia、ZILIGO、JOOm、阿里巴巴国际站、敦煌网等全球电子商务平台商，携手行业伙伴，建立开放资源服务，为中国卖家出海提供有力支持。跨境知道是深圳市跨境电子商务协会战略合作伙伴，广东省网商会常务理事单位。
      </p>
      <p className="fs-[16px] mt-[10px] text-left color-[#333333]">
        联系电话：0755-25998998
      </p>
      <p className="fs-[16px] mt-[10px] text-left color-[#333333]">
        公司地址：深圳市龙岗区坂田天安云谷2期4栋34楼
      </p>
      <p className="text-center mt-[25px]">
        <img
          src={"/asset/image/lb1.png"}
          alt={"版权申明"}
        />
      </p>
    </div>
  );
};

export default About2;
