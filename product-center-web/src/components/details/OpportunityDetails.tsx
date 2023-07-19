import { Card, Image } from "antd";
import React, { useEffect, useState } from "react";
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { OriginalRecordsVO } from "@/vo/opportunityVo";
import { chancePointGetDetails } from "@/api/opportunity";
import { auditHistoryMap } from "@/utils/dataDictionary";
interface ODProps {
    chancePointId?: string,
    requirementInputInfoDetails?: any
}
const OppoDetailsComponent: React.FC<ODProps> = ({ chancePointId, requirementInputInfoDetails }) => {
    const [auditHistory, setAuditHistory] = useState<boolean>(false)
    let [oppoInfo, setOppoInfo] = useState<OriginalRecordsVO>()
    if (requirementInputInfoDetails) {
        oppoInfo = requirementInputInfoDetails.chancePoint
    }
    useEffect(() => {
        if (chancePointId) {
            chancePointGetDetails(chancePointId).then(res => {
                setOppoInfo(res.data)
            })
        }
    }, [])
    return <div id="opportunity-point-information" className="gc-opportunity-details">
        <Card bordered={false} title="机会点资料">
            <ul className="gc-detail-warp">
                <li><span>原始信息:</span>{oppoInfo?.originalInformation}</li>
                <li><span>原始信息出处:</span>{oppoInfo?.originalInformationSourceText}</li>
                {(oppoInfo?.originalInformationSourceUrl && oppoInfo?.originalInformationSourceUrl.length > 0) && <li><span></span><Image.PreviewGroup>
                    {oppoInfo?.originalInformationSourceUrl.map((item, key) => <Image className="gc-details-img" key={key} width={160} src={item} />)}
                </Image.PreviewGroup></li>}
                <li><span>提出人:</span>{oppoInfo?.proposerName}</li>
                <li><span>提出时间:</span>{oppoInfo?.submitTime}</li>
            </ul>
            <ul className="gc-detail-warp gc-detail-warp-mg2">
                <li><span>国家:</span>{oppoInfo?.countryCodeName}</li>
                <li><span>机会点名称:</span>{oppoInfo?.chancePointName}</li>
                {oppoInfo?.requirementCode && <li><span>机会点编号:</span>{oppoInfo?.requirementCode}</li>}
                <li><span>机会点类型:</span>{oppoInfo?.businessTypeName}</li>
                <li><span>机会点描述:</span>{oppoInfo?.chancePointDescribe}</li>
                <li><span>机会点分析:</span>{oppoInfo?.chancePointAnalysis}</li>
            </ul>
            <ul className="gc-detail-warp">
                <li><span>信息同步人:</span>{oppoInfo?.createName}</li>
                <li><span>创建时间:</span>{oppoInfo?.createTime}</li>
                {oppoInfo?.chancePointStatus !== 'PENDING_REVIEW' && <><li><span>审核人:</span>{oppoInfo?.verifyName}
                    {oppoInfo?.auditHistory.length && <div className="gc-audit-history">
                        <span className="gc-verify-name" onClick={() => { setAuditHistory(!auditHistory) }}>审核历史{auditHistory ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
                        {auditHistory && <table className="gc-audit-history-item">
                            <tbody>
                                {oppoInfo?.auditHistory.map((item, key) => <tr key={key}>
                                    <td>{auditHistoryMap[item.verifyRecord]}人</td><td>{item.verifyName}</td><td>{auditHistoryMap[item.verifyRecord]}时间</td><td>{item.createTime}</td>
                                </tr>)}
                            </tbody>

                        </table>
                        }
                    </div>}
                </li>
                    <li><span>审核时间:</span>{oppoInfo?.verifyTime}</li></>}
            </ul>
        </Card>
    </div >
}

export default OppoDetailsComponent