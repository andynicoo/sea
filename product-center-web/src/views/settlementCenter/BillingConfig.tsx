import { getModuleConfigList, openOrClose } from '@/api/saasManage';
import { AuthVisible } from '@/utils/url';
import { AppcenterInfo } from '@/vo/saasManageVo';
import {
  Affix,
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Switch,
  Table,
  Tabs,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import CountryConfiguration from './components/CountryConfiguration';
import { DownloadOutlined } from '@ant-design/icons';
import { supplierBatchSave, supplierDetail, supplierNodeList } from '@/api/settlementCenter';
import { useHistory, useParams } from 'react-router-dom';
import { cloneDeep } from 'lodash';
const { RangePicker } = DatePicker;
import moment from 'moment';
import { timeFormatEnd, timeFormatStart } from './ServiceProviderInfo';
import { SupplierInfoVo } from '@/vo/settlementCenterVo';
interface NodeVo {
  nodeName: string;
  flag?: string;
  value: string;
  values: any;
  type?: string;
  nodeCode?: string;
  nodeFieldDTOList?: any;
}
interface InputValue {
  nodeCode?: string;
  nodeName?: string;
  fieldCode?: string;
  fieldCodeValue?: string;
}
interface CountryData {
  id: String;
  supplierId: string;
  categoryId: string;
  countryCode: string;
  inputType: string;
  status: string;
  startTime: string;
  endTime: string;
  inputValue: string;
}
export const ABCheck = (configsVal: any, code: string, index: number) => {
  let noPass = false;
  let arrA = [];
  let arrB = [];
  let arrOther: string[] = [];
  let country = index == -1 ? '' : configsVal.label;
  configsVal.nodes.forEach((ele: any, key: number) => {
    if (key < configsVal.nodes.length - 2) {
      let value = index == -1 ? ele.value : ele.values[index].value;
      if (value == 'A') {
        arrA.push(value);
      }
      if (value == 'B') {
        arrB.push(value);
      }
      value && arrOther.push(value);
      if (code == '1588492025906933762,1588492026053734401') {
        if (value && value != 'A' && value != 'B' && isNaN(value)) {
          noPass = true;
        }
      } else {
        if (value && value != 'A' && isNaN(value)) {
          noPass = true;
        }
      }
    }
  });

  if (code == '1588492025906933762,1588492026053734401') {
    if (noPass) {
      return message.warning(country + '金额必须是数字或者字母A，B');
    }
    if (arrA.length && arrB.length) {
      return message.warning(country + '字母A，B只能填写一种');
    }
  } else {
    if (noPass) {
      return message.warning(country + '金额必须是数字或者字母A');
    }
  }
  if (arrB.length > 1) {
    return message.warning(country + '只能填写一个B，其它项必须为空');
  }
  if (arrB.length == 1 && arrOther.length > 1) {
    return message.warning(country + '只能填写一个B,其它项必须为空');
  }

  if (arrA.length > 1) {
    return message.warning(country + '只能填写一个A');
  }
  return noPass;
};
//结算配置
const BillingConfig: React.FC = () => {
  const { id } = useParams<any>();
  const [form] = Form.useForm();
  const [categoryDTOLists, setCategoryDTOLists] = useState<any>();
  const [categoryList, setCategoryList] = useState<any>([]);
  const [formInitialValues, setFormInitialValues] = useState<any>({});
  const [supplierDetailInfo, setSupplierDetailInfo] = useState<SupplierInfoVo>();
  //删除规格
  const history = useHistory<{
    id?: string;
    caChe?: boolean;
    status?: string;
  }>();
  let isPass = true;
  //比较日期
  const verificationDate = (country: any) => {
    var startTimeArr: string[] = [];
    var endTimeArr: string[] = [];
    country.nodes.forEach((node: any, nodeKey: number) => {
      if (node.flag == 'time') {
        // console.log(node.values)
        node.values.forEach((time: any) => {
          console.log(time.value);
          if (time.value?.length) {
            startTimeArr.push(moment(time.value[0]).format('YYYY-MM-DD'));
            endTimeArr.push(moment(time.value[1]).format('YYYY-MM-DD'));
          } else {
            isPass = false;
            message.warning(`${country.label}生效时间不能为空，请检查！`);
          }
        });
      }
    });
    var begin = startTimeArr.sort();
    var over = endTimeArr.sort();
    for (var k = 1; k < begin.length; k++) {
      console.log(begin[k], over[k - 1]);
      if (begin[k] <= over[k - 1]) {
        isPass = false;
        message.warning(`${country.label}生效时间存在重叠，请检查！`);
        return false;
      }
    }
  };
  //校验比例和日期
  const calibrationRatio = (country: any, key: string) => {
    country.types.forEach((type: any, index: number) => {
      if (type.type == '1') {
        let sum = 0;
        country.nodes.forEach((node: any, nodeKey: number) => {
          if (nodeKey < country.nodes.length - 2) {
            if (Number(node.values[index].value)) {
              sum += Number(node.values[index].value);
            }
          }
        });
        if (Math.round(sum) != 100) {
          isPass = false;
          message.warning(`${country.label}结算比例必须等于100%，请检查！`);
        }
      } else {
        //校验金额AB
        if (ABCheck(country, key, index)) {
          isPass = false;
        }
      }
    });
    verificationDate(country);
  };
  //确定
  const onFinish = (values: any) => {
    isPass = true;
    Object.keys(values).forEach((key) => {
      values[key][0].countrys.forEach((country: any) => {
        calibrationRatio(country, key);
      });
    });
    console.log(isPass, 'isPass');
    if (isPass) {
      // console.log(values, supplierConfigVOListHanlde(values), 666);
      supplierBatchSave(supplierConfigVOListHanlde(values)).then((res) => {
        if (res.code == 0) {
          message.success('操作成功');
          history.push({
            pathname: '/qkgoods/settlementCenter/serviceProvider',
            state: { caChe: true },
          });
        }
      });
    }
  };
  //组装提交参数
  const supplierConfigVOListHanlde = (values: any) => {
    let supplierConfigData: CountryData[] = [];
    Object.keys(values).forEach((key) => {
      values[key][0].countrys.forEach((country: any) => {
        countryConfigVOListHanlde(country, key, supplierConfigData);
      });
    });
    return supplierConfigData;
  };
  const countryConfigVOListHanlde = (country: any, categoryId: string, supplierConfigData: CountryData[]) => {
    country.types.forEach((ele: { type: string; id: string }, key: number) => {
      let time = country.nodes.filter((time: NodeVo) => time.flag == 'time');
      let status = country.nodes.filter((status: NodeVo) => status.flag == 'status');
      let inputValue: InputValue[] = [];
      country.nodes.forEach((node: NodeVo) => {
        if (node.type) {
          inputValue.push({
            nodeCode: node.nodeCode,
            nodeName: node.nodeName,
            fieldCode: node.type,
            fieldCodeValue: node.values[key].value,
          });
        }
      });
      supplierConfigData.push({
        supplierId: id,
        categoryId,
        countryCode: country.key,
        id: ele.id,
        inputType: ele.type == '1' ? 'PERCENTAGE' : 'FIXED_AMOUNT',
        status: status[0].values[key].value ? 'ENABLE' : 'DISABLE',
        startTime: timeFormatStart(time[0].values[key].value[0]),
        endTime: timeFormatEnd(time[0].values[key].value[1]),
        inputValue: JSON.stringify(inputValue),
      });
    });
  };
  const nodeEcho = () => {
    let node: any = [];
    return node;
  };
  useEffect(() => {
    supplierDetail(id).then((res) => {
      setSupplierDetailInfo(res.data);
      let supplierInfo = cloneDeep(res.data);
      let formValues: any = {};
      let configDTOHandle: any = [];
      supplierInfo.scSupplierConfigDTOS.forEach((dto) => {
        if (configDTOHandle.length) {
          let isAdd = true;
          configDTOHandle.forEach((config: any) => {
            // console.log(config.categoryId, dto.categoryId , config.countryCode, dto.countryCode,99)
            if (config.categoryId == dto.categoryId && config.countryCode == dto.countryCode) {
              isAdd = false;
              config.inputType.push({ value: dto.inputType });
              config.status.push({ value: dto.status == 'ENABLE' ? true : false });
              config.time.push({ value: [moment(dto.startTime), moment(dto.endTime)] }),
                JSON.parse(dto.inputValue).forEach((node: any) => {
                  config[node.nodeCode].fieldCodeValue.push({ value: node.fieldCodeValue });
                });
            }
          });
          if (isAdd) {
            let nodesHandle: any = {};
            JSON.parse(dto.inputValue).forEach((node: any) => {
              nodesHandle[node.nodeCode] = {
                fieldCode: node.fieldCode,
                fieldCodeValue: [{ value: node.fieldCodeValue }],
              };
            });
            configDTOHandle.push({
              categoryId: dto.categoryId,
              countryCode: dto.countryCode,
              inputType: [{ type: dto.inputType }],
              status: [{ value: dto.status == 'ENABLE' ? true : false }],
              time: [{ value: [moment(dto.startTime), moment(dto.endTime)] }],
              ...nodesHandle,
            });
          }
        } else {
          let nodesHandle: any = {};
          JSON.parse(dto.inputValue).forEach((node: any) => {
            nodesHandle[node.nodeCode] = {
              fieldCode: node.fieldCode,
              fieldCodeValue: [{ value: node.fieldCodeValue }],
            };
          });
          configDTOHandle.push({
            categoryId: dto.categoryId,
            countryCode: dto.countryCode,
            inputType: [{ type: dto.inputType }],
            status: [{ value: dto.status == 'ENABLE' ? true : false }],
            time: [{ value: [moment(dto.startTime), moment(dto.endTime)] }],
            ...nodesHandle,
          });
        }
      });
      // console.log(configDTOHandle,'configDTOHandle666')
      supplierInfo.categoryDTOLists = supplierInfo.categoryDTOLists.map((item: any) => {
        let countryCode = item.countryCode.split(',');
        let countryName = item.countryName.split(',');
        item.country = countryCode.map((item: string, index: number) => {
          return {
            label: countryName[index],
            value: item,
            key: item,
            length: 1,
          };
        });
        item.category = item.categoryId.split(',');
        return item;
      });
      supplierInfo.categoryDTOLists.forEach((item, index) => {
        formValues[item.categoryId] = [
          {
            configs: [
              {
                type: '1',
              },
            ],
            countrys: item.country,
          },
        ];
        supplierNodeList(`categoryId=${item.category[item.category.length - 1]}`).then((res) => {
          let originalResDate = cloneDeep(res.data);
          item.node = res.data;
          item.node.push({ nodeName: '生效时间设置', flag: 'time' });
          item.node.push({ nodeName: '状态', flag: 'status' });
          formValues[item.categoryId][0].configs[0].nodes = res.data.map((node: any) => {
            // node.value = "";
            node.values = [
              {
                value: node.flag == 'status' ? true : node.flag == 'time' ? [moment(), moment().add(365, 'days')] : '',
              },
            ];
            // console.log(node.nodeFieldDTOList,node)
            if (node.nodeFieldDTOList && node.nodeFieldDTOList.length) node.type = node.nodeFieldDTOList[0].fieldCode;
            return node;
          });
          formValues[item.categoryId][0].countrys.forEach((country: any) => {
            country.types = [{ type: '1', id: '' }];
            country.nodes = res.data;
            if (supplierInfo.scSupplierConfigDTOS.length) {
              let typesArr: any = [];
              let originalResDateHD = cloneDeep(originalResDate);
              supplierInfo.scSupplierConfigDTOS.forEach((dto) => {
                if (dto.categoryId == item.categoryId && dto.countryCode == country.value) {
                  typesArr.push({ type: dto.inputType == 'PERCENTAGE' ? '1' : '2', id: dto.id });
                  country.types = typesArr;
                }
              });
              configDTOHandle.forEach((config: any) => {
                if (config.categoryId == item.categoryId && config.countryCode == country.value) {
                  console.log(config, originalResDateHD);
                  originalResDateHD.forEach((node: any) => {
                    if (config[node.nodeCode] && config[node.nodeCode].fieldCode) {
                      node.type = config[node.nodeCode].fieldCode;
                      node.values = config[node.nodeCode].fieldCodeValue;
                    }
                  });
                  originalResDateHD.push({ nodeName: '生效时间设置', flag: 'time', values: config.time });
                  originalResDateHD.push({ nodeName: '状态', flag: 'status', values: config.status });
                  country.nodes = originalResDateHD;
                }
              });
            }
          });
          console.log(formValues, configDTOHandle, 'formValues');
          form.setFieldsValue({ ...formValues });
        });
      });
      setCategoryList(supplierInfo.categoryDTOLists);
      setFormInitialValues(formValues);
      // console.log(
      //   supplierInfo.categoryDTOLists,
      //   "supplierInfo.categoryDTOLists",
      //   formValues
      // );
    });
  }, []);
  return (
    <Form form={form} name="basic" labelCol={{ style: { width: '110px' } }} onFinish={onFinish} autoComplete="off">
      <Card>
        <Row>
          <Col className="sc-label">服务商简称：</Col>
          <Col>{supplierDetailInfo?.shortName}</Col>
        </Row>
        <Row>
          <Col className="sc-label">服务商编码：</Col>
          <Col>{supplierDetailInfo?.supplierCode}</Col>
        </Row>
        <Row>
          <Col className="sc-label">服务商类型：</Col>
          <Col>{supplierDetailInfo?.supplierType == 1 ? '供应商' : '律师'}</Col>
        </Row>
      </Card>
      <Alert className="gc-mt-2" message="输入A=总成本-其他节点总成本" type="warning" showIcon />
      {categoryList.map((category: any) => (
        <CountryConfiguration key={category.categoryId} category={category} form={form} />
      ))}
      {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item> */}
      <Affix offsetBottom={10}>
        <Card bordered={false} className="gc-mt-2 gc-details-handle">
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button
            onClick={() =>
              history.push({
                pathname: '/qkgoods/settlementCenter/serviceProvider',
                state: { caChe: true },
              })
            }
          >
            取消
          </Button>
        </Card>
      </Affix>
    </Form>
  );
};

export default BillingConfig;
