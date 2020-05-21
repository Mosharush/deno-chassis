import { readFileStr } from "https://deno.land/std/fs/mod.ts";
import { resolve } from "https://raw.githubusercontent.com/halvardssm/deno-path/master/mod.ts";

const read = async (dir = "") => {
  const path = resolve(dir || Deno.cwd(), "server.json");
  const json = await readFileStr(path);
  return JSON.parse(json);
};

export default {
  read,
};
