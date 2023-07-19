import { post, get } from "@/api"
import { ResponseDataVO, ResponseVO } from "@/vo/baseVo";
import { CostreductionParams, DemandRecordsParamsVO, DemandRecordsVO, DevelopParams, RequirementInputInfoDetailsOV, requirementPointApprovedParama } from "@/vo/demandVo";
import { OpportunityListParams, OpportunityListProps, OriginalRecordsVO, StatusCountHandleVO } from "@/vo/opportunityVo";
import { AssignFollowProps, SupplyListParamsVO, SupplyListRecordsVO, uploadContractFileProps } from "@/vo/supplyVo";

export const getEnterpriseList = (params: any): Promise<any> => post(`base/xcloudOrgDepartment/pageList`, params);
export const getUser = (): Promise<any> => get(`admin/current/user`);

// //新增机会点
// export const chancePointSave = (parama: OpportunityListProps): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/save`, parama);

// //修改机会点
// export const chancePointEdit = (parama: OpportunityListProps): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/edit`, parama);

//供应链列表
export const supplierRequiremLentList = (parama: SupplyListParamsVO): Promise<ResponseVO<ResponseDataVO<SupplyListRecordsVO>>> => post(`productcenter/supplierRequirement/list`, parama);

//导出供应链列表数据
export const supplierRequirementExport = (parama: SupplyListParamsVO): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/export`, parama, { responseType: 'arraybuffer' });

//需求列表获取各状态数量
export const supplierRequirementListStatistics = (parama: SupplyListParamsVO): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/list/statistics`, parama);

//供应链详情
export const supplierRequirementDetail = (parama: { requirementCode: string }): Promise<ResponseVO<ResponseDataVO<RequirementInputInfoDetailsOV>>> => post(`productcenter/supplierRequirement/detail`, parama);

//指派跟进人
export const assignFollower = (parama: AssignFollowProps): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/assign/follower`, parama);

//上传合同
export const uploadContractFile = (parama: uploadContractFileProps): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/uploadContractFile`, parama);

//删除合同
export const uploadContractFileDelete = (parama: uploadContractFileProps): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/uploadContractFile/delete`, parama);

//完成上传合同
export const uploadContractFileComplete = (parama: { id: string }): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/uploadContractFile/complete`, parama);

//审核合同
export const auditContract = (parama: { id: string, auditResult: string, reason?: string }): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/audit/contract`, parama);


//终止
export const supplierRequirementClose = (parama: any): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/close`, parama);







