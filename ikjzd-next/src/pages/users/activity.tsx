import DefaultLayout from "@/components/layouts/DefaultLayout";
import Link from "next/link";
import React, {
    Fragment,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Tabs,
    Input,
    List,
    Table,
    Card,
    Avatar,
    Typography,
} from "antd";
import { Activity, Sponsor, activityTicketsDTO } from "@/vo/Users";
import {
    getJoinActivities,
    getJoinActivitiesCount,
    getKjzdActivityList,
    getKjzdActivitySponsorList,
    getPublishActivitiesCount,
} from "@/apis/users";
import MineLayout from "@/components/users/MineLayout";
import { find, sum } from "lodash";
import { ColumnsType } from "antd/lib/table";
import { PageParams, PageSource } from "@/vo/PageParams";
import { PaginationConfig } from "antd/lib/pagination";
import moment from "moment";
import Authorization from "@/components/Authorization";
import { useRouter } from "next/router";
import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
    key: `${process.env.CLASS_PREFIX}-cs-authorization`,
});
import LazyLoad from "react-lazyload";

const UsersActivityPage: React.FC = () => {
    return (
        <DefaultLayout>
            <MineLayout>
                <MyActivity />
            </MineLayout>
        </DefaultLayout>
    );
};

export default UsersActivityPage;

interface ApplicationRefProps {
    onSearch: (value: string) => void;
}

/**我的活动 */
const MyActivity: React.FC = () => {
    const { push } = useRouter();
    const [sponsorList, setSponsorList] = useState<PageSource<Sponsor>>();
    const cardExtra = (
        <Authorization.Valid>
            <Button className="pg-mr-2" onClick={() => push(sponsorList?.records.length ? "/acd/publish" : '/acd/sponsor')}>
                <PlusOutlined />
                发布活动
            </Button>
        </Authorization.Valid>
    );
    useEffect(() => {
        getKjzdActivitySponsorList({ current: 1, size: 100, status: 1 }).then((res) => {
            setSponsorList(res.data);
        });
    }, [])
    return (
        <Card bordered={false} title={"我的活动"} extra={cardExtra}>
            <MineArticle />
        </Card>
    );
};

/**活动数据 */
const MineArticle: React.FC = () => {
    const [keyword, setKeyword] = useState<string>("");
    const [activeKey, setActiveKey] = useState<string>("1");

    const mineActivityTabRef = React.createRef<ApplicationRefProps>();
    const minePublishTabRef = React.createRef<ApplicationRefProps>();
    const myApplicationRef = React.createRef<ApplicationRefProps>();

    const onSearch = (value: string) => {
        setKeyword(value);
        if (activeKey === "1") {
            mineActivityTabRef.current?.onSearch(value);
        } else if (activeKey === "2") {
            minePublishTabRef.current?.onSearch(value);
        } else {
            myApplicationRef.current?.onSearch(value);
        }
    };

    const tabBarExtra = (
        <Input.Search onSearch={onSearch} placeholder="请输入关键词搜索" />
    );

    return (
        <Tabs
            size={"large"}
            tabBarExtraContent={tabBarExtra}
            activeKey={activeKey}
            onChange={setActiveKey}
        >
            <Tabs.TabPane tab={"我参与的活动"} key="1">
                <MineActivityTab ref={mineActivityTabRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"我发布的活动"} key="2">
                <MinePublishTab ref={minePublishTabRef} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={"我的申请"} key="3">
                <MyApplication ref={myApplicationRef} />
            </Tabs.TabPane>
        </Tabs>
    );
};

/**我参与的活动tab */
const MineActivityTab = React.forwardRef<ApplicationRefProps>((_, ref) => {
    const [dataSource, setDataSource] = useState<PageSource<Activity>>();
    const [params, setParams] = useState<
        PageParams & { progress?: string; keyword?: string }
    >({ current: 1, size: 10 });
    const [count, setCount] = useState<number>(0);
    const [signingUp, setSigningUp] = useState<number>(0);
    const [processing, setProcessing] = useState<number>(0);
    const [ended, setEnded] = useState<number>(0);

    const cls = css`
    width: 100%;
    height: 220px;
    border: 1px solid #e5e5e5;
    position: relative;
    margin-bottom: 20px;
    .img {
      width: 158px;
      height: 99px;
      background: #d9ddde;
      border-radius: 4px;
      margin-right: 15px;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .text {
      width: 100%;
      .status {
        width: 60px;
        height: 27px;
        font-size: 14px;
        color: #ffffff;
        line-height: 27px;
        text-align: center;
      }
      .ended {
        background: #f676a6;
      }
      .cing {
        background: #ff9e4a;
      }
    }
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: #f9f9f9;
      border: 1px solid #ededed;
      padding: 0px 15px;
      color: #999999;
    }
    .content {
      padding: 0px 15px;
      height: 40px;
      line-height: 40px;
    }
    .w20 {
      width: 20%;
    }
    .w10 {
      width: 10%;
    }
    .w15 {
      width: 15%;
    }
    .w30 {
      width: 30%;
    }
    .ikjzd-list-item {
      border-bottom: none;
    }
  `;

    const loadData = () => {
        getJoinActivities(params).then((res) => {
            setDataSource(res.data);
        });
    };

    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    };

    const onStatusChange = (progress: string) => {
        setParams({ ...params, progress });
    };

    const onSearch = (keyword: string) => {
        setParams({ ...params, keyword });
    };

    useEffect(loadData, [params]);

    useEffect(() => {
        getJoinActivitiesCount().then((res) => {
            /**全部 */
            setCount(sum(res.data.map((activitie) => activitie.count)));
            /**报名中 */
            setSigningUp(
                find(res.data, (activitie) => activitie.key === "signingUp")?.count || 0
            );
            /**进行中 */
            setProcessing(
                find(res.data, (activitie) => activitie.key === "processing")?.count ||
                0
            );
            /**已结束 */
            setEnded(
                find(res.data, (activitie) => activitie.key === "ended")?.count || 0
            );
        });
    }, []);

    useImperativeHandle(ref, () => ({
        onSearch,
    }));

    const Table: React.FC<{ item: Activity }> = ({ item }) => {
        return (
            <div className="table">
                <div className="title">
                    <div className="inline-block w20">主办方</div>
                    <div className="inline-block w10">票种</div>
                    <div className="inline-block w15">票价</div>
                    <div className="inline-block w10">数量</div>
                    <div className="inline-block w15">总价</div>
                    <div className="inline-block w30">报名信息</div>
                </div>
                <div className="content">
                    <div className="inline-block w20">{item.userName || "-"}</div>
                    <div className="inline-block w10">{item.name}</div>
                    <div className="inline-block w15">￥{item.price}</div>
                    <div className="inline-block w10">{item.pubNum}</div>
                    <div className="inline-block w15">￥{item.price * item.pubNum}</div>
                    <div className="inline-block w30" title={item.applicant}>
                        {/* {item.startTime.length > 15
              ? item.startTime.substring(0, 15) + "..."
              : item.startTime} */}
                        {item.applicant}
                        {item.applicantMobile && <span>({item.applicantMobile})</span>}
                    </div>
                </div>
            </div>
        );
    };

    const pagination: false | PaginationConfig = dataSource?.total
        ? {
            total: dataSource.total,
            current: dataSource.current,
            pageSize: dataSource.size,
            onChange: onChange,
        }
        : false;

    return (
        <Fragment>
            <Tabs
                size={"small"}
                onChange={onStatusChange}
                activeKey={params.progress}
            >
                <Tabs.TabPane tab={`全部(${count})`} />
                <Tabs.TabPane tab={`报名中(${signingUp})`} key="1" />
                <Tabs.TabPane tab={`进行中(${processing})`} key="2" />
                <Tabs.TabPane tab={`已结束(${ended})`} key="3" />
            </Tabs>
            <List
                dataSource={dataSource?.records}
                pagination={pagination}
                renderItem={(item) => (
                    //   <List.Item>
                    <div className={cx(cls)}>
                        <div className="flex px-[15px] py-[15px]">
                            <LazyLoad height={99}>
                                <div className="img">
                                    <img
                                        src={item.posterUrl || "/asset/image/normal-error.png"}
                                        alt={item.title}
                                    />
                                </div>
                            </LazyLoad>
                            <div className="text">
                                <h2 className="fs-[20px] fw-500 mb-[20px]">
                                    {item.title}
                                    {item.activityPrescriptionName === "已结束" && (
                                        <span className="status float-right ended">已结束</span>
                                    )}
                                    {item.activityPrescriptionName !== "已结束" && (
                                        <span className="status float-right cing">
                                            {item.activityPrescriptionName}
                                        </span>
                                    )}
                                </h2>
                                <p className="color-[#999999]">地点：{item.address}</p>
                                <p className="color-[#999999]">
                                    时间：{item.startTime}到{item.endTime}
                                </p>
                            </div>
                        </div>
                        {/* {item.activityTicketsDTOList?.length > 0 && (
                <Table activityTicketsDTOList={item.activityTicketsDTOList} />
              )} */}
                        <Table item={item} />
                    </div>
                    //   </List.Item>
                )}
            />
        </Fragment>
    );
});

/**我发布的活动tab */
const MinePublishTab = React.forwardRef<ApplicationRefProps>((_, ref) => {
    const [params, setParams] = useState<
        PageParams & { auditStatus?: string; keyword?: string }
    >({ current: 1, size: 10 });
    const [dataSource, setDataSource] = useState<PageSource<Activity>>();

    const [count, setCount] = useState<number>(0);
    const [pendingReview, setPendingReview] = useState<number>(0);
    const [reviewed, setReviewed] = useState<number>(0);
    const [turnDown, setTurnDown] = useState<number>(0);

    const loadData = () => {
        getKjzdActivityList(params).then((res) => {
            setDataSource(res.data);
        });
    };

    /**切换状态 */
    const auditChange = (auditStatus: string) => {
        setParams({ ...params, auditStatus });
    };

    /**分页 */
    const onChange = (current: number, size: number) => {
        setParams({ ...params, current, size });
    };

    const onSearch = (keyword: string) => {
        setParams({ ...params, keyword });
    };

    const pagination: false | PaginationConfig = dataSource?.total
        ? {
            total: dataSource.total,
            current: dataSource.current,
            pageSize: dataSource.size,
            onChange: onChange,
        }
        : false;

    useEffect(loadData, [params]);

    useEffect(() => {
        getPublishActivitiesCount().then((res) => {
            /**全部 */
            setCount(sum(res.data.map((activitie) => activitie.count)) || 0);
            /**待审核 */
            setPendingReview(
                find(res.data, (activitie) => activitie.key === "pendingReview")
                    ?.count || 0
            );
            /**已审核 */
            setReviewed(
                find(res.data, (activitie) => activitie.key === "reviewed")?.count || 0
            );
            /**驳回 */
            setTurnDown(
                find(res.data, (activitie) => activitie.key === "turnDown")?.count || 0
            );
        });
    }, []);

    useImperativeHandle(ref, () => ({
        onSearch,
    }));

    return (
        <Fragment>
            <Tabs
                activeKey={params.auditStatus}
                size={"small"}
                onChange={auditChange}
            >
                <Tabs.TabPane tab={`全部(${count})`} />
                <Tabs.TabPane tab={`待审核(${pendingReview})`} key="0" />
                <Tabs.TabPane tab={`已发布(${reviewed})`} key="1" />
                <Tabs.TabPane tab={`被驳回(${turnDown})`} key="2" />
            </Tabs>
            <List
                dataSource={dataSource?.records}
                pagination={pagination}
                renderItem={(item) => {
                    let statusStr: string;
                    if (item.auditStatus === 0) {
                        statusStr = "待审核";
                    } else if (item.auditStatus == 2) {
                        statusStr = "被驳回";
                    } else if (moment(item.startTime).diff(moment()) > 0) {
                        statusStr = "报名中";
                    } else if (moment(item.endTime).diff(moment()) < 0) {
                        statusStr = "已结束";
                    } else {
                        statusStr = "进行中";
                    }

                    const status = <Button type="text">{statusStr}</Button>;

                    const edit = (
                        <Link href={"/"}>
                            <a>
                                <Button type={"link"} size={"small"}>
                                    编辑
                                </Button>
                            </a>
                        </Link>
                    );

                    const actions: React.ReactNode[] = [status, edit];
                    return (
                        <List.Item actions={actions}>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={item.posterUrl}
                                        shape={"square"}
                                        style={{ width: 240, height: 150 }}
                                    />
                                }
                                title={
                                    <Typography.Title level={4}>{item.title}</Typography.Title>
                                }
                                description={
                                    <Fragment>
                                        <p>
                                            活动地点: {item.province}
                                            {item.city}
                                            {item.area}
                                            {item.address}
                                        </p>
                                        <p>
                                            活动时间: {item.startTime} 到 {item.endTime}
                                        </p>
                                        <p>发布时间: {item.createdAt}</p>
                                    </Fragment>
                                }
                            />
                        </List.Item>
                    );
                }}
            />
        </Fragment>
    );
});

/**我的申请 */
const MyApplication = React.forwardRef<ApplicationRefProps>((_, ref) => {
    const statusMap = ["待审核", "通过", "拒绝"];
    const columns: ColumnsType<Sponsor> = [
        { title: "主办方名称", dataIndex: "name", key: "name" },
        { title: "地址", dataIndex: "address", key: "address" },
        { title: "联系人", dataIndex: "contacts", key: "contacts" },
        { title: "联系电话", dataIndex: "mobile", key: "mobile" },
        { title: "申请理由", dataIndex: "reason", key: "reason" },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (_, record) => <div>{statusMap[record.status]}</div>,
        },
    ];
    const [params, setParams] = useState<PageParams>({ current: 1, size: 100 });
    const [sponsorList, setSponsorList] = useState<PageSource<Sponsor>>();

    const loadData = () => {
        getKjzdActivitySponsorList(params).then((res) => {
            setSponsorList(res.data);
        });
    };

    const onSearch = (value: string) => {
        setParams({ ...params, keyword: value });
    };

    useEffect(loadData, [params]);

    useImperativeHandle(ref, () => ({
        onSearch,
    }));

    return (
        <Table
            rowKey="id"
            dataSource={sponsorList?.records}
            columns={columns}
            pagination={false}
        />
    );
});
