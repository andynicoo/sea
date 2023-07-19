import Axios, { Response } from "@/apis";
import { PageParams, PageSource } from "@/vo/PageParams";
import { QuestionCategory, Question } from "@/vo/Question";
import { Key } from "react";

/**分页获取百问类目列表 */
export const getQuestionCategory = (data: PageParams): Promise<Response<PageSource<QuestionCategory>>> => Axios.post("/console/kjzd/hundredQuestion/igonre/pageKjzdHundredQuestionCategory", data);

/**分页获取百问列表 */
export const getQuestionPage = (params: PageParams, token?: string): Promise<Response<PageSource<Question>>> => Axios.post("/console/kjzd/hundredQuestion/igonre/pageKjzdHundredQuestion", params, token ? { headers: { authorization: token && `Bearer ${token}` } } : {});

/**获取单个百问 */
export const getQuestion = (id: Key, token?: string): Promise<Response<Question>> => Axios.post("/console/kjzd/hundredQuestion/igonre/getKjzdHundredQuestion", { id }, token ? { headers: { authorization: token && `Bearer ${token}` } } : {});

/**分页获取最新百问列表 */
export const getNewQuestionPage = (params: PageParams, token?: string): Promise<Response<PageSource<Question>>> => Axios.post("/console/kjzd/hundredQuestion/igonre/pageNewKjzdHundredQuestion", params, token ? { headers: { authorization: token && `Bearer ${token}` } } : {});