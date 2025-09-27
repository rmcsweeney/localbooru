require 'sqlite3'

db = SQLite3::Database.new('lcbru.db')

db.execute <<-SQL
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY,
        filename TEXT,
        filetype TEXT,
        created_at TEXT
    );
SQL

db.execute <<-SQL
    CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY,
        name TEXT,
        type TEXT,
        count INTEGER
    );
SQL

db.execute <<-SQL
    CREATE TABLE IF NOT EXISTS post_tags (
        post_id INTEGER,
        tag_id INTEGER,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
    );
SQL

db.close