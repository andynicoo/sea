import Axios, { Response } from "@/apis";
import { IndustrialBelt, IndustrialBeltArea, Product, Store } from "@/vo/Domain";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Key } from "react";

/**跨境知道服务商服务列表(找产业带) */
export const postIndustrialBeltList = (params: PageParams): Promise<Response<PageSource<IndustrialBeltArea>>> => Axios.post("/console/kjzdConsole/supplier/industrialBelt/list", params);

/**跨境知道产业带分类 */
export const getIndustrialBeltList = (): Promise<Response<IndustrialBelt[]>> => Axios.get("/console/kjzdConsole/supplier/industrialBelt/list");

/**跨境知道服务商服务列表(找产品) */
export const getServerProductPage = (params: PageParams): Promise<Response<PageSource<Product>>> => Axios.post("/console/kjzdConsole/supplier/product/list", params);

/**跨境知道服务商服务列表(找服务商) SERVICE:服务商 INDUSTRIAL_BELT:产业带*/
export const getServerPistPage = (params: PageParams): Promise<Response<PageSource<Store>>> => Axios.post("/console/kjzdConsole/supplier/list", params);

/**跨境知道服务商服务列表(服务商详情) */
export const getServerSupplierDetail = (id: Key): Promise<Response<Store>> => Axios.post("/console/kjzdConsole/supplier/detail", { id });

/**跨境知道服务商服务列表(服务&产品详情) */
export const getServerProductDetail = (id: Key): Promise<Response<Product>> => Axios.post("/console/kjzdConsole/supplier/product/detail", { id });