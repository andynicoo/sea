import { Form, Input, Space, Select, Cascader, DatePicker, Button } from 'antd';
import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IconFont } from '@/views/opportunity';
import { UsersInfoVO } from '@/vo/baseVo';
import { useSelector } from 'react-redux';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface ItemProps {
  field: Field;
}

const SearchFormItem: React.FC<ItemProps> = (props) => {
  const users = useSelector((state: any) => state.global.usersAll);
  return (
    <Form.Item label={props.field.label} name={props.field.name}>
      {(() => {
        const type = props.field.type;
        if (type === 'Input') {
          return (
            <Input
              allowClear
              style={{ width: props.field.width || 168 }}
              placeholder={props.field.placeholder as string}
            />
          );
        } else if (type === 'Select') {
          return (
            <Select
              allowClear
              style={{ width: props.field.width || 168 }}
              placeholder={props.field.placeholder}
              {...props.field.props}
              filterOption={(input, option) => {
                return (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase());
              }}
            >
              {props.field?.options?.map((option, index) => {
                return (
                  <Select.Option key={index} value={option.value}>
                    {option.label}
                  </Select.Option>
                );
              })}
            </Select>
          );
        } else if (type === 'Cascader') {
          return (
            <Cascader
              allowClear
              style={{ width: props.field.width || 168 }}
              placeholder={props.field.placeholder}
              {...props.field.props}
            />
          );
        } else if (type === 'RangePicker') {
          return (
            <RangePicker
              style={{ width: props.field.width || 250 }}
              placeholder={props.field.placeholder as [string, string]}
              {...props.field.props}
            />
          );
        } else if (type === 'UserSelect') {
          return (
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              optionLabelProp="label"
              style={{ width: props.field.width || 168 }}
              placeholder={props.field.placeholder}
              {...props.field.props}
              filterOption={(input, option) => {
                if (typeof option?.label !== 'string') return false;
                return (option?.label as unknown as string).toLowerCase().includes(input.toLowerCase());
              }}
            >
              <Select.OptGroup
                label={
                  <div className="gc-select-title gc-select-titleB">
                    <span>姓名</span>
                    <span>部门</span>
                  </div>
                }
              >
                {users.map((item: UsersInfoVO) => (
                  <Select.Option value={item.userId} key={item.userId} label={item.nickName}>
                    <div className="gc-select-option gc-select-titleB">
                      <span>{item.nickName}</span>
                      <span>{item.departmentName}</span>
                    </div>
                  </Select.Option>
                ))}
              </Select.OptGroup>
            </Select>
          );
        } else if (type === 'SelectInput') {
          return (
            <Input.Group compact>
              <Form.Item name={[props.field.name, props.field.selectName as string]}>
                <Select dropdownMatchSelectWidth={false} style={{ width: 120 }}>
                  {props.field?.options?.map((option, index) => {
                    return (
                      <Select.Option key={index} value={option.value}>
                        {option.label}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name={[props.field.name, props.field.inputName as string]}>
                <Input
                  allowClear
                  style={{ width: props.field.width || 168 }}
                  placeholder={props.field.placeholder as string}
                />
              </Form.Item>
            </Input.Group>
          );
        } else if (type === 'SelectRangePicker') {
          return (
            <Input.Group compact>
              <Form.Item name={[props.field.name, props.field.selectName as string]}>
                <Select dropdownMatchSelectWidth={false} style={{ width: 120 }}>
                  {props.field?.options?.map((option, index) => {
                    return (
                      <Select.Option key={index} value={option.value}>
                        {option.label}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name={[props.field.name, props.field.dateName as string]}>
                <RangePicker
                  style={{ width: props.field.width || 250 }}
                  placeholder={props.field.placeholder as [string, string]}
                />
              </Form.Item>
            </Input.Group>
          );
        }
      })()}
    </Form.Item>
  );
};

export type FieldType =
  | 'Input'
  | 'Select'
  | 'Cascader'
  | 'RangePicker'
  | 'UserSelect'
  | 'SelectInput'
  | 'SelectRangePicker';

export interface Field {
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string | string[];
  width?: number;
  options?: { label: string; value: any }[];
  props?: any;
  selectName?: string;
  inputName?: string;
  dateName?: string;
}

interface Props {
  fields: Field[];
  initialValues?: any;
  onSearch: (params: any) => void;
  okText?: React.ReactNode;
  restText?: React.ReactNode;
  ref?: any;
  labelWidth?: string;
  rightContent?: React.ReactNode
}

const SearchForm: React.FC<Props> = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    clearFields,
  }));
  const [form] = Form.useForm();
  const clearFields = () => form.resetFields();
  const resetFn = () => {
    sessionStorage.queryParams = '';
    clearFields();
    form.validateFields().then((values) => {
      props.onSearch(values);
    });
  };
  const [showMore, setShowMore] = useState<Boolean>(false);
  useEffect(() => {
    form.setFieldsValue({ ...props.initialValues });
  }, [props.initialValues]);
  if (!props.fields.length) return <Fragment />;
  return (
    <Form
      form={form}
      layout="inline"
      onFinish={props.onSearch}
      labelCol={{ style: { minWidth: props.labelWidth || '83px' } }}
    >
      <Space size={[8, 8]} wrap>
        {props.fields.map((field, index) => {
          if (index < 2) {
            return <SearchFormItem key={field.name} field={field} />;
          }
        })}
        <Button type="primary" htmlType="submit">
          <IconFont className="gc-iconfont" type="icon-btn_sousuo" />
          {props.okText || '搜索'}
        </Button>
        <Button onClick={resetFn}>
          <IconFont className="gc-iconfont" type="icon-btn_zhongzhi" />
          {props.restText || '重置'}
        </Button>
        {props.fields.length > 2 && (
          <span className="gc-search-form-more" onClick={() => setShowMore(!showMore)}>
            {showMore ? (
              <>
                <UpOutlined />
                收起筛选
              </>
            ) : (
              <>
                <DownOutlined />
                更多筛选
              </>
            )}
          </span>
        )}
      </Space>
      {props?.rightContent}
      <div style={{ marginTop: '10px', width: '100%' }} className={showMore ? '' : 'gc-search-form-none'}>
        <Space size={[8, 8]} wrap>
          {props.fields.map((field, index) => {
            if (index > 1) {
              return <SearchFormItem key={field.name} field={field} />;
            }
          })}
        </Space>
      </div>
    </Form>
  );
});

export default SearchForm;
