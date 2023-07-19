import Axios, { Response } from "@/apis";
import { CateListType } from "@/vo/Hegui";
import { PageParams, PageSource } from "@/vo/PageParams";
import { TagsCategory } from "@/vo/Article";
import { questionType } from "@/vo/Hegui";


/**合规分类 */
export const getHeguiList = (): Promise<Response<CateListType[]>> => Axios.get(`/console/kjzd/article/igonre/kjzdArticleCategory/hegui/list`);

/**热门标签(分页) */
export const getTagsPage = (params: PageParams): Promise<Response<PageSource<TagsCategory>>> => Axios.post("/console/kjzd/article/igonre/tags/getPage", params);

/**合规线索新增 */
export const addClue = (params: PageParams): Promise<Response<questionType>> => Axios.post("/console/kjzd/article/igonre/hegui/leads/save", params);