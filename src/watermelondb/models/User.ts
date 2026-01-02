import {Model} from '@nozbe/watermelondb';
import {text} from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  @text('username') username!: string;
  @text('email') email!: string;
}
