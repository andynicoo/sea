import { BasicPageParams } from '/@/api/model/baseModel';

export type PageParams = BasicPageParams;

export interface ConversationListItem {
  id: string;
  title: string;
  createTime: string;
}

/**
 * @description: Request list return value
 */

export type ConversationListGetResultModel = ConversationListItem[];
