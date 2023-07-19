import { Steps, Table, Tabs, Tag, Tooltip } from "antd";
import type { TablePaginationConfig } from "antd/lib/table";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useHistory } from "react-router";
import { download, setPageCache } from "@/utils/commonUtils";
import { CommodityManagerPop, sortType } from "./NotReviewed";
import moment from 'moment';
import { FilterValue } from "antd/lib/table/interface";
import { StatusCountVO } from "@/vo/opportunityVo";
import { requirementPointExport, requirementPointGetCount, requirementPointGetPage } from "@/api/demand";
import { DemandRecordsParamsVO, DemandRecordsVO } from "@/vo/demandVo";
import { CaretDownOutlined, CaretUpOutlined, TagOutlined } from '@ant-design/icons';
import { IconFont } from "../opportunity";
import { AuthVisible } from "@/utils/url";
const { TabPane } = Tabs;

const statusMap: { [key: string]: any } = {
    'UNLISTED': 'red',
    'COMPLETED': 'green',
    'CLOSE': 'red',
}
const NotReviewed: React.FC<any> = forwardRef((props, ref) => {
    const history = useHistory();
    const locationState: any = history.location.state
    const approvedRef = React.useRef()
    let typeDefault = 'UNLISTED'
    let queryParamsDefault = { current: 1, size: 10, requirementStatuss: 'UNLISTED' }
    if (locationState?.caChe && sessionStorage.queryParams) {
        let queryParamsCaChe = JSON.parse(sessionStorage.queryParams)
        queryParamsDefault = queryParamsCaChe
        typeDefault = queryParamsCaChe.requirementStatuss
    }
    const [currId, setCurrId] = useState<string>('');
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [queryParams, setQueryParams] = useState<DemandRecordsParamsVO>(queryParamsDefault);
    const [tabsType, settabsType] = useState<string>(typeDefault);
    const [dataSource, setDataSource] = useState<any>([]);
    const [statusCount, setStatusCount] = useState<StatusCountVO>();
    const [tableExpandedRowKeys, setTableExpandedRowKeys] = useState<string[]>([]);
    useImperativeHandle(ref, () => ({
        onSearch, demandExport
    }))
    const columns: any = [
        {
            title: '需求名称',
            dataIndex: 'requirementName',
            width: 200,
            render: (_: any, record: any) => <div className="gc-demand-name">
                {record.requirementType == "COST_REDUCTION" ? <Tooltip title={'降本需求'}><span className="gc-cost-reduction-tag">{'降'}</span></Tooltip> : ""}{record.requirementName}<br />
                <div className="gc-analysis-btn" onClick={
                    () => history.push({
                        //@ts-ignore 
                        pathname: '/qkgoods/demand/details',
                        state: { record: record, isRecovery: record.requirementStatus == "SHELVED" ? true : false, show: ["PENDING_TEST", "PASSED", "UNLISTED", "COMPLETED"].includes(record.requirementStatus) ? ['3'] : ['4'], detailsFlag: true, requirementPointId: record.requirementPointId, chancePointId: record.chancePointId, }
                    })}>{record.requirementCode}</div>
                {<div className="gc-development-progress" onClick={() => {
                    developmentProgress(record.requirementPointId)
                }}>
                    {tableExpandedRowKeys.includes(record.requirementPointId) ? <CaretUpOutlined /> : <CaretDownOutlined />}查看开发进度
                </div>}
            </div>,
        },
        {
            title: '需求开发要求',
            dataIndex: 'developmentRequirement',
            width: 300,
            render: (_: any, record: any) => <Tooltip title={record.developmentRequirement}>
                <div className="gb-line-clamp4">
                    {record.developmentRequirement}
                </div>
            </Tooltip>
        },
        {
            title: '状态',
            dataIndex: 'requirementStatusName',
            render: (_: any, record: DemandRecordsVO) => <div>
                <Tag color={statusMap[record.requirementStatus]}>{record.requirementStatusName}</Tag>
            </div>,
        },
        {
            title: '商品经理',
            dataIndex: 'commodityManagerName',
            render: (_: any, record: any) => <div className="gc-demand-name">
                {record.commodityManagerName}
                {AuthVisible("DEMAND1_8") && <Tooltip title="重新指派商品经理">
                    <IconFont className="gc-iconfont" type="icon-genjinren" onClick={
                        () => {
                            // @ts-ignore
                            approvedRef.current.handleApproved();
                            setCurrId(record.requirementPointId)
                        }}></IconFont></Tooltip>}
            </div>,
        },
        {
            title: '需求创建人/创建时间',
            dataIndex: 'createTime',
            className: 'gc-createTime',
            sorter: (a: any, b: any) => a.createTime - b.createTime,
            render: (_: any, record: DemandRecordsVO) => <div>
                <div>{record.createName}</div>{record.createTime}
            </div>,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            render: (_: any, record: DemandRecordsVO) => <div className="gc-table-btn">
                {AuthVisible("DEMAND1_9") && record.requirementStatus == "UNLISTED" && <>
                    <Tooltip title="录入上市结果">
                        <IconFont className="gc-iconfont" type="icon-lurushangshijieguo" onClick={
                            () =>
                                history.push({
                                    //@ts-ignore 
                                    pathname: '/qkgoods/demand/entryListingEdit',
                                    state: { record: record }
                                })
                        }></IconFont>
                    </Tooltip>

                </>
                }
                {AuthVisible("DEMAND1_4") && < Tooltip title="查看详情" >
                    <IconFont className="gc-iconfont" type="icon-caozuo_chakanxiangqing" onClick={
                        () => history.push({
                            //@ts-ignore 
                            pathname: '/qkgoods/demand/details',
                            state: { record: record, isRecovery: record.requirementStatus == "SHELVED" ? true : false, show: ["PENDING_TEST", "PASSED", "UNLISTED", "COMPLETED", "CLOSE"].includes(record.requirementStatus) ? ['3'] : ['4'], detailsFlag: true, requirementPointId: record.requirementPointId, chancePointId: record.chancePointId, }
                        })}>
                    </IconFont></Tooltip >}
            </div>,
        },
    ];
    //展开收起开发进度
    const developmentProgress = (id: string) => {
        if (tableExpandedRowKeys.includes(id)) {
            setTableExpandedRowKeys(tableExpandedRowKeys.filter(item => item != id))
        } else {
            setTableExpandedRowKeys([...tableExpandedRowKeys, id])
        }

    }
    //获取数据
    const getDataSource = () => {
        setPageCache("queryParams", JSON.stringify(queryParams))
        setTableLoading(true)
        requirementPointGetPage({ ...queryParams, requirementStatuss: [tabsType] }).then((res) => {
            setTableLoading(false)
            setDataSource(res.data);
        })
        requirementPointGetCount({ ...queryParams, requirementStatuss: ['UNLISTED', 'COMPLETED', 'CLOSE'], current: 1, size: 10 }).then((res) => {
            let resStatusCount: StatusCountVO = {}
            res.data.forEach(item => {
                resStatusCount[item.key] = item.count
            })
            setStatusCount(resStatusCount)
        })

    }
    //搜索
    const onSearch = async (params: any) => {
        console.log(params, 'params')
        let createTimeStart = params.createTime && moment(params.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
        let createTimeEnd = params.createTime && moment(params.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        let devCompleteTimeStart = params.devCompleteTime && moment(params.devCompleteTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
        let devCompleteTimeEnd = params.devCompleteTime && moment(params.devCompleteTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        setQueryParams({ ...queryParams, ...params, current: 1, createTimeStart, createTimeEnd, devCompleteTimeStart, devCompleteTimeEnd });

    }
    //table分页排序
    const onPageChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: any) => {
        console.log(sorter)
        setQueryParams({
            ...queryParams,
            current: Number(pagination.current),
            size: Number(pagination.pageSize),
            sort: sortType[sorter.field as string],
            order: sortType[sorter.order as string]
        })
    }
    //状态查询
    const opportunityTypeChange = (value: string) => {
        settabsType(value)
        setQueryParams({ ...queryParams, requirementStatuss: value, current: 1 })
    }


    useEffect(getDataSource, [queryParams]);

    //导出
    const demandExport = async () => {
        let res = await requirementPointExport({ ...queryParams, requirementStatuss: [tabsType] })
        console.log(res)
        download(res, '需求列表导出文件')
    }
    const operations = <div className="gc-create-export">
        {AuthVisible("DEMAND1_1") && <span className="gc-create-btn" onClick={() => history.push('/qkgoods/demand/costReductionEdit')}>
            <IconFont className="gc-iconfont" type="icon-chuangjianjihuidian" /> 创建降本需求</span>}
        {AuthVisible("DEMAND1_2") && <span className="gc-export-btn" onClick={demandExport}><IconFont className="gc-iconfont" type="icon-daochu" /> 导出</span>}
    </div>;
    const stepDescription = (record:any) => {
        return <div>{record.verifyName}<p>{record.verifyTime}</p></div>
    }
    return <>
        <Tabs activeKey={tabsType} onChange={opportunityTypeChange} tabBarExtraContent={operations}>
            <TabPane tab={`未上市(${statusCount && statusCount['UNLISTED'] || 0})`} key="UNLISTED">
            </TabPane>
            <TabPane tab={`已完成(${statusCount && statusCount['COMPLETED'] || 0})`} key="COMPLETED">
            </TabPane>
            <TabPane tab={`已终止(${statusCount && statusCount['CLOSE'] || 0})`} key="CLOSE">
            </TabPane>
        </Tabs>
        <Table
            rowKey={"requirementPointId"}
            loading={tableLoading}
            columns={columns}
            dataSource={dataSource?.records}
            onChange={onPageChange}
            expandable={{
                showExpandColumn: false,
                expandedRowKeys: tableExpandedRowKeys,
                expandedRowRender: record => <div className="gc-development-progress-content">
                    <p>需求开发里程碑</p>
                    <Steps current={3}>
                        <Steps.Step title="提交开发需求" description={record.devSubmitTime} />
                        {record.requirementStatus == "CLOSE" ? <Steps.Step title="已终止" description={stepDescription(record)} />
                            : <>
                                <Steps.Step title="开发中" description={record.assignTime} />
                                <Steps.Step title="完成合同" description={record.contractCompleteTime} />
                                <Steps.Step title="开发完成" description={record.devCompleteTime} />
                            </>
                        }
                    </Steps>
                </div>,
                // rowExpandable: record => record.departmentCode !== '014',
            }}
            pagination={{
                total: dataSource?.total,
                current: Number(dataSource?.current) || 1,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total: number) => `共 ${total} 条`,
                pageSize: dataSource?.size
            }}
        />
        <CommodityManagerPop ref={approvedRef} isReassign={true} id={currId} confirmOkCallBack={getDataSource} />
    </>


})

export default NotReviewed