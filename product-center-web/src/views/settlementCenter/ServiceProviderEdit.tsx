import { PlusOutlined } from '@ant-design/icons';
import { Alert, Card, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import ServiceProviderInfo from './ServiceProviderInfo';
import SettlementMethodConfiguration from './SettlementMethodConfiguration';
import BillingConfig from './BillingConfig';
//供应商修改信息
const ServiceProviderEdit: React.FC = () => {
  return (
    <Card bordered={false}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          tab={
            <Tooltip title="如果有修改请先保存，再切换">
              <span>服务商信息</span>
            </Tooltip>
          }
          key="1"
        >
          <ServiceProviderInfo />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Tooltip title="如果有修改请先保存，再切换">
              <span>结算方式配置</span>
            </Tooltip>
          }
          key="2"
        >
          <SettlementMethodConfiguration />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <Tooltip title="如果有修改请先保存，再切换">
              <span>采购订单结算比例配置</span>
            </Tooltip>
          }
          key="3"
        >
          <BillingConfig />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default ServiceProviderEdit;
