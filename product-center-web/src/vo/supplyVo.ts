
//供应链列表请求参数
export interface SupplyListParamsVO {
    pages?: number;
    size?: number;
    type?: string;
    page?: number;
    keyWords?: string;
    follower?: string;
    commodityManager?: string;
    requirementType?: string;
    businessType?: string;
    countryCode?: string;
    contractCompleteTimeStart?: string;
    contractCompleteTimeEnd?: string;
    submitTimeStart?: string;
    submitTimeEnd?: string;
    targetCompletionTimeStart?: string;
    targetCompletionTimeEnd?: string;
    testCompleteTimeStart?: string;
    testCompleteTimeEnd?: string;
}


//供应链列表项详情
export interface SupplyListRecordsVO {
    supplierRequirementId: string;
    requirementCode: string;
    requirementType: string;
    businessType: string;
    requirementName: string;
    urgencyDegree: string;
    commodityManager: string;
    commodityManagerName: string;
    developmentRequirement: string;
    countryCode: string;
    forecastUnitQuantity: string;
    peerSellingPrice: number;
    targetCompletionTime: string;
    supplierRequirementStatus: string;
    follower: string;
    followerName: string;
    isShow: string;
    contractUrl: string;
    contractName: string;
    rejectReason: string;
    submitTime: string;
    assignTime: string;
    contractCompleteTime: string;
    devCompleteTime: string;
    testCompleteTime: string;
    createTime: string;
    updateTime: string;
    deleted: boolean;
}


//指派跟进人参数
export interface AssignFollowProps {
    followerNames?: string[];
    followers?: string[];
    id?: string;
}

//上传合同参数
export interface uploadContractFileProps {
    fileUrl?: string;
    id?: string;
    origFileName?: string;
}

//合同列表
// export interface contractsListVO {
//     [key: string]: string[]
// }
//测单结果信息
export interface TestResultInformationVO {
    id?: string;
    requirementCode?: string;
    resultType?: string;
    costBefore?: any;
    costAfter?: any;
    costReductionRatio?: any;
    orderCollectionAmount?: number;
    orderCostAmount?: number;
    orderBelongsSales?: number;
    dataSubmitTime?: string;
    deliverCode?: string;
    deliverDesc?: string;
    completeTime?: string;
    createBy?: number;
    createName?: string;
    createTime?: string;
    updateTime?: string;
    deleted?: boolean;
    currency?: string;
}


//上市结果详情
export interface ListingInformationOV {
    publishInfoId?: string;
    requirementCode?: string;
    productName?: string;
    productSku?: string;
    publishTime?: string;
    publishDepartment?: string;
    client?: string;
    workOrderConfigTime?: string;
    salesTrainingTime?: string;
    salesScope?: string;
    customerTrainingTime?: string;
    customerTrainingScope?: string;
    marketingOutputTime?: string;
    remark?: string;
    createName?: string;
    createTime?: string;
    updateTime?: string;
    deleted?: boolean;
}

