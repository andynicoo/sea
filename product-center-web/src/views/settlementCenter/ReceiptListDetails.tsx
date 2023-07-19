import { getModuleConfigList, openOrClose } from '@/api/saasManage';
import SearchForm, { Field } from '@/components/SearchForm';
import { AuthVisible } from '@/utils/url';
import {
  Button,
  Card,
  Col,
  DatePicker,
  message,
  Modal,
  Row,
  Space,
  Switch,
  Table,
  TablePaginationConfig,
  Tabs,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import '@/styles/settlementCenter.scss';
import { chancePointExport, chancePointGetPage } from '@/api/opportunity';
import { download } from '@/utils/commonUtils';
import { QueryParams, ResponseDataVO } from '@/vo/baseVo';
import { OriginalRecordsVO } from '@/vo/opportunityVo';
import { FilterValue } from 'antd/lib/table/interface';
import moment from 'moment';
import { IconFont } from '../opportunity';
import { useHistory, useParams } from 'react-router-dom';
import BillingList from './BillingList';
import { cloneDeep, uniqBy } from 'lodash';
import { pageScPaymentOrderDetail, scPaymentOrderUpdate } from '@/api/settlementCenter';
import { ScPaymentOrderDetailVo, ScPurchaseOrderDetailDTO } from '@/vo/settlementCenterVo';
import { enterpriseList } from './PurchaseOrder';

//结算明细列表
const ReceiptListDetails: React.FC = () => {
  const { id } = useParams<any>();
  console.log(useHistory(), 'useHistory()');
  let queryParamsDefault = { id };
  const history = useHistory();
  const billingListRef = React.useRef();
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [queryParams, setQueryParams] = useState<QueryParams>(queryParamsDefault);
  const [dataSource, setDataSource] = useState<ScPaymentOrderDetailVo>();
  const [dataSourceList, setDataSourceList] = useState<ScPurchaseOrderDetailDTO[]>();
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [serviceRow, setServiceRow] = useState<any>();
  let isDetails = history.location.pathname.includes('receiptListDetails') ? false : true;
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
      render: (_: any, record: any) => (
        <div>
          {dataSource?.currencyShort}
          {record.payableAmount}
        </div>
      ),
    },
    {
      title: '收入',
      dataIndex: 'incomeAmount',
      render: (_: any, record: any) => (
        <div>
          {dataSource?.currencyShort}
          {record.incomeAmount}
        </div>
      ),
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
      title: '服务完成时间',
      dataIndex: 'serviceCompleteTime',
    },
    {
      title: '供应商系统简称',
      dataIndex: 'serviceProviderName',
    },
    {
      title: '供应商编号',
      dataIndex: 'serviceProviderNo',
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
          {enterpriseList &&
            enterpriseList.filter((item: QueryParams) => item.value == dataSource?.payEnterpriseId)[0]?.label}
        </div>
      ),
    },
    {
      title: '工单累计结算金额',
      dataIndex: 'accSettlementAmount',
      render: (_: any, record: any) => (
        <div>
          {dataSource?.currencyShort}
          {record.accSettlementAmount}
        </div>
      ),
    },
    {
      title: '工单未结算金额',
      dataIndex: 'nonSettlementAmount',
      render: (_: any, record: any) => (
        <div>
          {dataSource?.currencyShort}
          {record.nonSettlementAmount}
        </div>
      ),
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      render: (_: any, record: any) => <div>{record.taxRate + '%'}</div>,
    },
    {
      title: '毛利',
      dataIndex: 'grossProfit',
      render: (_: any, record: any) => (
        <div>
          {dataSource?.currencyShort}
          {record.nonSettlementAmount}
        </div>
      ),
    },
    {
      title: '毛利率',
      dataIndex: 'grossProfitRate',
      render: (_: any, record: any) => <div>{record.grossProfitRate + '%'}</div>,
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
  //批量删除
  const batchDeletion = () => {
    if (selectedRowKeys.length) {
      let dataSourceHandle: ScPaymentOrderDetailVo = cloneDeep(dataSource) as ScPaymentOrderDetailVo;
      dataSourceHandle.scPurchaseOrderDetailDTOS = dataSourceHandle?.scPurchaseOrderDetailDTOS.filter((item: any) => {
        return !selectedRowKeys.includes(item.id);
      });
      setDataSource(dataSourceHandle);
      setSelectedRowKeys([]);
    } else {
      message.warning('请选择需要删除的工单！');
    }
  };
  //确定修改付款单
  const confirmModification = async () => {
    //    console.log(dataSource?.scPurchaseOrderDetailDTOS)
    //    console.log(dataSourceList)
    let dateDel: ScPurchaseOrderDetailDTO[] = [];
    let dateAdd: ScPurchaseOrderDetailDTO[] = [];
    dataSourceList?.forEach((item) => {
      let isExist = false;
      dataSource?.scPurchaseOrderDetailDTOS.forEach((itemNew) => {
        if (item.id == itemNew.id) {
          isExist = true;
        }
      });
      if (!isExist) {
        dateDel.push(item);
      }
    });
    dataSource?.scPurchaseOrderDetailDTOS.forEach((itemNew) => {
      let isExist = false;
      dataSourceList?.forEach((item) => {
        if (itemNew.id == item.id) {
          isExist = true;
        }
      });
      if (!isExist) {
        dateAdd.push(itemNew);
      }
    });
    let res = await scPaymentOrderUpdate({ id, detailAddDTOList: dateAdd, detailDeleteDTOList: dateDel });
    if (res.code == 0) {
      message.success('操作成功');
      history.push({
        pathname: '/qkgoods/settlementCenter/receiptList',
        state: { caChe: true },
      });
    } else {
      message.warning(res.message);
    }
    console.log(dateDel, 'dateDel', dateAdd);
  };
  //确认生成付款单
  const addBillingListOk = () => {
    // @ts-ignore
    let refData = billingListRef.current.billingRows;
    // console.log(billingListRef.current.billingRows,'billingRows')
    //@ts-ignore
    if (refData.length) {
      let open = false;
      for (let i = 0; i < refData.length; i++) {
        if (
          refData[i].countryCode != serviceRow.countryCode ||
          refData[i].payEnterpriseId != dataSource?.payEnterpriseId ||
          refData[i].supplierId != serviceRow.supplierId
        ) {
          open = true;
        }
      }
      if (open) {
        message.warning('选择的结算明细需为同一个付款主体、国家、服务商！');
        // } else {
        //   setIsPayOpen(true);
        // }
        // if (refData.filter((element: any) => element.serviceNo != serviceNo).length) {
        //   message.warning('只能选择相同服务号的订单！');
      } else {
        let dataSourceHandle: ScPaymentOrderDetailVo = cloneDeep(dataSource) as ScPaymentOrderDetailVo;
        dataSourceHandle.scPurchaseOrderDetailDTOS = uniqBy(
          [...dataSourceHandle?.scPurchaseOrderDetailDTOS, ...refData],
          'id'
        );
        setDataSource(dataSourceHandle);
        setIsAddOpen(false);
      }
    } else {
      message.warning('请选择订单！');
    }
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
  //table选中行
  const onSelectChange = (newSelectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
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
    pageScPaymentOrderDetail(queryParams).then((res) => {
      setTableLoading(false);
      setDataSource(res.data);
      setDataSourceList(cloneDeep(res.data.scPurchaseOrderDetailDTOS));
      setServiceRow(res.data.scPurchaseOrderDetailDTOS[0]);
    });
  };
  useEffect(getDataSource, [queryParams]);
  return (
    <>
      <Card>
        <Row>
          <Col className="sc-label">申请单编号：</Col>
          <Col>{dataSource?.paymentNo}</Col>
        </Row>
        <Row>
          <Col className="sc-label">申请时间：</Col>
          <Col>{dataSource?.applyTime}</Col>
        </Row>
        <Row>
          <Col className="sc-label">付款申请单总金额：</Col>
          <Col>
            {dataSource?.currencyShort}
            {dataSource?.totalAmount}
          </Col>
        </Row>
        <Row>
          <Col className="sc-label">付款主体：</Col>
          <Col>
            {enterpriseList &&
              enterpriseList.filter((item: QueryParams) => item.value == dataSource?.payEnterpriseId)[0]?.label}
          </Col>
        </Row>
      </Card>
      <Card className="gc-mt-2">
        {isDetails && (
          <Space>
            {<Button onClick={batchDeletion}>批量删除</Button>}
            {<Button onClick={() => setIsAddOpen(true)}>增加明细</Button>}
          </Space>
        )}
        <Table
          className="gc-mt-2"
          scroll={{ x: 2800 }}
          rowKey={'id'}
          loading={tableLoading}
          columns={columns}
          dataSource={dataSource?.scPurchaseOrderDetailDTOS}
          onChange={onPageChange}
          rowSelection={rowSelection}
          pagination={false}
          // pagination={{
          //     total: Number(dataSource?.total),
          //     current: Number(dataSource?.current) || 1,
          //     showSizeChanger: true,
          //     showQuickJumper: true,
          //     showTotal: (total: number) => `共 ${total} 条`,
          //     pageSize: Number(dataSource?.size)
          // }}
        />
      </Card>
      <Card>
        <Space>
          {isDetails && (
            <Button type="primary" onClick={confirmModification}>
              确定
            </Button>
          )}
          {
            <Button
              onClick={() =>
                history.push({
                  pathname: '/qkgoods/settlementCenter/receiptList',
                  state: { caChe: true },
                })
              }
            >
              返回
            </Button>
          }
        </Space>
      </Card>
      <AddBillingList
        ref={billingListRef}
        isAddOpen={isAddOpen}
        selectedRows={selectedRows}
        addBillingListOk={addBillingListOk}
        setIsAddOpen={setIsAddOpen}
      />
    </>
  );
};

export default ReceiptListDetails;

interface CreatePaymentOrderProps {
  ref: any;
  isAddOpen: boolean;
  selectedRows: any;
  addBillingListOk: () => void;
  setIsAddOpen: (val: boolean) => void;
}
const AddBillingList: React.FC<CreatePaymentOrderProps> = forwardRef((props, ref) => {
  const [billingRows, setBillingRows] = useState<any>([]);
  useImperativeHandle(ref, () => ({
    billingRows,
  }));
  return (
    <Modal
      width={1200}
      title="增加结算明细"
      visible={props.isAddOpen}
      onOk={props.addBillingListOk}
      onCancel={() => props.setIsAddOpen(false)}
    >
      <BillingList setBillingRows={setBillingRows} isAddBilling={true} />
    </Modal>
  );
});
