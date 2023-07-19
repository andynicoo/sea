import type { Router } from 'vue-router';
//分页
export interface IPageSize {
  current: number;
  pageSize: number;
}

//select
export interface IOptionsSelect {
  value: string | number;
  label: string;
}

//store信息
export interface IState {
  collapsed: boolean;
  loginInfo: ILoginInfo;
  userInfo: IUserInfo;
  menuData: IMenu;
  enterprise: IEnterprise;
  tabsList: Array<ITabsRecord>;
  authoritiesList: Array<IauthoritiesRecord>;
  $router: () => Router;
}

//操作按钮信息
export interface IactionRecord {
  actionId: string;
  actionName: string;
  actionCode: string;
  authority: string;
  authorityId: string;
  menuId: string;
}

//用户登录返回信息
export interface ILoginInfo {
  access_token: string;
  openid: string;
}

//用户信息
export interface IUserInfo {
  userId: string;
  userName: string;
}

//菜单信息
export interface IMenu {
  list: Array<IMenuRecord>;
  listTree: Array<IMenuRecord>;
  record: IMenuRecord;
}

//菜单项
export interface IMenuRecord {
  actionList: Array<IactionRecord>;
  menuId: string;
  menuName: string;
  path: string;
  parentId: string;
  openKeys: Array<string>;
  children: Array<IMenuRecord>;
}

//企业主体信息
export interface IEnterprise {
  list: Array<IEnterpriseRecord>;
  record: IEnterpriseRecord;
}

//企业主体项
export interface IEnterpriseRecord {
  id: number | string;
  name: string;
}

//tabs
export interface ITabsRecord {
  path: string;
  query?: any;
  title: string;
  titleList: Array<string>;
}

//按钮
export interface IauthoritiesRecord {
  authority: string;
  authorityId: string;
}

export type PaginationRes<T> = {
  current: number;
  pages: number;
  records: T;
  size: number;
  total: number;
};
