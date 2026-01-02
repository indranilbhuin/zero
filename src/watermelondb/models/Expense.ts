import {Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';

export default class Expense extends Model {
  static table = 'expenses';

  @text('title') title!: string;
  @field('amount') amount!: number;
  @text('description') description?: string;
  @text('category_id') categoryId!: string;
  @text('user_id') userId!: string;
  @text('date') date!: string;
}
