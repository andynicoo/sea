import { Table, Tabs, Modal, Tag, Tooltip, message, Card, Image, Checkbox, Spin, Select, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import type { TablePaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { DownOutlined, ExclamationCircleOutlined, CaretDownOutlined, CaretUpOutlined, VerticalAlignTopOutlined, VerticalAlignBottomOutlined, QuestionCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { download, setPageCache } from '@/utils/commonUtils';
import { FilterValue } from 'antd/lib/table/interface';
import { IconFont } from '../opportunity';
import { AuthVisible } from '@/utils/url';
import moment from 'moment';
import SearchForm, { Field } from '@/components/SearchForm';
import '@/styles/goodsSource.scss';
import {
  clientEditClient,
  modifyAttribution,
  pageCombinationProduct,
  productCategoryGetPage,
  productInfoDelete,
  productInfoExport,
  productInfoList,
  productInfoPublish,
  productInfoStatistics,
  pushProductInfo,
  upperOrLower,
} from '@/api/goodsSource';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { cloneDeep, sortBy, uniqBy } from 'lodash';
import { QueryParams, UsersInfoVO } from '@/vo/baseVo';
import { productNumVo } from '@/vo/goodsSourceVo';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import ExportGoods from './components/ExportGoods';
import UploadGoods from './components/UploadGoods';
import UploadCenter from './components/UploadCenter';
const { TabPane } = Tabs;
const statusMap: { [key: string]: any } = {
  NOT_PUSH: {
    label: '未推送',
    value: 'red',
  },
  IS_PUSH: {
    label: '已推送',
    value: 'green',
  },
  PENDING_PUBLISH: {
    label: '未上架',
    value: 'red',
  },
  PENDED_PUBLISH: {
    label: '已上架',
    value: 'green',
  },
  INVALID: {
    label: '已下架',
    value: 'red',
  },
  PERMANENT_INVALID: {
    label: '永久下架',
    value: 'red',
  },
};
const handleMap = ['你确定推送该商品吗？', '你确定下架该商品吗？', '你确定删除该商品吗？'];

const enterpriseList = JSON.parse(localStorage.enterpriseList).map((item: any) => {
  return { label: item.name, value: item.id };
});
const clientTxt: any = {
  PC: 'PC端',
  H5: 'H5端',
  APPLET: '小程序端',
  OFFLINE: '线下',
  HIDE: '隐藏端',
};

interface GoodsSourceListProps {
  goodsRowsChange: (rows: any) => void;
  goodsList: any;
}
//商品库列表
export const GoodsSourceList: React.FC<GoodsSourceListProps> = (props) => {
  const searchRef = React.useRef();
  const history = useHistory();
  const locationState: any = history.location.state;
  const locationPathname: any = history.location.pathname;
  const isGoodsSales = locationPathname.includes('goodsSales/index');
  const countryList = useSelector((state: any) => state.global.countryAll);
  const [categoryOption, setCategoryOption] = useState<any>([]);
  let usersAllState = useSelector((state: any) => state.global.usersAll);
  const usersOptions = usersAllState?.map((item: UsersInfoVO) => {
    return { label: item.nickName, value: item.userId };
  });
  let initialValues: QueryParams = {};
  let typeDefault = 'NOT_COMBINATION_PRODUCT';
  let queryParamsDefault: QueryParams = {
    current: 1,
    size: 10,
    isCombinationProduct: typeDefault,
    isRenewProduct: 'NOT_RENEW_PRODUCT'
  };

  if (locationState?.caChe && sessionStorage.queryParams) {
    let queryParamsCaChe = JSON.parse(sessionStorage.queryParams);
    queryParamsDefault = queryParamsCaChe;
    initialValues = JSON.parse(sessionStorage.queryParams);
    if (initialValues.createTime) {
      initialValues.createTime = [moment(initialValues.createTime[0]), moment(initialValues.createTime[1])];
    }
    typeDefault = queryParamsCaChe.isCombinationProduct;
  }
  const [currRow, setCurrRow] = useState<any>();
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [tableExpandedRowKeys, setTableExpandedRowKeys] = useState<string[]>([]);
  const [queryParams, setQueryParams] = useState<any>(queryParamsDefault);
  const [tabsType, setTabsType] = useState<string>(typeDefault);
  const [dataSource, setDataSource] = useState<any>([]);
  const [isUpperOpen, setIsUpperOpen] = useState(false);
  const [isPushOpen, setIsPushOpen] = useState(false);
  const [isEditUpper, setIsEditUpper] = useState(false);
  const [upperVal, setUpperVal] = useState<CheckboxValueType[]>([]);
  const [pushVal, setPushVal] = useState([]);
  const [pushedMainbody, setPushedMainbody] = useState<any>([]);
  const [productNum, setProductNum] = useState<productNumVo>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [distributionOwnerOpen, setDistributionOwnerOpen] = useState<boolean>(false);
  const [attributionItem, setAttributionItem] = useState<{ value: string; label: React.ReactNode }[]>([]);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  tabsType == 'IS_RENEW_PRODUCT';
  const goodsListKey = props.goodsList ? props.goodsList.map((item: any) => item.productCode) : [];
  const optionsMapObj: any = {
    NOT_COMBINATION_PRODUCT: [
      { label: 'PC端', value: 'PC' },
      { label: 'H5端', value: 'H5' },
      { label: '小程序端', value: 'APPLET' },
      { label: '线下', value: 'OFFLINE' },
      { label: '隐藏端', value: 'HIDE' },
    ], //商品
    IS_RENEW_PRODUCT: [{ label: '隐藏端', value: 'HIDE' }], //续费商品
    IS_COMBINATION_PRODUCT: [
      { label: 'PC端', value: 'PC' },
      { label: 'H5端', value: 'H5' },
      { label: '小程序端', value: 'APPLET' },
      { label: '线下', value: 'OFFLINE' },
    ], //组合商品
  };
  const optionsMap: any = optionsMapObj[tabsType];
  const searchGoods = isGoodsSales
    ? [
        {
          label: '状态',
          name: 'productStatus',
          type: 'Select',
          placeholder: '请选择',
          options: [
            { label: '未上架', value: 'PENDING_PUBLISH' },
            { label: '已上架', value: 'PENDED_PUBLISH' },
            { label: '已下架', value: 'INVALID' },
            { label: '永久下架', value: 'PERMANENT_INVALID' },
          ],
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
          label: '销售端',
          name: 'client',
          type: 'Select',
          placeholder: '请选择',
          options: optionsMap,
        },
        {
          label: '创建时间',
          name: 'createTime',
          type: 'RangePicker',
        },
      ]
    : [
        {
          label: '状态',
          name: 'isPush',
          type: 'Select',
          placeholder: '请选择',
          options: [
            { label: '已推送', value: 'IS_PUSH' },
            { label: '未推送', value: 'NOT_PUSH' },
          ],
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
          label: '主体',
          name: 'publishClient',
          type: 'Select',
          placeholder: '请选择',
          options: enterpriseList,
        },
        {
          label: '创建时间',
          name: 'createTime',
          type: 'RangePicker',
        },
      ];
  const searchFields: Field[] | any = [
    {
      label: '商品搜索',
      name: 'productName',
      type: 'Input',
      placeholder: '请输入商品名称，ID',
    },
    {
      label: '商品分类',
      name: 'productCategoryId',
      type: 'Select',
      placeholder: '请选择',
      options: categoryOption,
    },
    ...searchGoods,
  ];
  //选择行
  const rowSelection = {
    defaultSelectedRowKeys: goodsListKey,
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      props.goodsRowsChange && props.goodsRowsChange(selectedRows);
    },
    getCheckboxProps: (record: any) => {
      return {
        disabled: goodsListKey.includes(record.productCode), // Column configuration not to be checked
        name: record.name,
      };
    },
  };

  //table操作按钮
  const handleBtn = (row: any, type: number) => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: handleMap[type - 1],
      okText: '确认',
      cancelText: '取消',
      onOk: () => confirmOk(row, type),
    });
  };
  const confirmOk = async (row: any, type: number) => {
    if (type == 1) {
      // await productInfoPublish({ productIds: [row.id] });
    } else if (type == 3) {
      await productInfoDelete(row.id);
    } else {
      let { id, productCategoryId, serviceContext, productName } = row;
      await upperOrLower({
        id,
        productStatus: 'INVALID',
        productCategoryId,
        serviceContext,
        productName,
      });
    }
    getDataSource();
    message.success('操作成功！');
  };
  //展开收起
  const goodsMore = (id: string) => {
    if (tableExpandedRowKeys.includes(id)) {
      setTableExpandedRowKeys(tableExpandedRowKeys.filter((item) => item != id));
    } else {
      setTableExpandedRowKeys([...tableExpandedRowKeys, id]);
    }
  };
  //组合商品展开收起
  const changeGoodsVisible = (id: string) => {
    let handleData = cloneDeep(dataSource);
    let handleDataRecords = handleData.records.map((item: any) => {
      let handleDTO = item.productInfoDTOList.map((itemChild: any) => {
        if (itemChild.id == id) {
          itemChild.visible = !itemChild.visible;
        }
        return itemChild;
      });
      item.productInfoDTOList = handleDTO;
      return item;
    });
    handleData.records = handleDataRecords;
    setDataSource(handleData);
  };
  //推送
  const handlePush = (row: any) => {
    setCurrRow(row);
    let enterpriseListHd = enterpriseList.filter((item: any) => {
      return !row.publishClient.includes(item.value.toString());
    });
    console.log(enterpriseListHd, row.publishClient, 'enterpriseListHd');
    setPushedMainbody(enterpriseListHd);
    setIsPushOpen(true);
  };
  //上架
  const handleUpper = (row: any, type: boolean) => {
    setCurrRow(row);
    if (type) {
      setUpperVal(row.client.split(','));
    } else {
      setUpperVal([]);
    }
    setIsEditUpper(type);
    setIsUpperOpen(true);
  };
  //选择上架端
  const onChangeUpper = (val: CheckboxValueType[]) => {
    if (val.includes('HIDE')) {
      if (upperVal.includes('HIDE')) {
        setUpperVal(val.filter((item) => item != 'HIDE'));
      } else {
        setUpperVal(['HIDE']);
      }
    } else {
      setUpperVal(val);
    }
  };
  //平台label转换
  const handleClient = (client: string) => {
    let clientArr = client.split(',');
    return clientArr
      .map((item) => {
        return clientTxt[item];
      })
      .join('，');
  };
  //确定推送
  const handlePushOk = async () => {
    if (pushVal.length) {
      console.log(currRow, pushVal);
      let res = await productInfoPublish({
        productIds: [currRow.id],
        enterpriseIds: [...pushVal, ...currRow.publishClient],
      });

      if (res.code == 0) {
        setIsPushOpen(false);
        getDataSource();
        message.success('操作成功！');
      } else {
        message.warning(res.message);
      }
    } else {
      message.warning('请选择推送主体！');
    }
  };
  //确定上架
  const handleUpperOk = async () => {
    console.log(upperVal, 'upperVal');
    if (upperVal.includes('HIDE') && upperVal.length > 1) {
      return message.warning('隐藏端不能和其它端同时上架！');
    }
    if (upperVal.length) {
      console.log(currRow, upperVal);
      let { id, productCategoryId, serviceContext, productName } = currRow;
      let res: any;
      let paramas = {
        client: upperVal.join(','),
        id,
        productStatus: 'PENDED_PUBLISH',
        productCategoryId,
        serviceContext,
        productName,
      };
      if (isEditUpper) {
        res = await clientEditClient(paramas);
      } else {
        res = await upperOrLower(paramas);
      }
      setIsUpperOpen(false);
      getDataSource();
      if (res.code == 0) {
        message.success('操作成功！');
      } else {
        message.warning(res.message);
      }
      console.log(res);
    } else {
      message.warning('请选择上架平台！');
    }
  };
  let getEnterpriseList = (list: string[]) => {
    let enterprise: string[] = [];
    enterpriseList.forEach((item: any) => {
      if (list.includes(item.value.toString())) {
        enterprise.push(item.label);
      }
    });
    return enterprise;
  };
  const statusSalse = isGoodsSales
    ? [
        {
          title: '状态',
          dataIndex: 'productStatus',
          render: (_: any, record: any) => (
            <>
              <div className="gc-td-main">
                <Tag color={statusMap[record.productStatus]?.value}>{statusMap[record.productStatus]?.label}</Tag>
                {record.permanentInvalidReason && (
                  <Tooltip title={record.permanentInvalidReason}>
                    <QuestionCircleOutlined />
                  </Tooltip>
                )}
              </div>
              <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'isPush'} />
            </>
          ),
        },
        {
          title: '关联商品库商品',
          dataIndex: 'productCode',
          render: (_: any, record: any) => (
            <>
              <div className="gc-td-main">
                <span
                  className="gc-search-form-more"
                  onClick={() =>
                    history.push({
                      pathname: `/qkgoods/goodsSource/details/${record.sourceId}`,
                    })
                  }
                >
                  立即跳转
                </span>
              </div>
              <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'isPush'} />
            </>
          ),
        },
        {
          title: '销售端',
          dataIndex: 'client',
          render: (_: any, record: any) => (
            <>
              <div className="gc-td-main">
                {record.client ? (
                  <div>
                    {handleClient(record.client)}
                    <Tooltip title="修改上架">
                      {AuthVisible('GSA_2') && (
                        <VerticalAlignTopOutlined
                          className="gc-upper-lower-shelves"
                          onClick={() => {
                            handleUpper(record, true);
                          }}
                        />
                      )}
                    </Tooltip>
                  </div>
                ) : (
                  '--'
                )}
              </div>
              <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'isPush'} />
            </>
          ),
        },
        {
          title: '归属人',
          dataIndex: 'attributionName',
          render: (_: any, record: any) => (
            <>
              <div className="gc-td-main">
                <Tooltip title={record.attributionName}>
                  <div className="gb-line-clamp2">{record.attributionName}</div>
                </Tooltip>
                <Tooltip title="编辑">{AuthVisible('GSA_1') && <IconFont className="gc-iconfont" type="icon-caozuo_bianji" onClick={() => distributionOwner(record)}></IconFont>}</Tooltip>
              </div>
              <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'isPush'} />
            </>
          ),
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          className: 'goods-td-right',
          render: (_: any, record: any) => (
            <>
              <div className="gc-td-main gc-table-btn">
                <Tooltip title="编辑">
                  {AuthVisible('GSA_1') && (
                    <IconFont
                      className="gc-iconfont"
                      type="icon-caozuo_bianji"
                      onClick={() =>
                        history.push({
                          pathname: tabsType == 'NOT_COMBINATION_PRODUCT' || tabsType == 'IS_RENEW_PRODUCT' ? `/qkgoods/goodsSales/edit/${record.id}` : `/qkgoods/goodsSales/editGroup/${record.id}`,
                        })
                      }
                    ></IconFont>
                  )}
                </Tooltip>

                {['PENDING_PUBLISH', 'INVALID'].includes(record.productStatus) && (
                  <Tooltip title="上架">
                    {AuthVisible('GSA_2') && (
                      <VerticalAlignTopOutlined
                        className="gc-upper-lower-shelves"
                        onClick={() => {
                          handleUpper(record, false);
                        }}
                      />
                    )}
                  </Tooltip>
                )}
                {['PENDED_PUBLISH'].includes(record.productStatus) && (
                  <Tooltip title="下架">
                    {AuthVisible('GSA_3') && (
                      <VerticalAlignBottomOutlined
                        className="gc-upper-lower-shelves"
                        onClick={() => {
                          handleBtn(record, 2);
                        }}
                      />
                    )}
                  </Tooltip>
                )}

                {AuthVisible('GSA_4') && (
                  <Tooltip title="查看详情">
                    <IconFont
                      className="gc-iconfont"
                      type="icon-caozuo_chakanxiangqing"
                      onClick={() =>
                        history.push({
                          pathname: `/qkgoods/goodsSales/details/${record.id}`,
                        })
                      }
                    ></IconFont>
                  </Tooltip>
                )}
                {AuthVisible('GSA_999') && (
                  <Tooltip title="拉取规格">
                    <IconFont className="gc-iconfont" type="icon-caozuo_huifu" onClick={() => syncSpecs(record.id)}></IconFont>
                  </Tooltip>
                )}
              </div>
              <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'isPush'} />
            </>
          ),
        },
      ]
    : [
        {
          title: '状态',
          dataIndex: 'isPush',
          width: 200,
          render: (_: any, record: any) => (
            <>
              {' '}
              <div className="gc-td-main">
                <Tag color={statusMap[record.isPush].value}>{statusMap[record.isPush].label}</Tag>
                {record.isPush == 'IS_PUSH' && (
                  <div className="gb-line-clamp1">
                    <Tooltip title={getEnterpriseList(record.publishClient).join()}>{getEnterpriseList(record.publishClient).join()}</Tooltip>
                  </div>
                )}
                <p>{record.createTime}</p>
              </div>
              <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'isPush'} />
            </>
          ),
        },
        {
          title: '操作',
          dataIndex: 'operation',
          fixed: 'right',
          className: 'goods-td-right',
          render: (_: any, record: any) => (
            <>
              <div className="gc-td-main gc-table-btn">
                <Tooltip title="编辑">
                  {AuthVisible('GSO_1') && record.isPush == 'NOT_PUSH' && (
                    <IconFont
                      className="gc-iconfont"
                      type="icon-caozuo_bianji"
                      onClick={() =>
                        history.push({
                          pathname: tabsType == 'NOT_COMBINATION_PRODUCT' || tabsType == 'IS_RENEW_PRODUCT' ? `/qkgoods/goodsSource/edit/${record.id}` : `/qkgoods/goodsSource/editGroup/${record.id}`,
                        })
                      }
                    ></IconFont>
                  )}
                </Tooltip>
                <Tooltip title="推送">
                  {AuthVisible('GSO_2') && (
                    <IconFont
                      className="gc-iconfont"
                      type="icon-caozuo_tijiaozhigongyinglian"
                      style={{
                        opacity: record.publishClient.length == enterpriseList.length ? 0.5 : 1,
                      }}
                      onClick={() => {
                        handlePush(record);
                      }}
                    ></IconFont>
                  )}
                </Tooltip>

                {AuthVisible('GSO_3') && (
                  <Tooltip title="查看详情">
                    <IconFont
                      className="gc-iconfont"
                      type="icon-caozuo_chakanxiangqing"
                      onClick={() =>
                        history.push({
                          pathname: `/qkgoods/goodsSource/details/${record.id}`,
                        })
                      }
                    ></IconFont>
                  </Tooltip>
                )}
                {AuthVisible('GSO_5') && (
                  <Tooltip title="删除">
                    <IconFont
                      className="gc-iconfont"
                      type="icon-caozuo_jujue"
                      onClick={() => {
                        handleBtn(record, 3);
                      }}
                    ></IconFont>
                  </Tooltip>
                )}
              </div>
              <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'isPush'} />
            </>
          ),
        },
      ];
  const operationAndStatus = props.goodsList ? [] : [...statusSalse];
  const columns: any = [
    {
      title: '商品ID',
      dataIndex: 'productCode',
      width: 120,
      render: (_: any, record: any) => (
        <>
          <div className="gc-td-main">
            {record.productCode}
            {(tabsType == 'NOT_COMBINATION_PRODUCT' || tabsType == 'IS_RENEW_PRODUCT') && record.productSpecsDTOList.length > 1 ? (
              <div
                className="gc-goods-specs"
                onClick={() => {
                  goodsMore(record.productCode);
                }}
              >
                {tableExpandedRowKeys.includes(record.productCode) ? (
                  <>
                    <CaretUpOutlined />
                    收起
                  </>
                ) : (
                  <>
                    <CaretDownOutlined />
                    查看全部
                  </>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
          <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'productCode'} />
        </>
      ),
    },
    {
      title: '商品图片',
      dataIndex: 'developmentRequirement',
      render: (_: any, record: any) => (
        <>
          <div className="gc-td-main">
            <Image.PreviewGroup>
              <Image width={60} height={60} src={record.productImagePc || record.productImageH5} />
            </Image.PreviewGroup>
          </div>
          <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'isPush'} />
        </>
      ),
    },
    {
      title: '商品名称',
      width: 200,
      dataIndex: 'productName',
      className: 'goods-td-left',
      render: (_: any, record: any) => (
        <>
          <div className=" gc-td-main">
            <Tooltip title={record.productName} placement="topLeft">
              <p className="gb-line-clamp2">{record.productName}</p>
            </Tooltip>
          </div>
          <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} dataIndex={'productName'} childDataIndex={'specsName'} />
        </>
      ),
    },
    {
      title: '商品分类',
      width: 150,
      dataIndex: 'productCategoryId',
      render: (_: any, record: any) => (
        <>
          <div className="gb-line-clamp2 gc-td-main">{record.productCategoryName || '--'}</div>
          {tabsType == 'NOT_COMBINATION_PRODUCT' || tabsType == 'IS_RENEW_PRODUCT' ? (
            ''
          ) : (
            <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} dataIndex={'productCategoryName'} changeGoodsVisible={changeGoodsVisible} />
          )}
        </>
      ),
    },
    {
      title: '国家',
      dataIndex: 'countryCode',
      render: (_: any, record: any) => (
        <>
          <div className="gb-line-clamp1 gc-td-main">{record.countryCodeName || '--'}</div>
          {tabsType == 'NOT_COMBINATION_PRODUCT' || tabsType == 'IS_RENEW_PRODUCT' ? '' : <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} dataIndex={'countryCodeName'} />}
        </>
      ),
    },
    {
      title: '销售价',
      dataIndex: 'servicePrice',
      render: (_: any, record: any) => (
        <>
          <MainGoodsPrice record={record} dataIndex={'servicePrice'} />
          <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'servicePrice'} />
        </>
      ),
    },
    {
      title: '原价',
      dataIndex: 'originalPrice',
      render: (_: any, record: any) => (
        <>
          <MainGoodsPrice record={record} dataIndex={'originalPrice'} />
          <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'originalPrice'} />
        </>
      ),
    },
    {
      title: '最低售价',
      dataIndex: 'minimumPrice',
      render: (_: any, record: any) => (
        <>
          <MainGoodsPrice record={record} dataIndex={'minimumPrice'} />
          <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'minimumPrice'} />
        </>
      ),
    },
    {
      title: '目标毛利率',
      dataIndex: 'grossProfitMargin',
      render: (_: any, record: any) => (
        <>
          <MainGoodsPrice record={record} dataIndex={'grossProfitMargin'} />
          <TDChildCommponent record={record} tableExpandedRowKeys={tableExpandedRowKeys} childDataIndex={'grossProfitMargin'} />
        </>
      ),
    },
    ...operationAndStatus,
  ];

  //获取数据
  const getDataSource = () => {
    let enterpriseId = isGoodsSales ? localStorage.enterpriseId : '-1';
    setPageCache('queryParams', JSON.stringify(queryParams));
    setTableLoading(true);
    productInfoStatistics({
      ...queryParams,
      isCombinationProduct: tabsType,
      enterpriseId,
      current: 1,
    }).then((res) => {
      console.log(res, 999);
      setProductNum(res.data);
      console.log(res.data);
    });
    if (tabsType == 'NOT_COMBINATION_PRODUCT' || tabsType == 'IS_RENEW_PRODUCT') {
      productInfoList({
        ...queryParams,
        isCombinationProduct: 'NOT_COMBINATION_PRODUCT',
        enterpriseId,
        isRenewProduct: tabsType == 'IS_RENEW_PRODUCT' ? 'IS_RENEW_PRODUCT' : 'NOT_RENEW_PRODUCT',
      }).then((res) => {
        setTableLoading(false);
        setDataSource(res.data);
      });
    } else {
      pageCombinationProduct({
        ...queryParams,
        isCombinationProduct: tabsType,
        enterpriseId,
      }).then((res) => {
        setTableLoading(false);
        let handleData = cloneDeep(res.data);
        let handleDataRecords = res.data.records.map((item: any) => {
          let handleDTO = item.productInfoDTOList.map((itemChild: any) => {
            return { ...itemChild, visible: false };
          });
          item.productInfoDTOList = handleDTO;
          return item;
        });
        handleData.records = handleDataRecords;
        setDataSource(handleData);
      });
    }
  };

  //搜索
  const onSearch = async (params: any) => {
    let createTimeStart = params.createTime && moment(params.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00';
    let createTimeEnd = params.createTime && moment(params.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59';
    setQueryParams({
      ...queryParams,
      ...params,
      current: 1,
      createTimeStart,
      createTimeEnd,
    });
  };
  //table分页排序
  const onPageChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: any) => {
    setQueryParams({
      ...queryParams,
      current: Number(pagination.current),
      size: Number(pagination.pageSize),
    });
  };
  //同步商品规格
  const syncSpecs = async (id: string) => {
    await pushProductInfo({ id });
    message.success('操作成功！');
  };
  useEffect(getDataSource, [queryParams]);

  useEffect(() => {
    productCategoryGetPage({ current: 1, size: 100 }).then((res) => {
      let records = res.data.records.map((item) => {
        return { label: item.categoryName, value: item.id };
      });
      setCategoryOption(records);
    });
  }, []);
  //切换需求状态
  const goodsStatusChange = (value: string) => {
    setPageCache('parentStatus', value);
    setTabsType(value);
    // 续费商品的时候. 同步改变搜索参数的isCombinationProduct 为 NOT_COMBINATION_PRODUCT
    if(value === 'IS_RENEW_PRODUCT') {
      setQueryParams({ ...queryParams, isCombinationProduct: 'NOT_COMBINATION_PRODUCT', isRenewProduct: value, current: 1 });
    }else {
      setQueryParams({ ...queryParams, isCombinationProduct: value, isRenewProduct: 'NOT_RENEW_PRODUCT', current: 1 });
    }
  };
  //导出
  const goodsExport = async () => {
    let enterpriseId = isGoodsSales ? localStorage.enterpriseId : '-1';
    let exportFlag = false;
    Object.keys(queryParams).forEach((item) => {
      if (!['size', 'current', 'isCombinationProduct'].includes(item) && queryParams[item]) {
        exportFlag = true;
      }
    });
    if (exportFlag) {
      setExportLoading(true);
      let res = await productInfoExport({
        ...queryParams,
        enterpriseId,
        size: '-1',
      });
      setExportLoading(false);
      download(res, '商品列表导出文件');
    } else {
      message.warning('不支持全量导出，请先筛选出要导出的结果！');
    }
  };
  //分配归属人
  const distributionOwner = (row?: any) => {
    console.log(row, selectedRowKeys, 'selectedRowKeys');
    if (row) {
      setSelectedRowKeys([row.id]);
      setSelectedRows([row]);
      let users: { value: string; label: React.ReactNode }[] = [];
      let usersName = row.attributionName.split(',');
      row.attributionId.split(',').forEach((ele: string, index: number) => {
        users.push({ value: ele, label: usersName[index] });
      });
      setAttributionItem(users);
      return setDistributionOwnerOpen(true);
    }

    if (selectedRowKeys.length) {
      setDistributionOwnerOpen(true);
    } else {
      message.success('请选择商品！');
    }
  };
  //确认分配归属人
  const distributionOwnerOk = async () => {
    if (attributionItem.length) {
      let res = await modifyAttribution({
        productIds: selectedRowKeys,
        attributionName: attributionItem.map((item) => item.label).join(','),
        attributionId: attributionItem.map((item) => item.value).join(','),
      });
      if (res.code == 0) {
        setDistributionOwnerOpen(false);
        getDataSource();
        message.success('操作成功！');
      } else {
        message.warning(res.message);
      }
    }
  };
  //选择归属人
  const attributorChange = (val: { value: string; label: React.ReactNode }[]) => {
    setAttributionItem(val);
  };
  //关闭归属人弹窗
  const distributionOwnerAfterClose = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setAttributionItem([]);
  };
  const operations = (
    <div className="gc-create-export">
      {isGoodsSales ? (
        <>
          {AuthVisible('GSA_5') && (
            <span className="gc-create-btn" onClick={() => distributionOwner()}>
              批量分配归属人
            </span>
          )}
          {AuthVisible('GSA_5') && (
            <span className="gc-export-btn" onClick={goodsExport}>
              {exportLoading ? <LoadingOutlined /> : <IconFont className="gc-iconfont" type="icon-daochu" />} 导出
            </span>
          )}
        </>
      ) : (
        <>
          {AuthVisible('GSO_1') && (
            <span className="gc-create-btn" onClick={() => history.push('/qkgoods/goodsSource/add')}>
              <IconFont className="gc-iconfont" type="icon-xinzengqiye" /> 创建商品
            </span>
          )}
          {AuthVisible('GSO_1') && (
            <span className="gc-create-btn" onClick={() => history.push('/qkgoods/goodsSource/addGroup')}>
              <IconFont className="gc-iconfont" type="icon-xinzengqiye" /> 创建组合商品
            </span>
          )}
          {AuthVisible('GSO_4') && (
            <span className="gc-export-btn" onClick={goodsExport}>
              {exportLoading ? <LoadingOutlined /> : <IconFont className="gc-iconfont" type="icon-daochu" />} 导出
            </span>
          )}
        </>
      )}
    </div>
  );

  const MoreMenus = () => {
    const menuItems: any[] = [];
    AuthVisible('GSA_6') && menuItems.push({ key: '下载商品价格表', label: <ExportGoods queryParams={queryParams} /> });
    AuthVisible('GSA_7') && menuItems.push({ key: '批量修改商品价格', label: <UploadGoods /> });
    return isGoodsSales ? (
      <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
        <Dropdown menu={{ items: menuItems }}>
          <Button type="primary">
            功能按钮
            <DownOutlined />
          </Button>
        </Dropdown>
        <UploadCenter />
      </div>
    ) : (
      []
    );
  };
  return (
    <div className={props.goodsList ? 'gc-goodsList-pop' : ''}>
      <Card bordered={false}>
        <SearchForm ref={searchRef} initialValues={initialValues} fields={searchFields} onSearch={onSearch} rightContent={MoreMenus()} />
      </Card>

      <Card bordered={false} className="gc-mt-2">
        <Spin spinning={tableLoading}>
          <Tabs activeKey={tabsType} tabBarExtraContent={operations} onChange={goodsStatusChange}>
            <TabPane tab={`商品(${(productNum && productNum['NOT_COMBINATION_PRODUCT']) || 0})`} key="NOT_COMBINATION_PRODUCT"></TabPane>
            <TabPane tab={`组合商品(${(productNum && productNum['IS_COMBINATION_PRODUCT']) || 0})`} key="IS_COMBINATION_PRODUCT"></TabPane>

            <TabPane tab={`续费商品(${(productNum && productNum['IS_RENEW_PRODUCT']) || 0})`} key="IS_RENEW_PRODUCT"></TabPane>
          </Tabs>
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            className={tabsType == 'NOT_COMBINATION_PRODUCT' || tabsType == 'IS_RENEW_PRODUCT' ? 'gc-goods-source-single' : 'gc-goods-source-table'}
            rowKey={'id'}
            columns={columns}
            dataSource={dataSource?.records}
            onChange={onPageChange}
            scroll={{ x: 1500 }}
            pagination={{
              total: dataSource?.total,
              current: Number(dataSource?.current) || 1,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total: number) => `共 ${total} 条`,
              pageSize: dataSource?.size,
            }}
          />
        </Spin>
      </Card>
      <Modal title="上架到：" destroyOnClose visible={isUpperOpen} onOk={handleUpperOk} onCancel={() => setIsUpperOpen(false)}>
        <Checkbox.Group value={upperVal} options={optionsMap} onChange={onChangeUpper} />
        {tabsType == 'NOT_COMBINATION_PRODUCT' ? (
          <Tooltip placement="top" title={'只用于工单中途触发的购买商品'}>
            <QuestionCircleOutlined />
          </Tooltip>
        ) : (
          ''
        )}
      </Modal>
      <Modal title="推送到：" destroyOnClose visible={isPushOpen} onOk={handlePushOk} onCancel={() => setIsPushOpen(false)}>
        {pushedMainbody.length ? <Checkbox.Group options={pushedMainbody} onChange={(val: any) => setPushVal(val)} /> : '该商品已推送至所有主体！'}
      </Modal>
      <Modal title="分配归属人" destroyOnClose visible={distributionOwnerOpen} onOk={distributionOwnerOk} onCancel={() => setDistributionOwnerOpen(false)} afterClose={distributionOwnerAfterClose}>
        选择：
        <Select
          allowClear
          mode="multiple"
          labelInValue
          defaultValue={attributionItem}
          style={{ width: 420 }}
          filterOption={(input, option) => {
            return (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase());
          }}
          onChange={attributorChange}
        >
          {usersOptions?.map((option: any) => {
            return (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            );
          })}
        </Select>
      </Modal>
    </div>
  );
};

export default GoodsSourceList;

//折叠表格内容组件
const TDChildCommponent: React.FC<any> = (props) => {
  return (
    <>
      {props.record.isCombinationProduct == 'NOT_COMBINATION_PRODUCT' ? (
        <>{props.record.productSpecsDTOList.length > 1 && props.tableExpandedRowKeys.includes(props.record.productCode) && <TDChildSpec info={props.record.productSpecsDTOList} label={props.childDataIndex} />}</>
      ) : (
        ''
      )}
      {props.record.isCombinationProduct == 'IS_COMBINATION_PRODUCT' ? (
        <TDChildGoods changeGoodsVisible={props.changeGoodsVisible} info={props.record.productInfoDTOList} parentLabel={props.dataIndex} childLabel={props.childDataIndex} showHide={props.showHide} />
      ) : (
        ''
      )}
      {props.record.isCombinationProduct == 'IS_RENEW_PRODUCT' ? (
        <>{props.record.productSpecsDTOList.length > 1 && props.tableExpandedRowKeys.includes(props.record.productCode) && <TDChildSpec info={props.record.productSpecsDTOList} label={props.childDataIndex} />}</>
      ) : (
        ''
      )}
    </>
  );
};

//主商品价格
const MainGoodsPrice: React.FC<any> = (props) => {
  const [price, setPrice] = useState('');
  useEffect(() => {
    let productCombination = props.record.productCombinationSpecsDTOList;
    if (productCombination.length) {
      //有套装价格
      setPrice(productCombination[0][props.dataIndex]);
    } else {
      //没有套装价格显示区间价格
      let specsList = props.record.productSpecsDTOList;
      if (props.record.isCombinationProduct == 'IS_COMBINATION_PRODUCT') {
        specsList = [];
        props.record.productInfoDTOList.forEach((element: any) => {
          specsList.push(...element.productSpecsDTOList);
        });
      }
      let handleSpecsList: any = uniqBy(specsList, props.dataIndex);
      if (handleSpecsList.length > 1) {
        let handleSort = sortBy(handleSpecsList, [props.dataIndex]);
        setPrice(`${handleSort[0][props.dataIndex]} ~ ${handleSort[handleSort.length - 1][props.dataIndex]}`);
      } else {
        setPrice(handleSpecsList.length ? handleSpecsList[0][props.dataIndex] : '--');
      }
    }
  }, [props.record]);
  return (
    <div className="gb-line-clamp1 gc-td-main">
      {price}
      {props.dataIndex == 'grossProfitMargin' && price != '--' ? '%' : ''}
    </div>
  );
};

//规格
const TDChildSpec: React.FC<any> = (props) => {
  return (
    <div className="gc-td-child">
      {props.info.map((item: string, index: number) => (
        <p className="gb-line-clamp1" key={index}>
          {props.label == 'specsName' ? (
            <Tooltip title={item[props.label]} placement="topLeft">
              {item[props.label]}
            </Tooltip>
          ) : (
            item[props.label]
          )}
          {props.label == 'grossProfitMargin' ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

//组合商品
const TDChildGoods: React.FC<any> = (props) => {
  return (
    <div className="gc-td-child gc-goods-group-title">
      {props.info.map((item: any, key: number) => (
        <dl key={key}>
          {props.parentLabel ? (
            <dt className="gb-line-clamp1">
              <Tooltip title={item[props.parentLabel]} placement="topLeft">
                {item[props.parentLabel] || '--'}
              </Tooltip>
            </dt>
          ) : (
            <dt className={props.childLabel == 'productCode' ? 'gc-productCode' : ''}></dt>
          )}
          {item.visible ? (
            <>
              {item.productSpecsDTOList.map((item2: string, key2: number) => (
                <dd className="gb-line-clamp1" key={key2}>
                  <>
                    {props.childLabel == 'specsName' ? (
                      <Tooltip title={item2[props.childLabel]} placement="topLeft">
                        {item2[props.childLabel]}
                      </Tooltip>
                    ) : (
                      item2[props.childLabel]
                    )}
                  </>
                  {props.childLabel == 'grossProfitMargin' ? '%' : ''}
                </dd>
              ))}
            </>
          ) : (
            ''
          )}
          {props.changeGoodsVisible ? (
            <div className="gc-goods-child-visible" onClick={() => props.changeGoodsVisible(item.id)}>
              {item.visible ? (
                <>
                  <CaretUpOutlined />
                  收起
                </>
              ) : (
                <>
                  <CaretDownOutlined />
                  查看全部
                </>
              )}
            </div>
          ) : (
            ''
          )}
        </dl>
      ))}
    </div>
  );
};
