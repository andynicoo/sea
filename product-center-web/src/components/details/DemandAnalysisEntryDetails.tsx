import { RequirementInputInfo } from "@/vo/demandVo";
import { Card } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
const OppoDetailsComponent: React.FC<any> = (props) => {
    const history = useHistory<{ showWeights?: boolean }>();

    const {
        showWeights
    } = history.location.state
    let requirementInputInfo: RequirementInputInfo = {}
    let requirementPointDTO: any = {}
    if (props.requirementInputInfoDetails) {
        requirementInputInfo = props.requirementInputInfoDetails.requirementInputInfo
        requirementPointDTO = props.requirementInputInfoDetails.requirementPointDTO
    }

    return <>
        <Card id="demand-analysis-entry" title="需求分析录入" className="gc-mt-2">
            <ul className="gc-detail-warp">
                <li><span>需求名称</span>{requirementPointDTO.requirementName}</li>
                <li><span>需求编号:</span>{requirementPointDTO.requirementCode}</li>
                <li><span>创建人:</span>{requirementPointDTO.createName}</li>
                <li><span>需求创建时间:</span>{requirementPointDTO.createTime}</li>
                <li><span>战略价值:</span>{requirementInputInfo?.strategicValue}</li>
                <li><span>政策趋势:</span>{requirementInputInfo?.policyTrends}</li>
                <li><span>市场容量:</span>{requirementInputInfo?.marketCapacity}</li>
                <li><span>竞争情况:</span>{requirementInputInfo?.competition}</li>
                <li><span>客户群体:</span>{requirementInputInfo?.customerGroup}</li>
                <li><span>实现难易程度:</span>{requirementInputInfo?.degreeOfDifficulty}</li>
                <li><span>获利能力:</span>{requirementInputInfo?.profitability}</li>
                <li><span>未来三年符合增长率:</span>{requirementInputInfo?.growthRate}</li>
                <li><span>SaaS化的可能性:</span>{requirementInputInfo?.possibilityOfSaas}</li>
                <li><span>我司优劣势:</span>{requirementInputInfo?.swot}</li>
                <li><span>其他:</span>{requirementInputInfo?.others || '--'}</li>
                <li><span>需求分析录入人:</span>{requirementInputInfo.inputName}</li>
                <li><span>需求分析录入时间:</span>{requirementInputInfo.createTime}</li>
                {requirementPointDTO.verifyName && <li><span>需求分析评审人:</span>{requirementPointDTO.verifyName}</li>}
                {requirementPointDTO.verifyTime && <li><span>需求分析评审时间:</span>{requirementPointDTO.verifyTime}</li>}
            </ul>
        </Card>
        {showWeights && <Card id="demand-weight-calculation" title="需求权重计算" className="gc-mt-2">
            <dl className="gc-demand-weight">
                <dt>
                    <div className="gc-demand-weight-item"><span>需求评估要素</span></div>
                    <div className="gc-demand-weight-item"><span>评分标准</span></div>
                    <div className="gc-demand-weight-item"><span>权重</span></div>
                    <div className="gc-demand-weight-item"><span>评分</span></div>
                </dt>
                <dd>
                    <div className="gc-demand-weight-item"><span className="gc-demand-weight-required">战略协同</span></div>
                    <div className="gc-demand-weight-item">
                        <span>
                            客户群体、合规领域、SP BP规划<br />
                            以上三个维度越接近分越高
                        </span>
                    </div>
                    <div className="gc-demand-weight-item"><span>30%</span></div>
                    <div className="gc-demand-weight-item">
                        {requirementInputInfo.strategicCoordinationScore}
                    </div>
                </dd>
                <dd>
                    <div className="gc-demand-weight-item"><span className="gc-demand-weight-required">市场空间（容量）</span></div>
                    <div className="gc-demand-weight-item">
                        <span>
                            1-5分<br />
                            市场容量10个亿以上5分<br />
                            4-10个亿 4分<br />
                            2-4亿 3分<br />
                            1-2个亿 2分<br />
                            小于1亿 1分
                        </span>
                    </div>
                    <div className="gc-demand-weight-item"><span>15%</span></div>
                    <div className="gc-demand-weight-item">
                        {requirementInputInfo.marketSpaceScore}
                    </div>
                </dd>
                <dd>
                    <div className="gc-demand-weight-item"><span className="gc-demand-weight-required">未来3年的复合增长率</span></div>
                    <div className="gc-demand-weight-item">
                        <span>
                            符合增长率30%以上 5分<br />
                            20%-30%  4分<br />
                            10%-20% 3分<br />
                            5%-10% 2分<br />
                            小于5% 1分
                        </span>
                    </div>
                    <div className="gc-demand-weight-item"><span>10%</span></div>
                    <div className="gc-demand-weight-item">
                        {requirementInputInfo.growthRateScore}
                    </div>
                </dd>
                <dd>
                    <div className="gc-demand-weight-item"><span className="gc-demand-weight-required">获利能力</span></div>
                    <div className="gc-demand-weight-item">
                        <span>
                            营业利润率、是否能自营维度<br />
                            预估毛利率80%以上 5分<br />
                            60%-80% 4分<br />
                            40-60% 3分<br />
                            20%-40% 2分<br />
                            小于20% 1分
                        </span>
                    </div>
                    <div className="gc-demand-weight-item"><span>25%</span></div>
                    <div className="gc-demand-weight-item">
                        {requirementInputInfo.profitabilityScore}
                    </div>
                </dd>
                <dd>
                    <div className="gc-demand-weight-item"><span className="gc-demand-weight-required">实现的难易程度</span></div>
                    <div className="gc-demand-weight-item">
                        <span>
                            资源接近度和周期<br />
                            非常容易 5分<br />
                            较容易4分<br />
                            一般 3分<br />
                            较难 2分<br />
                            非常难1分
                        </span>
                    </div>
                    <div className="gc-demand-weight-item"><span>10%</span></div>
                    <div className="gc-demand-weight-item">
                        {requirementInputInfo.degreeOfDifficultyScore}
                    </div>
                </dd>
                <dd>
                    <div className="gc-demand-weight-item"><span className="gc-demand-weight-required">SaaS化的可能性</span></div>
                    <div className="gc-demand-weight-item">
                        <span>
                            非常高 5分<br />
                            较高 4分<br />
                            一般 3分<br />
                            较低 2分<br />
                            非常低 1分
                        </span>
                    </div>
                    <div className="gc-demand-weight-item"><span>10%</span></div>
                    <div className="gc-demand-weight-item">
                        {requirementInputInfo.possibilityOfSaasScore}
                    </div>
                </dd>
            </dl>
        </Card>}
    </>
}

export default OppoDetailsComponent