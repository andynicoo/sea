import { Key } from "react";
/**评论 */
// export interface CommentProps {
//     id: number,
//     otherId: number,
//     title: string,
//     nick: string,
//     content: string,
//     isShow: boolean,
//     createdAt: string
// }

// 合规资讯分类
export interface CateListType {
    createdAt?: string,
    deletedAt?: any,
    description?: string,
    id: string,
    isShow?: boolean,
    name: string,
    pid?: string,
    seoDescribe?: string,
    seoKey?: string,
    seoTitle?: string,
    sub?: any
    tag?: string,
    updatedAt?: string
}

// 合规资讯列表
export interface HeguiListType {
    id: Key,
    img: string,
    title: string,
    desc: string,
    link: string
}

// 海外公司注册
export interface CountryCount {
    name: string,
    flag: string,
    link: string
}

// 海外公司注册 right
export interface CountryCount2 {
    title: string,
    subtitle: string,
    flag: string,
    link: string
}

// 秘书服务 || 银行开户 || 商标及专利 || 起服务
export interface SomeService {
    title: string,
    flag: string,
    link: string
}

// 业务办理-查询种类
export interface OptionType {
    id: number,
    name: string
}

// 合规资讯办理
export interface questionType{
    business: string,
    describes: string,
    mobile: string,
    corporateName: string,
    platform: number,
}

// VAT税号注册 各种服务下拉 跳转
export interface ServeType {
    name: string,
    url: string
}