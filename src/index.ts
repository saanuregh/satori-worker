export interface Env {}

import { initWasm, Resvg } from "@resvg/resvg-wasm";
import { Hono } from "hono";
import satori from "satori";
import { html } from "satori-html";
import { SatoriRequest } from "./models";
import resvgWasm from "./resvg.wasm";
import { getSatoriOptions } from "./utils";

const genModuleInit = () => {
  let isInit = false;
  return async () => {
    if (isInit) {
      return;
    }

    await initWasm(resvgWasm);
    isInit = true;
  };
};

const moduleInit = genModuleInit();

const app = new Hono();

app.post("/", async (c) => {
  await moduleInit();

  const req: SatoriRequest = await c.req.json();
  const opts = await getSatoriOptions(req);
  const svg = await satori(html(req.html), opts);

  const r = new Resvg(svg);
  const pngData = r.render();
  const pngBuffer = pngData.asPng();
  return c.body(pngBuffer);
});

export default app;
