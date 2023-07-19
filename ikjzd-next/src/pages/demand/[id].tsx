import { getDemand, getDemandPage } from "@/apis/demand";
import Authorization from "@/components/Authorization";
import Center from "@/components/Center";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Demand } from "@/vo/Demand";
import { PageParams, PageSource } from "@/vo/PageParams";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  List,
  Modal,
  Row,
  Space,
} from "antd";
import moment from "moment";
import { NextPage } from "next";
import Link from "next/link";
import React, { Fragment, Key, useContext, useState } from "react";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-demand-id`,
});

interface DemandDetailContextProps extends DemandDetailPageProps {}

const DemandDetailContext = React.createContext<DemandDetailContextProps>(
  {} as DemandDetailContextProps
);

interface DemandDetailPageProps {
  demand: Demand;
  initDemands: PageSource<Demand>;
}

/**海外需求详情 */
const DemandDetailPage: NextPage<DemandDetailPageProps> = (props) => {
  const ctxValue: DemandDetailContextProps = {
    ...props,
  };

  return (
    <DemandDetailContext.Provider value={ctxValue}>
      <DefaultLayout>
        <Details />
        <div className={labelCls}>最新需求</div>
        <Demands />
      </DefaultLayout>
    </DemandDetailContext.Provider>
  );
};

DemandDetailPage.getInitialProps = async (ctx) => {
  const id = ctx.query.id as Key;

  const params: PageParams = {
    current: 1,
    size: 10,
    status: "JXZ",
  };

  const demand = (await getDemand(id)).data;
  const initDemands = (await getDemandPage(params)).data;
  return {
    demand,
    initDemands,
  };
};

export default DemandDetailPage;

const labelCls = css`
  height: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  line-height: 24px;
  margin: 15px 0;
  position: relative;
  padding-left: 10px;

  &::before {
    content: "";
    height: 16px;
    width: 2px;
    display: block;
    background-color: ${process.env.PRIMARY_COLOR};
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
`;

/**详情 */
const Details: React.FC = () => {
  const { demand } = useContext(DemandDetailContext);
  const onShowMobile = () => {
    Modal.info({
      icon: false,
      title: "联系方式",
      centered: true,
      closable: true,
      content: (
        <Fragment>
          <Row gutter={[10, 10]} className={"mt-[30px]"}>
            <Col span={5} className={"text-left color-[#666666]"}>
              联系人:
            </Col>
            <Col span={16}>{demand.name}</Col>
            <Col span={5} className={"text-left color-[#666666]"}>
              手机号:
            </Col>
            <Col span={16}>{demand.mobile}</Col>
            <Col span={5} className={"text-left color-[#666666]"}>
              邮箱:
            </Col>
            <Col span={16}>{demand.email || "-"}</Col>
            <Col span={5} className={"text-left color-[#666666]"}>
              微信:
            </Col>
            <Col span={16}>{demand.wechat || "-"}</Col>
            <Col span={5} className={"text-left color-[#666666]"}>
              QQ:
            </Col>
            <Col span={16}>{demand.qq || "-"}</Col>
          </Row>
        </Fragment>
      ),
    });
  };

  const cxCls = css`
    padding: 16px 20px;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    line-height: 22px;
    background-color: #f6f9faff;
    margin-bottom: 20px;
    min-height: 150px;
  `;

  const activeCls = css`
    background-color: #f676a633 !important;
    color: #f676a6ff !important;
    float: right;
  `;
  const noCls = css`
    float: right;
  `;

  return (
    <Card bordered={false}>
      <h1 className="mb-[5px] color-[#000000e6] fw-500 fs-[22px]">
        标题：{demand.title}
        {demand.status === "JXZ" ? (
          <Button size={"small"} type={"link"} className={activeCls}>
            进行中
          </Button>
        ) : (
          <Button size={"small"} className={noCls}>
            已结束
          </Button>
        )}
      </h1>
      <div className="flex colume-between mb-[20px]">
        <div className="flex h-[40px] fh-[40px]">
          <div className="mr-[30px] color-[#000000e6]">
            <span className="color-[#00000066] mr-[10px]">需求人:</span>
            <span>{demand.name}</span>
          </div>
          <div className="mr-[30px] color-[#000000e6]">
            <span className="color-[#00000066] mr-[10px]">创建时间:</span>
            <span>{demand.createdAt}</span>
          </div>
          {/* <div className="mr-[30px] color-[#000000e6]">
                        <span className="color-[#00000066] mr-[10px]">商家参与:</span>
                        <span>{demand.participationNum}次</span>
                    </div> */}
          <div className="mr-[30px] color-[#000000e6]">
            <span className="color-[#00000066] mr-[10px]">需求类型:</span>
            <span>{demand.typeName}</span>
          </div>
        </div>
        <Authorization.Valid>
          <Button
            shape={"round"}
            size={"large"}
            type={"primary"}
            onClick={onShowMobile}
            disabled={demand.status === "YJJ"}
          >
            查看联系方式
          </Button>
        </Authorization.Valid>
      </div>

      <div className={cxCls}>具体要求：{demand.content}</div>

      <div className="text-center">
        <p className="color-[#000000e6] fs-[5px] fs-[16px]">
          跨境垂直互助圈，有需求就找跨境乔帮主
        </p>
        <Avatar
          size={130}
          shape={"square"}
          src={"/asset/image/qr-code/2022-11-28/qbz.jpeg"}
          className={"mt-[15px] mb-[5px]"}
        />
      </div>
    </Card>
  );
};

/**最新海外需求 */
const Demands: React.FC = () => {
  const { initDemands } = useContext(DemandDetailContext);
  const { records, pages, current, size } = initDemands;

  const [demands, setDemands] = useState<Demand[]>(records);
  const [notMore, setNotMore] = useState<boolean>(current >= pages);
  const [params, setParams] = useState<PageParams>({ current, size });
  const [loading, setLoading] = useState<boolean>(false);

  const Actions: React.FC<Demand> = (props) => {
    const diffDays = Math.abs(moment().diff(props.endTime, "days"));
    const cls = css`
      color: ${process.env.PRIMARY_COLOR};
      margin-right: 10px;
    `;

    return (
      <Space size={40}>
        <div>
          <div>{props.name}</div>
          <div>{props.createdAt}</div>
        </div>
        <div>
          <span className={cls}>{diffDays}天后</span>截止
        </div>
      </Space>
    );
  };

  const LoadMoreButton: React.FC = () => {
    const loadMore = () => {
      const nextParams = { ...params, current: Number(params.current) + 1 };
      setLoading(true);
      getDemandPage(nextParams)
        .then(({ data }) => {
          setDemands([...demands, ...data.records]);
          setParams({ current: data.current, size: data.size });
          setNotMore(current >= pages);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    return (
      <Center>
        <Button
          onClick={loadMore}
          size={"large"}
          shape={"round"}
          type={"primary"}
          ghost
          className="px-[10px]"
          disabled={notMore}
          loading={loading}
        >
          {notMore ? "没有更多了" : "加载更多"}
        </Button>
      </Center>
    );
  };

  if (!demands.length) {
    return (
      <Card bordered={false}>
        <Empty />
      </Card>
    );
  }

  return (
    <Card bordered={false}>
      <List loadMore={<LoadMoreButton />}>
        {demands.map((demand) => {
          const title = (
            <Link href={"/demand/[id]"} as={`/demand/${demand.id}`}>
              <a className="fs-[18px] fw-500 color-[#000000e6]">
                {demand.title}
              </a>
            </Link>
          );

          const content = (
            <Link href={"/demand/[id]"} as={`/demand/${demand.id}`}>
              <a className="color-[#00000099] block lc-2">{demand.content}</a>
            </Link>
          );

          return (
            <List.Item actions={[<Actions {...demand} />]} key={demand.id}>
              <List.Item.Meta title={title} description={content} />
            </List.Item>
          );
        })}
      </List>
    </Card>
  );
};
