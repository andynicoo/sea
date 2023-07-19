/**
 * 插入云片验证
 */
const initAwsc = () => {
    return new Promise<any>((resolve) => {
        const head = document.getElementsByTagName("head")[0];
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://g.alicdn.com/AWSC/AWSC/awsc.js";
        script.onload = () => {
            window.AWSC.use("nvc", function (state: any, module: any) {
                const nvc = module.init({
                    appkey: "FFFF0N00000000009BFF",
                    scene: "nvc_register",
                    isH5: false,
                    popUp: false,
                    trans: { key1: "code0", nvcCode: 400 },
                    language: "cn"
                });
                resolve(nvc);
            });
        }
        head.appendChild(script);
    })
}

export default initAwsc;