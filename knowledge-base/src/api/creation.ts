import { PageParams, ConversationListGetResultModel } from './model/creationModel';

import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetConversationList = '/creation/getConversationList', // 对话列表
}

export const getConversationList = (params?: PageParams) =>
  defHttp.get<ConversationListGetResultModel>({ url: Api.GetConversationList, params });
