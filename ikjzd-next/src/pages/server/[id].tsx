import DefaultLayout from "@/components/layouts/DefaultLayout";
import { NextPage } from "next";
import React, { Fragment, Key, useContext, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Thumbs } from "swiper";
import {
  Affix,
  Avatar,
  Button,
  Card,
  Col,
  message,
  Modal,
  Popover,
  Row,
  Space,
} from "antd";
import Link from "next/link";
import { getServerProductDetail, getServerSupplierDetail } from "@/apis/server";
import { Product, Store } from "@/vo/Domain";
import Adviser from "@/components/Adviser";
import Authorization from "@/components/Authorization";
import { operateCollect, unoperateCollect } from "@/apis/home";
import { CustomNextPageContext } from "@/pages/_app";
import createEmotion from "@emotion/css/create-instance";
import SeoHead from "@/components/SeoHead";
import { CheckCircleOutlined } from "@ant-design/icons";

const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-server-id`,
});

SwiperCore.use([Autoplay, Pagination, Thumbs]);

interface SupplierDetailContextProps extends SupplierDetailProps {}

const SupplierDetailContext = React.createContext<SupplierDetailContextProps>(
  {} as SupplierDetailContextProps
);

interface SupplierDetailProps {
  detail: Product;
  supplier: Store;
}

const SupplierDetail: NextPage<SupplierDetailProps> = (props) => {
  const ctxValue: SupplierDetailContextProps = {
    ...props,
  };

  let { name, description } = props.detail;

  return (
    <SupplierDetailContext.Provider value={ctxValue}>
      <DefaultLayout>
        <BannerCard />

        <Row gutter={15}>
          <Col span={18}>
            <Space size={32} direction={"vertical"} className="w-[100%]">
              {/* 服务详情 */}
              <Server />

              {/* 注意事项 */}
              <Precaution />
            </Space>
          </Col>
          <Col span={6}>
            <Affix offsetTop={75}>
              <Space size={32} direction={"vertical"} className="w-[100%]">
                {/* 供应商 */}
                <Supplier />

                {/* 更多服务 */}
                {/* <More /> */}
              </Space>
            </Affix>
          </Col>
        </Row>
      </DefaultLayout>
      <SeoHead title={name} description={description} />
    </SupplierDetailContext.Provider>
  );
};

SupplierDetail.getInitialProps = async (ctx: CustomNextPageContext) => {
  const detail = (await getServerProductDetail(ctx.query.id as Key)).data;
  const supplier = (await getServerSupplierDetail(detail.supplierId)).data;

  return {
    detail,
    supplier,
  };
};

export default SupplierDetail;

/**联系供应商 */
export const onShowConnect = () => {
  const prefix = process.env.CLASS_PREFIX;
  const cls = css`
    .${prefix}-modal-confirm-btns {
      .${prefix}-btn {
        &:first-child {
          display: none;
        }
      }
    }
  `;
  Modal.confirm({
    content: (
      <img
        className="w-[100%]"
        src={`/asset/image/qr-code/2022-11-28/wx.jpeg`}
      />
    ),
    icon: false,
    className: cls,
  });
};

/**顶部轮播、信息卡片 */
const BannerCard: React.FC = () => {
  const { detail } = useContext(SupplierDetailContext);

  /**联系跨境知道顾问 */
  // const onShowAdviser = () => {
  //     Adviser.modal({});
  // };

  const SwiperContent: React.FC = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

    const mainClassns = css`
      height: 219px;
      width: 100%;
      img {
        object-fit: initial;
      }
    `;

    const navClassns = css`
      width: 100%;
      height: 48px;
      img {
        object-fit: initial;
      }
    `;

    return (
      <Space direction={"vertical"} className={"w-[100%]"} size={16}>
        <Swiper thumbs={{ swiper: thumbsSwiper }} autoplay>
          {detail.productImage.map((url, index) => (
            <SwiperSlide key={index}>
              <Avatar src={url} className={mainClassns} shape={"square"} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          autoplay
        >
          {detail.productImage.map((url, index) => (
            <SwiperSlide key={index}>
              <Avatar src={url} shape={"square"} className={navClassns} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Space>
    );
  };

  const InfoContent: React.FC = () => {
    return (
      <Fragment>
        <h5 className="fw-500 fs-[16px] color-[#000000e6] mb-[5px]">
          {detail.name}
        </h5>
        <Card bordered={false} className={"bg-color-[#fafafa] mb-[30px]"}>
          <Row align={"middle"}>
            <Col span={2} className={"color-[#00000099]"}>
              价格
            </Col>
            <Col span={22} className={"color-[#f676a6] fs-[20px]"}>
              {(() => {
                if (!detail.price) return "咨询供应商";
                return detail.price.toFixed(2);
              })()}
            </Col>
          </Row>
          <div className={cx(lineCls, "mt-[15px]", "mb-[15px]")} />
          <Row>
            <Col span={2} className={"color-[#00000099]"}>
              亮点
            </Col>
            <Col span={22}>
              {detail.tag.map((name, index) => (
                <p className="mb-[5px] color-[#00000099] fw-500" key={index}>
                  <CheckCircleOutlined
                    className={"color-[#f676a6] fs-[18px]"}
                  />{" "}
                  {name}
                </p>
              ))}
            </Col>
          </Row>
        </Card>
        <Space size={20}>
          <Authorization.Valid>
            <Button
              type={"primary"}
              shape={"round"}
              size={"large"}
              onClick={onShowConnect}
            >
              免费咨询
            </Button>
          </Authorization.Valid>
          {/* <Authorization.Valid>
                        <Button
                            type={"primary"}
                            ghost
                            shape={"round"}
                            size={"large"}
                            onClick={onShowAdviser}
                        >
                            联系跨境知道顾问
                        </Button>
                    </Authorization.Valid> */}
        </Space>
      </Fragment>
    );
  };

  return (
    <Card
      bordered={false}
      bodyStyle={{ paddingRight: 0 }}
      className={"mb-[15px]"}
    >
      <Row gutter={30}>
        <Col span={8}>
          <SwiperContent />
        </Col>
        <Col span={16}>
          <InfoContent />
        </Col>
      </Row>
    </Card>
  );
};

/**1px线 */
const lineCls = css`
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    #ccc 0%,
    #ccc 50%,
    transparent 50%
  );
  background-size: 6px 1px;
  background-repeat: repeat-x;
`;

/**供应商 */
const Supplier: React.FC = () => {
  const ctx = useContext(SupplierDetailContext);
  const [supplier, setSupplier] = useState<Store>(ctx.supplier);
  const [src] = supplier.companyUrl;

  const onLike = () => {
    if (supplier.isCollection) {
      /**已关注,取消关注 */
      unoperateCollect({
        type: 7,
        otherId: supplier.id,
      }).then(() => {
        message.success("取消关注成功");
        setSupplier({ ...supplier, isCollection: false });
      });
    } else {
      /**未关注,进行关注 */
      operateCollect({
        type: 7,
        otherId: supplier.id,
      }).then(() => {
        message.success("关注成功");
        setSupplier({ ...supplier, isCollection: true });
      });
    }
  };
  const desCls = css`
    width: 360px;
    padding: 10px;
  `;
  return (
    <Card bordered={false} title={"供应商"}>
      <div className={"text-center"}>
        <Link
          href={"/industry/store/[id]/infos"}
          as={`/industry/store/${supplier.id}/infos`}
        >
          <a>
            <Avatar size={55} src={src} />
            <h5 className="color-[#000000]f fw-500 fs-[14px] my-[10px]">
              {supplier.name}
            </h5>
          </a>
        </Link>
        <Popover
          placement="leftTop"
          content={
            <div
              className={cx(desCls, "rich-text")}
              dangerouslySetInnerHTML={{
                __html: supplier?.description as string,
              }}
            />
          }
        >
          <p className="color-[#00000099] fw-400 fh-[28px] text-left lc-3">
            {supplier.description.replace(/(&nbsp;)|<\/?[^>]*>/g, "")}
          </p>
        </Popover>
        <div className={cx(lineCls, "my-[20px]")} />
        <Space>
          <Authorization.Valid>
            <Button
              shape={"round"}
              size={"large"}
              type={"primary"}
              onClick={onShowConnect}
            >
              立即咨询
            </Button>
          </Authorization.Valid>
          {/* <Authorization.Valid>
                        <Button
                            shape={"round"}
                            size={"large"}
                            type={"primary"}
                            ghost
                            onClick={onLike}
                        >
                            {supplier.isCollection ? "已关注" : "关注"}
                        </Button>
                    </Authorization.Valid> */}
        </Space>
      </div>
    </Card>
  );
};

/**更多服务 */
const More: React.FC = () => {
  const cls = css`
    .${process.env.CLASS_PREFIX}-btn {
      border: none;
      background-color: #f9cdde63;
      color: ${process.env.PRIMARY_COLOR};
      font-size: 14px;
      padding: 10px 25px;
      height: unset;
    }
  `;

  return (
    <Card bordered={false} title={"更多服务"}>
      <div className={cx(cls, "text-center")}>
        <Space size={21}>
          <Button size={"large"}>课程培训</Button>
          <Button size={"large"}>选品工具</Button>
        </Space>
      </div>
    </Card>
  );
};

/**注意事项 */
const Precaution: React.FC = () => {
  return (
    <Card bordered={false} title={"注意事项"}>
      <p className="fs-[14px] fw-400 color-[#00000099] fh-[22px]">
        跨境知道（含网站、客户端等）所展示的商品/服务的标题、价格、详情等信息内容由实际服务商提供。如用户对商品/服务的标题、
        价格、详情等任何信息有任何疑问的，可直接同服务商沟通确认；其他问题，请向跨境知道官方顾问咨询。
      </p>
    </Card>
  );
};

/**服务详情 */
const Server: React.FC = () => {
  const ctx = useContext(SupplierDetailContext);
  return (
    <Card bordered={false} title={"服务详情"}>
      <div
        className={"rich-text"}
        dangerouslySetInnerHTML={{
          __html: ctx.detail.detailDescription as string,
        }}
      />
    </Card>
  );
};
