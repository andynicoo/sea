import { productBaseCombinationSpecsGetPage, productBaseSpecsGetPage } from '@/api/goodsSource';
import { AuthVisible } from '@/utils/url';
import { IconFont } from '@/views/opportunity';
import { QueryParams } from '@/vo/baseVo';
import { ProductCategoryVo, SpecsInfoVo } from '@/vo/goodsSourceVo';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
} from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue } from 'antd/lib/table/interface';
import { cloneDeep, sumBy, uniqBy } from 'lodash';
import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { ABCheck } from '../BillingConfig';

const { RangePicker } = DatePicker;

const CountryConfiguration: React.FC<any> = (props) => {
  //应用到全部

  const applyAll = (code: string) => {
    let codeVal = cloneDeep(props.form.getFieldValue(code))[0];
    let configsVal = codeVal.configs[0];
    if (configsVal.type == 1) {
      let sumVal = Number(sumBy(configsVal.nodes, 'value').toFixed(2));
      if (sumVal != 100) {
        return message.warning('比例必须等于100%');
      }
    } else {
      //校验金额AB
      if (ABCheck(configsVal, code, -1)) {
        return false;
      }
    }
    codeVal.countrys = codeVal.countrys.map((item: any) => {
      item.types = item.types.map((sub: any) => {
        sub.type = configsVal.type;
        return sub;
      });
      configsVal.nodes.forEach((sub: any, index: number) => {
        item.nodes[index].type = sub.type;
        if (index < configsVal.nodes.length - 2) {
          if (item.nodes[index].values)
            item.nodes[index].values = item.nodes[index].values.map(() => {
              return { value: sub.value };
            });
        }
      });
      return item;
    });
    let fieldHandle: any = {};
    fieldHandle[code] = [codeVal];
    props.form.setFieldsValue({ ...fieldHandle });
  };
  //新增
  const addConfig = (code: string, key: number) => {
    console.log(code, key);
    let codeVal = cloneDeep(props.form.getFieldValue(code))[0];
    codeVal.countrys[key].types.push({ type: '1' });
    codeVal.countrys[key].nodes = codeVal.countrys[key].nodes.map((item: any) => {
      item.values.push({
        value: item.flag == 'status' ? true : item.flag == 'time' ? [] : '',
      });
      return item;
    });
    console.log(codeVal, 'codeVal');
    let fieldHandle: any = {};
    fieldHandle[code] = [codeVal];
    props.form.setFieldsValue({ ...fieldHandle });
  };
  //删除
  const removeConfig = (code: string, key: number, name: number) => {
    console.log(code, key);
    let codeVal = cloneDeep(props.form.getFieldValue(code))[0];
    codeVal.countrys[key].types.splice(name, 1);
    codeVal.countrys[key].nodes = codeVal.countrys[key].nodes.map((item: any) => {
      item.values.splice(name, 1);
      return item;
    });
    console.log(codeVal, 'codeVal');
    let fieldHandle: any = {};
    fieldHandle[code] = [codeVal];
    props.form.setFieldsValue({ ...fieldHandle });
  };
  //比例金额切换
  const proportionAmountChange = (v: any) => {
    props.form.setFieldsValue({ ...props.form.getFieldValue() });
    console.log(props.form.getFieldValue());
  };
  const cardTitle = (categoryName: string, id: string) => {
    console.log(categoryName, id, 'categoryName');
    let html: React.ReactNode = (
      <div className="countryConfiguration-categoryName">
        <span>{categoryName}</span>
      </div>
    );
    if (id == '1588492025906933762,1588492026053734401') {
      html = (
        <div className="countryConfiguration-categoryName">
          <span>{categoryName}</span>
          <b>*输入B则表示该工单结算一次性付清(只针对VAT申报)</b>
        </div>
      );
    }
    return html;
  };
  return (
    <Card
      title={cardTitle(props.category.categoryName, props.category.categoryId)}
      bordered={false}
      className="gc-mt-2"
      key={props.category.categoryId}
    >
      <ul className="gc-supplier-category-config gc-scc-tit">
        <li className="gc-scc-label">国家</li>
        <li>结算触发配置 & 结算比例配置</li>
      </ul>
      <Form.List name={props.category.categoryId}>
        {(fields) => (
          <>
            {fields.map(({ key, name, ...restField }) => {
              return (
                <div key={name}>
                  <Form.List name={[name, 'configs']}>
                    {(configs) => {
                      return (
                        <>
                          {configs.map(({ key, name, ...restField }) => (
                            <ul key={key} className="gc-supplier-category-config">
                              <li className="gc-scc-label">
                                <div className="gc-scc-config">
                                  <p>批量配置</p>
                                  <Form.Item {...restField} name={[name, 'type']}>
                                    <Select onChange={proportionAmountChange}>
                                      <Select.Option value="1">比例</Select.Option>
                                      <Select.Option value="2">金额</Select.Option>
                                    </Select>
                                  </Form.Item>
                                </div>
                              </li>
                              <Form.List name={[name, 'nodes']}>
                                {(nodes) => {
                                  return (
                                    <li>
                                      {nodes.map(({ key, name, ...restField }) => {
                                        return (
                                          props.category.node[key].nodeFieldDTOList && (
                                            <div key={key} className="gc-scc-config">
                                              <p>{props.category.node[key].nodeName} </p>
                                              <Form.Item {...restField} name={[name, 'type']}>
                                                <Select bordered={false} className="gc-scc-type">
                                                  {props.category.node[key].nodeFieldDTOList?.map((item: any) => (
                                                    <Select.Option key={item.fieldCode} value={item.fieldCode}>
                                                      {item.fieldNameCn}
                                                    </Select.Option>
                                                  ))}
                                                </Select>
                                              </Form.Item>
                                              <Form.Item {...restField} name={[name, 'value']}>
                                                {props.form.getFieldValue(props.category.categoryId)[0].configs[0]
                                                  .type == '1' ? (
                                                  <InputNumber min={0} max={100} precision={2} addonAfter="%" />
                                                ) : (
                                                  <Input min={0} />
                                                )}
                                              </Form.Item>
                                            </div>
                                          )
                                        );
                                      })}
                                    </li>
                                  );
                                }}
                              </Form.List>
                              <li>
                                <div className="gc-scc-handle">
                                  <Button type="primary" onClick={() => applyAll(props.category.categoryId)}>
                                    应用到全部
                                  </Button>
                                </div>
                              </li>
                            </ul>
                          ))}
                        </>
                      );
                    }}
                  </Form.List>
                  <Form.List name={[name, 'countrys']}>
                    {(countrys) => {
                      return (
                        <>
                          {countrys.map(({ key, name, ...restField }) => {
                            let countrysKey = key;
                            return (
                              <ul key={key} className="gc-supplier-category-config">
                                <li className="gc-scc-label">
                                  <div className="gc-scc-config">
                                    <p>{props.category.country[key].label}</p>
                                    <Form.List name={[name, 'types']}>
                                      {(types) => {
                                        return (
                                          <>
                                            {types.map(({ key, name, ...restField }) => {
                                              return (
                                                <div className="gc-scc-config-head" key={name}>
                                                  <Form.Item className="gc-mb-2" {...restField} name={[name, 'type']}>
                                                    <Select onChange={proportionAmountChange}>
                                                      <Select.Option value="1">比例</Select.Option>
                                                      <Select.Option value="2">金额</Select.Option>
                                                    </Select>
                                                  </Form.Item>
                                                  {/* {props.form.getFieldValue(props.category.categoryId)[0].countrys[
                                                    countrysKey
                                                  ].types[name].type == '2' ? (
                                                    <span className="gc-fs-12">（输入A=总成本-其他节点总成本）</span>
                                                  ) : (
                                                    ''
                                                  )} */}
                                                </div>
                                              );
                                            })}
                                          </>
                                        );
                                      }}
                                    </Form.List>
                                  </div>
                                </li>
                                <Form.List name={[name, 'nodes']}>
                                  {(nodes) => {
                                    return (
                                      <li>
                                        {nodes.map(({ key, name, ...restField }) => (
                                          <div
                                            key={key}
                                            className={
                                              props.category.node[key]?.flag == 'time'
                                                ? 'gc-scc-config gc-scc-time-config'
                                                : 'gc-scc-config'
                                            }
                                          >
                                            <p>{props.category.node[key].nodeName}</p>
                                            <Form.Item {...restField} name={[name, 'type']}>
                                              {props.category.node[key].nodeFieldDTOList && (
                                                <Select bordered={false} className="gc-scc-type">
                                                  {props.category.node[key]?.nodeFieldDTOList?.map((item: any) => (
                                                    <Select.Option key={item.fieldCode} value={item.fieldCode}>
                                                      {item.fieldNameCn}
                                                    </Select.Option>
                                                  ))}
                                                </Select>
                                              )}
                                            </Form.Item>
                                            <Form.List name={[name, 'values']}>
                                              {(values) => {
                                                return (
                                                  <>
                                                    {values.map(({ name, ...restField }) => {
                                                      return (
                                                        <div key={name} className="gc-scc-config-handle">
                                                          {props.category.node[key].flag == 'status' ? (
                                                            <Form.Item
                                                              className="gc-mb-2"
                                                              {...restField}
                                                              name={[name, 'value']}
                                                              valuePropName="checked"
                                                            >
                                                              <Switch />
                                                            </Form.Item>
                                                          ) : (
                                                            <Form.Item
                                                              className="gc-mb-2"
                                                              {...restField}
                                                              name={[name, 'value']}
                                                            >
                                                              {props.category.node[key].flag == 'time' ? (
                                                                <RangePicker />
                                                              ) : props.form.getFieldValue(props.category.categoryId)[0]
                                                                  .countrys[countrysKey].types[name].type == '1' ? (
                                                                <InputNumber
                                                                  min={0}
                                                                  max={100}
                                                                  precision={2}
                                                                  addonAfter="%"
                                                                />
                                                              ) : (
                                                                <Input min={0} />
                                                              )}
                                                            </Form.Item>
                                                          )}
                                                          {props.category.node[key].flag == 'status' && (
                                                            <Space className="gc-mb-2">
                                                              <PlusCircleOutlined
                                                                className="gc-scc-addBtn gc-handle-icon"
                                                                onClick={() =>
                                                                  addConfig(props.category.categoryId, countrysKey)
                                                                }
                                                              />
                                                              {name >
                                                              props.category.country[countrysKey].types.length - 1 ? (
                                                                <DeleteOutlined
                                                                  className="gc-handle-icon"
                                                                  onClick={() =>
                                                                    removeConfig(
                                                                      props.category.categoryId,
                                                                      countrysKey,
                                                                      name
                                                                    )
                                                                  }
                                                                />
                                                              ) : (
                                                                ''
                                                              )}
                                                            </Space>
                                                          )}
                                                        </div>
                                                      );
                                                    })}
                                                  </>
                                                );
                                              }}
                                            </Form.List>
                                          </div>
                                        ))}
                                      </li>
                                    );
                                  }}
                                </Form.List>
                              </ul>
                            );
                          })}
                        </>
                      );
                    }}
                  </Form.List>
                </div>
              );
            })}
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default CountryConfiguration;
