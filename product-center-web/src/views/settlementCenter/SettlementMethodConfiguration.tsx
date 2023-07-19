import { PlusOutlined } from '@ant-design/icons';
import { Affix, Button, Card, Cascader, Form, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supplierDetail, supplierSave, updateCountryCategory } from '@/api/settlementCenter';
import { SupplierInfoVo } from '@/vo/settlementCenterVo';
import { cloneDeep, uniq } from 'lodash';

//供应商修改信息
const ServiceProviderEdit: React.FC = () => {
  const { id } = useParams<any>();
  const [form] = Form.useForm();
  const history = useHistory<{ id?: string; caChe?: boolean }>();
  const countryList = useSelector((state: any) => state.global.countryAll);
  let categoryOption = useSelector((state: any) => state.global.productCategory);
  categoryOption = categoryOption.filter((element: any) => element.childrenProductCategory.length);
  const [supplierDetailInfo, setSupplierDetailInfo] = useState<SupplierInfoVo>();
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
    let cid: string[] = [];
    let categoryVOListHandle = valuesHandle.categoryDTOLists.map((item: any) => {
      item.supplierId = id;
      item.categoryId = item.category.join(',');
      cid.push(item.categoryId);
      item.categoryName = getCategoryName(item.category);
      item.countryCode = item.country.map((countrySub: any) => countrySub.value).join(',');
      item.countryName = item.country.map((countrySub: any) => countrySub.label).join(',');
      return item;
    });
    console.log(categoryVOListHandle, cid, uniq(cid));
    if (cid.length !== uniq(cid).length) return message.warning('商品分类不能重复，请检查！');
    updateCountryCategory(categoryVOListHandle).then((res) => {
      message.success('操作成功！');
      history.push({
        pathname: '/qkgoods/settlementCenter/serviceProvider',
        state: { caChe: true },
      });
    });
  };

  useEffect(() => {
    supplierDetail(id).then((res) => {
      let initialValues = cloneDeep(res.data);
      setSupplierDetailInfo(res.data);
      initialValues.categoryDTOLists = initialValues.categoryDTOLists.map((item: any) => {
        let countryCode = item.countryCode.split(',');
        let countryName = item.countryName.split(',');
        item.country = countryCode.map((item: string, index: number) => {
          return { label: countryName[index], value: item, key: item };
        });
        item.category = item.categoryId.split(',');
        return item;
      });
      form.setFieldsValue({ ...initialValues });
    });
  }, []);
  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ style: { width: '110px' } }}
      initialValues={{}}
      onFinish={onFinish}
      autoComplete="off"
      className="service-provider-form"
    >
      <Card title="基本信息" bordered={false} className="gc-mb-2">
        <Form.Item label="服务商编码">{supplierDetailInfo?.supplierCode}</Form.Item>
        <Form.Item label="服务商类型">{supplierDetailInfo?.supplierType == 1 ? '供应商' : '律师'}</Form.Item>
        <Form.Item label="服务商名称">{supplierDetailInfo?.supplierName}</Form.Item>
        <Form.Item label="服务商简称">{supplierDetailInfo?.shortName}</Form.Item>
      </Card>
      <Card title="国家和商品分类配置" bordered={false} className="gc-mb-2">
        <Form.List name="categoryDTOLists">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <dl key={key} className="gc-category-form">
                  <dt className="gc-category-handle">
                    <a onClick={() => remove(name)}>删除</a>
                  </dt>
                  <dd>
                    <Form.Item
                      {...restField}
                      label="商品分类"
                      name={[name, 'category']}
                      rules={[
                        {
                          required: true,
                          message: '必填',
                        },
                      ]}
                    >
                      <Cascader
                        fieldNames={{
                          label: 'categoryName',
                          value: 'id',
                          children: 'childrenProductCategory',
                        }}
                        options={categoryOption}
                        placeholder="请选择"
                        className="gc-mr-2"
                      />
                    </Form.Item>
                  </dd>
                  <dd>
                    <Form.Item
                      {...restField}
                      name={[name, 'country']}
                      label="国家"
                      rules={[
                        {
                          required: true,
                          message: '必填',
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="请选择国家"
                        options={countryList}
                        labelInValue
                        showSearch
                        optionFilterProp="label"
                        optionLabelProp="label"
                        filterOption={(input, option) => {
                          if (typeof option?.label !== 'string') return false;
                          return (option?.label as unknown as string).includes(input);
                        }}
                      />
                    </Form.Item>
                  </dd>
                </dl>
              ))}
              <Form.Item>
                <Button
                  style={{ width: '200px' }}
                  className="gc-mt-2"
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  添加配置
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
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
