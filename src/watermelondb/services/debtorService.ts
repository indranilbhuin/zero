import {Q} from '@nozbe/watermelondb';
import {nanoid} from 'nanoid';
import {database} from '../database';
import Debtor from '../models/Debtor';

// Type for debtor data
export interface DebtorData {
  id: string;
  title: string;
  type: string;
  debtorStatus: boolean;
  userId: string;
  icon?: string;
  color: string;
}

/**
 * Creates a new debtor
 */
export const createDebtor = async (
  title: string,
  userId: string,
  icon: string | null,
  type: string,
  color: string | null,
): Promise<string> => {
  const id = nanoid(24);
  await database.write(async () => {
    await database.get<Debtor>('debtors').create(debtor => {
      debtor._raw.id = id;
      debtor.title = title;
      debtor.type = type;
      debtor.debtorStatus = true;
      debtor.userId = userId;
      debtor.icon = icon || undefined;
      debtor.color = color || '#808080';
    });
  });
  return id;
};

/**
 * Soft deletes a debtor by ID (sets debtorStatus to false)
 */
export const softDeleteDebtorById = async (debtorId: string): Promise<void> => {
  await database.write(async () => {
    const debtor = await database.get<Debtor>('debtors').find(debtorId);
    await debtor.update(d => {
      d.debtorStatus = false;
    });
  });
};

/**
 * Permanently deletes a debtor by ID
 */
export const deleteDebtorById = async (debtorId: string): Promise<void> => {
  await database.write(async () => {
    const debtor = await database.get<Debtor>('debtors').find(debtorId);
    await debtor.destroyPermanently();
  });
};

/**
 * Updates a debtor by ID
 */
export const updateDebtorById = async (
  debtorId: string,
  newTitle?: string,
  newType?: string,
  newIcon?: string,
  newColor?: string,
): Promise<void> => {
  await database.write(async () => {
    const debtor = await database.get<Debtor>('debtors').find(debtorId);
    await debtor.update(d => {
      if (newTitle !== undefined) {
        d.title = newTitle;
      }
      if (newType !== undefined) {
        d.type = newType;
      }
      if (newIcon !== undefined) {
        d.icon = newIcon;
      }
      if (newColor !== undefined) {
        d.color = newColor;
      }
    });
  });
};

/**
 * Gets all debtors
 */
export const getAllDebtors = async (): Promise<DebtorData[]> => {
  const debtors = await database.get<Debtor>('debtors').query().fetch();
  return debtors.map(d => ({
    id: d.id,
    title: d.title,
    type: d.type,
    debtorStatus: d.debtorStatus,
    userId: d.userId,
    icon: d.icon,
    color: d.color,
  }));
};

/**
 * Gets all debtors by user ID
 */
export const getAllDebtorsByUserId = async (
  userId: string,
): Promise<DebtorData[]> => {
  const debtors = await database
    .get<Debtor>('debtors')
    .query(Q.where('user_id', userId))
    .fetch();
  return debtors.map(d => ({
    id: d.id,
    title: d.title,
    type: d.type,
    debtorStatus: d.debtorStatus,
    userId: d.userId,
    icon: d.icon,
    color: d.color,
  }));
};

/**
 * Gets active debtors by user ID
 */
export const getActiveDebtorsByUserId = async (
  userId: string,
): Promise<DebtorData[]> => {
  const debtors = await database
    .get<Debtor>('debtors')
    .query(Q.where('user_id', userId), Q.where('debtor_status', true))
    .fetch();
  return debtors.map(d => ({
    id: d.id,
    title: d.title,
    type: d.type,
    debtorStatus: d.debtorStatus,
    userId: d.userId,
    icon: d.icon,
    color: d.color,
  }));
};

/**
 * Gets a debtor by ID
 */
export const getDebtorByDebtorId = async (
  debtorId: string,
): Promise<DebtorData | null> => {
  try {
    const debtor = await database.get<Debtor>('debtors').find(debtorId);
    return {
      id: debtor.id,
      title: debtor.title,
      type: debtor.type,
      debtorStatus: debtor.debtorStatus,
      userId: debtor.userId,
      icon: debtor.icon,
      color: debtor.color,
    };
  } catch {
    return null;
  }
};
