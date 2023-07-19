import { getModuleConfigList, openOrClose } from '@/api/saasManage';
import SearchForm, { Field } from '@/components/SearchForm';
import { AuthVisible } from '@/utils/url';
import {
  Button,
  Card,
  DatePicker,
  message,
  Modal,
  Space,
  Switch,
  Table,
  TablePaginationConfig,
  Tabs,
  Upload,
  UploadProps,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import '@/styles/settlementCenter.scss';
import { chancePointExport, chancePointGetPage } from '@/api/opportunity';
import { download, floatSub } from '@/utils/commonUtils';
import { EnterpriseVo, QueryParams, ResponseDataVO } from '@/vo/baseVo';
import { OriginalRecordsVO } from '@/vo/opportunityVo';
import { FilterValue } from 'antd/lib/table/interface';
import moment from 'moment';
import {
  downloadTemplate,
  generatePurchaseOrderHistory,
  purchaseOrderStatistics,
  scPurchaseOrderGetPage,
  scPurchaseOrderUpdate,
  updatePurchaseDate,
} from '@/api/settlementCenter';
import { StatisticsInfo } from '@/vo/settlementCenterVo';
export let enterpriseList = JSON.parse(localStorage.enterpriseList).map((item: EnterpriseVo) => {
  return { value: item.id, label: item.name };
});
const columns: any = [
  {
    title: '采购订单编号',
    dataIndex: 'purchaseNo',
    render: (_: any, record: any) => (
      <div className="gc-opportunity-img">
        {record.sourceId == 'HISTORY' && <span className="gc-cost-reduction-tag">历</span>}
        {record.purchaseNo}
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
    title: '供应商',
    dataIndex: 'supplierName',
  },
  {
    title: '库存物料编码',
    dataIndex: 'stockMaterialNo',
  },
  {
    title: '库存物料名称',
    dataIndex: 'stockMaterialName',
  },
  {
    title: '采购日期',
    dataIndex: 'purchaseTime',
  },
  {
    title: '单价',
    dataIndex: 'price',
    render: (_: any, record: any) => <div>{record.price ? record.currencyShort + record.price : <a>更新中...</a>}</div>,
  },
  {
    title: '含税单价',
    dataIndex: 'taxPrice',
    render: (_: any, record: any) => (
      <div>{record.taxPrice ? record.currencyShort + record.taxPrice : <a>更新中...</a>}</div>
    ),
  },
  {
    title: '税额',
    dataIndex: 'taxAmount',
  },
  {
    title: '已结算',
    dataIndex: 'settlementAmount',
  },
  {
    title: '本次结算',
    dataIndex: 'totalSettlementAmount',
    render: (_: any, record: any) => <div>{record.currencyShort + record.totalSettlementAmount}</div>,
  },
  {
    title: '待结算',
    dataIndex: 'taxPrice',
    render: (_: any, record: any) => (
      <div>
        {record.taxPrice ? (
          record.currencyShort + floatSub(record.totalSettlementAmount, record.settlementAmount)
        ) : (
          <a>更新中...</a>
        )}
      </div>
    ),
  },
  {
    title: '采购组织',
    dataIndex: 'purchaseEnterpriseId',
    render: (_: any, record: any) => (
      <div>
        {enterpriseList &&
          enterpriseList.filter((item: QueryParams) => item.value == record.purchaseEnterpriseId)[0]?.label}
      </div>
    ),
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
    title: '服务完成时间',
    dataIndex: 'serviceCompleteTime',
  },
  {
    title: '提交服务商时间',
    dataIndex: 'supplierSubmitTime',
  },
];

const searchFields: Field[] = [
  {
    label: '编码查找',
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
        value: 'stockMaterialNo',
        label: '库存物料编号',
      },
      {
        value: 'supplierName',
        label: '供应商简称',
      },
      {
        value: 'supplierCode',
        label: '供应商编号',
      },
    ],
  },
  {
    label: '时间查找',
    type: 'SelectRangePicker',
    name: 'time',
    selectName: 'timeType',
    dateName: 'timeVal',
    options: [
      {
        value: 'purchaseTime',
        label: '采购时间',
      },
      {
        value: 'supplierSubmitTime',
        label: '提交服务商时间',
      },
      {
        value: 'serviceCompleteTime',
        label: '服务完成时间',
      },
    ],
  },
  {
    label: '公司主体',
    name: 'payEnterpriseId',
    type: 'Select',
    options: enterpriseList,
  },
];
//采购单列表
const PurchaseOrder: React.FC = () => {
  let queryParamsDefault = { current: 1, size: 10 };
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<QueryParams>(queryParamsDefault);
  const [dataSource, setDataSource] = useState<ResponseDataVO<OriginalRecordsVO>>();
  const [isTimeOpen, setIsTimeOpen] = useState<boolean>(false);
  const [shoppingTime, setShoppingTime] = useState<string>('');
  const [initialValues, setInitialValues] = useState<any>({
    code: { codeType: 'workNo' },
    time: { timeType: 'purchaseTime' },
  });
  const [statisticsInfo, setStatisticsInfo] = useState<StatisticsInfo>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  //搜索
  const onSearch = async (paramas: any) => {
    console.log(paramas, 'paramas', initialValues);
    let paramasHandle: any = {
      payEnterpriseId: paramas.payEnterpriseId,
    };
    if (paramas.code?.codeVal) {
      paramasHandle[paramas.code.codeType] = paramas.code.codeVal;
    }

    if (paramas.time?.timeVal) {
      paramasHandle[paramas.time.timeType + 'Start'] =
        moment(paramas.time.timeVal[0]).format('YYYY-MM-DD') + ' 00:00:00';
      paramasHandle[paramas.time.timeType + 'End'] = moment(paramas.time.timeVal[1]).format('YYYY-MM-DD') + ' 23:59:59';
    }
    if (!paramas.code?.codeVal && !paramas.time?.timeVal) {
      setInitialValues({
        code: { codeType: 'workNo' },
        time: { timeType: 'purchaseTime' },
      });
    }

    setQueryParams({ current: 1, size: 10, ...paramasHandle });
  };
  //修改采购时间
  const purchaseTimeShow = () => {
    if (selectedRowKeys.length) {
      if (selectedRows.filter((record: any) => record.sourceId == 'HISTORY').length) {
        message.warning('选中包含历史数据，不能修改结算时间！');
      } else {
        setIsTimeOpen(true);
      }
    } else {
      message.warning('请选择需要修改的采购单！');
    }
  };
  const purchaseTimeChange = async () => {
    if (shoppingTime) {
      let res = await updatePurchaseDate({ purchaseIds: selectedRowKeys, purchaseTime: shoppingTime });
      if (res.code == 0) {
        message.success('操作成功');
      } else {
        message.warning(res.message);
      }
      setIsTimeOpen(false);
    } else {
      message.warning('请选择时间！');
    }
  };
  //选择采购时间
  const shoppingTimeChange = (date: any, dateString: string) => {
    console.log(date, dateString);
    setShoppingTime(dateString);
  };
  //更新数据
  const updatePurchaseOrder = async () => {
    let res = await scPurchaseOrderUpdate();
    if (res.code == 0) {
      message.success('操作成功');
      getDataSource();
    } else {
      message.warning(res.message);
    }
  };
  //生成结算明细
  const generateBillingDetails = async () => {
    if (selectedRowKeys.length) {
      if (selectedRows.filter((record: any) => record.sourceId != 'HISTORY').length) {
        message.warning('生成明细只能选择历史数据！');
      } else {
        let res = await generatePurchaseOrderHistory({ purchaseIds: selectedRowKeys });
        if (res.code == 0) {
          message.success('操作成功');
          getDataSource();
        } else {
          message.warning(res.message);
        }
      }
    } else {
      message.warning('请选择需要结算的采购单！');
    }
  };
  //下载
  const pointExport = async () => {
    let res = await downloadTemplate();
    console.log(res);
    download(res, '模板文件');
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
  };
  //获取数据
  const getDataSource = () => {
    setTableLoading(true);
    scPurchaseOrderGetPage(queryParams).then((res) => {
      setTableLoading(false);
      setDataSource(res.data);
    });
  };
  useEffect(() => {
    purchaseOrderStatistics({}).then((res) => {
      console.log(res);
      setStatisticsInfo(res.data);
    });
  }, []);
  useEffect(getDataSource, [queryParams]);
  const props: any = {
    name: 'file',
    action: `${process.env.REACT_APP_BASE_URL}/settlementcenter/scPurchaseOrder/importTemplateData`,
    accept: '.xlsx',
    headers: {
      // authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.code == 0) {
          message.success(`导入成功`);
          getDataSource();
        } else {
          message.warning(`${info.file.response.message}`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.response.message}`);
      }
    },
  };
  return (
    <>
      <Card>
        <SearchForm initialValues={initialValues} fields={searchFields} onSearch={onSearch} labelWidth={'97px'} />
      </Card>
      <Card className="gc-mt-2">
        <Space className="gc-fr">
          {AuthVisible('PO1_4') && (
            <Upload {...props} className="import-templateData">
              <Button>导入</Button>
            </Upload>
          )}
          {AuthVisible('PO1_5') && <Button onClick={() => pointExport()}>下载模板</Button>}
        </Space>
        <Space>
          {AuthVisible('PO1_1') && (
            <Button type="primary" onClick={purchaseTimeShow}>
              修改采购日期
            </Button>
          )}
          {AuthVisible('PO1_2') && (
            <Button type="primary" onClick={updatePurchaseOrder}>
              更新数据
            </Button>
          )}
          {AuthVisible('PO1_3') && (
            <Button type="primary" onClick={generateBillingDetails}>
              生成结算明细（ERP存量待结算数据）
            </Button>
          )}
        </Space>
        <br />
        <Space className="gc-mb-2 gc-mt-2">
          <Card>
            待结算金额(RMB)<div className="sc-money">{statisticsInfo?.PENDING_PAID}</div>
          </Card>
          <Card>
            结算中金额(RMB)<div className="sc-money">{statisticsInfo?.IN_PAID}</div>
          </Card>
          <Card>
            已结算金额(RMB)<div className="sc-money">{statisticsInfo?.PAID}</div>
          </Card>
        </Space>
        <Table
          scroll={{ x: 2000 }}
          rowKey={'id'}
          loading={tableLoading}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={dataSource?.records}
          onChange={onPageChange}
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
        title="请重新选择采购时间"
        visible={isTimeOpen}
        onOk={purchaseTimeChange}
        onCancel={() => setIsTimeOpen(false)}
      >
        <DatePicker
          onChange={shoppingTimeChange}
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
        />
      </Modal>
    </>
  );
};

export default PurchaseOrder;
