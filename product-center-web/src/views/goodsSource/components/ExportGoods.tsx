import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, Tooltip, Modal, Spin, message, Button } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useToggle, useRequest } from 'ahooks';
import { priceModelExport } from '@/api/goodsSource';
import { download } from '@/utils/commonUtils';

interface Props {
  queryParams: any;
}
const DownComponents = (props: Props) => {
  const [modalState, { toggle }] = useToggle();

  const { loading: apiLoading, run } = useRequest(priceModelExport, {
    manual: true,
    onSuccess: (res, params) => {
      message.success('导出成功');
      download(res, '商品列表导出文件');
    },
  });
  const onExport = () => {
    const params = {
      ...props.queryParams,
      size: '-1',
      enterpriseId: localStorage.getItem('enterpriseId'),
    };
    run(params);
    console.log(12321);
  };

  return (
    <div>
      <Spin spinning={apiLoading}>
        {props.queryParams.isCombinationProduct === 'IS_COMBINATION_PRODUCT' ? (
          <Tooltip title="组合商品不支持下载" placement="left">
            <Button disabled block type="text" onClick={onExport}>
              下载商品价格表
            </Button>
          </Tooltip>
        ) : (
          <Button block type="text" onClick={onExport}>
            下载商品价格表
          </Button>
        )}
      </Spin>
    </div>
  );
};

export default DownComponents;
