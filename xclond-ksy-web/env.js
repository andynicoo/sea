module.exports = {
  // 开发环境
  dev: {
    NODE_ENV: "development",
    SERVER_URL: "http://localhost:7788",
    SENSORS_RUL: "https://sc-rec.gstarsea.com/sa?project=default",
  },
  // 测试环境
  test: {
    NODE_ENV: "test",
    SERVER_URL: "https://yyy.test",
    SENSORS_RUL: "https://sc-rec.gstarsea.com/sa?project=default",
  },
  // pre环境
  uat: {
    NODE_ENV: "uat",
    SERVER_URL: "https://yyy.uat",
    SENSORS_RUL: "https://sc-rec.gstarsea.com/sa?project=default",
  },
  // 生产环境
  pro: {
    NODE_ENV: "production",
    SERVER_URL: "https://xxx.prod",
    SENSORS_RUL: "https://sc-rec.gstarsea.com/sa?project=production",
  },
};
