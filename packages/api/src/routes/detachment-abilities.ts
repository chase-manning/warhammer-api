import { Hono } from "hono";
import { fetchData } from "../utils/data.js";
import { formatSuccess, formatError } from "../utils/format.js";

interface DetachmentAbility {
  id: string;
  factionId: string;
  name: string;
  legend: string;
  description: string;
  detachment: string;
  detachmentId: string | null;
}

const detachmentAbilities = new Hono();

detachmentAbilities.get("/", async (c) => {
  const factionId = c.req.query("factionId");
  const detachment = c.req.query("detachment");

  let data = await fetchData<DetachmentAbility[]>(
    "detachment_abilities.json"
  );

  if (factionId) {
    data = data.filter((d) => d.factionId === factionId);
  }
  if (detachment) {
    data = data.filter(
      (d) => d.detachment?.toLowerCase() === detachment.toLowerCase()
    );
  }

  return c.json(formatSuccess(data));
});

detachmentAbilities.get("/:id", async (c) => {
  const id = c.req.param("id");
  const all = await fetchData<DetachmentAbility[]>(
    "detachment_abilities.json"
  );
  const item = all.find((d) => d.id === id);
  if (!item)
    return c.json(formatError(`Detachment ability not found: ${id}`), 404);
  return c.json(formatSuccess(item));
});

export default detachmentAbilities;
