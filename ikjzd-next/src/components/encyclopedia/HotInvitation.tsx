import Link from "next/link";
import React, { Key } from "react";
export interface HotInvitationProps {
    title: string;
    avatar: string;
    author: string;
    id: Key;
}

/**
 * 热门帖子
 */
const HotInvitation: React.FC<HotInvitationProps> = ({ title, avatar, author, id }) => {
    return <div>
        <Link href={"/k/[id]"} as={`/k/${id}`}>
            <a className="mb-[15px] lc-2">{title}</a>
        </Link>
        <Link href={"/k/[id]"} as={`/k/${id}`}>
            <a className={"flex row-center color-[#a0a0a0] fh-[24px]"}>
                <img className="wh-[25px] mr-[10px] inline-block br-round" src={avatar} />
                <span>{author}</span>
            </a>
        </Link>
    </div>
}

export default HotInvitation;