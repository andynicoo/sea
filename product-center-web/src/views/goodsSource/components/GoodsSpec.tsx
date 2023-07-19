import {
  getProductAttribute,
  getSpecsByAttribute,
  productAdditionSpecListSpecId,
  productBaseSpecsGetPage,
} from '@/api/goodsSource';
import { AuthVisible } from '@/utils/url';
import { IconFont } from '@/views/opportunity';
import { QueryParams } from '@/vo/baseVo';
import { AdditionSpecInfo, ProductCategoryVo, SpecsInfoVo } from '@/vo/goodsSourceVo';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Button,
  Cascader,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Switch,
  Table,
  TablePaginationConfig,
  Tabs,
} from 'antd';
import { ColumnsType, FilterValue } from 'antd/lib/table/interface';
import { cloneDeep, sum, sumBy, uniqBy } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useHistory } from 'react-router-dom';
import GoodsSourceList from '..';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import Item from 'antd/lib/list/Item';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
const { SHOW_CHILD } = Cascader;

const goodsItem: React.FC<any> = forwardRef((props, ref) => {
  const history = useHistory();
  const locationPathname: any = history.location.pathname;
  const isGoodsSales = locationPathname.includes('goodsSales/edit');
  const [goodsVisible, setGoodsVisible] = useState(false);
  const [goodsList, setGoodsList] = useState<any>([]);
  const [goodsFromList, setgoodsFromList] = useState<any>({});
  const [optionValue, setOptionValue] = useState(props.selector);
  const [additionSpecList, setAdditionSpecList] = useState<any>({});
  const [currency, setCurrency] = useState<string>('￥');
  const [categoryValue, setCategoryValue] = useState<any>([]);
  //选择币种
  const currencyChange = (val: string) => {
    setCurrency(val);
  };
  //选择项设置
  const onChangeOption = (e: any) => {
    setOptionValue(e.target.value);
    console.log(e.target.value);
  };
  useImperativeHandle(ref, () => ({
    goodsList,
    addGoods,
    optionValue,
    currency,
    setCurrency,
    setCategoryValue,
    setGoodsList,
    setgoodsFromList,
  }));
  //获取附加规格
  const getAdditionSpec = (goodsFrom: any) => {
    console.log(goodsFrom);
    let goodsFromKey = Object.keys(goodsFrom);
    let specListObj: any = {};
    goodsFromKey.forEach(async (goods) => {
      let goodsSpecId = goodsFrom[goods]?.map((item: any) => item.specsCode);
      let { data } = await productAdditionSpecListSpecId({
        specIds: goodsSpecId,
      });
      let specListHandle: any = {};
      goodsSpecId.forEach((ele: string) => {
        specListHandle[ele] = [];
        data.forEach((item: AdditionSpecInfo) => {
          if (item.specId == ele) {
            specListHandle[ele].push(item);
          }
        });
      });

      specListObj[goods] = specListHandle;
      setAdditionSpecList({ ...additionSpecList, ...specListObj });
    });
  };
  //确定添加商品
  const addGoods = (rows: any) => {
    let rowsHandle: any = [];
    let goodsFrom: any = {};
    console.log(goodsFromList, 99);
    rows.forEach((ele: any) => {
      let isAdd = true;
      goodsList.forEach((goods: any) => {
        if (ele.productCode == goods.productCode) {
          rowsHandle.push(goods);
          goodsFrom[goods.productCode] = props.form.getFieldValue(goods.productCode);
          isAdd = false;
        }
      });
      if (isAdd) {
        rowsHandle.push(ele);
        goodsFrom[ele.productCode] = [...ele.productSpecsDTOList];
      }
    });
    let rowsHandleSort: any = [];
    categoryValue.forEach((categoryId: string) => {
      rowsHandle.forEach((rows: any) => {
        if (categoryId == rows.productCode) {
          rowsHandleSort.push(rows);
        }
      });
    });
    setGoodsList(rowsHandleSort);
    setgoodsFromList({ ...goodsFrom });
    props.form.setFieldsValue({ ...goodsFrom });
    getAdditionSpec(goodsFrom);
  };

  //删除规格
  const removeSpec = (index: number, spu: string) => {
    const goodsItem = props.form.getFieldValue(spu);
    goodsItem.splice(index, 1);
    let fieldNameObj: any = {};
    fieldNameObj[spu] = [...goodsItem];
    props.form.setFieldsValue(fieldNameObj);
    delete goodsFromList[spu];
    setgoodsFromList({ ...goodsFromList, ...fieldNameObj });
    //规格删完，删除这条商品
    if (!goodsItem.length) {
      let goodsListHandle = goodsList.filter((item: any) => item.productCode != spu);
      delete goodsFromList[spu];
      setgoodsFromList({ ...goodsFromList });
      setGoodsList(goodsListHandle);
    }
  };
  //选择商品弹窗
  const changeGoodsVisible = (flag: boolean) => {
    setGoodsVisible(flag);
  };
  //表单数据变更
  const changeFieldsValue = (goodsItem: any, index: number, label: string, fieldName: string, tips: string) => {
    let fieldNameObj: any = {};
    goodsItem[index][label] = '';
    fieldNameObj[fieldName] = [...goodsItem];
    props.form.setFieldsValue(fieldNameObj);
    message.warning(tips);
  };
  //价格失去焦点
  const priceBlur = (e: any, index: any, label: string, spu: string) => {
    const goodsItem = cloneDeep(props.form.getFieldValue(spu));
    const packagePrice = cloneDeep(props.form.getFieldValue('combinationSpecsVOList'));
    let { servicePrice, originalPrice, minimumPrice, priceRangeMin, priceRangeMax } = goodsItem[index];
    let currPrice = e.target.value;
    if (label == 'servicePrice') {
      if (minimumPrice && Number(minimumPrice) > currPrice) {
        changeFieldsValue(goodsItem, index, 'servicePrice', spu, '最低售价不能大于销售价！');
      } else {
        packagePrice[0].originalPrice = sumBy(goodsItem, 'servicePrice');
        packagePrice[0].servicePrice = '';
        props.form.setFieldsValue({
          combinationSpecsVOList: [...packagePrice],
        });
      }
      delete goodsFromList[spu];
      let fieldNameObj: any = {};
      fieldNameObj[spu] = [...goodsItem];
      setgoodsFromList({ ...goodsFromList, ...fieldNameObj });
    } else if (label == 'originalPrice') {
      if (priceRangeMax && Number(priceRangeMax) > currPrice) {
        changeFieldsValue(goodsItem, index, 'originalPrice', spu, '指导价格最高价不能大于原价！');
      }
    } else if (label == 'minimumPrice') {
      if (servicePrice && Number(servicePrice) < currPrice) {
        changeFieldsValue(goodsItem, index, 'minimumPrice', spu, '最低售价不能大于销售价！');
      } else if (priceRangeMin && Number(priceRangeMin) < currPrice) {
        changeFieldsValue(goodsItem, index, 'minimumPrice', spu, '指导价格最低价需大于最低售价！');
      }
    } else if (label == 'priceRangeMin') {
      if (minimumPrice && Number(minimumPrice) > currPrice) {
        changeFieldsValue(goodsItem, index, 'priceRangeMin', spu, '指导价格最低价需大于最低售价！');
      } else if (priceRangeMax && Number(priceRangeMax) < currPrice) {
        changeFieldsValue(goodsItem, index, 'priceRangeMin', spu, '指导价格最高价不能小于最低价！');
      }
    } else if (label == 'priceRangeMax') {
      if (priceRangeMin && Number(priceRangeMin) > currPrice) {
        changeFieldsValue(goodsItem, index, 'priceRangeMax', spu, '指导价格最高价不能小于最低价！');
      } else if (originalPrice && Number(originalPrice) < currPrice) {
        changeFieldsValue(goodsItem, index, 'priceRangeMax', spu, '指导价格最高价不能大于原价！');
      }
    }
  };
  //选择子分类
  const onChangeCategory = (val: any) => {
    console.log(val);
    setCategoryValue(val);
  };
  //显示规格选择弹窗
  const addSpecShow = () => {
    if (props.categoryOptionChild.length) {
      setGoodsVisible(true);
    } else {
      message.warning('请先选择商品分类！');
    }
  };
  //新增规格
  const addSpec = async () => {
    if (categoryValue.length) {
      // console.log(categoryValue)
      // let categorySubid = categoryValue.map((item: any) => item[1])
      let attrRes = await getProductAttribute({
        productCategoryList: categoryValue,
      });
      let attributeHandle: any = [];
      let attributeIds: any = [];
      attrRes.data.forEach((item) => {
        attributeIds.push(...item.productAttributeList.map((ele) => ele.id));
        item.defaultValue = item.productAttributeList.map((ele) => ele.id);
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
              productSpecsDTOList: [],
            });
          }
        } else {
          attributeHandle.push({
            productCode: item.productCategoryId,
            productCategory: `${item.productCategoryName}/${item.subProductCategoryName}`,
            records: [item],
            productSpecsDTOList: [],
          });
        }
      });

      let specsRes = await getSpecsByAttribute({
        productAttributeIdList: attributeIds,
      });
      props.supportRenewSwitchChange(false);
      specsRes.data.forEach((specs) => {
        if (specs.isSupportRenew === 'IS_SUPPORT_RENEW') {
          props.supportRenewSwitchChange(true);
        }
        attributeHandle.forEach((attr: any) => {
          if (specs.productCategoryId == attr.productCode) {
            attr.productSpecsDTOList.push({
              ...specs,
              servicePrice: 0,
              originalPrice: 0,
              grossProfitMargin: 0,
              minimumPrice: 0,
              priceRangeMax: 0,
              priceRangeMin: 0,
              renewPrice: 0,
              check: false,
            });
          }
        });
      });
      console.log(attributeHandle, 999);
      addGoods(attributeHandle);
      setGoodsVisible(false);
    } else {
      message.warning('请选择子分类！');
    }
  };
  //改变属性
  const onChangeAttr = async (val: CheckboxValueType[], productCode: string, record: any) => {
    let goodsListHandle = cloneDeep(goodsList);
    let attributeIds: any = [];
    let attributeVerification = false;
    goodsListHandle.forEach((ele: any) => {
      if (ele.productCode == productCode) {
        ele.records.forEach((eleSub: any) => {
          if (eleSub.id == record.id) {
            eleSub.defaultValue = val;
          }
          if (!eleSub.defaultValue.length) {
            attributeVerification = true;
          }
          attributeIds.push(...eleSub.defaultValue);
        });
      }
    });
    let specsRes = await getSpecsByAttribute({
      productAttributeIdList: attributeIds,
    });
    if (attributeVerification) {
      specsRes.data = [];
      message.warning('每组属性必须至少选择一个！');
    }
    goodsListHandle.forEach((ele: any) => {
      if (ele.productCode == productCode) {
        ele.productSpecsDTOList = specsRes.data;
      }
    });
    setGoodsList(goodsListHandle);
    let goodsItemHandle: any = [];
    const goodsItem = props.form.getFieldValue(productCode);
    props.supportRenewSwitchChange(false);
    specsRes.data.forEach((specs) => {
      if (specs.isSupportRenew === 'IS_SUPPORT_RENEW') {
        props.supportRenewSwitchChange(true);
      }
      let isAdd = true;
      goodsItem.forEach((goods: any) => {
        if (specs.specsCode == goods.specsCode) {
          goodsItemHandle.push(goods);
          isAdd = false;
        }
      });
      if (isAdd) {
        goodsItemHandle.push({
          ...specs,
          servicePrice: 0,
          originalPrice: 0,
          grossProfitMargin: 0,
          minimumPrice: 0,
          priceRangeMax: 0,
          priceRangeMin: 0,
          renewPrice: 0,
          check: false,
        });
      }
    });
    let fieldNameObj: any = {};
    fieldNameObj[productCode] = [...goodsItemHandle];
    props.form.setFieldsValue(fieldNameObj);
    delete goodsFromList[productCode];
    setgoodsFromList({ ...goodsFromList, ...fieldNameObj });
  };
  //属性排序
  const attrSortUpDown = (goods: any, index: number, type: string) => {
    let goodsHandle = cloneDeep(goods);
    let goodsListHandle = cloneDeep(goodsList);
    let currItem = goodsHandle.records.splice(index, 1)[0];
    let indexHandle = type == 'up' ? index - 1 : index + 1;
    goodsHandle.records.splice(indexHandle, 0, currItem);
    goodsListHandle.forEach((ele: any) => {
      if (ele.productCode == goodsHandle.productCode) {
        ele.records = goodsHandle.records;
        console.log(ele);
      }
    });
    setGoodsList(goodsListHandle);
  };
  //是否属性展示
  const displayMethodChange = (e: any) => {
    console.log(e.target.checked);
    props.displayMethodChange(e.target.checked);
    if (e.target.checked) {
      setOptionValue('SIMPLE_SELECT');
    }
  };
  //删除分类
  const closeOutlined = (goodsCode: string) => {
    let goodsFromListHD = cloneDeep(goodsFromList);
    let goodsListHD = cloneDeep(goodsList);
    let categoryValueHD = cloneDeep(categoryValue);
    goodsListHD = goodsListHD.filter((goods: any) => goods.productCode != goodsCode);
    categoryValueHD = categoryValueHD.filter((code: string) => code != goodsCode);
    setCategoryValue(categoryValueHD);
    setGoodsList(goodsListHD);
    delete goodsFromListHD[goodsCode];
    setgoodsFromList(goodsFromListHD);
  };
  useEffect(() => {
    setOptionValue(props.selector);
  }, [props.selector]);
  useEffect(() => {
    let goodsFromKeys = Object.keys(goodsFromList);
    let servicePriceArr = goodsFromKeys.map((item) => {
      return sumBy(goodsFromList[item], 'servicePrice');
    });

    const packagePrice = cloneDeep(props.form.getFieldValue('combinationSpecsVOList'));
    packagePrice[0].originalPrice = sum(servicePriceArr);
    if (packagePrice[0].discount) {
      packagePrice[0].servicePrice = ((packagePrice[0].originalPrice * packagePrice[0].discount) / 100).toFixed(2);
    }
    props.form.setFieldsValue({ combinationSpecsVOList: [...packagePrice] });
  }, [goodsFromList]);
  return (
    <>
      <dl className="gc-option-settings">
        <dt>选项设置</dt>
        <dd>
          <Form.Item name="displayMethod" valuePropName="checked">
            <Checkbox disabled={isGoodsSales} onChange={displayMethodChange}>
              客户端按属性选购商品(全局)
            </Checkbox>
          </Form.Item>
        </dd>
        {!props.displayMethod && (
          <dd>
            <Radio.Group onChange={onChangeOption} value={optionValue}>
              <Radio value={'SIMPLE_SELECT'}>单选</Radio>
              <Radio value={'MULTI_SELECT'}>多选</Radio>
            </Radio.Group>
          </dd>
        )}
        {isGoodsSales && (
          <dd>
            币别：
            <Select value={currency} style={{ width: 120 }} onChange={currencyChange}>
              <Select.Option value="€">欧元</Select.Option>
              <Select.Option value="£">镑</Select.Option>
              <Select.Option value="￥">人民币</Select.Option>
              <Select.Option value="$">美元</Select.Option>
            </Select>
          </dd>
        )}
      </dl>
      {goodsList.map((goods: any) => (
        <div key={goods.productCode} className="gc-goods-spec-warp">
          {!isGoodsSales && (
            <span className="closeOutlined-btn" onClick={() => closeOutlined(goods.productCode)}>
              ✕
            </span>
          )}
          <h3>{goods.productCategory}</h3>
          {goods.records.map((record: any, index: number) => {
            return (
              <div key={record.id}>
                <h4 className="gc-goods-attr-tit">
                  属性名称{index + 1}：{record.attributeTypeName}
                  {goods.records.length > 1 && (
                    <span className="gc-attr-sort">
                      排序: {index > 0 && <ArrowUpOutlined onClick={() => attrSortUpDown(goods, index, 'up')} />}{' '}
                      {index < goods.records.length - 1 && (
                        <ArrowDownOutlined onClick={() => attrSortUpDown(goods, index, 'down')} />
                      )}
                    </span>
                  )}
                </h4>
                <br />
                <Checkbox.Group
                  disabled={isGoodsSales}
                  className="gc-goods-attr-group"
                  options={record.productAttributeList}
                  defaultValue={record.defaultValue}
                  onChange={(val) => onChangeAttr(val, goods.productCode, record)}
                />
              </div>
            );
          })}
          <dl className="gc-goods-spec">
            <dt>
              {/* <div className='gc-spec-checkbox'><Checkbox></Checkbox></div> */}
              <div>商品规格</div>
              <div>服务价格</div>
              <div>原价（{currency}）</div>
              <div>最低价格（{currency}）</div>
              <div>目标毛利率（%）</div>
              <div className="gc-spec-price-range">指导价格区间</div>
              {props.displayMethod ? '' : <div>是否为必选</div>}
              <div>续费价格设置</div>
              {props.displayMethod ? '' : <div>附加规格</div>}
              {/* {!isGoodsSales && <div className='gc-spec-handle'>操作</div>} */}
            </dt>

            <Form.List name={goods.productCode}>
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <dd key={key}>
                      {/* <div className='gc-spec-checkbox'>
                                <Checkbox></Checkbox>
                            </div> */}
                      <div>
                        <Form.Item {...restField} name={[name, 'specsName']}>
                          <Input.TextArea className="gc-bordered-false" bordered={false} autoSize readOnly />
                        </Form.Item>
                      </div>
                      <div>
                        <Form.Item
                          {...restField}
                          name={[name, 'servicePrice']}
                          rules={[
                            {
                              required: true,
                              message: '必填',
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            onBlur={(e) => priceBlur(e, name, 'servicePrice', goods.productCode)}
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <Form.Item
                          {...restField}
                          name={[name, 'originalPrice']}
                          rules={[
                            {
                              required: true,
                              message: '必填',
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            onBlur={(e) => priceBlur(e, name, 'originalPrice', goods.productCode)}
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <Form.Item
                          {...restField}
                          name={[name, 'minimumPrice']}
                          rules={[
                            {
                              required: false,
                              message: '必填',
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            onBlur={(e) => priceBlur(e, name, 'minimumPrice', goods.productCode)}
                          />
                        </Form.Item>
                      </div>
                      <div>
                        <Form.Item
                          {...restField}
                          name={[name, 'grossProfitMargin']}
                          rules={[
                            {
                              required: false,
                              message: '必填',
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            max={100}
                            precision={2}
                            formatter={(value) => `${value}%`}
                            parser={(value: any) => value!.replace('%', '')}
                          />
                        </Form.Item>
                      </div>
                      <div className="gc-spec-price-range">
                        <Form.Item
                          {...restField}
                          name={[name, 'priceRangeMin']}
                          rules={[
                            {
                              required: false,
                              message: '必填',
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            onBlur={(e) => priceBlur(e, name, 'priceRangeMin', goods.productCode)}
                          />
                        </Form.Item>
                        <span className="gc-connecting-line">~</span>
                        <Form.Item
                          {...restField}
                          name={[name, 'priceRangeMax']}
                          rules={[
                            {
                              required: false,
                              message: '必填',
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            onBlur={(e) => priceBlur(e, name, 'priceRangeMax', goods.productCode)}
                          />
                        </Form.Item>
                      </div>
                      {props.displayMethod ? (
                        ''
                      ) : (
                        <div>
                          <Form.Item {...restField} name={[name, 'isRequired']} valuePropName="checked">
                            <Switch />
                          </Form.Item>
                        </div>
                      )}
                      <div>
                        {props.form.getFieldValue(goods.productCode)[name].isSupportRenew == 'IS_SUPPORT_RENEW' ? (
                          <Form.Item
                            {...restField}
                            name={[name, 'renewPrice']}
                            rules={[
                              {
                                required: false,
                                message: '必填',
                              },
                            ]}
                          >
                            <InputNumber min={0} precision={2} />
                          </Form.Item>
                        ) : (
                          <div className="addition-spec-none">不支持</div>
                        )}
                      </div>
                      {props.displayMethod ? (
                        ''
                      ) : (
                        <div>
                          {additionSpecList[goods.productCode] &&
                          additionSpecList[goods.productCode][
                            props.form.getFieldValue(goods.productCode)[name].specsCode
                          ]?.length ? (
                            <Form.Item {...restField} name={[name, 'additionSpecId']}>
                              <Select
                                disabled={isGoodsSales}
                                allowClear
                                bordered={false}
                                placeholder="选择附加规格模板"
                                style={{ width: '125px' }}
                              >
                                {additionSpecList[goods.productCode][
                                  props.form.getFieldValue(goods.productCode)[name].specsCode
                                ]?.map((item: any) => (
                                  <Select.Option key={item.id} value={item.id}>
                                    {item.templateName}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          ) : (
                            <div className="addition-spec-none">不支持</div>
                          )}
                        </div>
                      )}
                      {/* {!isGoodsSales && <div className='gc-spec-handle'>
                                            <a onClick={() => removeSpec(name, goods.productCode)}>删除</a>
                                        </div>} */}
                    </dd>
                  ))}
                </>
              )}
            </Form.List>
          </dl>
        </div>
      ))}
      {!isGoodsSales && (
        <Form.Item>
          <Button
            style={{ width: '200px' }}
            className="gc-mt-2"
            type="dashed"
            onClick={addSpecShow}
            block
            icon={<PlusOutlined />}
          >
            添加商品规格
          </Button>
        </Form.Item>
      )}
      <Modal
        destroyOnClose
        title="添加商品规格"
        visible={goodsVisible}
        onOk={addSpec}
        onCancel={() => changeGoodsVisible(false)}
      >
        商品分类/子分类：
        <Select
          defaultValue={categoryValue}
          style={{ width: '300px' }}
          onChange={onChangeCategory}
          placeholder="请选择"
          mode="multiple"
          showSearch
          filterOption={(input, option) =>
            (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
          }
        >
          {props.categoryOptionChild?.map((item: any) => (
            <Select.Option key={item.id} value={item.id}>
              {item.categoryName}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
});

export default goodsItem;
