/**海外需求 */
export interface Demand {
    id: string;
    type: string;
    typeName: string;
    title: string;
    content: string;
    endTime: string;
    mobile: string;
    wechat: string;
    qq: string;
    email: string;
    auditStatus: string;
    status?: "JXZ" | "YJJ";
    name: string;
    userId: string;
    participationNum: number;
    createdAt: string;
    updatedAt: string;
    avatar: string;
}

/**海外需求类型 */
export interface DemandType {
    id: string;
    code: string;
    iconUrl: string;
    value: string;
    remarks: string;
    name: string;
    pid: string;
    createAt: string;
}

