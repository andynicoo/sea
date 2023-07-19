import React, { Key } from "react";
import { remove } from "lodash";

import createEmotion from "@emotion/css/create-instance";
const { css } = createEmotion({ key: `${process.env.CLASS_PREFIX}-cs-tags-select` });

export interface TagsProps {
    value?: Key[];
    onChange?: (value: Key[]) => void;
    maxLength?: number;
}

const Tags: React.FC<TagsProps> = (props) => {
    const { children, onChange, maxLength } = props;

    const beforeOnChange = (keys: React.Key[]) => {
        if (maxLength && keys.length > maxLength) return;
        onChange && onChange(keys);
    }

    return <div className="cs-tags-select">
        {React.Children.toArray(children).map((element) => {
            const itemElement = element as React.FunctionComponentElement<ItemProps>;
            const { value } = itemElement.props;

            const onChecked = (checked: boolean) => {
                const _value_ = [...(props.value || [])];
                if (checked) {
                    beforeOnChange([..._value_, value])
                } else {
                    const nextValue = remove(_value_, (cv) => cv !== value);
                    beforeOnChange(nextValue);
                }
            }

            return React.cloneElement<ItemProps>(itemElement, {
                checked: props.value?.includes(value),
                onChecked: onChecked
            });
        })}
    </div>
}

export interface ItemProps {
    checked?: boolean;
    value: Key;
    onChecked?: (checked: boolean) => void;
}

const src = "https://static.ikjzd.com/uploads/static/public/public/hook.png";

const Item: React.FC<ItemProps> = (props) => {
    const { children, checked, onChecked } = props;

    const cls = css`
        display: inline-block;
        padding: 3px 13px;
        border: 1px solid #d7d7d7;
        color: #999;
        margin: 0 10px 10px 0;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        &[data-checked="true"] {
            color: ${process.env.PRIMARY_COLOR};
            border: 1px solid ${process.env.PRIMARY_COLOR};
        }
    `;

    const checkedCls = css`
        height: 20px;
        width: 20px;
        position: absolute;
        right: 0;
        bottom: 0;
        border: 10px solid ${process.env.PRIMARY_COLOR};
        border-color: transparent ${process.env.PRIMARY_COLOR} ${process.env.PRIMARY_COLOR} transparent;

        &>img {
            height: 10px;
            width: 10px;
            position: absolute;
            bottom: -9px;
            right: -8px;
        }
    `;

    return <div
        className={cls}
        data-checked={checked}
        onClick={() => onChecked && onChecked(!checked)}
    >
        {children}
        {
            checked && (
                <div className={checkedCls}>
                    <img src={src} />
                </div>
            )
        }
    </div>
}

type ITagsSelect = React.FC<TagsProps> & {
    Item: React.FC<ItemProps>;
}

const TagsSelect = Tags as ITagsSelect

TagsSelect.Item = Item;

export default TagsSelect;