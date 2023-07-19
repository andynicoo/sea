
//供应商信息
export interface SupplierInfoVo {
		id: string;
		supplierName: string;
		shortName: string;
		supplierType: number;
		supplierCode: string;
		companyName: string;
		countryCode: string;
		countryName:string;
		province: string;
		city: string;
		streetAddress: string;
		supplierAddress: string;
		postcode: string;
		contacts: string;
		contactsTell: string;
		email: string;
		status: any;
		contractNum: string;
		contractDate:any;
		contractStartDate: string;
		contractEndDate: string;
		attorneyCertificate: any;
		attorneyCertificateReferenceNum: string;
		attorneyCertificateDate: any;
		attorneyCertificateCountryNameEn: string;
		attorneyCertificateProvinceEn: string;
		attorneyCertificateNum: string;
		attorneyTwoEmail: string;
		attorneyFaxNo: string;
		comment: string;
		createTime: string;
		createId: string;
		createName: string;
		updateTime: string;
		modifyId: string;
		modifyName: string;
		affiliationCreateId: string;
		affiliationCreateName: string;
		taxNumberFileTemp: string;
		iban: string;
		bankIdentifierCode: string;
		bankName: string;
		bankAddress: string;
		accountName: string;
		categoryDTOLists: any[];
		scSupplierConfigDTOS:any[];
}

export interface StatisticsInfo {
	IN_PAID?: number;
	NO_PAID?: number;
	PAID?: number;
	PENDING_PAID?: number;
}

export interface ScPurchaseOrderDetailDTO {
	id: string;
	paymentOrderId: string;
	purchaseNo: string;
	serviceNo: string;
	workNo: string;
	orderNo: string;
	productName: string;
	customer: string;
	status: string;
	payableAmount: number;
	incomeAmount: number;
	countryCode: string;
	businessCode: string;
	officialFee: number;
	serviceFee: number;
	otherFee: number;
	exchangeRate: number;
	settlementAmount: number;
	accSettlementAmount: number;
	nonSettlementAmount: number;
	taxRate: number;
	estimateCost: number;
	grossProfit: number;
	grossProfitRate: number;
	approvalNo: string;
	remark: string;
	mark: string;
	originalPurchaseNo: string;
	deleted: boolean;
	createBy: string;
	createTime: string;
	updateBy: string;
	updateTime: string;
}

export interface ScPaymentOrderDetailVo {
	id: string;
	paymentNo: string;
	totalAmount: number;
	applyTime: string;
	settlementAmount: number;
	payEnterpriseId: number;
	payEnterpriseName: string;
	serviceProviderName: string;
	serviceProviderNo: string;
	status: string;
	confirmPaymentTime: string;
	paidTime: string;
	currency: string;
	currencyShort: string;
	deleted: boolean;
	createBy: string;
	createTime: string;
	updateBy: string;
	updateTime: string;
	scPurchaseOrderDetailDTOS: ScPurchaseOrderDetailDTO[];
}