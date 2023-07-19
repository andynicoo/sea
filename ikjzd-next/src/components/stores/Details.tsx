import ArticleVo from "@/vo/Article";
import { Button, Card, Col, Modal, Row } from "antd";
import Link from "next/link";
import React, { useContext } from "react";
import createEmotion from "@emotion/css/create-instance";
import Commens from "@/components/Commens";
import { StoresDetailsVO } from "@/vo/Stores";
import Article from "@/vo/Article";

const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-cs-articles-details`,
});
export interface ArticleDetailsPageProps {
  article: StoresDetailsVO;
  InvestmentArticles: ArticleVo[];
  RelatedArticles: ArticleVo[];
  /**热门文章 */
  commends?: Article[];
}

export interface StoreDetailsContextProps extends ArticleDetailsPageProps {}

export const StoreDetailsContext =
  React.createContext<StoreDetailsContextProps>({} as StoreDetailsContextProps);

/**主体内容 */
export const StoreDetailsContent: React.FC = () => {
  const { article, InvestmentArticles } = useContext(StoreDetailsContext);
  const storeDetailsHead = css`
    display: flex;
    dd {
      margin-left: 20px;
      color: #999;
      h1 {
        color: #222;
        font-size: 24px;
        max-width: 600px;
        margin-bottom: 5px;
      }
      p {
        padding: 10px 0 30px;
        font-size: 12px;
        span {
          color: #1072c6;
          font-size: 12px;
        }
      }
    }
  `;
  const storeDetailsBottom = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7f7f7;
    height: 84px;
    padding: 20px;
    > div {
      font-size: 18px;
      color: #222;
      p {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
        span {
          font-size: 12px;
          color: #1072c6;
        }
      }
    }
  `;
  const investmentPoliciesList = css`
    text-align: center;
    padding: 10px;
    div {
      font-size: 16px;
      color: #222;
      margin: 5px 0;
      &:hover {
        color: #f676a6;
      }
    }
    p {
      color: #999;
    }
  `;
  const kjzdArticlesContent = css`
    padding: 40px 20px;
    color: #666;
    b,
    strong {
      font-weight: bolder;
    }
    p {
      margin: 20px 0;
      font-size: 16px;
      line-height: 30px;
    }
    ol,
    ul,
    li {
      list-style: none;
    }
  `;
  const openShopTxt = (
    <div className={"text-center"}>
      <img src="/asset/image/qr-code/2022-11-28/kd.jpeg" width={200} />
      <p>打开微信使用“扫一扫”即可添加跨境知道服务号，助你快速开店</p>
    </div>
  );
  const openShop = () => {
    Modal.success({
      className: "open-shop-modal",
      width: 300,
      title: "我要开店",
      content: openShopTxt,
    });
  };
  return (
    <>
      <Card bordered={false}>
        <dl className={storeDetailsHead}>
          <dt>
            <img
              src={article.thumbPicUrl}
              alt="图片不见了"
              className="w-[360px] h-[240px]"
            />
          </dt>
          <dd>
            <h1>{article.title}</h1>
            <div>{article.description}</div>
            <p>
              <span>{article.registerUrlTime}</span>下发注册链接
            </p>
            <Button
              onClick={openShop}
              type="primary"
              size="large"
              className="w-[200px]"
            >
              我要开店
            </Button>
          </dd>
        </dl>
        <div
          // className={"rich-text"}
          className={kjzdArticlesContent}
          dangerouslySetInnerHTML={{
            __html: article.platformDetails as string,
          }}
        />
        <div className={storeDetailsBottom}>
          <div>
            {article.title}
            <p>
              <span>{article.registerUrlTime}</span>下发注册链接
            </p>
          </div>
          <Button
            onClick={openShop}
            type="primary"
            size="large"
            className="float-right w-[160px]"
          >
            我要开店
          </Button>
        </div>
      </Card>
      <Card title="招商政策" className="mt-[10px]">
        <Row>
          {InvestmentArticles.map((item) => (
            <Col key={item.id} span={8} className={investmentPoliciesList}>
              <Link href={`/articles/${item.id}`}>
                <a target={"_blank"}>
                  <img src={item.thumbPicUrl} className="w-[240px] h-[130px]" />
                  <div className="lc-1">{item.title}</div>
                  <p className="lc-2">{item.description}</p>
                </a>
              </Link>
            </Col>
          ))}
        </Row>
      </Card>
      <div className="mt-[10px]">
        <Commens type={6} />
      </div>
    </>
  );
};

/**相关文章 */
export const RecommendedArticle: React.FC = () => {
  const { RelatedArticles } = useContext(StoreDetailsContext);
  const cls = css`
    font-size: 18px;
    color: #10111c;
  `;
  const articlesItem = css`
    h3 {
      color: #222;
      font-size: 16px;
      margin-top: 20px;
      &:hover {
        color: #f676a6;
      }
    }
    p {
      margin-top: 5px;
      color: #999;
      font-size: 12px;
      span {
        color: #999;
        padding-right: 20px;
      }
    }
  `;
  return (
    <Card bordered={false}>
      <p className={cls}>相关文章</p>
      <Row gutter={[16, 16]}>
        <Col>
          {RelatedArticles.map((item) => (
            <Link key={item.id} href={`/articles/${item.id}`}>
              <a className={articlesItem} target={"_blank"}>
                <h3 className="lc-2">{item.title}</h3>
                <p>
                  <span>{item.author}</span>
                  {item.updatedAt}
                </p>
              </a>
            </Link>
          ))}
        </Col>
      </Row>
    </Card>
  );
};
