import ArticleVo, { ArticleDetails } from "@/vo/Article";
import { Avatar, Card, Col, Divider, message, Row, Space, Tag } from "antd";
import Link from "next/link";
import React, { Key, useContext, useEffect, useState } from "react";
import Article from "@/components/encyclopedia/Article";
import HotArticle from "@/components/encyclopedia/HotArticle";
import HotCourse, { HotCourseProps } from "@/components/encyclopedia/HotCourse";
import { range } from "lodash";
import Icon from "@/components/Icon";
import createEmotion from "@emotion/css/create-instance";
import { operateCollect, operateCollectCancel, operatePraise, operatePraiseCancel } from "@/apis/public";
import Authorization from "../Authorization";
import QrCode from "@/components/QrCode";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-articles-details` });
export interface ArticleDetailsPageProps {
    article: ArticleDetails;
    commends: ArticleVo[];
}

export interface ArticleDetailsContextProps extends ArticleDetailsPageProps {

}

export const ArticleDetailsContext = React.createContext<ArticleDetailsContextProps>({} as ArticleDetailsContextProps);

/**主体内容 */
export const ArticleDetailsContent: React.FC = () => {
    const ctx = useContext(ArticleDetailsContext);

    const [article, setArticle] = useState(ctx.article);

    useEffect(() => {
        setArticle(ctx.article);
    }, [ctx.article]);

    const { isPraise, praiseNum, isCollection, collectNum } = article;

    const onShare = () => {
        QrCode.modal({
            content: window.location.href
        })
    }

    return (
        <Card bordered={false} className={"mb-[20px]"}>
            <h1 className="fs-[28px] fw-500 color-[#000000e6] mb-[20px] lc-2">
                {article.title}
            </h1>

            <Space className="mb-[30px]" size={20}>
                <Space>
                    <Link href={`/users/index/${article.user?.userId}`}>
                        <a target={'_blank'}>
                            <Avatar src={article.user?.avatar} />
                            <span className="mx-[10px]">{article.user?.nick}</span>
                            <span>{article.updatedAt}</span>
                        </a>
                    </Link>
                </Space>
                <Space size={5} className="fs-[12px] color-[#999999]">
                    <Icon type={"icon-yanjing"} className="fs-[16px]" />
                    {article.readNum}
                </Space>

                <LikeCollection
                    isPraise={isPraise}
                    praiseNum={praiseNum}
                    isCollection={isCollection}
                    collectNum={collectNum}
                    otherId={article.id}
                    position={"top"}
                    onChange={(value) => setArticle({ ...article, ...value })}
                />

                <Space size={5} className="fs-[12px] color-[#999999]">
                    <a href="#commenList"> <Icon type={"icon-pinglun"} className="fs-[16px]" />
                        {article.commentNum}
                    </a>
                </Space>
            </Space>

            <p className="bg-color-[#f8f8f8] pa-[20px] mb-[20px] fs-[16px]">
                <img className="block" src={"/asset/image/icon/article-title.png"} />
                {article.description}
            </p>

            <img src={article.thumbPicUrl} className={"w-[100%] mb-[20px]"} />

            <div
                className={"rich-text"}
                dangerouslySetInnerHTML={{ __html: article.content as string }}
            />

            <LikeCollection
                isPraise={isPraise}
                praiseNum={praiseNum}
                isCollection={isCollection}
                collectNum={collectNum}
                otherId={article.id}
                onChange={(value) => setArticle({ ...article, ...value })}
            />

            <div className="flex row-center colume-between color-[#999999]">
                <div>
                    {article.articleTagName?.map(({ name, id }) => (
                        <Tag className="px-[10px] py-[5px] border-none" key={id}>{name}</Tag>
                    ))}
                </div>
                <div>
                    <span>
                        <span>评论</span>
                        <Icon type={"icon-pinglun"} className={"mx-[5px]"} />
                        {article.commentNum}
                    </span>
                    <Divider type={"vertical"} className={"mx-[20px]"} />
                    <a onClick={onShare}>
                        分享至
                        <Icon type={"icon-logo-wechat"} className={"mx-[5px]"} />
                    </a>
                </div>
            </div>
        </Card>
    )
}

/**推荐文章 */
export const RecommendedArticle: React.FC<{ articles: ArticleVo[] }> = ({ articles }) => {
    return (
        <Card
            bordered={false}
            title={"您可能感兴趣的文章"}
            className={"mb-[20px]"}
        >
            <Row gutter={[15, 25]}>
                {articles.map((article) => (
                    <Col span={12} key={article.id}>
                        <Link
                            as={`/articles/${article.id}`}
                            href={"/articles/[id]"}
                        >
                            <a>
                                <Article {...article} />
                            </a>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Card>
    )
}

/** 热门文章 */
export const HotArticles: React.FC<{ articles: ArticleVo[], className?: string }> = ({ articles, className }) => {
    return (
        <Card
            bordered={false}
            title={"热门文章"}
            className={cx(className, "mb-[20px]")}
        >
            <Space
                direction={"vertical"}
                size={15}
                className={"w-[100%]"}
            >
                {articles.map((article, index) => (
                    <Link
                        href={"/articles/[id]"}
                        as={`/articles/${article.id}`}
                        key={article.id}
                    >
                        <a target={"_blank"}>
                            <HotArticle {...article} index={index + 1} />
                        </a>
                    </Link>
                ))}
            </Space>
        </Card>
    )
}

/**热门课程 */
export const HotCourses: React.FC = () => {
    const courses: HotCourseProps[] = range(10).map(() => ({
        img: "https://static.ikjzd.com/kjzd/2022-04-14/20220414190637108132.png",
        name: "广告误区和优化实操",
        count: 462,
        price: "免费"
    }))

    return <Card bordered={false} title={"热门课程"}>
        {courses.map((item, index) => (
            <HotCourse {...item} key={index} />
        ))}
    </Card>
}

/**点赞收藏 */

interface LikeCollectionStatus {
    isPraise?: boolean;
    praiseNum?: number;
    isCollection?: boolean;
    collectNum?: number;
}
interface LikeCollectionProps extends LikeCollectionStatus {
    position?: "top" | "bottom";
    onChange?: (status: LikeCollectionStatus) => void;
    type?: Key;
    otherId: Key;
    collectShow?: boolean;

}
export const LikeCollection: React.FC<LikeCollectionProps> = (props) => {
    const { position, onChange, type, otherId, collectShow, ...args } = props;
    /**点赞 */
    const onPeratePraise = async (isPraise: boolean) => {
        if (!onChange) return;
        if (isPraise) {
            await operatePraiseCancel({ type: type as Key, otherId });
            onChange({ ...args, isPraise: false, praiseNum: Number(args.praiseNum) - 1 });
            message.success("取消点赞");
        } else {
            await operatePraise({ type: type as Key, otherId });;
            onChange({ ...args, isPraise: true, praiseNum: Number(args.praiseNum) + 1 });
            message.success("点赞成功");
        }
    }
    /**收藏 */
    const onCollection = async (isCollection: boolean) => {
        if (!onChange) return;
        if (isCollection) {
            await operateCollectCancel({ type: type as Key, otherId });;
            onChange({ ...args, isCollection: false, collectNum: Number(args.collectNum) - 1 });
            message.success("取消收藏");
        } else {
            await operateCollect({ type: type as Key, otherId });;
            onChange({ ...args, isCollection: true, collectNum: Number(args.collectNum) + 1 });
            message.success("收藏成功");
        }
    }

    const operateDiv = css`
        margin: 50px auto 30px;
        text-align: center;
        width: 100%;
        .anticon{
            font-size: 18px;
            position: relative;
            top:1px;
        }
        .operate-div-btn{
            display: inline-block;
            width: 130px;
            line-height: 42px;
            border-radius: 21px;
            text-align: center;
            cursor: pointer;
        }
        .operate-div-btn:first-child {
            background: #ffecf2;
            color: #fa76a6;
            margin-right: 35px;
        }
        .operate-div-btn:last-child {
            background: #fff2da;
            color: #ffa252;
        }
    `

    if (position == "top") {
        return <>
            <Authorization.Valid>
                <Space size={5}
                    onClick={() => onPeratePraise(args.isPraise as boolean)}
                    className={cx("fs-[12px]", "color-[#999999]", "cursor-pointer", { ["color-[#f676a6]"]: args.isPraise },
                    )}
                >
                    <Icon type={"icon-dianzan"} className="fs-[18px]" />
                    {args.praiseNum}
                </Space>
            </Authorization.Valid>
            {collectShow && <Authorization.Valid>
                <Space size={5}
                    onClick={() => onCollection(args.isCollection as boolean)}
                    className={cx(
                        "fs-[12px]", "ml-[20px]", "color-[#999999]", "cursor-pointer",
                        { ["color-[#f676a6]"]: args.isCollection },
                    )}
                >
                    <Icon type={"icon-shoucang"} className="fs-[18px]" />
                    {args.collectNum}
                </Space>
            </Authorization.Valid>}
        </>
    } else {
        return (
            <div className={operateDiv}>
                <Authorization.Valid>
                    <div
                        className="operate-div-btn"
                        onClick={() => onPeratePraise(args.isPraise as boolean)}
                    >
                        <Icon
                            type={args.isPraise ? "icon-aixin" : "icon-aixin1"}
                        />
                        <span className="px-[5px]">赞</span>
                        <span>{args.praiseNum}</span>
                    </div>
                </Authorization.Valid>
                <Authorization.Valid>
                    <div
                        className="operate-div-btn"
                        onClick={() => onCollection(args.isCollection as boolean)}
                    >
                        <Icon type={args.isCollection ? "icon-shoucang1" : "icon-shoucang"} />
                        <span className="px-[5px]">收藏</span>
                        <span>{args.collectNum}</span>
                    </div>
                </Authorization.Valid>
            </div>
        )
    }
}

LikeCollection.defaultProps = {
    type: 1,
    position: "bottom"
}