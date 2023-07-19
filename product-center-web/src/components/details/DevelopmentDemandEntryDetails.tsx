import { degreeUrgencyMap } from "@/utils/dataDictionary";
import { AuthVisible } from "@/utils/url";
import { RequirementInputInfo, SupplierRequirementDTO } from "@/vo/demandVo";
import { Card } from "antd";
import React, { Key } from "react";
import { useSelector } from "react-redux";
const DevelopmentDemandEntryDetails: React.FC<any> = (props) => {
    let supplierRequirementDTO: SupplierRequirementDTO = {}
    const countryList = useSelector((state: any) => state.global.countryAll)
    if (props.requirementInputInfoDetails) {
        supplierRequirementDTO = props.requirementInputInfoDetails.supplierRequirementDTO || props.requirementInputInfoDetails.supplierRequirement
    }
    let urgencyDegreeTxt = degreeUrgencyMap.filter(item => item.value == supplierRequirementDTO.urgencyDegree)
    let countryTxt = countryList.filter((item: any) => item.value == supplierRequirementDTO.countryCode)

    return <>
        <Card id="development-demand-entry" title={props.title || "开发需求录入"} className="gc-mt-2">
            <ul className="gc-detail-warp">
                <li><span>需求名称</span>{supplierRequirementDTO.requirementName}</li>
                <li><span>需求编码:</span>{supplierRequirementDTO.requirementCode}</li>
                <li><span>紧急程度:</span>{urgencyDegreeTxt.length && urgencyDegreeTxt[0].label}</li>
                <li><span>商品经理:</span>{supplierRequirementDTO.commodityManagerName}</li>
                <li><span>开发要求:</span>{supplierRequirementDTO.developmentRequirement}</li>
                <li><span>国家:</span>{countryTxt.length && countryTxt[0].label}</li>
                <li><span>预测单量（单月）:</span>{supplierRequirementDTO.forecastUnitQuantity}</li>
                <li><span>同行售价（平均值）:</span>{supplierRequirementDTO.peerSellingPrice} ({supplierRequirementDTO.currency})</li>
                <li><span>目标完成时间:</span>{supplierRequirementDTO.targetCompletionTime}</li>
                <li><span>录入人:</span>{supplierRequirementDTO.createName}</li>
                <li><span>录入时间:</span>{supplierRequirementDTO.createTime}</li>
                {AuthVisible("SUPPLY1_7") && supplierRequirementDTO.contractUrl && <li><span>查看合同</span>
                    <div>{JSON.parse(supplierRequirementDTO.contractUrl).map((item: any, key: Key) => {
                        return <div key={key}><a target={"_blank"} href={item.fileUrl}>{item.origFileName}</a></div>
                    })}</div>
                </li>}
            </ul>
        </Card>
    </>
}

export default DevelopmentDemandEntryDetails