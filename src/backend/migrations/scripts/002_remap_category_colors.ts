import {database} from '../../../watermelondb/database';
import Category from '../../../watermelondb/models/Category';
import Debtor from '../../../watermelondb/models/Debtor';

interface DataMigration {
  version: number;
  name: string;
  up: () => Promise<void>;
}

/**
 * WCAG 2.2 compliant remapping. Every old color maps to a new color
 * within the same hue family so the visual change is minimal.
 * Colors not in this map (custom or already compliant) are left untouched.
 */
export const COLOR_REMAP: Record<string, string> = {
  '#FFA500': '#C47030',
  '#FF6347': '#D06850',
  '#FF4500': '#D25555',
  '#DC143C': '#D25555',
  '#FF69B4': '#CC5588',
  '#FFB6C1': '#CC5588',
  '#800080': '#A870A8',
  '#9370DB': '#9575B8',
  '#8A2BE2': '#8078C0',
  '#483D8B': '#8078C0',
  '#4169E1': '#4D85BB',
  '#0000FF': '#4588BB',
  '#00BFFF': '#4588BB',
  '#1E90FF': '#3A85B5',
  '#87CEEB': '#5585A5',
  '#00CED1': '#3D9090',
  '#008080': '#2E8B8B',
  '#32CD32': '#3D9960',
  '#228B22': '#4D8D50',
  '#FFD700': '#9E8420',
  '#008000': '#4D8D50',
  '#FF8C00': '#BF6B30',
  '#00FA9A': '#3D9975',
  '#FF1493': '#D05080',
  '#20B2AA': '#3D9090',
  '#40E0D0': '#409090',
  '#696969': '#8A7D72',
  '#B0E57C': '#6E8E55',
  '#87CEFA': '#4588BB',
  '#FFA07A': '#D06850',
  '#CD853F': '#BF6B30',
  '#A9A973': '#7D8225',
  '#808080': '#758595',
};

const up = async (): Promise<void> => {
  const caseInsensitiveMap = new Map<string, string>();
  for (const [old, replacement] of Object.entries(COLOR_REMAP)) {
    caseInsensitiveMap.set(old.toUpperCase(), replacement);
  }

  await database.write(async () => {
    const categories = await database
      .get<Category>('categories')
      .query()
      .fetch();
    for (const cat of categories) {
      const mapped = caseInsensitiveMap.get(cat.color.toUpperCase());
      if (mapped) {
        await cat.update(c => {
          c.color = mapped;
        });
      }
    }

    const debtors = await database.get<Debtor>('debtors').query().fetch();
    for (const debtor of debtors) {
      const mapped = caseInsensitiveMap.get(debtor.color.toUpperCase());
      if (mapped) {
        await debtor.update(d => {
          d.color = mapped;
        });
      }
    }
  });
};

export const migration_002: DataMigration = {
  version: 2,
  name: 'remap_category_colors_wcag',
  up,
};
