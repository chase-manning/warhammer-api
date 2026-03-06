import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { cacheMiddleware } from "./utils/cache.js";
import { formatSuccess, formatError } from "./utils/format.js";
import { fetchData, setBaseUrl } from "./utils/data.js";
import factions from "./routes/factions.js";
import datasheets from "./routes/datasheets.js";
import stratagems from "./routes/stratagems.js";
import enhancements from "./routes/enhancements.js";
import detachmentAbilities from "./routes/detachment-abilities.js";
import abilities from "./routes/abilities.js";
import sources from "./routes/sources.js";

type Bindings = {
  DATA_BASE_URL?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", logger());
app.use("*", cors());
app.use("*", prettyJSON());
app.use("*", cacheMiddleware);

app.use("*", async (c, next) => {
  if (c.env?.DATA_BASE_URL) {
    setBaseUrl(c.env.DATA_BASE_URL);
  }
  await next();
});

app.get("/", (c) =>
  c.json(
    formatSuccess({
      name: "Warhammer 40k API",
      edition: "10th",
      description:
        "Community API for Warhammer 40,000 10th Edition game data. Powered by Wahapedia.",
      endpoints: {
        factions: "/factions",
        datasheets: "/datasheets/:id",
        search: "/datasheets/search?q=query",
        stratagems: "/stratagems",
        enhancements: "/enhancements",
        detachmentAbilities: "/detachment-abilities",
        abilities: "/abilities",
        sources: "/sources",
        metadata: "/metadata",
      },
    })
  )
);

app.get("/metadata", async (c) => {
  const data = await fetchData("metadata.json");
  return c.json(formatSuccess(data));
});

app.route("/factions", factions);
app.route("/datasheets", datasheets);
app.route("/stratagems", stratagems);
app.route("/enhancements", enhancements);
app.route("/detachment-abilities", detachmentAbilities);
app.route("/abilities", abilities);
app.route("/sources", sources);

app.notFound((c) => c.json(formatError("Not Found"), 404));

app.onError((err, c) => {
  console.error("Error:", err);
  return c.json(formatError("Internal Server Error"), 500);
});

export default app;
