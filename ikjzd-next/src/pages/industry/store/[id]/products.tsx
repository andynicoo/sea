import { getServerSupplierDetail, getServerProductPage } from "@/apis/server";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import SupplierPageContext, { ServerPageContextProps } from "@/components/server/PageContext";
import SupplierPageLayout from "@/components/server/PageLayout";
import { Product, Store } from "@/vo/Domain";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Avatar, Card, Col, Empty, Pagination, Row } from "antd";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Key, useContext } from "react";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-pg-domain-store-id-products` });

interface SupplierProductsPageProps {
    store: Store;
    products: PageSource<Product>;
}

/**供应商商品 */
const SupplierProductsPage: NextPage<SupplierProductsPageProps> = (props) => {

    const ctx: ServerPageContextProps = {
        ...props
    }

    return (
        <SupplierPageContext.Provider value={ctx}>
            <DefaultLayout>
                <SupplierPageLayout>
                    <SupplierProductsCard />
                </SupplierPageLayout>
            </DefaultLayout>
        </SupplierPageContext.Provider>
    )
}

SupplierProductsPage.getInitialProps = async (ctx) => {
    const supplierId = ctx.query.id as Key;
    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key;
    const store = (await getServerSupplierDetail(supplierId)).data;

    const params: PageParams = {
        supplierId,
        current,
        size,
    }

    const products = (await getServerProductPage(params)).data;

    return {
        store,
        products,
    }
}

export default SupplierProductsPage;

const SupplierProductsCard: React.FC = () => {
    const { products } = useContext(SupplierPageContext);
    const { query } = useRouter();

    if (!products?.total) {
        return (
            <Card bordered={false}>
                <Empty />
            </Card>
        )
    }

    const cls = css`
        .${process.env.CLASS_PREFIX}-card-body {
            padding-left: 0;
            padding-right: 0;
            padding-top: 20px;
            padding-bottom: 20px;
        }
    `;

    const ProductCard: React.FC<Product> = (props) => {
        const [src] = props.productImage;
        const cover = (
            <Avatar
                className={"w-[100%]"}
                shape={"square"}
                style={{ height: 125 }}
                src={src}
            />
        )
        return (
            <Col key={props.id} span={6}>
                <Link
                    href={"/industry/product/[id]"}
                    as={`/industry/product/${props.id}`}
                >
                    <a>
                        <Card
                            size={"small"}
                            cover={cover}
                            bordered={false}
                        >
                            <p className="mb-[0px] fs-[14px] fw-500 color-[#000000e6]">
                                {props.name}
                            </p>
                            <p className="mb-[0px] lc-2 fs-[12px] color-[#00000099]">
                                {props.description}
                            </p>
                        </Card>
                    </a>
                </Link>
            </Col>
        )
    }

    return (
        <Card title={"产品介绍"} bordered={false} className={cls}>
            {/* 产品列表 */}
            <Row gutter={[30, 30]}>
                {products?.records.map((item) => (
                    <ProductCard {...item} />
                ))}
            </Row>

            {/* 分页 */}
            <Pagination
                total={products?.total}
                current={products?.current}
                pageSize={products?.size}
                showSizeChanger={false}
                className={"float-right mt-[30px]"}
                itemRender={(current, type, element) => (
                    <Link
                        href={"/industry/store/[id]/products"}
                        as={{ pathname: `/industry/store/${query.id}/products`, query: { current } }}
                        scroll={false}
                    >
                        <a>
                            {type === 'page' ? current : element}
                        </a>
                    </Link>
                )}
            />
        </Card>
    )
}