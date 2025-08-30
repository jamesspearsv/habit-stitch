# Habit Stitch - CF Workers Migration

## Database Schema

```typescript
users {
    id: string PRIMARY KEY; // unique user identifier
    username: text; // user’s display name
    email: text; // user’s email address
    created_at: text; // ISO datetime string when user signed up
}
```

```typescript
habits {
    id: integer PRIMARY KEY;
    name: text; // task name
    description: text; // explanation of habit
    color: varchar(7); // color hex code string (#RRGGBB)
    interval_days: integer; // completion frequency in number of days
    is_active: boolean; // indicates if habit is active
    created_at: text; // ISO datetime string for creation
    user_id: string FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE; // related user
}
```

```typescript
logs {
    id: integer PRIMARY KEY;
    datetime: text; // ISO datetime string of log
    notes: text; // optional user notes
    habit_id: integer FOREIGN KEY REFERENCES habits(id) ON DELETE CASCADE; // related habit
    user_id: string FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE; // related user
    created_at: text; // timestamp for creation (optionally separate from datetime)
}
```
