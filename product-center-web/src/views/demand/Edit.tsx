import OppoDetailsComponent from "@/components/details/OpportunityDetails";
import { Affix, Anchor, Breadcrumb, Button, Card, Form, Input, InputNumber, message } from "antd";
import '@/styles/demand.scss'
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { cloneDeep, includes } from "lodash";
import { requirementInputInfoEditScore, requirementInputInfoInput, requirementPointGetDetails } from "@/api/demand";
import { LeftOutlined } from '@ant-design/icons';
import { RequirementInputInfoDetailsOV } from "@/vo/demandVo";
interface historyProps {
    chancePointId?: string,
    requirementPointId?: string,
    requirementName?: string,
    requirementCode?: string,
    createName?: string,
    createTime?: string,
    caChe?: boolean,
    isEdit?: boolean
}
const DemandEdit: React.FC = () => {
    const [form] = Form.useForm();
    const history = useHistory<historyProps>();
    if (!history.location.state) {
        return <></>
    }
    const [currentAnchor, setCurrentAnchor] = useState<string>('#opportunity-point-information')
    const {
        chancePointId,
        requirementPointId,
        requirementName,
        requirementCode,
        createName,
        createTime,
        isEdit
    } = history.location.state
    const onFinish = (values: any) => {
        console.log('Success:', values);
        let chancePointListClone = cloneDeep(values)
        if (isEdit) {
            requirementInputInfoEditScore({ requirementPointId, requirementCode, ...chancePointListClone }).then(res => {
                message.success('操作成功！')
                history.go(-1)
            })
        } else {
            requirementInputInfoInput({ requirementPointId, requirementCode, ...chancePointListClone }).then(res => {
                message.success('操作成功！')
                history.go(-1)
            })
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    //锚点点击
    const anchorClick = (
        e: React.MouseEvent<HTMLElement>,
        link: {
            title: React.ReactNode;
            href: string;
        },
    ) => {
        e.preventDefault();
        console.log(link.href)
        setCurrentAnchor(link.href)
    };

    useEffect(() => {
        if (requirementPointId) {
            requirementPointGetDetails(requirementPointId).then(res => {
                form.setFieldsValue(
                    {
                        ...res.data.requirementInputInfo
                    })
            })
        }
    }, [])

    return <dl className="gc-long-content">
        {/* <dt>
            <Anchor onClick={anchorClick} className="gc-anchor">
                <Anchor.Link className={currentAnchor == '#opportunity-point-information' ? "gc-anchor-link-active" : ''} href="#opportunity-point-information" title="机会点资料" />
                <Anchor.Link className={currentAnchor == '#demand-analysis-entry' ? "gc-anchor-link-active" : ''} href="#demand-analysis-entry" title="需求分析录入" />
                <Anchor.Link className={currentAnchor == '#demand-weight-calculation' ? "gc-anchor-link-active" : ''} href="#demand-weight-calculation" title="需求权重计算" />
            </Anchor></dt> */}
        <dd>
            <Breadcrumb className="gc-breadcrumb">
                <Breadcrumb.Item onClick={() => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })}>
                    <LeftOutlined /><span>返回列表</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>编辑需求信息</Breadcrumb.Item>
            </Breadcrumb>
            <OppoDetailsComponent chancePointId={chancePointId} />
            <Form
                form={form}
                name="basic"
                labelCol={{ style: { width: '180px' } }}
                wrapperCol={{ span: 16 }}
                initialValues={{}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Card id="demand-analysis-entry" title="需求分析录入" className="gc-mt-2">
                    <ul className="gc-detail-warp">
                        <li><span>需求名称:</span>{requirementName}</li>
                        <li><span>需求编号:</span>{requirementCode}</li>
                        <li><span>创建人:</span>{createName}</li>
                        <li><span>需求创建时间:</span>{createTime}</li>
                    </ul>
                    <Form.Item
                        label="战略价值"
                        name="strategicValue"
                        rules={[{ required: true, message: '请输入战略价值!' }]}
                    >
                        <Input
                            placeholder="请输入"
                        />
                    </Form.Item>
                    <Form.Item
                        label="政策趋势"
                        name="policyTrends"
                        rules={[{ required: true, message: '请输入政策趋势!' }]}
                    >
                        <Input.TextArea
                            placeholder="请输入"
                            autoSize={{ minRows: 3, maxRows: 8 }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="市场容量"
                        name="marketCapacity"
                        rules={[{ required: true, message: '请输入市场容量!' }]}
                    >
                        <Input.TextArea
                            placeholder="请输入"
                            autoSize={{ minRows: 3, maxRows: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="竞争情况"
                        name="competition"
                        rules={[{ required: true, message: '请输入竞争情况!' }]}
                    >
                        <Input.TextArea
                            placeholder="请输入"
                            autoSize={{ minRows: 3, maxRows: 8 }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="客户群体"
                        name="customerGroup"
                        rules={[{ required: true, message: '请输入客户群体!' }]}
                    >
                        <Input.TextArea
                            placeholder="请输入"
                            autoSize={{ minRows: 3, maxRows: 8 }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="实现难易程度"
                        name="degreeOfDifficulty"
                        rules={[{ required: true, message: '请输入实现难易程度!' }]}
                    >
                        <Input.TextArea
                            placeholder="请输入"
                            autoSize={{ minRows: 3, maxRows: 8 }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="获利能力"
                        name="profitability"
                        rules={[{ required: true, message: '请输入获利能力!' }]}
                    >
                        <Input
                            placeholder="请输入"
                        />
                    </Form.Item>
                    <Form.Item
                        label="未来三年符合增长率"
                        name="growthRate"
                        rules={[{ required: true, message: '请输入未来三年符合增长率!' }]}
                    >
                        <Input
                            placeholder="请输入"
                        />
                    </Form.Item>
                    <Form.Item
                        label="SaaS化的可能性"
                        name="possibilityOfSaas"
                        rules={[{ required: true, message: '请输入SaaS化的可能性!' }]}
                    >
                        <Input
                            placeholder="请输入"
                        />
                    </Form.Item>
                    <Form.Item
                        label="我司优劣势等"
                        name="swot"
                        rules={[{ required: true, message: '请输入我司优劣势等!' }]}
                    >
                        <Input
                            placeholder="请输入"
                        />
                    </Form.Item>
                    <Form.Item
                        label="其他"
                        name="others"
                    >
                        <Input
                            placeholder="请输入"
                        />
                    </Form.Item>
                </Card>
                <Card id="demand-weight-calculation" title="需求权重计算" className="gc-mt-2">
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
                                <span><Form.Item
                                    name="strategicCoordinationScore"
                                    rules={[{ required: true, message: '请输入评分!' }]}
                                >
                                    <InputNumber min={1} max={5} />
                                </Form.Item></span>
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
                                <span><Form.Item
                                    name="marketSpaceScore"
                                    rules={[{ required: true, message: '请输入评分!' }]}
                                >
                                    <InputNumber min={1} max={5} />
                                </Form.Item></span>
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
                                <span><Form.Item
                                    name="growthRateScore"
                                    rules={[{ required: true, message: '请输入评分!' }]}
                                >
                                    <InputNumber min={1} max={5} />
                                </Form.Item></span>
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
                                <span><Form.Item
                                    name="profitabilityScore"
                                    rules={[{ required: true, message: '请输入评分!' }]}
                                >
                                    <InputNumber min={1} max={5} />
                                </Form.Item></span>
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
                                <span><Form.Item
                                    name="degreeOfDifficultyScore"
                                    rules={[{ required: true, message: '请输入评分!' }]}
                                >
                                    <InputNumber min={1} max={5} />
                                </Form.Item></span>
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
                                <span><Form.Item
                                    name="possibilityOfSaasScore"
                                    rules={[{ required: true, message: '请输入评分!' }]}
                                >
                                    <InputNumber min={1} max={5} />
                                </Form.Item></span>
                            </div>
                        </dd>
                    </dl>
                </Card>
                {/* <Card title="需求分析录入" className="gc-mt-2">
                <ul className="gc-detail-warp">
                    <li><span>需求分析录入人:</span>周绮娇</li>
                    <li><span>需求分析录入时间:</span>2022-02-22 13:12:12</li>
                </ul>
            </Card> */}
                <Affix offsetBottom={10}>
                    <Card bordered={false} className="gc-mt-2">
                        <Button type="primary" className="gc-mr-2" htmlType="submit">
                            确定
                        </Button>
                        <Button onClick={() => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })}>取消</Button>
                    </Card>
                </Affix>
            </Form>
        </dd>
    </dl>
}

export default DemandEdit