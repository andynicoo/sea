import { activityApply, getActivity, getActivityApplys, getActivityByUser, operateCollect, unoperateCollect } from "@/apis/home";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import { MinHead } from "@/components/Header";
import SeoHead from "@/components/SeoHead";
import { Activity, ActivityApply, activityTicketsDTO, ActivityUser } from "@/vo/Users";
import { Avatar, Breadcrumb, Button, Card, Col, Divider, Empty, Form, Input, InputNumber, List, message, Modal, Row, Space, Tooltip } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import React, { Fragment, Key, useContext, useEffect, useState } from "react";
import { RightOutlined, CheckOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import Icon from "@/components/Icon";
import { useRouter } from "next/router";
import CommenInput from "@/components/CommenInput";
import { PageParams, PageSource } from "@/vo/PageParams";
import { CommentProps } from "@/vo/Article";
import { getKjzdUserComment, follow, unFollow } from "@/apis/users";
import { first } from "lodash";
import Cookie from "@/utils/cookie";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import copy from "copy-to-clipboard";
import Authorization from "@/components/Authorization";
import createEmotion from '@emotion/css/create-instance'
const { cx, css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-activity-id` });

const primaryColor = process.env.PRIMARY_COLOR;
const classPrefix = process.env.CLASS_PREFIX;
interface ActivityDetailContextProps extends ActivityDetailPageProps {
    activityUser?: ActivityUser;
    setActivityUser: (activityUser: ActivityUser) => void;
    applys: ActivityApply[];
    setApplys: (applys: ActivityApply[]) => void;
    loadApplys: () => void;
    setActivity: (activity: Activity) => void;
}

const ActivityDetailContext = React.createContext<ActivityDetailContextProps>({} as ActivityDetailContextProps);

interface ActivityDetailPageProps {
    activity: Activity;
}

/**活动峰会详情 */
const ActivityDetailPage: NextPage<ActivityDetailPageProps> = (props) => {
    const { query } = useRouter();
    const [applys, setApplys] = useState<ActivityApply[]>([]);
    const [activity, setActivity] = useState<Activity>(props.activity);
    const [activityUser, setActivityUser] = useState<ActivityUser>();

    let { activity: seoActivity } = props
    let { title, } = seoActivity

    const loadApplys = () => {
        getActivityApplys(query.id as Key).then((res) => {
            setApplys(res.data);
        })
    }

    const loadActivityUser = () => {
        getActivityByUser(activity.userId).then((res) => {
            setActivityUser(res.data);
        })
    }

    useEffect(() => {
        loadApplys();
        loadActivityUser();
    }, []);

    const ctxValue: ActivityDetailContextProps = {
        activityUser,
        setActivityUser,
        activity,
        setActivity,
        applys,
        setApplys,
        loadApplys
    }

    return (
        <ActivityDetailContext.Provider value={ctxValue}>
            <SeoHead
                title={title}
            />
            <MinHead />

            {/* 活动信息 */}
            <InfoBanner />

            <Container className="my-[20px]">
                <Row gutter={20}>
                    <Col span={18}>
                        {/* 概述 */}
                        <Descript />

                        {/* 已报名 */}
                        <Applyed />

                        {/* 评论 */}
                        <Commens />
                    </Col>
                    <Col span={6}>
                        <InfoCard />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </ActivityDetailContext.Provider>
    )
}

ActivityDetailPage.getInitialProps = async (ctx) => {
    const token = Cookie.getToken(ctx.req?.headers.cookie as string);
    const id = (ctx.query.id as string).split(".")[0];
    const activity = (await getActivity(id, token)).data;

    return {
        activity,
    }
}

export default ActivityDetailPage;

/**活动信息 */
const InfoBanner: React.FC = () => {

    const { query } = useRouter();
    const { activity, loadApplys, setActivity } = useContext(ActivityDetailContext);
    const {
        province,
        city,
        area,
        address,
        title,
        posterUrl,
        startTime,
        endTime,
        activityTicketsDTOList,
        isCollection,
        isJoin,
        pubNum,
        applyNum,
        userName
    } = activity;
    const activityTickets = first(activityTicketsDTOList);
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    const [num, setNum] = useState<number>(1);
    const [activityTicketsId, setActivityTicketsId] = useState<Key | undefined>(activityTickets?.id);
    const [applyVisible, setApplyVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const activityId = query.id as Key;

    const avatarCls = css`
        height: 315px;
        width: 100%;
    `;

    /**票种标签 */
    const Ticket: React.FC<activityTicketsDTO> = (props) => {

        const active: boolean = activityTicketsId === props.id;

        const iconCls = css`
            height: 20px;
            width: 20px;
            position: absolute;
            right: 0;
            bottom: 0;
            border: 10px solid ${primaryColor};
            border-color: transparent ${primaryColor} ${primaryColor} transparent;

            .anticon {
                transform: translate(-1px, -9px);
                color: #fff;
                font-size: 10px;
            }
        `;

        const cls = css`
            border: 1px solid #eee;
            padding: 5px 20px;
            border-radius: 3px;
            position: relative;
            overflow: hidden;

            & > .${classPrefix}-space-item {
                &:nth-child(1) {
                    color: #ff9e4a;
                }

                &:nth-child(2) {
                    color: #666666;
                }
            }
        `;

        const activeCls = css`
            border: 1px solid ${primaryColor};
        `;

        return (
            <Space
                className={cx(cls, "cursor-pointer", { [activeCls]: active })}
                size={15}
                onClick={() => setActivityTicketsId(props.id)}
            >
                <span>¥{props.price || "0.00"}</span>
                {!props.price && <span>免费</span>}
                {active && (
                    <span className={iconCls}>
                        <CheckOutlined />
                    </span>
                )}
            </Space>
        )
    }

    const InputCount: React.FC = () => {

        const inputCls = css`
            .${classPrefix}-input-number-handler-wrap {
                display: none;
            }
        `;

        return (
            <Input.Group compact>
                <Button
                    type={"primary"}
                    onClick={() => setNum(num - 1)}
                    disabled={num <= 1}
                >
                    <MinusOutlined />
                </Button>
                <InputNumber
                    className={inputCls}
                    value={num}
                    onChange={(e: number) => setNum(e)}
                    min={1}
                />
                <Button
                    type={"primary"}
                    onClick={() => setNum(num + 1)}
                >
                    <PlusOutlined />
                </Button>
            </Input.Group>
        )
    }

    const addressStr = [province, city, area, address].join("");

    const times = [startTime, endTime].join(" 到 ");

    /**报名 */
    const onApply = () => {
        setApplyVisible(true);
    }

    /**活动报名取消 */
    const onCancel = () => {
        setApplyVisible(false);
    }

    /**活动报名确认 */
    const onOk = () => {
        form.validateFields().then((value: any) => {
            activityApply({
                activityId,
                num,
                activityTicketsId,
                userId: userInfo?.userId,
                ...value
            }).then(() => {
                Modal.info({
                    title: "提示",
                    content: "报名成功",
                })
                setApplyVisible(false);
                loadApplys();
                setActivity({ ...activity, isJoin: true });
            }).catch((error) => {
                message.error(error.response.data.message);
            })
        })
    }

    /**收藏 */
    const onStore = async () => {
        const isCollection = activity.isCollection;
        const params = { type: 6, otherId: activityId };
        if (!isCollection) {
            /**收藏 */
            await operateCollect(params);
            message.success("收藏成功");
        } else {
            /**取消收藏 */
            await unoperateCollect(params);
            message.success("取消收藏成功");
        }
        setActivity({ ...activity, isCollection: !isCollection });
    }

    return (
        <Fragment>
            <div className={"bg-color-[#ffffff]"}>
                <Container>
                    <Breadcrumb
                        className="py-[20px]"
                        separator={<RightOutlined />}
                    >
                        <Breadcrumb.Item>
                            <Link href={"/"}>
                                <a>首页</a>
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link href={"/acd"}>
                                <a>活动</a>
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {title}
                        </Breadcrumb.Item>
                    </Breadcrumb>

                    <Row gutter={30}>
                        <Col span={12}>
                            <Avatar
                                src={posterUrl}
                                className={avatarCls}
                                shape={"square"}
                            />
                        </Col>
                        <Col span={12}>
                            <h1 className={cx("fs-[26px]", "color-[#000000]0f", "mb-[20px]")}>{title}</h1>

                            <Space
                                size={"large"}
                                className={"color-[#999999]"}
                            >
                                <span>主办方: {userName}</span>
                                <span>{applyNum}人报名/{pubNum}</span>
                            </Space>

                            <Divider />

                            <Row gutter={[0, 15]} align={"middle"} className={"mb-[20px]"}>
                                <Col span={2}>地点:</Col>
                                <Col span={22}>{addressStr}</Col>
                                <Col span={2}>时间:</Col>
                                <Col span={22}>{times}</Col>
                                <Col span={2}>票种:</Col>
                                <Col span={22}>
                                    <Space wrap>
                                        {activityTicketsDTOList.map((item) => (
                                            <Ticket
                                                {...item}
                                                key={item.id}
                                            />
                                        ))}
                                    </Space>
                                </Col>
                                <Col span={2}>人数:</Col>
                                <Col span={22}>
                                    <InputCount />
                                </Col>
                                <Col span={24}>
                                    <Row gutter={15}>
                                        <Col span={7}>
                                            <Authorization.Valid>
                                                <Button
                                                    disabled={!!isJoin}
                                                    size={"large"}
                                                    type={"primary"}
                                                    onClick={onApply}
                                                    block
                                                >
                                                    {isJoin ? "已报名" : "我要报名"}
                                                </Button>
                                            </Authorization.Valid>
                                        </Col>
                                        <Col span={7}>
                                            <Authorization.Valid>
                                                <Button
                                                    size={"large"}
                                                    onClick={onStore}
                                                    block
                                                >
                                                    {
                                                        isCollection
                                                            ? (
                                                                <Space className="color-[primary]">
                                                                    <Icon type={"icon-shoucang1"} />
                                                                    已收藏
                                                                </Space>
                                                            )
                                                            : (
                                                                <Space>
                                                                    <Icon type={"icon-shoucang"} />
                                                                    收藏
                                                                </Space>
                                                            )
                                                    }
                                                </Button>
                                            </Authorization.Valid>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal centered
                visible={applyVisible}
                title={"活动报名"}
                onCancel={onCancel}
                onOk={onOk}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    form={form}
                >
                    <Form.Item
                        label="姓名"
                        name={"name"}
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="手机号码"
                        name={"mobile"}
                        rules={[{ required: true }]}
                    >
                        <InputNumber className={css`width: 100%;`} />
                    </Form.Item>
                </Form>
            </Modal>
        </Fragment>
    )
}

/**概述 */
const Descript: React.FC = () => {
    const { activity } = useContext(ActivityDetailContext);
    return (
        <Card
            title={"活动概述"}
            bordered={false}
            className={"mb-[20px]"}
        >
            {(() => {
                if (!activity.content) return <Empty />;
                return (
                    <div
                        className="rich-text"
                        dangerouslySetInnerHTML={{ __html: activity.content }}
                    />
                )
            })()}
        </Card>
    )
}

/**已报名 */
const Applyed: React.FC = () => {

    const { applys } = useContext(ActivityDetailContext);

    return (
        <Card
            bordered={false}
            title={`已报名(${applys.length})`}
            className={"mb-[20px]"}
        >
            <List
                dataSource={applys}
                pagination={false}
                renderItem={(apply) => (
                    <List.Item>
                        <List.Item.Meta
                            title={apply.name}
                            description={apply.createdAt}
                        />
                    </List.Item>
                )}
            />
        </Card>
    )
}

/**评论 */
const Commens: React.FC = () => {

    const { query } = useRouter();
    const [params, setParams] = useState<PageParams>({ current: 1, size: 10, otherId: query.id, type: 5 });
    const [pageSource, setPageSource] = useState<PageSource<CommentProps>>();

    const onFinish = (value: any) => {

    }

    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    }

    const loadData = () => {
        getKjzdUserComment(params).then((res) => {
            setPageSource(res.data);
        })
    }

    useEffect(loadData, [params]);

    const CommenList: React.FC = () => {
        if (!pageSource?.total) return <Empty />;

        return (
            <List
                dataSource={pageSource.records}
                pagination={{
                    current: pageSource.current,
                    pageSize: pageSource.size,
                    total: pageSource.total,
                    onChange: onChange
                }}
                renderItem={(item) => {
                    return (
                        <List.Item>
                            <List.Item.Meta
                                title={item.content}
                                description={`${item.nick} ${item.createdAt}`}
                            />
                        </List.Item>
                    )
                }}
            />
        )
    }

    return (
        <Card
            bordered={false}
            title={`参与评论${pageSource?.total}条`}
        >
            <CommenInput
                onFinish={onFinish}
            />
            <CommenList />
        </Card>
    )
}

/**信息卡片 */
const InfoCard: React.FC = () => {
    const { activity, activityUser, setActivityUser } = useContext(ActivityDetailContext);
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    const onCopy = () => {
        if (copy(activity.mobile)) {
            message.success("复制成功!");
        }
    }

    const onLike = () => {
        if (!activityUser) return;
        if (activityUser.isFans) {
            /**已经关注过 */
            unFollow({ userId: activityUser.userId }).then(() => {
                message.success("取消关注成功");
                setActivityUser({ ...activityUser, isFans: false });
            })
        } else {
            /**未关注过 */
            follow({
                fansUid: activityUser.userId,
                userId: userInfo?.userId
            }).then(() => {
                message.success("关注成功");
                setActivityUser({ ...activityUser, isFans: true });
            })
        }
    }

    return (
        <Card
            className="text-center"
            bordered={false}
        >
            <Avatar src={activityUser?.avatar} size={110} />
            <div className="my-[20px]">{activityUser?.nick}</div>
            <Divider />

            <Row gutter={[20, 20]}>
                <Col span={12}>
                    <p className="ma-[0px] fs-[18px] color-[#000000e6]">{activityUser?.applyNum}</p>
                    <p className="ma-[0px] fs-[12px] color-[#00000099]">举办活动</p>
                </Col>
                <Col span={12}>
                    <p className="ma-[0px] fs-[18px] color-[#000000e6]">{activityUser?.pushCount}</p>
                    <p className="ma-[0px] fs-[12px] color-[#00000099]">参与人数</p>
                </Col>
                <Col span={12}>
                    <Tooltip title={"点击复制联系方式"}>
                        <Button
                            block
                            size={"large"}
                            onClick={onCopy}
                        >
                            联系ta
                        </Button>
                    </Tooltip>
                </Col>
                <Col span={12}>
                    <Authorization.Valid>
                        <Button
                            type={"primary"}
                            block
                            size={"large"}
                            onClick={onLike}
                        >
                            <PlusOutlined />
                            {activityUser?.isFans ? "已关注" : "关注"}
                        </Button>
                    </Authorization.Valid>
                </Col>
            </Row>
        </Card>
    )
}