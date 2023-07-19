import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { List } from "antd";
import { getKjzdUserComment } from "@/apis/users";
import HomeLayout from "@/components/users/HomeLayout";
import { CommentProps } from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { PaginationConfig } from "antd/lib/pagination";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-users-comment` });

interface UsersCommentContextProps {
    commentData?: PageSource<CommentProps>
}

const UsersComment: NextPage<UsersCommentContextProps> = () => {
    return (
        <DefaultLayout>
            <HomeLayout>
                <CommentList />
            </HomeLayout>
        </DefaultLayout>
    );
};

export default UsersComment;

/**评论 */
const CommentList: React.FC = () => {
    const [params, setParams] = useState<PageParams>({ current: 1, size: 10 });
    const [commentData, setCommentData] = useState<PageSource<CommentProps>>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        getKjzdUserComment(params)
            .then((res) => {
                setCommentData(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [params]);

    const onChange = (current: number, size: number) => {
        setParams({ current, size });
    }

    const pagination: false | PaginationConfig = commentData && commentData.total
        ? ({
            current: commentData?.current,
            pageSize: commentData?.size,
            total: commentData?.total,
            onChange: onChange
        })
        : false;

    return <List
        loading={loading}
        dataSource={commentData?.records}
        pagination={pagination}
        renderItem={(item) => (
            <List.Item>
                <CommentListItem {...item} />
            </List.Item>
        )}
    />
}

const CommentListItem: React.FC<CommentProps> = (props) => {
    const { createdAt, content, nick } = props;

    const commentCls = css`
        font-size: 14px;
        color: #222222;
        margin: 11px 0 17px;
    `;

    const commentBottomCls = css`
        display: flex;
        padding: 7px 0 7px 9px;
        background-color: #f8f8f8;

        img {
            height: 47px;
            width: 47px;
            margin-right: 9px;
        }
    `;

    const comentedContent = css`
        display: inline-block;
        position: relative;
        top: -10px;
        font-size: 14px;
        color: #BBBBBB;
        padding: 10px;
        border: 1px solid #e5e5e5;

        &::after {
            position: absolute;
            display: inline-block;
            top: -3px;
            left: 15px;
            width: 0;
            height: 0px;
            content: "";
            border-style: solid;
            border-width: 3px;
            border-color: #fff #fff transparent transparent;
            transform: rotate(-45deg);
            box-shadow: 1px -1px 1px #ccc;
        }
    `;

    return <ul className={"w-[100%]"}>
        <li className={"fs-[14px] color-[#999999]"}>
            {createdAt}
        </li>
        <li className={cx(commentCls, "lc-2")}>
            {content}
        </li>
        <li className={comentedContent}>
            {nick}:
        </li>
        <li className={commentBottomCls}>
            发布者 : {nick}
        </li>
    </ul>
}

