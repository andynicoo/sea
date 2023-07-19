import { productInfoDetail } from '@/api/goodsSource';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductDetailsVo } from '@/vo/goodsSourceVo';
import { Card, Col, Row, Table, Image, Affix, Button } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

const columnsGoods = [
  {
    title: '商品规格',
    dataIndex: 'specsName',
    key: 'specsName',
  },
  {
    title: '服务价格',
    dataIndex: 'servicePrice',
    key: 'servicePrice',
  },
];
const columnsGoodsPackage = [
  {
    title: '商品规格',
    dataIndex: 'specsName',
    key: 'specsName',
    render: () => <>套装一口价格</>,
  },
  {
    title: '服务价格',
    dataIndex: 'servicePrice',
    key: 'servicePrice',
  },
  {
    title: '折扣比例',
    dataIndex: 'originalPrice',
    key: 'originalPrice',
    render: (_: any, record: any) => <>{((record.servicePrice / record.originalPrice) * 100).toFixed(2)} %</>,
  },
];
const GoodsDetails: React.FC = () => {
  const history = useHistory<{ caChe?: boolean }>();
  const locationPathname: any = history.location.pathname;
  const isGoodsSales = locationPathname.includes('goodsSales');
  const backUrl = isGoodsSales ? '/qkgoods/goodsSales/index' : '/qkgoods/goodsSource/index';
  const { id } = useParams<any>();
  console.log(id, 'history');
  const [productDetail, setProductDetail] = useState<ProductDetailsVo>();
  const columnsBase = [
    {
      title: '原价（' + (productDetail?.currency || '￥') + '）',
      dataIndex: 'originalPrice',
      key: 'originalPrice',
    },
    {
      title: '最低价格（' + (productDetail?.currency || '￥') + '）',
      dataIndex: 'minimumPrice',
      key: 'minimumPrice',
    },
    {
      title: '目标毛利率（%）',
      dataIndex: 'grossProfitMargin',
      key: 'grossProfitMargin',
      render: (_: any, record: any) => <>{record.grossProfitMargin} %</>,
    },
    {
      title: '指导价格区间',
      dataIndex: 'priceRangeMin',
      key: 'priceRangeMin',
      render: (_: any, record: any) => (
        <>
          {record.priceRangeMin} ~ {record.priceRangeMax}
        </>
      ),
    },
  ];
  //附加规格
  const additionSpec = [
    {
      title: '续费价格（' + (productDetail?.currency || '￥') + '）',
      dataIndex: 'renewPrice',
      key: 'renewPrice',
      render: (_: any, record: any) => <>{record?.renewPrice ? record?.renewPrice : '无'}</>,
    },
    {
      title: '附加规格',
      dataIndex: 'additionSpecId',
      key: 'additionSpecId',
      render: (_: any, record: any) => <>{record.additionSpecId ? record.additionSpecDTO?.templateName : '无'}</>,
    },
    {
      title: '是否为必选',
      dataIndex: 'isRequired',
      key: 'isRequired',
      render: (_: any, record: any) => (
        <>{record.isRequired == 'IS_REQUIRED' || record.isRequired == 'true' ? '是' : '否'}</>
      ),
    },
  ];
  let columnsBaseHD = cloneDeep(columnsBase);
  useEffect(() => {
    productInfoDetail(id).then((res) => {
      setProductDetail(res.data);
      console.log(res, 'res');
    });
  }, [id]);
  return (
    <>
      <Breadcrumb pathname={backUrl} title="商品详情" />
      <Card title="基础信息" bordered={false} className="gc-mb-2">
        <ul className="gc-detail-warp">
          <li>
            <span>商品名称:</span>
            {productDetail?.productName}
          </li>
          <li>
            <span>商品ID:</span>
            {productDetail?.productCode}
          </li>
          {productDetail?.isCombinationProduct == 'NOT_COMBINATION_PRODUCT' && (
            <li>
              <span>国家:</span>
              {productDetail?.countryCodeName}
            </li>
          )}
          <li>
            <span>商品分类:</span>
            {productDetail?.productCategoryName}
          </li>
          <li>
            <span>服务内容:</span>
            {productDetail?.serviceContext}
          </li>
          <li>
            <span>购买须知:</span>
            {productDetail?.purchaseInstructions}
          </li>
          <li>
            <span>是否续费商品:</span>
            {productDetail?.isRenewProduct === 'IS_RENEW_PRODUCT' ? '是' : '否'}
          </li>
        </ul>
      </Card>
      {productDetail?.isCombinationProduct == 'NOT_COMBINATION_PRODUCT' ? (
        <Card title="商品规格列表" bordered={false} className="gc-mb-2">
          <p>
            客户端按属性选购商品：
            {productDetail?.displayMethod == 'ATTR' ? '是' : '否'}
          </p>
          <Table
            rowKey={'id'}
            dataSource={productDetail?.productSpecsDTOList}
            columns={[...columnsGoods, ...columnsBaseHD, ...additionSpec]}
            pagination={false}
          />
        </Card>
      ) : (
        <Card title="套装商品" bordered={false} className="gc-mb-2">
          {productDetail?.productInfoDTOList.map((item) => (
            <div key={item.id} className="gc-mb-6">
              <p>
                商品编码：{item.productCode} <br />
                SPU名称：{item.productName}
              </p>
              <Table
                rowKey={'id'}
                dataSource={item?.productSpecsDTOList}
                columns={[...columnsGoods, ...columnsBaseHD, ...additionSpec]}
                pagination={false}
              />
            </div>
          ))}
        </Card>
      )}
      {productDetail?.productCombinationSpecsDTOList.length ? (
        <Card title="套装价格" bordered={false} className="gc-mb-2">
          <Table
            rowKey={'id'}
            dataSource={productDetail?.productCombinationSpecsDTOList}
            columns={[...columnsGoodsPackage, ...columnsBase]}
            pagination={false}
          />
        </Card>
      ) : (
        ''
      )}
      <Card title="商品图片" bordered={false} className="gc-mb-2">
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <p className="gc-mb-2">PC端:</p>
            <div className="gc-mb-2">
              <Image.PreviewGroup>
                <Image width={120} src={productDetail?.productImagePc} />
              </Image.PreviewGroup>
            </div>
            <div>
              <Image.PreviewGroup>
                <Image width={120} src={productDetail?.productDetailsPc} />
              </Image.PreviewGroup>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <p className="gc-mb-2">H5端:</p>
            <div className="gc-mb-2">
              <Image.PreviewGroup>
                <Image width={120} src={productDetail?.productImageH5} />
              </Image.PreviewGroup>
            </div>
            <div>
              <Image.PreviewGroup>
                <Image width={120} src={productDetail?.productDetailsH5} />
              </Image.PreviewGroup>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <p className="gc-mb-2">营销活动:</p>
            <div className="gc-mb-2">
              <Image.PreviewGroup>
                <Image width={120} src={productDetail?.productImageMarketing} />
              </Image.PreviewGroup>
            </div>
            <div></div>
          </Col>
        </Row>
      </Card>
      {/* {!isGoodsSales && <Card bordered={false} className='gc-mb-2'>
            <span>立即推送：</span> {productDetail?.isPush == "IS_PUSH" ? "是" : "否"}
        </Card>} */}
      <Affix offsetBottom={10}>
        <Card className="gc-mt-2" bordered={false}>
          <Button onClick={() => history.push({ pathname: backUrl, state: { caChe: true } })}>返回</Button>
        </Card>
      </Affix>
    </>
  );
};

export default GoodsDetails;
