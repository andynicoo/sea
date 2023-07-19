import DefaultLayout from "@/components/layouts/DefaultLayout";
import {
  Affix,
  Avatar,
  Button,
  Card,
  Col,
  List,
  Modal,
  Popover,
  Row,
  Space,
} from "antd";
import classNames from "classnames";
import { NextPage } from "next";
import React, { Key, useContext } from "react";
import {
  getServerProductDetail,
  getServerProductPage,
  getServerSupplierDetail,
} from "@/apis/server";
import { Product, Store } from "@/vo/Domain";
import Link from "next/link";
import SeoHead from "@/components/SeoHead";

import createEmotion from "@emotion/css/create-instance";
import moment from "moment";
import Authorization from "@/components/Authorization";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-pg-domain-product-id`,
});

interface ProductDetailContextProps extends ProductDetailProps {}

const ProductDetailContext = React.createContext<ProductDetailContextProps>(
  {} as ProductDetailContextProps
);

interface ProductDetailProps {
  detail: Product;
  newProducts: Product[];
  supplier: Store;
}

const ProductDetail: NextPage<ProductDetailProps> = (props) => {
  const ctxValue: ProductDetailContextProps = {
    ...props,
  };
  let { detail } = props;
  let { name, description } = detail;

  return (
    <ProductDetailContext.Provider value={ctxValue}>
      <DefaultLayout>
        <Row gutter={[20, 20]}>
          <Col span={18}>
            <Space direction={"vertical"} className={"w-[100%]"} size={20}>
              {/* 详情 */}
              <Details />

              {/* 提示 */}
              {/* <TooltipCard /> */}
            </Space>
          </Col>
          <Col span={6}>
            <Affix offsetTop={75}>
              {/* 供应商 */}
              <ProductCard />

              {/* 新商品 */}
              {/* <NewProducts /> */}
            </Affix>
          </Col>
        </Row>
      </DefaultLayout>
      <SeoHead title={name} description={description} />
    </ProductDetailContext.Provider>
  );
};

ProductDetail.getInitialProps = async (ctx) => {
  /**商品详情 */
  const detail = (await getServerProductDetail(ctx.query.id as Key)).data;

  /**最新商品 */
  const newProducts = (await getServerProductPage({ current: 1, size: 3 })).data
    .records;

  /**服务商详情 */
  const supplier = (await getServerSupplierDetail(detail.supplierId)).data;

  return {
    detail,
    newProducts,
    supplier,
  };
};

export default ProductDetail;

/**详情 */
const Details: React.FC = () => {
  const { detail } = useContext(ProductDetailContext);

  return (
    <Card bordered={false}>
      <h1 className={classNames("fs-[18px]", "fw-500", "mb-[10px]")}>
        {detail.name}
      </h1>
      <p className={classNames("fs-[14px]", "color-[#00000099]", "mb-[20px]")}>
        <span className={"color-[#00000099]"}>{detail.supplierName}</span>
        <span className={classNames("ml-[10px]", "color-[#00000066]")}>
          {Math.abs(moment().diff(moment(detail.createTime), "days"))} 天前
        </span>
      </p>
      <div
        dangerouslySetInnerHTML={{ __html: detail.detailDescription }}
        className="rich-text"
      />
    </Card>
  );
};

/**联系供应商 */
export const onShowConnectSuppliy = () => {
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
/**供应商 */
const ProductCard: React.FC = () => {
  const { supplier } = useContext(ProductDetailContext);

  const [src] = supplier.companyUrl;
  const desCls = css`
    width: 360px;
    padding: 10px;
  `;
  return (
    <Card bordered={false} title={"供应商"} className={"mb-[20px]"}>
      <div className="text-center">
        <Link
          href={"/industry/store/[id]/infos"}
          as={`/industry/store/${supplier.id}/infos`}
        >
          <a>
            <Avatar size={55} src={src} />
            <h4 className="fs-[14px] fw-600 my-[15px]">{supplier.name}</h4>
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
          <p className="text-left color-[#00000099] fs-[14px] fh-[28px] lc-3">
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
              onClick={onShowConnectSuppliy}
            >
              立即咨询
            </Button>
          </Authorization.Valid>
          {/* <Button shape={"round"} type={"primary"} ghost>
                        关注
                    </Button> */}
        </Space>
      </div>
    </Card>
  );
};

const lineCls = css`
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    #ccc 0%,
    #ccc 50%,
    transparent 50%
  );
  background-size: 8px 1px;
  background-repeat: repeat-x;
`;

/**最新商品 */
const NewProducts: React.FC = () => {
  const { newProducts } = useContext(ProductDetailContext);
  return (
    <Card title={"最新商品"} bordered={false} className={"mb-[20px] cards"}>
      <List>
        {newProducts.map((product) => {
          const ProductLink: React.FC = ({ children }) => {
            return (
              <Link
                href={"/industry/product/[id]"}
                as={`/industry/product/${product.id}`}
              >
                <a>{children}</a>
              </Link>
            );
          };

          const [src] = product.productImage;

          return (
            <List.Item key={product.id}>
              <List.Item.Meta
                avatar={
                  <ProductLink>
                    <Avatar
                      src={src}
                      shape={"square"}
                      style={{ width: 98, height: 56 }}
                    />
                  </ProductLink>
                }
                title={
                  <ProductLink>
                    <p
                      className={
                        "color-[#000000e6] lc-2 fw-400 fh-[16px] mb-[0px]"
                      }
                    >
                      {product.name}
                    </p>
                  </ProductLink>
                }
                description={
                  <p className="color-[#00000066] fs-[12px] mb-[0px]">1天前</p>
                }
              />
            </List.Item>
          );
        })}
      </List>
    </Card>
  );
};

/**提示 */
const TooltipCard: React.FC = () => {
  return (
    <Card bordered={false}>
      <Space size={15} className={"w-[100%]"}>
        <Avatar
          shape={"square"}
          className={"wh-[75px]"}
          src={"/asset/image/qr-code/2022-07-20/question.jpg"}
        />
        <div>
          <p className={"fs-[16px] fw-500 mb-[10px] color-[#000000e6] fw-600"}>
            温馨提示
          </p>
          <p className={"fs-[14px] gw-400 mb-[10px] color-[#00000099]"}>
            如无法联系商家，可扫描二维码及时联系跨境知道顾问
          </p>
        </div>
      </Space>
    </Card>
  );
};
