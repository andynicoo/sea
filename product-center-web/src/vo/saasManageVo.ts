
//合作伙伴列表数据
export interface PartnersInfo {
    createTime: string;
    updateTime: string;
    yqLinkId: string;
    enterpriseId: number;
    name: string;
    link: string;
    sort: number;
    status: boolean;
    createBy: string;
    updateBy: string;
    linkType: string;
    picUrl: string;
}


//合作伙伴新增
export interface PartnersForm {
    name: string;
    link?: string;
    sort: number;
    status: boolean;
    linkType: string;
    picUrl: string;
}


//网站信息
export interface WebsiteInfo {
    productName: string;
    companyName: string;
    companyAddress: string;
    email: string;
    serviceHotline: string;
    privacyPolicyLink: string;
    serviceAgreementLink: string;
    copyrightInfo: string;
    icpRecordNo: string;
    recordLink: string;
    browserIco: string;
    logo: string;
    communityQrCode: string;
    gzhQrCode: string;
}

//应用中心
export interface ModuleConfig {
    createTime: string;
    updateTime: string;
    moduleConfigId: string;
    parentId: string;
    enterpriseId: number;
    name: string;
    moduleKey: string;
    status: boolean;
    sort: number;
    createBy: string;
    updateBy: string;
}

export interface AppcenterInfo {
    createTime: string;
    updateTime: string;
    moduleConfigId: string;
    parentId: string;
    enterpriseId: number;
    name: string;
    moduleKey: string;
    status: boolean;
    sort: number;
    createBy: string;
    updateBy: string;
    moduleConfigs: ModuleConfig[];
}