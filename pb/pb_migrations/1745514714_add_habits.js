/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    // add up queries...
    const habits = app.findCollectionByNameOrId('habits')
    const habit_1 = new Record(habits)
    const habit_2 = new Record(habits)

    habit_1.set('id', 'fa7ce53559e7486')
    habit_1.set('habit_name', 'Learn Vue.js')
    habit_1.set('habit_goal', 10)

    habit_2.set('id', 'b34f0c6993d3491')
    habit_2.set('habit_name', 'Learn PocketBase')
    habit_2.set('habit_goal', 15)

    app.save(habit_1)
    app.save(habit_2)
  },
  (app) => {
    // add down queries...
    const habit_1 = app.findRecordById('habits', 'fa7ce53559e7486')
    const habit_2 = app.findRecordById('habits', 'b34f0c6993d3491')

    app.delete(habit_1)
    app.delete(habit_2)
  },
)
