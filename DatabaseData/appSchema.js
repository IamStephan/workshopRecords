export const appSchema = {
  schema: [
    {
      name: 'TypesOfTasks',
      primaryKey: 'id',
      properties: {
        id: 'int',
        title: {type: 'string'},
        description: {type: 'string', default: ''}
      }
    },
    {
      name: 'TypesOfTasksOptions',
      primaryKey: 'id',
      properties: {
        id: 'int',
        title: {type: 'string'},
        description: {type: 'string', default: ''}
      }
    },
    {
      name: 'valueList',
      primaryKey: 'id',
      properties: {
        id: 'int',
        value: {type: 'string', default: ''}
      }
    },
    {
      name: 'tasks',
      primaryKey: 'id',
      properties: {
        id: 'int',
        fullname: {type: 'string', default: ''},
        number: {type: 'string', default: ''},
        bike: {type: 'string', default: ''},
        description: {type: 'string', default: ''},
        imageUri: {type: 'string', default: ''},
        archived: {type: 'bool', default: false},
        tasksDone: {type: 'TypesOfTasks[]', default: []},
        itemCreated: {type: 'string', default: ''},
        itemArchived: {type: 'string', default: ''},
        notes: {type: 'valueList[]', default: []}
      }
    }
  ],
  deleteRealmIfMigrationNeeded: true
}