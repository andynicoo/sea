import EditForm, { Field } from "@/components/EditForm";
import { Breadcrumb, message } from "antd";
import React, { useEffect, useState } from "react";
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { cloneDeep } from "lodash";
import { PublishInfoInputParams } from "@/vo/demandVo";
import { publishInfoInput } from "@/api/demand";
import moment from 'moment'
import { xcloudOrgDepartment } from "@/api/public";
const EntryListingEdit: React.FC = () => {
    const history = useHistory<{ record?: any, caChe?: boolean }>();
    if (!history.location.state) {
        return <></>
    }
    const {
        record
    } = history.location.state
    const requirementCode = record.requirementCode
    const pathName = history.location.pathname
    const [departmentList, setDepartmentList] = useState<any>([])
    console.log(pathName, 'pathName')
    //搜索项
    const searchFields: Field[] = [
        {

            label: "商品名称",
            name: "productName",
            type: "Input",
            placeholder: "请输入",
            width: 600,
            required: true
        },
        {

            label: "商品SKU编码",
            name: "productSku",
            type: "Input",
            placeholder: "请输入",
            width: 600,
            required: true
        },
        {
            label: "上市日期",
            name: "publishTime",
            type: "DatePicker",
            width: 600,
            required: true
        },
        {

            label: "上市事业部",
            name: "publishDepartment",
            type: "Select",
            placeholder: "请输入",
            width: 600,
            required: true,
            options: departmentList
        },
        {

            label: "已上架销售端",
            name: "client",
            type: "Radio",
            required: true,
            props: {
                options: [
                    { label: 'PC', value: 'PC' },
                    { label: 'H5', value: 'H5' },
                    { label: '线下', value: 'OFFLINE' },
                ]
            }
        },
        {
            label: "工单配置完成日期",
            name: "workOrderConfigTime",
            type: "DatePicker",
            width: 600,
            required: true
        },
        {
            label: "销售培训日期",
            name: "salesTrainingTime",
            type: "DatePicker",
            width: 600,
            required: true
        },
        {
            label: "销售培训范围",
            name: "salesScope",
            type: "TextArea",
            width: 600,
            required: true
        },
        {
            label: "客服交付培训日期",
            name: "customerTrainingTime",
            type: "DatePicker",
            width: 600,
            required: true
        },
        {
            label: "客服交付培训范围",
            name: "customerTrainingScope",
            type: "TextArea",
            width: 600,
            required: true
        },
        {
            label: "营销方案输出时间",
            name: "marketingOutputTime",
            type: "DatePicker",
            width: 600,
            required: true
        },
        {
            label: "备注",
            name: "remark",
            type: "TextArea",
            width: 600
        }

    ]
    //保存
    const onSave = async (params: PublishInfoInputParams) => {
        console.log(params, 'onSave')
        submitFn(params)
    }
    const submitFn = (params: PublishInfoInputParams) => {
        let paramsHandle = cloneDeep(params)
        paramsHandle.requirementCode = requirementCode as string
        paramsHandle.publishTime = moment(paramsHandle.publishTime).format("YYYY-MM-DD HH:mm:ss")
        paramsHandle.workOrderConfigTime = moment(paramsHandle.workOrderConfigTime).format("YYYY-MM-DD HH:mm:ss")
        paramsHandle.salesTrainingTime = moment(paramsHandle.salesTrainingTime).format("YYYY-MM-DD HH:mm:ss")
        paramsHandle.customerTrainingTime = moment(paramsHandle.customerTrainingTime).format("YYYY-MM-DD HH:mm:ss")
        paramsHandle.marketingOutputTime = moment(paramsHandle.marketingOutputTime).format("YYYY-MM-DD HH:mm:ss")
        publishInfoInput(paramsHandle).then(res => {
            message.success('操作成功！')
            history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })
        })
    }
    const onReturn = () => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })
    useEffect(() => {
        xcloudOrgDepartment({ limit: 200, page: 1 }).then(res => {
            let depList = res.data.records.map((item: any) => { return { 'label': item.departmentName, "value": item.departmentName } })
            setDepartmentList(depList)
        })
    }, [])
    return <div id="listing-information-entry">
        {pathName == "/qkgoods/demand/entryListingEdit" && <Breadcrumb className="gc-breadcrumb">
            <Breadcrumb.Item onClick={() => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })}>
                <LeftOutlined /><span>返回列表</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>录入上市结果</Breadcrumb.Item>
        </Breadcrumb>}
        <EditForm title="录入上市信息" labelWidth={150} fields={searchFields} onSave={onSave} onReturn={onReturn} okText={'确定'} />
    </div>

}

export default EntryListingEdit







