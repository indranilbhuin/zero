import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        {name: 'username', type: 'string'},
        {name: 'email', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'category_status', type: 'boolean'},
        {name: 'user_id', type: 'string', isIndexed: true},
        {name: 'icon', type: 'string', isOptional: true},
        {name: 'color', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'expenses',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'amount', type: 'number'},
        {name: 'description', type: 'string', isOptional: true},
        {name: 'category_id', type: 'string', isIndexed: true},
        {name: 'user_id', type: 'string', isIndexed: true},
        {name: 'date', type: 'string', isIndexed: true},
      ],
    }),
    tableSchema({
      name: 'currencies',
      columns: [
        {name: 'code', type: 'string'},
        {name: 'symbol', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'user_id', type: 'string', isIndexed: true},
      ],
    }),
    tableSchema({
      name: 'debtors',
      columns: [
        {name: 'title', type: 'string'},
        {name: 'type', type: 'string'},
        {name: 'debtor_status', type: 'boolean'},
        {name: 'user_id', type: 'string', isIndexed: true},
        {name: 'icon', type: 'string', isOptional: true},
        {name: 'color', type: 'string'},
      ],
    }),
    tableSchema({
      name: 'debts',
      columns: [
        {name: 'description', type: 'string'},
        {name: 'amount', type: 'number'},
        {name: 'debtor_id', type: 'string', isIndexed: true},
        {name: 'user_id', type: 'string', isIndexed: true},
        {name: 'date', type: 'string', isIndexed: true},
        {name: 'type', type: 'string'},
      ],
    }),
  ],
});

export default schema;
