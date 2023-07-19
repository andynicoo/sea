import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import SearchForm, { Field } from '@/components/SearchForm';
import { Button, Card, message, Table, TablePaginationConfig, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import '@/styles/settlementCenter.scss';
import { setPageCache } from '@/utils/commonUtils';
import { QueryParams, ResponseDataVO } from '@/vo/baseVo';
import { FilterValue } from 'antd/lib/table/interface';
import { IconFont } from '../opportunity';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supplierList, supplierSync } from '@/api/settlementCenter';
import { SupplierInfoVo } from '@/vo/settlementCenterVo';
import { AuthVisible } from '@/utils/url';

//服务商列表
const ServiceProvider: React.FC = () => {
  const history = useHistory();
  const locationState: any = history.location.state;
  const [initialValues, setInitialValues] = useState<any>({
    status: '1'
  });
  let queryParamsDefault: QueryParams = { current: 1, size: 10,  status: '1' };
  if (locationState?.caChe && sessionStorage.queryParams) {
    let queryParamsCaChe = JSON.parse(sessionStorage.queryParams);
    queryParamsDefault = queryParamsCaChe;
    setInitialValues(JSON.parse(sessionStorage.queryParams))
  }
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [tableExpandedRowKeys, setTableExpandedRowKeys] = useState<string[]>([]);
  const [queryParams, setQueryParams] = useState<QueryParams>(queryParamsDefault);
  const [dataSource, setDataSource] = useState<ResponseDataVO<SupplierInfoVo>>();
  const countryList = useSelector((state: any) => state.global.countryAll);
  const categoryOption = useSelector((state: any) => state.global.productCategory);

  const searchFields: Field[] = [
    {
      label: '商品分类',
      name: 'category',
      type: 'Cascader',
      placeholder: '请选择',
      props: {
        fieldNames: {
          label: 'categoryName',
          value: 'id',
          children: 'childrenProductCategory',
        },
        options: categoryOption,
      },
    },
    {
      label: '服务商',
      type: 'Input',
      name: 'supplierName',
      placeholder: '服务商名称、服务商编号',
      width: 280,
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
    {
      label: '服务商类型',
      name: 'supplierType',
      type: 'Select',
      placeholder: '请选择',
      options: [
        { label: '律师', value: '2' },
        { label: '供应商', value: '1' },
      ],
    },
    {
      label: '工单分配状态',
      name: 'status',
      type: 'Select',
      placeholder: '请选择',
      options: [
        { label: '不分配', value: '2' },
        { label: '分配', value: '1' },
      ],
    },
  ];

  const columns: any = [
    {
      title: '服务商简称',
      dataIndex: 'shortName',
      width: 200,
    },
    {
      title: '服务商编码',
      dataIndex: 'supplierCode',
       width: 200,
    },
    {
      title: '服务商类型',
      dataIndex: 'supplierType',
      render: (_: any, record: any) => <div>{record.supplierType == '2' ? '律师' : '供应商'}</div>,
      width: 200,
    },
    {
      title: '商品分类',
      dataIndex: 'abbreviation',
      width: 200,
      render: (_: any, record: any) => (
        <>
          {record.categoryDTOLists.length == 1 && (
            <div className=" gc-td-main">{record.categoryDTOLists[0].categoryName}</div>
          )}
          {record.categoryDTOLists.length > 1 && (
            <div className={tableExpandedRowKeys.includes(record.supplierId) ? '' : 'gc-caretDownOut'}>
              {record.categoryDTOLists.map((item: any, index: number) => (
                <p key={index}>{item.categoryName}</p>
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      title: '服务国家',
      dataIndex: 'abbreviation',
      width: 350,
      render: (_: any, record: any) => (
        <>
          {record.categoryDTOLists.length == 1 && (
            <div className="gb-line-clamp1 gc-td-main">
              <Tooltip title={record.categoryDTOLists[0].countryName}>{record.categoryDTOLists[0].countryName}</Tooltip>
            </div>
          )}
          {record.categoryDTOLists.length > 1 && (
            <div className={tableExpandedRowKeys.includes(record.supplierId) ? '' : 'gc-caretDownOut'}>
              <div
                className="gc-more"
                onClick={() => {
                  goodsMore(record.supplierId);
                }}
              >
                {tableExpandedRowKeys.includes(record.supplierId) ? (
                  <>
                    <CaretUpOutlined />
                    收起
                  </>
                ) : (
                  <>
                    <CaretDownOutlined />
                    展开
                  </>
                )}
              </div>
              {record.categoryDTOLists.map((item: any, index: number) => (
                <p className="gb-line-clamp1" key={index}>
                  <Tooltip title={item.countryName}>{item.countryName}</Tooltip>
                </p>
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      title: '跟进人',
      dataIndex: 'createName',
      width: 150,
    },
    {
      title: '工单分配状态',
      dataIndex: 'status',
      width: 150,
      render: (_: any, record: any) => <div>{record.status == '1' ? '分配' : '不分配'}</div>,
    },
    {
      title: '操作',
      dataIndex: 'abbreviation',
      width: 150,
      render: (_: any, record: any) => (
        <div className="gc-table-btn">
          <>
            {AuthVisible('SP1_2') && (
              <Tooltip title="修改信息">
                <IconFont
                  className="gc-iconfont"
                  type="icon-caozuo_bianji"
                  onClick={() =>
                    history.push({
                      pathname: `/qkgoods/settlementCenter/serviceProviderEdit/${record.id}`,
                    })
                  }
                ></IconFont>
              </Tooltip>
            )}
          </>
          {/* <Tooltip title="明细配置表">
            <IconFont
              className="gc-iconfont"
              type="icon-lurukaifajieguo"
              onClick={() =>
                history.push({
                  pathname: `/qkgoods/settlementCenter/billingConfig/${record.supplierId}`,
                })
              }
            ></IconFont>
          </Tooltip> */}
        </div>
      ),
    },
  ];

  //搜索
  const onSearch = async (params: any) => {
    console.log(params, 'params');
    let categoryId = '';
    if (params.category) {
      categoryId = params.category[1];
    }
    setQueryParams({ ...queryParams, ...params, categoryId, current: 1 });
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

  //展开收起
  const goodsMore = (id: string) => {
    if (tableExpandedRowKeys.includes(id)) {
      setTableExpandedRowKeys(tableExpandedRowKeys.filter((item) => item != id));
    } else {
      setTableExpandedRowKeys([...tableExpandedRowKeys, id]);
    }
  };
  //获取数据
  const getDataSource = () => {
    setTableLoading(true);
    setPageCache('queryParams', JSON.stringify(queryParams));
    supplierList(queryParams).then((res) => {
      setTableLoading(false);
      setDataSource(res.data);
    });
  };
  useEffect(getDataSource, [queryParams]);
  //同步供应商
  const syncSupplier = async () => {
    setBtnLoading(true);
    let res = await supplierSync();
    setBtnLoading(false);
    if (res.data) {
      message.success('同步成功!');
      getDataSource();
    } else {
      message.error(res.message);
    }
  };

  const buttonSlot=<Button loading={btnLoading} type="primary" onClick={syncSupplier}> 同步服务商 </Button>

  return (
    <>
      <Card>
        <SearchForm initialValues={initialValues} fields={searchFields} onSearch={onSearch} labelWidth={'97px'} rightContent={AuthVisible('SP1_1')?buttonSlot:''} />
      </Card>
      <Card className="gc-mt-2">
        {/* {AuthVisible('SP1_1') && (
          <Button loading={btnLoading} type="primary" onClick={syncSupplier}>
            同步服务商
          </Button>
        )} */}
        <Table
          className="gc-mt-2"
          rowKey={'supplierId'}
          loading={tableLoading}
          columns={columns}
          dataSource={dataSource?.records}
          onChange={onPageChange}
          bordered
          pagination={{
            total: Number(dataSource?.total),
            current: Number(dataSource?.current) || 1,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total: number) => `共 ${total} 条`,
            pageSize: Number(dataSource?.size),
          }}
          scroll={{ scrollToFirstRowOnChange: true, x: '100%', y: 500 }}
        />
      </Card>
    </>
  );
};

export default ServiceProvider;
