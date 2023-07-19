import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdRecords } from "@/vo/Adverts";
import { cloneDeep } from "lodash";
import { pageAd } from "@/apis/home";

const DetailsAdComment: React.FC = () => {
	const { query } = useRouter();
	const [adData, setAdData] = useState<AdRecords[]>([]);

	const loadData = () => {
		pageAd({ adSiteKey: "ad_article_banner" }).then((res) => {
			const data = cloneDeep(res.data.records)
			setAdData(data)
		})
	}

	useEffect(loadData, [query.id]);
	return (
		<div>
			<div>
				{
					adData.map((item: any, index: number) => (
						<a key={index} href={item.url} target={"_blank"}>
							<img src={item.picUrl} className={"w-[100%] h-[100px] br-a-[3px]"} />
						</a>
					))
				}
			</div>
		</div>
	);
};

export default DetailsAdComment;
