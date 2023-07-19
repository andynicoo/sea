import React, { Key, useContext } from "react";
import { Space } from "antd";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-tabs` });

interface TabsContextProps extends TabsContentProps {

}

const TabsContext = React.createContext<TabsContextProps>({} as TabsContextProps);


interface TabsContentProps {
    activeKey?: Key;
    onChange?: (activeKey: Key) => void;
}

const TabsContent: React.FC<TabsContentProps> = (props) => {

    const { activeKey, onChange, children } = props;

    const ctxValue: TabsContextProps = {
        activeKey,
        onChange
    }

    return <TabsContext.Provider value={ctxValue}>
        <Space
            className="color-[#00000099] fs-[16px] fw-400"
            size={35}
        >
            {children}
        </Space>
    </TabsContext.Provider>
}

interface TabsItemProps {
    tabKey: Key;
    tabName: string;
    active?: boolean;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const TabsItem: React.FC<TabsItemProps> = (props) => {
    const { active, tabKey, tabName, onClick } = props;
    const { activeKey, onChange } = useContext(TabsContext);
    const _active_ = activeKey ? activeKey === tabKey : active;

    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
        onChange && onChange(tabKey);
        onClick && onClick(event);
    }

    const classns = css`
        cursor: pointer;
        transition: all 0.5s;
        position: relative;
    `;

    const activeClassns = css`
        color: #000000E6;
        font-weight: 500;

        &::before {
            content: "";
            display: block;
            width: 12px;
            height: 2px;
            background: #F676A6;
            border-radius: 100px 100px 100px 100px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 5px);
        }
    `;

    return <a
        className={cx(
            classns,
            { [activeClassns]: _active_ }
        )}
        onClick={handleClick}
    >
        {tabName}
    </a>
}

type TabsType = React.FC<TabsContentProps> & {
    Item: React.FC<TabsItemProps>;
}

const Tabs = TabsContent as TabsType;
Tabs.Item = TabsItem;

export default Tabs;