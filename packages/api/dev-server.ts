import { createServer } from "http";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const DATA_DIR = join(import.meta.dirname!, "..", "..", "data");
const PORT = 8788;

const server = createServer(async (req, res) => {
  const path = req.url?.replace(/^\//, "") ?? "";
  const filePath = join(DATA_DIR, path);

  if (!existsSync(filePath) || !filePath.endsWith(".json")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  try {
    const content = await readFile(filePath, "utf-8");
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(content);
  } catch {
    res.writeHead(500);
    res.end("Server error");
  }
});

server.listen(PORT, () => {
  console.log(`[data-server] Serving data/ on http://localhost:${PORT}`);
});
