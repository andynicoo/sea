import SearchForm, { Field } from '@/components/SearchForm';

import { Card, DatePicker, message, Modal, Table, TablePaginationConfig, Tabs, Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import '@/styles/settlementCenter.scss';
import { chancePointExport } from '@/api/opportunity';
import { download, setPageCache } from '@/utils/commonUtils';
import { QueryParams, ResponseDataVO } from '@/vo/baseVo';
import { OriginalRecordsVO } from '@/vo/opportunityVo';
import { FilterValue } from 'antd/lib/table/interface';
import { IconFont } from '../opportunity';
import { useHistory } from 'react-router-dom';
import {
  scPaymentOrderApproved,
  scPaymentOrderConfirm,
  scPaymentOrderCancel,
  scPaymentOrderDetailList,
  scPaymentOrderConfirmBatch,
  scPaymentOrderExport,
} from '@/api/settlementCenter';
import { enterpriseList } from './PurchaseOrder';
import moment from 'moment';
import { timeFormatEnd, timeFormatStart } from './ServiceProviderInfo';
import { AuthVisible } from '@/utils/url';

const handleTxt: string[] = ['你确定审核通过该付款单吗？', '你确定取消该付款单吗？'];

const searchFields: Field[] = [
  //
  {
    label: '供应商',
    type: 'Input',
    name: 'serviceProvider',
    placeholder: '服务商名称、服务商编号',
  },
  {
    label: '时间查找',
    type: 'RangePicker',
    name: 'applyTimeB',
  },
];
//付款单管理
const ReceiptList: React.FC = () => {
  const history = useHistory();
  const locationState: any = history.location.state;
  let initialValues: QueryParams = {};
  let typeDefault = 'PENDING_REVIEW';
  let queryParamsDefault: QueryParams = { current: 1, size: 10, status: typeDefault };
  if (locationState?.caChe && sessionStorage.queryParams) {
    let queryParamsCaChe = JSON.parse(sessionStorage.queryParams);
    queryParamsDefault = queryParamsCaChe;
    initialValues = JSON.parse(sessionStorage.queryParams);
    typeDefault = queryParamsCaChe.status;
    if (initialValues.applyTimeB) {
      initialValues.applyTimeB = [moment(initialValues.applyTimeB[0]), moment(initialValues.applyTimeB[1])];
    }
  }
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<QueryParams>(queryParamsDefault);
  const [dataSource, setDataSource] = useState<ResponseDataVO<OriginalRecordsVO>>();
  const [tabsType, setTabsType] = useState<string>(typeDefault);
  const [currId, setCurrId] = useState<string>('');
  const [paidTime, setPaidTime] = useState<string>('');
  const [payTimeModalOpen, setPayTimeModalOpen] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const columnsPaid: any =
    tabsType == 'PAID'
      ? [
          {
            title: '确认付款时间',
            dataIndex: 'confirmPaymentTime',
          },
          {
            title: '实际付款时间',
            dataIndex: 'paidTime',
          },
        ]
      : [];
  const columns: any = [
    {
      title: '申请单编号',
      dataIndex: 'paymentNo',
    },
    {
      title: '付款申请单总金额',
      dataIndex: 'totalAmount',
      render: (_: any, record: any) => (
        <div className="gc-opportunity-img">
          {record.currencyShort}
          {record.totalAmount}
        </div>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
    },
    {
      title: '结算金额',
      dataIndex: 'settlementAmount',
      render: (_: any, record: any) => (
        <div className="gc-opportunity-img">
          {record.currencyShort}
          {record.settlementAmount}
        </div>
      ),
    },
    {
      title: '付款主体 ',
      dataIndex: 'payEnterpriseId',
      render: (_: any, record: any) => (
        <div>
          {enterpriseList &&
            enterpriseList.filter((item: QueryParams) => item.value == record.payEnterpriseId)[0]?.label}
        </div>
      ),
    },
    ...columnsPaid,
    {
      title: '操作',
      dataIndex: 'chancePointName',
      render: (_: any, record: any) => (
        <div className="gc-table-btn">
          {tabsType == 'PENDING_REVIEW' && (
            <>
              {AuthVisible('RL1_3') && (
                <Tooltip title="审核通过">
                  <IconFont
                    className="gc-iconfont"
                    type="icon-shenhetongguo"
                    onClick={() => {
                      handleStatus(0, record.id);
                    }}
                  ></IconFont>
                </Tooltip>
              )}
              {AuthVisible('RL1_4') && (
                <Tooltip title="编辑">
                  <IconFont
                    className="gc-iconfont"
                    type="icon-caozuo_bianji"
                    onClick={() =>
                      history.push({
                        pathname: `/qkgoods/settlementCenter/receiptListEdit/${record.id}`,
                      })
                    }
                  ></IconFont>
                </Tooltip>
              )}
              {AuthVisible('RL1_5') && (
                <Tooltip title="取消">
                  <IconFont
                    className="gc-iconfont"
                    type="icon-caozuo_jujue"
                    onClick={() => {
                      handleStatus(1, record.id);
                    }}
                  ></IconFont>
                </Tooltip>
              )}
            </>
          )}
          {tabsType == 'PENDING_PAID' && AuthVisible('RL1_7') && (
            <Tooltip title="确认已付款">
              <IconFont
                className="gc-iconfont"
                type="icon-shenhetongguo"
                onClick={() => {
                  modalOpen(record.id);
                }}
              ></IconFont>
            </Tooltip>
          )}
          {AuthVisible('RL1_6') && (
            <Tooltip title="查看明细 ">
              <IconFont
                className="gc-iconfont"
                type="icon-caozuo_chakanxiangqing"
                onClick={() =>
                  history.push({
                    pathname: `/qkgoods/settlementCenter/receiptListDetails/${record.id}`,
                  })
                }
              ></IconFont>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  //操作按钮
  const handleStatus = (type: number, id: string) => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: handleTxt[type],
      okText: '确认',
      cancelText: '取消',
      onOk: () => confirmOk(type, id),
    });
  };
  const confirmOk = async (type: number, id: string) => {
    if (type == 0) {
      //审核
      await scPaymentOrderApproved({ id });
    } else if (type == 1) {
      //取消
      await scPaymentOrderCancel({ id });
    }
    getDataSource();
    message.success('操作成功！');
  };

  //确认已付款
  const modalOpen = (id: string) => {
    setCurrId(id);
    setPaidTime('');
    setPayTimeModalOpen(true);
  };
  //确认付款
  const payTimeOk = async () => {
    if (!paidTime) return message.warning('请选择时间付款时间！');
    if (!currId) {
      await scPaymentOrderConfirmBatch({ ids: selectedRowKeys, paidTime });
    } else {
      await scPaymentOrderConfirm({ id: currId, paidTime });
    }
    setPayTimeModalOpen(false);
    getDataSource();
    message.success('操作成功！');
  };
  //选择付款时间
  const datePickerOk = (date: any, dateString: string) => {
    console.log('onOk: ', date, dateString);
    setPaidTime(dateString);
  };
  //搜索
  const onSearch = async (params: any) => {
    console.log(params, 'params');
    let startApplyTime = params.applyTimeB && timeFormatStart(params.applyTimeB[0]);
    let endApplyTime = params.applyTimeB && timeFormatEnd(params.applyTimeB[1]);
    setQueryParams({ ...queryParams, ...params, current: 1, startApplyTime, endApplyTime });
  };
  //切换结算类型
  const tabsTypeChange = (val: string) => {
    setTabsType(val);
    setQueryParams({ ...queryParams, status: val, current: 1 });
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  //table选中行
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };
  //table分页排序
  const onPageChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    console.log(sorter);
    setQueryParams({
      ...queryParams,
      current: Number(pagination.current),
      size: Number(pagination.pageSize),
    });
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };
  //获取数据
  const getDataSource = () => {
    setPageCache('queryParams', JSON.stringify(queryParams));
    setTableLoading(true);
    scPaymentOrderDetailList(queryParams).then((res) => {
      setTableLoading(false);
      setDataSource(res.data);
    });
  };
  useEffect(getDataSource, [queryParams]);
  //批量确认付款
  const batchConfirmationPayment = async () => {
    if (selectedRowKeys.length) {
      modalOpen('');
    } else {
      message.warning('请选择付款单！');
    }
  };
  //导出
  const pointExport = async () => {
    if (!selectedRowKeys.length) {
      message.warning('请选择申请单！');
    } else if (selectedRowKeys.length > 1) {
      message.warning('一次只能导出一条申请单！');
    } else {
      let res = await scPaymentOrderExport({ ...queryParams, ids: selectedRowKeys });
      console.log(res);
      download(res, '付款单导出文件');
    }
  };
  const operations = (
    <div className="gc-create-export">
      {AuthVisible('RL1_1') && (
        <span
          className="gc-create-btn"
          onClick={() => history.push({ pathname: `/qkgoods/settlementCenter/billingList` })}
        >
          创建付款单
        </span>
      )}
      {AuthVisible('RL1_7') && tabsType == 'PENDING_PAID' && (
        <span className="gc-create-btn" onClick={batchConfirmationPayment}>
          批量确认付款
        </span>
      )}
      {AuthVisible('RL1_2') && (
        <span className="gc-export-btn" onClick={pointExport}>
          导出
        </span>
      )}
    </div>
  );
  return (
    <>
      <Card>
        <SearchForm initialValues={initialValues} fields={searchFields} onSearch={onSearch} labelWidth={'97px'} />
      </Card>
      <Card className="gc-mt-2">
        <Tabs activeKey={tabsType} onChange={tabsTypeChange} tabBarExtraContent={operations}>
          <Tabs.TabPane tab={`待审核`} key="PENDING_REVIEW"></Tabs.TabPane>
          <Tabs.TabPane tab={`待付款`} key="PENDING_PAID"></Tabs.TabPane>
          <Tabs.TabPane tab={`已付款`} key="PAID"></Tabs.TabPane>
        </Tabs>
        <Table
          rowKey={'id'}
          loading={tableLoading}
          columns={columns}
          dataSource={dataSource?.records}
          onChange={onPageChange}
          rowSelection={rowSelection}
          pagination={{
            total: Number(dataSource?.total),
            current: Number(dataSource?.current) || 1,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共 ${total} 条`,
            pageSize: Number(dataSource?.size),
          }}
        />
      </Card>
      <Modal
        destroyOnClose
        title="请选择实际付款时间"
        visible={payTimeModalOpen}
        onOk={payTimeOk}
        onCancel={() => setPayTimeModalOpen(false)}
      >
        <DatePicker showTime onChange={datePickerOk} />
      </Modal>
    </>
  );
};

export default ReceiptList;
