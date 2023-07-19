import DefaultLayout from "@/components/layouts/DefaultLayout";
import ArticleVo from "@/vo/Article";
import { TooslDetails, Tools } from "@/vo/Tools";
import { Col, Row, Card, Space, Avatar, Button, List, Popover, message } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import Authorization from "@/components/Authorization";
import React, { useContext, useState, useEffect, Key } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { CustomNextPageContext } from "@/pages/_app";
import { getToolsDetail, downLoadTools } from "@/apis/tools";
import { getArticlePage } from "@/apis/article";
import { HotArticles, LikeCollection } from "@/components/articles/Details";
import { bbsPages } from "@/apis/bbs";
import { Bbs } from "@/vo/Bbs";
import { kjzdToolsListAll } from "@/apis/tools";
import { PageParams } from "@/vo/PageParams";
import createEmotion from "@emotion/css/create-instance";
import Icon from "@/components/Icon";
import Commens from "../../components/Commens";
import DetailsAd from "@/components/adverts/DetailsAd";
import { getSnsConfig, pageAd } from "@/apis/home";
import { Advert, SnsConfig } from "@/vo/Basic";
import AuthorInfo from "@/components/AuthorInfo";
import { Adverts } from "../articles/[id]";
import { UserInfo } from "@/vo/Users";
import moment from "moment";
import { getKjzdUser } from "@/apis/users";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-header` });
import { HotTools } from "@/pages/tl";
import SeoHead from "@/components/SeoHead";
import Cookie from "@/utils/cookie";
/** 文章详情页面 */

interface ToolsDetailsContextProps extends ToolsProps { }

const ToolsDetailsContext = React.createContext<ToolsDetailsContextProps>(
    {} as ToolsDetailsContextProps
);

interface ToolsProps {
    commends: ArticleVo[];
    toolsDetails: TooslDetails;
    snsConfig: SnsConfig[];
    tools: Tools[];
    hots: Bbs[];
    ads2: Advert[];
    authorInfo: UserInfo;
}

const ToolsDetailsPage: NextPage<ToolsProps> = (props) => {
    const { toolsDetails, authorInfo, ads2 } = props;
    const ctxValue: ToolsDetailsContextProps = {
        ...props
    }
    let { seoTitle, seoKeywords, description } = toolsDetails;
    return <DefaultLayout>
        <ToolsDetailsContext.Provider value={ctxValue}>
            <SeoHead
                title={seoTitle}
                keyword={seoKeywords}
                description={description}
            />
            <Row gutter={[16, 16]}>
                <Col span={17}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <ToolsDetails />
                        </Col>
                    </Row>
                </Col>
                <Col span={7}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <AuthorInfo
                                userId={authorInfo?.userId as string}
                            />
                            <Adverts adverts={ads2} pageName={'资源&工具文章页右侧广告位'}  />
                            <HotTools tools={props.tools} />
                        </Col>
                        <Col span={24}>
                            <DetailsAd />
                        </Col>
                        <Col span={24}>
                            <ExchangeGroup />
                        </Col>
                        <Col span={24}>
                            <HotArticles articles={props.commends} />
                        </Col>
                        <Col span={24}>
                            <HotBbs />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ToolsDetailsContext.Provider>
    </DefaultLayout>
};

ToolsDetailsPage.getInitialProps = async (ctx: CustomNextPageContext) => {
    const token = Cookie.getToken(ctx);
    const id = (ctx.query.id as string).split(".")[0];
    const toolsDetails = (await getToolsDetail(id, token)).data;
    const commendParams: PageParams = {
        current: 1,
        size: 10,
        sort: "created_at",
        order: "DESC",
        auditStatus: 1,
        articleType: 1,
    };

    const commends = (await getArticlePage(commendParams)).data.records;
    const snsConfig = (await getSnsConfig({})).data;
    const tools = (
        await kjzdToolsListAll({ current: 1, size: 10, searchType: 5 })
    ).data.records;
    const hots = (await bbsPages({ searchType: 5 })).data.records;
    /**右侧广告 */
    const ads2 = (await pageAd({ adSiteKey: "ba_dvert" })).data.records;
    const authorInfo = (await getKjzdUser(toolsDetails.userId as Key)).data
    return {
        toolsDetails,
        commends,
        snsConfig,
        tools,
        hots,
        ads2,
        authorInfo
    };
};

const ToolsDetails: React.FC = () => {
    const { toolsDetails, authorInfo } = useContext(ToolsDetailsContext);
    const [article, setArticle] = useState(toolsDetails);
    const { isPraise, praiseNum, isCollection, collectNum } = article;
    return (
        <Card bordered={false}>
            <h1 className="fs-[28px] fw-500 color-[#000000e6] mb-[20px]">
                {toolsDetails.title}
            </h1>
            <Space className="mb-[30px]" size={20}>
                <Space>
                    <Avatar src={authorInfo?.avatar} />
                    <span>{authorInfo?.nick}</span>
                    <span>{toolsDetails.createdAt}</span>
                </Space>
                <Space size={5} className="color-[#999999] fs-[12px]">
                    <Icon type={"icon-yanjing"} className="fs-[16px]" />
                    {toolsDetails.readNum}
                </Space>
                <LikeCollection
                    isPraise={isPraise}
                    praiseNum={praiseNum}
                    isCollection={isCollection}
                    collectNum={collectNum as number}
                    otherId={article.id}
                    position={"top"}
                    type={4}
                    onChange={(value) => setArticle({ ...article, ...value })}
                />
                <Space size={5} className="color-[#999999] fs-[12px]">
                    <a href="#commenList"><Icon type={"icon-pinglun"} className="fs-[16px]" />
                        {toolsDetails.commentNum}
                    </a>
                </Space>
            </Space>
            <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: toolsDetails.content as string }}
            />
            <DownLoad />
            <LikeCollection
                isPraise={isPraise}
                praiseNum={praiseNum}
                isCollection={isCollection}
                collectNum={collectNum as number}
                otherId={article.id}
                type={4}
                onChange={(value) => setArticle({ ...article, ...value })}
            />
            <Commens type={4} />
        </Card>
    );
};

const DownLoad: React.FC = () => {
    const { toolsDetails } = useContext(ToolsDetailsContext);
    const integralNeed: any = toolsDetails.integralNum;
    const [text, setText] = useState<string>(integralNeed + "积分下载");
    const [type, setType] = useState<number>(9);
    const userInfo: any = useSelector(
        (state: MainReduxState) => state.userReducer.info
    );
    const router = useRouter();
    const rowCls = css`
    padding: 23px 20px;
    background-color: #f8f8f8;
  `;
    const icon1 = css`
    background-image: url(/asset/image/icon/pdf.png) !important;
  `;
    const icon2 = css`
    background-image: url(/asset/image/icon/xlsx.png) !important;
  `;
    const icon3 = css`
    background-image: url(/asset/image/icon/ppt.png) !important;
  `;
    const icon4 = css`
    background-image: url(/asset/image/icon/txt.png) !important;
  `;
    const icon5 = css`
    background-image: url(/asset/image/icon/doc.png) !important;
  `;
    const icon6 = css`
    background-image: url(/asset/image/icon/zip.png) !important;
  `;
    const icon7 = css`
    background-image: url(/asset/image/icon/rar.png) !important;
  `;
    const icon8 = css`
    background-image: url(/asset/image/icon/movie.png) !important;
  `;
    const icon9 = css`
    background-image: url(/asset/image/icon/pic.png) !important;
    
  `;
    const icon10 = css`
    background-image: url(/asset/image/icon/unknow.png) !important;
  `;
    const avatarCls = css`
    width: 56px !important;
    height: 64px !important;
    background-size: cover !important;
    border-radius: 5px !important;
  `;
    const size: any = (parseInt(toolsDetails.enclosureSize) / 1024).toFixed(2) + 'M'
    const loadType = () => {
        if (toolsDetails.enclosureName) {
            if (toolsDetails.enclosureName.indexOf("pdf") !== -1) {
                setType(0);
            } else if (toolsDetails.enclosureName.indexOf("xlsx") !== -1) {
                setType(1);
            } else if (toolsDetails.enclosureName.indexOf("ppt") !== -1) {
                setType(2);
            } else if (toolsDetails.enclosureName.indexOf("txt") !== -1) {
                setType(3);
            } else if (toolsDetails.enclosureName.indexOf("doc") !== -1) {
                setType(4);
            } else if (toolsDetails.enclosureName.indexOf("zip") !== -1) {
                setType(5);
            } else if (toolsDetails.enclosureName.indexOf("rar") !== -1) {
                setType(6);
            } else if (toolsDetails.enclosureName.indexOf("movie") !== -1) {
                setType(7);
            } else if (toolsDetails.enclosureName.indexOf("png") !== -1) {
                setType(8);
            } else {
                setType(9);
            }
        } else {
            setType(9);
        }
    };
    useEffect(loadType, []);
    const cls = [
        icon1,
        icon2,
        icon3,
        icon4,
        icon5,
        icon6,
        icon7,
        icon8,
        icon9,
        icon10,
    ][type];
    const avatar = (
        <Avatar className={cx(avatarCls, { [cls]: true })} shape={"square"} />
    );
    const title = (
        <span className="block h-[30px] fw-500 fs-[18px] mb-[10px] lc-1">
            {toolsDetails.title}
        </span>
    );
    const description = (
        <Space size={30}>
            <span>{toolsDetails.createdAt}</span>
            <span>{"资源大小: " + size}</span>
            <span>{"下载次数: " + toolsDetails.enclosureDownloadNum}</span>
            <span>{"所需积分: " + toolsDetails.integralNum}</span>
        </Space>
    );
    const onDownLoad = () => {
        const { id } = router.query;
        const integral = userInfo.integral;
        if (parseInt(integral) < parseInt(integralNeed)) {
            message.info("积分不够");
            return false;
        }
        if (id) {
            downLoadTools({ id: id as string }).then((res) => {
                if (res.code == "0") {
                    window.open(res.data.enclosureUrl);
                }
            }).catch((error) => {
                message.error(error.response.data.message);
            });
        }
    };
    return (
        <Row className={cx("mt-[20px]", rowCls)}>
            <Col span={20}>
                <List.Item>
                    <List.Item.Meta
                        avatar={avatar}
                        title={title}
                        description={description}
                    />
                </List.Item>
            </Col>
            <Col span={4}>
                <Authorization.Valid>
                    <Button
                        type="primary"
                        className={cx("w-[100%] fs-[14px] mt-[30px]")}
                        onClick={onDownLoad}
                    >
                        {text}
                    </Button>
                </Authorization.Valid>
            </Col>
        </Row>
    );
};

/**交流群 */
const ExchangeGroup: React.FC = () => {
    const { snsConfig } = useContext(ToolsDetailsContext);

    const Exchange: React.FC<SnsConfig & { index: number }> = (props) => {
        const icon1 = css`
      background-image: url(/asset/image/icon/commend-1.png);
    `;

        const icon2 = css`
      background-image: url(/asset/image/icon/commend-2.png);
    `;

        const icon3 = css`
      background-image: url(/asset/image/icon/commend-3.png);
    `;

        const index = props.index % 3;
        const cls = [icon1, icon2, icon3][index];

        const content = (
            <div className="text-center">
                <p className="mb-[5px] color-[primary] fs-[12px]">添加微信，邀您进群</p>
                <Avatar shape={"square"} size={88} src={props.snsQrCode} />
            </div>
        );

        return (
            <Row>
                <Col span={3}>
                    <div
                        className={cx(
                            "wh-[25px] bg-color-[#f3f3f3] br-round bg-center bg-cover",
                            cls
                        )}
                    />
                </Col>
                <Col span={14}>{props.snsName}</Col>
                <Col span={7}>
                    <Popover placement="left" content={content} trigger="click">
                        <Button size={"small"} shape={"round"} type={"primary"} block>
                            加入
                        </Button>
                    </Popover>
                </Col>
            </Row>
        );
    };

    return (
        <Card title={"交流群"} bordered={false}>
            <Space className="w-[100%]" direction={"vertical"} size={20}>
                {snsConfig.map((item, index) => (
                    <Exchange {...item} index={index} key={item.id} />
                ))}
            </Space>
        </Card>
    );
};

/**热门帖子 */
const HotBbs: React.FC = () => {
    const { hots } = useContext(ToolsDetailsContext);
    return (
        <Card title={"热门帖子"} bordered={false} className={"mb-[20px]"}>
            <List
                dataSource={hots}
                renderItem={(item) => {
                    const title = (
                        <Link href={"/k/[id]"} as={`/k/${item.id}`}>
                            <a className="block mb-[10px] lc-2 color-[#222222]">
                                {item.title}
                            </a>
                        </Link>
                    );

                    const description = (
                        <div>
                            <Avatar className="mr-[10px]" src={item.avatar} />
                            <span>{item.author}</span>
                        </div>
                    );

                    return (
                        <List.Item>
                            <List.Item.Meta title={title} description={description} />
                        </List.Item>
                    );
                }}
            />
        </Card>
    );
};

export default ToolsDetailsPage;
