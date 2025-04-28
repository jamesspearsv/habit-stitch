/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('users')
    const demo_user = new Record(users)
    demo_user.set('email', 'user@local.dev')
    demo_user.set('password', 'user12345')
    demo_user.set('name', 'Demo User')

    app.save(demo_user)

    const habits = app.findCollectionByNameOrId('habits')
    const habit_1 = new Record(habits)
    const habit_2 = new Record(habits)

    habit_1.set('id', 'fa7ce53559e7486')
    habit_1.set('habit_name', 'Learn Vue.js')
    habit_1.set('habit_goal', 10)
    habit_1.set('user_id', demo_user.id)

    habit_2.set('id', 'b34f0c6993d3491')
    habit_2.set('habit_name', 'Learn PocketBase')
    habit_2.set('habit_goal', 15)
    habit_2.set('user_id', demo_user.id)

    app.save(habit_1)
    app.save(habit_2)
  },
  (app) => {
    const habit_1 = app.findRecordById('habits', 'fa7ce53559e7486')
    const habit_2 = app.findRecordById('habits', 'b34f0c6993d3491')
    const demo_user = app.findAuthRecordByEmail('users', 'user@local.dev')

    app.delete(habit_1)
    app.delete(habit_2)
    app.delete(demo_user)
  },
)
