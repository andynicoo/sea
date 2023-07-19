import React, { Key, useContext, useEffect, useState } from "react";
import { follow, getKjzdUser, unFollow } from "@/apis/users";
import { Avatar, Button, Card, Col, Divider, Input, message, Modal, Popover, Row, Space } from "antd";
import { useSelector } from "react-redux";
import { MainReduxState } from "@/redux/store";
import { getUserInfo, operateLetter } from "@/apis/auth";
import { setUserInfo } from "@/redux/actions/userActions";
import Authorization from "./Authorization";
import { OperateLetterProps } from "@/vo/Auth";
import Link from "next/link";
import { UserInfo } from "@/vo/Users";

interface AuthorInfoProps {
    userId?: Key;
}

/**作者 */
const AuthorInfo: React.FC<AuthorInfoProps> = (props) => {
    const { userId } = props;
    const selfInfo = useSelector((state: MainReduxState) => state.userReducer.info);

    const [isFans, setIsFans] = useState<boolean>();
    const [authorInformation, setAuthorInformation] = useState<UserInfo>();

    const [isModalVisible, setIsModalVisible] = useState<boolean>();

    const [privateLetter, setPrivateLetter] = useState<string>('');

    /**关注 */
    const onFollow = () => {
        if (isFans) {
            /**已关注,取消关注 */
            unFollow({ userId: userId, fansUid: selfInfo?.userId }).then(() => {
                message.success("取消关注成功！");
                setIsFans(false)
            })
        } else {
            /**未关注,进行关注 */
            follow({ userId: userId, fansUid: selfInfo?.userId })
                .then(() => {
                    message.success("关注成功！");
                    setIsFans(true)
                })
        }
    }
    //发私信
    const handleOk = () => {
        let params: OperateLetterProps = {
            sendUserId: selfInfo?.userId as string,
            receiveUserId: userId as string,
            content: '1',
        }
        operateLetter(params).then((res) => {
            setIsModalVisible(false)
            setPrivateLetter('')
            message.success('发送成功！')
        })
    }
    useEffect(() => {
        getKjzdUser(userId as Key).then(res => {
            setIsFans(res.data.isFans)
            setAuthorInformation(res.data)
        })
    }, [])
    return <>
        <Card bordered={false} className={"mb-[20px]"}>
            <Popover
                placement={"bottomRight"}
                content={(
                    <img
                        src={authorInformation?.wechatImg || '/asset/image/defaultlogo.png'}
                        style={{ width: 186, height: 186 }}
                    />
                )}
            >
                <img
                    src={"/asset/image/index-banner-qr.png"}
                    className={"w-[25px] h-[25px] absolute cursor-pointer"}
                    style={{ top: 7, right: 7 }}
                />
            </Popover>
            <Space className="w-[100%]">
                <Link href={`/users/index/${userId}`}>
                    <a target={'_blank'}>
                        <Avatar src={authorInformation?.avatar} className={"mt-[10px]"} size={55} />
                    </a>
                </Link>
                <div>
                    <Link href={`/users/index/${userId}`}>
                        <a target={'_blank'}>
                            <h3 className="fs-[16px] mb-[10px]">{authorInformation?.nick}</h3>
                        </a>
                    </Link>
                    <p className="fs-[12px] color-[#999999]" >简介: {authorInformation?.individualResume || '作者很懒，还未填写简介'}</p>
                </div>
            </Space>
            <Divider />
            <Row gutter={10}>
                <Col span={12}>
                    <Authorization.Valid>
                        <Button
                            onClick={onFollow}
                            block
                            size={"large"}
                            type={"primary"}
                        >
                            {isFans ? "已关注" : "关注"}
                        </Button>
                    </Authorization.Valid>
                </Col>
                <Col span={12}>
                    <Authorization.Valid>
                        <Button
                            onClick={() => setIsModalVisible(true)}
                            block
                            size={"large"}
                        >
                            发私信
                        </Button>
                    </Authorization.Valid>
                </Col>
            </Row>
        </Card>
        <Modal centered title="发私信" visible={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
            输入私信内容
            <br />
            <Input.TextArea className="w-[475px]"
                value={privateLetter}
                onChange={(e: any) => setPrivateLetter(e.target.value)}
                autoSize={{ minRows: 5, maxRows: 8 }} />
        </Modal>
    </>
}


export default AuthorInfo;