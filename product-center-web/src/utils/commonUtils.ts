import { v4 as uuidv4 } from 'uuid';
/**
 * 设置本地存储
 */
export function setPageCache(sessionName: string, sessionValue: string) {
    sessionStorage.setItem(sessionName, sessionValue)
}

/**
 * 删除分页本地存储
 */
export function delPageCache() {
    sessionStorage.removeItem('queryParams')
    sessionStorage.removeItem('parentStatus')
}


/**
 * 重置文件名
 * @param filename
 * @returns 
 */
export function resetFileName(filename: string): string {
    const s: string[] = filename.split(".")
    return `${uuidv4()}.${s[s.length - 1]}`;
}



/**
 * 下载文件
 */
export function download(source: any, filename?: string) {
    const link = document.createElement('a')
    const blob = new Blob([source], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    link.style.display = 'none'
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', filename || "导出文件")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * 忽略最后一级权限
 */
// export function handlerPermissionTreeIgnoreAction(tree: SystemPermission[]): SystemPermission[] {
//     const r = (t: SystemPermission[]): SystemPermission[] => {
//         return t.filter((permission: SystemPermission) => {
//             if (permission.children) permission.children = r(permission.children);
//             // @ts-ignore
//             if (!permission.children.length) permission.children = null;
//             if (permission.type === PermissionType.ACTION) return false
//             return true;
//         })
//     }
//     return r(tree);
// }

export function validaHttps(rule: any, value: any, callback: any) {
    console.log('验证值', value);
    const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
    if (!reg.test(value) && value && value.length > 0) {
        callback(new Error('链接必须已http 或者 https开头'));
    } else {
        callback();
    }
}

/** 加法
 * @param { number } arg1
 * @param { number } arg2
 */
 export function add(arg1:any, arg2:any) {
    let r1, r2, m
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
  }
  /** 减法
   * @param { number } arg1
   * @param { number } arg2
   */
  export function floatSub(arg1:any, arg2:any) {
    var r1, r2, m, n
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    //动态控制精度长度
    n = r1 >= r2 ? r1 : r2
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
  }