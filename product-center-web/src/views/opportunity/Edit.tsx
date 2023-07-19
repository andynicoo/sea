import { Affix, Breadcrumb, Button, Card, DatePicker, Form, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import OpportunityAnalysis from "./OpportunityAnalysis";
import UploadComponent from "@/components/UploadComponent";
import { useHistory } from "react-router-dom";
import { chancePointEdit, chancePointGetDetails, chancePointSave } from "@/api/opportunity";
import { cloneDeep } from "lodash";
import { OpportunityList } from "@/vo/opportunityVo";
import moment from 'moment'
import { UsersInfoVO } from "@/vo/baseVo";
import { useSelector } from "react-redux";
import { LeftOutlined } from '@ant-design/icons';

const OpportunityEdit: React.FC = () => {
    const [bottom] = useState(10);
    const [form] = Form.useForm();
    const history = useHistory<{ id?: string, caChe?: boolean }>();
    const users = useSelector((state: any) => state.global.usersAll)
    const chancePointId = history.location.state?.id
    //提交
    const onFinish = (values: any) => {
        let chancePointListClone = cloneDeep(values)
        let { originalInformation, originalInformationSourceText, originalInformationSourceUrl, proposer, submitTime } = chancePointListClone
        if (!originalInformationSourceText && (!originalInformationSourceUrl || !originalInformationSourceUrl?.length)) {
            return message.warning('请填写原始信息出处！')
        }
        submitTime = moment(submitTime).format('YYYY-MM-DD HH:mm:ss')
        let proposerUser = proposer.value
        let proposerName = proposer.label
        let chancePointList = chancePointListClone.opportunityList.map((item: OpportunityList) => {
            return { originalInformation, originalInformationSourceText, originalInformationSourceUrl, proposerUser, proposerName, submitTime, ...item }
        })
        if (chancePointId) {
            chancePointEdit({ chancePointId, ...chancePointList[0] }).then(res => {
                message.success('操作成功！')
                history.go(-1)
            })
        } else {
            chancePointSave({ chancePointList }).then(res => {
                message.success('操作成功！')
                history.go(-1)
            })
        }
    };


    useEffect(() => {
        if (chancePointId) {
            chancePointGetDetails(chancePointId).then(res => {
                let { originalInformation,
                    originalInformationSourceText,
                    originalInformationSourceUrl,
                    proposerUser,
                    submitTime,
                    chancePointName,
                    businessType,
                    chancePointDescribe,
                    chancePointAnalysis,
                    countryCode

                } = res.data
                form.setFieldsValue(
                    {
                        originalInformation,
                        originalInformationSourceText,
                        originalInformationSourceUrl,
                        proposer: { value: proposerUser },
                        submitTime: moment(submitTime),
                        opportunityList: [{
                            chancePointName,
                            businessType,
                            chancePointDescribe,
                            chancePointAnalysis,
                            countryCode
                        }]
                    })
            })
        }
    }, [])

    return <>
        <Breadcrumb className="gc-breadcrumb">
            <Breadcrumb.Item onClick={() => history.push({ pathname: '/qkgoods/opportunity/index', state: { caChe: true } })}>
                <LeftOutlined /><span>返回列表</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{chancePointId ? '编辑' : '创建'}机会点</Breadcrumb.Item>
        </Breadcrumb>
        <Form
            form={form}
            name="basic"
            labelCol={{ style: { width: '110px' } }}
            wrapperCol={{ span: 16 }}
            initialValues={{ opportunityList: [{ chancePointName: '', businessType: '', chancePointDescribe: '', chancePointAnalysis: '' }] }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Card bordered={false} title={'洞察'} className='gc-mb-2'>
                <Form.Item
                    label="原始信息"
                    name="originalInformation"
                    rules={[{ required: true, message: '请输入原始信息!' }]}
                >
                    <Input.TextArea
                        placeholder="客户需求、政策、竞品信息、BP机会"
                        autoSize={{ minRows: 3, maxRows: 8 }}
                    />
                </Form.Item>
                <Form.Item
                    label="原始信息出处"
                    required
                    name="originalInformationSourceText"
                >
                    <Input placeholder="添加文字或在下方添加图片，二选一即可" />
                </Form.Item>
                <Form.Item
                    label=""
                    name="originalInformationSourceUrl"
                    wrapperCol={{ style: { marginLeft: '110px' } }}
                >
                    <UploadComponent btnTxt="上传图片" length={5} />
                </Form.Item>
                <Form.Item
                    label="提出人"
                    name="proposer"
                    rules={[{ required: true, message: '请输入提出人!' }]}
                >
                    <Select
                        labelInValue
                        showSearch
                        optionFilterProp="label"
                        placeholder="请选择"
                        optionLabelProp="label"
                        filterOption={(input, option) => {
                            if (typeof (option?.label) !== "string") return false
                            return (option?.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                        }
                        }
                    >
                        <Select.OptGroup label={<div className="gc-select-title"><span>姓名</span><span>手机</span><span>部门</span></div>}>
                            {users.map((item: UsersInfoVO) => (
                                <Select.Option value={item.userId} key={item.userId} label={item.nickName}>
                                    <div className="gc-select-option">
                                        <span>{item.nickName}</span>
                                        <span>{item.mobile}</span>
                                        <span>{item.departmentName}</span>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select.OptGroup>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="提出时间"
                    name="submitTime"
                    rules={[{ required: true, message: '请选择时间!' }]}
                >
                    <DatePicker showTime />
                </Form.Item>
            </Card>
            <OpportunityAnalysis />
            <Affix offsetBottom={bottom}>
                <Card className="gc-mt-2" bordered={false}>
                    <Button type="primary" className="gc-mr-2" htmlType="submit">
                        提交
                    </Button>
                    <Button onClick={() => history.push({ pathname: '/qkgoods/opportunity/index', state: { caChe: true } })}>
                        取消
                    </Button>
                </Card>
            </Affix>
        </Form>

    </>
}

export default OpportunityEdit