import { Hono } from "hono";
import { fetchData } from "../utils/data.js";
import { formatSuccess, formatError } from "../utils/format.js";

interface Stratagem {
  id: string;
  factionId: string | null;
  name: string;
  type: string;
  cpCost: number | null;
  legend: string;
  turn: string | null;
  phase: string | null;
  detachment: string | null;
  detachmentId: string | null;
  description: string;
}

const stratagems = new Hono();

stratagems.get("/", async (c) => {
  const factionId = c.req.query("factionId");
  const detachment = c.req.query("detachment");

  let data = await fetchData<Stratagem[]>("stratagems.json");

  if (factionId) {
    data = data.filter(
      (s) => s.factionId === factionId || !s.factionId
    );
  }
  if (detachment) {
    data = data.filter(
      (s) =>
        s.detachment?.toLowerCase() === detachment.toLowerCase()
    );
  }

  return c.json(formatSuccess(data));
});

stratagems.get("/:id", async (c) => {
  const id = c.req.param("id");
  const all = await fetchData<Stratagem[]>("stratagems.json");
  const item = all.find((s) => s.id === id);
  if (!item) return c.json(formatError(`Stratagem not found: ${id}`), 404);
  return c.json(formatSuccess(item));
});

export default stratagems;
