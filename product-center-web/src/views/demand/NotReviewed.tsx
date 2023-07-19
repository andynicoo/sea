import { Table, Tabs, Modal, Select, Tag, Tooltip, message } from "antd";
import type { TablePaginationConfig } from "antd/lib/table";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useHistory } from "react-router";
import { download, setPageCache } from "@/utils/commonUtils";
import moment from 'moment';
import { commodityManagerVo, ResponseDataVO, UsersInfoVO } from "@/vo/baseVo";
import { assignCommodityManager, requirementPointApproved, requirementPointExport, requirementPointGetCount, requirementPointGetPage, requirementPointReject, requirementPointShelved } from "@/api/demand";
import { IconFont } from "../opportunity";
import { StatusCountVO } from "@/vo/opportunityVo";
import { sumBy } from "lodash";
import { DemandRecordsParamsVO, DemandRecordsVO } from "@/vo/demandVo";
import { FilterValue } from "antd/lib/table/interface";
import { useSelector } from "react-redux";
import { AuthVisible } from "@/utils/url";

const { TabPane } = Tabs;

const handleTxt: string[] = [
    '你确定审核通过该需求吗？',
    '你确定拒绝该需求吗？',
    '你确定搁置该需求吗？',
    '你确定恢复该需求吗？',
]
export const sortType: any = {
    createTime: 'create_time',
    demandScore: 'demand_score',
    descend: 'desc',
    ascend: "asc"
}
export let handleStatus: (type: number, chancePointId: string) => void;
export let confirmOkCallBack: () => void;
const NotReviewed: React.FC<any> = forwardRef((props, ref) => {
    const history = useHistory();
    const locationState: any = history.location.state
    let typeDefault = 'PENDING_INPUT'
    let queryParamsDefault = { current: 1, size: 10, requirementStatuss: typeDefault }
    //详情页返回保留查询信息
    if (locationState?.caChe && sessionStorage.queryParams) {
        let queryParamsCaChe = JSON.parse(sessionStorage.queryParams)
        queryParamsDefault = queryParamsCaChe
        typeDefault = queryParamsCaChe.requirementStatuss
    }
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [queryParams, setQueryParams] = useState<DemandRecordsParamsVO>(queryParamsDefault);
    const [tabsType, settabsType] = useState<string>(typeDefault);
    const [dataSource, setDataSource] = useState<ResponseDataVO<DemandRecordsVO>>();
    const [statusCount, setStatusCount] = useState<StatusCountVO>();
    const [currId, setCurrId] = useState<string>('');
    const approvedRef = React.useRef()
    useImperativeHandle(ref, () => ({
        onSearch, demandExport
    }))

    //table操作按钮
    handleStatus = (type: number, requirementPointId: string) => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: handleTxt[type],
            okText: '确认',
            cancelText: '取消',
            onOk: () => confirmOk(type, requirementPointId)
        });
    };
    const confirmOk = async (type: number, requirementPointId: string) => {
        if (type == 0) {
            await requirementPointApproved({ requirementPointId })
        } else if (type == 1) {
            await requirementPointReject({ requirementPointId })
        } else if (type == 2) {
            await requirementPointShelved({ requirementPointId })
        }
        message.success('操作成功！')
        confirmOkCallBack()

    }
    confirmOkCallBack = () => {
        if (history.location.pathname == "/qkgoods/demand/details") {
            history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })
        } else {
            getDataSource()
        }
    }


    const demandRating: any = tabsType == 'PENDING_REVIEW' ? [{
        title: '需求评分',
        dataIndex: 'demandScore',
        className: 'gc-demandScore',
        sorter: (a: any, b: any) => a.demandScore - b.demandScore,
        render: (_: any, record: DemandRecordsVO) => <div>
            {record.demandScore}
            <EditOutlined className="gc-demand-score-edit" onClick={
                () => history.push({
                    pathname: '/qkgoods/demand/edit', state: {
                        chancePointId: record.chancePointId,
                        requirementPointId: record.requirementPointId,
                        requirementName: record.requirementName,
                        requirementCode: record.requirementCode,
                        createName: record.createName,
                        createTime: record.createTime,
                        isEdit: true
                    }
                })} />
        </div>,
    }] : []

    const columns: any = [
        {
            title: '需求名称',
            dataIndex: 'requirementName',
            render: (_: any, record: DemandRecordsVO) => <div>
                <div>{record.requirementName}</div>
                {AuthVisible("DEMAND1_5") && ['PENDING_INPUT'].includes(record.requirementStatus) && <div className="gc-analysis-btn" onClick={
                    () => history.push({
                        pathname: '/qkgoods/demand/edit', state: {
                            chancePointId: record.chancePointId,
                            requirementPointId: record.requirementPointId,
                            requirementName: record.requirementName,
                            requirementCode: record.requirementCode,
                            createName: record.createName,
                            createTime: record.createTime,
                            isEdit: false
                        }
                    })}>{record.requirementCode}</div>}
                {AuthVisible("DEMAND1_4") && ['PENDING_REVIEW'].includes(record.requirementStatus) && <div className="gc-analysis-btn" onClick={
                    () => history.push({ pathname: '/qkgoods/demand/details', state: { record, showWeights: true, show: ['1', '2'], requirementPointId: record.requirementPointId, chancePointId: record.chancePointId } })}>
                    {record.requirementCode}</div>}

            </div>,
        },
        ...demandRating,
        {
            title: '状态',
            dataIndex: 'requirementStatusName',
            render: (_: any, record: DemandRecordsVO) => <div>
                <Tag color="red">{record.requirementStatusName}</Tag>
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
                {AuthVisible("DEMAND1_5") && ['PENDING_INPUT'].includes(record.requirementStatus) && <Tooltip title="录入需求">
                    <IconFont className="gc-iconfont" type="icon-caozuo_bianji" onClick={
                        () => history.push({
                            pathname: '/qkgoods/demand/edit', state: {
                                chancePointId: record.chancePointId,
                                requirementPointId: record.requirementPointId,
                                requirementName: record.requirementName,
                                requirementCode: record.requirementCode,
                                createName: record.createName,
                                createTime: record.createTime,
                                isEdit: false
                            }
                        })}></IconFont></Tooltip>}
                {record.requirementStatus == 'PENDING_REVIEW' && <>
                    {AuthVisible("DEMAND1_3") && <><Tooltip title="审核通过">
                        <IconFont className="gc-iconfont" type="icon-shenhetongguo" onClick={
                            () => {
                                // @ts-ignore
                                approvedRef.current.handleApproved();
                                setCurrId(record.requirementPointId)
                            }}></IconFont></Tooltip>
                        <Tooltip title="拒绝">
                            <IconFont className="gc-iconfont" type="icon-caozuo_jujue" onClick={
                                () => { handleStatus(1, record.requirementPointId) }}></IconFont></Tooltip>
                        <Tooltip title="搁置">
                            <IconFont className="gc-iconfont" type="icon-caozuo_gezhi" onClick={
                                () => { handleStatus(2, record.requirementPointId) }}></IconFont></Tooltip></>}
                    {AuthVisible("DEMAND1_4") && <Tooltip title="查看详情">
                        <IconFont className="gc-iconfont" type="icon-caozuo_chakanxiangqing" onClick={
                            () => history.push({ pathname: '/qkgoods/demand/details', state: { record, showWeights: true, show: ['1', '2'], requirementPointId: record.requirementPointId, chancePointId: record.chancePointId } })}>
                        </IconFont></Tooltip>}
                </>}

            </div>,
        },
    ];

    //获取数据
    const getDataSource = () => {
        setPageCache("queryParams", JSON.stringify(queryParams))
        setTableLoading(true)
        let requirementStatuss = queryParams.requirementStatuss.split(',')
        requirementPointGetPage({ ...queryParams, requirementStatuss }).then((res) => {
            setTableLoading(false)
            setDataSource(res.data);
        })
        requirementPointGetCount({ ...queryParams, requirementStatuss: ["PENDING_INPUT", "PENDING_REVIEW"], current: 1, size: 10 }).then((res) => {
            let notReviewedStatus = res.data.filter(item => ['PENDING_INPUT', 'PENDING_REVIEW'].includes(item.key))
            let resStatusCount: StatusCountVO = { 'PENDING_INPUT,PENDING_REVIEW': sumBy(notReviewedStatus, 'count') }
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
        let requirementStatuss = queryParams.requirementStatuss.split(',')
        let res = await requirementPointExport({ ...queryParams, requirementStatuss })
        console.log(res)
        download(res, '需求列表导出文件')
    }
    const operations = <div className="gc-create-export">
        {AuthVisible("DEMAND1_1") && <span className="gc-create-btn" onClick={() => history.push('/qkgoods/demand/costReductionEdit')}>
            <IconFont className="gc-iconfont" type="icon-chuangjianjihuidian" /> 创建降本需求</span>}
        {AuthVisible("DEMAND1_2") && <span className="gc-export-btn" onClick={demandExport}><IconFont className="gc-iconfont" type="icon-daochu" /> 导出</span>}
    </div>;
    return <>
        <Tabs destroyInactiveTabPane={true} activeKey={tabsType} onChange={opportunityTypeChange} tabBarExtraContent={operations}>
            <TabPane tab={`全部(${statusCount && statusCount['PENDING_INPUT,PENDING_REVIEW'] || 0})`} key="PENDING_INPUT,PENDING_REVIEW">
            </TabPane>
            <TabPane tab={`待录入(${statusCount && statusCount['PENDING_INPUT'] || 0})`} key="PENDING_INPUT">
            </TabPane>
            <TabPane tab={`待评审(${statusCount && statusCount['PENDING_REVIEW'] || 0})`} key="PENDING_REVIEW">
            </TabPane>
        </Tabs>
        <Table
            rowKey={"requirementPointId"}
            loading={tableLoading}
            columns={columns}
            dataSource={dataSource?.records}
            onChange={onPageChange}
            pagination={{
                total: Number(dataSource?.total),
                current: Number(dataSource?.current) || 1,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total: number) => `共 ${total} 条`,
                pageSize: Number(dataSource?.size)
            }}

        />
        <CommodityManagerPop ref={approvedRef} id={currId} confirmOkCallBack={confirmOkCallBack} />
    </>


})

export default NotReviewed

export const CommodityManagerPop: React.FC<any> = forwardRef((props, ref) => {
    let usersAllState = useSelector((state: any) => state.global.usersAll)

    const [commodityManager, setCommodityManager] = useState<commodityManagerVo>()
    const [approvedVisible, setApprovedVisible] = useState<boolean>(false);
    useImperativeHandle(ref, () => ({
        handleApproved
    }))
    //审核通过弹窗
    const handleApproved = () => {
        setApprovedVisible(true);
    }
    //选择商品经理
    const commodityManagerChange = (val: commodityManagerVo) => {
        setCommodityManager(val)
    }

    //确认审核通过
    const approvedOk = async () => {
        if (commodityManager) {
            let params = { commodityManager: commodityManager?.value, commodityManagerName: commodityManager?.label, requirementPointId: props.id }
            if (props?.isReassign) {
                await assignCommodityManager(params)
            } else {
                await requirementPointApproved(params)
            }
            setApprovedVisible(false);
            message.success('操作成功！')
            props.confirmOkCallBack()
        } else {
            message.warning('请选择商品经理！')
        }
    };
    return <Modal width={700} title={props?.isReassign ? "重新指派" : "审核"} visible={approvedVisible} onOk={approvedOk} onCancel={() => setApprovedVisible(false)}>
        请选择商品经理：
        <Select
            onChange={commodityManagerChange}
            value={commodityManager}
            style={{ width: '500px' }}
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
                {usersAllState.map((item: UsersInfoVO) => (
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
    </Modal>
})