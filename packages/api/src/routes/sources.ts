import { Hono } from "hono";
import { fetchData } from "../utils/data.js";
import { formatSuccess } from "../utils/format.js";

const sources = new Hono();

sources.get("/", async (c) => {
  const data = await fetchData("sources.json");
  return c.json(formatSuccess(data));
});

export default sources;
