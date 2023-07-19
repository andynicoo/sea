const next = require("next");
const Koa = require("koa");
const koaStatic = require("koa-static");
const path = require("path");

const APP_ENV = process.env.APP_ENV;

require("custom-env").env(APP_ENV);

const dev = APP_ENV === "dev";
const port = process.env.PORT;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = new Koa();
    server.use((ctx) => handle(ctx.req, ctx.res));
    server.use(koaStatic(path.resolve(__dirname, "public")));
    server.listen(port);
});
