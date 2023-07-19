import SearchForm, { Field } from '@/components/SearchForm';
import { Button, Card, message, Modal, Table, TablePaginationConfig, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import '@/styles/settlementCenter.scss';
import { QueryParams, ResponseDataVO } from '@/vo/baseVo';
import { OriginalRecordsVO } from '@/vo/opportunityVo';
import { FilterValue } from 'antd/lib/table/interface';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { scPaymentOrderAdd, scPurchaseOrderDetaiGlGetPage } from '@/api/settlementCenter';
import { enterpriseList } from './PurchaseOrder';
import { AuthVisible } from '@/utils/url';
import { timeFormatEnd, timeFormatStart } from './ServiceProviderInfo';
import { useSelector } from 'react-redux';
const columns: any = [
  {
    title: '序列号',
    dataIndex: 'id',
    render: (_: any, record: any) => (
      <div className="gc-opportunity-img">
        {/* <span className="gc-cost-reduction-tag"></span> */}
        {record.id}
      </div>
    ),
  },
  {
    title: '服务号',
    dataIndex: 'serviceNo',
  },
  {
    title: '工单号',
    dataIndex: 'workNo',
  },
  {
    title: '销售订单号',
    dataIndex: 'orderNo',
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
  },
  {
    title: '客户名称',
    dataIndex: 'customer',
  },
  {
    title: '应付金额',
    dataIndex: 'payableAmount',
    render: (_: any, record: any) => <div>{record.currencyShort + record.payableAmount}</div>,
  },
  {
    title: '收入',
    dataIndex: 'incomeAmount',
  },
  {
    title: '国家',
    dataIndex: 'countryCodeName',
  },
  {
    title: '业务编号',
    dataIndex: 'businessCode',
  },
  {
    title: '结算时间',
    dataIndex: 'settlementTime',
  },
  {
    title: '服务完成时间',
    dataIndex: 'serviceCompleteTime',
  },
  {
    title: '供应商系统简称',
    dataIndex: 'supplierName',
  },
  {
    title: '供应商编号',
    dataIndex: 'supplierCode',
  },
  {
    title: '汇率',
    dataIndex: 'exchangeRate',
  },
  {
    title: '付款主体',
    dataIndex: 'payEnterpriseId',
    render: (_: any, record: any) => (
      <div>
        {enterpriseList && enterpriseList.filter((item: QueryParams) => item.value == record.payEnterpriseId)[0]?.label}
      </div>
    ),
  },
  {
    title: '工单累计结算金额',
    dataIndex: 'accSettlementAmount',
    render: (_: any, record: any) => <div>{record.currencyShort + record.accSettlementAmount}</div>,
  },
  {
    title: '工单未结算金额',
    dataIndex: 'nonSettlementAmount',
    render: (_: any, record: any) => <div>{record.currencyShort + record.nonSettlementAmount}</div>,
  },
  {
    title: '税率',
    dataIndex: 'taxRate',
    render: (_: any, record: any) => <div>{record.taxRate + '%'}</div>,
  },
  {
    title: '毛利',
    dataIndex: 'grossProfit',
    render: (_: any, record: any) => <div>{record.currencyShort + record.grossProfit}</div>,
  },
  {
    title: '毛利率',
    dataIndex: 'grossProfitRate',
    render: (_: any, record: any) => <div>{(record.grossProfitRate * 100).toFixed(2) + '%'}</div>,
  },
  {
    title: '审批编号',
    dataIndex: 'approvalNo',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

//结算明细列表
interface BillingListProps {
  setBillingRows: (val: any) => void;
  isAddBilling: boolean;
}
export const BillingList: React.FC<BillingListProps> = (props) => {
  let queryParamsDefault = { current: 1, size: 10, status: 'PENDING_PAID' };
  const history = useHistory();
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [queryParams, setQueryParams] = useState<QueryParams>(queryParamsDefault);
  const [dataSource, setDataSource] = useState<ResponseDataVO<OriginalRecordsVO>>();
  const [tabsType, setTabsType] = useState<string>('PENDING_PAID');
  const [isPayOpen, setIsPayOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const countryList = useSelector((state: any) => state.global.countryAll);
  const [initialValues, setInitialValues] = useState<any>({
    code: { codeType: 'workNo' },
    time: { timeType: 'purchaseTime' },
  });
  const searchFields: Field[] = [
    {
      label: '关键字搜索',
      type: 'SelectInput',
      name: 'code',
      selectName: 'codeType',
      inputName: 'codeVal',
      options: [
        {
          value: 'workNo',
          label: '工单号',
        },
        {
          value: 'serviceNo',
          label: '服务号',
        },
        {
          value: 'orderNo',
          label: '销售订单号',
        },
        {
          value: 'supplierCode',
          label: '供应商简称',
        },
      ],
    },
    {
      label: '结算时间',
      type: 'RangePicker',
      name: 'settlementTime',
      props: {
        picker: 'month',
      },
    },
    {
      label: '公司主体',
      name: 'payEnterpriseId',
      type: 'Select',
      options: enterpriseList,
    },
    {
      label: '服务国家',
      name: 'countryCode',
      type: 'Select',
      placeholder: '请选择',
      options: countryList || [],
      props: {
        showSearch: true,
      },
    },
  ];
  //生成付款单弹窗
  const openPayModal = () => {
    if (selectedRowKeys.length) {
      let open = false;
      for (let i = 1; i < selectedRows.length; i++) {
        if (
          selectedRows[i].countryCode != selectedRows[0].countryCode ||
          selectedRows[i].payEnterpriseId != selectedRows[0].payEnterpriseId ||
          selectedRows[i].supplierId != selectedRows[0].supplierId
        ) {
          open = true;
        }
      }
      if (open) {
        message.warning('选择的结算明细需为同一个付款主体、国家、服务商！');
      } else {
        setIsPayOpen(true);
      }
    } else {
      message.warning('请选择工单！');
    }
  };
  //确认生成付款单
  const paymentApplicationOk = async () => {
    console.log(111, selectedRows);
    setLoading(true);
    let res = await scPaymentOrderAdd({ detailDTOList: selectedRows });
    setLoading(false);
    if (res.code == 0) {
      message.success('操作成功');
    } else {
      message.warning(res.message);
    }
    setIsPayOpen(false);
  };
  //搜索
  const onSearch = async (paramas: any) => {
    console.log(paramas, 'params');
    let paramasHandle: any = {
      payEnterpriseId: paramas.payEnterpriseId,
      countryCode: paramas.countryCode,
    };
    if (paramas.code?.codeVal) {
      paramasHandle[paramas.code.codeType] = paramas.code.codeVal;
    } else {
      setInitialValues({
        code: { codeType: 'workNo' },
      });
    }
    if (paramas.settlementTime) {
      paramasHandle.settlementStartTime = moment(paramas.settlementTime[0]).format('YYYY-MM');
      paramasHandle.settlementEndTime = moment(paramas.settlementTime[1]).format('YYYY-MM');
    }
    setQueryParams({ current: 1, size: 10, ...paramasHandle, status: tabsType });
  };
  //切换结算类型
  const tabsTypeChange = (val: string) => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
    setTabsType(val);
    setQueryParams({ ...queryParams, status: val });
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

    setSelectedRows([]);
    setSelectedRowKeys([]);
  };
  //table选中行
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    props.setBillingRows && props.setBillingRows(selectedRows);
    setSelectedRows(selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };
  //获取数据
  const getDataSource = () => {
    setTableLoading(true);
    scPurchaseOrderDetaiGlGetPage(queryParams).then((res) => {
      setTableLoading(false);
      setDataSource(res.data);
    });
  };
  useEffect(getDataSource, [queryParams]);
  const operations = (
    <div className="gc-create-export">
      {AuthVisible('BL1_1') && tabsType == 'PENDING_PAID' && (
        <span className="gc-create-btn" onClick={openPayModal}>
          创建付款单
        </span>
      )}
      {AuthVisible('BL1_2') && (
        <span className="gc-export-btn" onClick={() => history.push('/qkgoods/settlementCenter/serviceProvider')}>
          供应商结算配置
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
        {!props.isAddBilling && (
          <Tabs activeKey={tabsType} onChange={tabsTypeChange} tabBarExtraContent={operations}>
            <Tabs.TabPane tab={`待结算`} key="PENDING_PAID"></Tabs.TabPane>
            <Tabs.TabPane tab={`结算中`} key="IN_PAID"></Tabs.TabPane>
            <Tabs.TabPane tab={`已结算`} key="PAID"></Tabs.TabPane>
          </Tabs>
        )}
        <Table
          scroll={{ x: 2800 }}
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
      <CreatePaymentOrder
        loading={loading}
        isPayOpen={isPayOpen}
        selectedRows={selectedRows}
        paymentApplicationOk={paymentApplicationOk}
        setIsPayOpen={setIsPayOpen}
      />
    </>
  );
};

export default BillingList;

interface CreatePaymentOrderProps {
  loading: boolean;
  isPayOpen: boolean;
  selectedRows: any;
  paymentApplicationOk: () => void;
  setIsPayOpen: (val: boolean) => void;
}
const CreatePaymentOrder: React.FC<CreatePaymentOrderProps> = (props) => {
  let columns = [
    {
      title: '服务商/服务商编号',
      dataIndex: 'chancePointName',
      render: (_: any, record: any) => (
        <div className="gc-opportunity-img">
          {/* <span className="gc-cost-reduction-tag">历</span> */}
          {record.supplierName}/{record.supplierCode}
        </div>
      ),
    },
    {
      title: '工单号',
      dataIndex: 'workNo',
    },
    {
      title: '申请金额',
      dataIndex: 'payableAmount',
    },
    {
      title: '付款主体',
      dataIndex: 'payEnterpriseId',
      render: (_: any, record: any) => (
        <div>
          {enterpriseList &&
            enterpriseList.filter((item: QueryParams) => item.value == record.payEnterpriseId)[0]?.label}
        </div>
      ),
    },
  ];
  return (
    <Modal
      width={1000}
      title="付款申请确认"
      visible={props.isPayOpen}
      onOk={props.paymentApplicationOk}
      onCancel={() => props.setIsPayOpen(false)}
      footer={[
        <Button key="back" onClick={() => props.setIsPayOpen(false)}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={props.loading} onClick={props.paymentApplicationOk}>
          确定
        </Button>,
      ]}
    >
      <Table rowKey={'id'} columns={columns} dataSource={props.selectedRows} pagination={false} />
    </Modal>
  );
};
