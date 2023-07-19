import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});
import Link from "next/link";
import { TagsCategory } from "@/vo/Article";

const HotTags: React.FC<{ tags: TagsCategory[] }> = ({ tags }) => {
  const cls = css`
    background: #fff;
    padding-left: 15px;

    ul {
      li {
        margin-right: 12px;
        margin-bottom: 15px;

        a {
          display: block;
          padding: 0 12px;
          border-radius: 1px;
          border: 1px solid #eaeaea;
          line-height: 32px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #323336;
        }
      }
    }
  `;

  return (
    <div className={cx(cls)}>
      <div className="hot-tag">
        <div className="title-box">
          <h2>热门标签</h2>
        </div>
        <ul className="inline-block">
          {tags.map((item) => (
            <li className="float-left" key={item.id}>
              {/* <Link href={"/articles/[id]"} as={`/articles/${item.id}`}> */}
              <a>{item.name}</a>
              {/* </Link> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HotTags;
