import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});
import ArticleVo from "@/vo/Article";
import Link from "next/link";

const HotArticle: React.FC<{ hots: ArticleVo[]; className?: string }> = ({
  hots,
  className,
}) => {
  const cls = css`
    padding-left: 15px;
    background: #fff;
    margin-bottom: 12px;
    & .first-article {
      a:hover .title {
        color: #f676a6;
      }
      margin-bottom: 20px;
      a {
        display: block;
        position: relative;
        width: 256px;
        height: 160px;
        img {
          width: 256px;
          height: 160px;
        }
        .top {
          width: 50px;
          height: 22px;
          text-align: center;
          line-height: 22px;
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: #ffffff;
          background: #ff5e34;
          position: absolute;
          top: 0;
          left: 15px;
        }
        .title {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #ffffff;
          line-height: 22px;
          width: 100%;
          padding: 0 14px;
          position: absolute;
          left: 0;
          bottom: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
    .hot-content {
      padding-right: 15px;
      overflow: hidden;
      padding-bottom: 15px;
      li {
        margin-top: 19px;
        a {
          display: flex;
          position: relative;
          .article-img {
            width: 104px;
            height: 70px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .item-text {
            flex: 1;
            height: 70px;
            margin-left: 12px;
            position: relative;
            .text {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #323336;
              line-height: 19px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .time {
              font-size: 12px;
              font-family: MicrosoftYaHei;
              color: #989fb3;
              line-height: 16px;
              position: absolute;
              bottom: 5px;
              left: 0;
            }
          }
          .rank {
            width: 20px;
            height: 14px;
            line-height: 14px;
            text-align: center;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #ffffff;
            position: absolute;
            top: 0;
            left: 5px;
            z-index: 88;
            background: #9d9a99;
          }
        }
        a:hover .text {
          color: #f676a6;
        }
      }
      li:first-child {
        margin-top: 0px;
      }
      li:first-of-type .rank {
        background: #ff7930;
        z-index: 88;
      }
    }
  `;
  let fristHot: ArticleVo[] = hots.slice(0, 1);
  let othertHot: ArticleVo[] = hots.slice(1, 10);
  return (
    <div className={cx(cls)}>
      <div className="title-box">
        <h2>热门文章</h2>
      </div>
      {fristHot.map((item) => (
        <div className="first-article" key={item.id}>
          <Link href={"/articles/[id]"} as={`/articles/${item.id}`}>
            <a>
              <img src={item.thumbPicUrl} alt={item.title} />
              <div className="top">top1</div>
              <div className="title">{item.title}</div>
            </a>
          </Link>
        </div>
      ))}

      <div className="hot-content">
        <ul>
          {/* {hots.map((item,index) => ({ index }))} */}
          {othertHot.map((item, index) => (
            <li key={item.id}>
              <Link href={"/articles/[id]"} as={`/articles/${item.id}`}>
                <a>
                  <div className="article-img">
                    <img src={item.thumbPicUrl} alt={item.title} />
                  </div>
                  <div className="item-text">
                    <div className="text">{item.title}</div>
                    <div className="time">{item.pushTime}</div>
                  </div>
                  <div className="rank">{index + 1}</div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HotArticle;
