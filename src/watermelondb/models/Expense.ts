import {Model, Relation} from '@nozbe/watermelondb';
import {field, text, immutableRelation} from '@nozbe/watermelondb/decorators';
import type Category from './Category';
import type User from './User';

export default class Expense extends Model {
  static table = 'expenses';

  static associations = {
    categories: {type: 'belongs_to' as const, key: 'category_id'},
    users: {type: 'belongs_to' as const, key: 'user_id'},
  };

  @text('title') title!: string;
  @field('amount') amount!: number;
  @text('description') description?: string;
  @text('category_id') categoryId!: string;
  @text('user_id') userId!: string;
  @text('date') date!: string;

  @immutableRelation('categories', 'category_id') category!: Relation<Category>;
  @immutableRelation('users', 'user_id') user!: Relation<User>;
}
