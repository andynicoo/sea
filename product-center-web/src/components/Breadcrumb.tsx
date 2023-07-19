import { Breadcrumb } from "antd";
import { LeftOutlined } from '@ant-design/icons';
import React from "react";
import { useHistory } from "react-router-dom";

interface BreadCrumbProps {
    pathname: string;
    title: string;
}
//面包屑导航
const BreadCrumb: React.FC<BreadCrumbProps> = (props) => {
    const history = useHistory<{ id?: string, caChe?: boolean }>();
    return <Breadcrumb className="gc-breadcrumb">
        <Breadcrumb.Item onClick={() => history.push({ pathname: props.pathname, state: { caChe: true } })}>
            <LeftOutlined /><span>返回列表</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{props.title}</Breadcrumb.Item>
    </Breadcrumb>
}

export default BreadCrumb