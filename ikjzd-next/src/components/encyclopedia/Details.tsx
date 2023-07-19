import ArticleVo from "@/vo/Article";
import Encyclopedia, { EncyclopediaCategory, EncyclopediaHot } from "@/vo/Encyclopedia";
import { Button, Card, Col, List, Row, Space, Tabs } from "antd";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import HotArticleComponent from "@/components/encyclopedia/HotArticle";
import { range } from "lodash";
import HotInvitationComponent, { HotInvitationProps } from "@/components/encyclopedia/HotInvitation";
import HotCourseComponent, { HotCourseProps } from "./HotCourse";
import Article from "@/components/encyclopedia/Article";
import createEmotion from "@emotion/css/create-instance";
import Icon from "@/components/Icon";
import QrCode from "@/components/QrCode";
import { useRouter } from "next/router";
import { Bbs } from "@/vo/Bbs";
import { LikeCollection } from "@/components/articles/Details";
import moment from "moment";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-encyclopedia-details` });

/**banner 图 */
export const Banner: React.FC<{ src: string }> = ({ src }) => {
    return <Card bordered={false}>
        <img className={"w-[100%] h-[140px]"} src={src} />
    </Card>
}

/**词条信息 */
export const WordInfo: React.FC<{ detail: Encyclopedia }> = ({ detail }) => {
    return <Card
        title={"词条信息"}
        bordered={false}
    >
        <p className="mb-[10px]">
            <span className="mr-[10px]">创作者:</span>
            <Link href={"/users/index/[id]"} as={`/users/index/${detail.userId}`}>
                <a className="color-[#1072c6]">
                    {detail.createAuthor}
                </a>
            </Link>
        </p>
        <p className="mb-[10px]">
            <span className="mr-[10px]">编辑次数:</span>
            <span className="mr-[10px]">{detail.editNum}</span>
        </p>
        <p className="mb-[10px]">
            <span className="mr-[10px]">词条浏览:</span>
            <span className="mr-[10px]">{detail.readNum}</span>
        </p>
        <p className="ma-[0px]">
            <span className="mr-[10px]">最近更新者:</span>
            <Link href={"/users/index/[id]"} as={`/users/index/${detail.userId}`}>
                <a className="color-[#1072c6] mr-[5px]">
                    {detail.updateAuthor}
                </a>
            </Link>
            ({moment(detail.updatedAt).format("YYYY-MM-DD")})
        </p>
    </Card>
}

/**热门词条 */
export const HotWords: React.FC = () => {

    interface Word {
        id: number;
        text: string;
    }

    const words: Word[] = [
        { id: 397, text: "谷歌趋势（Google Trends）" },
        { id: 518, text: "FedEx" },
        { id: 1307, text: "雨果网" },
        { id: 1308, text: "知无不言" },
        { id: 1533, text: "芒果店长" },
        { id: 1547, text: "菜鸟网络" },
        { id: 1549, text: "转运中国" },
        { id: 1993, text: "Pimeyes" },
        { id: 2026, text: "DMM" },
        { id: 2390, text: "旺店通" },
        { id: 2539, text: "海鹰数据" },
        { id: 2791, text: "德邦物流" },
        { id: 3253, text: "积加ERP" },
        { id: 3374, text: "Tiktok Shop" },
        { id: 3551, text: "YouTube" },
    ]

    return <Card title={"热门词条"} bordered={false}>
        <Space wrap size={12}>
            {words.map(({ text, id }) => (
                <Button
                    key={id}
                    className={"color-[#555555] bg-color-[#f5f5f5]"}
                    type="link"
                >
                    {text}
                </Button>
            ))}
        </Space>
    </Card>
}

/**热门文章 */
export const HotArticle: React.FC<{ articles: ArticleVo[] }> = ({ articles }) => {
    return <Card title={"热门文章"} bordered={false}>
        {articles.map((article, index) => (
            <Link
                href={`/articles/[id]`}
                as={`/articles/${article.id}`}
                key={article.id}
            >
                <a>
                    <HotArticleComponent
                        key={article.id}
                        index={index + 1}
                        {...article}
                    />
                </a>
            </Link>
        ))}
    </Card>
}

/**热门帖子 */
export const HotInvitations: React.FC<{ hots: Bbs[] }> = ({ hots }) => {

    return (
        <Card
            title={"热门帖子"}
            bordered={false}
            className={"mb-[20px]"}
        >
            <List<Bbs>
                dataSource={hots}
                renderItem={(item) => (
                    <List.Item>
                        <HotInvitationComponent {...item} />
                    </List.Item>
                )}
            />
        </Card>
    )
}

/**热门课程 */
export const HotCourse: React.FC = () => {

    const courses: HotCourseProps[] = range(10).map(() => ({
        img: "https://static.ikjzd.com/kjzd/2022-04-14/20220414190637108132.png",
        name: "广告误区和优化实操",
        count: 462,
        price: "免费"
    }))

    return <Card
        title={"热门课程"}
        bordered={false}
    >
        {courses.map((item, index) => (
            <HotCourseComponent {...item} key={index} />
        ))}
    </Card>
}

/**详情 */
export const Details: React.FC<{ detail: Encyclopedia }> = ({ detail }) => {

    const router = useRouter();

    const cls = css`
        border-bottom: 1px solid #eee;
    `;

    const likeCls = css`
        background: #ffecf2 !important;
        box-shadow: none;
    `;

    const collectCls = css`
        background: #fff2da !important;
        box-shadow: none;
        color: #ffa252 !important;
    `;

    const href = `${process.env.CLIENT_API_URL}${router.asPath}`
    const [article, setArticle] = useState(detail);
    const { isPraise, praiseNum, isCollection, collectNum } = article;
    return (
        <Card bordered={false}>
            <div className={"flex space-between row-end mb-[35px]"}>
                <div>
                    <h1 className="inline-block ma-[0px] fs-[28px] color-[#1d1d1b]">
                        {detail.title}
                    </h1>
                    <p className="inline-block ma-[0px] ml-[10px]">
                        <span>[</span>
                        <Link
                            href={"/w/[id]/edit"}
                            as={`/w/${detail.id}/edit`}
                        >
                            <a className="color-[#1072c6]">编辑</a>
                        </Link>
                        <span>]</span>
                    </p>
                </div>
                <Space className={"ma-[0px]"} size={20}>
                    <LikeCollection
                        isPraise={isPraise}
                        praiseNum={praiseNum}
                        isCollection={isCollection}
                        collectNum={collectNum}
                        otherId={article.id}
                        position={"top"}
                        collectShow={true}
                        type={5}
                        onChange={(value) => setArticle({ ...article, ...value })}
                    />
                </Space>
            </div>
            <div>{detail.summary}</div>
            <DetailsTitleBaseInfo detail={detail} />
            <div
                dangerouslySetInnerHTML={{ __html: detail.content }}
                className={"rich-text"}
            />
            <p className={cx("fs-[18px] fh-[50px] color-[#1d1d1d] mt-[20px]", cls)}>参考资料</p>
            <ul className={cx(cls, "py-[10px]")}>
                {detail.refer?.map(({ title, url, source }, index) => (
                    <li key={index} className={"color-[#777777] fs-[12px] fh-[30px]"}>
                        <a
                            href={url}
                            target={"_blank"}
                        >
                            {index + 1}、{title} {source}
                        </a>
                    </li>
                ))}
            </ul>

            <div className="text-center my-[30px]">
                <Space size={20}>
                    <LikeCollection
                        isPraise={isPraise}
                        praiseNum={praiseNum}
                        isCollection={isCollection}
                        collectNum={collectNum}
                        otherId={article.id}
                        type={5}
                        onChange={(value) => setArticle({ ...article, ...value })}
                    />
                </Space>
            </div>
            <p className="color-[#999999] fs-[12px] fh-[24px]">
                免责声明：词条为作者独立观点，不代表跨境知道立场。如有侵权，请联系我们。
                <a
                    className="float-right flex row-center color-[#999999] fs-[12px] fh-[24px]"
                    onClick={() => QrCode.modal({ content: href })}
                >
                    分享至
                    <Icon className="fs-[24px] ml-[10px]" type={"icon-logo-wechat"} />
                </a>
            </p>
        </Card>
    )
}

/**百科标题 */
// export const DetailsTitle: React.FC<{ detail: Encyclopedia }> = ({ detail }) => {
//     const [article, setArticle] = useState(detail);
//     const { isPraise, praiseNum, isCollection, collectNum } = article;
//     return <div className={"flex space-between row-end mb-[35px]"}>
//         <div>
//             <h1 className="inline-block ma-[0px] fs-[28px] color-[#1d1d1b]">
//                 {detail.title}
//             </h1>
//             <p className="inline-block ma-[0px] ml-[10px]">
//                 <span>[</span>
//                 <Link
//                     href={"/w/[id]/edit"}
//                     as={`/w/${detail.id}/edit`}
//                 >
//                     <a className="color-[#1072c6]">编辑</a>
//                 </Link>
//                 <span>]</span>
//             </p>
//         </div>
//         <Space className={"ma-[0px]"} size={20}>
//             <LikeCollection
//                 isPraise={isPraise}
//                 praiseNum={praiseNum}
//                 isCollection={isCollection}
//                 collectNum={collectNum}
//                 otherId={article.id}
//                 position={"top"}
//                 onChange={(value) => setArticle({ ...article, ...value })}
//             />
//         </Space>
//     </div>
// }

/**百科基本信息拦 */
export const DetailsTitleBaseInfo: React.FC<{ detail: Encyclopedia }> = ({ detail }) => {

    const colCls = css`
        width: 100%;
        margin: 40px auto 20px;
        dd{
            border-bottom: 1px dashed #ededed;
            display: inline-block;
            color: #999;
            font-size: 14px;
            line-height: 42px;
            width: 40%;
        }
        dd:nth-child(even){
            width: 60%;
        }
    `;

    return <Row className={"color-[#999999] mb-[20px]"}>
        <dl className={colCls}>
            {detail.baseInfo?.map((info, index) => {
                return <React.Fragment key={index}>
                    <dd>{info.title}</dd>
                    <dd>{info.content}</dd>
                </React.Fragment>

            })}
        </dl>
    </Row >
}

/**文章 */
export const Articles: React.FC<{ articles: ArticleVo[] }> = ({ articles }) => {
    return <Card bordered={false}>
        <h2 className={"fs-[18px] mb-[20px]"}>
            您可能感兴趣的文章
        </h2>
        <Row gutter={[15, 25]}>
            {articles.map((article, index) => (
                <Col span={12} key={index}>
                    <Link
                        href={`/articles/${article.id}`}
                    >
                        <a>
                            <Article {...article} />
                        </a>
                    </Link>
                </Col>
            ))}
        </Row>
    </Card>
}

/**词条Tab */
export const WordTabs: React.FC<{ hots: EncyclopediaHot[]; news: EncyclopediaCategory[] }> = ({ hots, news }) => {
    const [tabKey, setTabKey] = useState<string>("new_words");

    const cls = css`
        &::before {
            content: "";
            display: inline-block;
            width: 4px;
            height: 4px;
            background-color: #D8D8D8;
            margin: 0 5px;
            transition: all 0.3s;
        }
    `;

    return <Card bordered={false}>
        <Tabs activeKey={tabKey} onChange={setTabKey}>
            <Tabs.TabPane tab={"最新词条"} key={"new_words"}>
                <Row gutter={[16, 16]}>
                    {news.map((word, index) => (
                        <Col span={6} key={index}>
                            <Link href={"/w/[id]"} as={`/w/${word.id}`}>
                                <a className={cx(cls, "flex row-center lc-1")}>
                                    {word.title}
                                </a>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab={"热门词条"} key={"hot_words"}>
                <Row gutter={[16, 16]}>
                    {hots.map((word, index) => (
                        <Col key={index} span={6}>
                            <Link href={"/w/[id]"} as={`/w/${word.id}`}>
                                <a className={cx(cls, "flex row-center lc-1")}>
                                    {word.encyclopediaName}
                                </a>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Tabs.TabPane>
        </Tabs>
    </Card>
}