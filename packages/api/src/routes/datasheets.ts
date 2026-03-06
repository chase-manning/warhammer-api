import { Hono } from "hono";
import { fetchData } from "../utils/data.js";
import { formatSuccess, formatError } from "../utils/format.js";

interface DatasheetSummary {
  id: string;
  name: string;
  factionId: string;
  slug: string;
  role: string | null;
  virtual: boolean;
}

const datasheets = new Hono();

datasheets.get("/search", async (c) => {
  const query = c.req.query("q")?.toLowerCase().trim();
  if (!query) {
    return c.json(formatError("Query parameter 'q' is required"), 400);
  }

  const all = await fetchData<DatasheetSummary[]>("datasheets.json");
  const results = all.filter(
    (d) => !d.virtual && d.name.toLowerCase().includes(query)
  );
  return c.json(
    formatSuccess(
      results.map((d) => ({
        id: d.id,
        name: d.name,
        factionId: d.factionId,
        slug: d.slug,
        role: d.role,
      }))
    )
  );
});

datasheets.get("/:id", async (c) => {
  const id = c.req.param("id");
  const lookup = await fetchData<Record<string, string>>(
    "datasheet_lookup.json"
  );
  const factionSlug = lookup[id];

  if (!factionSlug) {
    return c.json(formatError(`Datasheet not found: ${id}`), 404);
  }

  try {
    const data = await fetchData(`factions/${factionSlug}/${id}.json`);
    return c.json(formatSuccess(data));
  } catch {
    return c.json(formatError(`Datasheet not found: ${id}`), 404);
  }
});

export default datasheets;
