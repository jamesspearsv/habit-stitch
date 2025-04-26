/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // add up queries...
    let habits = new Collection({
      type: 'base',
      name: 'habits',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { type: 'text', name: 'habit_name', required: true },
        { type: 'number', name: 'habit_goal', required: true },
      ],
    })
    app.save(habits)

    let log = new Collection({
      type: 'base',
      name: 'activities',
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        {
          name: 'habit_id',
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
    let log = app.findCollectionByNameOrId('activities')
    app.delete(log)
    app.delete(habits)
  },
)
