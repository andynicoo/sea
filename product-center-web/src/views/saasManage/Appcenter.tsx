import { getModuleConfigList, openOrClose } from '@/api/saasManage';
import { AuthVisible } from '@/utils/url';
import { AppcenterInfo } from '@/vo/saasManageVo';
import { Card, message, Switch, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const switchFind = (item: AppcenterInfo, dataList: AppcenterInfo[]) => {
    for (let i = 0; i < dataList.length; i++) {
        if (item.moduleKey === dataList[i].moduleKey) {

            dataList[i].status = !item.status
            console.log(dataList[i].status)
            return dataList
        }
        if (dataList[i]?.moduleConfigs) {
            switchFind(item, dataList[i]?.moduleConfigs as [])
        }
    }
}
//应用中心
const Appcenter: React.FC = () => {
    const columns: ColumnsType<AppcenterInfo> = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Key',
            dataIndex: 'moduleKey',
            key: 'moduleKey',
        },
        {
            title: '控制',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, record: any) => <>{AuthVisible("AP_01") && <Switch checkedChildren="菜单显示" unCheckedChildren="菜单隐藏" checked={record.status} onChange={(checked: boolean) => switchChange(record)} />}</>
        },
    ];
    const [dataList, setDataList] = useState<any>([]);
    const switchChange = (record: AppcenterInfo) => {
        switchFind(record, dataList)
        setDataList([...dataList])
        openOrClose('id=' + record.moduleConfigId).then(res => {
            message.success('修改成功！')
        })
    }
    useEffect(() => {
        getModuleConfigList().then(res => {
            if (Array.isArray(res.data)) setDataList(res.data)
        })
    }, [])
    return <Card>
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="应用中心" key="1">
                <Table
                    rowKey={'moduleConfigId'}
                    columns={columns}
                    dataSource={dataList}
                    indentSize={30}
                    childrenColumnName={"moduleConfigs"}
                />
            </Tabs.TabPane>
        </Tabs>
    </Card>
};

export default Appcenter;