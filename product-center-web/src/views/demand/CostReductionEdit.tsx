import { requirementPointGetDetails, supplierRequirementSaveCostReduction } from "@/api/demand";
import { getCountryList } from "@/api/public";
import EditForm, { Field } from "@/components/EditForm";
import { businessTypeMap, currencyMap, degreeUrgencyMap } from "@/utils/dataDictionary";
import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import moment from 'moment'
import { Breadcrumb, message } from "antd";
import { CostreductionParams, DemandRecordsVO, RequirementInputInfoDetailsOV, SupplierRequirementDTO } from "@/vo/demandVo";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { LeftOutlined } from '@ant-design/icons';

const CostReduction: React.FC = () => {
    const countryList = useSelector((state: any) => state.global.countryAll)
    const history = useHistory<{ detailsFlag?: boolean, caChe?: boolean, requirementPointId?: string, record?: DemandRecordsVO }>();
    const requirementPointId = history.location.state?.requirementPointId || history.location.state?.record?.requirementPointId
    const requirementCode = history.location.state?.record?.requirementCode
    const [supplierRequirementDetails, setSupplierRequirementDetailsDetails] = useState<SupplierRequirementDTO>()
    //form项
    const searchFields: Field[] = [
        {

            label: "国家",
            name: "countryCode",
            type: "Select",
            placeholder: "请选择",
            options: countryList || [],
            width: 600,
            required: true,
            props: {
                showSearch: true
            }
        },
        {

            label: "币种",
            name: "currency",
            type: "Select",
            placeholder: "请选择",
            options: currencyMap || [],
            width: 600,
            required: true
        },
        {

            label: "需求名称",
            name: "requirementName",
            type: "Input",
            placeholder: "请输入",
            width: 600,
            required: true
        },
        {

            label: "业务类型",
            name: "businessType",
            type: "Select",
            placeholder: "请选择",
            options: businessTypeMap,
            width: 600,
            required: true
        },
        {

            label: "紧急程度 ",
            name: "urgencyDegree",
            type: "Select",
            placeholder: "请选择",
            options: degreeUrgencyMap,
            width: 600,
            required: true
        },
        {

            label: "商品经理 ",
            name: "commodityManager",
            type: "UserSelect",
            placeholder: "请选择",
            width: 600,
            required: true,
            props: {
                labelInValue: true
            }
        },
        {
            label: "开发需求",
            name: "developmentRequirement",
            type: "TextArea",
            width: 600,
            required: true
        },
        {

            label: "预测单量（单月）",
            name: "forecastUnitQuantity",
            type: "InputNumber",
            placeholder: "请输入",
            width: 600,
            required: true
        },
        {

            label: "同行售价（平均值）",
            name: "peerSellingPrice",
            type: "InputNumber",
            placeholder: "请输入",
            width: 600,
            required: true
        },
        {
            label: "目标完成时间",
            name: "targetCompletionTime",
            type: "DatePicker",
            width: 600,
            required: true
        }
    ]
    //提交至供应链
    const onSave = async (params: CostreductionParams) => {
        console.log(params, 'onSave')
        submitFn(params, "PUSHED")
    }
    //保存
    const onDraft = async (params: CostreductionParams) => {
        console.log(params, 'onDraft')
        submitFn(params, "PENDING_PUSH")
    }
    const submitFn = (params: CostreductionParams, flag: string) => {
        let paramsHandle = cloneDeep(params)
        //@ts-ignore 
        paramsHandle.commodityManager = params.commodityManager.value
        //@ts-ignore 
        paramsHandle.commodityManagerName = params.commodityManager.label
        paramsHandle.targetCompletionTime = moment(paramsHandle.targetCompletionTime).format("YYYY-MM-DD HH:mm:ss")
        paramsHandle.isShow = flag
        if (requirementCode) paramsHandle.requirementCode = history.location.state?.record?.requirementCode as string
        supplierRequirementSaveCostReduction(paramsHandle).then(res => {
            message.success('操作成功！')
            history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })
        })
    }
    const onReturn = () => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })
    useEffect(() => {
        if (requirementPointId) {
            requirementPointGetDetails(requirementPointId).then(res => {
                let DTOhandle: any = cloneDeep(res.data.supplierRequirementDTO)
                DTOhandle.targetCompletionTime = moment(DTOhandle.targetCompletionTime)
                setSupplierRequirementDetailsDetails(DTOhandle)

            })
        }
    }, [])
    return <>
        <Breadcrumb className="gc-breadcrumb">
            <Breadcrumb.Item onClick={() => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })}>
                <LeftOutlined /><span>返回列表</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>降本需求</Breadcrumb.Item>
        </Breadcrumb>
        <EditForm detailsFlag={history.location.state?.detailsFlag} initialValues={supplierRequirementDetails} title="降本需求录入" labelWidth={150} fields={searchFields} onSave={onSave} onDraft={onDraft} onReturn={onReturn} okText={'提交至供应链'} draftText={'保存'} />
    </>

}

export default CostReduction







