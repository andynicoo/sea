const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const dayjs = require("dayjs");

const NODE_ENV = process.env.NODE_ENV;
const getTime = () => dayjs().format("YYYY年MM月DD日HH时mm分ss秒");

console.log(getTime());

var prodConfig = {
    mode: "production",
    devServer: {
        headers :{
            'Access-Control-Allow-Origin': '*',
        }
    },
    plugins: [
        // new FileManagerPlugin({
        //     events: {
        //         onEnd: {
        //             archive: [
        //                 {
        //                     source: path.resolve("dist"),
        //                     destination: path.resolve(`zips/dist-${NODE_ENV}-${getTime()}.zip`)
        //                 },
        //             ]
        //         }
        //     }
        // })
    ]
}

module.exports = merge(common, prodConfig);