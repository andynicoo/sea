import { Card, CardProps } from "antd";
import classNames from "classnames";
import React from "react";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-card-title` });

interface CardTitleProps extends CardProps {

}

const CardTitle: React.FC<CardTitleProps> = ({ children, className, ...args }) => {
    const prefix = process.env.CLASS_PREFIX;

    const classns = css`
        .${prefix}-card-head {
            border-bottom: none;
        }

        .${prefix}-card-body {
            display: none;
        }
    `;

    return (
        <Card
            {...args}
            className={classNames(className, classns)}
        >
            {children}
        </Card>
    )
}

export default CardTitle;