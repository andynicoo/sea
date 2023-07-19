import { ListingInformationOV, TestResultInformationVO } from "@/vo/supplyVo";
import { Card } from "antd";
import React from "react";
const OppoDetailsComponent: React.FC<any> = (props) => {
    let publishInfoDTO: ListingInformationOV = {}
    if (props.requirementInputInfoDetails) {
        publishInfoDTO = props.requirementInputInfoDetails.publishInfoDTO
    }
    return <>
        {publishInfoDTO.productName && <Card id="listing-information-entry" bordered={false} title="上市信息录入" className="gc-mt-2">
            <ul className="gc-detail-warp">
                <li><span>商品名称</span>{publishInfoDTO.productName}</li>
                <li><span>上市日期:</span>{publishInfoDTO.publishTime}</li>
                <li><span>上市事业部:</span>{publishInfoDTO.publishDepartment}</li>
                <li><span>已上架销售端:</span>{publishInfoDTO.client == "OFFLINE" ? '线下' : publishInfoDTO.client}</li>
                <li><span>工单配置完成日期:</span>{publishInfoDTO.workOrderConfigTime}</li>
                <li><span>销售培训日期:</span>{publishInfoDTO.salesTrainingTime}</li>
                <li><span>销售培训范围:</span>{publishInfoDTO.salesScope}</li>
                <li><span>客服交付培训日期:</span>{publishInfoDTO.customerTrainingTime}</li>
                <li><span>客服交付培训范围:</span>{publishInfoDTO.customerTrainingScope}</li>
                <li><span>营销方案输出时间:</span>{publishInfoDTO.marketingOutputTime}</li>
                <li><span>备注:</span>{publishInfoDTO.remark || '--'}</li>
                <li><span>录入人:</span>{publishInfoDTO.createName}</li>
                <li><span>录入时间:</span>{publishInfoDTO.createTime}</li>
            </ul>
        </Card>}
    </>
}

export default OppoDetailsComponent