import Axios, { Response } from "@/apis";
import Article from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import { AreaListInfo, StoresDetailsVO } from "@/vo/Stores";

/**跨境知道开店店铺区域列表 */
export const shopeAreaList = (params: PageParams): Promise<Response<AreaListInfo[]>> => Axios.post("/console/kjzdConsole/shope/area/list", params);

/**跨境知道开店店铺区域下店铺列表 */
export const shopList = (params: PageParams): Promise<Response<PageSource<any>>> => Axios.post("/console/kjzdConsole/shop/list", params);

/**跨境知道开店店铺详情 */
export const shopDetail = (params: string): Promise<Response<StoresDetailsVO>> => Axios.get("/console/kjzdConsole/shop/detail?" + params);

/**跨境知道开店招商政策 */
export const investmentGetPage = (params: PageParams): Promise<Response<PageSource<Article>>> => Axios.post("/console//kjzd/article/igonre/kjzdArticle/investment/getPage", params);


