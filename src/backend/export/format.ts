/**
 * Export format versioning.
 * Aligned with DB schema version (watermelondb/schema.ts).
 *
 * VERSION HISTORY:
 *   v0 (legacy) — no version field in JSON. icon/color may contain "null" strings.
 *   v1          — added version field. Sanitized icon/color/type values.
 *   v2          — aligned with DB schema v2. Same entity shape as v1,
 *                 establishes the convention: export version = schema version.
 *
 * RULES:
 *   - Keep CURRENT_EXPORT_VERSION in sync with DB schema version.
 *   - Bump when the ExportData shape changes (new entity, renamed/removed field, type change).
 *   - Add a corresponding upgrader step in upgrader.ts (vN → vN+1).
 *   - NEVER remove old upgrader steps — a v0 file must still import into a v99 app.
 *
 * FILE NAMING:
 *   Exported files are named: zero_v{version}_{timestamp}.json
 *   Example: zero_v2_20260321163018.json
 *   The version in the filename matches the version inside the JSON.
 */
export const CURRENT_EXPORT_VERSION = 2;

export interface ExportData {
  users: Array<{
    username: string;
    email: string;
  }>;
  categories: Array<{
    name: string;
    icon?: string;
    color?: string;
  }>;
  expenses: Array<{
    title: string;
    amount: number;
    description?: string;
    category: {name: string};
    date: string;
  }>;
  currencies: Array<{
    code: string;
    symbol: string;
    name: string;
  }>;
  debtors: Array<{
    title: string;
    icon?: string;
    type?: string;
    color?: string;
  }>;
  debts: Array<{
    amount: number;
    description: string;
    debtor: {title: string};
    date: string;
    type: string;
  }>;
}

export interface ExportEnvelope {
  key: string;
  version: number;
  data: ExportData;
}
