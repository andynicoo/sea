import React, { useState } from "react";
import { Input } from 'antd';
import { useRouter } from "next/router";
const { Search } = Input;
export const SearchBox: React.FC = () => {
    const { push, pathname, query } = useRouter()
    const type = query.type as string
    const [keyword, setKeyword] = useState<string>('')
    const onSearch = (value: string) => push(`${pathname}?type=${type}&keyword=${value}`)
    const onChange = (e: any) => setKeyword(e.target.value)
    return <Search onChange={onChange} onSearch={onSearch} value={keyword} className='pg-search-box' placeholder="请输入想找的平台" />
}