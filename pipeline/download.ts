import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { RAW_CSV_DIR, WAHAPEDIA_BASE_URL, CSV_FILES } from "./config.js";

function log(msg: string) {
  console.log(`[download] ${msg}`);
}

export async function downloadAllCsvFiles(): Promise<void> {
  if (!existsSync(RAW_CSV_DIR)) {
    mkdirSync(RAW_CSV_DIR, { recursive: true });
  }

  log(`Downloading ${CSV_FILES.length} CSV files from Wahapedia...`);

  const results = await Promise.all(
    CSV_FILES.map(async (fileName) => {
      const url = `${WAHAPEDIA_BASE_URL}/${fileName}`;
      log(`  Fetching ${fileName}...`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to download ${fileName}: ${response.status} ${response.statusText}`
        );
      }
      const text = await response.text();
      const dest = join(RAW_CSV_DIR, fileName);
      writeFileSync(dest, text, "utf-8");
      const lineCount = text.split("\n").length;
      log(`  Saved ${fileName} (${lineCount} lines)`);
      return { fileName, lineCount };
    })
  );

  const totalLines = results.reduce((sum, r) => sum + r.lineCount, 0);
  log(`Download complete. ${results.length} files, ~${totalLines} total lines.`);
}
