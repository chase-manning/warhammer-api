import { downloadAllCsvFiles } from "./download.js";
import { convertAllData } from "./convert.js";

const args = process.argv.slice(2);
const downloadOnly = args.includes("--download-only");
const convertOnly = args.includes("--convert-only");

async function main() {
  const startTime = Date.now();
  console.log("=== Warhammer 40k Data Pipeline ===\n");

  if (!convertOnly) {
    await downloadAllCsvFiles();
    console.log();
  }

  if (!downloadOnly) {
    convertAllData();
    console.log();
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`=== Pipeline complete in ${elapsed}s ===`);
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
