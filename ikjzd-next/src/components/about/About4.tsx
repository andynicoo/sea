import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});
import Link from "next/link";
import { Card, Button } from "antd";

const About2: React.FC = () => {
  const cls = css`
    min-height: 500px;
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
      <p className="fs-[22px] mt-[25px] text-center">联系我们</p>
      <p className="fs-[14px] mt-[10px] mb-[15px] text-center color-[#999999]">
        COMPANY PROFILE
      </p>
      <p className="com_line"></p>

      <p className="fs-[16px] mt-[10px] text-left color-[#333333]">
        跨境知道是出口跨境电商行业领先的互联网资源服务平台，致力于为用户提供全面优质的资源服务、运营干货和前沿资讯等，
        秉持“全面开放，合作共赢”的理念，携手行业伙伴，建立开放资源服务，为中国卖家出海提供有力支持，助力中国产品走向世界。如需合作请发邮件并注明公司名称，联系方式，具体合作需求。
      </p>

      <p className="fs-[16px] mt-[10px] text-left color-[#333333]">媒体合作</p>
      <p className="fs-[16px] mt-[10px] pl-[20px] text-left color-[#333333]">邮箱 <span className="color-[#1072c6]">kjzd@ikjzd.cn</span> </p>
      <p className="fs-[16px] mt-[10px] pl-[20px] text-left color-[#333333]">微信 <span className="color-[#1072c6]">13682470365</span> </p>
    </div>
  );
};

export default About2;
