import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
    key: `${process.env.CLASS_PREFIX}-pg-question-index`,
});
import Link from "next/link";
import { Card, Button } from "antd";
import { ActivityPlatform } from "@/vo/Encyclopedia";

// const HotInvitation: React.FC<HotInvitationProps> = ({ title, avatar, author, id }) => {
const EntryChannel: React.FC<any> = ({ platformInfo }) => {
    const cls = css`
    .img {
      width: 100%;
    }
    .button {
      width: 100%;
      margin-top: 10px;
    }
  `;
    return (
        <Card bordered={false} title={"官方入驻通道"} className={"mb-[15px]"}>
            <div className={cx(cls)}>
                <img src={platformInfo?.platformStore} alt={"亚马逊"} className={"img"} />
                <p className="fs-[16px] mt-[25px]">全球开店</p>
                <p className="fs-[14px] mt-[10px] color-[#333333]">
                    开店顾问一对一服务，快速对接招商经理
                </p>
                {/* storeRegistrationlink */}
                <a href={platformInfo?.storeRegistrationlink} target="_blank">
                    <Button className="button" size={"large"} type="primary">
                        立即开店
                    </Button>
                </a>
            </div>
        </Card>
    );
};

export default EntryChannel;
