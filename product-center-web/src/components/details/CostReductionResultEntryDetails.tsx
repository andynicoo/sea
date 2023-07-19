import { supplierRequirementDetail } from "@/api/supply";
import { TestResultInformationVO } from "@/vo/supplyVo";
import { Card, Image } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const CostReductionResultEntryDetails: React.FC<any> = (props) => {
    // let [requirementResultDTO,setRequirementResultDTO] = useState<any> = {}
    const [requirementResultDTO, setRequirementResultDTO] = useState<any>({});
    console.log(props, requirementResultDTO)
    useEffect(() => {
        if (props.detailsRow.requirementCode) {
            supplierRequirementDetail({ requirementCode: props.detailsRow.requirementCode }).then(res => {
                setRequirementResultDTO(res.data.requirementResultDTO);
            })
        }
    }, [props.detailsRow])
    return <>
        <Card bordered={false}>
            {props.detailsRow.requirementType == "COST_REDUCTION" ?
                <ul className="gc-detail-warp">
                    <li><span>前成本:</span>{requirementResultDTO && requirementResultDTO?.costBefore} ({requirementResultDTO.currency})</li>
                    <li><span>降本后成本:</span>{requirementResultDTO?.costAfter} ({requirementResultDTO.currency})</li>
                    <li><span>达成降本比例:</span>{requirementResultDTO?.costReductionRatio}</li>
                    <li><span>完成降本时间:</span>{requirementResultDTO?.completeTime}</li>
                </ul>
                : <ul className="gc-detail-warp">
                    <li><span>测试订单收款金额:</span>{requirementResultDTO.orderCollectionAmount} ({requirementResultDTO.currency})</li>
                    <li><span>测试订单成本:</span>{requirementResultDTO.orderCostAmount} ({requirementResultDTO.currency})</li>
                    <li><span>测试订单归属销售:</span>{requirementResultDTO.orderBelongsSales}</li>
                    <li><span>测单开始时间:</span>{requirementResultDTO.dataSubmitTime}</li>
                    <li><span>测单完成时间:</span>{requirementResultDTO.completeTime}</li>
                    <li><span>测单完成交付号码:</span>{requirementResultDTO.deliverCode}</li>
                    <li><span>测单时效及情况说明:</span>{requirementResultDTO.deliverDesc}</li>
                </ul>
            }
        </Card>
    </>
}

export default CostReductionResultEntryDetails