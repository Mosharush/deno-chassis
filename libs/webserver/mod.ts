import pkg from "../config/mod.ts";
const config = await pkg.read();

import { green, cyan, bold, yellow } from "../colors/mod.ts";
import {
  Application,
  Context,
  Router,
  Status,
} from "https://deno.land/x/oak/mod.ts";

function notFound(context: Context) {
  context.response.status = Status.NotFound;
  context.response.body = `<html><body><h1>404 - Not Found</h1><p>Path <code>${context.request.url}</code> not found.`;
}

const app = new Application();
// Logger
app.use(async (context: any, next: Function) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  console.log(
    `${green(context.request.method)} ${cyan(
      context.request.url.pathname
    )} - ${bold(String(rt))}`
  );
});
// Response Time
app.use(async (context: any, next: Function) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
});

const options = {
  hostname: config.host || "0.0.0.0",
  port: config.port || 8000,
};

function start(router: Router | null) {
  if (router) {
    app.use(router.routes());
    app.use(router.allowedMethods());
  }
  // A basic 404 page
  app.use(notFound);

  console.log(
    bold("Server listening on ") + yellow(`${options.hostname}:${options.port}`)
  );
  return app.listen(options);
}

export { start, app, Context, Router, Status };
