import Head from "next/head";
import React from "react";

interface SeoHeadProps {
    title?: string;
    keyword?: string;
    description?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({ title, keyword, description }) => {
    return <Head>
        <title>{title}</title>
        <meta name="keywords" content={keyword} />
        <meta name="description" content={description} />
    </Head>
}

SeoHead.defaultProps = {
    title: "跨境知道官网_360万新外贸人资源平台_跨境电商服务平台_跨境电商培训_跨境电商运营",
    keyword: "跨境知道官网,跨境知道,跨境电商,跨境百科,跨境论坛,跨境电商运营, 跨境最新资讯,新外贸",
    description: "跨境知道官网是中国知名跨境电商平台、交流论坛，关注跨境电商一系列行业动态、平台政策、新闻资讯、运营干货、新外贸等讯息，提供跨境电商培训、运营，帮助跨境卖家最快掌握跨境行业动态，了解最全、最新的实操经验",
}

export default SeoHead;