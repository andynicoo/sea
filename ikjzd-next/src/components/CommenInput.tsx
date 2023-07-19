import { MainReduxState } from "@/redux/store";
import { Button, Form, Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Authorization from "@/components/Authorization";
import { VerticalAlignTopOutlined } from "@ant-design/icons";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-commen-input` });

interface CommenInputProps {
    onFinish?: ((values: FormValues) => void)
}

interface FormValues {
    content: string;
}

const CommenInput: React.FC<CommenInputProps> = (props) => {
    const userInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    const cls = css`
        height: 100px;
        background-color: #f8f8f8;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        margin-bottom: 20px;

        .${process.env.CLASS_PREFIX}-btn-link {
            color: ${process.env.PRIMARY_COLOR};
        }
    `;

    if (!userInfo) {
        return (
            <div className={cls}>
                <Authorization.Valid>
                    <Button type={"link"}>
                        登录
                    </Button>
                </Authorization.Valid>
                <span>后参与评论</span>
            </div>
        )
    }

    return (
        <Form<FormValues> onFinish={props.onFinish}>
            <Form.Item
                className="mb-[10px]"
                name={"content"}
                rules={[{ required: true, message: "评论内容不能为空" }]}
            >
                <Input.TextArea
                    rows={6}
                    placeholder={"说点什么吧"}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type={"primary"}
                    className={"float-right"}
                    htmlType={"submit"}
                >
                    <VerticalAlignTopOutlined />
                    发表
                </Button>
            </Form.Item>
        </Form>
    )
}

export default CommenInput;