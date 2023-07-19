import Axios, { Response } from "@/apis";
import Article, { ArticleDetails } from "@/vo/Article";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Key } from "react";

/**文章列表 */
export const getArticlePage = (data: PageParams): Promise<Response<PageSource<Article>>> => Axios.post("/console/kjzd/article/igonre/kjzdArticle/getPage", { ...data, auditStatus: 1 });

/**推荐文章 */
export const getCommendArticlePage = (data: { articleTagId?: string; articlePlatformId?: string }): Promise<Response<Article[]>> => Axios.post("/console/kjzd/article/igonre/be/interested", data);

/**文章详情 */
export const getArticleDetail = (id: Key, token?: string): Promise<Response<ArticleDetails>> => Axios.get(`/console/kjzd/article/igonre/kjzdArticle/get/${id}`, token ? { headers: { authorization: token && `Bearer ${token}` } } : {});

/**文章发布 */
export const kjzdArticlePublish = (data: Article): Promise<Response> => Axios.post("/console/kjzdArticle/publish", data);

/**存草稿箱 */
export const kjzdArticleDraftSave = (data: Article): Promise<Response> => Axios.post("/console/kjzdArticleDraft/save", data);
