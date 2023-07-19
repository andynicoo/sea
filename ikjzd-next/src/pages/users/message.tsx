import DefaultLayout from "@/components/layouts/DefaultLayout";
import { NextPage } from "next";
import React, { Fragment, useEffect, useImperativeHandle, useState } from "react";
import { Tabs, List, Input, Card, Avatar } from "antd";
import MineLayout from "@/components/users/MineLayout";
import { getKjzdUserComment, pageNewsContent, pageUserLetter, pageUserPraise, pageMessageNum, getKjzdUserCommentUser } from "@/apis/users";
import { PageParams, PageSource } from "@/vo/PageParams";
import { CommentProps, SystemMessageProps } from "@/vo/Article";
import { PaginationConfig } from "antd/lib/pagination";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";

interface SearchPageParams extends PageParams {
    keyword?: string;
}

interface UsersMessagePageProps {

}

const UsersMine: NextPage<UsersMessagePageProps> = () => {
    return (
        <DefaultLayout>
            <MineLayout>
                <MyMessage />
            </MineLayout>
        </DefaultLayout>
    );
};

export default UsersMine;

/**我的消息 */
const MyMessage: React.FC = () => {

    const [activeKey, setActiveKey] = useState<string>("1");

    const commentRef = React.createRef<CommentsRefProps>();
    const privateLettersRef = React.createRef<PrivateLettersRefProps>();
    const likeRef = React.createRef<LikeRefProps>();
    const systemRef = React.createRef<SystemRefProps>();

    const [commentNum, setCommentNum] = useState<number>(0);
    const [letterNum, setLetterNum] = useState<number>(0);
    const [praiseNum, setPraiseNum] = useState<number>(0);
    const [systemNum, setsystemNum] = useState<number>(0);

    const onSearch = (value: string) => {
        switch (activeKey) {
            case "1":
                commentRef.current?.onSearch(value);
                break;
            case "2":
                privateLettersRef.current?.onSearch(value);
                break;
            case "3":
                likeRef.current?.onSearch(value);
                break;
            case "4":
                systemRef.current?.onSearch(value);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        pageMessageNum().then((res) => {
            let { commentNum, letterNum, praiseNum, systemNum } = res.data
            setCommentNum(commentNum)
            setLetterNum(letterNum)
            setPraiseNum(praiseNum)
            setsystemNum(systemNum)
        });
    }, []);

    const tabBarExtraContent = <Input.Search
        placeholder="请输入关键词搜索"
        onSearch={onSearch}
    />

    return (
        <Card bordered={false} title={"我的消息"}>
            <Tabs
                activeKey={activeKey}
                onChange={setActiveKey}
                size={"large"}
                tabBarExtraContent={tabBarExtraContent}
            >
                <Tabs.TabPane tab={`评论(${commentNum})`} key="1">
                    <Comments ref={commentRef} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={`私信(${letterNum})`} key="2">
                    <PrivateLetters ref={privateLettersRef} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={`赞(${praiseNum})`} key="3">
                    <Like ref={likeRef} />
                </Tabs.TabPane>
                <Tabs.TabPane tab={`系统(${systemNum})`} key="4">
                    <System ref={systemRef} />
                </Tabs.TabPane>
            </Tabs>
        </Card>
    )
}

/**评论 */
interface CommentsRefProps {
    onSearch: (keyword: string) => void;
}
interface CommentsProps {

}
const Comments = React.forwardRef<CommentsRefProps, CommentsProps>((props, ref) => {

    const [params, setParams] = useState<SearchPageParams>({ current: 1, size: 10 });
    const [dataSource, setDataSource] = useState<PageSource<CommentProps>>();
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    const [loading, setLoading] = useState<boolean>(false);

    const onSearch = (keyword: string) => {
        setParams({ ...params, keyword });
    }

    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    }

    const loadData = () => {
        setLoading(true);
        getKjzdUserCommentUser(params)
            .then((res) => {
                setDataSource(res.data);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    useImperativeHandle(ref, () => ({
        onSearch
    }));

    useEffect(loadData, [params]);

    const pagination: false | PaginationConfig = dataSource?.total
        ? ({
            total: dataSource.total,
            current: dataSource.current,
            pageSize: dataSource.size,
            onChange: onChange
        })
        : false;

    return <List
        loading={loading}
        dataSource={dataSource?.records}
        pagination={pagination}
        renderItem={(item) => (
            <List.Item >
                <List.Item.Meta
                    avatar={<Avatar src={userInfo?.avatar} />}
                    title={userInfo?.nick}
                    description={(
                        <div
                            className="rich-text"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    )}
                />
            </List.Item>
        )}
    />
})

/**私信 */
interface PrivateLettersRefProps {
    onSearch: (keyword: string) => void;
}
interface PrivateLettersProps {
}
const PrivateLetters = React.forwardRef<PrivateLettersRefProps, PrivateLettersProps>((props, ref) => {

    const [params, setParams] = useState<SearchPageParams>({ current: 1, size: 10 });
    const [dataSource, setDataSource] = useState<PageSource>();
    const [loading, setLoading] = useState<boolean>(false);

    const onSearch = (keyword: string) => {
        setParams({ ...params, keyword });
    }

    const onChange = (current: number, size: number) => {
        setParams({ current, size });
    }

    const loadData = () => {
        setLoading(true);
        pageUserLetter(params)
            .then((res) => {
                setDataSource(res.data);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    useImperativeHandle(ref, () => ({
        onSearch
    }));

    useEffect(loadData, [params]);

    const pagination: false | PaginationConfig = dataSource?.total
        ? ({
            total: dataSource.total,
            current: dataSource.current,
            pageSize: dataSource.size,
            onChange: onChange
        })
        : false;

    return <List
        loading={loading}
        dataSource={dataSource?.records}
        pagination={pagination}
        renderItem={(item) => (
            <List.Item>
                <List.Item.Meta
                    title={item.title}
                    description={item.content}
                />
            </List.Item>
        )}
    />
})

/**点赞 */
interface LikeRefProps {
    onSearch: (keyword: string) => void;
}
interface LikeProps {

}
const Like = React.forwardRef<LikeRefProps, LikeProps>((props, ref) => {

    const [params, setParams] = useState<SearchPageParams>({ current: 1, size: 10 });
    const [dataSource, setDataSource] = useState<PageSource>();
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    const [loading, setLoading] = useState<boolean>(false);

    const loadData = () => {
        setLoading(true);
        pageUserPraise(params)
            .then((res) => {
                setDataSource(res.data);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const onSearch = (keyword: string) => {
        setParams({ ...params, keyword });
    }

    const onChange = (current: number, size: number) => {
        setParams({ current, size });
    }

    useImperativeHandle(ref, () => ({
        onSearch
    }));

    useEffect(loadData, [params]);

    const pagination: false | PaginationConfig = dataSource?.total
        ? ({
            current: dataSource.current,
            total: dataSource.total,
            pageSize: dataSource.size,
            onChange: onChange
        })
        : false;

    return <List
        loading={loading}
        dataSource={dataSource?.records}
        pagination={pagination}
        renderItem={(item) => (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar src={userInfo?.avatar} />}
                    title={item.fromUserName}
                    description={item.content}
                />
            </List.Item>
        )}
    />
})

/**系统 */
interface SystemRefProps {
    onSearch: (keyword: string) => void;
}
interface SystemProps {
}
const System = React.forwardRef<SystemRefProps, SystemProps>((props, ref) => {

    const [params, setParams] = useState<SearchPageParams>({ current: 1, size: 10 });
    const [dataSource, setDataSource] = useState<PageSource<SystemMessageProps>>();
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);
    const [loading, setLoading] = useState<boolean>(false);

    const loadData = () => {
        setLoading(true);
        pageNewsContent(params)
            .then((res) => {
                setDataSource(res.data);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const onSearch = (keyword: string) => {
        setParams({ ...params, keyword });
    }

    const onChange = (current: number, size: number) => {
        setParams({ current, size });
    }

    useImperativeHandle(ref, () => ({
        onSearch
    }));

    useEffect(loadData, [params]);

    const pagination: false | PaginationConfig = dataSource?.total
        ? ({
            total: dataSource.total,
            current: dataSource.current,
            pageSize: dataSource.size,
            onChange: onChange
        })
        : false;

    return <List
        loading={loading}
        dataSource={dataSource?.records}
        pagination={pagination}
        renderItem={(item) => (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar src={userInfo?.avatar} />}
                    title={userInfo?.nick}
                    description={item.content}
                />
            </List.Item>
        )}
    />
})

interface MessageProps {
    avatar: string;
    title: string;
    content: string;
}

const Message: React.FC<MessageProps> = ({ avatar, title, content }) => {
    return <Fragment>

    </Fragment>
}