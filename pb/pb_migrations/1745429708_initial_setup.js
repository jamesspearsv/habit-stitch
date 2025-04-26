/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let settings = app.settings()
    settings.meta.appName = 'Habit Stitch Dev'

    let superusers = app.findCollectionByNameOrId('_superusers')

    let record = new Record(superusers)

    // note: the values can be eventually loaded via $os.getenv(key)
    // or from a special local config file
    record.set('email', 'admin@local.dev')
    record.set('password', 'admin12345')

    app.save(record)
  },
  (app) => {
    // optional revert operation
    try {
      let record = app.findAuthRecordByEmail('_superusers', 'admin@local.dev')
      app.delete(record)
    } catch {
      // silent errors (probably already deleted)
    }
  },
)
