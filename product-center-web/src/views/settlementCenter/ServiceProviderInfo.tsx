import { PlusOutlined } from '@ant-design/icons';
import { Affix, Button, Card, Cascader, Form, Input, message, Select, Space, Switch, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supplierDetail, supplierSave } from '@/api/settlementCenter';
import { SupplierInfoVo } from '@/vo/settlementCenterVo';
import { cloneDeep } from 'lodash';
import UploadComponent from '@/components/UploadComponent';
import moment from 'moment';
export let timeFormatStart = (date: any) => {
  return moment(date).format('YYYY-MM-DD') + ' 00:00:00';
};
export let timeFormatEnd = (date: any) => {
  return moment(date).format('YYYY-MM-DD') + ' 23:59:59';
};
//供应商修改信息
const ServiceProviderEdit: React.FC = () => {
  const { id } = useParams<any>();
  const [form] = Form.useForm();
  const history = useHistory<{ id?: string; caChe?: boolean }>();
  const countryList = useSelector((state: any) => state.global.countryAll);
  const categoryOption = useSelector((state: any) => state.global.productCategory);
  const [supplierType, setSupplierType] = useState<number>();
  //获取商品分类文本
  const getCategoryName = (category: string[]) => {
    let cName = '';
    categoryOption.forEach((option: any) => {
      if (option.id == category[0]) {
        cName = option.categoryName;
        option.childrenProductCategory.forEach((optionSub: any) => {
          if (optionSub.id == category[1]) {
            cName = cName + ' / ' + optionSub.categoryName;
          }
        });
      }
    });
    return cName;
  };
  //确定
  const onFinish = (values: any) => {
    console.log(values);
    let valuesHandle = cloneDeep(values);
    if (valuesHandle.contractDate && valuesHandle.contractDate[0]) {
      valuesHandle.contractStartDate = timeFormatStart(valuesHandle.contractDate[0]);
      valuesHandle.contractEndDate = timeFormatEnd(valuesHandle.contractDate[1]);
    } else {
      valuesHandle.contractStartDate = '';
      valuesHandle.contractEndDate = '';
    }
    if (valuesHandle.attorneyCertificateDate) {
      valuesHandle.attorneyCertificateDate = timeFormatStart(valuesHandle.attorneyCertificateDate);
    }
    if (valuesHandle.attorneyCertificate) {
      valuesHandle.attorneyCertificate = valuesHandle.attorneyCertificate[0];
    }
    valuesHandle.status = valuesHandle.status ? 1 : 2;
    valuesHandle.id = id;
    supplierSave(valuesHandle).then((res) => {
      message.success('操作成功！');
      history.push({
        pathname: '/qkgoods/settlementCenter/serviceProvider',
        state: { caChe: true },
      });
    });
  };
  //修改供应商类型
  const supplierTypeChange = (val: number) => {
    setSupplierType(val);
  };

  useEffect(() => {
    supplierDetail(id).then((res) => {
      let initialValues = cloneDeep(res.data);
      if (initialValues.attorneyCertificateDate) {
        initialValues.attorneyCertificateDate = moment(initialValues.attorneyCertificateDate);
      }
      if (initialValues.contractStartDate && initialValues.contractEndDate) {
        initialValues.contractDate = [moment(initialValues.contractStartDate), moment(initialValues.contractEndDate)];
      }
      initialValues.countryName = initialValues.countryCode;
      if (initialValues.attorneyCertificate) {
        initialValues.attorneyCertificate = [initialValues.attorneyCertificate];
      }
      initialValues.status = initialValues.status == 1 ? true : false;
      setSupplierType(initialValues.supplierType);
      form.setFieldsValue({ ...initialValues });
    });
  }, []);
  return (
    <Form
      form={form}
      name="basic"
      labelWrap
      labelCol={{ style: { width: '140px' } }}
      initialValues={{}}
      onFinish={onFinish}
      autoComplete="off"
      className="service-provider-form"
    >
      <Card title="基本信息" bordered={false} className="gc-mb-2">
        {/* <Form.Item
                label="所属企业"
                name="enterpriseId"
            >
                <Input readOnly bordered={false} />
            </Form.Item> */}
        <Form.Item label="服务商编码" name="supplierCode">
          <Input readOnly bordered={false} />
        </Form.Item>
        <Form.Item label="服务商类型" name="supplierType" rules={[{ required: true, message: '必填' }]}>
          <Select placeholder="请选择" onChange={supplierTypeChange}>
            <Select.Option value={2}>律师</Select.Option>
            <Select.Option value={1}>供应商</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="服务商名称" name="supplierName" rules={[{ required: true, message: '必填' }]}>
          <Input placeholder="请输入服务商名称" />
        </Form.Item>
        <Form.Item label="服务商简称" name="shortName" rules={[{ required: true, message: '必填' }]}>
          <Input placeholder="请输入服务商简称" />
        </Form.Item>
      </Card>
      <Card title="公司信息" bordered={false} className="gc-mb-2">
        <Form.Item label="公司名称" name="companyName" rules={[{ required: true, message: '必填' }]}>
          <Input placeholder="请输入公司名称" />
        </Form.Item>
        <Space>
          <Form.Item label="国家编码" name="countryCode" rules={[{ required: false, message: '必填' }]}>
            <Input disabled placeholder="请输入国家编码" />
          </Form.Item>
          <Form.Item label="国家名称" name="countryCode" rules={[{ required: true, message: '必填' }]}>
            <Select
              style={{ width: '100%' }}
              placeholder="请选择国家"
              options={countryList}
              showSearch
              optionFilterProp="label"
              optionLabelProp="label"
              filterOption={(input, option) => {
                if (typeof option?.label !== 'string') return false;
                return (option?.label as unknown as string).includes(input);
              }}
            />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item label="省/地区" name="province" rules={[{ required: false, message: '必填' }]}>
            <Input placeholder="请输入省/地区" />
          </Form.Item>
          <Form.Item label="城市" name="city" rules={[{ required: false, message: '必填' }]}>
            <Input placeholder="请输入城市名称" />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item label="街道地址" name="streetAddress" rules={[{ required: false, message: '必填' }]}>
            <Input placeholder="请输入街道地址" />
          </Form.Item>
          <Form.Item label="详细地址" name="supplierAddress" rules={[{ required: true, message: '必填' }]}>
            <Input.TextArea placeholder="请输入详细地址" autoSize />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item label="邮政编码" name="postcode" rules={[{ required: false, message: '必填' }]}>
            <Input placeholder="请输入邮政编码" />
          </Form.Item>
          <Form.Item label="联系人" name="contacts" rules={[{ required: true, message: '必填' }]}>
            <Input placeholder="请输入联系人" />
          </Form.Item>
        </Space>
        <Space>
          <Form.Item label="联系电话" name="contactsTell" rules={[{ required: true, message: '必填' }]}>
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item label="联系邮箱" name="email" rules={[{ required: true, message: '必填' }]}>
            <Input placeholder="请输入联系邮箱" />
          </Form.Item>
        </Space>
      </Card>
      <Card title="合同信息" bordered={false} className="gc-mb-2">
        <Form.Item label="合同编号" name="contractNum" rules={[{ required: false, message: '必填' }]}>
          <Input placeholder="请输入合同编号" />
        </Form.Item>
        <Form.Item label="合同有效期" name="contractDate" rules={[{ required: false, message: '必填' }]}>
          <DatePicker.RangePicker />
        </Form.Item>
      </Card>
      {supplierType == 2 && (
        <Card title="律师资质信息" bordered={false} className="gc-mb-2">
          <Space>
            <Form.Item
              label="律师执照参考号"
              name="attorneyCertificateReferenceNum"
              rules={[{ required: false, message: '必填' }]}
            >
              <Input placeholder="请输入律师执照参考号" />
            </Form.Item>
            <Form.Item
              label="律师执照所在省份(州)-英文"
              name="attorneyCertificateProvinceEn"
              rules={[{ required: false, message: '必填' }]}
            >
              <Input placeholder="请输入律师执照所在省份(州)-英文" />
            </Form.Item>
          </Space>
          <Space>
            <Form.Item
              label="获得律师执照时间"
              name="attorneyCertificateDate"
              rules={[{ required: false, message: '必填' }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="律师执照编号"
              name="attorneyCertificateNum"
              rules={[{ required: false, message: '必填' }]}
            >
              <Input placeholder="请输入律师执照编号" />
            </Form.Item>
          </Space>
          <Space>
            <Form.Item
              label="律师执照所在国家-英文"
              name="attorneyCertificateCountryNameEn"
              rules={[{ required: false, message: '必填' }]}
            >
              <Input placeholder="请输入律师执照所在国家-英文" />
            </Form.Item>
            <Form.Item label="律师第二邮箱" name="attorneyTwoEmail" rules={[{ required: false, message: '必填' }]}>
              <Input placeholder="请输入律师第二邮箱" />
            </Form.Item>
          </Space>
          <Form.Item label="律师传真号码" name="attorneyFaxNo" rules={[{ required: false, message: '必填' }]}>
            <Input placeholder="请输入律师传真号码" />
          </Form.Item>
          <Form.Item label="律师执照证件" name="attorneyCertificate" rules={[{ required: false, message: '必填' }]}>
            <UploadComponent btnTxt="上传图片" length={1} />
          </Form.Item>
        </Card>
      )}
      <Card bordered={false} className="gc-mb-2">
        <Form.Item label="是否分配该服务商" name="status" valuePropName="checked">
          <Switch checkedChildren="分配" unCheckedChildren="不分配" defaultChecked />
        </Form.Item>
      </Card>
      <Affix offsetBottom={10}>
        <Card className="gc-mt-2" bordered={false}>
          <Button type="primary" className="gc-mr-2" htmlType="submit">
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

export default ServiceProviderEdit;
