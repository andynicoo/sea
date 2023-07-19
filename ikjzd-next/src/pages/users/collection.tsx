import DefaultLayout from "@/components/layouts/DefaultLayout";
import React, { Fragment, Key, useEffect, useState, useContext } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  List,
  Row,
  Space,
  Tabs,
  Typography,
  message,
  Modal,
} from "antd";
import { Activity, Resources } from "@/vo/Users";
import {
  collectPagekjzdActivity,
  collectPageKjzdArticle,
  collectPagekjzdEncyclopedia,
  collectPageKjzdTools,
  collectPagekjzdPost,
} from "@/apis/users";
import MineLayout from "@/components/users/MineLayout";
import { PageParams, PageSource } from "@/vo/PageParams";
import Article from "@/vo/Article";
import Encyclopedia from "@/vo/Encyclopedia";
import { PaginationConfig } from "antd/lib/pagination";
import { unoperateCollect } from "@/apis/home";
import Link from "next/link";
import Icon from "@/components/Icon";
import { Bbs } from "@/vo/Bbs";
import { operateCollectCancel } from "@/apis/public";

interface MyCollectionContextProps {
  handleUnOperateCollect: (type: Key, otherId: Key) => Promise<void>;
}

const MyCollectionContext = React.createContext<MyCollectionContextProps>(
  {} as MyCollectionContextProps
);

const UsersCollection: React.FC = () => {
  const handleUnOperateCollect = async (type: Key, otherId: Key) => {
    await unoperateCollect({ type, otherId });
    message.success("取消收藏成功");
  };

  const ctxValue: MyCollectionContextProps = {
    handleUnOperateCollect,
  };

  return (
    <MyCollectionContext.Provider value={ctxValue}>
      <DefaultLayout>
        <MineLayout>
          <MyCollection />
        </MineLayout>
      </DefaultLayout>
    </MyCollectionContext.Provider>
  );
};

export default UsersCollection;

/**我的收藏 */
const MyCollection: React.FC = () => {
  return (
    <Card bordered={false} title={"我的收藏"}>
      <Tabs size={"large"}>
        <Tabs.TabPane tab={"文章"} key="1">
          <ArticleList />
        </Tabs.TabPane>
        <Tabs.TabPane tab={"帖子"} key="2">
          <PostList />
        </Tabs.TabPane>
        <Tabs.TabPane tab={"百科"} key="3">
          <EncyclopediaList />
        </Tabs.TabPane>
        <Tabs.TabPane tab={"资源"} key="4">
          <ResourceList />
        </Tabs.TabPane>
        <Tabs.TabPane tab={"活动"} key="5">
          <ActivityList />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

/**文章列表 */
export const ArticleList: React.FC = () => {
  const [params, setParams] = useState<PageParams>({ current: 1, size: 10 });
  const [collectionData, setCollectionData] = useState<PageSource<Article>>();
  const { handleUnOperateCollect } = useContext(MyCollectionContext);

  const loadData = () => {
    collectPageKjzdArticle(params).then((res) => {
      setCollectionData(res.data);
    });
  };

  const onChange = (current: number, size: number) =>
    setParams({ current, size });

  const pagination: false | PaginationConfig = collectionData?.total
    ? {
        current: collectionData.current,
        pageSize: collectionData.size,
        total: collectionData.total,
        onChange: onChange,
      }
    : false;

  useEffect(loadData, [params]);

  const onUnOperateCollect = (id: Key) => {
    handleUnOperateCollect(1, id).then(loadData);
  };

  return (
    <List
      dataSource={collectionData?.records}
      pagination={pagination}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Link href={"/articles/[id]"} as={`/articles/${item.id}`}>
                <a>
                  <Avatar
                    src={item.thumbPicUrl}
                    shape={"square"}
                    style={{ width: 240, height: 150 }}
                  />
                </a>
              </Link>
            }
            title={
              <Link href={"/articles/[id]"} as={`/articles/${item.id}`}>
                <a>
                  <Typography.Title level={4}>{item.title}</Typography.Title>
                </a>
              </Link>
            }
            description={
              <Space direction="vertical" style={{ width: "100%" }}>
                <Typography.Paragraph ellipsis={{ rows: 3 }}>
                  {item.description}
                </Typography.Paragraph>
                <Row justify={"space-between"}>
                  <Col span={20}>
                    <Space>
                      <Avatar src={item.user?.avatar} />
                      <Typography.Text>{item.user?.nick}</Typography.Text>
                    </Space>
                  </Col>
                  <Col>
                    <Button
                      type={"link"}
                      onClick={() => onUnOperateCollect(item.id)}
                    >
                      取消收藏
                    </Button>
                  </Col>
                </Row>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};

/**百科列表 */
export const EncyclopediaList: React.FC = () => {
  const [params, setParams] = useState<PageParams>({ current: 1, size: 10 });
  const [collectionData, setCollectionData] =
    useState<PageSource<Encyclopedia>>();

  const onChange = (current: number, size: number) => {
    setParams({ current, size });
  };

  const onUnOperateCollect = (otherId: Key) => {
    operateCollectCancel({ type: 5, otherId }).then(
      loadData,
      message.success("取消收藏成功")
    );
  };

  const loadData = () => {
    collectPagekjzdEncyclopedia(params).then((res) => {
      setCollectionData(res.data);
    });
  };

  useEffect(loadData, [params]);

  const pagination: false | PaginationConfig = collectionData?.total
    ? {
        current: collectionData.current,
        pageSize: collectionData.size,
        total: collectionData.total,
        onChange: onChange,
      }
    : false;

  return (
    <List
      dataSource={collectionData?.records}
      pagination={pagination}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Link href={"/w/[id]"} as={`/w/${item.id}`}>
                <a>
                  <Avatar
                    src={item.thumbUrl}
                    shape={"square"}
                    style={{ width: 240, height: 150 }}
                  />
                </a>
              </Link>
            }
            title={
              <Link href={"/w/[id]"} as={`/w/${item.id}`}>
                <a>
                  <Typography.Title level={4}>{item.title}</Typography.Title>
                </a>
              </Link>
            }
            description={
              <Space direction="vertical" style={{ width: "100%" }}>
                <Typography.Paragraph ellipsis={{ rows: 3 }}>
                  {item.summary}
                </Typography.Paragraph>
                <Row justify={"space-between"}>
                  <Col span={20}>
                    <Space>
                      <a>
                        <Icon type={"icon-dianzan"} className="fs-[18px]" />
                        {item.praiseNum}
                      </a>
                      <a>
                        <Icon type={"icon-shoucang"} className="fs-[18px]" />
                        {item.collectNum}
                      </a>
                    </Space>
                  </Col>
                  <Col>
                    <Button
                      type={"link"}
                      onClick={() => onUnOperateCollect(item.id)}
                    >
                      取消收藏
                    </Button>
                  </Col>
                </Row>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};

/**帖子列表 */
export const PostList: React.FC = () => {
  const [params, setParams] = useState<PageParams>({ current: 1, size: 10 });
  const [collectionData, setCollectionData] =
    useState<PageSource<Encyclopedia>>();

  const onChange = (current: number, size: number) => {
    setParams({ current, size });
  };

  const onUnOperateCollect = (otherId: Key) => {
    // handleUnOperateCollect(1, id).then(loadData);
    operateCollectCancel({ type: 3, otherId }).then(
      loadData,
      message.success("取消收藏成功")
    );
  };

  const loadData = () => {
    collectPagekjzdPost(params).then((res) => {
      setCollectionData(res.data);
    });
  };

  useEffect(loadData, [params]);

  const pagination: false | PaginationConfig = collectionData?.total
    ? {
        current: collectionData.current,
        pageSize: collectionData.size,
        total: collectionData.total,
        onChange: onChange,
      }
    : false;

  return (
    <List
      dataSource={collectionData?.records}
      pagination={pagination}
      renderItem={(item) => (
        <List.Item>
          <div style={{ width: "100%" }}>
            <Link href={"/k/[id]"} as={`/k/${item.id}`}>
              <a>
                <h2>{item.title}</h2>{" "}
              </a>
            </Link>
            <div className="mt-[20px]">
              <Row>
                <Col span={22}>
                  <a>
                    <Icon type={"icon-yanjing"} className="fs-[16px]" />
                    {item.readNum}
                  </a>
                  <a>
                    <Icon type={"icon-pinglun"} className="fs-[16px]" />
                    {item.commentNum}
                  </a>
                </Col>
                <Col span={2}>
                  <Button
                    type={"link"}
                    onClick={() => onUnOperateCollect(item.id)}
                  >
                    取消收藏
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
};

/**文章资源列表 */
export const ResourceList: React.FC = () => {
  const [params, setParams] = useState<PageParams>({ current: 1, size: 10 });
  const [collectionData, setCollectionData] = useState<PageSource<Resources>>();

  const onChange = (current: number, size: number) =>
    setParams({ current, size });

  const loadData = () => {
    collectPageKjzdTools(params).then((res) => {
      setCollectionData(res.data);
    });
  };

  const onUnOperateCollect = (otherId: Key) => {
    operateCollectCancel({ type: 4, otherId }).then(
      loadData,
      message.success("取消收藏成功")
    );
  };

  useEffect(loadData, [params]);

  const pagination: false | PaginationConfig = collectionData?.total
    ? {
        current: collectionData.current,
        pageSize: collectionData.size,
        total: collectionData.total,
        onChange: onChange,
      }
    : false;
  return (
    <List
      dataSource={collectionData?.records}
      pagination={pagination}
      renderItem={(item) => {
        const description = (
          <Space>
            <span>适用平台:{item?.toolsPlatformId}</span>
            <span>资源大小:{item.enclosureSize ? (parseInt(item.enclosureSize)/1024).toFixed(2) + 'M' : 0 + 'M'}</span>
            <span>下载次数:{item.enclosureDownloadNum}</span>
            <span>所需积分:{item?.integralNum}</span>
          </Space>
        );

        const actions: React.ReactNode[] = [
          <Button type={"link"} onClick={() => onUnOperateCollect(item.id)}>
            取消收藏
          </Button>,
        ];

        return (
          <List.Item actions={actions}>
            <List.Item.Meta
              avatar={
                <Link href={"/tl/[id]"} as={`/tl/${item.id}`}>
                  <a>
                    <Avatar
                      src={"/asset/image/icon/zip.png"}
                      shape={"square"}
                      style={{ width: 56, height: 64 }}
                    />
                  </a>
                </Link>
              }
              title={
                <Link href={"/tl/[id]"} as={`/tl/${item.id}`}>
                  <a>
                    <p>{item.title}</p>
                  </a>
                </Link>
              }
              description={description}
            />
          </List.Item>
        );
      }}
    />
  );
};

/**活动收藏列表 */
export const ActivityList: React.FC = () => {
  const [params, setParams] = useState<PageParams>({ current: 1, size: 10 });
  const [collectionData, setCollectionData] = useState<PageSource<Activity>>();

  const loadData = () => {
    collectPagekjzdActivity(params).then((res) => {
      setCollectionData(res.data);
    });
  };

  const onUnOperateCollect = (otherId: Key) => {
    // handleUnOperateCollect(1, id).then(loadData);
    operateCollectCancel({ type: 6, otherId }).then(
      loadData,
      message.success("取消收藏成功")
    );
  };

  const onChange = (current: number, size: number) =>
    setParams({ current, size });

  useEffect(loadData, [params]);

  const pagination: false | PaginationConfig = collectionData?.total
    ? {
        current: collectionData.current,
        pageSize: collectionData.size,
        total: collectionData.total,
        onChange: onChange,
      }
    : false;

  return (
    <List
      dataSource={collectionData?.records}
      pagination={pagination}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Link href={"/acd/[id]"} as={`/acd/${item.id}`}>
                <a>
                  <Avatar
                    src={item.posterUrl}
                    shape={"square"}
                    style={{ width: 240, height: 150 }}
                  />
                </a>
              </Link>
            }
            title={
              <Link href={"/acd/[id]"} as={`/acd/${item.id}`}>
                <a>
                  <Typography.Title level={5}>{item.title}</Typography.Title>
                </a>
              </Link>
            }
            description={
              <Fragment>
                <Typography.Paragraph>
                  地点: {item.price}
                  {item.city}
                  {item.area}
                  {item.address}
                </Typography.Paragraph>
                <Typography.Paragraph>
                  活动时间: {item.startTime} 到 {item.endTime}
                </Typography.Paragraph>
                <Row>
                  <Col span={21}></Col>
                  <Col span={3}>
                    <Button
                      block
                      type={"link"}
                      size={"small"}
                      onClick={() => onUnOperateCollect(item.id)}
                    >
                      取消收藏
                    </Button>
                  </Col>
                </Row>
              </Fragment>
            }
          />
        </List.Item>
      )}
    />
  );
};
