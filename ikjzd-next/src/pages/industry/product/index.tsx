import { getIndustrialBeltList, getServerProductPage } from "@/apis/server";
import DomainPageLayout from "@/components/domain/PageLayout";
import { CustomNextPageContext } from "@/pages/_app";
import { setDomainCategorys } from "@/redux/actions/domainActions";
import { Product } from "@/vo/Domain";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Avatar, Card, Col, Empty, Pagination, Row } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { Fragment, Key, useContext } from "react";

interface DomainProductContextProps extends DomainProductPageProps {

}

const DomainProductContext = React.createContext<DomainProductContextProps>({} as DomainProductContextProps);

interface DomainProductPageProps {
    products: PageSource<Product>
}

/**产业带商品 */
const DomainProductPage: NextPage<DomainProductPageProps> = (props) => {

    const ctx: DomainProductContextProps = {
        ...props
    }

    return (
        <DomainProductContext.Provider value={ctx}>
            <DomainPageLayout>
                <Products />
            </DomainPageLayout>
        </DomainProductContext.Provider>
    )
}

DomainProductPage.getInitialProps = async (ctx: CustomNextPageContext) => {
    const categorys = ctx.reduxStore.getState().domainReducer.categorys;
    if (!categorys) {
        const categorys = (await getIndustrialBeltList()).data;
        setDomainCategorys(categorys)(ctx.reduxStore.dispatch);
    }

    const categoryId = ctx.query.categoryId as Key;
    const area = ctx.query.area as Key;

    const current = ctx.query.current as Key;
    const size = ctx.query.size as Key || 12;

    const pageParams: PageParams = { current, size, categoryId, area };
    const products = (await getServerProductPage(pageParams)).data;

    return {
        products
    }
}

export default DomainProductPage;

const Products: React.FC = () => {
    const { query } = useRouter();
    const { products } = useContext(DomainProductContext);

    if (!products.records.length) {
        return <Card bordered={false} size={"small"} className={"my-[20px]"}>
            <Empty />
        </Card>
    }

    return (
        <Fragment>
            <Row gutter={[20, 20]} className={"my-[20px]"}>
                {products.records.map((product) => {
                    const [image] = product.productImage;
                    const cover = (
                        <Avatar
                            src={image}
                            shape="square"
                            style={{ height: 140 }}
                        />
                    )
                    return (
                        <Col key={product.id} span={6}>
                            <Link
                                href={"/industry/product/[id]"}
                                as={`/industry/product/${product.id}`}
                            >
                                <a>
                                    <Card
                                        hoverable
                                        cover={cover}
                                        bordered={false}
                                        size={"small"}
                                    >
                                        <p className="ma-[0px] color-[#000000e6] fs-[14px] fw-500">
                                            {product.name}
                                        </p>
                                        <p className="ma-[0px] lc-2 h-[50px] color-[#00000099] fs-[12px]">
                                            {product.description}
                                        </p>
                                    </Card>
                                </a>
                            </Link>
                        </Col>
                    )
                })}
            </Row>
            <Card
                size={"small"}
                bordered={false}
                className={"my-[20px] bg-color-[#00000000]"}
            >
                <Pagination
                    className="float-right"
                    total={products.total}
                    current={products.current}
                    pageSize={products.size}
                    showSizeChanger={false}
                    itemRender={(current, type, element) => {
                        return <Link href={{ query: { ...query, current } }}>
                            <a>{type==='page' ? current : element}</a>
                        </Link>
                    }}
                />
            </Card>
        </Fragment>
    )
}