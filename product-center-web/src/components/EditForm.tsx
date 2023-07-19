import { FormInstance } from "antd/lib/form";
import { Form, Input, Select, Cascader, DatePicker, Button, InputNumber, Card, Checkbox, Radio, Affix } from "antd";
import React, { Fragment, useEffect, useRef } from "react";
import { UsersInfoVO } from "@/vo/baseVo";
import { useSelector } from "react-redux";
import { RangePickerProps } from "antd/lib/date-picker";
import moment from 'moment'
const { RangePicker } = DatePicker;

interface ItemProps {
    field: Field,
    detailsFlag?: boolean,
    from?: any
}

const SearchFormItem: React.FC<ItemProps> = (props) => {
    const users = useSelector((state: any) => state.global.usersAll)
    console.log(props)
    return <Form.Item
        label={props.field.label}
        name={props.field.name}
        rules={[{ required: props.field.required || false, message: '请完善必填项!' }]}
        tooltip={props.field.tooltip}
    >
        {(() => {
            const type = props.field.type
            if (type === "Text") {
                return props.field.placeholder
            } else if (type === "Input") {
                if (props.detailsFlag) return <>{props.from.getFieldValue(props.field.name)}</>
                return <Input
                    style={{ width: props.field.width || 250 }}
                    placeholder={props.field.placeholder as string}
                />
            } else if (type === "InputNumber") {
                return <InputNumber
                    disabled={props.detailsFlag}
                    style={{ width: props.field.width || 250 }}
                    placeholder={props.field.placeholder as string}
                    {...props.field.props}
                />
            } else if (type === "TextArea") {
                if (props.detailsFlag) return <>{props.from.getFieldValue(props.field.name)}</>
                return <Input.TextArea
                    style={{ width: props.field.width || 250 }}
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    placeholder={props.field.placeholder as string}
                />
            } else if (type === "Select") {
                return <Select
                    disabled={props.detailsFlag}
                    allowClear
                    style={{ width: props.field.width || 250 }}
                    placeholder={props.field.placeholder}
                    {...props.field.props}
                    filterOption={(input, option) => {
                        return (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                    }
                >
                    {props.field?.options?.map((option, index) => {
                        return <Select.Option key={index} value={option.value}>
                            {option.label}
                        </Select.Option>
                    })}
                </Select>
            } else if (type === "Cascader") {
                return <Cascader
                    disabled={props.detailsFlag}
                    style={{ width: props.field.width || 250 }}
                    placeholder={props.field.placeholder}
                    {...props.field.props}
                />
            } else if (type === "RangePicker") {
                return <RangePicker
                    disabled={props.detailsFlag}
                    style={{ width: props.field.width || 250 }}
                    placeholder={props.field.placeholder as [string, string]}
                    {...props.field.props}
                />
            } else if (type === "DatePicker") {
                return <DatePicker
                    showTime
                    disabled={props.detailsFlag}
                    style={{ width: props.field.width || 250 }}
                    placeholder={props.field.placeholder as [string, string]}
                    {...props.field.props}
                />
            } else if (type === "Checkbox") {
                return <Checkbox.Group {...props.field.props} />
            } else if (type === "Radio") {
                return <Radio.Group {...props.field.props} />
            }
            else if (type === "UserSelect") {
                return <Select
                    disabled={props.detailsFlag}
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    optionLabelProp="label"
                    style={{ width: props.field.width || 250 }}
                    placeholder={props.field.placeholder}
                    {...props.field.props}
                    filterOption={(input, option) => {
                        if (typeof (option?.label) !== "string") return false
                        return (option?.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                    }
                    }
                >
                    <Select.OptGroup label={<div className="gc-select-title"><span>姓名</span><span>手机</span><span>部门</span></div>}>
                        {users.map((item: UsersInfoVO) => (
                            <Select.Option value={item.userId} key={item.userId} label={item.nickName}>
                                <div className="gc-select-option">
                                    <span>{item.nickName}</span>
                                    <span>{item.mobile}</span>
                                    <span>{item.departmentName}</span>
                                </div>
                            </Select.Option>
                        ))}
                    </Select.OptGroup>
                </Select>
            }


        })()}
    </Form.Item >
}

export type FieldType = "Text" | "Input" | "TextArea" | "InputNumber" | "Select" | "Cascader" | "RangePicker" | "DatePicker" | "Checkbox" | "Radio" | "UserSelect";

export interface Field {
    label: string;
    name?: string;
    type: FieldType;
    placeholder?: string | string[];
    width?: number;
    options?: { label: string; value: any }[];
    props?: any;
    required?: boolean;
    tooltip?: string;
}

interface Props {
    title?: string;
    fields: Field[];
    onSave: (params: any) => void;
    onDraft?: (params: any) => void;
    onReturn?: (params: any) => void;
    okText?: React.ReactNode;
    draftText?: React.ReactNode;
    restText?: React.ReactNode;
    returnText?: React.ReactNode;
    labelWidth?: number;
    initialValues?: any,
    detailsFlag?: boolean
}

const SearchForm: React.FC<Props> = (props) => {
    const [form] = Form.useForm();

    const searchForm = useRef<FormInstance<any>>();

    const submitFn = (btnTxt?: string) => {
        form.validateFields().then(values => {
            if (btnTxt) {
                return props.onDraft && props.onDraft(values)
            }
            props.onSave(values)
        })

    }
    useEffect(() => {
        if (props.initialValues) {
            form.setFieldsValue({ ...props.initialValues })
        }
    }, [props.initialValues])
    if (!props.fields.length) return <Fragment />
    return <Form
        className={props.detailsFlag ? "gc-edit-form-detals" : ''}
        form={form}
        ref={(form: FormInstance<any>) => searchForm.current = form}
        labelCol={{ style: { minWidth: (props.labelWidth || 82) + 'px' } }}
    >
        <Card bordered={false} title={props.title}>
            {props.fields.map((field) => <SearchFormItem from={form} key={field.label} field={field} detailsFlag={props.detailsFlag} />)}
        </Card>
        <Affix offsetBottom={10}>
            <Card bordered={false} className="gc-mt-2">
                {!props.detailsFlag && <><Button type="primary" className="gc-mr-2" onClick={() => submitFn()}>
                    {props.okText || '保存'}
                </Button>
                    {props.draftText && <Button type="primary" className="gc-mr-2" onClick={() => submitFn("draft")}>
                        {props.draftText}
                    </Button>}</>}
                <Button onClick={props.onReturn}>
                    {props.returnText || '返回'}
                </Button>
            </Card>
        </Affix>

    </Form >
}

export default SearchForm;