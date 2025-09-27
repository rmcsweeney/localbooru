package main

import (
	"context"
	"database/sql"
	"log"
)

type SqlPostRepository struct {
	db *sql.DB
}

func NewSqlPostRepository(db *sql.DB) *SqlPostRepository {
	db, err := sql.Open("sqlite3", "../db/lcbru.db")
	if err != nil {
		log.Fatal(err)
	}
	return &SqlPostRepository{db: db}
}

func (r *SqlPostRepository) GetPostById(ctx context.Context, id int) (*Post, error) {
	post := r.db.QueryRow("SELECT * FROM posts WHERE id = ?", id)
	var p Post
	err := post.Scan(&p.ID, &p.FileName, &p.FileType, &p.CreatedAt)
	if err != nil {
		return nil, err
	}
	tags, err := r.db.Query("select t.name, t.type, t.count "+
		"from tags t inner join post_tags pt on t.id = pt.tag_id "+
		"where post_id = ?", id)
	if err != nil {
		log.Fatal("Issue getting tags: " + err.Error())
	}
	for tags.Next() {
		var t Tag
		_ = tags.Scan(&t.Name, &t.Type, &t.Count)
		p.Tags = append(p.Tags)
	}
	return &p, nil
}
