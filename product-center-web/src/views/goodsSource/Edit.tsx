import React, { useEffect, useState } from 'react';
import { Affix, Button, Card, Checkbox, Col, Form, Input, message, Row, Select, Switch } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import {
  getProductAttribute,
  productCategoryGetPage,
  productInfoClientSave,
  productInfoDetail,
  productInfoSave,
  productInfoStateList,
} from '@/api/goodsSource';
import ServiceContent from './components/ServiceContent';
import GoodsSpec from './components/GoodsSpec';
import PackagePrice from './components/PackagePrice';
import { useSelector } from 'react-redux';
import UploadComponent from '@/components/UploadComponent';
import Breadcrumb from '@/components/Breadcrumb';
import GoodsSpecPackage from './components/GoodsSpecPackage';
import { cloneDeep, sortBy, uniq } from 'lodash';
import { AttributeHandleVo, ProductCategoryVo, ProvinceListInfo } from '@/vo/goodsSourceVo';
import '@/styles/goodsSource.scss';

const GoodsEdit: React.FC = () => {
  const { id } = useParams<any>();
  const [form] = Form.useForm();
  const specPackageRef = React.useRef();
  const specRef = React.useRef();
  const history = useHistory<{ id?: string; caChe?: boolean }>();
  const locationPathname: any = history.location.pathname;
  const isGoodsSales = locationPathname.includes('goodsSales');
  const isGoodsEdit = locationPathname.includes('edit');
  const backUrl = isGoodsSales ? '/qkgoods/goodsSales/index' : '/qkgoods/goodsSource/index';
  const titleTxt = isGoodsEdit ? '编辑' : '创建';
  const countryList = useSelector((state: any) => state.global.countryAll);
  const [provinceList, setProvinceList] = useState<ProvinceListInfo[]>([]);
  const [categoryOption, setCategoryOption] = useState<ProductCategoryVo[]>([]);
  const [categoryOptionChild, setCategoryOptionChild] = useState<ProductCategoryVo[]>([]);
  const [step, setStep] = useState<number>(1);
  const [isPackagPrice, setIsPackagPrice] = useState(false);
  const isCombination = history.location.pathname.includes('Group');
  const [isPush, setIsPush] = useState(false);
  const [selector, setSelector] = useState('SIMPLE_SELECT');
  const [packagePriceDis, setPackagePriceDis] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<string>('');
  const [displayMethod, setDisplayMethod] = useState(false);
  const [supportRenewSwitch, setSupportRenewSwitch] = useState<boolean>(false);
  const onFinish = (values: any) => {
    let valuesHandle = cloneDeep(values);
    let specsVOListHD = values.specsVOList?.map((item: any) => {
      //   if (isGoodsSales)
      item.isRequired = item.isRequired ? 'IS_REQUIRED' : 'NOT_REQUIRED';
      return item;
    });
    valuesHandle.specsVOList = specsVOListHD;
    if (values.serviceContext) valuesHandle.serviceContext = values.serviceContext.join(',');
    valuesHandle.displayMethod = valuesHandle.displayMethod ? 'ATTR' : 'SPEC';
    console.log(values);
    if (values.productImagePc && values.productImagePc.length) {
      valuesHandle.productImagePc = values.productImagePc.join(',');
      if (!values.productDetailsPc || !values.productDetailsPc.length)
        return message.warning('PC端商品主图和详情图片必须上传');
    } else {
      valuesHandle.productImagePc = '';
    }
    if (values.productDetailsPc && values.productDetailsPc.length) {
      valuesHandle.productDetailsPc = values.productDetailsPc.join(',');
      console.log(123, values.productImagePc);
      if (!values.productImagePc || !values.productImagePc.length)
        return message.warning('PC端商品主图和详情图片必须上传');
    } else {
      valuesHandle.productDetailsPc = '';
    }
    if (values.productImageH5 && values.productImageH5.length) {
      valuesHandle.productImageH5 = values.productImageH5.join(',');
      if (!values.productDetailsH5 || !values.productDetailsH5.length)
        return message.warning('H5端商品主图和详情图片必须上传');
    } else {
      valuesHandle.productImageH5 = '';
    }
    if (valuesHandle.productDetailsH5 && values.productDetailsH5.length) {
      valuesHandle.productDetailsH5 = values.productDetailsH5.join(',');
      if (!values.productImageH5 || !values.productImageH5.length)
        return message.warning('H5端商品主图和详情图片必须上传');
    } else {
      valuesHandle.productDetailsH5 = '';
    }
    if (values.productImageMarketing) {
      valuesHandle.productImageMarketing = values.productImageMarketing.join(',');
    }
    valuesHandle.isCombinationProduct = 'NOT_COMBINATION_PRODUCT';

    if (isCombination) {
      valuesHandle.isCombinationProduct = 'IS_COMBINATION_PRODUCT';
      // @ts-ignore
      valuesHandle.selector = specPackageRef.current.optionValue;
      // @ts-ignore
      valuesHandle.currency = specPackageRef.current.currency;
      // @ts-ignore
      let productsHandle = cloneDeep(specPackageRef.current.goodsList);
      productsHandle = productsHandle.map((item: any) => {
        let specsVOListHD = values[item.productCode].map((list: any) => {
          //   if (isGoodsSales)
          list.isRequired = list.isRequired ? 'IS_REQUIRED' : 'NOT_REQUIRED';
          return list;
        });
        item.specsVOList = specsVOListHD;
        delete valuesHandle[item.productCode];
        return item;
      });
      valuesHandle.products = [...productsHandle];
      valuesHandle.productInfoAttributeRelationVOList = [];
    } else {
      // @ts-ignore
      let productsHandle = cloneDeep(specRef.current.goodsList);
      let specsVOListAll: any = [];
      let productInfoAttributeRelationVOList: any = [];
      let specsVOListHDVerification = false;
      productsHandle.forEach((item: any) => {
        let specsVOListHD = values[item.productCode].map((list: any) => {
          //   if (isGoodsSales)
          list.isRequired = list.isRequired ? 'IS_REQUIRED' : 'NOT_REQUIRED';
          return list;
        });
        if (!specsVOListHD.length) {
          specsVOListHDVerification = true;
        }
        specsVOListAll.push(...specsVOListHD);
        item.records.forEach((record: any, index: number) => {
          let attrHD = record.defaultValue.map((val: string) => {
            return {
              attributeTypeId: record.attributeTypeId ? record.attributeTypeId : record.id,
              productAttributeId: val,
              sort: index + 1,
            };
          });
          productInfoAttributeRelationVOList.push(...attrHD);
        });
      });
      if (specsVOListHDVerification) {
        return message.warning('商品规格数据不完整，请检查');
      }
      valuesHandle.specsVOList = specsVOListAll;
      valuesHandle.productInfoAttributeRelationVOList = productInfoAttributeRelationVOList;
      // @ts-ignore
      valuesHandle.selector = specRef.current.optionValue;
      // @ts-ignore
      valuesHandle.currency = specRef.current.currency;

      //有续费规格且打开了续费商品开关
      if (supportRenewSwitch && valuesHandle.isRenewProduct) {
        valuesHandle.isRenewProduct = 'IS_RENEW_PRODUCT'; //是续费商品
      } else {
        valuesHandle.isRenewProduct = 'NOT_RENEW_PRODUCT'; //不是续费商品
      }
    }
    //编辑传id
    if (id) {
      valuesHandle.id = id;
    }
    if (isGoodsSales) {
      valuesHandle.enterpriseId = localStorage.enterpriseId || 29;
      productInfoClientSave(valuesHandle)
        .then((res) => {
          let { code, message: responseMsg } = res;
          if (code == 0) {
            message.success('操作成功！');
            history.push({ pathname: backUrl, state: { caChe: true } });
          } else {
            message.error(responseMsg);
          }
        })
        .catch((err) => {
          message.error(err.msg);
        });
    } else {
      valuesHandle.isPush = values.isPush ? 'IS_PUSH' : 'NOT_PUSH';
      productInfoSave(valuesHandle)
        .then((res) => {
          let { code, message: responseMsg } = res;
          if (code == 0) {
            message.success('操作成功！');
            history.push({ pathname: backUrl, state: { caChe: true } });
          } else {
            message.error(responseMsg);
          }
        })
        .catch((err) => {
          message.error(err.msg);
        });
    }
  };
  //选择分类
  const categoryChange = (val: string) => {
    categoryOption.filter((item: ProductCategoryVo) => {
      if (item.id == val) {
        //@ts-ignore
        specRef.current?.setCategoryValue([]);
        //@ts-ignore
        specRef.current?.setGoodsList([]);
        //@ts-ignore
        specRef.current?.setgoodsFromList({});
        setCategoryOptionChild(item.childrenProductCategory);
      }
    });
  };
  //选择国家
  const countryChange = (val: string) => {
    setCurrentCountry(val);
    if (val == 'US') {
      productInfoStateList(val).then((res) => {
        setProvinceList(res.data);
      });
    }
  };
  //下一步
  const stepChange = (num: number) => {
    if (num == 2) {
      if (isCombination) {
        //@ts-ignore
        if (!specPackageRef.current.goodsList.length) return message.warning('请添加商品！');
      } else {
        //@ts-ignore
        if (specRef.current.goodsList.length) {
          let specsFlag = false;
          let isSupportRenewLen = 0;
          //@ts-ignore
          specRef.current.goodsList.forEach((ele) => {
            if (!ele.productSpecsDTOList.length) {
              specsFlag = true;
            }
            ele.productSpecsDTOList.forEach((spec: any) => {
              if (spec.isSupportRenew == 'IS_SUPPORT_RENEW') {
                isSupportRenewLen += 1;
              }
            });
          });
          if (specsFlag) return message.warning('请添加商品规格！');
          // 新增商品， 商品分类，选择的是否是合规认证分类， 如果是，商品支持续费价设置的规格只能保留一个的限制去除
          // 编辑商品，商品加载的商品分类是合规认证，也去掉限制/2023.4.11改为不限制续费规格个数
          // if (!isHgCateBool && isSupportRenewLen > 1) {
          //   return message.warning('商品支持续费价设置的规格只能保留一个！');
          // }
        } else {
          return message.warning('请添加商品规格！');
        }
      }
      form.validateFields().then((values) => {
        if(values.isRenewProduct){
          //@ts-ignore
          let refGoodsList = specRef.current.goodsList
          let returnFlag = false
          if (refGoodsList.length) {
            returnFlag = true
            refGoodsList.forEach((ele:any) => {
              values[ele.productCode]?.forEach((spec: any) => {
                if (spec.isSupportRenew === 'IS_SUPPORT_RENEW' && spec.renewPrice > 0) {
                  returnFlag = false
                }
              });
            });
          }
          if(returnFlag){
            return message.warning('续费商品价格不能为0！');
          }
        }

        setStep(num)
      })
    } else {
      setStep(num);
    }
  };
  //是否设置套装价格
  const PackagPriceChange = (e: any) => {
    setIsPackagPrice(e.target.checked);
  };
  //是否属性展示
  const displayMethodChange = (e: any) => {
    setDisplayMethod(e);
  };
  //是否是续费商品
  const supportRenewSwitchChange = (val: boolean) => {
    setSupportRenewSwitch(val);
  };
  useEffect(() => {
    productCategoryGetPage({ current: 1, size: 100, status: 'ENABLE' }).then((resCategory) => {
      setCategoryOption(resCategory.data.records);
      if (id) {
        productInfoDetail(id).then((res) => {
          let {
            productName,
            countryCode,
            productCategoryId,
            serviceContext,
            productSpecsDTOList,
            productCombinationSpecsDTOList,
            productDetailsH5,
            productDetailsPc,
            productImageH5,
            productImagePc,
            productImageMarketing,
            isPush,
            productInfoDTOList,
            selector,
            provinceCode,
            currency,
            productInfoAttributeRelationDTOList,
            displayMethod,
            purchaseInstructions,
            isRenewProduct,
          } = res.data;
          let isPushHandle = isPush == 'IS_PUSH' ? true : false;
          setIsPush(isPushHandle);
          setSelector(selector);
          let productSpecsDTOListHD = productSpecsDTOList.map((item) => {
            item.isRequired = item.isRequired == 'IS_REQUIRED' || item.isRequired == 'true' ? true : false;
            if (item.isSupportRenew === 'IS_SUPPORT_RENEW') {
              setSupportRenewSwitch(true);
            }
            return item;
          });
          countryChange(countryCode);
          form.setFieldsValue({
            productName,
            countryCode,
            provinceCode,
            productCategoryId,
            serviceContext: serviceContext && serviceContext.split(','),
            purchaseInstructions,
            specsVOList: productSpecsDTOListHD,
            productDetailsH5: productDetailsH5 ? [productDetailsH5] : [],
            productDetailsPc: productDetailsPc ? [productDetailsPc] : [],
            productImageH5: productImageH5 ? [productImageH5] : [],
            productImagePc: productImagePc ? [productImagePc] : [],
            productImageMarketing: productImageMarketing ? [productImageMarketing] : [],
            isPush: false,
            displayMethod: displayMethod == 'ATTR' ? true : false,
            isRenewProduct: isRenewProduct === 'IS_RENEW_PRODUCT' ? true : false,
          });
          setDisplayMethod(displayMethod == 'ATTR' ? true : false);
          //子分类-规格弹窗下拉
          resCategory.data.records.filter((item: ProductCategoryVo) => {
            if (item.id == productCategoryId) {
              setCategoryOptionChild(item.childrenProductCategory);
            }
          });
          //套装价
          if (productCombinationSpecsDTOList.length) {
            let discount = (
              (productCombinationSpecsDTOList[0].servicePrice / productCombinationSpecsDTOList[0].originalPrice) *
              100
            ).toFixed(2);
            form.setFieldsValue({
              isPackagPrice: true,
              combinationSpecsVOList: [{ ...productCombinationSpecsDTOList[0], discount }],
            });
            setIsPackagPrice(true);
          }
          //  else if (isGoodsSales) {
          //     //销售商品如果没有套装价不可以编辑
          //     setPackagePriceDis(true)
          // }
          //组合商品
          if (productInfoDTOList.length) {
            let productInfoDTOListHD = productInfoDTOList.map((item) => {
              item.productSpecsDTOList = item.productSpecsDTOList.map((itemSub) => {
                itemSub.isRequired = itemSub.isRequired == 'IS_REQUIRED' || itemSub.isRequired == 'true' ? true : false;
                return itemSub;
              });
              return item;
            });
            console.log(productInfoDTOList, productInfoDTOListHD, 'productInfoDTOList');
            //@ts-ignore
            specPackageRef.current.addGoods(productInfoDTOListHD);
            //@ts-ignore
            specPackageRef.current.setCurrency(currency || '￥');
          } else {
            if (!productInfoAttributeRelationDTOList.length) return false;
            getProductAttribute({
              productCategoryList: productInfoAttributeRelationDTOList.map((i) => i.subProductCategoryId),
            }).then((res) => {
              let attributeHandle: any = [];
              res.data.forEach((item) => {
                item.defaultValue = [];
                item.productAttributeList.forEach((attr) => {
                  productInfoAttributeRelationDTOList.forEach((attrCurr) => {
                    if (attrCurr.productAttributeId == attr.id) {
                      item.defaultValue.push(attr.id);
                      item.sort = Number(attrCurr.sort);
                    }
                  });
                });
                item.productAttributeList.forEach((attrSub) => {
                  attrSub.value = attrSub.id;
                  attrSub.label = attrSub.attributeName;
                });
                if (attributeHandle.length) {
                  let isAdd = true;
                  attributeHandle.forEach((attr: any) => {
                    if (attr.productCode == item.productCategoryId) {
                      attr.records.push(item);
                      isAdd = false;
                    }
                  });
                  if (isAdd) {
                    attributeHandle.push({
                      productCode: item.productCategoryId,
                      productCategory: `${item.productCategoryName}/${item.subProductCategoryName}`,
                      records: [item],
                      productSpecsDTOList: productSpecsDTOListHD.filter(
                        (specs) => specs.productCategoryId == item.productCategoryId
                      ),
                    });
                  }
                } else {
                  attributeHandle.push({
                    productCode: item.productCategoryId,
                    productCategory: `${item.productCategoryName}/${item.subProductCategoryName}`,
                    records: [item],
                    productSpecsDTOList: productSpecsDTOListHD.filter(
                      (specs) => specs.productCategoryId == item.productCategoryId
                    ),
                  });
                }
              });
              attributeHandle.forEach((ele: any) => {
                ele.records = sortBy(ele.records, function (item) {
                  return item.sort;
                });
              });
              console.log(attributeHandle);
              //@ts-ignore
              specRef.current.setCurrency(currency || '￥');
              //@ts-ignore
              specRef.current?.setCategoryValue(uniq(productSpecsDTOList.map((item) => item.productCategoryId)));
              //@ts-ignore
              specRef.current.addGoods(attributeHandle);
            });
          }
        });
      }
    });
  }, [id]);
  return (
    <>
      <Breadcrumb pathname={backUrl} title={titleTxt + (isCombination ? '组合商品' : '商品')} />
      <Form
        form={form}
        name="basic"
        labelCol={{ style: { width: '110px' } }}
        initialValues={{
          isPackagPrice: false,
          isPush: false,
          combinationSpecsVOList: [
            {
              servicePrice: '',
              discount: '',
              originalPrice: '-',
              grossProfitMargin: '',
              minimumPrice: '',
              priceRangeMin: '',
              priceRangeMax: '',
            },
          ],
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className={step == 1 ? '' : 'gc-dn'}>
          <Card title="基础信息" bordered={false} className="gc-mb-2">
            <Form.Item
              label="商品名称"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
              name="productName"
            >
              <Input placeholder="请输入商品名称" />
            </Form.Item>
            {!isCombination && (
              <>
                <Form.Item
                  label="国家"
                  rules={[
                    {
                      required: true,
                      message: '必填',
                    },
                  ]}
                  name="countryCode"
                >
                  <Select
                    onChange={countryChange}
                    disabled={isPush || isGoodsSales}
                    placeholder="请选择"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {countryList?.map((item: any) => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {currentCountry == 'US' && (
                  <Form.Item label="州（非必选）" name="provinceCode">
                    <Select
                      disabled={isPush || isGoodsSales}
                      placeholder="请选择"
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        return (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase());
                      }}
                    >
                      {provinceList?.map((item: any) => (
                        <Select.Option key={item.code} value={item.code}>
                          {item.nameEN + item.nameCN + '(' + item.code + ')'}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </>
            )}
            <Form.Item
              label="商品分类"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
              name="productCategoryId"
            >
              <Select
                disabled={isPush || isGoodsSales}
                placeholder="请选择"
                onChange={(val) => categoryChange(val)}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {categoryOption?.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.categoryName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="服务内容" name="serviceContext" className="gc-service-content-tag">
              <ServiceContent />
            </Form.Item>
            <Form.Item label="购买须知" name="purchaseInstructions">
              <Input placeholder="编辑则展示不编辑则不显示" />
            </Form.Item>
            {supportRenewSwitch ? (
              <Form.Item label="是否续费商品" name="isRenewProduct" style={{ marginBottom: 0 }} valuePropName="checked">
                <Switch checkedChildren="是" unCheckedChildren="否" disabled={isPush || isGoodsSales} />
              </Form.Item>
            ) : (
              ''
            )}
          </Card>

          <Card title={'商品' + (isCombination ? '' : '规格') + '列表'} bordered={false} className="gc-mb-2">
            {isCombination ? (
              <GoodsSpecPackage ref={specPackageRef} form={form} selector={selector} />
            ) : (
              <GoodsSpec
                ref={specRef}
                form={form}
                categoryOption={categoryOption}
                categoryOptionChild={categoryOptionChild}
                isPackagPrice={isPackagPrice}
                selector={selector}
                displayMethodChange={displayMethodChange}
                displayMethod={displayMethod}
                supportRenewSwitchChange={supportRenewSwitchChange}
              />
            )}
          </Card>
          {/* {!displayMethod && <Card title='套装价格设置' bordered={false} className='gc-mb-2'>
                    <Form.Item
                        name="isPackagPrice"
                        valuePropName="checked"
                        extra={<span className="gc-color-f7ab14">* 设置后购买端购买时将出现一口价购买整个套行商品的选项</span>}
                    ><Checkbox disabled={packagePriceDis} onChange={(e) => PackagPriceChange(e)}>是否设置套装价格</Checkbox>
                    </Form.Item>
                    {isPackagPrice && <PackagePrice form={form} />}
                </Card>} */}
        </div>
        <div className={step == 2 ? '' : 'gc-dn'}>
          <Card title="图片设置" bordered={false} className="gc-mb-2">
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
                <p className="gc-mb-2">PC端:</p>
                <Form.Item
                  label="商品图片"
                  name="productImagePc"
                  rules={[
                    {
                      // required: step == 2 ? true : false,
                      required: false,
                      message: '必填',
                    },
                  ]}
                >
                  <UploadComponent btnTxt="上传图片" length={1} />
                </Form.Item>
                <Form.Item
                  label="服务详情"
                  name="productDetailsPc"
                  rules={[
                    {
                      // required: step == 2 ? true : false,
                      required: false,
                      message: '必填',
                    },
                  ]}
                >
                  <UploadComponent btnTxt="上传图片" length={1} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <p className="gc-mb-2">H5端:</p>
                <Form.Item
                  label="商品图片"
                  name="productImageH5"
                  rules={[
                    {
                      // required: step == 2 ? true : false,
                      required: false,
                      message: '必填',
                    },
                  ]}
                >
                  <UploadComponent btnTxt="上传图片" length={1} />
                </Form.Item>
                <Form.Item
                  label="服务详情"
                  name="productDetailsH5"
                  rules={[
                    {
                      // required: step == 2 ? true : false,
                      required: false,
                      message: '必填',
                    },
                  ]}
                >
                  <UploadComponent btnTxt="上传图片" length={1} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={6}>
                <p className="gc-mb-2">营销活动:</p>
                <Form.Item
                  label="活动图片"
                  name="productImageMarketing"
                  rules={[
                    {
                      // required: step == 2 ? true : false,
                      required: false,
                      message: '必填',
                    },
                  ]}
                >
                  <UploadComponent btnTxt="上传图片" length={1} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          {/* {!isGoodsSales && (
            <Card bordered={false} className="gc-mb-2">
              <Form.Item
                label="立即推送"
                name="isPush"
                style={{ marginBottom: 0 }}
                valuePropName="checked"
              >
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Card>
          )} */}
        </div>
        <Affix offsetBottom={10}>
          <Card className="gc-mt-2" bordered={false}>
            {step == 1 ? (
              <Button type="primary" className="gc-mr-2" onClick={() => stepChange(2)}>
                下一步
              </Button>
            ) : (
              <>
                <Button type="primary" className="gc-mr-2" onClick={() => stepChange(1)}>
                  上一步
                </Button>
                <Button type="primary" className="gc-mr-2" htmlType="submit">
                  提交
                </Button>
              </>
            )}
            <Button onClick={() => history.push({ pathname: backUrl, state: { caChe: true } })}>取消</Button>
          </Card>
        </Affix>
      </Form>
    </>
  );
};

export default GoodsEdit;
