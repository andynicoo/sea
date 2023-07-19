

//权限item
export interface AuthorityItem {
    authority: string;
    authorityId: string;
    isExpired: boolean;
    owner: string;
}

//机会点新增参数
export interface OpportunityList {
    chancePointName: string;
    businessType: string;
    chancePointDescribe: string;
    chancePointAnalysis: string;
    originalInformation?: string;
    originalInformationSourceText?: string;
    proposerUser?: string;
    submitTime?: string;
    countryCode?: string;
}
//机会点新增参数
export interface OpportunityListProps {
    chancePointList: OpportunityList[];
}

//机会点列表查询参数
export interface OpportunityListParams {
    current?: number;
    size?: number;
    keyword?: string;
    proposerUser?: string;
    businessType?: string;
    startTime?: string;
    endTime?: string;
    chancePointStatus?: string;
}

//机会点列表各状态数量
export interface StatusCountVO {
    [key: string]: string | number;
}
//处理后机会点列表各状态数量
export interface StatusCountHandleVO {
    name: string;
    key: string;
    count: string;
}
//机会点列表项详情
export interface OriginalRecordsVO {
    chancePointId: string;
    originalInformation: string;
    originalInformationSourceText: string;
    originalInformationSourceUrl: any[];
    proposerUser: string;
    proposerName: string;
    chancePointName: string;
    businessType: string;
    businessTypeName: string;
    chancePointDescribe: string;
    chancePointAnalysis: string;
    chancePointStatus: string;
    chancePointStatusName: string;
    verifyUser: number;
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
    countryCode?: string;
    countryCodeName?: string;
}

