/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    // add up queries...
    let habits = new Collection({
      type: 'base',
      name: 'habits',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        { type: 'text', name: 'habit_name', required: true },
        {
          type: 'text',
          name: 'habit_color',
          autogeneratePattern: '#([0-9a-f]{6})',
        },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          cascadeDelete: false,
          collectionID: users.id,
        },
      ],
    })
    app.save(habits)

    let activities = new Collection({
      type: 'base',
      name: 'activities',
      listRule: 'user_id = @request.auth.id',
      viewRule: 'user_id = @request.auth.id',
      createRule: 'user_id = @request.auth.id',
      updateRule: 'user_id = @request.auth.id',
      deleteRule: 'user_id = @request.auth.id',
      fields: [
        {
          name: 'habit_id',
          type: 'relation',
          required: true,
          cascadeDelete: false,
          collectionID: habits.id,
        },
        { name: 'date', type: 'date', required: true },
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          cascadeDelete: false,
          collectionID: users.id,
        },
      ],
    })

    app.save(activities)
  },
  (app) => {
    // add down queries...
    let habits = app.findCollectionByNameOrId('habits')
    let activities = app.findCollectionByNameOrId('activities')
    app.delete(activities)
    app.delete(habits)
  },
)
