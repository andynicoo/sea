import {
  DataSourceParams,
  DataSourceListGetResultModel,
  DataTypeListGetResultModel,
  ContentListGetResultModel,
  PageParams,
} from './model/subscribeModel';

import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetDataSourceList = '/subscribe/getDataSourceList', // 数据源列表
  GetDataTypeList = '/subscribe/getDataTypeList', // 数据类型列表
  GetContentList = '/subscribe/getContentList', // 数据类型列表
}

export const getDataSourceList = (params?: DataSourceParams) =>
  defHttp.get<DataSourceListGetResultModel>({ url: Api.GetDataSourceList, params });

export const getDataTypeList = (params?: DataSourceParams) =>
  defHttp.get<DataTypeListGetResultModel>({ url: Api.GetDataTypeList, params });

export const getContentList = (params?: PageParams) =>
  defHttp.get<ContentListGetResultModel>({ url: Api.GetContentList, params });
