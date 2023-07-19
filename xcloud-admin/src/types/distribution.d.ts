/** 状态 INVITATION_POSTER:邀请海报 PROMOTION_POSTER:推广海报 GUEST_ARTICLE:文章 */
export type TypesList = 'INVITATION_POSTER' | 'PROMOTION_POSTER' | 'GUEST_ARTICLE';

/** INVITATION_POSTER:邀请海报 PROMOTION_POSTER:推广海报 */
export type Poster = 'INVITATION_POSTER' | 'PROMOTION_POSTER';

/** 状态 启用：ENABLED 禁用 DISABLED */
export type Status = 'ENABLED' | 'DISABLED';

// 文章编辑新增
export type SaveArticle = {
  drpContent: string;
  drpId?: string;
  drpTitle: string;
  enterpriseId: number;
  productCategoryId: string;
  productCategoryName: string;
  status: Status;
};

// 海报新增修改
export type SavePoster = {
  drpId?: string;
  drpImage: string;
  drpTitle: string;
  enterpriseId: number;
  status: Status;
  type: TypesList;
};

// 详情
export type Detail = {
  createBy: string;
  createTime: string;
  drpContent: string;
  drpId: string;
  drpImage: string;
  drpTitle: string;
  enterpriseId: number;
  productCategoryId: string;
  productCategoryName: string;
  status: Status;
  type: TypesList;
  updateBy: string;
  updateTime: string;
};
