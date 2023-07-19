import { BasicPageParams } from '/@/api/model/baseModel';

export type DataSourceParams = {
  roleName?: string;
  status?: string;
};

export type PageParams = BasicPageParams;

export interface DataSourceListItem {
  id: string;
  name: string;
  remark: string;
  createTime: string;
}

export interface DataTypeListItem {
  id: string;
  name: string;
  remark: string;
  createTime: string;
}

export interface ContentListItem {
  id: string;
  source: string;
  type: string;
  title: string;
  tags: Array<[string]>;
  createTime: string;
}

/**
 * @description: Request list return value
 */

export type DataSourceListGetResultModel = DataSourceListItem[];
export type DataTypeListGetResultModel = DataTypeListItem[];
export type ContentListGetResultModel = ContentListItem[];
