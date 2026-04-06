import {sanitizeString, DEFAULTS} from '../sanitize';
import {COLOR_REMAP} from '../migrations/scripts/002_remap_category_colors';
import {CURRENT_EXPORT_VERSION, type ExportData} from './format';

interface RawExport {
  key: string;
  version?: number;
  data: ExportData;
}

/**
 * Upgrades an imported export file to the current format version.
 * Applies sequential transformations: v0→v1, v1→v2, etc.
 *
 * Legacy files (exported before versioning) have no `version` field
 * and are treated as version 0.
 */
export const upgradeExportData = (raw: RawExport): ExportData => {
  let data = raw.data;
  let version = raw.version ?? 0;

  if (version < 1) {
    data = upgradeV0toV1(data);
    version = 1;
  }

  if (version < 2) {
    data = upgradeV1toV2(data);
    version = 2;
  }

  if (version < 3) {
    data = upgradeV2toV3(data);
    version = 3;
  }

  if (__DEV__ && version < CURRENT_EXPORT_VERSION) {
    console.warn(`Export format v${version} is behind current v${CURRENT_EXPORT_VERSION}`);
  }

  return data;
};

/** Shared sanitization pass for icon/color/type across categories and debtors. */
const sanitizeEntities = (data: ExportData): ExportData => ({
  ...data,
  categories: data.categories.map(c => ({
    ...c,
    icon: sanitizeString(c.icon, DEFAULTS.icon),
    color: sanitizeString(c.color, DEFAULTS.color),
  })),
  debtors: data.debtors.map(d => ({
    ...d,
    icon: sanitizeString(d.icon, DEFAULTS.icon),
    type: sanitizeString(d.type, DEFAULTS.type),
    color: sanitizeString(d.color, DEFAULTS.color),
  })),
});

/**
 * v0 → v1: Sanitize poisoned icon/color values in categories and debtors.
 * Legacy exports stored literal "null" strings for missing icon/color.
 */
const upgradeV0toV1 = (data: ExportData): ExportData => sanitizeEntities(data);

/**
 * v1 → v2: Aligns with DB schema v2. Same entity shape — re-sanitize pass
 * to guarantee all values meet the v2 contract.
 */
const upgradeV1toV2 = (data: ExportData): ExportData => sanitizeEntities(data);

const remapColor = (color: string | undefined): string | undefined => {
  if (!color) {return color;}
  return COLOR_REMAP[color.toUpperCase()] ?? color;
};

/**
 * v2 → v3: WCAG 2.2 color compliance. Remaps old category/debtor colors
 * to the new accessible palette. Colors not in the remap table are untouched.
 */
const upgradeV2toV3 = (data: ExportData): ExportData => ({
  ...data,
  categories: data.categories.map(c => ({
    ...c,
    color: remapColor(c.color),
  })),
  debtors: data.debtors.map(d => ({
    ...d,
    color: remapColor(d.color),
  })),
});
