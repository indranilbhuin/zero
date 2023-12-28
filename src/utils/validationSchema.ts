import {z} from 'zod';

export const nameSchema = z
  .string()
  .refine(value => /^[A-Za-z\s]+$/.test(value), {
    message: 'Name can only contain letters and spaces.',
  })
  .refine(value => value.length >= 3, {
    message: 'Name must be at least 3 characters long.',
  })
  .refine(value => value.length <= 50, {
    message: 'Name cannot exceed 50 characters.',
  });

export const expenseSchema = z
  .string()
  .min(1, 'Expense must be at least 1 character long.')
  .max(25, 'Expense cannot exceed 25 characters.');

export const expenseDescriptionSchema = z
  .string()
  .min(0, 'Expense Description must be at least 1 character long.')
  .max(50, 'Expense Description cannot exceed 50 characters.');

export const expenseAmountSchema = z
  .number()
  .min(0.01, 'Expense Amount cannot be less than 0.')
  .max(1000000, 'Expense Amount cannot exceed 1000000.');

export const categorySchema = z
  .string()
  .refine(value => /^[A-Za-z0-9\s]+$/.test(value), {
    message: 'Category Name can only contain letters, spaces, and numbers.',
  })
  .refine(value => value.length >= 1, {
    message: 'Category Name must be at least 1 character long.',
  })
  .refine(value => value.length <= 18, {
    message: 'Category Name cannot exceed 18 characters.',
  });
