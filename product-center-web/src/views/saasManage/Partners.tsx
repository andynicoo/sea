import '@/styles/saasManage.scss'
import { Button, Card, Form, Input, InputNumber, Modal, Switch, Table, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { FormOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UploadComponent from '@/components/UploadComponent';
import { friendLinkAdd, friendLinkDel, friendLinkEdit, friendLinkList } from '@/api/saasManage';
import { PartnersInfo } from '@/vo/saasManageVo';
import { validaHttps } from '@/utils/commonUtils';
import { cloneDeep } from 'lodash';
import { QueryParams, ResponseDataVO } from '@/vo/baseVo';
import { AuthVisible } from '@/utils/url';

//合作伙伴
const Appcenter: React.FC = () => {
    const columns: ColumnsType<PartnersInfo> = [
        {
            title: '标题',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Logo',
            dataIndex: 'picUrl',
            key: 'picUrl',
            render: (_, record) => <img src={record.picUrl} width={130} />
        },
        {
            title: '跳转链接',
            dataIndex: 'link',
            key: 'link',
            width: 300,
            render: (_, record) => <a href={record.link} target="_blank">{record.link}</a>
        },
        {
            title: '排序',
            key: 'sort',
            dataIndex: 'sort'
        },
        {
            title: '是否开启',
            key: 'status',
            dataIndex: 'status',
            render: (_, record) => <>{record.status ? <Tag color="green">开启</Tag> : <Tag color="red">禁用</Tag>}</>

        },
        {
            title: '操作人',
            key: 'createBy',
            dataIndex: 'createBy'
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => <div className="gc-table-btn gc-fs-15">
                {AuthVisible("PA_01") && <Tooltip title="编辑"><FormOutlined onClick={() => addEdit(2, record)} /></Tooltip>}
                {AuthVisible("PA_02") && <Tooltip title="删除"><DeleteOutlined onClick={() => deletePartners(record)} /></Tooltip>}
            </div>,
        },
    ];
    let queryParamsDefault = { current: 1, size: 20, linkType: 1 }
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState<number>(1);
    const [currId, setCurrId] = useState('');
    const [partnersData, setPartnersData] = useState<ResponseDataVO<PartnersInfo>>();
    const [form] = Form.useForm();
    const [queryParams, setQueryParams] = useState<QueryParams>(queryParamsDefault);
    //新增编辑
    const addEdit = (type: number, record?: PartnersInfo) => {
        setModalType(type)
        setIsModalVisible(true);
        if (type == 2) {
            setCurrId(record?.yqLinkId as string)
            form.setFieldsValue({ ...record, picUrl: [record?.picUrl] })
        } else {
            form.resetFields()
        }
    };
    //保存
    const handleOk = () => {
        form.validateFields()
            .then(values => {
                let paramas = cloneDeep(values)
                paramas.picUrl = paramas.picUrl[0]
                paramas.linkType = 1
                if (modalType == 2) {
                    friendLinkEdit(paramas, currId).then(res => {
                        setIsModalVisible(false);
                        getData()
                    })
                } else {
                    friendLinkAdd(paramas).then(res => {
                        setIsModalVisible(false);
                        getData()
                    })
                }

            })
    };
    //删除
    const deletePartners = (record: PartnersInfo) => {
        Modal.confirm({
            title: '删除确认',
            icon: <ExclamationCircleOutlined />,
            content: `确定删除：${record.name}？删除后不可恢复`,
            onOk() {
                friendLinkDel(`id=${record.yqLinkId}`).then(res => {
                    getData()
                })
            },
        });
    }
    //table分页改变
    const onPageChange = (pagination: TablePaginationConfig) => {
        setQueryParams({
            ...queryParams,
            current: Number(pagination.current),
            size: Number(pagination.pageSize)
        })
    }
    //获取数据
    const getData = () => {
        setTableLoading(true)
        friendLinkList(queryParams).then(res => {
            setPartnersData(res.data)
            setTableLoading(false)
        }).catch(err => {
            setTableLoading(false)
        })
    }
    useEffect(getData, [queryParams])
    return <>
        <Card>
            <span className='gc-fs-18'>合作伙伴 </span>{AuthVisible("PA_01") && <Button onClick={() => addEdit(1)} className='gc-fr' type='primary'>新增合作伙伴</Button>}
        </Card>
        <Card className='gc-mt-2'>
            <Table
                rowKey={"yqLinkId"}
                loading={tableLoading}
                columns={columns}
                dataSource={partnersData?.records}
                onChange={onPageChange}
                pagination={{
                    total: Number(partnersData?.total),
                    current: Number(partnersData?.current) || 1,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total: number) => `共 ${total} 条`,
                    pageSize: Number(partnersData?.size)
                }} />
        </Card>
        <Modal destroyOnClose width={600} title={`${modalType == 1 ? '新增' : '编辑'}合作伙伴`} visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
            <Form
                name="basic"
                form={form}
                autoComplete="off"
                className='sm-website-form'
            >
                <Form.Item
                    label="合作伙伴名称"
                    name="name"
                    rules={[{ required: true, message: '请输入合作伙伴名称!' }]}
                >
                    <Input maxLength={16} placeholder="请输入合作伙伴名称（最多16个字符）" />
                </Form.Item>

                <Form.Item
                    label="合作伙伴链接"
                    name="link"
                    rules={[{ validator: (rule, value, callback) => validaHttps(rule, value, callback) }]}
                >
                    <Input placeholder="请输入http或者https开头的完整链接。" />
                </Form.Item>
                <Form.Item
                    label="排序"
                    name="sort"
                >
                    <InputNumber defaultValue={0} min={0} precision={0} />
                </Form.Item>
                <Form.Item
                    label="图片"
                    name="picUrl"
                    rules={[{ required: true, message: '请上传图片!' }]}
                    extra="建议尺寸：224*132像素，支持jpg、jpeg、png，"
                >
                    <UploadComponent btnTxt="上传图片" length={1} />
                </Form.Item>
                <Form.Item
                    label="状态"
                    name="status"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

            </Form>
        </Modal>
    </>
};

export default Appcenter;