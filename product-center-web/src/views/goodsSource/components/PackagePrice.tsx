import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form, InputNumber, message, Tooltip } from 'antd';
import { cloneDeep } from 'lodash';
import React from 'react';

const PackagePrice: React.FC<any> = (props) => {
    //表单数据变更
    const changeFieldsValue = (goodsItem: any, index: number, label: string, tips: string) => {
        let fieldNameObj: any = {}
        goodsItem[index][label] = ''
        fieldNameObj['combinationSpecsVOList'] = [...goodsItem]
        props.form.setFieldsValue(fieldNameObj);
        message.warning(tips)
    }
    //价格失去焦点
    const priceBlur = (e: any, index: any, label: string) => {
        const packagePrice = cloneDeep(props.form.getFieldValue("combinationSpecsVOList"))
        let { servicePrice, originalPrice, minimumPrice, priceRangeMin, priceRangeMax } = packagePrice[index]
        let currPrice = e.target.value
        if (label == 'servicePrice') {
            if (minimumPrice && minimumPrice > currPrice) {
                changeFieldsValue(packagePrice, index, 'servicePrice', '最低售价不能大于销售价！')
            } else {
                let discountSum = (currPrice / originalPrice) * 100
                if (discountSum > 100) {
                    changeFieldsValue(packagePrice, index, 'servicePrice', '销售价不能大于原价！')
                } else {
                    packagePrice[index].discount = parseInt(discountSum.toString())
                    props.form.setFieldsValue({ combinationSpecsVOList: [...packagePrice] });
                }
            }
        } else if (label == 'discount') {
            if (!isNaN(originalPrice)) {
                let handlerPrice = currPrice.split("%")
                if (handlerPrice[0]) {
                    if (Number(handlerPrice[0]) < 0) {
                        packagePrice[index].servicePrice = 0
                    } else if (Number(handlerPrice[0]) > 100) {
                        packagePrice[index].servicePrice = originalPrice
                    } else {
                        packagePrice[index].servicePrice = (originalPrice * Number(handlerPrice[0]) / 100)
                    }
                    props.form.setFieldsValue({ combinationSpecsVOList: [...packagePrice] });
                }
            }
        } else if (label == 'minimumPrice') {
            if (servicePrice && servicePrice < currPrice) {
                changeFieldsValue(packagePrice, index, 'minimumPrice', '最低售价不能大于销售价！')
            } else if (priceRangeMin && priceRangeMin < currPrice) {
                changeFieldsValue(packagePrice, index, 'minimumPrice', '指导价格最低价需大于最低售价！')
            }
        } else if (label == 'priceRangeMin') {
            if (minimumPrice && minimumPrice > currPrice) {
                changeFieldsValue(packagePrice, index, 'priceRangeMin', '指导价格最低价需大于最低售价！')
            } else if (priceRangeMax && priceRangeMax < currPrice) {
                changeFieldsValue(packagePrice, index, 'priceRangeMin', '指导价格最高价不能小于最低价！')
            }
        } else if (label == 'priceRangeMax') {
            if (priceRangeMin && priceRangeMin > currPrice) {
                changeFieldsValue(packagePrice, index, 'priceRangeMax', '指导价格最高价不能小于最低价！')
            } else if (originalPrice && originalPrice < currPrice) {
                changeFieldsValue(packagePrice, index, 'priceRangeMax', '指导价格最高价不能大于原价！')
            }
        }
    }

    return <dl className='gc-goods-spec'>
        <dt>
            <div>商品规格</div>
            <div>服务价格</div>
            <div>折扣比例（%）</div>
            <div>原价（元）<Tooltip title="等于所有商品规格服务价格总和"><QuestionCircleOutlined /></Tooltip></div>
            <div>最低价格（元）</div>
            <div>目标毛利率（%）</div>
            <div className='gc-spec-price-range'>指导价格区间</div>
        </dt >

        <Form.List name="combinationSpecsVOList">
            {(fields) => (
                <>
                    {fields.map(({ key, name, ...restField }) => (
                        <dd
                            key={key}
                        >
                            <div>
                                套装一口价格
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
                                    <InputNumber min={0} precision={2} onBlur={(e) => priceBlur(e, name, 'servicePrice')} />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'discount']}
                                    rules={[
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        precision={2}
                                        formatter={value => `${value}%`}
                                        parser={(value: any) => value!.replace('%', '')}
                                        onBlur={(e) => priceBlur(e, name, 'discount')} />
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
                                    <InputNumber min={0} bordered={false} precision={2} readOnly={true} className="gc-package-original" />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'minimumPrice']}
                                    rules={[
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ]}
                                >
                                    <InputNumber min={0} precision={2} onBlur={(e) => priceBlur(e, name, 'minimumPrice')} />
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'grossProfitMargin']}
                                    rules={[
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        precision={2}
                                        formatter={value => `${value}%`}
                                        parser={(value: any) => value!.replace('%', '')}
                                    />
                                </Form.Item>
                            </div>
                            <div className='gc-spec-price-range'>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'priceRangeMin']}
                                    rules={[
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ]}
                                >
                                    <InputNumber min={0} precision={2} onBlur={(e) => priceBlur(e, name, 'priceRangeMin')} />
                                </Form.Item>
                                <span className='gc-connecting-line'>~</span>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'priceRangeMax']}
                                    rules={[
                                        {
                                            required: true,
                                            message: '必填',
                                        },
                                    ]}
                                >
                                    <InputNumber min={0} precision={2} onBlur={(e) => priceBlur(e, name, 'priceRangeMax')} />
                                </Form.Item>
                            </div>
                        </dd>
                    ))}

                </>
            )}
        </Form.List>
    </dl >
};

export default PackagePrice;
