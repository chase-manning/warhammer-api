import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { RAW_CSV_DIR, DATA_DIR, CSV_FILES } from "./config.js";
import { parseCsv, stripHtml, type RawRecord } from "./csv-parser.js";

function log(msg: string) {
  console.log(`[convert] ${msg}`);
}

function readCsv(fileName: string): RawRecord[] {
  const path = join(RAW_CSV_DIR, fileName);
  const content = readFileSync(path, "utf-8");
  return parseCsv(content);
}

function writeJson(fileName: string, data: unknown): void {
  const path = join(DATA_DIR, fileName);
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
  const count = Array.isArray(data) ? data.length : 1;
  log(`  Wrote ${fileName} (${Array.isArray(data) ? `${count} records` : "object"})`);
}

function toNumber(value: string | undefined): number | null {
  if (!value || value === "-" || value.trim() === "") return null;
  const cleaned = value.replace(/["+]/g, "").trim();
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
}

function toBool(value: string | undefined): boolean {
  return value?.toLowerCase() === "true";
}

function clean(value: string | undefined): string {
  if (!value) return "";
  return stripHtml(value).trim();
}

function cleanOrNull(value: string | undefined): string | null {
  const cleaned = clean(value);
  return cleaned || null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Faction ---
interface Faction {
  id: string;
  name: string;
  link: string;
}

function convertFactions(raw: RawRecord[]): Faction[] {
  return raw.map((r) => ({
    id: r.id,
    name: r.name,
    link: r.link,
  }));
}

// --- Source ---
interface Source {
  id: string;
  name: string;
  type: string;
  edition: number | null;
  version: string | null;
  errataDate: string | null;
  errataLink: string | null;
}

function convertSources(raw: RawRecord[]): Source[] {
  return raw.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    edition: toNumber(r.edition),
    version: r.version || null,
    errataDate: r.errataDate || null,
    errataLink: r.errataLink || null,
  }));
}

// --- Ability ---
interface Ability {
  id: string;
  name: string;
  factionId: string;
  legend: string;
  description: string;
}

function convertAbilities(raw: RawRecord[]): Ability[] {
  const seen = new Map<string, Ability>();
  for (const r of raw) {
    const key = `${r.id}|${r.factionId}`;
    if (!seen.has(key)) {
      seen.set(key, {
        id: r.id,
        name: r.name,
        factionId: r.factionId,
        legend: clean(r.legend),
        description: clean(r.description),
      });
    }
  }
  return Array.from(seen.values());
}

// --- Datasheet ---
interface Datasheet {
  id: string;
  name: string;
  factionId: string;
  sourceId: string;
  slug: string;
  legend: string;
  role: string | null;
  loadout: string;
  transport: string | null;
  virtual: boolean;
  leaderHeader: string | null;
  leaderFooter: string | null;
  damagedWounds: string | null;
  damagedDescription: string | null;
  link: string;
}

function convertDatasheets(raw: RawRecord[]): Datasheet[] {
  return raw.map((r) => ({
    id: r.id,
    name: r.name,
    factionId: r.factionId,
    sourceId: r.sourceId,
    slug: slugify(r.name),
    legend: clean(r.legend),
    role: r.role || null,
    loadout: clean(r.loadout),
    transport: cleanOrNull(r.transport),
    virtual: toBool(r.virtual),
    leaderHeader: cleanOrNull(r.leaderHead),
    leaderFooter: cleanOrNull(r.leaderFooter),
    damagedWounds: r.damagedW || null,
    damagedDescription: cleanOrNull(r.damagedDescription),
    link: r.link,
  }));
}

// --- Datasheet Model (stat line) ---
interface DatasheetModel {
  datasheetId: string;
  line: number;
  name: string;
  movement: string;
  toughness: number | null;
  save: string;
  invulnerableSave: string | null;
  invulnerableSaveDescription: string | null;
  wounds: number | null;
  leadership: string;
  objectiveControl: number | null;
  baseSize: string | null;
  baseSizeDescription: string | null;
}

function convertDatasheetModels(raw: RawRecord[]): DatasheetModel[] {
  return raw.map((r) => ({
    datasheetId: r.datasheetId,
    line: toNumber(r.line) ?? 1,
    name: r.name,
    movement: r.m,
    toughness: toNumber(r.t),
    save: r.sv,
    invulnerableSave: r.invSv && r.invSv !== "-" ? r.invSv : null,
    invulnerableSaveDescription: cleanOrNull(r.invSvDescr),
    wounds: toNumber(r.w),
    leadership: r.ld,
    objectiveControl: toNumber(r.oc),
    baseSize: r.baseSize || null,
    baseSizeDescription: r.baseSizeDescr || null,
  }));
}

// --- Datasheet Wargear (weapon profiles) ---
interface DatasheetWargear {
  datasheetId: string;
  line: number;
  lineInWargear: number;
  dice: string | null;
  name: string;
  description: string | null;
  range: string;
  type: string;
  attacks: string;
  ballisticSkillOrWeaponSkill: string;
  strength: string;
  armourPenetration: string;
  damage: string;
}

function convertDatasheetWargear(raw: RawRecord[]): DatasheetWargear[] {
  return raw.map((r) => ({
    datasheetId: r.datasheetId,
    line: toNumber(r.line) ?? 1,
    lineInWargear: toNumber(r.lineInWargear) ?? 1,
    dice: r.dice || null,
    name: r.name,
    description: cleanOrNull(r.description),
    range: r.range,
    type: r.type,
    attacks: r.a,
    ballisticSkillOrWeaponSkill: r.bsWs,
    strength: r.s,
    armourPenetration: r.ap,
    damage: r.d,
  }));
}

// --- Datasheet Abilities ---
interface DatasheetAbility {
  datasheetId: string;
  line: number;
  abilityId: string | null;
  model: string | null;
  name: string | null;
  description: string | null;
  type: string;
  parameter: string | null;
}

function convertDatasheetAbilities(raw: RawRecord[]): DatasheetAbility[] {
  return raw.map((r) => ({
    datasheetId: r.datasheetId,
    line: toNumber(r.line) ?? 1,
    abilityId: r.abilityId || null,
    model: r.model || null,
    name: r.name || null,
    description: cleanOrNull(r.description),
    type: r.type,
    parameter: r.parameter || null,
  }));
}

// --- Datasheet Keywords ---
interface DatasheetKeyword {
  datasheetId: string;
  keyword: string;
  model: string | null;
  isFactionKeyword: boolean;
}

function convertDatasheetKeywords(raw: RawRecord[]): DatasheetKeyword[] {
  return raw.map((r) => ({
    datasheetId: r.datasheetId,
    keyword: r.keyword,
    model: r.model || null,
    isFactionKeyword: toBool(r.isFactionKeyword),
  }));
}

// --- Datasheet Options ---
interface DatasheetOption {
  datasheetId: string;
  line: number;
  button: string | null;
  description: string;
}

function convertDatasheetOptions(raw: RawRecord[]): DatasheetOption[] {
  return raw.map((r) => ({
    datasheetId: r.datasheetId,
    line: toNumber(r.line) ?? 1,
    button: r.button || null,
    description: clean(r.description),
  }));
}

// --- Datasheet Unit Composition ---
interface DatasheetUnitComposition {
  datasheetId: string;
  line: number;
  description: string;
}

function convertDatasheetUnitComposition(raw: RawRecord[]): DatasheetUnitComposition[] {
  return raw.map((r) => ({
    datasheetId: r.datasheetId,
    line: toNumber(r.line) ?? 1,
    description: clean(r.description),
  }));
}

// --- Datasheet Cost ---
interface DatasheetCost {
  datasheetId: string;
  line: number;
  description: string;
  cost: number | null;
}

function convertDatasheetCosts(raw: RawRecord[]): DatasheetCost[] {
  return raw.map((r) => ({
    datasheetId: r.datasheetId,
    line: toNumber(r.line) ?? 1,
    description: r.description,
    cost: toNumber(r.cost),
  }));
}

// --- Datasheet Leader (junction) ---
interface DatasheetLeader {
  leaderId: string;
  attachedId: string;
}

function convertDatasheetLeaders(raw: RawRecord[]): DatasheetLeader[] {
  return raw.map((r) => ({
    leaderId: r.leaderId,
    attachedId: r.attachedId,
  }));
}

// --- Stratagems ---
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

function convertStratagems(raw: RawRecord[]): Stratagem[] {
  return raw.map((r) => ({
    id: r.id,
    factionId: r.factionId || null,
    name: r.name,
    type: r.type,
    cpCost: toNumber(r.cpCost),
    legend: clean(r.legend),
    turn: r.turn || null,
    phase: r.phase || null,
    detachment: r.detachment || null,
    detachmentId: r.detachmentId || null,
    description: clean(r.description),
  }));
}

// --- Enhancements ---
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

function convertEnhancements(raw: RawRecord[]): Enhancement[] {
  return raw.map((r) => ({
    id: r.id,
    factionId: r.factionId,
    name: r.name,
    cost: toNumber(r.cost),
    detachment: r.detachment,
    detachmentId: r.detachmentId || null,
    legend: clean(r.legend),
    description: clean(r.description),
  }));
}

// --- Detachment Abilities ---
interface DetachmentAbility {
  id: string;
  factionId: string;
  name: string;
  legend: string;
  description: string;
  detachment: string;
  detachmentId: string | null;
}

function convertDetachmentAbilities(raw: RawRecord[]): DetachmentAbility[] {
  return raw.map((r) => ({
    id: r.id,
    factionId: r.factionId,
    name: r.name,
    legend: clean(r.legend),
    description: clean(r.description),
    detachment: r.detachment,
    detachmentId: r.detachmentId || null,
  }));
}

// --- Junction tables ---
interface DatasheetStratagem {
  datasheetId: string;
  stratagemId: string;
}

interface DatasheetEnhancement {
  datasheetId: string;
  enhancementId: string;
}

interface DatasheetDetachmentAbility {
  datasheetId: string;
  detachmentAbilityId: string;
}

function convertJunction(
  raw: RawRecord[],
  keyA: string,
  keyB: string,
  nameA: string,
  nameB: string
): Record<string, string>[] {
  return raw.map((r) => ({
    [nameA]: r[keyA],
    [nameB]: r[keyB],
  }));
}

// --- Metadata ---
interface Metadata {
  lastUpdate: string | null;
  generatedAt: string;
  source: string;
  edition: string;
  fileCount: number;
}

// --- Main conversion ---
export function convertAllData(): void {
  log("Starting conversion from CSV to normalized JSON...");

  if (existsSync(DATA_DIR)) {
    rmSync(DATA_DIR, { recursive: true, force: true });
  }
  mkdirSync(DATA_DIR, { recursive: true });

  // Read all CSV files
  log("Reading CSV files...");
  const rawFactions = readCsv("Factions.csv");
  const rawSources = readCsv("Source.csv");
  const rawDatasheets = readCsv("Datasheets.csv");
  const rawDatasheetAbilities = readCsv("Datasheets_abilities.csv");
  const rawDatasheetKeywords = readCsv("Datasheets_keywords.csv");
  const rawDatasheetModels = readCsv("Datasheets_models.csv");
  const rawDatasheetOptions = readCsv("Datasheets_options.csv");
  const rawDatasheetWargear = readCsv("Datasheets_wargear.csv");
  const rawDatasheetUnitComp = readCsv("Datasheets_unit_composition.csv");
  const rawDatasheetCosts = readCsv("Datasheets_models_cost.csv");
  const rawDatasheetStratagems = readCsv("Datasheets_stratagems.csv");
  const rawDatasheetEnhancements = readCsv("Datasheets_enhancements.csv");
  const rawDatasheetDetachmentAbilities = readCsv("Datasheets_detachment_abilities.csv");
  const rawDatasheetLeaders = readCsv("Datasheets_leader.csv");
  const rawStratagems = readCsv("Stratagems.csv");
  const rawAbilities = readCsv("Abilities.csv");
  const rawEnhancements = readCsv("Enhancements.csv");
  const rawDetachmentAbilities = readCsv("Detachment_abilities.csv");
  const rawLastUpdate = readCsv("Last_update.csv");

  // Convert and write normalized JSON
  log("Converting to normalized JSON...");

  const metadata: Metadata = {
    lastUpdate: rawLastUpdate[0]?.lastUpdate ?? null,
    generatedAt: new Date().toISOString(),
    source: "https://wahapedia.ru/wh40k10ed/the-rules/data-export",
    edition: "10th",
    fileCount: CSV_FILES.length,
  };
  writeJson("metadata.json", metadata);

  writeJson("factions.json", convertFactions(rawFactions));
  writeJson("sources.json", convertSources(rawSources));
  writeJson("abilities.json", convertAbilities(rawAbilities));
  writeJson("datasheets.json", convertDatasheets(rawDatasheets));
  writeJson("datasheet_models.json", convertDatasheetModels(rawDatasheetModels));
  writeJson("datasheet_wargear.json", convertDatasheetWargear(rawDatasheetWargear));
  writeJson("datasheet_abilities.json", convertDatasheetAbilities(rawDatasheetAbilities));
  writeJson("datasheet_keywords.json", convertDatasheetKeywords(rawDatasheetKeywords));
  writeJson("datasheet_options.json", convertDatasheetOptions(rawDatasheetOptions));
  writeJson(
    "datasheet_unit_compositions.json",
    convertDatasheetUnitComposition(rawDatasheetUnitComp)
  );
  writeJson("datasheet_costs.json", convertDatasheetCosts(rawDatasheetCosts));
  writeJson("datasheet_leaders.json", convertDatasheetLeaders(rawDatasheetLeaders));
  writeJson("stratagems.json", convertStratagems(rawStratagems));
  writeJson("enhancements.json", convertEnhancements(rawEnhancements));
  writeJson("detachment_abilities.json", convertDetachmentAbilities(rawDetachmentAbilities));

  writeJson(
    "datasheet_stratagems.json",
    convertJunction(
      rawDatasheetStratagems,
      "datasheetId",
      "stratagemId",
      "datasheetId",
      "stratagemId"
    )
  );
  writeJson(
    "datasheet_enhancements.json",
    convertJunction(
      rawDatasheetEnhancements,
      "datasheetId",
      "enhancementId",
      "datasheetId",
      "enhancementId"
    )
  );
  writeJson(
    "datasheet_detachment_abilities.json",
    convertJunction(
      rawDatasheetDetachmentAbilities,
      "datasheetId",
      "detachmentAbilityId",
      "datasheetId",
      "detachmentAbilityId"
    )
  );

  log("Normalized JSON conversion complete.");

  // Now generate denormalized per-faction files
  generateFactionFiles(metadata);
}

// --- Denormalized per-faction files ---
function generateFactionFiles(metadata: Metadata): void {
  log("Generating denormalized per-faction datasheet files...");

  const factionsDir = join(DATA_DIR, "factions");
  mkdirSync(factionsDir, { recursive: true });

  const factions: Faction[] = JSON.parse(
    readFileSync(join(DATA_DIR, "factions.json"), "utf-8")
  );
  const datasheets: Datasheet[] = JSON.parse(
    readFileSync(join(DATA_DIR, "datasheets.json"), "utf-8")
  );
  const models: DatasheetModel[] = JSON.parse(
    readFileSync(join(DATA_DIR, "datasheet_models.json"), "utf-8")
  );
  const wargear: DatasheetWargear[] = JSON.parse(
    readFileSync(join(DATA_DIR, "datasheet_wargear.json"), "utf-8")
  );
  const abilities: DatasheetAbility[] = JSON.parse(
    readFileSync(join(DATA_DIR, "datasheet_abilities.json"), "utf-8")
  );
  const keywords: DatasheetKeyword[] = JSON.parse(
    readFileSync(join(DATA_DIR, "datasheet_keywords.json"), "utf-8")
  );
  const options: DatasheetOption[] = JSON.parse(
    readFileSync(join(DATA_DIR, "datasheet_options.json"), "utf-8")
  );
  const unitComps: DatasheetUnitComposition[] = JSON.parse(
    readFileSync(join(DATA_DIR, "datasheet_unit_compositions.json"), "utf-8")
  );
  const costs: DatasheetCost[] = JSON.parse(
    readFileSync(join(DATA_DIR, "datasheet_costs.json"), "utf-8")
  );
  const leaders: DatasheetLeader[] = JSON.parse(
    readFileSync(join(DATA_DIR, "datasheet_leaders.json"), "utf-8")
  );
  const sharedAbilities: Ability[] = JSON.parse(
    readFileSync(join(DATA_DIR, "abilities.json"), "utf-8")
  );

  // Build lookup maps for performance
  const modelsByDs = groupBy(models, "datasheetId");
  const wargearByDs = groupBy(wargear, "datasheetId");
  const abilitiesByDs = groupBy(abilities, "datasheetId");
  const keywordsByDs = groupBy(keywords, "datasheetId");
  const optionsByDs = groupBy(options, "datasheetId");
  const unitCompsByDs = groupBy(unitComps, "datasheetId");
  const costsByDs = groupBy(costs, "datasheetId");
  const leadersByLeaderId = groupBy(leaders, "leaderId");
  const sharedAbilityMap = new Map(sharedAbilities.map((a) => [a.id, a]));
  const datasheetMap = new Map(datasheets.map((d) => [d.id, d]));

  const factionIndex: { id: string; name: string; slug: string; datasheetCount: number }[] = [];

  for (const faction of factions) {
    const factionDatasheets = datasheets.filter(
      (d) => d.factionId === faction.id && !d.virtual
    );

    if (factionDatasheets.length === 0) continue;

    const factionSlug = slugify(faction.name);
    const factionDir = join(factionsDir, factionSlug);
    mkdirSync(factionDir, { recursive: true });

    const datasheetSummaries: {
      id: string;
      name: string;
      slug: string;
      role: string | null;
    }[] = [];

    for (const ds of factionDatasheets) {
      const dsAbilities = (abilitiesByDs.get(ds.id) ?? []).map((a) => {
        if (a.abilityId) {
          const shared = sharedAbilityMap.get(a.abilityId);
          if (shared) {
            return {
              name: shared.name,
              description: shared.description,
              type: a.type,
              parameter: a.parameter,
            };
          }
        }
        return {
          name: a.name,
          description: a.description,
          type: a.type,
          parameter: a.parameter,
        };
      });

      const dsKeywords = (keywordsByDs.get(ds.id) ?? []).map((k) => ({
        keyword: k.keyword,
        isFactionKeyword: k.isFactionKeyword,
        model: k.model,
      }));

      const dsLeaderAttachments = (leadersByLeaderId.get(ds.id) ?? []).map((l) => {
        const attached = datasheetMap.get(l.attachedId);
        return {
          id: l.attachedId,
          name: attached?.name ?? "Unknown",
        };
      });

      const fullDatasheet = {
        ...ds,
        models: modelsByDs.get(ds.id) ?? [],
        wargear: wargearByDs.get(ds.id) ?? [],
        abilities: dsAbilities,
        keywords: dsKeywords,
        options: optionsByDs.get(ds.id) ?? [],
        unitComposition: unitCompsByDs.get(ds.id) ?? [],
        costs: costsByDs.get(ds.id) ?? [],
        leaderAttachments: dsLeaderAttachments,
      };

      writeFileSync(
        join(factionDir, `${ds.id}.json`),
        JSON.stringify(fullDatasheet, null, 2),
        "utf-8"
      );

      datasheetSummaries.push({
        id: ds.id,
        name: ds.name,
        slug: ds.slug,
        role: ds.role,
      });
    }

    const factionManifest = {
      id: faction.id,
      name: faction.name,
      slug: factionSlug,
      link: faction.link,
      datasheetCount: datasheetSummaries.length,
      datasheets: datasheetSummaries.sort((a, b) => a.name.localeCompare(b.name)),
    };

    writeFileSync(
      join(factionDir, "_manifest.json"),
      JSON.stringify(factionManifest, null, 2),
      "utf-8"
    );

    factionIndex.push({
      id: faction.id,
      name: faction.name,
      slug: factionSlug,
      datasheetCount: datasheetSummaries.length,
    });

    log(`  ${faction.name}: ${datasheetSummaries.length} datasheets`);
  }

  writeFileSync(
    join(factionsDir, "_index.json"),
    JSON.stringify(factionIndex.sort((a, b) => a.name.localeCompare(b.name)), null, 2),
    "utf-8"
  );

  log(
    `Generated ${factionIndex.length} faction directories with ${factionIndex.reduce((s, f) => s + f.datasheetCount, 0)} total datasheets.`
  );
}

function groupBy<T>(items: T[], key: keyof T): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = String(item[key]);
    const arr = map.get(k);
    if (arr) arr.push(item);
    else map.set(k, [item]);
  }
  return map;
}
