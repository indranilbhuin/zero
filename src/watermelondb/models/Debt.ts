import {Model, Relation} from '@nozbe/watermelondb';
import {field, text, immutableRelation} from '@nozbe/watermelondb/decorators';
import type Debtor from './Debtor';
import type User from './User';

export default class Debt extends Model {
  static table = 'debts';

  static associations = {
    debtors: {type: 'belongs_to' as const, key: 'debtor_id'},
    users: {type: 'belongs_to' as const, key: 'user_id'},
  };

  @text('description') description!: string;
  @field('amount') amount!: number;
  @text('debtor_id') debtorId!: string;
  @text('user_id') userId!: string;
  @text('date') date!: string;
  @text('type') type!: string;

  @immutableRelation('debtors', 'debtor_id') debtor!: Relation<Debtor>;
  @immutableRelation('users', 'user_id') user!: Relation<User>;
}
