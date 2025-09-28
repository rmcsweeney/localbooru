require 'sqlite3'
require 'time'

db = SQLite3::Database.new('lcbru.db')

db.transaction do
    posts = db.prepare("INSERT INTO 
        posts (id, filename, filetype, created_at)
        VALUES (?,?,?,?)")
    for i in 1..25
        posts.execute(i, "test#{i}", "png", Time.now.iso8601)
    end
    posts.close
end
db.transaction do
    tags = db.prepare("INSERT INTO 
        tags (id, name, type, count)
        VALUES (?,?,?,?)")
    tags.execute(1, "ouro_kronii", "character", 8)
    tags.execute(2, "none", "basic", 17)
    tags.execute(3, "other", "meta", 17)
    tags.execute(4, "hololive", "copyright", 8)
    tags.execute(5, "belfusco", "artist", 0)
    tags.close
end
db.transaction do
    link = db.prepare("INSERT INTO
        post_tags (post_id, tag_id)
        VALUES (?,?)")
    for i in 1..25
        if i == 1 or i == 2 or (9<=i && i<=15)
            link.execute(i, 1)
            link.execute(i, 4)
        else
            link.execute(i, 2)
            link.execute(i, 3)
        end
    end
    link.close
end

db.close