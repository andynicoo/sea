import { Avatar, Popover, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-cs-fixed-hot-key`,
});

const prefix = process.env.CLASS_PREFIX;

interface FixedHotkeyProps {}

/**固定热键 */
const FixedHotkey: React.FC<FixedHotkeyProps> = () => {
  return ReactDOM.createPortal(<FixedHotkeyContent />, document.body);
};

export default FixedHotkey;

const FixedHotkeyContent: React.FC = () => {
  const cls = css`
    position: fixed;
    top: 50%;
    right: 30px;
    width: 58px;
    border-radius: 58px;
    border: 1px solid #eee;
    background-color: #fff;
    padding: 15px 0;
    transform: translateY(-50%);
  `;

  const popCls = css`
    position: fixed;

    .${prefix}-popover-inner-content {
      padding: 0;
    }
  `;

  return (
    <div className={cls}>
      {/* <a
                href="https://admin.qidian.qq.com/template/blue/mp/menu/qr-code-jump.html?linkType=0&env=ol&kfuin=2852167646&fid=50&key=6c69d1b67950f5f2aa3a602c4d563b90&cate=1&type=16&ftype=1&_type=wpa&qidian=true"
                target={"_blank"}
            >
                <HotKey
                    icon="/asset/image/icon/hot-key-icon-1.png"
                    name={"客服"}
                />
            </a> */}
      <Popover
        placement={"left"}
        content={<QrCodeCardServer />}
        overlayClassName={popCls}
      >
        <div>
          <HotKey icon="/asset/image/icon/hot-key-icon-1.png" name={"客服"} />
        </div>
      </Popover>
      <div className={dividerCls} />

      <Popover
        placement={"left"}
        content={<QrCodeCard />}
        overlayClassName={popCls}
      >
        <div>
          <HotKey icon="/asset/image/icon/hot-key-icon-2.png" name={"公众号"} />
        </div>
      </Popover>

      <GoToTop>
        <div className={dividerCls} />
        <HotKey icon="/asset/image/icon/hot-key-icon-3.png" name={"返回顶部"} />
      </GoToTop>
    </div>
  );
};

interface HotKeyProps {
  icon: string;
  name: string;
  handle?: () => void;
}

/**热键 */
const HotKey: React.FC<HotKeyProps> = ({ icon, name, handle }) => {
  return (
    <div
      onClick={handle}
      className={cx(
        "py-[5px]",
        "flex",
        "row-center",
        "colume-center",
        "flex-column"
      )}
    >
      <img className={cx("w-[26px] h-[30px] cs-p")} src={icon} />
      <div
        className={cx(
          "fs-[12px] color-[#000000e6] text-center",
          "fh-[18px]",
          "space-nowrap"
        )}
      >
        {name}
      </div>
    </div>
  );
};

/**分割线 */
const dividerCls = css`
  height: 1px;
  background-color: #00000042;
  margin: 10px 15px;
`;

/**公众号二维码 */
const QrCodeCard: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>("1");

  const cls = css`
    .${prefix}-tabs-tab {
      padding-left: 20px;
      padding-right: 20px;
    }

    .${prefix}-tabs-ink-bar {
      display: none;
    }

    .${prefix}-tabs-nav {
      margin: 0;
    }

    .${prefix}-tabs-content {
      padding: 20px;
    }
  `;

  const Content: React.FC<{ img: string; text: string }> = ({ img, text }) => {
    const cls = css`
      display: grid;
      grid-template-columns: 76px 1fr;
      gap: 20px;
    `;

    const textCls = css`
      width: 300px;
    `;

    return (
      <div className={cls}>
        <Avatar size={76} shape={"square"} src={img} />
        <div className={cx(textCls, "fs-[12px] color-[#222222]")}>{text}</div>
      </div>
    );
  };

  return (
    <Tabs
      tabBarGutter={0}
      className={cls}
      activeKey={activeKey}
      onChange={setActiveKey}
    >
      <Tabs.TabPane tab={"跨境知道网"} key={"1"}>
        <Content
          img="/asset/image/qr-code/link-code1.png"
          text="微信扫一扫关注「跨境知道网」公众号，及时了解最新跨境前沿资讯，运营干货和行业趋势，平台政策，陪伴跨境卖家快速学习成长！"
        />
      </Tabs.TabPane>
      {/* <Tabs.TabPane tab={"跨境live"} key={"2"}>
                <Content
                    img="/asset/image/qr-code/link-code2.png"
                    text="微信扫一扫关注「跨境live」公众号，跨境电商行业首家垂直试音直播平台，业内大咖聚集地。在这里，换个姿势，轻松读懂跨境电商！"
                />
            </Tabs.TabPane> */}
      <Tabs.TabPane tab={"手机站"} key={"4"}>
        <Content
          img="/asset/image/qr-code/link-code4.png"
          text="手机扫一扫，随时随地访问跨境知道手机版，及时了解最新跨境前沿资讯，运营干货和行业趋势，平台政策，陪伴跨境卖家快速学习成长！"
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

/**客服二维码 */
const QrCodeCardServer: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>("3");

  const cls = css`
    .${prefix}-tabs-tab {
      padding-left: 20px;
      padding-right: 20px;
    }

    .${prefix}-tabs-ink-bar {
      display: none;
    }

    .${prefix}-tabs-nav {
      margin: 0;
    }

    .${prefix}-tabs-content {
      padding: 20px;
    }
  `;

  const Content: React.FC<{ img: string; text: string }> = ({ img, text }) => {
    const cls = css`
      display: grid;
      grid-template-columns: 76px 1fr;
      gap: 20px;
    `;

    const textCls = css`
      width: 300px;
    `;

    return (
      <div className={cls}>
        <Avatar size={76} shape={"square"} src={img} />
        <div className={cx(textCls, "fs-[12px] color-[#222222]")}>{text}</div>
      </div>
    );
  };

  return (
    <Tabs
      tabBarGutter={0}
      className={cls}
      activeKey={activeKey}
      onChange={setActiveKey}
    >
      <Tabs.TabPane tab={"跨境知道客服"} key={"3"}>
        <Content
          img="/asset/image/qr-code/2022-11-28/wx.jpg"
          text="加我微信你可以得到行业资源服务、运营干货、前沿资讯、数据报告以及加入精准卖家交流圈。有小雨，跨境出海不迷路"
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

/**返回顶部逻辑 */
const GoToTop: React.FC = ({ children }) => {
  const taget: number = 250;
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const { top } = document.body.getBoundingClientRect();
    setShow(Math.abs(top) >= taget);

    document.addEventListener("scroll", () => {
      const { top } = document.body.getBoundingClientRect();
      setShow(Math.abs(top) >= taget);
    });

    return () => {
      document.removeEventListener("scroll", () => {});
    };
  }, []);

  const cls = css`
    transition: all 0.2s;
    height: 80px;
    overflow: hidden;
    opacity: 1;
  `;

  const hideCls = css`
    height: 0;
    opacity: 0.5;
  `;

  return (
    <div className={cx(cls, { [hideCls]: !show })} onClick={goTop}>
      {children}
    </div>
  );
};

/**返回顶部功能 */
function goTop() {
  const timer = setInterval(() => {
    var scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    var speed = Math.floor(-scrollTop / 20);
    document.documentElement.scrollTop = document.body.scrollTop =
      scrollTop + speed;
    if (scrollTop === 0) {
      clearInterval(timer);
    }
  }, 5);
}
