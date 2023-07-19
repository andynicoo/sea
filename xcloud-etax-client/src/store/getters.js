const getters = {
  // app
  sidebar: (state) => state.app.sidebar,
  // 登录
  token: (state) => state.login.token,
  sessionId: (state) => state.login.sessionId,
  scrollNum: (state) => state.app.scrollNum
};
export default getters;
