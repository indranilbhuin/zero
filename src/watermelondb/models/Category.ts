import {Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
  static table = 'categories';

  @text('name') name!: string;
  @field('category_status') categoryStatus!: boolean;
  @text('user_id') userId!: string;
  @text('icon') icon?: string;
  @text('color') color!: string;
}
