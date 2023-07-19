import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { cloneDeep, difference } from 'lodash';
import React, { useEffect, useState } from 'react';

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
interface UploadComponentProps {
    btnTxt?: string;
    length?: number;
    onChange?: (value: string[]) => void;
    value?: string[];
}
const UploadComponent: React.FC<UploadComponentProps> = (props) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [oneFileList, setOneFileList] = useState(true);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
        const { status } = file;
        if (status == 'done') {
            setOneFileList(false)
            let urlList: string[] = newFileList.map(item => {
                return item.url || item.response.data.fileUrl
            })
            props.onChange && props.onChange(urlList);
        }
        setFileList(newFileList);

    }
    const handleRemove = (file: UploadFile) => {
        let oldUrl = cloneDeep(props.value)
        let newUrl = difference(oldUrl, [file.url || file.response?.data.fileUrl])
        props.onChange && props.onChange(newUrl);
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{props?.btnTxt || "上传图片"}</div>
        </div>
    );
    useEffect(() => {
        if (props.value && oneFileList) {
            const newFileList: any = props.value?.map((item, key) => { return { uid: 'img' + key, name: '图片' + key, url: item } })
            setFileList(newFileList)
            setOneFileList(false)
        }
    }, [props.value])
    return <div style={{ "height": "112px" }}>
        <Upload
            action={`${process.env.REACT_APP_BASE_URL}/file/oss/feign/upload2`}
            data={{
                'prefix': 'productcenter'
            }}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={handleRemove}
        >
            {fileList.length >= (props.length || 1) ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
    </div>
};

export default UploadComponent;