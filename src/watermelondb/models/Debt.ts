import {Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';

export default class Debt extends Model {
  static table = 'debts';

  @text('description') description!: string;
  @field('amount') amount!: number;
  @text('debtor_id') debtorId!: string;
  @text('user_id') userId!: string;
  @text('date') date!: string;
  @text('type') type!: string;
}
