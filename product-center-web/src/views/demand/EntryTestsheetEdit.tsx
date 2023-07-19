import EditForm, { Field } from "@/components/EditForm";
import { Breadcrumb, message } from "antd";
import React, { useEffect, useState } from "react";
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { inputTestOrderResult } from "@/api/demand";
import { InputTestOrderResultParams } from "@/vo/demandVo";
import { cloneDeep } from "lodash";
import moment from 'moment'
import { RangePickerProps } from "antd/lib/date-picker";
export const range = (start: any, end: any) => {
    const result = []
    for (let i = start; i < end; i++) {
        result.push(i)
    }
    return result
}
const DevelopmentTestsheetEdit: React.FC = () => {
    const history = useHistory<{ caChe?: boolean, record?: any, }>();
    if (!history.location.state) {
        return <></>
    }
    const {
        record
    } = history.location.state
    const { devCompleteTime, requirementCode, currency } = record
    //搜索项
    const disabledDate: RangePickerProps['disabledDate'] = current => {
        return moment(current).format('YYYY-MM-DD') < (moment(devCompleteTime).format('YYYY-MM-DD')) || current > moment(new Date())
    };
    const disabledRangeTime: any = (data: any) => {
        const timeDay = moment(data).format('YYYY-MM-DD')
        var now: Date = new Date()
        var hour: number = now.getHours()
        var minutes: number = now.getMinutes()
        var starthour: number = new Date(devCompleteTime as string).getHours() + 1
        return {
            disabledHours: () => {
                if (timeDay == moment(devCompleteTime).format('YYYY-MM-DD')) {
                    return range(0, 24).splice(0, starthour)
                } else if (timeDay == moment(now).format('YYYY-MM-DD')) {
                    return range(0, 24).splice(hour + 1, 100)
                } else {
                    return []
                }
            },
            disabledMinutes: (h: number) => {
                if (timeDay == moment(now).format('YYYY-MM-DD')) {
                    if (h < hour) {
                        return []
                    } else if (h == hour) {
                        return range(minutes, 100)
                    } else {
                        return range(0, 100)
                    }
                } else {
                    return []
                }
            },
            disabledSeconds: () => []
        }
    }
    const searchFields: Field[] = [
        {

            label: "测试订单收款金额",
            name: "orderCollectionAmount",
            type: "InputNumber",
            placeholder: "请输入",
            width: 600,
            required: true,
            props: {
                addonAfter: currency
            }
        },
        {

            label: "测试订单成本",
            name: "orderCostAmount",
            type: "InputNumber",
            placeholder: "请输入",
            width: 600,
            required: true,
            props: {
                addonAfter: currency
            }
        },
        {

            label: "测试订单归属销售",
            name: "orderBelongsSales",
            type: "UserSelect",
            placeholder: "请输入",
            width: 600,
            required: true
        },
        {
            label: "测单资料提交时间",
            name: "dataSubmitTime",
            type: "DatePicker",
            width: 600,
            required: true
        },
        {
            label: "测单完成时间",
            name: "completeTime",
            type: "DatePicker",
            width: 600,
            required: true,
            tooltip: '测单完成时间不得早于供应链合同审核时间',
            props: {
                disabledDate,
                disabledTime: disabledRangeTime
            }
        },
        {

            label: "测单完成交付号码",
            name: "deliverCode",
            type: "Input",
            placeholder: "请输入",
            width: 600,
            required: true,
            tooltip: '根据业务线测单完成后的结果凭证，例如，VAT税号，商标受理号等'
        },
        {

            label: "测单时效及情况说明",
            name: "deliverDesc",
            type: "TextArea",
            placeholder: "请输入",
            width: 600,
            required: true
        }

    ]
    //保存
    const onSave = async (params: InputTestOrderResultParams) => {
        console.log(params, 'onSave')
        submitFn(params)
    }
    const submitFn = (params: InputTestOrderResultParams) => {
        let paramsHandle = cloneDeep(params)
        paramsHandle.requirementCode = requirementCode as string
        paramsHandle.dataSubmitTime = moment(paramsHandle.dataSubmitTime).format("YYYY-MM-DD HH:mm:ss")
        paramsHandle.completeTime = moment(paramsHandle.completeTime).format("YYYY-MM-DD HH:mm:ss")
        inputTestOrderResult(paramsHandle).then(res => {
            message.success('操作成功！')
            history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })
        })
    }
    const onReturn = () => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })

    return <>
        <Breadcrumb className="gc-breadcrumb">
            <Breadcrumb.Item onClick={() => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })}>
                <LeftOutlined /><span>返回列表</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>录入测单结果</Breadcrumb.Item>
        </Breadcrumb>
        <EditForm title="录入测单信息" labelWidth={160} fields={searchFields} onSave={onSave} onReturn={onReturn} okText={'确定'} />
    </>

}

export default DevelopmentTestsheetEdit







