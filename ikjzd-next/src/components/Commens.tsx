
import React, { Fragment, Key, useEffect, useState } from "react";
import createEmotion from "@emotion/css/create-instance";
import { useRouter } from "next/router";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Avatar, Button, Card, Divider, Empty, Form, Input, List, message, Pagination, Space } from "antd";
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { commentCancelPraise, commentPraise, getKjzdUserComment, publishkUserComment } from "@/apis/users";
import CommenInput from "./CommenInput";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { CommentPraiseProps, CommentPublishProps } from "@/vo/Users";
import { CommentProps } from "@/vo/Article";
import Icon from "./Icon";
import { cloneDeep } from "lodash";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-commen-input` });

type CommensType = 1 /**文章 */ | 2 /**快讯 */ | 3 /**帖子 */ | 4 /**资源 */ | 5 /**活动 */ | 6 /**开店 */;

/**评论 */
interface CommensProps {
    type: CommensType;
}

/**评论 */
const Commens: React.FC<CommensProps> = (props) => {
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    const { query } = useRouter();
    const [params, setParams] = useState<PageParams>({ firstId: 0, current: 1, size: 10, type: props.type });
    const [pageSource, setPageSource] = useState<PageSource<CommentProps>>();
    const [replyKey, setReplyKey] = useState<Key>();
    const [replyLoading, setReplyLoading] = useState<boolean>(false);

    /**发布评论 */
    const onFinish = (value: CommentPublishProps) => {
        value = {
            ...value,
            nick: userInfo?.nick,
            faceUrl: userInfo?.avatar,
            type: props.type,
            otherId: query.id as Key,
        }
        publishkUserComment(value)
            .then(() => {
                message.success("发表评论成功");
                loadData();
            }).finally(() => {
                setReplyLoading(false);
                setReplyKey(undefined);
            });
    }

    /**获取评论 */
    const loadData = () => {
        getKjzdUserComment({ ...params, otherId: query.id }).then((res) => {
            setPageSource(res.data);
        })
    }
    useEffect(loadData, [params, query.id]);

    /**分页改变 */
    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    }

    const ReplyCommen: React.FC<{ commens: CommentProps; }> = ({ commens }) => {
        const firstId = commens.firstId == 0 ? commens.id : commens.firstId;
        const [form] = Form.useForm<{ content: string }>();

        const onSubmit = () => {
            form.validateFields().then(({ content }) => {
                setReplyLoading(true);
                onFinish({
                    content,
                    firstId,
                    parentNick: commens.nick,
                    parentCommentId: commens.id,
                    parentUserId: commens.userId,
                });
            })
        }

        return (
            <Form form={form}>
                <Form.Item name={"content"} rules={[{ required: true, message: "请输入评论内容" }]}>
                    <Input.TextArea rows={5} />
                </Form.Item>
                <Form.Item>
                    <Space className="float-right">
                        <Button
                            type={"text"}
                            onClick={() => setReplyKey(undefined)}
                        >
                            取消
                        </Button>
                        <Button
                            type={"primary"}
                            onClick={onSubmit}
                            loading={replyLoading}
                        >
                            评论
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        )
    }

    /**点赞 */
    const handleLike = async (id: Key, isRraise: boolean, isRefuse: boolean) => {
        const params: CommentPraiseProps = {
            commentId: id,
            type: 1,
            userId: userInfo?.userId as Key,
        }
        if (isRraise) {
            commentCancelPraise(params).then(() => {
                loadData();
            })
        } else {
            if (isRefuse) {
                let paramsH = cloneDeep(params)
                paramsH.type = 2
                await commentCancelPraise(paramsH)
            }
            commentPraise(params).then(() => {
                loadData();
            })
        }
    }

    /**踩 */
    const handleDislike = async (id: Key, isRraise: boolean, isRefuse: boolean) => {
        const params: CommentPraiseProps = {
            commentId: id,
            type: 2,
            userId: userInfo?.userId as Key,
        }
        if (isRefuse) {
            commentCancelPraise(params).then(() => {
                loadData();
            })
        } else {
            if (isRraise) {
                let paramsH = cloneDeep(params)
                paramsH.type = 1
                await commentCancelPraise(paramsH)
            }
            commentPraise(params).then(() => {
                loadData();
            })
        }
    }

    /**评论列表 */
    const CommenList: React.FC<{ source: CommentProps[] }> = ({ source }) => {
        return (
            <List
                dataSource={source}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.faceUrl} />}
                            title={(
                                <Fragment>
                                    <p className="mb-[5px]">
                                        <span className="color-[#1072c6]">
                                            {item.nick}
                                        </span>
                                        {item.parentNick && (
                                            <Fragment>
                                                <span className="mx-[10px]">回复了</span>
                                                <span className="color-[#1072c6]">
                                                    {item.parentNick}
                                                </span>
                                            </Fragment>
                                        )}
                                    </p>
                                    <p className="mb-[5px] color-[#bbbbbb] fs-[12px]">{item.createdAt}</p>
                                </Fragment>
                            )}
                            description={(
                                <Fragment>
                                    <p className="color-[#34374c] mb-[10px]" dangerouslySetInnerHTML={{ __html: item.content as string }}></p>
                                    {replyKey === item.id && (
                                        <ReplyCommen commens={item} />
                                    )}
                                    <Space
                                        className={cx("cursor-pointer", { ["color-[primary]"]: item.isRraise })}
                                        onClick={() => handleLike(item.id, item.isRraise, item.isRefuse)}
                                    >
                                        <LikeOutlined />
                                        {item.praiseNum}
                                    </Space>
                                    <Divider type={"vertical"} />
                                    <Space
                                        className={cx("cursor-pointer", { ["color-[primary]"]: item.isRefuse })}
                                        onClick={() => handleDislike(item.id, item.isRraise, item.isRefuse)}
                                    >
                                        <DislikeOutlined />
                                        {item.refuseNum}
                                    </Space>
                                    <Divider type={"vertical"} />
                                    <span
                                        className="cursor-pointer"
                                        onClick={() => setReplyKey(item.id)}
                                    >
                                        回复作者
                                    </span>

                                    {item.children && (
                                        <div className="bg-color-[#f4f4f4] pa-[10px] my-[10px]">
                                            <CommenList source={item.children} />
                                        </div>
                                    )}
                                </Fragment>
                            )}
                        />
                    </List.Item>
                )}
            />
        )
    }

    const CommenContent: React.FC = () => {
        if (!pageSource?.total) return <Empty />;
        return (
            <Fragment>
                <div
                    className="fs-[18px] py-[20px] mb-[20px]"
                    style={{ borderBottom: "1px solid #eee" }}
                >
                    {pageSource?.total}条评论
                </div>
                <CommenList source={pageSource.records} />
                <div className="text-center">
                    <Pagination
                        current={pageSource.current}
                        total={pageSource.total}
                        pageSize={pageSource.size}
                        onChange={onChange}
                    />
                </div>
            </Fragment>
        )
    }

    return (
        <Card
            id="commenList"
            bordered={false}
            title={`参与评论`}
            className={"mb-[20px]"}
        >
            <CommenInput
                onFinish={({ content }) => onFinish({
                    content,
                    firstId: 0,
                    parentCommentId: 0,
                    parentUserId: 0,
                })}
            />
            <CommenContent />
        </Card>
    )
}


export default Commens;