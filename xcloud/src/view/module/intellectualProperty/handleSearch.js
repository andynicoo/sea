export const setSearchVal=(path,val,searchTime)=>{
    // console.log(val)
    sessionStorage.setItem(path+'-searchValue',val)
    sessionStorage.setItem(path+'-searchTime',searchTime)
}

export const getSearchVal=(path)=>{
    let searchValue=sessionStorage.getItem(path+'-searchValue')
    // console.log(JSON.parse(searchValue))
    return JSON.parse(searchValue)
}

export const getSearchTime=(path)=>{
    let searchTime=sessionStorage.getItem(path+'-searchTime')
    // console.log(JSON.parse(searchTime))
    return JSON.parse(searchTime)
}

export const removeSearchVal=(path)=>{
    // console.log(val)
    sessionStorage.removeItem(path+'-searchValue')
    sessionStorage.removeItem(path+'-searchTime')
}