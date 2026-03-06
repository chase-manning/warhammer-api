import { Hono } from "hono";
import { fetchData } from "../utils/data.js";
import { formatSuccess, formatError } from "../utils/format.js";

interface Enhancement {
  id: string;
  factionId: string;
  name: string;
  cost: number | null;
  detachment: string;
  detachmentId: string | null;
  legend: string;
  description: string;
}

const enhancements = new Hono();

enhancements.get("/", async (c) => {
  const factionId = c.req.query("factionId");
  const detachment = c.req.query("detachment");

  let data = await fetchData<Enhancement[]>("enhancements.json");

  if (factionId) {
    data = data.filter((e) => e.factionId === factionId);
  }
  if (detachment) {
    data = data.filter(
      (e) => e.detachment?.toLowerCase() === detachment.toLowerCase()
    );
  }

  return c.json(formatSuccess(data));
});

enhancements.get("/:id", async (c) => {
  const id = c.req.param("id");
  const all = await fetchData<Enhancement[]>("enhancements.json");
  const item = all.find((e) => e.id === id);
  if (!item) return c.json(formatError(`Enhancement not found: ${id}`), 404);
  return c.json(formatSuccess(item));
});

export default enhancements;
