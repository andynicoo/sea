//业务类型
export const businessTypeMap = [
    {
        label: "VAT",
        value: "VAT"
    },
    {
        label: "商标",
        value: "TRADEMARK"
    },
    {
        label: "专利",
        value: "PATENT"
    },
    {
        label: "知产咨询",
        value: "INTELLECTUAL_PROPERTY_CONSULTING"
    },
    {
        label: "R标",
        value: "R_TRADEMARK"
    },
    {
        label: "版权",
        value: "COPYRIGHT"
    },
    {
        label: "合规认证",
        value: "COMPLIANCE_CERTIFICATION"
    },
    {
        label: "海外工商",
        value: "OVERSEAS_BUSINESS"
    },
    {
        label: "其他",
        value: "OTHER"
    }
]

//紧急程度
export const degreeUrgencyMap = [
    {
        label: "不紧急不重要",
        value: "NOT_URGENT_AND_NOT_IMPORTANT"
    },
    {
        label: "紧急不重要",
        value: "URGENT_AND_NOT_IMPORTANT"
    },
    {
        label: "不紧急重要",
        value: "NOT_URGENT_AND_IMPORTANT"
    },
    {
        label: "紧急重要",
        value: "URGENT_AND_IMPORTANT"
    }
]

//需求类型
export const requirementTypeMap = [
    {
        value: 'DEVELOP',
        label: '开发需求'
    }, {
        value: 'COST_REDUCTION',
        label: '降本需求'
    }
]


//供应链数据类型
export const supplyDataTypeMap = {
    PENDING_DEVELOP: {
        label: "待开发",
        value: 'red'
    },
    DEVELOPING: {
        label: "开发中",
        value: 'blue'
    },
    COMPLETE_CONTRACT: {
        label: "完成合同",
        value: 'green'
    },
    COMPLETE_DEVELOPMENT: {
        label: "完成开发",
        value: 'green'
    },
    TEST_ORDER_COMPLETED: {
        label: "测单完成",
        value: 'green'
    },
    CLOSE: {
        label: "已终止",
        value: 'red'
    }
}


//供应链数据类型
export const auditHistoryMap: { [key: string]: string } = {
    PENDING_REVIEW: '恢复',
    PASSED_REVIEW: '审核',
    REJECTED: '拒绝',
    SHELVED: '搁置',
}


//币种
export const currencyMap = [
    {
        label: '人民币',
        value: 'CNY'
    }, {
        label: '港币',
        value: 'HKD'
    }, {
        label: '欧元',
        value: 'EUR'
    }, {
        label: '日元',
        value: 'JPY'
    }, {
        label: '新台币元',
        value: 'TWD'
    }, {
        label: '英镑',
        value: 'GBP'
    }, {
        label: '美元',
        value: 'USD'
    }, {
        label: '波兰兹罗提',
        value: 'PL'
    }, {
        label: '阿联酋',
        value: 'AED'
    }, {
        label: '沙特',
        value: 'SAR'
    }, {
        label: '澳元',
        value: 'AUD'
    }, {
        label: '加拿大元',
        value: 'CAD'
    }
]