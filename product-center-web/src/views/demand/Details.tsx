import OppoDetailsComponent from "@/components/details/OpportunityDetails";
import { Affix, Anchor, Breadcrumb, Button, Card } from "antd";
import '@/styles/demand.scss'
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DemandAnalysisEntryDetails from "@/components/details/DemandAnalysisEntryDetails";
import DevelopmentDemandEntryDetails from "@/components/details/DevelopmentDemandEntryDetails";
import TestsheetEntryDetails from "@/components/details/TestsheetEntryDetails";
import ListingInformationEntryDetails from "@/components/details/ListingInformationEntryDetails";
import { requirementPointGetDetails } from "@/api/demand";
import { LeftOutlined } from '@ant-design/icons';
import { RequirementInputInfoDetailsOV } from "@/vo/demandVo";
import { CommodityManagerPop, handleStatus } from "./NotReviewed";
import { handleRecoveryStatus } from "./Reviewed";
import EntryListingEdit from "./EntryListingEdit";
const DemandDetails: React.FC = () => {
    const history = useHistory<{ record?: any, showWeights?: boolean, isRecovery?: boolean, show?: string[], chancePointId?: string, caChe?: boolean, requirementPointId?: string }>();
    if (!history.location.state) {
        return <></>
    }
    const [requirementInputInfoDetails, setRequirementInputInfoDetails] = useState<RequirementInputInfoDetailsOV>()
    const [currentAnchor, setCurrentAnchor] = useState<string>('#opportunity-point-information')
    const chancePointId = history.location.state?.chancePointId
    console.log(history.location, 888)
    const {
        show, isRecovery, requirementPointId, showWeights, record
    } = history.location.state
    const approvedRef = React.useRef()
    useEffect(() => {
        if (requirementPointId) {
            requirementPointGetDetails(requirementPointId).then(res => {
                setRequirementInputInfoDetails(res.data)
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
        history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })

    }

    if (record.requirementType == "COST_REDUCTION") {
        return <>
            <Breadcrumb className="gc-breadcrumb">
                <Breadcrumb.Item onClick={() => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })}>
                    <LeftOutlined /><span>返回列表</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>需求详情</Breadcrumb.Item>
            </Breadcrumb>
            {/* 开发需求录入 */}
            <DevelopmentDemandEntryDetails title="降本需求录入" requirementInputInfoDetails={requirementInputInfoDetails} />
            {/* 测单信息录入 */}
            {record && ["UNLISTED", "COMPLETED"].includes(record.requirementStatus) && <TestsheetEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} />}
            {/* 上市信息录入 */}
            {record && ["COMPLETED"].includes(record.requirementStatus) && <ListingInformationEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} />}
            <Affix offsetBottom={10}>
                <Card className="gc-mt-2">
                    <Button onClick={() => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })}>
                        返回
                    </Button>
                </Card>
            </Affix>

        </>
    }
    return <dl className="gc-long-content">
        {/* <dt>
            <Anchor onClick={anchorClick} className="gc-anchor">
                <Anchor.Link className={currentAnchor == '#opportunity-point-information' ? "gc-anchor-link-active" : ''} href="#opportunity-point-information" title="机会点资料" />
                <Anchor.Link className={currentAnchor == '#demand-analysis-entry' ? "gc-anchor-link-active" : ''} href="#demand-analysis-entry" title="需求分析录入" />
                {showWeights && <Anchor.Link className={currentAnchor == '#demand-weight-calculation' ? "gc-anchor-link-active" : ''} href="#demand-weight-calculation" title="需求权重计算" />}
                {show?.includes('3') && requirementInputInfoDetails?.supplierRequirementDTO?.requirementCode && <Anchor.Link className={currentAnchor == '#development-demand-entry' ? "gc-anchor-link-active" : ''} href="#development-demand-entry" title="开发需求录入" />}
                {record && ["UNLISTED", "COMPLETED"].includes(record.requirementStatus) &&
                    <>
                        <Anchor.Link className={currentAnchor == '#test-sheet-information-entry' ? "gc-anchor-link-active" : ''} href="#test-sheet-information-entry" title="测单信息录入" />
                        <Anchor.Link className={currentAnchor == '#listing-information-entry' ? "gc-anchor-link-active" : ''} href="#listing-information-entry" title="上市信息录入" />
                    </>}
            </Anchor></dt> */}
        <dd>
            <Breadcrumb className="gc-breadcrumb">
                <Breadcrumb.Item onClick={() => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })}>
                    <LeftOutlined /><span>返回列表</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>需求详情</Breadcrumb.Item>
            </Breadcrumb>
            {/* 机会点资料 */}
            <OppoDetailsComponent chancePointId={chancePointId} />
            {/* 需求分析录入 */}
            <DemandAnalysisEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} />
            {/* 开发需求录入 */}
            {show?.includes('3') && requirementInputInfoDetails?.supplierRequirementDTO?.requirementCode && <DevelopmentDemandEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} />}
            {/* 测单信息录入 */}
            {record && ["UNLISTED", "COMPLETED"].includes(record.requirementStatus) && <TestsheetEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} />}
            {/* 上市信息录入 */}
            {record && ["COMPLETED"].includes(record.requirementStatus) && <ListingInformationEntryDetails requirementInputInfoDetails={requirementInputInfoDetails} />}
            {record && ["UNLISTED"].includes(record.requirementStatus) && <EntryListingEdit />}
            {record && !["UNLISTED"].includes(record.requirementStatus) && <Affix offsetBottom={10}>
                <Card className="gc-mt-2">
                    {show?.includes('1') && <><Button type="primary" className="gc-mr-2" onClick={
                        () => {
                            // @ts-ignore
                            approvedRef.current.handleApproved();
                        }}>
                        审核通过
                    </Button>
                        <Button type="primary" className="gc-mr-2" onClick={
                            () => { handleStatus(1, requirementPointId as string) }}>
                            拒绝
                        </Button>
                    </>}
                    {isRecovery &&
                        <Button type="primary" className="gc-mr-2" onClick={
                            () => { handleRecoveryStatus(requirementPointId as string) }}>
                            恢复状态
                        </Button>
                    }
                    <Button onClick={() => history.push({ pathname: '/qkgoods/demand/index', state: { caChe: true } })}>
                        返回
                    </Button>
                </Card>
            </Affix>}
            <CommodityManagerPop ref={approvedRef} id={requirementPointId} confirmOkCallBack={confirmOkCallBack} />
        </dd>
    </dl>
}

export default DemandDetails