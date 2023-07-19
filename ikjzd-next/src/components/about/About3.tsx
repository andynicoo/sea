import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});
import Link from "next/link";
import { Card, Button } from "antd";

const About2: React.FC = () => {
  const cls = css`
    .wayContent {
      line-height: 26px;
      font-size: 14px;
      text-align: left;
    }
    .wayContent .title {
      font-size: 20px;
      font-weight: 400;
      color: #222222;
      margin: 59px 0 20px 0;
    }
    .wayContent .subtitle {
      font-size: 16px;
      font-weight: 400;
      color: #222222;
      margin: 30px 0 19px 0;
    }
    .wayContent .rulecontent {
      padding: 0 40px;
    }
    .wayContent .rulecontent .rulesone {
      line-height: 24px;
    }
    .wayContent .rulecontent .rulesone .tip {
      font-size: 12px;
      color: #999999;
      margin: 13px 0 0 0;
    }
    .wayContent .rulecontent .rulesone .finaltip {
      margin-bottom: 44px;
    }
    .wayContent .rulecontent .rulesone .red {
      color: #ff8282;
    }
    .wayContent .rulecontent .rulesone img {
      width: 100%;
    }
    .wayContent .ruleUl {
      padding: 0 40px 0 10px;
      line-height: 24px;
    }
  `;
  return (
    <div className={cx(cls)}>
      <div className="wayContent">
        <div>
          <p className="title">一、跨境知道”K”的含义</p>{" "}
          <div className="rulecontent">
            <p className="subtitle">1.什么是跨境“K”</p>{" "}
            <p className="rulesone">
              跨境K是跨境知道会员的别称，分为K1-K7不同等级，数字越高代表等级越高，在跨境知道K圈平台上的人气和威望也越高，不同等级用户的权限也相应不同。
              <span className="red">
                新注册用户为初学者，需要积分达到1000以后才能成为跨境“K”。
              </span>
            </p>
          </div>{" "}
          <div className="rulecontent">
            <p className="subtitle">2.级别高低对于跨境“K”的含义</p>
          </div>{" "}
          <div className="ruleUl">
            <ul>
              <li>
                可设置自我级别下的等级阅读权限，级别高的用户可以免费看级别低的用户的限制阅读文章；
              </li>{" "}
              <li>高“K”等级可免费下载低于自己“K”等级用户上传的资源；</li>{" "}
              <li>等级越高的用户文章审核会更加优先处理；</li>{" "}
              <li>
                高级别的跨境“K”的文章会更加优先推荐到跨境知道首页的“跨境风向标”获得更多的流量与跨境指数（指数获取方法请见下方“指数计算规则”）！
              </li>
            </ul>
          </div>{" "}
          <div className="rulecontent">
            <p className="subtitle">3.“K”等级与积分的关系</p>{" "}
            <div className="rulesone">
              {" "}
              <img src={"/asset/image/rule1.png"} />{" "}
              <p className="tip red">
                *注：每升到下一级别，积分会归0,
                例如:达到10000积分，由K2自动升级成K3等级，积分归0，并享受K3等级相关权益（如2描述）。
              </p>
            </div>
          </div>
        </div>{" "}
        <div>
          <p className="title">二、跨境知道积分规则</p>{" "}
          <div className="rulecontent">
            <p className="rulesone">
              积分主要用于：资源工具兑换、提问区获得答案、直播回放及课程兑换、跨境知道相关产品服务折扣兑换、陆续开发中！
              （用户下载此资源时支付的积分将由发布者得到，所以如果发布一个非常稀缺且有用的资源，可能就是你源源不断的积分来源哦！）
            </p>
          </div>{" "}
          <div className="rulecontent">
            <div className="rulesone">
              <img src={"/asset/image/rule2.png"} />{" "}
              <p className="tip red">
                *注：用户下载此资源时支付的积分将由发布者得到，所以如果发布一个非常稀缺且有用的资源，可能就是你源源不断的积分来源哦！
              </p>
            </div>
          </div>
        </div>{" "}
        <div>
          <p className="title">三、跨境知道勋章规则</p>{" "}
          <div className="rulecontent">
            <div className="rulesone">
              <img src={"/asset/image/rule3.png"} />
            </div>
          </div>
        </div>{" "}
        <div>
          <p className="title">四、跨境指数规则</p>{" "}
          <div className="rulecontent">
            <div className="rulesone">
              <img src={"/asset/image/rule4.png"} />{" "}
              <p className="tip">
                我们会邀请站内站外一些朋友作为特邀作者入驻，获得邀请的标准很简单——热衷分享与帮助他人答疑，运营小姐姐就会盯上你！
              </p>
            </div>
          </div>
        </div>{" "}
        <div>
          <p className="title">五、指数作者名衔</p>{" "}
          <div className="rulecontent">
            <div className="rulesone">
              <img src={"/asset/image/rule5.png"} />{" "}
              <p className="tip finaltip">
                江湖之大，人海茫茫，少年郎，我看你骨骼惊奇，是个做跨境电商的好苗子。这本《K圈积分秘籍》我就赠与你，抓住精髓勤奋苦练，有朝一日跨境圈将有你的一席之地，到时不要忘记扶持后辈，维持江湖之稳！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About2;
