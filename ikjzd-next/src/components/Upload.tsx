import { Upload as AntdUpload } from "antd";
import { UploadChangeParam, UploadFile, UploadProps as AntdUploadProps } from "antd/lib/upload/interface";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { Response } from "@/apis";
import { compact } from "lodash";
import cookie from "cookie_js"

type Value = string | string[];

interface UploadProps extends Omit<AntdUploadProps, "onChange"> {
    value?: Value;
    onChange?: (value: Value) => void;
    updataType?: string;
}

const Upload: React.FC<UploadProps> = (props) => {
    const { value, onChange, children, ...args } = props;
    const [fileList, setFileList] = useState<UploadFile[]>();

    useEffect(() => {
        if (value && !fileList) {
            let _value_: string[];
            if (typeof value === "string") {
                _value_ = [value];
            } else {
                _value_ = [...value as string[]];
            }

            const nextValue: UploadFile[] = _value_.map((src) => ({
                url: src,
                name: src,
                uid: uuid()
            }));
            setFileList(nextValue);
        }
    }, [value]);

    const onUploadChange = (info: UploadChangeParam<UploadFile<Response<string[]>>>) => {
        if (props.updataType === 'resources') {
            const urls: string[] = info.fileList.length ? [`${info.fileList[0].response?.data[0]},${info.fileList[0].name},${info.fileList[0].size}`] : []
            onChange && onChange(urls[0]);
            setFileList(info.fileList);
        } else {
            const fileList = info.fileList.map((file) => {
                if (file.status === "done") {
                    file.url = file.response?.data[0];
                }
                return {
                    ...file,
                    uid: file.uid || uuid()
                };
            });
            const urls = compact(fileList.map(({ url }) => url));
            if (props.multiple) {
                onChange && onChange(urls);
            } else {
                onChange && onChange(urls[0]);
            }

            setFileList(fileList);
        }


    }

    const hasPlus = !fileList?.length || args.multiple && ((fileList?.length as number) < (args.maxCount as number));

    const action = `${process.env.CLIENT_API_URL}/kjzdUser/kjzdTools/uploadImage`;

    let token: string | undefined;
    if (process.browser) token = cookie.get(process.env.TOKEN_KEY);

    return <AntdUpload
        action={action}
        fileList={fileList}
        onChange={onUploadChange}
        headers={{ authorization: token ? `Bearer ${token}` : "" }}
        {...args}
    >
        {hasPlus ? children : null}
    </AntdUpload>
}

const uploadButton = (
    <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

Upload.defaultProps = {
    maxCount: 8,
    children: uploadButton
}

export default Upload;