import {
  start,
  Context,
  Router,
  Status,
} from "../../libs/webserver/mod.ts";

const baseRoute = "/books";

const router = new Router();
router.get(baseRoute, (context: Context) => {
});
router.post(baseRoute, (context: Context) => {
});
router.delete(baseRoute, (context: Context) => {
});
export const booksPut = router.put(baseRoute, (context: Context) => {
});

await start(router);
