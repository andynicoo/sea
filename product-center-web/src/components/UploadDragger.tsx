import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import React, { useState } from 'react';

const { Dragger } = Upload;

interface Props {
  onChange: (fileList: any[]) => void;
  accept?: UploadProps['accept']
}

const App: React.FC<Props> = (props) => {
  const [fileList, setFileList] = useState<any[]>([]);

  const defaultProps: UploadProps = {
    accept: props.accept || '.xls,.xlsx',
    maxCount: 1,
    multiple: true,
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      props.onChange([...fileList, file]);
      return false;
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };
  return (
    <Dragger {...defaultProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p style={{ fontSize: 12, color: '#666666' }}>点击或将文件拖拽到这里上传</p>
    </Dragger>
  );
};

export default App;
