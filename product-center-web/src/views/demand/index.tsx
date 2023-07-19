import SearchForm, { Field } from "@/components/SearchForm";
import { Card, Tabs } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import NotReviewed from "./NotReviewed";
import Reviewed from "./Reviewed";
import Completed from "./Completed";
import { delPageCache, setPageCache } from "@/utils/commonUtils";
import moment from 'moment';
import { IconFont } from "../opportunity";
import { businessTypeMap, requirementTypeMap } from "@/utils/dataDictionary";
import { AuthVisible } from "@/utils/url";
const { TabPane } = Tabs;

const DemandLayout: React.FC = () => {
    const history = useHistory();
    const domRef = React.useRef();
    const searchRef = React.useRef()
    const locationState: any = history.location.state
    let demandStatusDefault: string = '1'
    let initialValues: any = {}
    if (locationState?.caChe) {
        demandStatusDefault = sessionStorage.parentStatus || '1'
        if (sessionStorage.queryParams) {
            initialValues = JSON.parse(sessionStorage.queryParams)
            if (initialValues.createTime) {
                initialValues.createTime = [moment(initialValues.createTime[0]), moment(initialValues.createTime[1])]
            }
            if (initialValues.devCompleteTime) {
                initialValues.devCompleteTime = [moment(initialValues.devCompleteTime[0]), moment(initialValues.devCompleteTime[1])]
            }
        }


    }
    const [demandStatus, setDemandStatus] = useState<string>(demandStatusDefault)
    //切换需求状态
    const demandStatusChange = (value: string) => {
        delPageCache()
        setPageCache("parentStatus", value)

        setDemandStatus(value)
        // @ts-ignore
        searchRef.current.clearFields()
    }
    //搜索
    const onSearch = async (params: any) => {
        // @ts-ignore
        domRef.current.onSearch(params)
    }
    // const demandExport = async () => {
    //     // @ts-ignore
    //     domRef.current.demandExport()
    // }
    // const operations = <div className="gc-create-export">
    //     {AuthVisible("DEMAND1_1") && <span className="gc-create-btn" onClick={() => history.push('/qkgoods/demand/costReductionEdit')}>
    //         <IconFont className="gc-iconfont" type="icon-chuangjianjihuidian" /> 创建降本需求</span>}
    //     {AuthVisible("DEMAND1_2") && <span className="gc-export-btn" onClick={demandExport}><IconFont className="gc-iconfont" type="icon-daochu" /> 导出</span>}
    // </div>;
    //搜索项
    const searchFields: Field[] = [
        {

            label: "关键字",
            name: "keyword",
            type: "Input",
            placeholder: "请输入关键字"
        },
        {

            label: "需求创建人",
            name: "requirementCreateUserId",
            type: "UserSelect",
            placeholder: "请选择",
        },
        {
            label: "创建时间",
            name: "createTime",
            type: "RangePicker"
        },
        {
            label: "完成时间",
            name: "devCompleteTime",
            type: "RangePicker"
        },
        {
            label: "需求类型",
            name: "requirementType",
            type: "Select",
            placeholder: "请选择",
            options: requirementTypeMap
        },
        {
            label: "业务类型",
            name: "businessType",
            type: "Select",
            placeholder: "请选择",
            options: businessTypeMap
        },
    ]
    return <>
        <Card>
            <SearchForm ref={searchRef} initialValues={initialValues} fields={searchFields} onSearch={onSearch} />
        </Card>
        <Card bordered={false} className="gc-mt-2">
            <Tabs className="gc-parent-tabs" destroyInactiveTabPane={true} type='card' activeKey={demandStatus} onChange={demandStatusChange}>
                <TabPane tab={"待评审"} key="1" className="gc-parent-tabpane">
                    <NotReviewed ref={domRef} key='NotReviewed' />
                </TabPane>
                <TabPane tab={"已评审"} key="2" className="gc-parent-tabpane">
                    <Reviewed ref={domRef} key='Reviewed' />
                </TabPane>
                <TabPane tab={"已完成"} key="3" className="gc-parent-tabpane">
                    <Completed ref={domRef} key='Completed' />
                </TabPane>
            </Tabs>
        </Card>
    </>

}

export default DemandLayout