import { post, get } from "@/api"
import { QueryParams, ResponseDataVO, ResponseVO } from "@/vo/baseVo";
import { AppcenterInfo, PartnersForm, PartnersInfo, WebsiteInfo } from "@/vo/saasManageVo";

//合作伙伴列表
export const friendLinkList = (parama: QueryParams): Promise<ResponseVO<ResponseDataVO<PartnersInfo>>> => post(`/information/friend_link/list`, parama);

//新增合作伙伴
export const friendLinkAdd = (parama: PartnersForm): Promise<ResponseVO<any>> => post(`/information/friend_link/add`, parama);
//编辑合作伙伴
export const friendLinkEdit = (parama: PartnersForm, id: string): Promise<ResponseVO<any>> => post(`/information/friend_link/edit?id=${id}`, parama);
//删除合作伙伴
export const friendLinkDel = (parama: any): Promise<ResponseVO<any>> => post(`/information/friend_link/del`, parama, {
    headers: { "content-type": "application/x-www-form-urlencoded" },
});

//设置网站信息
export const setWebsiteInfo = (parama: WebsiteInfo): Promise<ResponseVO<any>> => post(`/custuser/management/enterprise/setWebsiteInfo`, parama);
//获取网站信息
export const enterpriseInfo = (parama: any): Promise<ResponseVO<any>> => post(`/custuser/management/enterprise/info`, parama, {
    headers: { "content-type": "application/x-www-form-urlencoded" },
});

//官网模块列表
export const getModuleConfigList = (): Promise<ResponseVO<AppcenterInfo>> => get(`/information/management/module_config/getModuleConfigList`);
//模块开启 / 关闭
export const openOrClose = (parama: any): Promise<ResponseVO<any>> => post(`/information/management/module_config/openOrClose`, parama, {
    headers: { "content-type": "application/x-www-form-urlencoded" },
});





