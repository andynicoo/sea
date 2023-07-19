import { Button, Card, Col, List, Row, Space, Pagination, Avatar } from "antd";
import React, { Fragment, Key, useContext } from "react";
import { NextPage } from "next";
import { getEncyclopediaCategoryList, getEncyclopediaContribution, getEncyclopediaSource, getEncyclopediaStatistics, getEncyclopediaTop } from "@/apis/encyclopedia";
import { CustomNextPageContext } from "@/pages/_app";
import Link from "next/link";
import { EncyclopediaCategory } from "@/vo/Encyclopedia";
import { range, slice } from "lodash";
import HotArticleComponent from "@/components/encyclopedia/HotArticle";
import Contribution from "@/components/encyclopedia/Contribution";
import { useRouter } from "next/router";
import { PageParams, PageSource } from "@/vo/PageParams";
import { setEncyclopediaCategorys } from "@/redux/actions/encyclopediaActions";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import Article from "@/vo/Article";
import { getArticlePage } from "@/apis/article";
import Icon from "@/components/Icon";
import createEmotion from "@emotion/css/create-instance";
import Authorization from "@/components/Authorization";
import { ContributionUser } from "@/vo/Users";
import { cx } from "@emotion/css";
import Container from "@/components/Container";
import SeoHead from "@/components/SeoHead";
import { MinHead } from "@/components/Header";
import Footer from "@/components/Footer";
import { pageAd } from "@/apis/home";
import { Advert } from "@/vo/Basic";
import { Adverts } from "../articles/[id]";
import moment from "moment";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-encyclopedia-words-index` });

interface EncyclopediaPageContentProps extends EncyclopediaPageProps {
}

const EncyclopediaPageContent = React.createContext<EncyclopediaPageContentProps>({} as EncyclopediaPageContentProps);

interface StatisticsProps {
    totalEncyclopedia: number;
    totalUser: number;
}
interface EncyclopediaPageProps {
    dataSource: PageSource<EncyclopediaCategory>;
    articles: Article[];
    contributions: ContributionUser[];
    hots: EncyclopediaCategory[];
    statistics: StatisticsProps;
    tops: EncyclopediaCategory[];
    ads2: Advert[];
}

const EncyclopediaPage: NextPage<EncyclopediaPageProps> = (props) => {

    const ctxValue: EncyclopediaPageContentProps = {
        ...props
    }

    return (
        <EncyclopediaPageContent.Provider value={ctxValue}>
            <SeoHead
                title="跨境百科_跨境行业权威百科全书"
                keyword="跨境百科,跨境行业名词解释,跨境百科全书"
                description="跨境百科是以打造跨境行业百科全书为使命,内容开放、自由的跨境行业垂直领域内容平台,解释跨境行业众多的专业名词,解释跨境行业众多的专业名词,帮助用户更快的切入跨境电商行业"
            />

            <MinHead />

            {/* 顶部统计,banner */}
            <StatisticsTop />

            <Container className="py-[20px]">
                <Row gutter={[16, 16]}>
                    <Col span={17}>
                        <SourceList />
                    </Col>
                    <Col span={7}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Adverts adverts={props.ads2} pageName={'跨境百科右边栏广告位'} />
                                <HotArticle />
                            </Col>
                            <Col span={24}>
                                <Contributions />
                            </Col>
                            <Col span={24}>
                                <HotWords hots={props.hots} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </EncyclopediaPageContent.Provider>
    )
}

EncyclopediaPage.getInitialProps = async (ctx: CustomNextPageContext) => {
    const { current, size, category, initials } = (ctx.query || {}) as PageParams;
    const dataSource = (await getEncyclopediaSource({ current, size:20, encyclopediaCategoryId: category, initials })).data;
    const hots = (await getEncyclopediaSource({ current: 1, size: 10, order: "DESC", sort: "read_num" })).data.records;
    const articles = (await getArticlePage({ current: 1, size: 10 })).data.records;
    const contributions = (await getEncyclopediaContribution()).data;
    const statistics = (await getEncyclopediaStatistics()).data;
    const tops = (await getEncyclopediaTop()).data;
    /**右侧广告 */
    const ads2 = (await pageAd({ adSiteKey: "ba_dvert" })).data.records;
    const state = ctx.reduxStore.getState();
    let categorys = state?.encyclopediaReducer.encyclopediaCategorys;
    if (!categorys) {
        categorys = (await getEncyclopediaCategoryList()).data;
        setEncyclopediaCategorys(categorys)(ctx.reduxStore.dispatch);
    }
    return {
        dataSource,
        articles,
        contributions,
        hots,
        statistics,
        tops,
        ads2
    }
}

export default EncyclopediaPage;

/**获取26个英文字母大写 */
const enChaCode: EncyclopediaCategory[] = range(65, 91)
    .map((index) => String.fromCharCode(index))
    .map((code) => ({ title: code, id: code }));

/**内容主体 */
const SourceList: React.FC = () => {
    const { dataSource } = useContext(EncyclopediaPageContent);
    const { total, current, size, records } = dataSource;
    const categorys = useSelector((state: MainReduxState) => state.encyclopediaReducer.encyclopediaCategorys || []);

    const router = useRouter();

    const Page: React.FC = () => {
      if (!total) return <Fragment />;
      return (
        <Pagination
          className="float-right mt-[20px]"
          current={current}
          total={total}
          pageSize={size}
          showSizeChanger={false}
          itemRender={(page, type, element) => {
            return (
                <Link href={{ query:{ ...router.query, current: page } }}>
                    <a>{ type === "page" ? page : element}</a>
                </Link>
            )
          }}
        />
      );
    };

    const category = router.query.category as Key;
    const initials = router.query.initials as Key;
    const isAll = !category && !initials;

    const sourceCls=css`
        .ikjzd-list-item:last-child{
            border-bottom: 1px solid #f0f0f0;
        }
    `       

    return (
        <Card
            title={"百科分类"}
            bordered={false}
            className={sourceCls}
        >
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <Space size={15} wrap>

                        <Link
                            scroll={false}
                            href={{ query: { initials: null, category: null, current: 1 } }}
                        >
                            <a>
                                <Button
                                    type={isAll ? "primary" : "default"}
                                >
                                    全部
                                </Button>
                            </a>
                        </Link>

                        {categorys.map((word) => {

                            const type = word.id === category ? "primary" : "default";
                            const query = { ...router.query, category: word.id, current: 1, initials: null };
                            return (
                                <Link
                                    scroll={false}
                                    href={{ query }}
                                    key={word.id}
                                >
                                    <a>
                                        <Button type={type}>
                                            {word.title}
                                        </Button>
                                    </a>
                                </Link>
                            )
                        })}

                        {enChaCode.map((word) => {
                            const type = word.id === initials ? "primary" : "default";
                            const query = { ...router.query, category: null, current: 1, initials: word.id };
                            return (
                                <Link
                                    scroll={false}
                                    href={{ query }}
                                    key={word.id}
                                >
                                    <a>
                                        <Button type={type}>
                                            {word.title}
                                        </Button>
                                    </a>
                                </Link>
                            )
                        })}

                    </Space>
                </Col>
                <Col span={24}>
                    <List
                        dataSource={records}
                        pagination={false}
                        renderItem={(item) => (
                            <List.Item className="py-[25px]">
                                <ArticleItem {...item} />
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={24}>
                    <Page />
                </Col>
            </Row>
        </Card >
    )
}

/**文章组件 */
const ArticleItem: React.FC<EncyclopediaCategory> = (props) => {
    return (
        <Link
            href={`/w/[id]`}
            as={`/w/${props.id}`}
        >
            <a className={"w-[100%] cp db"} target={"_blank"}>
                <Row gutter={10} align={"top"}>
                    <Col span={7}>
                        <div className={"bg-center bg-cover w-[100%] h-[130px] br-a-[5px] hidden flex row-center colume-center"}>
                            <img className="scale-[1.05] w-[100%]" src={props.thumbUrl} />
                        </div>
                    </Col>
                    <Col span={17}>
                        <Space direction="vertical" className={"w-[100%]"}>
                            <p className="ma-[0px] fw-400 fs-[20px] color-[#1d1d1b]">{props.title}</p>
                            <p className="color-[#999999] ma-[0px] lc-2 mb-[15px] nohover">{props.summary}</p>
                            <p className={"color-[#bbbbbb]"}>
                                <span className={"mr-[5px]"}>
                                    <Icon type={"icon-yanjing"} />
                                </span>
                                <span className={"mr-[10px]"}>
                                    {props.readNum}
                                </span>
                                <span className={"mr-[5px]"}>
                                    <Icon type={"icon-aixin"} />
                                </span>
                                <span className={"mr-[10px]"}>
                                    {props.praiseNum}
                                </span>
                                <span className={"ma-[0px] float-right"}>
                                    {moment(props.createdAt).format("YYYY-MM-DD")}
                                </span>
                            </p>
                        </Space>
                    </Col>
                </Row>
            </a>
        </Link>
    )
}

/**热门文章 */
const HotArticle: React.FC = () => {
    const { articles } = useContext(EncyclopediaPageContent);
    return <Card bordered={false} title={"热门文章"}>
        {articles.map((article, index) => (
            <Link
                href={`/articles/[id]`}
                as={`/articles/${article.id}`}
                key={article.id}
            >
                <a className="py-[10px] block" target={"_blank"}>
                    <HotArticleComponent
                        {...article}
                        thumbPicUrl={index === 0 ? article.thumbPicUrl : ""}
                        index={index + 1}
                    />
                </a>
            </Link>
        ))}
    </Card>
}

/**百科贡献榜 */
const Contributions: React.FC = () => {

    const ctx = useContext(EncyclopediaPageContent);
    const { push } = useRouter();

    const contributions = ctx.contributions.map((contribution, index) => ({
        ...contribution,
        avatar: index < 3 ? contribution.avatar : undefined
    }))

    return (
        <Card bordered={false} title={"百科贡献榜"}>
            <List
                dataSource={contributions}
                renderItem={(item, index) => {
                    return (
                        <List.Item>
                            <Link
                                href={"/users/index/[id]"}
                                as={`/users/index/${item.userId}`}
                            >
                                <a className="block w-[100%]" target={"_blank"}>
                                    <Contribution index={index + 1} {...item} />
                                </a>
                            </Link>
                        </List.Item>
                    )
                }}
            />
            <Authorization.Valid>
                <Button
                    ghost
                    type={"primary"}
                    block
                    size={"large"}
                    className={"mt-[20px]"}
                    onClick={() => push("/w/words/publish")}
                >
                    创建词条
                </Button>
            </Authorization.Valid>
        </Card>
    )
}

/**热门词条 */
export const HotWords: React.FC<{ hots: EncyclopediaCategory[] }> = ({ hots }) => {

    const cls = css`
        &:hover {
            background-color: #fdecec;
        }
    `;

    return <Card bordered={false} title={"热门词条"}>
        <Space size={12} wrap>
            {hots.map((word) => (
                <Link
                    href={"/w/[id]"}
                    as={`/w/${word.id}`}
                    key={word.id}
                >
                    <a>
                        <Button
                            className={cx(
                                "color-[#555555]",
                                "bg-color-[#f5f5f5]",
                                cls,
                            )}
                            type={"link"}
                        >
                            {word.title}
                        </Button>
                    </a>
                </Link>
            ))}
        </Space>
    </Card>
}

/**顶部统计 */
const StatisticsTop: React.FC = () => {

    const { statistics, tops } = useContext(EncyclopediaPageContent);
    const { push } = useRouter();

    const StatisticsCount: React.FC = () => {
        return (
            <div className="text-center color-[primary]">
                <p className="fs-[30px] fw-500 mb-[20px]">
                    跨境百科
                </p>
                <p className="fs-[16px] mt-[10px] mb-[16px]">
                    跨境行业权威百科全书
                </p>
                <p className="flex row-center colume-center h-[45px]">
                    <img src={"/asset/image/w/ep-words.png"} className={"wh-[32px] mr-[10px]"} />
                    <span className="fs-[30px] fw-500">{statistics.totalEncyclopedia}</span>
                    <span className="fs-[18px]">个词条</span>
                </p>
                <p className="flex row-center colume-center h-[45px] mb-[10px]">
                    <img src={"/asset/image/w/ep-write-person.png"} className={"wh-[32px] mr-[10px]"} />
                    <span className="fs-[30px] fw-500">{statistics.totalUser}</span>
                    <span className="fs-[18px]">人编写</span>
                </p>
                <Authorization.Valid>
                    <Button
                        className="w-[210px]"
                        type={"primary"}
                        size={"large"}
                        onClick={() => push("/w/words/publish")}
                    >
                        创建词条
                    </Button>
                </Authorization.Valid>
            </div>
        )
    }

    return (
        <div
            className="py-[30px] bg-cover bg-center"
            style={{ backgroundImage: "url(/asset/image/w/ep-bg.png)" }}
        >
            <Container>
                <Row gutter={40}>
                    <Col span={18}>
                        <Row gutter={[20, 20]}>
                            {slice(tops, 0, 4).map((top) => (
                                <Col span={6} key={top.id}>
                                    <Link href={"/w/[id]"} as={`/w/${top.id}`}>
                                        <a>
                                            <Card
                                                bordered={false}
                                                size={"small"}
                                                className={"h-[235px]"}
                                                cover={(
                                                    <Avatar
                                                        src={top.thumbUrl}
                                                        shape={"square"}
                                                        className={"h-[115px]"}
                                                    />
                                                )}
                                            >
                                                <h2 className="fs-[20px] color-[#1d1d1d] mb-[10px]">
                                                    {top.title}
                                                </h2>
                                                <p className="lc-2 color-[#999999]">
                                                    {top.summary}
                                                </p>
                                            </Card>
                                        </a>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col span={6}>
                        <StatisticsCount />
                    </Col>
                </Row>
            </Container >
        </div >
    )
}