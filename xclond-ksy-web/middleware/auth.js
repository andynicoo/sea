import Cookies from "js-cookie";

export default function (app) {
  const isAuthenticated = app.store.state.auth.username ? true : false;
  const hasLogined = app.store.state.isLogined;

  // let cookieStore=Cookies.get('store')
  // cookieStore? cookieStore=JSON.parse(cookieStore):null
  // let lg=cookieStore?.isLogined
  // console.log(lg)
  console.log(app)
  if (!isAuthenticated) {
    // 无 i18n模式
    app.redirect({ name: "auth" });

    // app.redirect(app.localePath("auth"));
  }
}
