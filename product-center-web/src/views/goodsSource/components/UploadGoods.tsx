import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, Tooltip, Modal, Spin, message, Button,Space } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useEffect, useRef, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { importProductInfoPrice } from '@/api/goodsSource';
import { ossUpload } from '@/api/public';
import { download } from '@/utils/commonUtils';
import UploadDragger from '@/components/UploadDragger';

interface Props {
    queryParams: any
}
const mainComponents = () => {
  const [modalState, { setTrue: modalStateSetTrue, setFalse: modalStateSetfalse }] = useBoolean();

  const [fileList, setFileList] = useState<any[]>([])

  const { loading: ossLoading, runAsync: ossApi,  data: ossObj } = useRequest(ossUpload, {
    manual: true,
  });
  const { loading: apiLoading, run: upLoadApi, } = useRequest(importProductInfoPrice, {
    manual: true,
    onError:(res) => {
      // message.error('服务器繁忙,请稍后再试!')
    },
    onSuccess: (res) => {
      if(res.code !== 0) {
        return message.error(res?.message || '服务器繁忙,请稍后再试!')
      }
      message.success('上传成功, 请在上传/下载中心查看处理结果');
      modalStateSetfalse()
    },
  });
  
  const onChangeFile = (fileList: RcFile[]) => {
      console.log('file :>> ', fileList);
      setFileList([...fileList])
  }
  const onSubmit = async () => {
    if(fileList.length === 0) return message.warning('请先上传商品价格表')
    const formData = new FormData();
    formData.append('file', fileList[0] as RcFile);
    formData.append('prefix', 'productcenter/price');
    const res = await ossApi(formData)
    console.log('ossObj :>> ', ossObj);
    if(!res) return
    if(!res.data.fileUrl) return
    upLoadApi({path: res.data.fileUrl})
  };

  return (
    <div>
      <Spin spinning={apiLoading}>
        <Button block type="text" onClick={modalStateSetTrue}>
          批量修改商品价格
        </Button>
      </Spin>
      <Modal
        width={650}
        title={<><div className='title'>批量修改商品价格</div><div className='desc'>请按照说明操作</div></>}
        destroyOnClose
        open={modalState}
        onCancel={modalStateSetfalse}
        footer={false}
      >
        <>
          <h3 className='step-title' style={{marginTop: 0}}>步骤1：下载商品信息价格表</h3>
          <p className='text-desc'>
            <span className='text-danger'>根据搜索条件, 并搜索出商品</span><br/>
            点击"功能按钮 ={'>'} 下载商品价格表"按钮<br/>
            等待文件下载<br/>
          </p>
          <h3 className='step-title'>步骤2：编辑需要上传的信息</h3>
          <p className='text-desc'>
            根据需求. 编辑数据. 可编辑数据为服务价格、原价、最低价、续费价<br/>
            <span className='text-danger'>注意：其他数据都不可变更</span><br/>
          </p>
          <h3 className='step-title'>步骤3：上传编辑好的商品信息价格表</h3>
          <p className='text-desc'>
            将编辑好的文件上传；<br />
            提示上传成功. 视为完成上传, 具体的修改结果可在"上传/下载中心"查看<br />
            <span className='text-danger'>注意:</span><br />
            文件大小{'<'}100M；<br />
            表格信息中如果已有重复数据，系统将自动覆盖历史数据信息；<br />
          </p>
            <Spin spinning={ossLoading || apiLoading}>
              <div style={{width: 400, marginTop: 20}}>
                <UploadDragger  onChange={onChangeFile} />
              </div>
            </Spin>
            <div style={{textAlign: 'center', marginTop: 40}}>
            <Space size={'large'}>
              <Button onClick={modalStateSetfalse}>取消</Button>
              <Button type="primary" onClick={onSubmit} loading={ossLoading || apiLoading}>批量上传</Button>
            </Space>
            </div>
        </>
      </Modal>
    </div>
  );
};

export default mainComponents;
