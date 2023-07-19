import Axios, { Response } from "@/apis";
import { PlatformStatus } from "@/vo/Platform";
import { ArticleCategory} from "@/vo/Article";

/**查询跨境平台状态 */
export const getPlatformStatus = (): Promise<Response<PlatformStatus[]>> => Axios.get("/console/kjzd/article/igonre/kjzdArticle/getPlatformStatus");

/**tag分类 */
export const getArticleCateList = (): Promise<Response<ArticleCategory[]>> => Axios.post(`/console/kjzd/article/igonre/kjzdArticleTag/getList`,{});