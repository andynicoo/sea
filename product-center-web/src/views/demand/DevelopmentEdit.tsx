import { requirementPointGetDetails, supplierRequirementSaveDevelop } from "@/api/demand";
import { getCountryList } from "@/api/public";
import EditForm, { Field } from "@/components/EditForm";
import { currencyMap, degreeUrgencyMap } from "@/utils/dataDictionary";
import { DemandRecordsVO, DevelopParams, SupplierRequirementDTO } from "@/vo/demandVo";
import { Breadcrumb, message } from "antd";
import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import moment from 'moment'
import { LeftOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
const CostReduction: React.FC = () => {
    const countryList = useSelector((state: any) => state.global.countryAll)
    const history = useHistory<{ detailsFlag?: boolean, caChe?: boolean, requirementPointId?: string, record?: DemandRecordsVO }>();
    if (!history.location.state) {
        return <></>
    }
    const demandRow = history.location.state.record
    const requirementPointId = history.location.state?.requirementPointId || history.location.state?.record?.requirementPointId
    const requirementCode = history.location.state?.record?.requirementCode
    const [supplierRequirementDetails, setSupplierRequirementDetailsDetails] = useState<SupplierRequirementDTO>()
    const [textItem, setTextItem] = useState<Field[]>([]);
    const getTextItem = () => {
        setTextItem([
            {
                label: "需求名称",
                type: "Text",
                placeholder: demandRow?.requirementName,
            },
            {
                label: "需求编码",
                type: "Text",
                placeholder: demandRow?.requirementCode,
            },
            {
                label: "商品经理",
                type: "Text",
                placeholder: demandRow?.commodityManagerName,
            }
        ])
    }
    useEffect(getTextItem, [])
    //搜索项
    const searchFields: Field[] = [
        ...textItem,
        {
            label: "开发需求",
            name: "developmentRequirement",
            type: "TextArea",
            width: 600,
            required: true
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

            label: "紧急程度 ",
            name: "urgencyDegree",
            type: "Select",
            placeholder: "请选择",
            options: degreeUrgencyMap,
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
    const onSave = async (params: DevelopParams) => {
        console.log(params, 'onSave')
        submitFn(params, "PUSHED")
    }
    //保存
    const onDraft = async (params: DevelopParams) => {
        console.log(params, 'onDraft')
        submitFn(params, "PENDING_PUSH")
    }
    const submitFn = (params: DevelopParams, flag: string) => {
        let paramsHandle = cloneDeep(params)
        paramsHandle.targetCompletionTime = moment(paramsHandle.targetCompletionTime).format("YYYY-MM-DD HH:mm:ss")
        paramsHandle.isShow = flag
        paramsHandle.requirementCode = demandRow?.requirementCode as string
        supplierRequirementSaveDevelop(paramsHandle).then(res => {
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
            <Breadcrumb.Item>开发需求</Breadcrumb.Item>
        </Breadcrumb>
        <EditForm title="开发需求录入" initialValues={supplierRequirementDetails} labelWidth={150} fields={searchFields} onSave={onSave} onDraft={onDraft} onReturn={onReturn} okText={'提交至供应链'} draftText={'保存'} />
    </>
}

export default CostReduction







