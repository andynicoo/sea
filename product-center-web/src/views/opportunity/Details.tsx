import { Affix, Breadcrumb, Button, Card } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router";
import OppoDetailsComponent from "@/components/details/OpportunityDetails";
import { handleStatus } from "./index";
import { LeftOutlined } from '@ant-design/icons';
import { AuthVisible } from "@/utils/url";
const OppoDetails: React.FC = () => {
    const [bottom] = useState(10);
    const history = useHistory<{ id?: string, caChe?: boolean, status?: string }>();
    if (!history.location.state) {
        return <></>
    }
    const chancePointId: string = history.location.state?.id as string
    const chancePointStatus: string = history.location.state?.status as string
    return <>
        <Breadcrumb className="gc-breadcrumb">
            <Breadcrumb.Item onClick={() => history.push({ pathname: '/qkgoods/opportunity/index', state: { caChe: true } })}>
                <LeftOutlined /><span>返回列表</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>机会点详情</Breadcrumb.Item>
        </Breadcrumb>
        <OppoDetailsComponent chancePointId={chancePointId} />
        <Affix offsetBottom={bottom}>
            <Card bordered={false} className="gc-mt-2 gc-details-handle">
                {AuthVisible("OPPO1_4") && <>{chancePointStatus == 'PENDING_REVIEW' && <Button type="primary" onClick={() => { handleStatus(0, chancePointId) }}>审核通过</Button>}
                    {chancePointStatus == 'PENDING_REVIEW' && <Button type="primary" onClick={() => { handleStatus(1, chancePointId) }}>拒绝</Button>}
                    {chancePointStatus == 'PENDING_REVIEW' && <Button type="primary" onClick={() => { handleStatus(2, chancePointId) }}>搁置</Button>}
                    {chancePointStatus == 'SHELVED' && <Button type="primary" onClick={() => { handleStatus(3, chancePointId) }}>恢复状态</Button>}</>}
                <Button onClick={() => history.push({ pathname: '/qkgoods/opportunity/index', state: { caChe: true } })}>返回</Button>
            </Card>
        </Affix>
    </>
}

export default OppoDetails