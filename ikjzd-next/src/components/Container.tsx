import React from "react";
import classNames from "classnames";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-container` });

interface ContainerProps {
    className?: string;
    style?: React.CSSProperties;
}

/**
 * 主体容器,限制最大宽度
 */
const Container: React.FC<ContainerProps> = ({ children, className, style }) => {
    return (
        <div className={cx("w-max mx-auto", className)} style={style}>
            {children}
        </div>
    )
}

export default Container;