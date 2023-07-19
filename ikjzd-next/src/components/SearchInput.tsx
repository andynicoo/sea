import { Button, Input } from "antd";
import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { cx } from "@emotion/css";

interface SearchInputProps {
    enterButton?: React.ReactNode;
    size?: "small" | "middle" | "large";
    defaultValue?: string | string[];
    onSearch?: (value: string) => void;
    className?: string;
    placeholder?: string;
    style?: React.CSSProperties;
}

/**搜索框 */
const SearchInput: React.FC<SearchInputProps> = (props) => {
    const { enterButton, size, className, defaultValue, placeholder, style } = props;
    const _defaultValue_ = defaultValue ? String(defaultValue) : "";
    const [value, setValue] = useState<string>(_defaultValue_);

    const onSearch = () => {
        props.onSearch && props.onSearch(String(value));
    }

    return (
        <div
            className={cx(className, "relative", "br-a-[50px]")}
            style={{ boxShadow: "0px 4px 4px 1px rgba(0,0,0,0.0200)", ...style }}
        >
            <Input
                onPressEnter={onSearch}
                size={size}
                className={"br-a-[50px] fs-[12px] fh-[25px]"}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={placeholder}
            />
            <Button
                size={size}
                type={"primary"}
                className={cx(
                    "px-[10px]",
                    "br-a-[50px]",
                    "absolute",
                )}
                style={{ right: 0, top: 0, boxShadow: "none" }}
                onClick={onSearch}
            >
                {enterButton}
            </Button>
        </div>
    )
}

SearchInput.defaultProps = {
    enterButton: <img width={30} src="/asset/image/search_ic.png" />,
    size: "large",
    placeholder: "请输入搜索内容"
}

export default SearchInput;