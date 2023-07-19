import DefaultLayout from "@/components/layouts/DefaultLayout";
import { NextPage } from "next";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Button, Card, Input, Form, Checkbox, Select, DatePicker, Switch, Cascader, Space, Row, Col, FormListFieldData, FormListOperation, FormInstance, message, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import provinceAndCityData from "@/utils/area";
import { getKjzdActivityPlatformList, publishActivity, updateActivity } from "@/apis/users";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActivityPlatform } from "@/vo/Encyclopedia";
import Upload from "@/components/Upload";
import moment, { Moment } from "moment";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

const IkjzdBraftEditor = dynamic(() => import("@/components/BraftEditor"), { ssr: false })

interface ActivityPublishProps {

}

type keysType = { [key: number]: boolean };
interface TicketsContextProps {
    form: FormInstance<any>;
    keys: keysType;
    setKeys: (keys: keysType) => void;
}

const TicketsContext = React.createContext<TicketsContextProps>({} as TicketsContextProps);


/**发布活动 */
const ActivityPublish: NextPage<ActivityPublishProps> = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [platforms, setPlatforms] = useState<ActivityPlatform[]>([]);
    const [keys, setKeys] = useState<keysType>({});
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        const FMT = "YYYY-MM-DD hh:mm:ss";
        const [startTime, endTime] = values.activityTime
            .map((time: Moment) => moment(time).format(FMT));
        values.startTime = startTime;
        values.endTime = endTime;
        values.otherInfo = JSON.stringify(values.otherInfo);

        values.tickets = values.tickets.map((ticket: any) => {
            if (!ticket.ticketsTimeFlag) {
                const [] = ticket.ticketsTime
                    .map((time: Moment) => moment(time).format(FMT));
                ticket.startTime = startTime;
                ticket.endTime = endTime;
            }
            return ticket;
        })

        setLoading(true);
        try {
            if (router.query.id) {
                values.id = router.query.id
                await updateActivity(values);
                message.success("修改活动成功");
            } else {
                await publishActivity(values);
                message.success("发布活动成功");
            }
            router.back();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getKjzdActivityPlatformList().then((res) => {
            setPlatforms(res.data)
        });
    }, []);

    const ticketsCtxValue: TicketsContextProps = {
        form,
        keys,
        setKeys
    }

    return <DefaultLayout>
        <Form
            form={form}
            onFinish={onFinish}
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            scrollToFirstError
        >
            <Space direction="vertical" style={{ width: "100%" }} size={15}>
                <Card title="基本信息" bordered={false}>
                    <Form.Item
                        label="活动主题"
                        name="title"
                        rules={[{ required: true, message: "请输入活动主题" }]}
                    >
                        <Input showCount maxLength={50} />
                    </Form.Item>
                    <Form.Item
                        label="活动海报"
                        name="posterUrl"
                        rules={[{ required: true, message: "请上传活动海报" }]}
                        help={"尺寸建议640 * 400,不得超过3M,一张漂亮的活动海报可以吸引更多用户来报名,同时可以增加传播效果"}
                    >
                        <Upload listType="picture-card" multiple={false} />
                    </Form.Item>
                    <Form.Item
                        label="活动平台"
                        name="activityPlatformId"
                        rules={[{ required: true }]}
                    >
                        <Select className="pg-w404">
                            {platforms.map((item: ActivityPlatform) => (
                                <Select.Option
                                    value={item.id}
                                    key={item.id}
                                >
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="筛选日期"
                        name="activityTime"
                        rules={[{ required: true, message: "请选择日期" }]}
                    >
                        {/* @ts-ignore */}
                        <DatePicker.RangePicker showTime />
                    </Form.Item>

                    <Form.Item
                        label="活动票种"
                        rules={[{ required: true, message: "请添加活动票种" }]}
                    >
                        <Form.List name={"tickets"}>
                            {(fields, operation) => {
                                return <TicketsContext.Provider value={ticketsCtxValue}>
                                    <TicketsTable fields={fields} operation={operation}>
                                        {fields.map((field) => (
                                            <TicketsTable.Item
                                                key={field.key}
                                                field={field}
                                                operation={operation}
                                            />
                                        ))}
                                    </TicketsTable>
                                </TicketsContext.Provider>
                            }}
                        </Form.List>
                    </Form.Item>

                    <Form.Item
                        label="活动地址"
                        required
                        style={{ margin: 0 }}
                    >
                        <Row gutter={15}>
                            <Col span={12}>
                                <Form.Item
                                    name="areaCode"
                                    rules={[{ required: true, message: "请选择" }]}
                                >
                                    <Cascader
                                        options={provinceAndCityData}
                                        placeholder="请选择"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="address"
                                    rules={[{ required: true, message: "请输入详细地址" }]}
                                >
                                    <Input placeholder="请输入详细地址" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        label="活动类型"
                        name="type"
                        rules={[{ required: true, message: "请选择" }]}
                    >
                        <Select>
                            <Select.Option value={0}>线上活动</Select.Option>
                            <Select.Option value={1}>线下活动</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="是否需要登录"
                        name="isLogin"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
                </Card>

                <Card title="活动详情" bordered={false}>
                    <Form.Item
                        name="content"
                        wrapperCol={{ span: 24 }}
                        rules={[{ required: true, message: "请填写活动详情" }]}
                    >
                        {/* @ts-ignore */}
                        <IkjzdBraftEditor />
                    </Form.Item>
                </Card>

                <Card title="自定义获取用户报名表单项" bordered={false}>
                    <Form.List name="otherInfo">
                        {(fields, { add, remove }) => (
                            <Form.Item style={{ margin: 0 }}>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row gutter={15} key={key}>
                                        <Col span={14}>
                                            <Form.Item
                                                {...restField}
                                                label="表单名称"
                                                name={[name, "key"]}
                                                rules={[{ required: true, message: "请输入报名需填写的表单名称" }]}
                                            >
                                                <Input placeholder="请输入报名需填写的表单名称" />
                                            </Form.Item>
                                        </Col>

                                        <Col span={3}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "is_fill"]}
                                                valuePropName="checked"
                                            >
                                                <Checkbox>是否必须</Checkbox>
                                            </Form.Item>
                                        </Col>

                                        <Col span={6}>
                                            <Form.Item>
                                                <Button
                                                    shape="circle"
                                                    size={"small"}
                                                    onClick={() => remove(name)}
                                                >
                                                    <DeleteOutlined />
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button
                                        onClick={() => add({ is_fill: false })}
                                        icon={<PlusOutlined />}
                                    >
                                        添加
                                    </Button>
                                </Form.Item>
                            </Form.Item>
                        )}
                    </Form.List>
                </Card>

                <Card title="其他信息" bordered={false}>
                    <Form.Item
                        label="服务电话"
                        name="mobile"
                        rules={[{ required: true, message: "请输入电话号码" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="客服QQ"
                        name="qq"
                        rules={[{ required: true, message: "请输入QQ号码" }]}
                    >
                        <Input />
                    </Form.Item>
                </Card>

                <Card size={"small"} bordered={false}>
                    <Form.Item style={{ textAlign: "center", margin: 0 }}>
                        <Form.Item
                            name="agree"
                            rules={[{ required: true, message: "请先仔细阅读跨境知道活动协议" }]}
                            valuePropName="checked"
                        >
                            <Checkbox>
                                <span>同意</span>
                                <a href="https://static.${prefix}.com/uploads/file/pdf/activity.pdf" target="_blank">
                                    《跨境知道活动协议》
                                </a>
                            </Checkbox>
                        </Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                提交
                            </Button>
                            <Button onClick={router.back}>
                                取消
                            </Button>
                        </Space>
                    </Form.Item>
                </Card>
            </Space>
        </Form>
    </DefaultLayout>
}

export default ActivityPublish;

const Result: React.FC = () => {
    return <Card className="pg-users-publish-success">
        < img src="/asset/image/ac-success.png" />
        <h2 className="pg-users-ps-title">活动已发布成功</h2>
        <div className="pg-users-ps-tips">活动审核通过后,可在跨境知道平台展示用户可以报名参加</div>
        <div>
            <Button>
                <Link href={"/users/activity?type=2"}>查看我的活动</Link>
            </Button>
            <Button type="primary" className="pg-ml-2">
                <Link href={"/"}>返回首页</Link>
            </Button>
        </div>
    </Card >;
}

interface TicketsTableProps {
    fields: FormListFieldData[],
    operation: FormListOperation;
}

const TicketsTableWarp: React.FC<TicketsTableProps> = ({ children, fields, operation }) => {
    const { add } = operation;

    const prefix = process.env.CLASS_PREFIX;


    const ctx = useContext(TicketsContext);

    const defaultTicketsTimeFlag = true

    const defaultValue = {
        name: "name",
        price: 100,
        pubNum: 100,
        ticketsTimeFlag: defaultTicketsTimeFlag,
        ticketsTime: moment(),
    }

    const onAdd = () => {
        ctx.setKeys({ ...ctx.keys, [fields.length]: defaultTicketsTimeFlag });
        add(defaultValue);
    }

    return (
        <div className={`${prefix}-table-wrapper`} style={{ border: "1px solid #eee" }}>
            <div className={`${prefix}-spin-nested-loading`}>
                <div className={`${prefix}-spin-container`}>
                    <div className={`${prefix}-table ${prefix}-table-empty`}>
                        <div className={`${prefix}-table-container`}>
                            <div className={`${prefix}-table-content`}>
                                <table style={{ tableLayout: "auto" }}>
                                    <colgroup></colgroup>
                                    <thead className={`${prefix}-table-thead`}>
                                        <tr>
                                            <th className={`${prefix}-table-cell`}>票种名称</th>
                                            <th className={`${prefix}-table-cell`}>票价</th>
                                            <th className={`${prefix}-table-cell`}>数量</th>
                                            <th className={`${prefix}-table-cell`}>报名日期</th>
                                            <th className={`${prefix}-table-cell`}>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`${prefix}-table-tbody`}>
                                        {children}
                                    </tbody>
                                </table>
                            </div>
                            <div className={`${prefix}-table-footer`}>
                                <Button onClick={onAdd}>
                                    <PlusOutlined />
                                    添加
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface TicketsTableItemProps {
    field: FormListFieldData;
    operation: FormListOperation;
}

const TicketsTableItem: React.FC<TicketsTableItemProps> = (props) => {
    const { field, operation } = props;
    const { remove } = operation;
    const ctx = useContext(TicketsContext);

    const prefix = process.env.CLASS_PREFIX;

    const onTicketsTimeFlagChange = (event: CheckboxChangeEvent) => {
        ctx.setKeys({ ...ctx.keys, [field.key]: event.target.checked })
    }

    return (
        <tr className={`${prefix}-table-row`}>
            <td className={`${prefix}-table-cell`}>
                <Form.Item
                    {...field}
                    name={[field.name, "name"]}
                    noStyle
                >
                    <Input />
                </Form.Item>
            </td>
            <td className={`${prefix}-table-cell`}>
                <Form.Item
                    {...field}
                    name={[field.name, "price"]}
                    noStyle
                >
                    <InputNumber />
                </Form.Item>
            </td>
            <td className={`${prefix}-table-cell`}>
                <Form.Item
                    {...field}
                    name={[field.name, "pubNum"]}
                    noStyle
                >
                    <InputNumber min={0} step={1} />
                </Form.Item>
            </td>
            <td className={`${prefix}-table-cell`}>
                <Form.Item noStyle>
                    <Form.Item
                        {...field}
                        name={[field.name, "ticketsTimeFlag"]}
                        style={{ marginBottom: 10 }}
                        valuePropName="checked"
                    >
                        <Checkbox onChange={onTicketsTimeFlagChange}>
                            活动结束前均可报名
                        </Checkbox>
                    </Form.Item>
                    {(() => {
                        if (ctx.keys[field.key]) return <Fragment />;
                        return <Form.Item
                            {...field}
                            name={[field.name, "ticketsTime"]}
                            noStyle
                        >
                            {/* @ts-ignore */}
                            <DatePicker.RangePicker />
                        </Form.Item>;
                    })()}
                </Form.Item>
            </td>
            <td className={`${prefix}-table-cell`}>
                <Form.Item noStyle>
                    <Button shape="circle" onClick={() => remove(field.name)}>
                        <DeleteOutlined />
                    </Button>
                </Form.Item>
            </td>
        </tr>
    )
}

type TicketsTableComponents = React.FC<TicketsTableProps> & {
    Item: React.FC<TicketsTableItemProps>;
}

const TicketsTable = TicketsTableWarp as TicketsTableComponents;

TicketsTable.Item = TicketsTableItem;