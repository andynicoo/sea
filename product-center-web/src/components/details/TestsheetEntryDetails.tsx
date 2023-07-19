import { TestResultInformationVO } from "@/vo/supplyVo";
import { Card, Image } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
const TestsheetEntryDetails: React.FC<any> = (props) => {
    const history = useHistory<{ caChe?: boolean, requirementCode?: string, record?: any }>();
    const {
        record
    } = history.location.state
    let requirementResultDTO: TestResultInformationVO = {}
    if (props.requirementInputInfoDetails) {
        requirementResultDTO = props.requirementInputInfoDetails.requirementResultDTO
    }
    console.log(
        props.requirementInputInfoDetails, record
    )
    return <>
        {requirementResultDTO.createName && <Card bordered={false} id="test-sheet-information-entry" title="录入结果信息" className="gc-mt-2 gc-mb-2">
            {requirementResultDTO.orderBelongsSales ?
                <ul className="gc-detail-warp">
                    <li><span>测试订单收款金额:</span>{requirementResultDTO.orderCollectionAmount} ({requirementResultDTO.currency})</li>
                    <li><span>测试订单成本:</span>{requirementResultDTO.orderCostAmount} ({requirementResultDTO.currency})</li>
                    <li><span>测试订单归属销售:</span>{requirementResultDTO.orderBelongsSales}</li>
                    <li><span>测单开始时间:</span>{requirementResultDTO.dataSubmitTime}</li>
                    <li><span>测单完成时间:</span>{requirementResultDTO.completeTime}</li>
                    <li><span>测单完成交付号码:</span>{requirementResultDTO.deliverCode}</li>
                    <li><span>测单时效及情况说明:</span>{requirementResultDTO.deliverDesc}</li>
                    <li><span>录入人:</span>{requirementResultDTO.createName}</li>
                    <li><span>录入时间:</span>{requirementResultDTO.createTime}</li>
                </ul> :
                <ul className="gc-detail-warp">
                    <li><span>前成本:</span>{requirementResultDTO && requirementResultDTO?.costBefore} ({requirementResultDTO.currency})</li>
                    <li><span>降本后成本:</span>{requirementResultDTO?.costAfter} ({requirementResultDTO.currency})</li>
                    <li><span>达成降本比例:</span>{requirementResultDTO?.costReductionRatio}</li>
                    <li><span>完成降本时间:</span>{requirementResultDTO?.completeTime}</li>
                    <li><span>录入人:</span>{requirementResultDTO.createName}</li>
                    <li><span>录入时间:</span>{requirementResultDTO.createTime}</li>
                </ul>
            }
        </Card>}
    </>
}

export default TestsheetEntryDetails