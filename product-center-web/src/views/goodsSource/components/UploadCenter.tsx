import { PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Input, Tag, Tooltip, Modal, Tabs, Form, Select, Drawer, DatePicker, Button, Table, message } from 'antd';
import type { TablePaginationConfig } from 'antd/lib/table';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useToggle, useRequest, useMount, useUpdateEffect } from 'ahooks';
import { exportRecord } from '@/api/goodsSource';
import {getMenus} from '@/api/public';
import moment from 'moment';

const DownRecord = () => {
  const [form] = Form.useForm();
  const [menuId, setMenuId] = useState('')
  const [searchParams, setSearchParams] = useState({
    importExport: 'EXPORT',
    current: 1,
    size: 10,
  });
  const { data: dataSource, loading: searchLoading, run: searchApi } = useRequest(exportRecord, { manual: true});
  const columns: ColumnsType<any> = [
    { title: '下载内容', dataIndex: 'title', width: 120, align: 'center', },
    { title: '下载时间', dataIndex: 'createTime', width: 120, align: 'center', },
    { title: '下载状态', dataIndex: 'dataStatus', width: 120,align: 'center', render(_, record){
      const SuccessTag = <Tag color="green">成功</Tag>
      const FailTag = <Tag color="volcano">失败</Tag>
      // const SuccessTag = <Tag color="green">成功</Tag>
      return _ === 'FINISH' ? SuccessTag : FailTag
    } },
    { title: '操作人', dataIndex: 'createBy',align: 'center', width: 120 },
    { title: '操作', dataIndex: 'productCode',align: 'center', width: 120, render(_, record){return <a type="_blank" href={record.oldAddress}>下载</a>} },
  ];
  const onPageChange = (    pagination: TablePaginationConfig,  ) => {
    setSearchParams({
      ...searchParams,
      current: Number(pagination.current),
      size: Number(pagination.pageSize),
    });
  };
  const onFinish = (fieldsValue: any, isInit?: boolean) => {
    if(!menuId) return message.error('暂无权限')
    const rangeValue = fieldsValue['range-picker'];
    const params = {
      ...searchParams,
      current: isInit ? 1 : searchParams.current,
      dataStatus: fieldsValue['fieldsValue'],
      createTimeStart: rangeValue?.[0].format('YYYY-MM-DD 00:00:00'),
      createTimeEnd: rangeValue?.[1].format('YYYY-MM-DD 23:59:59'),
    };
    searchApi(params, menuId);
  };
  useUpdateEffect(()=>{
    onFinish(form.getFieldsValue())
  }, [searchParams.current,searchParams.size, menuId])
  useMount(async ()=> {
    const menuRes = JSON.parse(localStorage.getItem('menuList' ) || '[]')
    const pathname = location.pathname.substr(1);
    const menuObj = menuRes.find((item: any) => item.path === pathname);
    if(!menuObj) return message.error('暂无权限')
    setMenuId(menuObj.menuId)
  })
  return (
    <>
      <Form layout="inline" form={form} onFinish={(e) => onFinish(e, true)} initialValues={{ 'range-picker': [moment().subtract(7, 'days'), moment()] }}>
        <Form.Item name="range-picker">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="reset">
            重置
          </Button>
        </Form.Item>
      </Form>
      <Table
        loading={searchLoading}
        className="gc-goods-source-single qiankun-gc-wrap"
        style={{ marginTop: 20 }}
        rowKey={'id'}
        columns={columns}
        dataSource={dataSource?.records}
        onChange={onPageChange}
        pagination={{
          total: dataSource?.total,
          current: Number(dataSource?.current) || 1,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 条`,
          pageSize: dataSource?.size,
        }}
      />
    </>
  );
};

const UploadRecord = () => {
  const [form] = Form.useForm();

  const [menuId, setMenuId] = useState('')
  const [searchParams, setSearchParams] = useState({
    importExport: 'IMPORT',
    current: 1,
    size: 10,
  });
  const { data: dataSource, loading: searchLoading, run: searchApi } = useRequest(exportRecord, { manual: true, onError(e){return message.error(e.message)}, onSuccess(data, params) {
    if(!data.size){
      return message.error('服务异常')
    }
  },});
  const columns: ColumnsType<any> = [
    { title: '上传内容', dataIndex: 'title', width: 120, align: 'center', },
    { title: '上传时间', dataIndex: 'createTime', width: 120, align: 'center', },
    { title: '数据处理状态', dataIndex: 'dataStatus', width: 120,align: 'center', render(_, record){
      const SuccessTag = <Tag color="green">成功</Tag>
      const FailTag = <Tag color="volcano">失败</Tag>
      const Artlycompleted = <Tag color="blue">部分完成</Tag>
      const Unfinished = <Tag color="blue">处理中</Tag>
      const tags: {
        [x: string]: React.ReactNode
      } = {
        FINISH: SuccessTag,
        ARTLYCOMPLETED: Artlycompleted,
        FAIL: FailTag,
        // 当前时间超过创建时间的30分钟. 就判断为失败
        UNFINISHED: moment().diff(moment(record.createTime), 'minutes') >= 30 ? FailTag : Unfinished
      }
      return tags[_]
    } },
    { title: '成功数量/失败数量', dataIndex: 'createTime', width: 120, align: 'center',render(_, record){ return <><Tag color="green" style={{margin: 0}}>{record.successfulRecord || 0}</Tag> / <Tag color="volcano">{record.failureRecord || 0}</Tag></>}  },
    { title: '备注', dataIndex: 'dataStatus', width: 120,align: 'center', render(_, record){
      const TimeOut = (_ === 'UNFINISHED' &&  moment().diff(moment(record.createTime), 'minutes') ? <span className='text-danger'>数据处理超时, 请重试</span> : '')
      return record.remark ||  TimeOut
    }},
    { title: '操作人', dataIndex: 'createBy',align: 'center', width: 120 },
    { title: '操作', dataIndex: 'productCode',align: 'center', width: 120, render(_, record){return record.newAddress ? <a type="_blank" href={record.newAddress}>下载处理结果</a> : <a type="_blank" className='text-danger' href={record.oldAddress}>原文件</a>} },
  ];
  const onPageChange = (    pagination: TablePaginationConfig,  ) => {
    setSearchParams((searchParams) => ({
      ...searchParams,
      current: Number(pagination.current),
      size: Number(pagination.pageSize),
    }));
  };
  const onFinish = (fieldsValue: any, isInit?: boolean) => {
    if(!menuId) return message.error('暂无权限')
    const rangeValue = fieldsValue['range-picker'];
    const params = {
      ...searchParams,
      current: isInit ? 1 : searchParams.current,
      dataStatus: fieldsValue['fieldsValue'],
      createTimeStart: rangeValue?.[0].format('YYYY-MM-DD 00:00:00'),
      createTimeEnd: rangeValue?.[1].format('YYYY-MM-DD 23:59:59'),
    };
    searchApi(params, menuId);
  };
  useUpdateEffect(()=>{
    console.log(111)
    onFinish(form.getFieldsValue())
  }, [searchParams.current,searchParams.size, menuId])
  useMount(async ()=>{
    const menuRes = JSON.parse(localStorage.getItem('menuList' ) || '[]')
    const pathname = location.pathname.substr(1);
    const menuObj = menuRes.find((item: any) => item.path === pathname);
    if(!menuObj) return 
    setMenuId(menuObj.menuId)
  })
  return (
    <>
      <Form layout="inline" form={form} onFinish={(e) => onFinish(e, true)} initialValues={{ 'range-picker': [moment().subtract(7, 'days'), moment()] }}>
        <Form.Item name="range-picker">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="reset">
            重置
          </Button>
        </Form.Item>
      </Form>
      <Table
        loading={searchLoading}
        className="gc-goods-source-single qiankun-gc-wrap"
        style={{ marginTop: 20 }}
        rowKey={'id'}
        columns={columns}
        dataSource={dataSource?.records}
        onChange={onPageChange}
        pagination={{
          total: dataSource?.total,
          current: Number(dataSource?.current) || 1,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 条`,
          pageSize: dataSource?.size,
        }}
      />
    </>
  );
};

const DownComponents = (props: any) => {
  const [modalState, { toggle }] = useToggle();

  const items: TabsProps['items'] = [
    {
      label: `上传记录`,
      key: '1',
      children: <UploadRecord />,
    },
    {
      label: `下载记录`,
      key: '2',
      children: <DownRecord />,
    },
  ];

  return (
    <>
      <Button type="link" onClick={toggle}>
        上传/下载中心
      </Button>
      <Drawer title="上传/下载中心查询" destroyOnClose placement="right" onClose={toggle} open={modalState} width="85vw" key="13">
        <div className="tip-wrapper">
          <div style={{ color: '#2d8cf0', marginRight: 6 }}>
            <ExclamationCircleFilled />
          </div>
          <div className="tip-content">
            <div>1.批量上传、批量下载仅针对个人记录，操作人A无法查看操作人B的上传、下载内容；</div>
            <div>2.操作记录仅保留近1个月数据；</div>
            <div>3.下载文件需要导出方可使用；</div>
          </div>
        </div>
        <div>
          <Tabs defaultActiveKey="1" items={items}></Tabs>
        </div>
      </Drawer>
    </>
  );
};

export default DownComponents;
