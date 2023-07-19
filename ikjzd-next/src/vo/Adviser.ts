/**顾问 */
export default interface Adviser {
    id: string;
    name: string;
    headImg: string;
    qrCode: string;
    introduction: string;
    seoTitle: string;
    seoKeywords: string;
    status: boolean;
    sort: number;
    details: string;
    praiseNum: string;
    commentNum: string;
    readNumTrue: string;
    readNum: number;
    collectNum: string;
    shareNum: string;
    deleted: string;
    createBy: string;
    createTime: string;
    updateBy: string;
    updateTime: string;
}

