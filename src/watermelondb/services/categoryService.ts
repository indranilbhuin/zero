import {Q} from '@nozbe/watermelondb';
import {nanoid} from 'nanoid';
import {database} from '../database';
import Category from '../models/Category';

// Type for category data
export interface CategoryData {
  id: string;
  name: string;
  categoryStatus: boolean;
  userId: string;
  icon?: string;
  color: string;
}

/**
 * Creates a new category
 */
export const createCategory = async (
  name: string,
  userId: string,
  icon: string | null,
  color: string | null,
): Promise<string> => {
  const id = nanoid(24);
  await database.write(async () => {
    await database.get<Category>('categories').create(cat => {
      cat._raw.id = id;
      cat.name = name;
      cat.categoryStatus = true;
      cat.userId = userId;
      cat.icon = icon || undefined;
      cat.color = color || '#808080';
    });
  });
  return id;
};

/**
 * Soft deletes a category by ID (sets categoryStatus to false)
 */
export const softDeleteCategoryById = async (
  categoryId: string,
): Promise<void> => {
  await database.write(async () => {
    const category = await database.get<Category>('categories').find(categoryId);
    await category.update(cat => {
      cat.categoryStatus = false;
    });
  });
};

/**
 * Updates a category by ID
 */
export const updateCategoryById = async (
  categoryId: string,
  newName?: string,
  newIcon?: string,
  newColor?: string,
): Promise<void> => {
  await database.write(async () => {
    const category = await database.get<Category>('categories').find(categoryId);
    await category.update(cat => {
      if (newName !== undefined) {
        cat.name = newName;
      }
      if (newIcon !== undefined) {
        cat.icon = newIcon;
      }
      if (newColor !== undefined) {
        cat.color = newColor;
      }
    });
  });
};

/**
 * Gets all categories
 */
export const getAllCategories = async (): Promise<CategoryData[]> => {
  const categories = await database.get<Category>('categories').query().fetch();
  return categories.map(c => ({
    id: c.id,
    name: c.name,
    categoryStatus: c.categoryStatus,
    userId: c.userId,
    icon: c.icon,
    color: c.color,
  }));
};

/**
 * Gets all categories by user ID
 */
export const getAllCategoriesByUserId = async (
  userId: string,
): Promise<CategoryData[]> => {
  const categories = await database
    .get<Category>('categories')
    .query(Q.where('user_id', userId))
    .fetch();
  return categories.map(c => ({
    id: c.id,
    name: c.name,
    categoryStatus: c.categoryStatus,
    userId: c.userId,
    icon: c.icon,
    color: c.color,
  }));
};

/**
 * Gets active categories by user ID
 */
export const getActiveCategoriesByUserId = async (
  userId: string,
): Promise<CategoryData[]> => {
  const categories = await database
    .get<Category>('categories')
    .query(Q.where('user_id', userId), Q.where('category_status', true))
    .fetch();
  return categories.map(c => ({
    id: c.id,
    name: c.name,
    categoryStatus: c.categoryStatus,
    userId: c.userId,
    icon: c.icon,
    color: c.color,
  }));
};

/**
 * Gets a category by ID
 */
export const getCategoryById = async (
  categoryId: string,
): Promise<CategoryData | null> => {
  try {
    const category = await database
      .get<Category>('categories')
      .find(categoryId);
    return {
      id: category.id,
      name: category.name,
      categoryStatus: category.categoryStatus,
      userId: category.userId,
      icon: category.icon,
      color: category.color,
    };
  } catch {
    return null;
  }
};
