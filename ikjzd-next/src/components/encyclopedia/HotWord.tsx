import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface HotWordProps {
    href: string;
}

/**
 * 热门词条
 */
const HotWord: React.FC<HotWordProps> = ({ href, children }) => {
    return <Link href={href}>
        <Button
            className={"color-[#555555] bg-color-[#f5f5f5]"}
            href={href}
            type="link"
        >
            {children}
        </Button>
    </Link>
}

export default HotWord;