import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-encyclopedia-hot-course` });
export interface HotCourseProps {
    img: string;
    name: string;
    count: number;
    price: string;
    href?: string;
}

/**
 * 热门课程
 */
const HotCourse: React.FC<HotCourseProps> = ({ img, name, count, price, href }) => {
    if (!href) href = useRouter().pathname;

    const cls = css`
        display: grid;
        grid-template-columns: 104px 1fr;
        gap: 10px;
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }

        &>img {
            width: 104px;
            height: 70px;
            border-radius: 4px;
        }
    `;

    const infoCls = css`
        display: flex;
        flex-direction: column;
        justify-content: colume-between;

        &>p {
            margin: 0;

            &:nth-child(1) {
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                /*限制在一个块元素显示的文本的行数*/
                -webkit-box-orient: vertical;
            }

            &:nth-child(2) {
                display: flex;
                justify-content: colume-between;

                &>span {
                    &:nth-child(1) {
                        color: #abadb0;
                    }
                }
            }
        }
    `;

    return <Link href={href}>
        <a className={cls}>
            <img src={img} />
            <div className={infoCls}>
                <p>{name}</p>
                <p>
                    <span>{count}人学过</span>
                    <span>{price}</span>
                </p>
            </div>
        </a>
    </Link>
}

export default HotCourse;