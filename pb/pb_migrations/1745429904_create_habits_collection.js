/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // add up queries...
    let habits = new Collection({
      type: 'base',
      name: 'habits',
      listRule: null,
      viewRule: "@request.auth.id != ''",
      createRule: '',
      updateRule: "@request.auth.id != ''",
      fields: [
        { type: 'text', name: 'habit_name', required: true },
        { type: 'number', name: 'habit_goal', required: true },
      ],
    })
    app.save(habits)

    let log = new Collection({
      type: 'base',
      name: 'log',
      listRule: null,
      viewRule: "@request.auth.id != ''",
      createRule: '',
      updateRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'habit',
          type: 'relation',
          required: true,
          cascadeDelete: false,
          collectionID: habits.id,
        },
        { name: 'date', type: 'date', required: true },
      ],
    })

    app.save(log)
  },
  (app) => {
    // add down queries...
    let habits = app.findCollectionByNameOrId('habits')
    let log = app.findCollectionByNameOrId('log')
    app.delete(log)
    app.delete(habits)
  },
)
