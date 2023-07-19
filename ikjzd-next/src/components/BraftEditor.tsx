import "braft-editor/dist/index.css";
import React, { useState } from "react";
import BraftEditor, { ControlType, EditorState, ExtendControlType } from "braft-editor";
import { Upload } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { uploadImage } from "@/apis/public";
import { ContentUtils } from "braft-utils";

interface IkjzdBraftEditorProps {
    onChange?: (value: string) => void;
    value?: string;
}

const IkjzdBraftEditor: React.FC<IkjzdBraftEditorProps> = (props) => {
    const controls: ControlType[] = ["bold", "italic", "underline", "text-color", "font-size", "font-family", "headings", "text-indent", "text-align", "list-ul", "list-ol", "separator", "link", "separator"];

    const ref = React.createRef<BraftEditor>();

    const [editorState, setEditorState] = useState(BraftEditor.createEditorState(props.value));

    const uploadHandler = (param: RcCustomRequestOptions) => {
        const fmd = new FormData();
        fmd.append("file", param.file);
        uploadImage(fmd).then((res) => {
            setEditorState(ContentUtils.insertMedias(editorState, [{
                type: "IMAGE",
                url: res.data[0]
            }]));
        })
    }

    const handleChange = (editorState: EditorState) => {
        setEditorState(editorState);
        props.onChange && props.onChange(editorState.toHTML());
    }

    const extendControls: ExtendControlType[] = [
        {
            key: "antd-uploader",
            type: "component",
            component: (
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    customRequest={uploadHandler}
                >
                    <button
                        type="button"
                        className="control-item button upload-button"
                        data-title="插入图片"
                    >
                        <PictureOutlined />
                    </button>
                </Upload>
            )
        }
    ]

    // @ts-ignore
    return <BraftEditor
        ref={ref}
        style={{ border: "1px solid #ccc" }}
        value={editorState}
        onChange={handleChange}
        controls={controls as []}
        extendControls={extendControls}
        className='braft-editor-box'
    />
}

export default IkjzdBraftEditor
