import createEmotion from "@emotion/css/create-instance";
import { Select, Space } from "antd";
import { ServeType } from "@/vo/Hegui";
import React, { Fragment, useState } from "react";

const { css, cx } = createEmotion({
    key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});

const OptionBox: React.FC = () => {
    const cls = css`
    background: #f5f5f5;
    padding: 20px 22px 20px 22px;
    height: 110px;
    position: absolute;
    width: 100%;
    bottom: -160px;
    border-radius: 4px;
    h2 {
      margin-bottom: 15px;
      font-size: 16px;
    }
  `;

    const selectOption: ServeType[] = [
        { name: "注册海外公司", url: "/hegui/register/abr" },
        {
            name: "注册香港公司",
            url: "/hegui/register/hk",
        },
        {
            name: "注册美国公司",
            url: "/hegui/register/usa",
        },
        {
            name: "注册英国公司",
            url: "/hegui/register/uk",
        },
        {
            name: "注册纳闽公司",
            url: "/hegui/register/lab",
        },
        {
            name: "注册BVI公司",
            url: "/hegui/register/bvi",
        },
        {
            name: "注册开曼公司",
            url: "/hegui/register/km",
        },
        {
            name: "注册新加坡公司",
            url: "/hegui/register/sin",
        },
        {
            name: "注册日本公司",
            url: "/hegui/register/jap",
        },
        {
            name: "注册澳大利亚公司",
            url: "/hegui/register/aus",
        },
        {
            name: "注册德国公司",
            url: "/hegui/register/ger",
        },
        {
            name: "注册印度公司",
            url: "/hegui/register/ind",
        },
        {
            name: "注册马来西亚公司",
            url: "/hegui/register/mal",
        },
        {
            name: "注册韩国公司",
            url: "/hegui/register/kor",
        },
    ];

    const { Option } = Select;
    const [value, setValue] = useState<number>(0);
    const handleChange = () => {
        // setValue(Number(value));
    };

    return (
        <div className={cx(cls)}>
            <Space>
                <Select
                    defaultValue={value.toString()}
                    style={{ width: 250 }}
                    onChange={handleChange}
                    size={"large"}
                >
                    {selectOption?.map((item, index) => (
                        <Option key={index}>{item.name}</Option>
                    ))}
                </Select>
            </Space>
        </div>
    );
};

export default OptionBox;
