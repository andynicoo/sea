import { post, get } from "@/api"
import { ResponseDataVO, ResponseVO } from "@/vo/baseVo";
import { CostreductionParams, DemandRecordsParamsVO, DemandRecordsVO, DevelopParams, RequirementInputInfoDetailsOV, requirementPointApprovedParama } from "@/vo/demandVo";
import { OpportunityListParams, OpportunityListProps, OriginalRecordsVO, StatusCountHandleVO } from "@/vo/opportunityVo";

export const getEnterpriseList = (params: any): Promise<any> => post(`base/xcloudOrgDepartment/pageList`, params);
export const getUser = (): Promise<any> => get(`admin/current/user`);

// //新增机会点
// export const chancePointSave = (parama: OpportunityListProps): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/save`, parama);

// //修改机会点
// export const chancePointEdit = (parama: OpportunityListProps): Promise<ResponseVO<any>> => post(`productcenter/chancePoint/edit`, parama);

//需求列表
export const requirementPointExport = (parama: DemandRecordsParamsVO): Promise<ResponseVO<ResponseDataVO<any>>> => post(`productcenter/requirementPoint/export`, parama, { responseType: 'arraybuffer' });

//需求列表
export const requirementPointGetPage = (parama: DemandRecordsParamsVO): Promise<ResponseVO<ResponseDataVO<DemandRecordsVO>>> => post(`productcenter/requirementPoint/getPage`, parama);

//需求列表获取各状态数量
export const requirementPointGetCount = (parama: DemandRecordsParamsVO): Promise<ResponseVO<StatusCountHandleVO[]>> => post(`productcenter/requirementPoint/getCount`, parama);

//需求录入
export const requirementInputInfoInput = (parama: any): Promise<ResponseVO<any>> => post(`productcenter/requirementInputInfo/input`, parama);

//需求编辑
export const requirementInputInfoEditScore = (parama: any): Promise<ResponseVO<any>> => post(`productcenter/requirementInputInfo/editScore`, parama);






//审核通过
export const requirementPointApproved = (parama: requirementPointApprovedParama): Promise<ResponseVO<any>> => post(`productcenter/requirementPoint/approved`, parama);

//审核拒绝
export const requirementPointReject = (parama: { 'requirementPointId': string }): Promise<ResponseVO<any>> => post(`productcenter/requirementPoint/reject`, parama);

//审核搁置
export const requirementPointShelved = (parama: { 'requirementPointId': string }): Promise<ResponseVO<any>> => post(`productcenter/requirementPoint/shelved`, parama);

// //恢复状态
export const requirementPointRecovery = (parama: { 'requirementPointId': string }): Promise<ResponseVO<any>> => post(`productcenter/requirementPoint/recovery`, parama);

// //查询机会点详情
export const requirementPointGetDetails = (id: string): Promise<ResponseVO<RequirementInputInfoDetailsOV>> => get(`productcenter/requirementPoint/get/${id}`);



//创建降本需求
export const supplierRequirementSaveCostReduction = (parama: CostreductionParams): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/saveCostReduction`, parama);

//创建开发需求
export const supplierRequirementSaveDevelop = (parama: DevelopParams): Promise<ResponseVO<any>> => post(`productcenter/supplierRequirement/saveDevelop`, parama);


//录入测单结果
export const inputTestOrderResult = (parama: any): Promise<ResponseVO<any>> => post(`productcenter/requirementResult/inputTestOrderResult`, parama);

//录入开发结果
export const inputDevelopResult = (parama: any): Promise<ResponseVO<any>> => post(`productcenter/requirementResult/inputDevelopResult`, parama);

//录入上市信息
export const publishInfoInput = (parama: any): Promise<ResponseVO<any>> => post(`productcenter/publishInfo/input`, parama);

//重新指派产品经理
export const assignCommodityManager = (parama: any): Promise<ResponseVO<any>> => post(`productcenter/requirementPoint/assign/commodityManager`, parama);


//终止
export const requirementPointClose = (parama: any): Promise<ResponseVO<any>> => post(`productcenter/requirementPoint/close`, parama);

