import {Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';

export default class Debtor extends Model {
  static table = 'debtors';

  @text('title') title!: string;
  @text('type') type!: string;
  @field('debtor_status') debtorStatus!: boolean;
  @text('user_id') userId!: string;
  @text('icon') icon?: string;
  @text('color') color!: string;
}
