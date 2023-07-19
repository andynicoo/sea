import OppoDetailsComponent from "@/components/details/OpportunityDetails";
import { Affix, Breadcrumb, Button, Card, Input, message, Modal, Select } from "antd";
import '@/styles/demand.scss'
import React, { Key, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DemandAnalysisEntryDetails from "@/components/details/DemandAnalysisEntryDetails";
import DevelopmentDemandEntryDetails from "@/components/details/DevelopmentDemandEntryDetails";
import TestsheetEntryDetails from "@/components/details/TestsheetEntryDetails";
import { LeftOutlined, ExclamationCircleOutlined, InboxOutlined, DeleteOutlined, PaperClipOutlined } from '@ant-design/icons';
import { RequirementInputInfoDetailsOV } from "@/vo/demandVo";
import { assignFollower, auditContract, supplierRequirementDetail, uploadContractFile, uploadContractFileComplete, uploadContractFileDelete } from "@/api/supply";
import { UsersInfoVO } from "@/vo/baseVo";
import { useSelector } from "react-redux";
import Upload, { UploadChangeParam, UploadFile, UploadProps } from "antd/lib/upload";
import { AuthVisible } from "@/utils/url";
const SupplyDetails: React.FC = () => {
    const users = useSelector((state: any) => state.global.usersAll)
    const history = useHistory<{ caChe?: boolean, requirementCode?: string, record?: any }>();
    if (!history.location.state) {
        return <></>
    }
    const {
        requirementCode,
        record
    } = history.location.state
    const [requirementInputInfoDetails, setRequirementInputInfoDetails] = useState<RequirementInputInfoDetailsOV>()
    const [currentAnchor, setCurrentAnchor] = useState<string>('#opportunity-point-information')

    const [currId, setCurrId] = useState<string>();
    const [followValue, setFollowValue] = useState<any[]>([]);
    const [followVisible, setFollowVisible] = useState<boolean>(false);
    const [uploadContractVisible, setUploadContractVisible] = useState<boolean>(false)
    const [contractsList, setContractsList] = useState<any>();
    const [reasonsRejection, setReasonsRejection] = useState<string>('')
    const [auditVisible, setAuditVisible] = useState<boolean>(false)
    useEffect(() => {
        if (requirementCode) {
            supplierRequirementDetail({ requirementCode: requirementCode }).then(res => {
                setRequirementInputInfoDetails(res.data as RequirementInputInfoDetailsOV);
            })
        }
    }, [])
    //锚点点击
    const anchorClick = (
        e: React.MouseEvent<HTMLElement>,
        link: {
            title: React.ReactNode;
            href: string;
        },
    ) => {
        e.preventDefault();
        setCurrentAnchor(link.href)
    };
    const confirmOkCallBack = () => {
        history.push({ pathname: '/qkgoods/supply/index', state: { caChe: true } })

    }
    //指派跟进人弹窗
    const handleFollow = (id: string, follower: string) => {
        setCurrId(id)
        let followerHandle: any = []
        if (follower) {
            followerHandle = JSON.parse(follower)
        }
        console.log(followerHandle)
        setFollowValue(followerHandle)
        setFollowVisible(true);
    }
    //确认跟进人
    const followOk = () => {
        console.log(followValue)
        const followers: string[] = followValue.map(item => item.value) as string[]
        const followerNames: string[] = followValue.map(item => item.label) as string[]
        assignFollower({ id: currId, followers, followerNames }).then(res => {
            message.success('操作成功')
            confirmOkCallBack()
        })
        setFollowVisible(false);
    };
    //选择跟进人
    const followChange = (value: any) => {
        setFollowValue(value)
    };
    //上传合同
    const contractsChange: any = (info: UploadChangeParam<UploadFile<any>>) => {
        const { status } = info.file;
        if (status == 'done') {
            console.log(info.fileList)
            const fileUrl = info.fileList[info.fileList.length - 1].response.data.fileUrl
            const origFileName = info.fileList[info.fileList.length - 1].response.data.origFileName
            uploadContractFile({ fileUrl, origFileName, id: currId as string }).then(res => {
                message.success('上传成功！')
            })
        }


    }
    //上传合同弹窗
    const contractUploadPop = (id: string, contractUrl: string) => {
        if (contractUrl) {
            setContractsList(JSON.parse(contractUrl))
        }
        setCurrId(id)
        setUploadContractVisible(true)
    }
    //合同上传完成
    const contractUploadCompleted = (id: string) => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '你确定合同已经上传完成吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => contractConfirmOk(id)
        });
    }
    const uploadContractOk = () => {
        contractUploadCompleted(currId as string)
    }
    const contractConfirmOk = async (supplierRequirementId: string) => {
        await uploadContractFileComplete({ id: supplierRequirementId })
        setUploadContractVisible(false)
        message.success('操作成功！')
        confirmOkCallBack()

    }
    //删除合同
    const contractFileDeleteFn = async (origFileName: string, fileUrl: string) => {
        await uploadContractFileDelete({ fileUrl, origFileName, id: currId as string })
        const contractsListHandle = contractsList && contractsList.filter((item: any) => item.fileUrl != fileUrl)
        setContractsList(contractsListHandle)
        message.success('操作成功！')
    }
    const props: UploadProps = {
        name: 'file',
        action: `${process.env.REACT_APP_BASE_URL}/file/oss/feign/upload2`,
        data: {
            'prefix': 'productcenter/contract'
        },
        accept: "image/*,.pdf",
        // maxCount: 1,
        headers: {
            authorization: 'authorization-text',
        },

    };
    //合同审核通过
    const handleApprovedPassed = (supplierRequirementId: string) => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '你确定审核通过该需求吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => confirmOk(supplierRequirementId)
        });
    }
    const confirmOk = async (supplierRequirementId: string) => {
        await auditContract({ id: supplierRequirementId, auditResult: 'PASSED' })
        message.success('操作成功！')
        confirmOkCallBack()

    }
    //审核拒绝
    const handleApprovedRefused = (supplierRequirementId: string) => {
        setCurrId(supplierRequirementId)
        setAuditVisible(true)
    }
    const reasonsRejectionOk = async () => {
        if (!reasonsRejection) return message.warning('请输入驳回理由！')
        await auditContract({ id: currId as string, auditResult: 'REFUSED', reason: reasonsRejection })
        message.success('操作成功！')
        setAuditVisible(false)
        confirmOkCallBack()
    }
    let DetailsDOM
    if (record.requirementType == "COST_REDUCTION") {
        DetailsDOM = <>
            <Breadcrumb className="gc-breadcrumb">
                <Breadcrumb.Item onClick={() => confirmOkCallBack()}>
                    <LeftOutlined /><span>返回列表</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>需求详情</Breadcrumb.Item>
            </Breadcrumb>
            {/* 开发需求录入 */}
            <DevelopmentDemandEntryDetails title="降本需求录入" requirementInputInfoDetails={requirementInputInfoDetails} />
            {/* 测单信息录入 */}
            {record.supplierRequirementStatus == "TEST_ORDER_COMPLETED" &&
                <TestsheetEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} />
            }

        </>
    } else {
        DetailsDOM = <><dl className="gc-long-content">
            {/* <dt>
            <Anchor onClick={anchorClick} className="gc-anchor">
                {record.requirementType != "COST_REDUCTION" && <><Anchor.Link className={currentAnchor == '#opportunity-point-information' ? "gc-anchor-link-active" : ''} href="#opportunity-point-information" title="机会点资料" />
                    <Anchor.Link className={currentAnchor == '#demand-analysis-entry' ? "gc-anchor-link-active" : ''} href="#demand-analysis-entry" title="需求分析录入" /></>}
                <Anchor.Link className={currentAnchor == '#development-demand-entry' ? "gc-anchor-link-active" : ''} href="#development-demand-entry" title="开发需求录入" />
                {record.supplierRequirementStatus == "TEST_ORDER_COMPLETED" && <Anchor.Link className={currentAnchor == '#test-sheet-information-entry' ? "gc-anchor-link-active" : ''} href="#test-sheet-information-entry" title="测单信息录入" />}

            </Anchor></dt> */}
            <dd>
                <Breadcrumb className="gc-breadcrumb">
                    <Breadcrumb.Item onClick={() => confirmOkCallBack()}>
                        <LeftOutlined /><span>返回列表</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>需求详情</Breadcrumb.Item>
                </Breadcrumb>
                {/* 机会点资料 */}
                {record.requirementType != "COST_REDUCTION" && <><OppoDetailsComponent requirementInputInfoDetails={requirementInputInfoDetails} />
                    {/* 需求分析录入 */}
                    <DemandAnalysisEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} /></>}
                {/* 开发需求录入 */}
                {<DevelopmentDemandEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} />}
                {/* 测单信息录入 */}
                {record.supplierRequirementStatus == "TEST_ORDER_COMPLETED" &&
                    <TestsheetEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} />
                }
                {/* 上市信息录入 */}
                {/* <ListingInformationEntryDetails oppoInfo={oppoInfo} /> */}

            </dd>
        </dl>
        </>
    }
    return <>{DetailsDOM}
        <Affix offsetBottom={10}>
            <Card className="gc-mt-2">
                {AuthVisible("SUPPLY1_1") && record.supplierRequirementStatus == 'PENDING_DEVELOP' && <Button type="primary" className="gc-mr-2" onClick={
                    () => handleFollow(record.supplierRequirementId, record.follower)}>
                    指派跟进人
                </Button>}
                {AuthVisible("SUPPLY1_3") && record.supplierRequirementStatus == 'DEVELOPING' && <Button type="primary" className="gc-mr-2" onClick={
                    () => contractUploadPop(record.supplierRequirementId, record.contractUrl)}>
                    上传合同
                </Button>}
                {AuthVisible("SUPPLY1_4") && record.supplierRequirementStatus == "COMPLETE_CONTRACT" && <><Button type="primary" className="gc-mr-2" onClick={
                    () => {
                        handleApprovedPassed(record.supplierRequirementId);
                    }}>
                    审核通过
                </Button>
                    <Button type="primary" className="gc-mr-2" onClick={
                        () => { handleApprovedRefused(record.supplierRequirementId) }}>
                        拒绝
                    </Button>
                </>}
                <Button onClick={() => confirmOkCallBack()}>
                    返回
                </Button>
            </Card>
        </Affix>
        <Modal title="指派跟进人" visible={followVisible} onOk={followOk} onCancel={() => setFollowVisible(false)}>
            请选择：<Select
                value={followValue}
                onChange={followChange}
                mode="multiple"
                labelInValue
                showSearch
                optionFilterProp="label"
                placeholder="请选择"
                optionLabelProp="label"
                style={{ width: "400px" }}
                filterOption={(input, option) => {
                    if (typeof (option?.label) !== "string") return false
                    return (option?.label as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                }
            >
                <Select.OptGroup label={<div className="gc-select-title"><span>姓名</span><span>手机</span><span>部门</span></div>}>
                    {users.map((item: UsersInfoVO) => (
                        <Select.Option value={item.userId} key={item.userId} label={item.nickName}>
                            <div className="gc-select-option">
                                <span>{item.nickName}</span>
                                <span>{item.mobile}</span>
                                <span>{item.departmentName}</span>
                            </div>
                        </Select.Option>
                    ))}
                </Select.OptGroup>
            </Select>
        </Modal>
        <Modal title={"驳回"} onOk={reasonsRejectionOk} onCancel={() => setAuditVisible(false)} visible={auditVisible}>
            <Input.TextArea
                onChange={e => setReasonsRejection(e.target.value)}
                value={reasonsRejection}
                placeholder="请输入驳回理由！"
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
        </Modal>
        <Modal title={"上传合同"} okText="合同上传完成" onOk={uploadContractOk} onCancel={() => setUploadContractVisible(false)} visible={uploadContractVisible}>
            <Upload.Dragger {...props} onChange={(info) => contractsChange(info)}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                <p className="ant-upload-hint">
                    支持：jpg、jpge、png、pdf
                </p>
            </Upload.Dragger>
            {contractsList && contractsList.map((item: any, key: Key) => {
                return <div key={key} className="gc-contract-list">
                    <span><PaperClipOutlined className="gc-contract-ic" />{item.origFileName}</span>
                    <DeleteOutlined onClick={() => contractFileDeleteFn(item.origFileName, item.fileUrl)} className="gc-contract-delete" />
                </div>
            })}
        </Modal>
    </>

}

export default SupplyDetails