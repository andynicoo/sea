import { post, get } from "@/api"
import { ResponseDataVO, ResponseVO } from "@/vo/baseVo";
import { OpportunityListParams, OpportunityListProps, OriginalRecordsVO, StatusCountHandleVO } from "@/vo/opportunityVo";

export const getEnterpriseList = (params: any): Promise<any> => post(`base/xcloudOrgDepartment/pageList`, params);
export const getUser = (): Promise<any> => get(`admin/current/user`);

//新增机会点
export const chancePointSave = (params: OpportunityListProps): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/save`, params);

//修改机会点
export const chancePointEdit = (params: OpportunityListProps): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/edit`, params);

//机会点导出
export const chancePointExport = (params: OpportunityListParams): Promise<ResponseVO<ResponseDataVO<any>>> => post(`productcenter/chancePoint/export`,
    params, { responseType: 'arraybuffer' });

//机会点列表
export const chancePointGetPage = (params: OpportunityListParams): Promise<ResponseVO<ResponseDataVO<OriginalRecordsVO>>> => post(`productcenter/chancePoint/getPage`, params);

//机会点列表获取各状态数量
export const chancePointGetCount = (params: OpportunityListParams): Promise<ResponseVO<StatusCountHandleVO[]>> => post(`productcenter/chancePoint/getCount`, params);

//审核通过
export const chancePointApproved = (params: { 'chancePointId': string }): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/approved`, params);

//审核拒绝
export const chancePointReject = (params: { 'chancePointId': string }): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/reject`, params);

//审核搁置
export const chancePointShelved = (params: { 'chancePointId': string }): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/shelved`, params);

//恢复状态
export const chancePointRecovery = (params: any): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/recovery`, params);

//查询机会点详情
export const chancePointGetDetails = (id: string): Promise<ResponseVO<OriginalRecordsVO>> => get(`productcenter/chancePoint/get/${id}`);




