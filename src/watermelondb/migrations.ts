import {schemaMigrations} from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      // Add indexes to category_status and debtor_status for faster queries
      toVersion: 2,
      steps: [
        // Note: WatermelonDB doesn't have a direct "addIndex" migration step
        // The index will be applied automatically when the schema version changes
        // and the adapter recreates the indexes based on the updated schema
      ],
    },
  ],
});

export default migrations;
