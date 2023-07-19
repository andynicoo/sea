
//需求列表请求参数
export interface DemandRecordsParamsVO {
    current: number;
    size: number;
    requirementStatuss: any;
    keyword?: string;
    requirementCreateUserId?: string;
    requirementType?: string;
    businessType?: string;
    createTimeStart?: string;
    createTimeEnd?: string;
    devCompleteTimeStart?: string;
    devCompleteTimeEnd?: string;
    sort?: string
    order?: string
}
//需求列表项详情
export interface DemandRecordsVO {
    requirementPointId: string;
    chancePointId: number;
    requirementCode: string;
    requirementName: string;
    requirementStatus: string;
    requirementStatusName: string;
    requirementType: string;
    requirementTypeName: string;
    businessType: string;
    businessTypeName: string;
    rejectReason: string;
    commodityManager: number;
    commodityManagerName: string;
    demandScore: number;
    submitTime: string;
    assignTime: string;
    contractCompleteTime: string;
    devCompleteTime: string;
    testCompleteTime: string;
    createName: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
    developmentRequirement: string;
    isShow: string
}

//审核提交参数
export interface requirementPointApprovedParama {
    requirementPointId?: string;
    commodityManagerName?: string;
    commodityManager?: string;
}


//需求详情
export interface RequirementInputInfoDetailsOV {
    chancePoint?: ChancePoint;
    requirementInputInfo?: RequirementInputInfo;
    supplierRequirementDTO?: SupplierRequirementDTO
}

//机会点资料详情
export interface ChancePoint {
    chancePointId: string;
    originalInformation: string;
    originalInformationSourceText: string;
    originalInformationSourceUrl: string[];
    proposerUser: string;
    proposerName: string;
    chancePointName: string;
    businessType: string;
    businessTypeName: string;
    chancePointDescribe: string;
    chancePointAnalysis: string;
    chancePointStatus: string;
    chancePointStatusName: string;
    verifyUser: string;
    verifyName: string;
    verifyTime: string;
    auditHistory: any[];
    submitTime: string;
    requirementCode: string;
    createBy: string;
    createName: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
}

//需求分析录入详情
export interface RequirementInputInfo {
    requirementInfoId?: string;
    requirementCode?: string;
    strategicValue?: string;
    policyTrends?: string;
    marketCapacity?: string;
    competition?: string;
    customerGroup?: string;
    degreeOfDifficulty?: string;
    profitability?: string;
    growthRate?: string;
    possibilityOfSaas?: string;
    swot?: string;
    others?: string;
    strategicCoordinationScore?: number;
    marketSpaceScore?: number;
    growthRateScore?: number;
    profitabilityScore?: number;
    degreeOfDifficultyScore?: number;
    possibilityOfSaasScore?: number;
    inputUser?: string;
    inputName?: string;
    createTime?: string;
    updateTime?: string;
    deleted?: boolean;
    verifyName?: string;
    verifyTime?: string;
}

//降本需求录入详情
export interface SupplierRequirementDTO {
    supplierRequirementId?: string;
    requirementCode?: string;
    requirementType?: string;
    businessType?: string;
    requirementName?: string;
    urgencyDegree?: string;
    commodityManager?: string;
    commodityManagerName?: string;
    developmentRequirement?: string;
    countryCode?: string;
    forecastUnitQuantity?: string;
    peerSellingPrice?: number;
    targetCompletionTime?: any;
    supplierRequirementStatus?: string;
    follower?: string;
    followerName?: string;
    isShow?: string;
    contractUrl?: string;
    contractName?: string;
    rejectReason?: string;
    submitTime?: string;
    assignTime?: string;
    contractCompleteTime?: string;
    devCompleteTime?: string;
    testCompleteTime?: any;
    createTime?: string;
    createName?: string;
    updateTime?: string;
    deleted?: boolean;
    currency?: string;
}


//降本需求参数
export interface CostreductionParams {
    businessType: string;
    commodityManager: string;
    commodityManagerName: string
    countryCode: string;
    developmentRequirement: string;
    forecastUnitQuantity: string;
    isShow: string;
    peerSellingPrice: number;
    requirementCode: string;
    requirementName: string;
    supplierRequirementId: number;
    targetCompletionTime: string;
    urgencyDegree: string;
}

//开发需求参数
export interface DevelopParams {
    countryCode: string;
    forecastUnitQuantity: string;
    isShow: string;
    peerSellingPrice: number;
    requirementCode: string;
    supplierRequirementId: number;
    targetCompletionTime: string;
    urgencyDegree: string;
}

//录入测单结果参数
export interface InputTestOrderResultParams {
    completeTime: string;
    costAfter: number;
    costBefore: number;
    costReductionRatio: number;
    createBy: number;
    createTime: string;
    dataSubmitTime: string;
    deleted: boolean;
    deliverCode: string;
    deliverDesc: string;
    id: number;
    orderBelongsSales: number;
    orderCollectionAmount: number;
    orderCostAmount: number;
    requirementCode: string;
    resultType: string;
    updateTime: string;
}

//录入上市信息参数
export interface PublishInfoInputParams {
    client: string;
    createTime: string;
    customerTrainingScope: string;
    customerTrainingTime: string;
    deleted: boolean;
    marketingOutputTime: string;
    productName: string;
    productSku: string;
    publishDepartment: string;
    publishInfoId: number;
    publishTime: string;
    remark: string;
    requirementCode: string;
    salesScope: string;
    updateTime: string;
    workOrderConfigTime: string;
    salesTrainingTime: string
}

