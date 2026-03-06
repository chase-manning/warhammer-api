import { Hono } from "hono";
import { fetchData } from "../utils/data.js";
import { formatSuccess, formatError } from "../utils/format.js";

interface Ability {
  id: string;
  name: string;
  factionId: string;
  legend: string;
  description: string;
}

const abilities = new Hono();

abilities.get("/", async (c) => {
  const data = await fetchData<Ability[]>("abilities.json");
  return c.json(formatSuccess(data));
});

abilities.get("/:id", async (c) => {
  const id = c.req.param("id");
  const all = await fetchData<Ability[]>("abilities.json");
  const item = all.find((a) => a.id === id);
  if (!item) return c.json(formatError(`Ability not found: ${id}`), 404);
  return c.json(formatSuccess(item));
});

export default abilities;
