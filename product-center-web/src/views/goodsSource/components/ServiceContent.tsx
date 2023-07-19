import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const ServiceContent = (props: any) => {
    const [tags, setTags] = useState<any>([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    useEffect(() => {
        if (inputVisible) {
            // @ts-ignore
            inputRef.current?.focus();
        }
    }, [inputVisible]);
    useEffect(() => {
        // @ts-ignore
        editInputRef.current?.focus();
    }, [inputValue]);

    const handleClose = (removedTag: any) => {
        const newTags = tags.filter((tag: any) => tag !== removedTag);
        console.log(newTags);
        setTags(newTags);
        props.onChange(newTags)
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue]);
            props.onChange([...tags, inputValue])
        }

        setInputVisible(false);
        setInputValue('');
    };

    const handleEditInputChange = (e: any) => {
        setEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags);
        props.onChange(newTags)
        setEditInputIndex(-1);
        setInputValue('');
    };
    useEffect(() => {
        if (props.value) {
            setTags(props.value);
            props.onChange(props.value)
        }
    }, [props])
    return (
        <>
            {tags.map((tag: any, index: number) => {
                if (editInputIndex === index) {
                    return (
                        <Input
                            ref={editInputRef}
                            key={tag}
                            size="small"
                            style={{ width: "120px" }}
                            value={editInputValue}
                            onChange={handleEditInputChange}
                            onBlur={handleEditInputConfirm}
                            onPressEnter={handleEditInputConfirm}
                        />
                    );
                }

                const isLongTag = tag.length > 20;
                const tagElem = (
                    <Tag
                        className="edit-tag"
                        key={tag}
                        closable={true}
                        onClose={() => handleClose(tag)}
                    >
                        <span
                            onDoubleClick={(e) => {
                                if (index !== 0) {
                                    setEditInputIndex(index);
                                    setEditInputValue(tag);
                                    e.preventDefault();
                                }
                            }}
                        >
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </span>
                    </Tag>
                );
                return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                );
            })}
            {inputVisible && (
                <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: "120px" }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {!inputVisible && (
                <Tag className="site-tag-plus gc-cp" onClick={showInput}>
                    <PlusOutlined /> 添加
                </Tag>
            )}
        </>
    );
};

export default ServiceContent;