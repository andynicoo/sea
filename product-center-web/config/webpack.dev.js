const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const PORT = process.env.PORT;

var devConfig = {
    mode: "development",
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        port: PORT,
        open: true,
        headers :{
            'Access-Control-Allow-Origin': '*',
          },
        //   hot : false,
        //   watchContentBase : false,
        //   liveReload : false,
    },
}

module.exports = merge(common, devConfig);