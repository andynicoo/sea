import {
  Avatar,
  Button,
  Card,
  Col,
  ConfigProvider,
  Modal,
  Popover,
  Row,
  Spin,
} from "antd";
import React, { Fragment, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import zhCN from "antd/lib/locale/zh_CN";
import { getAdviserIgonrePage } from "@/apis/home";
import { PageSource } from "@/vo/PageParams";
import AdviserVo from "@/vo/Adviser";
import { isFunction } from "lodash";
import { useRouter } from "next/router";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({
  key: `${process.env.CLASS_PREFIX}-cs-adviser`,
});

interface AdviserContentProps {
  onClick?: (props: AdviserVo) => void;
  renderItem?: (props: AdviserVo, element: React.ReactNode) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**跨境知道顾问 */
const AdviserContent: React.FC<AdviserContentProps> = (props) => {
  const [advisers, setAdvisers] = useState<PageSource<AdviserVo>>();
  const [loading, setLoading] = useState<boolean>(false);
  const { onClick, renderItem, className, style } = props;

  useEffect(() => {
    setLoading(true);
    getAdviserIgonrePage()
      .then((res) => {
        setAdvisers(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const Title: React.FC = () => {
    return (
      <Fragment>
        <h2 className="color-[#000000e6] fs-[16px] fw-500 mb-[5px]">
          一站式出海需求解决顾问
        </h2>
        <p className="color-[#00000099] fs-[12px] mb-[0px]">
          您有任何出海需求，专业顾问为您解答，点击下方快速咨询
        </p>
      </Fragment>
    );
  };

  const itemCls = css`
    &:hover {
      & > span {
        color: ${process.env.PRIMARY_COLOR};
      }
    }
  `;

  const Adviser: React.FC<AdviserVo> = (props) => {
    const cls = css`
      border: 1px solid rgba(200, 200, 200, 0.2);
    `;

    const node = (
      <a
        onClick={() => onClick && onClick(props)}
        className={cx(itemCls, "w-[140px] h-[45px] grid row-center gap-[15px]")}
        style={{ gridTemplateColumns: "45px 1fr" }}
      >
        <Avatar size={46} src={props.headImg} className={cls} />
        <span className={cx("nameCls", "lc-1")}>{props.name}</span>
      </a>
    );

    if (isFunction(renderItem)) {
      return <Fragment>{renderItem(props, node)}</Fragment>;
    }
    return <Fragment>{node}</Fragment>;
  };

  return (
    <Card title={<Title />} className={className} style={style}>
      <Spin spinning={loading}>
        <Row gutter={15}>
          {advisers?.records.map((adviser) => (
            <Col span={6} key={adviser.id} className={"mb-[25px]"}>
              <Adviser {...adviser} />
            </Col>
          ))}
        </Row>
      </Spin>
    </Card>
  );
};

interface AdviserModalProps {
  onCancel?: () => void;
  onClick?: (props: AdviserVo, destroy: () => void) => void;
  style?: React.CSSProperties;
}

const AdviserModal: React.FC<AdviserModalProps & AdviserModalResult> = (
  props
) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { onCancel, element, style } = props;

  const onDestroy = () => {
    setVisible(false);
    setTimeout(() => {
      onCancel && onCancel();
      document.body.removeChild(element);
    }, 500);
  };

  const onClick = (adviser: AdviserVo) => {
    props.onClick && props.onClick(adviser, onDestroy);
  };

  useEffect(() => setVisible(true), []);

  return (
    <Modal
      centered
      visible={visible}
      getContainer={element}
      onCancel={onDestroy}
      footer={false}
      width={656}
      bodyStyle={{ padding: 0 }}
      style={style}
    >
      <AdviserContent onClick={onClick} />
    </Modal>
  );
};

type AdviserType = React.FC<AdviserContentProps> & {
  modal: (props: AdviserModalProps) => AdviserModalResult;
  Card: React.FC<AdviserCardProps>;
};

const Adviser = AdviserContent as AdviserType;

interface AdviserModalResult {
  element: HTMLDivElement;
  onClick?: (props: AdviserVo, destroy: () => void) => void;
}

Adviser.modal = (props: AdviserModalProps) => {
  const element = document.createElement("div");
  document.body.appendChild(element);
  ReactDOM.render(
    <ConfigProvider prefixCls={process.env.CLASS_PREFIX} locale={zhCN}>
      <ReduxProvider store={window.__NEXT_REDUX_STORE__}>
        <AdviserModal {...props} element={element} />
      </ReduxProvider>
    </ConfigProvider>,
    element
  );
  return { element };
};

interface AdviserCardProps {
  className?: string;
  qrCodeSrc?: string;
  style?: React.CSSProperties;
  modalStyle?: React.CSSProperties;
}

const AdviserCard: React.FC<AdviserCardProps> = ({
  className,
  qrCodeSrc,
  style,
  modalStyle,
}) => {
  const { push } = useRouter();

  const adviserBtnCls = css`
    &:hover {
      background-color: ${process.env.PRIMARY_COLOR} !important;
      color: #fff !important;
    }
  `;

  const onClick = () => {
    Adviser.modal({
      onClick(props, destroy) {
        push("/adviser/[id]", `/adviser/${props.id}`);
        destroy();
      },
      style: modalStyle,
    });
  };

  return (
    <Card
      bordered={false}
      className={cx("relative h-[170px] bg-center bg-cover", className)}
      style={{
        backgroundImage: "url(/asset/image/index-banner-help.png)",
        ...style,
      }}
    >
      <Popover
        placement={"bottomRight"}
        content={<img src={qrCodeSrc} style={{ width: 126, height: 126 }} />}
      >
        <img
          src={"/asset/image/index-banner-qr.png"}
          className={"w-[25px] h-[25px] absolute cursor-pointer"}
          style={{ top: 7, right: 7 }}
        />
      </Popover>
      <div
        className={"absolute fs-[14px] fw-600 color-[#000000]"}
        style={{ right: 36, top: 49 }}
      >
        <p className="ma-[0px]">您有什么出海需求</p>
        <p className="ma-[0px]">专业顾问为您解答</p>
      </div>

      <Button
        ghost
        type={"primary"}
        shape={"round"}
        className={cx(adviserBtnCls, "absolute")}
        style={{ right: 44, bottom: 24 }}
        onClick={onClick}
      >
        点击咨询
      </Button>
    </Card>
  );
};

AdviserCard.defaultProps = {
  qrCodeSrc: "/asset/image/qr-code/2022-11-28/wx.jpeg",
};

Adviser.Card = AdviserCard;

export default Adviser;
