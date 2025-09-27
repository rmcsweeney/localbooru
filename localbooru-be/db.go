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
	//TODO: Get tags
	return &p, nil
}
