import Axios, { Response } from "@/apis";
import { Bbs, BbsType } from "@/vo/Bbs";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Key } from "react";

/**获取所有平台分类 */
export const bbsTypeList = (): Promise<Response<BbsType[]>> => Axios.post("/console/kjzd/kjzdBbs/igonre/listKjzdBbsType");

/**分页获取帖子列表 */
export const bbsPages = (params: PageParams): Promise<Response<PageSource<Bbs>>> => Axios.post("/console/kjzd/kjzdBbs/igonre/pageKjzdBbs", params);

/**提问题、写想法 */
export const saveBbs = (data: any): Promise<Response> => Axios.post("/kjzdUser/kjzdUsers/saveBbs", data);

/**获取所有平台分类 */
export const bbsPlatformTypeList = (): Promise<Response<BbsType[]>> => Axios.post("/kjzdUser/kjzdIgnore/listKjzdBbsType");

/**帖子详情 */
export const getBbs = (id: Key, token?: string): Promise<Response<Bbs>> => Axios.post("/console/kjzd/kjzdBbs/igonre/getKjzdBbs", { id }, token ? { headers: { authorization: token && `Bearer ${token}` } } : {});