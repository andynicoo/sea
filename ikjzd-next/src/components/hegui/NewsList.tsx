import createEmotion from "@emotion/css/create-instance";
import { Col, Row, Space } from "antd";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});
import { getArticlePage } from "@/apis/article";
import { PageParams, PageSource } from "@/vo/PageParams";
import { CateListType } from "@/vo/Hegui";
import { useEffect, useState } from "react";
import Article from "@/vo/Article";
import ArticleVo from "@/vo/Article";
import Link from "next/link";

const NewsList: React.FC<{ cateList: CateListType }> = ({ cateList }) => {
  const cls = css`
    background: #ffffff;
    .label {
      height: 61px;
      border-bottom: 1px solid #d4d4d4;
      position: relative;
      span.tit {
        width: 40px;
        height: 4px;
        background: #f676a6;
        position: absolute;
        left: 0;
        bottom: -1px;
      }
    }
    .name {
      font-size: 24px;
      font-weight: 600;
      color: #323336;
      line-height: 60px;
    }
    .more {
      font-size: 14px;
      font-weight: 400;
      color: #828999;
      line-height: 60px;
      cursor: pointer;
    }
    .item-content {
      margin-top: 16px;
      margin-bottom: 22px;
      a {
        display: flex;
      }
      .item-img {
        border-radius: 5px;
        overflow: hidden;
        width: 209px;
        height: 128px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        font-size: 20px;
        margin-bottom: 6px;
        font-weight: 600;
        color: #323336;
        line-height: 28px;
      }
      .text-box {
        margin-left: 17px;
        flex: 1;
      }
      .item-text {
        font-size: 16px;
        font-weight: 400;
        color: #575b66;
        line-height: 26px;
      }
    }
    li {
      height: 44px;
      border-bottom: 1px dotted #d4d4d4;
      line-height: 44px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #828999;
        line-height: 44px;
      }
      .tit{
        flex: 1;
      }
      .time{
        width: 160px;
      }
    }
  `;

  const [source, setSource] = useState<PageSource<Article>>();
  const [one, setOne] = useState<Article>();

  /**文章参数 */
  const articlesParams: PageParams = {
    current: 1,
    size: 5,
    articleType: 1,
    auditStatus: 1,
    articleCategoryId: cateList.id,
  };

  // const articles = (await getArticlePage(articlesParams)).data;

  useEffect(() => {
    getArticlePage(articlesParams).then((res) => {
      setSource(res.data);

      if (res.data.records.length) {
        setOne(res.data.records[0]);
      }
    });
  }, []);

  return (
    <div className={cx(cls, "mb-[50px]")}>
      <div className="label">
        <div className="name float-left">{cateList.name}</div>
        <div className="more float-right">
          <Link href={`/hegui/article?id=${cateList.id}`}>
            <a>查看更多 </a>
          </Link>
        </div>
        <span className="tit"></span>
      </div>
      <div className="item-content">
        <Link href={"/articles/[id]"} as={`/articles/${one?.id}`}>
          <a>
            <div className="item-img">
              <img src={one?.thumbPicUrl} alt={one?.title} />
            </div>
            <div className="text-box">
              <div className={cx(cls, "title lc-1")}>{one?.title}</div>
              <div className="item-text lc-3">{one?.description}</div>
            </div>
          </a>
        </Link>
      </div>

      <ul>
        {source?.records?.slice(1, 5).map((item, index) => (
          <li key={item.id}>
            <Link href={"/articles/[id]"} as={`/articles/${item?.id}`}>
              <a className="flex" title={item.title}>
                <span className="tit lc-1">{item.title}</span>
                <span className="float-right time">{item.updatedAt}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;
