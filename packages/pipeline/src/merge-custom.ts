import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { DATA_DIR, CUSTOM_DIR } from "./config.js";

function log(msg: string) {
  console.log(`[merge-custom] ${msg}`);
}

type CustomFactionFields = Record<string, Record<string, unknown>>;

export function mergeCustomData(): void {
  mergeCustomFactions();
}

function mergeCustomFactions(): void {
  const customPath = join(CUSTOM_DIR, "factions.json");
  if (!existsSync(customPath)) {
    log("No custom/factions.json found, skipping faction merge.");
    return;
  }

  const customFactions: CustomFactionFields = JSON.parse(
    readFileSync(customPath, "utf-8")
  );

  const customIds = Object.keys(customFactions);
  if (customIds.length === 0) {
    log("custom/factions.json is empty, skipping.");
    return;
  }

  log(`Merging custom fields for ${customIds.length} factions...`);

  const indexPath = join(DATA_DIR, "factions", "_index.json");
  const index: Record<string, unknown>[] = JSON.parse(
    readFileSync(indexPath, "utf-8")
  );

  for (const entry of index) {
    const custom = customFactions[entry.id as string];
    if (custom) {
      Object.assign(entry, custom);
    }
  }

  writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf-8");
  log(`  Updated factions/_index.json`);

  const factionsDir = join(DATA_DIR, "factions");
  const slugDirs = readdirSync(factionsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let manifestCount = 0;
  for (const slug of slugDirs) {
    const manifestPath = join(factionsDir, slug, "_manifest.json");
    if (!existsSync(manifestPath)) continue;

    const manifest: Record<string, unknown> = JSON.parse(
      readFileSync(manifestPath, "utf-8")
    );

    const custom = customFactions[manifest.id as string];
    if (custom) {
      Object.assign(manifest, custom);
      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
      manifestCount++;
    }
  }

  log(`  Updated ${manifestCount} faction manifests.`);
}
