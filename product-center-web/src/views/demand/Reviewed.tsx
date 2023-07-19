import { Table, Tabs, Modal, Steps, Tag, Tooltip, message } from "antd";
import type { TablePaginationConfig } from "antd/lib/table";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ExclamationCircleOutlined, CaretDownOutlined, CaretUpOutlined, TagOutlined } from '@ant-design/icons';
import { useHistory } from "react-router";
import { download, setPageCache } from "@/utils/commonUtils";
import { requirementPointClose, requirementPointExport, requirementPointGetCount, requirementPointGetPage, requirementPointRecovery } from "@/api/demand";
import { StatusCountVO } from "@/vo/opportunityVo";
import { DemandRecordsParamsVO, DemandRecordsVO } from "@/vo/demandVo";
import { CommodityManagerPop, sortType } from "./NotReviewed";
import { FilterValue } from "antd/lib/table/interface";
import { IconFont } from "../opportunity";
import { AuthVisible } from "@/utils/url";
import moment from 'moment';
const { TabPane } = Tabs;
const statusMap: { [key: string]: any } = {
    'PENDING_REVIEW': 'red',
    "PENDING_TEST": 'red',
    'PASSED': 'green',
    'REJECTED': 'red',
    'SHELVED': ''
}

export let handleRecoveryStatus: (id: string) => void;
const NotReviewed: React.FC<any> = forwardRef((props, ref) => {
    const history = useHistory();
    const locationState: any = history.location.state
    const approvedRef = React.useRef()
    let typeDefault = 'PASSED'
    let queryParamsDefault = { current: 1, size: 10, requirementStatuss: typeDefault }
    if (locationState?.caChe && sessionStorage.queryParams) {
        let queryParamsCaChe = JSON.parse(sessionStorage.queryParams)
        queryParamsDefault = queryParamsCaChe
        typeDefault = queryParamsCaChe.requirementStatuss
    }
    const [currId, setCurrId] = useState<string>('');
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [tableExpandedRowKeys, setTableExpandedRowKeys] = useState<string[]>([]);
    const [queryParams, setQueryParams] = useState<DemandRecordsParamsVO>(queryParamsDefault);
    const [tabsType, settabsType] = useState<string>(typeDefault);
    const [dataSource, setDataSource] = useState<any>([]);
    const [statusCount, setStatusCount] = useState<StatusCountVO>();
    useImperativeHandle(ref, () => ({
        onSearch, demandExport
    }))
    //table操作按钮
    handleRecoveryStatus = (id: string) => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '你确定恢复该需求吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => confirmOk(id)
        });
    };
    const confirmOk = async (requirementPointId: string) => {
        await requirementPointRecovery({ requirementPointId })
        message.success('操作成功！')
        confirmOkCallBack()

    }
    const confirmOkCallBack = () => {
        if (history.location.pathname == "/qkgoods/demand/details") {
            history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })
        } else {
            getDataSource()
        }
    }
    //展开收起开发进度
    const developmentProgress = (id: string) => {
        if (tableExpandedRowKeys.includes(id)) {
            setTableExpandedRowKeys(tableExpandedRowKeys.filter(item => item != id))
        } else {
            setTableExpandedRowKeys([...tableExpandedRowKeys, id])
        }

    }
    const editUrlMap = {
        COST_REDUCTION: "/qkgoods/demand/costReductionEdit",
        DEVELOP: "/qkgoods/demand/developmentEdit"
    }
    const detailsUrlMap = {
        COST_REDUCTION: "/qkgoods/demand/details",
        DEVELOP: "/qkgoods/demand/details"
        // DEVELOP: "/qkgoods/demand/details"
    }
    const commodityManagerName: any = tabsType == 'PENDING_TEST' ? [{
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
    }] : []

    const columns: any = [
        {
            title: '需求名称',
            dataIndex: 'requirementName',
            width: 150,
            render: (_: any, record: any) => <div className="gc-demand-name">
                {record.requirementType == "COST_REDUCTION" ? <Tooltip title={'降本需求'}><span className="gc-cost-reduction-tag">{'降'}</span></Tooltip> : ""}{record.requirementName}<br />
                <div className="gc-analysis-btn" onClick={
                    () => history.push({
                        //@ts-ignore 
                        pathname: detailsUrlMap[record.requirementType],
                        state: { record: record, isRecovery: record.requirementStatus == "SHELVED" ? true : false, show: ["PENDING_TEST", "PASSED"].includes(record.requirementStatus) ? ['3'] : ['4'], detailsFlag: true, requirementPointId: record.requirementPointId, chancePointId: record.chancePointId, }
                    })}>{record.requirementCode}</div>
                {['PASSED', 'PENDING_TEST'].includes(record.requirementStatus) && <div className="gc-development-progress" onClick={() => {
                    developmentProgress(record.requirementPointId)
                }}>
                    {tableExpandedRowKeys.includes(record.requirementPointId) ? <CaretUpOutlined /> : <CaretDownOutlined />}查看开发进度
                </div>}
            </div>,
        },
        {
            title: '需求开发要求',
            dataIndex: 'developmentRequirement',
            width: 200,
            render: (_: any, record: any) => <Tooltip title={record.developmentRequirement}>
                <div className="gb-line-clamp4">
                    {record.developmentRequirement}
                </div>
            </Tooltip>
        },
        {
            title: '需求评分',
            dataIndex: 'demandScore',
            className: 'gc-demandScore',
            sorter: (a: any, b: any) => a.demandScore - b.demandScore,
        },
        {
            title: '状态',
            dataIndex: 'requirementStatusName',
            render: (_: any, record: DemandRecordsVO) => <div>
                <Tag color={statusMap[record.requirementStatus]}>{record.requirementStatusName}</Tag>
            </div>,
        },
        ...commodityManagerName,
        {
            title: '需求创建人/创建时间',
            className: 'gc-createTime',
            dataIndex: 'createTime',
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
                {AuthVisible("DEMAND1_7") && record.requirementStatus == "PENDING_TEST" && <>
                    <Tooltip title="录入测单结果">
                        <IconFont className="gc-iconfont" type="icon-luruceshijieguo" onClick={
                            () =>
                                history.push({
                                    //@ts-ignore 
                                    pathname: '/qkgoods/demand/entryTestsheetEdit',
                                    state: { record: record, devCompleteTime: record.devCompleteTime, requirementCode: record.requirementCode }
                                })
                        }></IconFont>
                    </Tooltip>
                    {record.requirementType == "COST_REDUCTION" && <Tooltip title="录入开发结果">
                        <IconFont className="gc-iconfont" type="icon-lurukaifajieguo" onClick={
                            () =>
                                history.push({
                                    //@ts-ignore 
                                    pathname: '/qkgoods/demand/entryResultsEdit',
                                    state: { record: record }
                                })
                        }></IconFont>
                    </Tooltip>}
                </>
                }
                {
                    AuthVisible("DEMAND2_2") && record.requirementStatus == "PENDING_TEST" && <Tooltip title="终止开发">
                            <IconFont className="gc-iconfont" type="icon-caozuo_gezhi" onClick={() => demandClose(record.requirementPointId)}></IconFont>
                        </Tooltip>
                }
                {
                    AuthVisible("DEMAND1_6") && record.requirementStatus == "PASSED" && <>{
                        record.isShow == "PUSHED" ? <Tooltip title="已提交至供应链">
                            <IconFont style={{ opacity: '0.5' }} className="gc-iconfont" type="icon-caozuo_tijiaozhigongyinglian"></IconFont></Tooltip>
                            : <Tooltip title="提交至供应链">
                                <IconFont className="gc-iconfont" type="icon-caozuo_tijiaozhigongyinglian" onClick={() => history.push({
                                    //@ts-ignore 
                                    pathname: editUrlMap[record.requirementType],
                                    state: { record }
                                })}></IconFont></Tooltip>
                    }
                    </>
                }
                {
                    AuthVisible("DEMAND2_2") && record.requirementStatus == "PASSED" && <Tooltip title="终止开发">
                            <IconFont className="gc-iconfont" type="icon-caozuo_gezhi" onClick={() => demandClose(record.requirementPointId)}></IconFont>
                        </Tooltip>
                }
                {
                    record.requirementStatus == 'SHELVED' &&
                    <Tooltip title="恢复状态">
                        <IconFont className="gc-iconfont" type="icon-caozuo_huifu" onClick={
                            () => { handleRecoveryStatus(record.requirementPointId) }}></IconFont>
                    </Tooltip>
                }
                {AuthVisible("DEMAND1_4") && < Tooltip title="查看详情" >
                    <IconFont className="gc-iconfont" type="icon-caozuo_chakanxiangqing" onClick={
                        () => history.push({
                            //@ts-ignore 
                            pathname: detailsUrlMap[record.requirementType],
                            state: { record: record, isRecovery: record.requirementStatus == "SHELVED" ? true : false, show: ["PENDING_TEST", "PASSED"].includes(record.requirementStatus) ? ['3'] : ['4'], detailsFlag: true, requirementPointId: record.requirementPointId, chancePointId: record.chancePointId, }
                        })}>
                    </IconFont></Tooltip >}
            </div >,
        },
    ];
    //终止
    const demandClose = async (id: string) => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '你确定终止该需求吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => confirmCloseOk(id)
        });

    }
    const confirmCloseOk = async (id: string) => {
        await requirementPointClose({ requirementPointId: id })
        message.success('操作成功！')
        getDataSource()

    }
    //获取数据
    const getDataSource = () => {
        setPageCache("queryParams", JSON.stringify(queryParams))
        setTableLoading(true)
        requirementPointGetPage({ ...queryParams, requirementStatuss: [tabsType] }).then((res) => {
            setTableLoading(false)
            setDataSource(res.data);
        })
        requirementPointGetCount({ ...queryParams, requirementStatuss: ['PASSED', 'PENDING_TEST', 'REJECTED', 'SHELVED'], current: 1, size: 10 }).then((res) => {
            let resStatusCount: StatusCountVO = {}
            res.data.forEach(item => {
                resStatusCount[item.key] = item.count
            })
            setStatusCount(resStatusCount)
        })
    }

    //搜索
    const onSearch = async (params: any) => {
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


    //里程碑进度
    const stepsCurrent = (record: DemandRecordsVO) => {
        let step = 0
        if (record.assignTime) {
            step = 1
        }
        if (record.contractCompleteTime) {
            step = 2
        }
        if (record.devCompleteTime) {
            step = 3
        }
        return step
    }

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
    const stepDescription = (assignTime:string,followerName:string) => <div className="gc-create-export">
    {assignTime}
    <p style={{"width":"200px"}}>{followerName&&JSON.parse(followerName).join(",")}</p>
</div>;
    return <>
        <Tabs activeKey={tabsType} onChange={opportunityTypeChange} tabBarExtraContent={operations}>
            <TabPane tab={`已通过(${statusCount && statusCount['PASSED'] || 0})`} key="PASSED">
            </TabPane>
            <TabPane tab={`待测单(${statusCount && statusCount['PENDING_TEST'] || 0})`} key="PENDING_TEST">
            </TabPane>
            <TabPane tab={`已拒绝(${statusCount && statusCount['REJECTED'] || 0})`} key="REJECTED">
            </TabPane>
            <TabPane tab={`已搁置(${statusCount && statusCount['SHELVED'] || 0})`} key="SHELVED">
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
                    <Steps current={stepsCurrent(record) || 0}>
                        <Steps.Step title="提交开发需求" description={record.devSubmitTime} />
                        <Steps.Step title="开发中" description={stepDescription(record.assignTime,record.followerName)} />
                        <Steps.Step title="完成合同" description={record.contractCompleteTime} />
                        <Steps.Step title="开发完成" description={record.devCompleteTime} />
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
        <CommodityManagerPop ref={approvedRef} isReassign={true} id={currId} confirmOkCallBack={confirmOkCallBack} />
    </>


})

export default NotReviewed