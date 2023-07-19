import React from "react";
import { Col, Row } from "antd";
import createEmotion from "@emotion/css/create-instance";
import { ContributionUser } from "@/vo/Users";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-encyclopedia-contribution` });

/**
 * 百科贡献榜
 */
const Contribution: React.FC<ContributionUser & {index: number}> = ({ index, avatar, nick, encyclopediaCount, integral }) => {

    const indexCls = css`
        position: relative;

        & > span {
            margin-top: 4px;
        }
    `;

    const cls = css`
        display: grid;
        grid-template-columns: 14px 1fr;
        gap: 10px;

        &[data-img="true"] {
            grid-template-columns: 50px 1fr;

            & > div {
                & > span {
                    position: absolute !important;
                    left: 0;
                    top: 0;
                    background: ${process.env.PRIMARY_COLOR};
                    margin-top: 0;
                }
            }
        }
    `;

    const titleCls = css`
        margin-bottom: 7px;
    `;

    return <div data-img={!!avatar} className={cls}>
        <div className={indexCls}>
            {avatar && (
                <img src={avatar} className={cx("wh-[50px]", "br-a-[2px]")} />
            )}
            <span className={cx(
                "hidden",
                "inline-block",
                "wh-[15px]",
                "text-center",
                "fh-[15px]",
                "color-[#ffffff]",
                "fs-[12px]",
                "br-a-[2px]",
                "color-[#b7b7b7]",
                "bg-color-[#eeeeee]"
            )}>
                {index}
            </span>
        </div>
        <div>
            <p className={titleCls}>{nick}</p>
            <Row className="color-[#999999]">
                <Col span={12}>编辑词条: {encyclopediaCount}</Col>
                <Col span={12}>积分奖励: {integral}</Col>
            </Row>
        </div>
    </div>
}

export default Contribution;