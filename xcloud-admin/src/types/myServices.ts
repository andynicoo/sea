
//服务状态
export interface ServicesStatusListOV {
  label: string;
  id?: number;
  value: number;
}

//客户等级
export interface UserLevelMapOV {
  [key:number]:string
}

//驳回类型
export interface trackTypeMapOV {
  [key:string]:string
}

//驳回列表的值
export interface DataRejectedRecordVO {
	id: string;
	serviceNo: string;
	orderNo: string;
	orderRemark: string;
	workNo: string;
	serviceName: string;
	countryCode: string;
	countryNameZh: string;
	companyNameZh: string;
	companyNameEn: string;
	supplierName: string;
	supplierAssignsCode: string;
	serviceObj: string;
	status: number;
	currentNodeCode: string;
	workflowId: number;
	progressBar: number;
	handler: string;
	handlerUserId: string;
	existRemark: boolean;
	existReject: boolean;
	vatTaxNumber: string;
	supplierId: number;
	functionCode: number;
	userId: string;
	workStatus: number;
	labelName: string;
	labelId: number;
	trackTotal: number;
	warnValue: number;
	warnDay: number;
	gatewayId: string;
	gatewayPassword: string;
	secret: string;
	enterpriseId: number;
	enterpriseName: string;
	customerData: string;
	smsSend: boolean;
	flagCustomerData: boolean;
	emailSend: boolean;
	mobile: string;
	serviceId: number;
	userMobile: string;
	userLevel: number;
	createTime: string;
	firstCommitTime: string;
	submitServiceTime: string;
	customerDataSendTime: string;
	serviceCompleteTime: string;
	expirationTime: string;
	situationTime: string;
	situationContent: string;
	rejectTime: string;
	rejectContent: string;
	attributionName: string;
	attributionId: string;
	consoleDepName: string;
	consoleDepId: number;
	rejectCount: string;
}

export interface TrackRecordOV {
	id?: string;
	trackType: string;
	content?: string;
	rejectContent?: string;
	attachment?: string;
	publishName?: string;
	publishTime?: string;
	handledBy?: string;
	handledName?: string;
	workNo?: string;
	orderNo?: string;
	serviceNo?: string;
	serviceOrderId?: string;
	createBy?: string;
	updateBy?: string;
	createTime?: string;
	updateTime?: string;
}

export interface TimeOutStatusOV {
	name: string;
	value: number;
	serviceId: number;
	status: number;
}