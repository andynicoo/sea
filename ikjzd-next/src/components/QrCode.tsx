import { cx } from "@emotion/css";
import React, { useEffect, useState } from "react";
import QRCode, { QRCodeRenderersOptions } from "qrcode";
import { ConfigProvider, Modal } from "antd";
import ReactDOM from "react-dom";
import zhCN from "antd/lib/locale/zh_CN";
import { Provider as ReduxProvider } from "react-redux";

interface QrCodeProps {
    content: string;
    className?: string;
    options?: QRCodeRenderersOptions;
    width?: number;
}

/**
 * 二维码
 */
const QrCodeContent: React.FC<QrCodeProps> = ({ content, className, options, width }) => {

    const ref = React.createRef<HTMLCanvasElement>();

    useEffect(() => {
        if (!process.browser) return;
        QRCode.toCanvas(ref.current, content, { ...options, width, margin: 0 });
    }, [content]);

    return (
        <canvas className={cx(className)} ref={ref} />
    )
}

interface QrCodeModalProps extends QrCodeProps {
    before?: React.ReactNode | React.ReactNode[];
    after?: React.ReactNode | React.ReactNode[];
    renderNode?: (node: React.ReactNode) => React.ReactNode;
}

const QrCodeModal: React.FC<QrCodeModalProps & { element: HTMLDivElement }> = (props) => {
    const { renderNode } = props;

    const [visible, setVisible] = useState<boolean>(true);

    const onCancel = () => {
        setVisible(false);
        setTimeout(() => {
            document.body.removeChild(props.element);
        }, 500);
    }

    return (
        <Modal centered
            visible={visible}
            width={Number(props.width) + 48}
            footer={false}
            onCancel={onCancel}
            destroyOnClose
            getContainer={props.element}
        >
            {
                renderNode
                    ? renderNode(<QrCodeContent {...props} />)
                    : (
                        <div className="text-center">
                            {React.Children.toArray(props.before).map((node) => {
                                if (typeof node === "string") {
                                    return <h2 className={"color-[#666666] fs-[16px] mb-[20px]"}>{node}</h2>
                                }
                                return node;
                            })}
                            <QrCodeContent {...props} />
                            {React.Children.toArray(props.after).map((node) => {
                                if (typeof node === "string") {
                                    return <p className={"mb-[0px] color-[#666666] fh-[18px]"}>{node}</p>
                                }
                                return node;
                            })}
                        </div>
                    )
            }
        </Modal>
    )
}

QrCodeModal.defaultProps = {
    before: "分享到朋友圈",
    after: ["打开微信，使用“扫一扫”即可", "将网页分享到我的朋友圈"],
    width: 200
}

const modal = (options: QrCodeModalProps) => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    ReactDOM.render(
        <ConfigProvider prefixCls={process.env.CLASS_PREFIX} locale={zhCN}>
            <ReduxProvider store={window.__NEXT_REDUX_STORE__}>
                <QrCodeModal
                    {...options}
                    element={element}
                />
            </ReduxProvider>
        </ConfigProvider>,
        element
    );
}

type QrCodeType = React.FC<QrCodeProps> & {
    modal: (options: QrCodeModalProps) => void;
}

const QrCode = QrCodeContent as QrCodeType;

QrCode.modal = modal;

export default QrCode;