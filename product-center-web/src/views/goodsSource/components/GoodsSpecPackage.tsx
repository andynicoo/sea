import { productAdditionSpecListSpecId } from '@/api/goodsSource';
import { AdditionSpecInfo } from '@/vo/goodsSourceVo';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Modal, Radio, Select, Switch } from 'antd';
import { cloneDeep, sum, sumBy, uniqBy } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useHistory } from 'react-router-dom';
import GoodsSourceList from '..';

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
    const rowsHandle = [...goodsList, ...rows];
    console.log(rowsHandle, 9090);
    setGoodsList(uniqBy(rowsHandle, 'productCode'));
    let goodsFrom: any = {};
    let goodsFromListKey = Object.keys(goodsFromList);
    rows.forEach((goods: any) => {
      //过滤已选择的商品
      let specsVOListHD = goods.productSpecsDTOList.map((list: any) => {
        list.isRequired = list.isRequired == 'IS_REQUIRED' || list.isRequired == true ? true : false;
        return list;
      });
      goods.productSpecsDTOList = specsVOListHD;
      if (!goodsFromListKey.includes(goods.productCode)) {
        goodsFrom[goods.productCode] = [...goods.productSpecsDTOList];
      }
    });

    setgoodsFromList({ ...goodsFromList, ...goodsFrom });
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
      <dl className="gc-mb-6">
        <dt>选项设置</dt>
        <dd>
          <Radio.Group onChange={onChangeOption} value={optionValue}>
            <Radio value={'SIMPLE_SELECT'}>单选</Radio>
            <Radio value={'MULTI_SELECT'}>多选</Radio>
          </Radio.Group>
        </dd>
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
        <div style={{ overflow: 'auto' }} key={goods.productCode}>
          <p>
            商品编码：{goods.productCode} <br />
            SPU名称：{goods.productName}
          </p>
          <dl className="gc-goods-spec">
            <dt>
              {/* <div className='gc-spec-checkbox'><Checkbox></Checkbox></div> */}
              <div>商品规格</div>
              <div>服务价格</div>
              <div>原价（{currency}）</div>
              <div>最低价格（{currency}）</div>
              <div>目标毛利率（%）</div>
              <div className="gc-spec-price-range">指导价格区间</div>
              <div>是否为必选</div>
              <div>续费价格设置</div>
              <div>附加规格</div>
              {!isGoodsSales && <div className="gc-spec-handle">操作</div>}
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
                      <div>
                        <Form.Item {...restField} name={[name, 'isRequired']} valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </div>
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
                      <div>
                        {additionSpecList[goods.productCode] &&
                        additionSpecList[goods.productCode][props.form.getFieldValue(goods.productCode)[name].specsCode]
                          ?.length ? (
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
                      {!isGoodsSales && (
                        <div className="gc-spec-handle">
                          <a onClick={() => removeSpec(name, goods.productCode)}>删除</a>
                        </div>
                      )}
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
            onClick={() => setGoodsVisible(true)}
            block
            icon={<PlusOutlined />}
          >
            添加商品
          </Button>
        </Form.Item>
      )}
      <GoodsPop
        addGoods={addGoods}
        goodsVisible={goodsVisible}
        changeGoodsVisible={changeGoodsVisible}
        goodsList={goodsList}
      />
    </>
  );
});

export default goodsItem;

//商品规格选择弹窗
interface GoodsPopProps {
  goodsVisible: boolean;
  goodsList: any;
  changeGoodsVisible: (flag: boolean) => void;
  addGoods: (rows: any) => void;
}
const GoodsPop: React.FC<GoodsPopProps> = (props) => {
  const [selectedRows, setSelectedRows] = useState<any>([]);
  console.log(selectedRows, 9898);
  const addGoods = () => {
    props.addGoods(selectedRows);
    props.changeGoodsVisible(false);
  };
  const goodsRowsChange = (rows: any) => {
    setSelectedRows(rows);
  };
  return (
    <Modal
      destroyOnClose
      width={1200}
      title="选择套装商品"
      visible={props.goodsVisible}
      onOk={addGoods}
      onCancel={() => props.changeGoodsVisible(false)}
    >
      <GoodsSourceList goodsRowsChange={goodsRowsChange} goodsList={props.goodsList} />
    </Modal>
  );
};
