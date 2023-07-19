import { chancePointApproved, chancePointExport, chancePointGetCount, chancePointGetPage, chancePointRecovery, chancePointReject, chancePointShelved, getEnterpriseList } from "@/api/opportunity";
import SearchForm, { Field } from "@/components/SearchForm";
import { Table, Card, Tabs, Button, Modal, message, Tooltip, Tag, Image } from "antd";
import type { TablePaginationConfig } from "antd/lib/table";
import React, { Key, useEffect, useState } from "react";
import { ExclamationCircleOutlined, createFromIconfontCN } from '@ant-design/icons';
import { useHistory } from "react-router";
import moment from 'moment';
import { useSelector } from "react-redux";
import { businessTypeMap } from "@/utils/dataDictionary";
import { QueryParams, ResponseDataVO, UsersInfoVO } from "@/vo/baseVo";
import { FilterValue } from "antd/lib/table/interface";
import { download, setPageCache } from "@/utils/commonUtils";
import { OriginalRecordsVO, StatusCountVO } from "@/vo/opportunityVo";
import { sumBy } from "lodash";
import { AuthVisible } from "@/utils/url";
const { TabPane } = Tabs;
export let IconFont: any
//@ts-ignore
if (window.__POWERED_BY_QIANKUN__) {
    IconFont = createFromIconfontCN({
        scriptUrl: process.env.REACT_APP_SITE_URL + '/public/iconfont/iconfont.js'
    });
} else {
    IconFont = createFromIconfontCN({
        scriptUrl: '/public/iconfont/iconfont.js',
    });
}




const handleTxt: string[] = [
    '你确定审核通过该机会点吗？',
    '你确定拒绝该机会点吗？',
    '你确定搁置该机会点吗？',
    '你确定恢复该机会点吗？',
]
const statusMap: { [key: string]: any } = {
    'PENDING_REVIEW': 'red',
    'PASSED_REVIEW': 'green',
    'REJECTED': 'red',
    'SHELVED': ''
}
export let handleStatus: (type: number, chancePointId: string) => void;

const OpportunityList: React.FC = () => {
    const searchRef = React.useRef()
    const history = useHistory();
    const locationState: any = history.location.state
    let typeDefault = 'PENDING_REVIEW'
    let queryParamsDefault = { current: 1, size: 10, chancePointStatus: typeDefault }
    let initialValues: any = {}
    let usersAllState = useSelector((state: any) => state.global.usersAll)
    const options = usersAllState?.map((item: UsersInfoVO) => { return { "label": item.nickName, "value": item.userId } });
    //详情页返回保留查询信息
    if (locationState?.caChe && sessionStorage.queryParams) {
        let queryParamsCaChe = JSON.parse(sessionStorage.queryParams)
        queryParamsDefault = queryParamsCaChe
        typeDefault = queryParamsCaChe.chancePointStatus
        initialValues = JSON.parse(sessionStorage.queryParams)
        if (initialValues.creatTime) {
            initialValues.creatTime = [moment(initialValues.creatTime[0]), moment(initialValues.creatTime[1])]
        }
    }
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [queryParams, setQueryParams] = useState<QueryParams>(queryParamsDefault);
    const [oppoType, setOppoType] = useState<string>(typeDefault);
    const [dataSource, setDataSource] = useState<ResponseDataVO<OriginalRecordsVO>>();
    const [statusCount, setStatusCount] = useState<StatusCountVO>();
    const [detailsVisible, setDetailsVisible] = useState<boolean>(false);
    const [detailsValue, setDetailsValue] = useState<any>({});

    const searchFields: Field[] = [
        {

            label: "关键字",
            name: "keyword",
            type: "Input",
            placeholder: "请输入关键字"
        },
        {

            label: "信息同步人",
            name: "createBy",
            type: "Select",
            placeholder: "请选择",
            options: options,
            props: {
                showSearch: true
            }
        },
        {
            label: "创建时间",
            name: "creatTime",
            type: "RangePicker"
        },
        {
            label: "业务类型",
            name: "businessType",
            type: "Select",
            placeholder: "请选择",
            options: businessTypeMap
        },
    ]
    handleStatus = (type: number, chancePointId: string) => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: handleTxt[type],
            okText: '确认',
            cancelText: '取消',
            onOk: () => confirmOk(type, chancePointId)
        });
    };
    const confirmOk = async (type: number, chancePointId: string) => {
        if (type == 1) {
            await chancePointReject({ chancePointId })
        } else if (type == 2) {
            await chancePointShelved({ chancePointId })
        } else if (type == 3) {
            await chancePointRecovery({ chancePointId })
        } else if (type == 0) {
            await chancePointApproved({ chancePointId })
        }
        message.success('操作成功！')
        confirmOkCallBack()

    }
    const confirmOkCallBack = () => {
        if (history.location.pathname == "/qkgoods/opportunity/details") {
            history.push({ pathname: '/qkgoods/opportunity/index', state: { caChe: true } })
        } else {
            getDataSource()
        }
    }
    const tabsType = () => {
        if (oppoType == 'PASSED_REVIEW' || oppoType == '') {
            return true
        }
        return false
    }
    const requirementCodeTable: any = tabsType() ? [{
        title: '对应需求编码',
        dataIndex: 'requirementCode',
        width: 200,
        render: (_: any, record: any) => <div className="gc-opportunity-img">
            {record.requirementCode ? <div className="gc-analysis-btn" onClick={() => history.push({ pathname: '/qkgoods/opportunity/details', state: { id: record.chancePointId, status: record.chancePointStatus } })}>{record.requirementCode}</div> : '--'}
        </div>,
    },] : []
    const columns: any = [
        {
            title: '机会点名称',
            dataIndex: 'chancePointName',
            width: 200,
            render: (_: any, record: any) => <div className="gc-opportunity-img">
                {record.chancePointName}
                <div className="gc-analysis-btn" onClick={() => history.push({ pathname: '/qkgoods/opportunity/details', state: { id: record.chancePointId, status: record.chancePointStatus } })}>{record.chancePointCode}</div>
            </div>,
        },
        {
            title: '原始信息',
            dataIndex: 'originalInformation',
            width: 200,
            render: (_: any, record: any) => <Tooltip title={record.originalInformation}>
                <div className="gb-line-clamp2">
                    {record.originalInformation}
                </div>
            </Tooltip>
        },

        {
            title: '原始信息出处',
            dataIndex: 'originalInformationSourceText',
            width: 200,
            render: (_: any, record: any) => <div className="gc-opportunity-img">
                {record.originalInformationSourceText ?
                    <Tooltip title={record.originalInformationSourceText}>
                        <div className="gb-line-clamp2">
                            {record.originalInformationSourceText}
                        </div>
                    </Tooltip>
                    : <Image.PreviewGroup>
                        {record.originalInformationSourceUrl.map((item: any, key: Key) => <Image key={key} width={60} src={item} />)}
                    </Image.PreviewGroup>
                }
            </div>,
        },
        {
            title: '描述',
            dataIndex: 'chancePointDescribe',
            width: 300,
            render: (_: any, record: any) => <Tooltip title={record.chancePointDescribe}>
                <div className="gb-line-clamp2">
                    {record.chancePointDescribe}
                </div>
            </Tooltip>

        },
        {
            title: '分析报告',
            dataIndex: 'chancePointAnalysis',
            width: "150px",
            render: (_: any, record: any) => <>
                <span className="gc-analysis-btn" onClick={() => analysisDetails(record)}><IconFont className="gc-iconfont" type="icon-a-chakanxiao1" />查看</span>
            </>,
        },
        ...requirementCodeTable,
        {
            title: '状态',
            dataIndex: 'chancePointStatusName',
            width: "150px",
            render: (_: any, record: any) => <>
                <Tag color={statusMap[record.chancePointStatus]}>{record.chancePointStatusName}</Tag>
            </>,
        },
        {
            title: '信息同步人/创建时间',
            dataIndex: 'createTime',
            className: 'gc-createTime',
            width: 300,
            sorter: (a: any, b: any) => a.createTime - b.createTime,
            render: (_: any, record: any) => <div>
                <div>{record.createName}</div>{record.createTime}
            </div>,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 200,
            render: (_: any, record: any) => <div className="gc-table-btn">
                {AuthVisible("OPPO1_1") && ['PENDING_REVIEW', 'SHELVED'].includes(record.chancePointStatus) && <Tooltip title="编辑"><IconFont className="gc-iconfont" type="icon-caozuo_bianji" onClick={() => history.push({ pathname: '/qkgoods/opportunity/edit', state: { id: record.chancePointId } })}></IconFont></Tooltip>}
                {AuthVisible("OPPO1_3") && <Tooltip title="查看详情"><IconFont className="gc-iconfont" type="icon-caozuo_chakanxiangqing" onClick={() => history.push({ pathname: '/qkgoods/opportunity/details', state: { id: record.chancePointId, status: record.chancePointStatus } })}></IconFont></Tooltip>}
                {AuthVisible("OPPO1_4") && <>{record.chancePointStatus == 'PENDING_REVIEW' && <Tooltip title="审核通过"><IconFont className="gc-iconfont" type="icon-shenhetongguo" onClick={() => { handleStatus(0, record.chancePointId) }}></IconFont></Tooltip>}
                    {record.chancePointStatus == 'PENDING_REVIEW' && <Tooltip title="拒绝"><IconFont className="gc-iconfont" type="icon-caozuo_jujue" onClick={() => { handleStatus(1, record.chancePointId) }}></IconFont></Tooltip>}
                    {record.chancePointStatus == 'PENDING_REVIEW' && <Tooltip title="搁置"><IconFont className="gc-iconfont" type="icon-caozuo_gezhi" onClick={() => { handleStatus(2, record.chancePointId) }}></IconFont></Tooltip>}
                    {record.chancePointStatus == 'SHELVED' && <Tooltip title="恢复状态"><IconFont className="gc-iconfont" type="icon-caozuo_huifu" onClick={() => { handleStatus(3, record.chancePointId) }}></IconFont></Tooltip>}</>}
            </div>,
        },
    ];

    //获取数据
    const getDataSource = () => {
        setPageCache("queryParams", JSON.stringify(queryParams))
        setTableLoading(true)
        chancePointGetPage(queryParams).then((res) => {
            setTableLoading(false)
            setDataSource(res.data);
        })
        chancePointGetCount({
            ...queryParams, current: 1, size: 10
        }).then((res) => {
            let resStatusCount: StatusCountVO = { 'ALL': sumBy(res.data, 'count') }
            res.data.forEach(item => {
                resStatusCount[item.key] = item.count
            })
            setStatusCount(resStatusCount)
        })
    }
    //搜索
    const onSearch = async (params: QueryParams) => {
        console.log(params)
        let startTime = params.creatTime && moment(params.creatTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
        let endTime = params.creatTime && moment(params.creatTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
        setQueryParams({ ...queryParams, ...params, current: 1, startTime, endTime });
    }
    const sortType: any = {
        createTime: 'create_time',
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
            sort: sortType[sorter.field as string],
            order: sortType[sorter.order as string]
        })
    }
    //状态查询
    const opportunityTypeChange = (value: string) => {
        setOppoType(value)
        setQueryParams({ ...queryParams, chancePointStatus: value, current: 1 })
    }
    //报告分析
    const analysisDetails = (value: string) => {
        setDetailsValue(value)
        setDetailsVisible(true)
    }
    //导出
    const pointExport = async () => {
        let res = await chancePointExport(queryParams)
        console.log(res)
        download(res, '机会点列表导出文件')
    }
    useEffect(getDataSource, [queryParams]);
    const operations = <div className="gc-create-export">
        {AuthVisible("OPPO1_1") && <span className="gc-create-btn" onClick={() => history.push('/qkgoods/opportunity/edit')}>
            <IconFont className="gc-iconfont" type="icon-chuangjianjihuidian" /> 创建机会点</span>}
        {AuthVisible("OPPO1_2") && <span className="gc-export-btn" onClick={pointExport}><IconFont className="gc-iconfont" type="icon-daochu" /> 导出</span>}
    </div>;
    return <>
        <Card bordered={false}>
            <SearchForm ref={searchRef} initialValues={initialValues} fields={searchFields} onSearch={onSearch} />
        </Card>
        <Card bordered={false} className="gc-mt-2">
            <Tabs activeKey={oppoType} onChange={opportunityTypeChange} tabBarExtraContent={operations}>
                <TabPane tab={`全部(${statusCount && statusCount['ALL'] || 0})`} key="">
                </TabPane>
                <TabPane tab={`待审核(${statusCount && statusCount['PENDING_REVIEW'] || 0})`} key="PENDING_REVIEW">
                </TabPane>
                <TabPane tab={`审核通过(${statusCount && statusCount['PASSED_REVIEW'] || 0})`} key="PASSED_REVIEW">
                </TabPane>
                <TabPane tab={`已拒绝(${statusCount && statusCount['REJECTED'] || 0})`} key="REJECTED">
                </TabPane>
                <TabPane tab={`搁置(${statusCount && statusCount['SHELVED'] || 0})`} key="SHELVED">
                </TabPane>
            </Tabs>
            <Table
                rowKey={"chancePointId"}
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
        </Card>
        <Modal title={"分析报告详情"} width="800px" onCancel={() => setDetailsVisible(false)} visible={detailsVisible} footer={<div><Button onClick={() => setDetailsVisible(false)}>关闭</Button></div>}>
            <ul className="gc-detail-warp gc-chancePoint-details">
                <li><span>机会点名称：</span>{detailsValue?.chancePointName}</li>
                {detailsValue?.requirementCode && <li><span>机会点编号：</span>{detailsValue?.requirementCode}</li>}
                <li><span>机会点类型：</span>{detailsValue?.businessTypeName}</li>
                <li><span>机会点描述：</span>{detailsValue?.chancePointDescribe}</li>
                <li><span>机会点分析：</span>{detailsValue?.chancePointAnalysis}</li>
            </ul>
        </Modal>
    </>

}

export default OpportunityList