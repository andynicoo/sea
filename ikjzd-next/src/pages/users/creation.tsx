import DefaultLayout from "@/components/layouts/DefaultLayout";
import { NextPage } from "next";
import Link from "next/link";
import React, { Fragment, Key, useEffect, useImperativeHandle, useState } from "react";
import { Button, Tabs, Input, Card, Space, List, Avatar, Typography, Modal, Dropdown, Menu } from "antd";
import MineLayout from "@/components/users/MineLayout";
import { getKjzdEncyclopedia, kjzdArticleDelete, kjzdArticleDraftDelete, kjzdArticleDraftGetCount, kjzdArticleDraftGetPage, pageKjzdArticle, pageKjzdArticleCount, pagekjzdEncyclopediaDraft, pagekjzdEncyclopediaDraftCount } from "@/apis/users";
import { PageParams, PageSource } from "@/vo/PageParams";
import ArticleVo from "@/vo/Article";
import { PaginationConfig } from "antd/lib/pagination";
import EncyclopediaVo from "@/vo/Encyclopedia";
import { useRouter } from "next/router";
import Authorization from "@/components/Authorization";
import { css, cx } from "@emotion/css";
import Article from "@/vo/Article";
import Icon from "@/components/Icon";
import { ExclamationCircleOutlined, EllipsisOutlined } from '@ant-design/icons';
import { cloneDeep, sumBy } from "lodash";
import { ArticleCountInfo, BaikeCountInfo } from "@/vo/Users";

interface MineMyCreationPageProps {

}

const MineMyCreation: NextPage<MineMyCreationPageProps> = () => {
    return (
        <DefaultLayout>
            <MineLayout>
                <MyCreation />
            </MineLayout>
        </DefaultLayout>
    );
};
const articleListCls = css`
        .pg-article-description {
            min-height: 45px;
            margin-bottom: 30px;
        }
    `
const DraftCls = css`
        float: right;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #eee;
        text-align: center;
        line-height: 18px;
        margin: 0 30px;
        cursor: pointer;
    `
const tabsCls = css`
        position:relative;
        &::before{
            content: "";
            position:absolute;
            top: 3px;
            left: -14px;
            height: 15px;
            width: 1px;
            background-color: #999;
        }
    `

const ReasonRejection = (reason: string) => {
    Modal.info({
        title: '驳回原因',
        content: (
            <div>
                {reason}
            </div>
        ),
    });
};
export default MineMyCreation;

/**我的创作 */
const MyCreation: React.FC = () => {

    const { push } = useRouter();

    const cardExtra = (
        <Space>
            <Authorization.Valid>
                <Button onClick={() => push("/articles/publish")}>
                    发文章
                </Button>
            </Authorization.Valid>
            <Authorization.Valid>
                <Button onClick={() => push("/w/words/publish")}>
                    创建词条
                </Button>
            </Authorization.Valid>
        </Space>
    )

    return (
        <Card
            bordered={false}
            title={"我的创作"}
            extra={cardExtra}
        >
            <MineArticle />
        </Card>
    )
}

/**文章百科 */
const MineArticle: React.FC = () => {

    const [activeKey, setActiveKey] = useState<string>("1");

    const articleRef = React.createRef<MineArticleTabRefProps>();
    const encyclopediaRef = React.createRef<MineEncyclopediaTabRefProps>();

    const onSearch = (value: string) => {
        if (activeKey === "1") {
            articleRef.current?.onSearch(value);
        } else {
            encyclopediaRef.current?.onSearch(value);
        }
    }

    const tabBarExtra = <Input.Search onSearch={onSearch} />;

    return (
        <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            size={"large"}
            tabBarExtraContent={tabBarExtra}
            destroyInactiveTabPane
        >
            <Tabs.TabPane tab={"文章"} key="1">
                <MineArticleTab ref={articleRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"百科"} key="2">
                <MineEncyclopediaTab ref={encyclopediaRef} />
            </Tabs.TabPane>
        </Tabs>
    )
};

interface TabsItemProps {
    tab: string;
    key?: Key;
}

interface MineArticleTabRefProps {
    onSearch: (title: string) => void;
}




/**文章tab */
const MineArticleTab = React.forwardRef<MineArticleTabRefProps, {}>((props, ref) => {

    const [params, setParams] = useState<PageParams & { auditStatus: Key; title?: string }>({ current: 1, size: 10, auditStatus: "" });
    const [pageData, setPageData] = useState<PageSource<ArticleVo>>();
    const [loading, setLoading] = useState<boolean>(false);
    const [pageDataDraft, setPageDataDraft] = useState<PageSource<ArticleVo>>();
    const [draftCount, setDraftCount] = useState<number>(0);
    const [articleCount, setArticleCount] = useState<ArticleCountInfo[]>([])
    const [articleCountAll, setArticleCountAll] = useState<number>(0)
    const loadData = () => {
        setLoading(true);
        const { current, size, title } = params
        kjzdArticleDraftGetPage({ current, size, title }).then(res => {
            setPageDataDraft(res.data);
            setDraftCount(res.data.total)
        })
        pageKjzdArticle(params)
            .then((res) => {
                setPageData(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
        pageKjzdArticleCount({ current, size, title }).then(res => {
            setArticleCountAll(sumBy(res.data, 'number'))
            setArticleCount(res.data)
        })
    }

    const items: TabsItemProps[] = [
        { tab: `全部(${articleCountAll})`, key: "" },
        { tab: `待审核(${articleCount[0]?.number})`, key: "0" },
        { tab: `已发布(${articleCount[1]?.number})`, key: "1" },
        { tab: `被驳回(${articleCount[2]?.number})`, key: "2" },
        { tab: `草稿箱(${draftCount})`, key: "3" },
    ];

    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    }

    const onSearch = (title: string) => {
        setParams({ ...params, title, current: 1 });
    }

    const onStatusChange = (active: Key) => {
        setParams({ ...params, auditStatus: active, current: 1, title: '' });
    }

    const pagination: false | PaginationConfig = pageData?.total
        ? ({
            current: pageData.current,
            pageSize: pageData.size,
            total: pageData.total,
            onChange: onChange
        })
        : false;

    const paginationDraft: false | PaginationConfig = pageDataDraft?.total
        ? ({
            current: pageDataDraft.current,
            pageSize: pageDataDraft.size,
            total: pageDataDraft.total,
            onChange: onChange
        })
        : false;
    useEffect(loadData, [params]);
    useImperativeHandle(ref, () => ({
        onSearch
    }));

    //删除文章
    const deleteArticleOk = async (id: string, type: number) => {
        if (type == 2) {
            await kjzdArticleDraftDelete({ ids: [id] })
        } else {
            await kjzdArticleDelete({ ids: [id] })
        }
        loadData()
    }
    const deleteArticle = async (id: string, type: number) => {
        Modal.confirm({
            title: '确定删除吗？',
            icon: <ExclamationCircleOutlined />,
            content: '删除后无法恢复！',
            okText: '确认',
            cancelText: '取消',
            onOk: () => deleteArticleOk(id, type)
        });

    }

    const menu = (id: string) => (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link href={`/articles/publish?id=${id}`}>
                            <a>
                                编辑
                            </a>
                        </Link>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <span className="color-[#f676a6]" onClick={() => deleteArticle(String(id), 2)}>
                            删除
                        </span>
                    ),
                },
            ]}
        />
    );

    return (
        <Fragment>
            <Tabs size={"small"} onChange={onStatusChange}>
                {items.map(({ tab, key }) => (
                    <Tabs.TabPane tab={<span className={cx({ [tabsCls]: key == 3 })}>{tab}</span>} key={key} />
                ))}
            </Tabs>
            {params.auditStatus == "3" ? <List
                loading={loading}
                dataSource={pageDataDraft?.records}
                pagination={paginationDraft}
                renderItem={(item: Article) => {
                    return <List.Item
                        className={articleListCls}
                    >

                        <p>{item.title}</p>
                        <div>
                            <Dropdown overlay={() => menu(String(item.id))} placement="bottomLeft" arrow>
                                <span className={DraftCls}>
                                    <EllipsisOutlined />
                                </span>
                            </Dropdown>
                        </div>
                    </List.Item>
                }}
            />
                :
                <List
                    loading={loading}
                    dataSource={pageData?.records}
                    pagination={pagination}
                    renderItem={(item: Article) => {
                        const LinkTo: React.FC<any> = ({ articleItem, children }) => {
                            if (articleItem.auditStatus == 1) {
                                return <Link href={`/articles/${articleItem.id}`}><a>{children}</a></Link>
                            } else {
                                return <>{children}</>
                            }
                        }
                        return <List.Item
                            className={articleListCls}
                        >
                            <List.Item.Meta
                                avatar={(
                                    <LinkTo articleItem={item}>
                                        <Avatar
                                            src={item.thumbPicUrl}
                                            shape={"square"}
                                            style={{ width: 240, height: 150 }}
                                        />
                                    </LinkTo>
                                )}
                                title={(
                                    <Typography.Title level={4} ellipsis={{ rows: 1 }}>
                                        <LinkTo articleItem={item}>
                                            {item.title}
                                        </LinkTo>
                                    </Typography.Title>
                                )}
                                description={<>
                                    <Typography.Paragraph ellipsis={{ rows: 2 }} className="pg-article-description">
                                        <LinkTo articleItem={item}>
                                            {item.description?.replace(/<\/?[^>]*>/g, '')}
                                        </LinkTo>
                                    </Typography.Paragraph>
                                    <div className="color-[#cccccc]">
                                        {item.auditStatus == 2 ? <Button className="float-right ml-[10px]" onClick={() => ReasonRejection(item.reason)}>驳回原因</Button> : ''}
                                        <Button className="float-right" onClick={() => deleteArticle(String(item.id), 1)}>删除</Button>
                                        <Avatar src={item.user?.avatar} className="mr-[10px]" />{item.user?.nick}
                                        {item.readNum ? <span className="ml-[20px] mr-[20px]"><Icon type={"icon-yanjing"} className="fs-[16px]" /> {item.readNum}</span> : ''}
                                        {item.praiseNum ? <span><Icon type={"icon-aixin"} className="fs-[16px]" /> {item.praiseNum}</span> : ''}
                                    </div>
                                </>
                                }
                            />
                        </List.Item>
                    }}
                />}
        </Fragment >
    )
});

interface MineEncyclopediaTabRefProps {
    onSearch: (title: string) => void;
}

interface MineEncyclopediaTabProps {

}

/**百科 */
const MineEncyclopediaTab = React.forwardRef<MineEncyclopediaTabRefProps, MineEncyclopediaTabProps>((props, ref) => {
    const [params, setParams] = useState<PageParams & { status: Key; title?: string }>({ current: 1, size: 10, status: "" });
    const [pageData, setPageData] = useState<PageSource<EncyclopediaVo>>();
    const [loading, setLoading] = useState<boolean>(false);
    const [baikeCount, setBaikeCount] = useState<BaikeCountInfo[]>([]);
    const [baikeCountAll, setBaikeCountAll] = useState<number>(0);

    const loadData = () => {
        setLoading(true);
        let paramsHandle = cloneDeep(params)
        if (params.status == '3') {
            paramsHandle.isDraft = 1
            paramsHandle.status = ''
        }
        pagekjzdEncyclopediaDraft(paramsHandle)
            .then((res) => {
                setPageData(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
        pagekjzdEncyclopediaDraftCount()
            .then((res) => {
                setBaikeCountAll(sumBy(res.data, 'count'))
                setBaikeCount(res.data);
            })

    }

    const items: TabsItemProps[] = [
        { tab: `全部(${baikeCountAll - baikeCount[3]?.count})`, key: "" },
        { tab: `待审核(${baikeCount[0]?.count})`, key: "0" },
        { tab: `已发布(${baikeCount[1]?.count})`, key: "1" },
        { tab: `被驳回(${baikeCount[2]?.count})`, key: "2" },
        { tab: `草稿箱(${baikeCount[3]?.count})`, key: "3" },
    ];

    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    }

    const onSearch = (title: string) => {
        setParams({ ...params, title, current: 1 });
    }

    const onStatusChange = (active: Key) => {
        setParams({ ...params, status: active, current: 1, title: '' });
    }

    const pagination: false | PaginationConfig = pageData?.total
        ? ({
            current: pageData.current,
            pageSize: pageData.size,
            total: pageData.total,
            onChange: onChange
        })
        : false;

    useEffect(loadData, [params]);

    useImperativeHandle(ref, () => ({
        onSearch
    }));

    return (
        <Fragment>
            <Tabs size={"small"} onChange={onStatusChange}>
                {items.map(({ tab, key }) => (
                    <Tabs.TabPane tab={<span className={cx({ [tabsCls]: key == 3 })}>{tab}</span>} key={key} />
                ))}
            </Tabs>
            <List
                loading={loading}
                dataSource={pageData?.records}
                pagination={pagination}
                renderItem={(item) => {
                    const LinkTo: React.FC<any> = ({ bkItem, children }) => {
                        if (bkItem.status == 1) {
                            return <Link href={`/w/${bkItem.encyclopediaId}`}><a>{children}</a></Link>
                        } else {
                            return <>{children}</>
                        }
                    }
                    return <List.Item className={articleListCls}>
                        <List.Item.Meta
                            avatar={(
                                <LinkTo bkItem={item}>
                                    <Avatar
                                        src={item.thumbUrl}
                                        shape={"square"}
                                        style={{ width: 240, height: 150 }}
                                    />
                                </LinkTo>
                            )}
                            title={(
                                <Typography.Title level={4}>
                                    <LinkTo bkItem={item}>
                                        {item.title}
                                    </LinkTo>
                                </Typography.Title>
                            )}
                            description={<>
                                <Typography.Paragraph ellipsis={{ rows: 2 }} className="pg-article-description">
                                    <LinkTo bkItem={item}>
                                        {item.summary}
                                    </LinkTo>
                                </Typography.Paragraph>
                                <div className="color-[#cccccc]">
                                    {item.status == 2 ? <Button className="float-right ml-[10px]" onClick={() => ReasonRejection(item.reason as string)}>驳回原因</Button> : ''}
                                    {(item.status == 0 && item.draft == 0) ? <Link href={`/w/words/publish?id=${item.id}`}>
                                        <a><Button className="float-right">编辑</Button></a>
                                    </Link> : ''}
                                    {(item.draft == 1) ? <Link href={`/w/words/publish?id=${item.id}`}>
                                        <a><Button className="float-right">查看草稿</Button></a>
                                    </Link> : ''}
                                    {item.readNum ? <span className="ml-[20px] mr-[20px]"><Icon type={"icon-yanjing"} className="fs-[16px]" /> {item.readNum}</span> : ''}
                                </div>
                            </>}
                        />
                    </List.Item>
                }}
            />
        </Fragment>
    )
});