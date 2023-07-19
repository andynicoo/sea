import { inputDevelopResult } from "@/api/demand";
import EditForm, { Field } from "@/components/EditForm";
import { InputTestOrderResultParams } from "@/vo/demandVo";
import { Breadcrumb, message } from "antd";
import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { LeftOutlined } from '@ant-design/icons';
import moment from 'moment'
import { useHistory } from "react-router-dom";
import { RangePickerProps } from "antd/lib/date-picker";
import { range } from "./EntryTestsheetEdit";
const CostReductionTestsheetEdit: React.FC = () => {
    const history = useHistory<{ caChe?: boolean, record?: any }>();
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
            disabledMinutes: (h: any) => {
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

            label: "前成本",
            name: "costBefore",
            type: "InputNumber",
            placeholder: "请输入",
            width: 600,
            required: true,
            props: {
                addonAfter: currency
            }
        },
        {

            label: "降本后成本",
            name: "costAfter",
            type: "InputNumber",
            placeholder: "请输入",
            width: 600,
            required: true,
            props: {
                addonAfter: currency
            }
        },
        {

            label: "达成降本比例",
            name: "costReductionRatio",
            type: "InputNumber",
            placeholder: "请输入",
            width: 600,
            required: true,
            props: {
                min: 0,
                max: 100,
                formatter: (value: any) => `${value}%`,
                parser: (value: any) => value!.replace('%', '')
            }
        },
        {
            label: "完成降本时间",
            name: "completeTime",
            type: "DatePicker",
            width: 600,
            required: true,
            props: {
                disabledDate,
                disabledTime: disabledRangeTime
            }
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
        paramsHandle.completeTime = moment(paramsHandle.completeTime).format("YYYY-MM-DD HH:mm:ss")
        inputDevelopResult(paramsHandle).then(res => {
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
            <Breadcrumb.Item>录入开发结果</Breadcrumb.Item>
        </Breadcrumb>
        <EditForm title="录入结果信息" labelWidth={150} fields={searchFields} onSave={onSave} onReturn={onReturn} okText={'确定'} />
    </>


}

export default CostReductionTestsheetEdit







