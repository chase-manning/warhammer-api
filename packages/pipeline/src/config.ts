import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = join(__dirname, "..", "..", "..");

export const RAW_CSV_DIR = join(PROJECT_ROOT, "raw_csv");
export const DATA_DIR = join(PROJECT_ROOT, "data");
export const CUSTOM_DIR = join(PROJECT_ROOT, "custom");

export const WAHAPEDIA_BASE_URL = "http://wahapedia.ru/wh40k10ed";

export const CSV_FILES = [
  "Factions.csv",
  "Source.csv",
  "Datasheets.csv",
  "Datasheets_abilities.csv",
  "Datasheets_keywords.csv",
  "Datasheets_models.csv",
  "Datasheets_options.csv",
  "Datasheets_wargear.csv",
  "Datasheets_unit_composition.csv",
  "Datasheets_models_cost.csv",
  "Datasheets_stratagems.csv",
  "Datasheets_enhancements.csv",
  "Datasheets_detachment_abilities.csv",
  "Datasheets_leader.csv",
  "Stratagems.csv",
  "Abilities.csv",
  "Enhancements.csv",
  "Detachment_abilities.csv",
  "Last_update.csv",
] as const;
