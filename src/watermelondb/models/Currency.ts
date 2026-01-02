import {Model} from '@nozbe/watermelondb';
import {text} from '@nozbe/watermelondb/decorators';

export default class Currency extends Model {
  static table = 'currencies';

  @text('code') code!: string;
  @text('symbol') symbol!: string;
  @text('name') name!: string;
  @text('user_id') userId!: string;
}
