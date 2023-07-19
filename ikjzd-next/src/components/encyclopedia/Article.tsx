import React from "react";
import ArticleVo from "@/vo/Article";
import LazyLoad from "react-lazyload";

const Article: React.FC<ArticleVo> = ({ thumbPicUrl, title, createdAt }) => {
    return (
        <div
            className={"grid gap-[15px]"}
            style={{ gridTemplateColumns: "149px 1fr" }}
        >
            <LazyLoad height={192}>
                <div className="br-a-[4px] w-[150px] h-[95px] hidden flex row-center colume-center">
                    <img
                        className={"scale-[1.05] w-[100%]"}
                        src={thumbPicUrl}
                    />
                </div>
            </LazyLoad>
            <div className={"flex flex-column colume-between"}>
                <p className="ma-[0px] color-[#222222] lc-2">{title}</p>
                <p className="ma-[0px] color-[#999999]">{createdAt}</p>
            </div>
        </div>
    )
}

export default Article;