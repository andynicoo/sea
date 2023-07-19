import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});
import Link from "next/link";

const HeguiService: React.FC = () => {
  const cls = css`
    padding-left: 15px;
    background: #fff;
    margin-bottom: 12px;
    & ul {
      & li {
        float: left;
        margin-right: 11px;
        margin-bottom: 15px;
        a:hover span {
          color: #f676a6;
        }
        & div {
          position: relative;
        }
        & img {
          width: 124px;
          height: 73px;
        }
        & span {
          position: absolute;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 77px;
          width: 100%;
          top: 0;
          left: 0;
          text-align: center;
        }
      }
    }
  `;
  return (
    <div className={cx(cls)}>
      <div className="hot-article">
        <div className="title-box">
          <h2>合规服务</h2>
        </div>
        <ul className="clearfix">
          <li>
            <a href={"/hegui#海外公司注册"}>
              <div>
                <img
                  src={"/asset/image/flag/chuhai_service1.jpg"}
                  alt={"海外公司注册"}
                />
                <span>海外公司注册</span>
              </div>
            </a>
          </li>
          <li>
            <a href={"/hegui#秘书服务"}>
              <div>
                <img
                  src={"/asset/image/flag/chuhai_service2.jpg"}
                  alt={"秘书服务"}
                />
                <span>秘书服务</span>
              </div>
            </a>
          </li>
          <li>
              <a href={"/hegui#银行开户"}>
                <div>
                  <img
                    src={"/asset/image/flag/chuhai_service3.jpg"}
                    alt={"银行开户"}
                  />
                  <span>银行开户</span>
                </div>
              </a>
          </li>
          <li>
            <a href="/hegui#商标及专利">
              <div>
                <img
                  src={"/asset/image/flag/chuhai_service4.jpg"}
                  alt={"国际商标专利"}
                />
                <span>国际商标专利</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeguiService;
