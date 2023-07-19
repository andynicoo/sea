export type DataList = {
  id: string;
  title: string;
  dataDescribe: string;
  sort: string;
  updateName: string;
  iconUrl?: string;
};
// 增值服务
export type AddList = {
  addValueProductInfoId: string; // 增值商品id
  sort: string; // 排序
  productCategoryId: string; // 所属产品大类
  productInfoId: string; // 主商品id
};
// 产品管理
export interface ProductType {
  id?: string;
  productCategoryId?: string;
  productName?: string;
  productStatus?: string;
  seoTitle?: string;
  keyword?: string;
  seoDescribe?: string;
  sort?: string;
  packageContent?: string;
  dataList: Array<DataList>; //所需资料集合
  advantageList: Array<DataList>;
  addValueList: Array<AddList>; // 底部增值服务
  [key: string]: any;
}

// 产品管理 搜索
export interface SearchType {
  productName: string;
  productStatus: string;
}

export type productIdType = {
  id: number;
  productStatus: string;
};
