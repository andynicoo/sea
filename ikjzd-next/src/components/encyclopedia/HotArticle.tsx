import React from "react";
import Article from "@/vo/Article";
import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-encyclopedia-hot-article` });

/**
 * 热门文章组件
 */
const HotArticle: React.FC<Article & { index: number }> = (props) => {
    let { index, title, thumbPicUrl } = props;
    const active = index <= 3;

    const cls = css`
        position: relative;
        display: grid;
        grid-template-columns: 18px 1fr;
        margin-bottom: 10px;
        gap: 10px;
        min-height: 22px;

        &:last-child {
            margin: 0;
        }

        p {
            margin-bottom: 0;
            max-height: 40px;
        }

        &[data-has-img="true"] {
            grid-template-columns: 104px 1fr;
        }
    `;

    const indexCls = css`
        &>img {
            width: 104px;
            height: 70px;
            border-radius: 4px;
            margin-top: 2px;
        }

        &>span {
            background-color: #B7B7B7;
            width: 18px;
            height: 18px;
            display: block;
            text-align: center;
            line-height: 18px;
            color: #fff;
            font-size: 12px;
            border-radius: 2px;
            position: absolute;
            left: 0;
            top: 2px;

            &[data-active="true"] {
                background-color: ${process.env.PRIMARY_COLOR};
            }
        }
    `;

    return <div data-has-img={!!thumbPicUrl} className={cls}>
        <div className={indexCls}>
            {thumbPicUrl && <img src={thumbPicUrl} width={104} />}
            <span data-active={active}>
                {index}
            </span>
        </div>
        <p className="lc-2">{title}</p>
    </div>
}

export default HotArticle;