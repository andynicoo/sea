import SearchForm, { Field } from "@/components/SearchForm";
import { Table, Card, Tabs, Button, Modal, Upload, UploadProps, Tag, Select, Tooltip, message, UploadFile, Input } from "antd";
import type { TablePaginationConfig } from "antd/lib/table";
import React, { Key, useEffect, useState } from "react";
import { TagOutlined, ExclamationCircleOutlined, InboxOutlined, DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useHistory } from "react-router";
import moment from 'moment';
import { download, setPageCache } from "@/utils/commonUtils";
import CostReductionResultEntryDetails from "@/components/details/CostReductionResultEntryDetails";
import { assignFollower, auditContract, supplierRequirementClose, supplierRequirementExport, supplierRequirementListStatistics, supplierRequiremLentList, uploadContractFile, uploadContractFileComplete, uploadContractFileDelete } from "@/api/supply";
import { QueryParams, UsersInfoVO } from "@/vo/baseVo";
import { businessTypeMap, requirementTypeMap, supplyDataTypeMap } from "@/utils/dataDictionary";
import { getCountryList } from "@/api/public";
import { StatusCountVO } from "@/vo/opportunityVo";
import { cloneDeep } from "lodash";
import { FilterValue } from "antd/lib/table/interface";
import { IconFont } from "../opportunity";
import { useSelector } from "react-redux";
import { UploadChangeParam } from "antd/lib/upload";
import { AuthVisible } from "@/utils/url";
import { requirementPointClose } from "@/api/demand";

const { TabPane } = Tabs;


const SupplyList: React.FC = () => {
    const searchRef = React.useRef()
    const history = useHistory();
    const users = useSelector((state: any) => state.global.usersAll)
    const locationState: any = history.location.state
    const [countryList, setCountryList] = useState<{
        value: string,
        label: string
    }[]>()
    let typeDefault = 'PENDING_DEVELOP'
    let queryParamsDefault = { current: 1, size: 10, supplierRequirementStatus: typeDefault }
    let initialValues: any = {}
    if (locationState?.caChe && sessionStorage.queryParams) {
        let queryParamsCaChe = JSON.parse(sessionStorage.queryParams)
        queryParamsDefault = queryParamsCaChe
        typeDefault = queryParamsCaChe.supplierRequirementStatus
        initialValues = JSON.parse(sessionStorage.queryParams)
        if (initialValues.targetCompletionTime) {
            initialValues.targetCompletionTime = [moment(initialValues.targetCompletionTime[0]), moment(initialValues.targetCompletionTime[1])]
        }
        if (initialValues.submitTime) {
            initialValues.submitTime = [moment(initialValues.submitTime[0]), moment(initialValues.submitTime[1])]
        }
        if (initialValues.testCompleteTime) {
            initialValues.testCompleteTime = [moment(initialValues.testCompleteTime[0]), moment(initialValues.testCompleteTime[1])]
        }
        if (initialValues.contractCompleteTime) {
            initialValues.contractCompleteTime = [moment(initialValues.contractCompleteTime[0]), moment(initialValues.contractCompleteTime[1])]
        }
    }
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [queryParams, setQueryParams] = useState<QueryParams>(queryParamsDefault);
    const [oppoType, setOppoType] = useState<string>(typeDefault);
    const [dataSource, setDataSource] = useState<any>([]);
    const [statusCount, setStatusCount] = useState<StatusCountVO>();
    const [followVisible, setFollowVisible] = useState<boolean>(false);
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
    const [detailsRow, setDetailsRow] = useState<any>();
    const [followValue, setFollowValue] = useState<any[]>([]);
    const [currId, setCurrId] = useState<string>();
    const [contractsList, setContractsList] = useState<any>();
    const [reasonsRejection, setReasonsRejection] = useState<string>('')
    const [auditVisible, setAuditVisible] = useState<boolean>(false)
    const [uploadContractVisible, setUploadContractVisible] = useState<boolean>(false)
    //table操作按钮
    const viewDetails = (data: any) => {
        setDetailsRow(data)
        setDetailsVisible(true)
    }
    //导出
    const pointExport = async () => {
        let res = await supplierRequirementExport(queryParams)
        console.log(res)
        download(res, '供应链列表导出文件')
    }
    const searchFields: Field[] = [
        {

            label: "关键字",
            name: "keyWords",
            type: "Input",
            placeholder: "请输入关键字"
        },
        {

            label: "跟进人",
            name: "follower",
            type: "UserSelect",
            placeholder: "请选择",

        },
        {

            label: "商品经理",
            name: "commodityManager",
            type: "UserSelect",
            placeholder: "请选择",
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
        {

            label: "国家",
            name: "countryCode",
            type: "Select",
            placeholder: "请选择",
            options: countryList || [],
            props: {
                showSearch: true
            }
        },
        {
            label: "目标完成时间",
            name: "targetCompletionTime",
            type: "RangePicker"
        },
        {
            label: "需求提出时间",
            name: "submitTime",
            type: "RangePicker"
        },
        {
            label: "测单完成时间",
            name: "testCompleteTime",
            type: "RangePicker"
        },
        {
            label: "合同完成时间",
            name: "contractCompleteTime",
            type: "RangePicker"
        }
    ]
    const contractCompletionTimeTable: any = !["PENDING_DEVELOP", "DEVELOPING"].includes(oppoType) ? [{
        title: '合同完成时间',
        dataIndex: 'contractCompleteTime',
        className: 'gc-targetCompletionTime',
        sorter: (a: any, b: any) => a.contractCompleteTime - b.contractCompleteTime,
    },] : []
    const testCompleteTimeTable: any = ["TEST_ORDER_COMPLETED"].includes(oppoType) ? [{
        title: '测单完成时间',
        dataIndex: 'testCompleteTime',
        className: 'gc-targetCompletionTime',
        sorter: (a: any, b: any) => a.testCompleteTime - b.testCompleteTime,
    },] : []
    const costReductionRatioTable: any = ["TEST_ORDER_COMPLETED"].includes(oppoType) ? [{
        title: '达成降本比例',
        dataIndex: 'costReductionRatio',
        render: (_: any, record: any) => <div>
            {record.costReductionRatio ? record.costReductionRatio + '%' : '--'}
        </div>
    },] : []
    const columns: any = [
        {
            title: '需求名称',
            dataIndex: 'requirementName',
            render: (_: any, record: any) => <div>
                {record.requirementType == "COST_REDUCTION" ? <Tooltip title={'降本需求'}><span className="gc-cost-reduction-tag">{'降'}</span></Tooltip> : ""}{record.requirementName}<br />
                <div className="gc-analysis-btn" onClick={
                    () => history.push({
                        pathname: '/qkgoods/supply/details', state: {
                            requirementCode: record.requirementCode,
                            record: record
                        }
                    })}>{record.requirementCode}</div>

            </div>
        },
        {
            title: '需求开发要求',
            dataIndex: 'developmentRequirement',
            render: (_: any, record: any) => <Tooltip title={record.developmentRequirement}>
                <div className="gb-line-clamp4">
                    {record.developmentRequirement}
                </div>
            </Tooltip>
        },
        {
            title: '目标完成时间',
            dataIndex: 'targetCompletionTime',
            className: 'gc-targetCompletionTime',
            sorter: (a: any, b: any) => a.targetCompletionTime - b.targetCompletionTime,
        },
        {
            title: '需求提出时间',
            dataIndex: 'submitTime',
            className: 'gc-targetCompletionTime',
            sorter: (a: any, b: any) => a.submitTime - b.submitTime,
        },
        ...contractCompletionTimeTable,
        ...testCompleteTimeTable,
        {
            title: '预测单量(单月)',
            className: 'gc-peerSellingPrice',
            dataIndex: 'forecastUnitQuantity',
            sorter: (a: any, b: any) => a.forecastUnitQuantity - b.forecastUnitQuantity,
        },
        {
            title: '同行售价(平均值)',
            className: 'gc-peerSellingPrice',
            dataIndex: 'peerSellingPrice',
            sorter: (a: any, b: any) => a.peerSellingPrice - b.peerSellingPrice,
            render: (_: any, record: any) => <div>
                {record.peerSellingPrice} ({record.currency})
            </div>,
        },
        ...costReductionRatioTable,
        {
            title: '状态',
            dataIndex: 'supplierRequirementStatus',
            render: (_: any, record: any) => <div>
                <Tag color={
                    //@ts-ignore
                    supplyDataTypeMap[record.supplierRequirementStatus].value}>
                    {
                        //@ts-ignore
                        supplyDataTypeMap[record.supplierRequirementStatus].label
                    }
                </Tag>
            </div>,
        },
        {
            title: '商品经理',
            dataIndex: 'commodityManagerName',
        }, {
            title: '跟进人',
            dataIndex: 'followerName',
            render: (_: any, record: any) => <div className="gc-table-btn">
                {['PENDING_DEVELOP', 'CLOSE'].includes(record.supplierRequirementStatus) ? '--' :
                    <><Tooltip title={JSON.parse(record.followerName).join(',')}>{record.followerName && JSON.parse(record.followerName).splice(0, 2).map((item: string, key: Key) => <div key={key}>{item}</div>)}</Tooltip>
                        {AuthVisible("SUPPLY1_1") && record.supplierRequirementStatus == "DEVELOPING" && < Tooltip title="新增跟进人">
                            <IconFont className="gc-iconfont" type="icon-genjinren" onClick={
                                () => handleFollow(record.supplierRequirementId, record.follower)}>
                            </IconFont>
                        </Tooltip>}
                    </>
                }
            </div >,
        }, {
            title: '备注',
            dataIndex: 'rejectReason',
            render: (_: any, record: any) => record.rejectReason ? <div>
                驳回：{record.rejectReason}
            </div> : '--'
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200,
            render: (_: any, record: any) => <div className="gc-table-btn">
                {/* <UploadContract /> */}
                {record.supplierRequirementStatus == "PENDING_DEVELOP" &&
                    <>
                        {AuthVisible("SUPPLY1_1") && <Tooltip title="指派跟进人">
                            <IconFont className="gc-iconfont" type="icon-genjinren" onClick={
                                () => handleFollow(record.supplierRequirementId, record.follower)}>
                            </IconFont>
                        </Tooltip>}
                        {AuthVisible("SUPPLY1_8") && <Tooltip title="终止开发">
                            <IconFont className="gc-iconfont" type="icon-caozuo_gezhi" onClick={() => demandClose(record.supplierRequirementId)}></IconFont>
                        </Tooltip>}
                    </>
                }


                {record.supplierRequirementStatus == "DEVELOPING" && <>
                    {AuthVisible("SUPPLY1_3") && <Tooltip title="上传合同">
                        <IconFont className="gc-iconfont" type="icon-shangchuan" onClick={
                            () => contractUploadPop(record.supplierRequirementId, record.contractUrl)}></IconFont>
                    </Tooltip>}
                    {AuthVisible("SUPPLY1_8") && <Tooltip title="终止开发">
                        <IconFont className="gc-iconfont" type="icon-caozuo_gezhi" onClick={() => demandClose(record.supplierRequirementId)}></IconFont>
                    </Tooltip>}
                </>
                }
                {record.supplierRequirementStatus == "COMPLETE_CONTRACT" && <>
                    {AuthVisible("SUPPLY1_4") && <><Tooltip title="审核通过">
                        <IconFont className="gc-iconfont" type="icon-shenhetongguo" onClick={() => handleApprovedPassed(record.supplierRequirementId)}></IconFont>
                    </Tooltip>
                        <Tooltip title="驳回">
                            <IconFont className="gc-iconfont" type="icon-caozuo_jujue" onClick={() => handleApprovedRefused(record.supplierRequirementId)}></IconFont>
                        </Tooltip></>}
                    {AuthVisible("SUPPLY1_6") && <Tooltip title="查看合同">
                        <IconFont className="gc-iconfont" type="icon-chakanhetong" onClick={() => viewContract(record.contractUrl)}></IconFont>
                    </Tooltip>}
                </>
                }
                {AuthVisible("SUPPLY1_2") && record.supplierRequirementStatus == "TEST_ORDER_COMPLETED" && <>
                    {record.requirementType == "DEVELOP" ?

                        <Tooltip title="查看测单信息">
                            <IconFont className="gc-iconfont" type="icon-chakanhetong" onClick={
                                () => viewDetails(record)}></IconFont>
                        </Tooltip>
                        : <Tooltip title="查看降本结果">
                            <IconFont className="gc-iconfont" type="icon-chakanhetong" onClick={
                                () => viewDetails(record)}></IconFont>
                        </Tooltip>}</>}
                {AuthVisible("SUPPLY1_2") && <Tooltip title="查看详情">
                    <IconFont className="gc-iconfont" type="icon-caozuo_chakanxiangqing" onClick={
                        () => history.push({
                            pathname: '/qkgoods/supply/details', state: {
                                requirementCode: record.requirementCode,
                                record: record
                            }
                        })}></IconFont>
                </Tooltip>}

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
        await supplierRequirementClose({ id: id })
        message.success('操作成功！')
        getDataSource()

    }
    //查看合同
    const viewContract = (url: string) => {
        let urlHandle = JSON.parse(url)
        urlHandle.forEach((ele: any) => {
            window.open(ele.fileUrl)

        });
    }
    //合同审核通过
    const handleApprovedPassed = (supplierRequirementId: string) => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '你确定审核通过该需求吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => confirmOk(supplierRequirementId)
        });
    }
    const confirmOk = async (supplierRequirementId: string) => {
        await auditContract({ id: supplierRequirementId, auditResult: 'PASSED' })
        message.success('操作成功！')
        getDataSource()

    }
    //审核拒绝
    const handleApprovedRefused = (supplierRequirementId: string) => {
        setCurrId(supplierRequirementId)
        setAuditVisible(true)
    }
    const reasonsRejectionOk = async () => {
        if (!reasonsRejection) return message.warning('请输入驳回理由！')
        await auditContract({ id: currId as string, auditResult: 'REFUSED', reason: reasonsRejection })
        message.success('操作成功！')
        getDataSource()
        setAuditVisible(false)
    }
    //上传合同
    const contractsChange: any = (info: UploadChangeParam<UploadFile<any>>) => {
        const { status } = info.file;
        if (status == 'done') {
            console.log(info.fileList)
            setTableLoading(true)
            const fileUrl = info.fileList[info.fileList.length - 1].response.data.fileUrl
            const origFileName = info.fileList[info.fileList.length - 1].response.data.origFileName
            uploadContractFile({ fileUrl, origFileName, id: currId as string }).then(res => {
                setTableLoading(false)
                message.success('上传成功！')
            })
        }


    }
    //上传合同弹窗
    const contractUploadPop = (id: string, contractUrl: string) => {
        if (contractUrl) {
            setContractsList(JSON.parse(contractUrl))
        }
        setCurrId(id)
        setUploadContractVisible(true)
    }
    //合同上传完成
    const contractUploadCompleted = (id: string) => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '你确定合同已经上传完成吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => contractConfirmOk(id)
        });
    }
    const uploadContractOk = () => {
        contractUploadCompleted(currId as string)
    }
    const contractConfirmOk = async (supplierRequirementId: string) => {
        let res = await uploadContractFileComplete({ id: supplierRequirementId })
        console.log(res)
        if (res.code != 0) {
            message.error(res.message)
        } else {
            setUploadContractVisible(false)
            message.success('操作成功！')
            getDataSource()
        }


    }
    //删除合同
    const contractFileDeleteFn = async (origFileName?: any, fileUrl?: string) => {
        console.log(origFileName)
        let fileUrlHandle = fileUrl
        let origFileNameHandle = origFileName
        if (origFileName?.response) {
            fileUrlHandle = origFileName.response.data.fileUrl
            origFileNameHandle = origFileName.response.data.origFileName
        }
        await uploadContractFileDelete({ fileUrl: fileUrlHandle, origFileName: origFileNameHandle, id: currId as string })
        console.log(contractsList, 'contractsList')
        const contractsListHandle = contractsList && contractsList.filter((item: any) => item.fileUrl != fileUrl)
        setContractsList(contractsListHandle)
        message.success('操作成功！')
        getDataSource()
    }
    //获取数据
    const getDataSource = () => {
        setPageCache("queryParams", JSON.stringify(queryParams))
        setTableLoading(true)
        supplierRequiremLentList(queryParams).then((res) => {
            setTableLoading(false)
            setDataSource(res.data);
        })
        supplierRequirementListStatistics(queryParams).then((res) => {
            let resStatusCount: StatusCountVO = cloneDeep(res.data)
            let ALL = 0
            for (let k in res.data) {
                ALL += Number(res.data[k])
            }
            resStatusCount.ALL = ALL
            console.log(resStatusCount)
            setStatusCount(resStatusCount)
        })

    }
    //搜索
    const onSearch = async (params: any) => {
        let contractCompleteTimeStart = params.contractCompleteTime && moment(params.contractCompleteTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
        let contractCompleteTimeEnd = params.contractCompleteTime && moment(params.contractCompleteTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        let submitTimeStart = params.submitTime && moment(params.submitTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
        let submitTimeEnd = params.submitTime && moment(params.submitTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        let targetCompletionTimeStart = params.targetCompletionTime && moment(params.targetCompletionTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
        let targetCompletionTimeEnd = params.targetCompletionTime && moment(params.targetCompletionTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        let testCompleteTimeStart = params.testCompleteTime && moment(params.testCompleteTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
        let testCompleteTimeEnd = params.testCompleteTime && moment(params.testCompleteTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        setQueryParams({
            ...queryParams,
            ...params,
            current: 1,
            contractCompleteTimeStart,
            contractCompleteTimeEnd,
            submitTimeStart,
            submitTimeEnd,
            targetCompletionTimeStart,
            targetCompletionTimeEnd,
            testCompleteTimeStart,
            testCompleteTimeEnd
        });
    }
    const sortType: any = {
        targetCompletionTime: 'targetCompletionTime',
        submitTime: 'submitTime',
        forecastUnitQuantity: 'forecastUnitQuantity',
        peerSellingPrice: 'peerSellingPrice',
        contractCompleteTime: 'contractCompleteTime',
        testCompleteTime: 'testCompleteTime',
        descend: 'desc',
        ascend: "asc"
    }
    //table分页排序
    const onPageChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: any) => {
        console.log(sorter)
        setQueryParams({
            ...queryParams,
            current: Number(pagination.current),
            size: Number(pagination.pageSize),
            orderField: sortType[sorter.field as string],
            order: sortType[sorter.order as string]
        })
    }
    //状态查询
    const opportunityTypeChange = (value: string) => {
        setOppoType(value)
        setQueryParams({ ...queryParams, supplierRequirementStatus: value, page: 1 })
    }

    //指派跟进人弹窗
    const handleFollow = (id: string, follower: string) => {
        setCurrId(id)
        let followerHandle: any = []
        if (follower) {
            followerHandle = JSON.parse(follower)
        }
        console.log(followerHandle)
        setFollowValue(followerHandle)
        setFollowVisible(true);
    }
    //确认跟进人
    const followOk = () => {
        console.log(followValue)
        const followers: string[] = followValue.map(item => item.value) as string[]
        const followerNames: string[] = followValue.map(item => item.label) as string[]
        assignFollower({ id: currId, followers, followerNames }).then(res => {
            message.success('操作成功')
            getDataSource()
        })
        setFollowVisible(false);
    };
    //选择跟进人
    const followChange = (value: any) => {
        setFollowValue(value)
    };

    useEffect(getDataSource, [queryParams]);
    useEffect(() => {
        getCountryList().then(res => {
            setCountryList(res.data.map((item: any) => { return { label: item.countryNameZh, value: item.countryCode } }))
        })
    }, [])
    const props: UploadProps = {
        name: 'file',
        action: `${process.env.REACT_APP_BASE_URL}/file/oss/feign/upload2`,
        data: {
            'prefix': 'productcenter/contract'
        },
        accept: "image/*,.pdf",
        // maxCount: 1,
        headers: {
            authorization: 'authorization-text',
        },

    };
    const operations = <div className="gc-create-export">
        {AuthVisible("SUPPLY1_5") && <span className="gc-export-btn" onClick={pointExport}><IconFont className="gc-iconfont" type="icon-daochu" /> 导出</span>}
    </div>;
    return <>
        <Card>
            <SearchForm ref={searchRef} initialValues={initialValues} fields={searchFields} onSearch={onSearch} labelWidth={'97px'} />
        </Card>
        <Card className="gc-mt-2">
            <Tabs activeKey={oppoType} onChange={opportunityTypeChange} tabBarExtraContent={operations}>
                <TabPane tab={`全部(${statusCount && statusCount['ALL'] || 0})`} key="">
                </TabPane>
                <TabPane tab={`待开发(${statusCount && statusCount['PENDING_DEVELOP'] || 0})`} key="PENDING_DEVELOP">
                </TabPane>
                <TabPane tab={`开发中(${statusCount && statusCount['DEVELOPING'] || 0})`} key="DEVELOPING">
                </TabPane>
                <TabPane tab={`完成合同 (${statusCount && statusCount['COMPLETE_CONTRACT'] || 0})`} key="COMPLETE_CONTRACT">
                </TabPane>
                <TabPane tab={`开发完成(${statusCount && statusCount['COMPLETE_DEVELOPMENT'] || 0})`} key="COMPLETE_DEVELOPMENT">
                </TabPane>
                <TabPane tab={`测单完成(${statusCount && statusCount['TEST_ORDER_COMPLETED'] || 0})`} key="TEST_ORDER_COMPLETED">
                </TabPane>
                <TabPane tab={`已终止(${statusCount && statusCount['CLOSE'] || 0})`} key="CLOSE">
                </TabPane>
            </Tabs>
            <Table
                rowKey={"supplierRequirementId"}
                loading={tableLoading}
                columns={columns}
                dataSource={dataSource?.records}
                onChange={onPageChange}
                pagination={{
                    total: dataSource?.total,
                    current: Number(dataSource?.current) || 1,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total: number) => `共 ${total} 条`,
                    pageSize: dataSource?.size
                }}
                scroll={{ x: 1900 }}
            />
        </Card>
        <Modal title="指派跟进人" visible={followVisible} onOk={followOk} onCancel={() => setFollowVisible(false)}>
            请选择：<Select
                value={followValue}
                onChange={followChange}
                mode="multiple"
                labelInValue
                showSearch
                optionFilterProp="label"
                placeholder="请选择"
                optionLabelProp="label"
                style={{ width: "400px" }}
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
        </Modal>
        <Modal destroyOnClose={true} title={detailsRow?.requirementType == "COST_REDUCTION" ? "降本结果" : "测单信息"} onCancel={() => setDetailsVisible(false)} visible={detailsVisible} footer={<div><Button onClick={() => setDetailsVisible(false)}>关闭</Button></div>}>
            <CostReductionResultEntryDetails detailsRow={detailsRow} />
        </Modal>
        <Modal title={"驳回"} onOk={reasonsRejectionOk} onCancel={() => setAuditVisible(false)} visible={auditVisible}>
            <Input.TextArea
                onChange={e => setReasonsRejection(e.target.value)}
                value={reasonsRejection}
                placeholder="请输入驳回理由！"
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
        </Modal>
        <Modal title={"上传合同"} okText="合同上传完成" onOk={uploadContractOk} onCancel={() => setUploadContractVisible(false)} visible={uploadContractVisible}>
            <Upload.Dragger {...props} onChange={(info) => contractsChange(info)} onRemove={(info) => contractFileDeleteFn(info)}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                <p className="ant-upload-hint">
                    支持：jpg、jpge、png、pdf
                </p>
            </Upload.Dragger>
            {contractsList && contractsList.map((item: any, key: Key) => {
                return <div key={key} className="gc-contract-list">
                    <span><PaperClipOutlined className="gc-contract-ic" />{item.origFileName}</span>
                    <DeleteOutlined onClick={() => contractFileDeleteFn(item.origFileName, item.fileUrl)} className="gc-contract-delete" />
                </div>
            })}
        </Modal>
    </>

}

export default SupplyList





