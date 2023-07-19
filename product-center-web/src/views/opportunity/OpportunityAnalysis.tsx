import { Button, Card, Form, Input, Select } from "antd";
import React from "react";
import '@/styles/opportunity.scss'
import { businessTypeMap } from "@/utils/dataDictionary";
import { useHistory } from "react-router-dom";
import { CloseOutlined } from '@ant-design/icons';
import { IconFont } from "@/views/opportunity";
import { useSelector } from "react-redux";
const OpportunityAnalysis: React.FC = () => {
    const history = useHistory<{ id: string }>();
    const chancePointId = history.location.state?.id
    const countryList = useSelector((state: any) => state.global.countryAll)
    return <>
        <Form.List name="opportunityList">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...restField }, index) => (
                        <Card bordered={false} key={key} title={`机会点分析 ${index + 1}`} className='gc-mb-2' extra={!chancePointId && index > 0 && <CloseOutlined onClick={() => remove(name)} />} >
                            <Form.Item
                                {...restField}
                                label="国家"
                                name={[name, 'countryCode']}
                                rules={[{ required: true, message: '请输入机会点名称!' }]}
                            >
                                {countryList.length && <Select
                                    showSearch={true}
                                    filterOption={(input, option) => {
                                        return (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                    }
                                    placeholder="请选择">
                                    {countryList.map((item: any) =>
                                        <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                    )}
                                </Select>}
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                label="机会点名称"
                                name={[name, 'chancePointName']}
                                rules={[{ required: true, message: '请输入机会点名称!' }]}
                            >
                                <Input
                                    placeholder="请输入"
                                />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                label="机会点类型"
                                name={[name, 'businessType']}
                                rules={[{ required: true, message: '请输选择机会点类型!' }]}
                            >
                                <Select placeholder="请选择">
                                    {businessTypeMap.map((item, key) =>
                                        <Select.Option key={key} value={item.value}>{item.label}</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                label="机会点描述"
                                name={[name, 'chancePointDescribe']}
                                rules={[{ required: true, message: '请输入机会点描述!' }]}
                            >
                                <Input.TextArea
                                    placeholder="请输入"
                                    autoSize={{ minRows: 3, maxRows: 8 }}
                                />
                            </Form.Item>
                            <Form.Item
                                {...restField}
                                label="机会点分析"
                                name={[name, 'chancePointAnalysis']}
                                rules={[{ required: true, message: '请输入机会点分析!' }]}
                            >
                                <Input.TextArea
                                    placeholder="请输入"
                                    autoSize={{ minRows: 3, maxRows: 8 }}
                                />
                            </Form.Item>
                            {!chancePointId && fields.length == index + 1 && <Form.Item>
                                <Button size="large" className="gc-add-chance-point" onClick={() => add()}>
                                    <IconFont className="gc-iconfont" type="icon-xinzengjihuidian" />新增机会点
                                </Button>
                            </Form.Item>}
                        </Card>
                    ))}

                </>
            )}
        </Form.List>
    </>
}

export default OpportunityAnalysis