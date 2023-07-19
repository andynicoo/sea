import React, { Key, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { last, subtract, sum } from "lodash";

import createEmotion from "@emotion/css/create-instance";
const { css, cx } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-scroll-tags` });

interface BaseProps {
    activeKey?: Key;
    onChange?: (activeKey: Key) => void;
}

type refsObjType = { [key: Key]: HTMLDivElement };
interface ScrollTagsContextProps extends BaseProps {
    refs: React.MutableRefObject<refsObjType>;
}

const ScrollTagsContext = React.createContext<ScrollTagsContextProps>({} as ScrollTagsContextProps);

interface ScrollTagsContentProps extends BaseProps {
    className?: string;
    style?: React.CSSProperties;
}

interface ScrollTagsContentRefProps {
    onScrollTo: (key: Key) => void;
}

const ScrollTagsContent = React.forwardRef<ScrollTagsContentRefProps, ScrollTagsContentProps>((props, ref) => {
    const { className, style, activeKey, onChange, children } = props;

    const contentRef = React.createRef<HTMLDivElement>();
    const [point, setPoint] = useState<number>(0);
    const [leftDisable, setLeftDisable] = useState<boolean>(false);
    const [rightDisable, setRightDisable] = useState<boolean>(false);

    const refs = useRef<refsObjType>({});

    const ctxValue: ScrollTagsContextProps = {
        activeKey,
        onChange,
        refs,
    }

    const handleLeft = () => {
        const nextPoint = point - 1;
        const left = Number(contentRef.current?.clientWidth) * nextPoint;
        contentRef.current?.scroll({ left: left, behavior: "smooth" });
        setPoint(nextPoint);
    }

    const handleRight = () => {
        const nextPoint = point + 1;
        const left = Number(contentRef.current?.clientWidth) * nextPoint;
        contentRef.current?.scroll({ left: left, behavior: "smooth" });
        setPoint(nextPoint);
    }

    const updatePoint = () => {
        const contentRect = contentRef.current?.getBoundingClientRect() as DOMRect;
        const refValues = Object.values(refs.current);
        const lastRect = last(refValues)?.getBoundingClientRect() as DOMRect;
        const width = sum(refValues.map((ref) => ref.getBoundingClientRect().width + 20)) - 20;

        setRightDisable(false);
        setLeftDisable(false);

        const lastLeft = Math.round(lastRect.left - contentRect.width + lastRect.width);

        /**滚动到最右边 */
        if (Math.abs(subtract(lastLeft, Math.round(contentRect.left))) < 10) {
            setRightDisable(true);
        }

        /**滚动到最左边 */
        if (Number(contentRef.current?.scrollLeft) < 10) {
            setLeftDisable(true);
        }

        /**内容小于总宽度 */
        if (width < contentRect.width) {
            setRightDisable(true);
            setLeftDisable(true);
        }
    }

    const onScrollTo = (key: Key) => {
        const current = refs.current[key];
        if (!current) return;
        const left = current.offsetLeft - current.getBoundingClientRect().width - 20;
        contentRef.current?.scroll({ left: left, behavior: "auto" });
    }

    useEffect(updatePoint, [refs.current]);

    useImperativeHandle(ref, () => ({
        onScrollTo
    }));

    useEffect(() => {
        // if (activeKey) onScrollTo(activeKey);
    }, [activeKey]);

    const contentClassns = css`
        overflow-x: scroll;
        width: 100%;
        white-space: nowrap;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }
    `;

    const leftIconClassns = css`
        transform: rotate(180deg);
    `;

    const disableIconClassns = css`
        pointer-events: none;
        opacity: 0.3;
    `;
    const BgCls = css`
        background: rgba(252,254,255,0.5000);
        box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.0300), inset 0px 4px 4px 0px rgba(255,255,255,0.2500);
        border-radius: 3px 0px 0px 3px;
        backdrop-filter: blur(12px);
    `

    const childrenContent = React.Children.map(children, (child) => {
        const childElement = child as React.FunctionComponentElement<ScrollTagsItemProps>;
        return React.cloneElement(childElement, {
            onClick: onChange
        })
    })

    return (
        <ScrollTagsContext.Provider value={ctxValue}>
            <div
                className={cx(BgCls, "px-[5px] py-[10px] flex row-center br-a-[2px]", className)}
                style={style}
            >
                <Icon
                    onClick={handleLeft}
                    className={cx(
                        "cursor-pointer",
                        "py-[10px]",
                        "px-[10px]",
                        leftIconClassns,
                        { [disableIconClassns]: leftDisable }
                    )}
                    type={"icon-youjiantou"}
                />
                <div
                    className={contentClassns}
                    ref={contentRef}
                    onScroll={updatePoint}
                >
                    {childrenContent}
                </div>
                <Icon
                    onClick={handleRight}
                    className={cx(
                        "cursor-pointer",
                        "py-[10px]",
                        "px-[10px]",
                        { [disableIconClassns]: rightDisable }
                    )}
                    type={"icon-youjiantou"}
                />
            </div>
        </ScrollTagsContext.Provider>
    )
})

interface ScrollTagsItemProps {
    active?: boolean;
    tagsKey: Key;
    className?: string;
    activeClassName?: string;
    onClick?: (key: Key) => void;
}

const ScrollTagsItem: React.FC<ScrollTagsItemProps> = (props) => {
    const { active, tagsKey, children, className, activeClassName, onClick } = props;
    const { refs, activeKey } = useContext(ScrollTagsContext);

    const itemRef = React.createRef<HTMLDivElement>();

    useEffect(() => {
        if (itemRef.current) {
            refs.current = { ...refs.current, [tagsKey]: itemRef.current };
        }
    }, [itemRef.current]);

    const _active_ = activeKey ? activeKey === tagsKey : active;

    const classns = css`
        &:last-child {
            margin-right: 0;
        }
    `;

    return (
        <div
            className={cx(
                classns,
                className,
                "py-[5px]",
                "relative",
                "fs-400",
                "fs-[16px]",
                "color-[#000000]09",
                "cursor-pointer",
                "mr-[20px]",
                "inline-block",
                { [activeClassName as string]: _active_ },
            )}
            ref={itemRef}
            onClick={() => onClick && onClick(tagsKey)}
        >
            {children}
        </div>
    )
}

const activeClassns = css`
    color: #000000E6;
    font-weight: 500;

    &::before {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 2px;
        background: #F676A6;
        border-radius: 100px 100px 100px 100px;
    }
`;

ScrollTagsItem.defaultProps = {
    activeClassName: activeClassns
}

type ScrollTagsType = React.ForwardRefExoticComponent<ScrollTagsContentProps & React.RefAttributes<ScrollTagsContentRefProps>> & {
    Item: React.FC<ScrollTagsItemProps>;
}

const ScrollTags = ScrollTagsContent as ScrollTagsType;

ScrollTags.Item = ScrollTagsItem;

export default ScrollTags;