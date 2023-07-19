import Link from "next/link";
import React from "react";

interface PaginationRenderProps {
    pathname: string;
    query?: { [key: string]: any };
    page: number;
    type: "page" | "prev" | "next" | "jump-prev" | "jump-next";
    originalElement: React.ReactNode;
}

/**
 * 自定义分页渲染
 */
const PaginationRender: React.FC<PaginationRenderProps> = (props) => {
    const { query, page, originalElement } = props;
    return (
        <Link href={{ query: { ...query, current: page } }}>
            {originalElement}
        </Link>
    )
}

PaginationRender.defaultProps = {
    query: {}
}

export default PaginationRender;