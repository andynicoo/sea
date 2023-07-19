import createEmotion from "@emotion/css/create-instance";
import { Select, Space, Input, Button, message, Modal } from "antd";
import { OptionType } from "@/vo/Hegui";
import React, { Fragment, useState } from "react";
import { addClue } from "@/apis/hegui";
import { CheckCircleOutlined } from "@ant-design/icons";

const { css, cx } = createEmotion({
    key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});

const OptionBox: React.FC = () => {
    const cls = css`
    background: #fff;
    padding: 20px 22px 20px 22px;
    height: 110px;
    position: absolute;
    width: 100%;
    bottom: -60px;
    border-radius: 4px;
    h2 {
      margin-bottom: 15px;
      font-size: 16px;
    }
  `;

    const selectOption: OptionType[] = [
        { id: 0, name: "香港/海外公司注册" },
        {
            id: 1,
            name: "香港/海外公司年审查询",
        },
        {
            id: 2,
            name: "香港/海外公司税率查询",
        },
        { id: 3, name: "产品认证" },
        { id: 4, name: "国际商标专利查询" },
    ];

    const { Option } = Select;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loadings, setLoadings] = useState<boolean>(false);
    const [value, setValue] = useState<number>(0);
    const [question, setQuestion] = useState<string>("");
    const [company, setCompany] = useState<string>("");
    const [mobile, setMobile] = useState<string>("");

    const handleChange = (value: string) => {
        setValue(Number(value));
    };

    const inputChange = (e: any) => {
        setQuestion(e.target.value);
    };

    const companyChange = (e: any) => {
        setCompany(e.target.value);
    };

    const mobileChange = (e: any) => {
        setMobile(e.target.value);
    };

    const submit = async () => {
        let params = {
            business: value,
            describes: question,
            mobile: mobile,
            corporateName: company,
            platform: 1,
        };

        if (question === "") {
            message.info("请输入要查询的问题");
            return false;
        }
        if (company === "") {
            message.info("请输入联系人");
            return false;
        }
        if (mobile === "") {
            message.info("请输入联系人");
            return false;
        }
        if (mobile === "") {
            message.info("请输入手机号码");
            return false;
        }
        const reg = new RegExp("^[1][3-9][0-9]{9}$");
        if (!reg.test(mobile)) {
            message.info("请输入正确的手机号码");
            return false;
        }

        try {
            setLoadings(true);
            let { code, message: msg } = await addClue(params);
            if (code !== "0") {
                message.error(msg);
            } else {
                setIsModalVisible(true);
            }
            setLoadings(false);
        } catch (error) {
            setLoadings(false);
        }
    };

    return (
        <div className={cx(cls)}>
            <h2>
                {/* {value}--{question}--{company}--{mobile} */}
            </h2>
            <div>
                <Space>
                    <Select
                        defaultValue={value.toString()}
                        style={{ width: 250 }}
                        onChange={handleChange}
                        size={"large"}
                    >
                        {selectOption?.map((item) => (
                            <Option key={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <Input
                        placeholder="请输入您要查询的问题"
                        size={"large"}
                        value={question}
                        onChange={inputChange}
                        className="w-[250px]"
                    />
                    <Input
                        placeholder="请填写联系人"
                        size={"large"}
                        className="w-[250px]"
                        value={company}
                        onChange={companyChange}
                    />
                    <Input
                        placeholder="请填写手机号"
                        size={"large"}
                        className="w-[250px]"
                        value={mobile}
                        onChange={mobileChange}
                    />
                    <Button
                        type="primary"
                        size={"large"}
                        className="w-[130px]"
                        onClick={submit}
                        loading={loadings}
                    >
                        立即办理
                    </Button>
                </Space>
            </div>
            <Modal centered
                visible={isModalVisible}
                footer={null}
                onCancel={() => {
                    setIsModalVisible(false);
                }}
                width={360}
            >
                <div className="alert text-center">
                    <p>
                        {/* <CheckCircleOutlined /> */}
                    </p>
                    <h2 className="fs-[20px] mb-[15px] fw-600">您提交的申请已收到</h2>
                    <p className="mb-[10px]">
                        专属顾问预计在3天内联系您，请保持电话畅通，或直接扫码添加微信联系
                    </p>
                    <p>
                        <img className="w-[190px]" src={`/asset/image/flag/business_link.png`} />
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default OptionBox;
