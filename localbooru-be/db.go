package main

import (
	"context"
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

type SqlPostRepository struct {
	db *sql.DB
}

func (r *SqlPostRepository) GetRecentPosts(ctx context.Context, loadSize int, offsetIndex int) ([]*Post, error) {
	//TODO implement me
	panic("implement me")
}

func (r *SqlPostRepository) CreatePost(ctx context.Context, post *Post) {
	//TODO implement me
	panic("implement me")
}

func (r *SqlPostRepository) GetPostsByTag(ctx context.Context, tag string) ([]*Post, error) {
	//TODO implement me
	panic("implement me")
}

func (r *SqlPostRepository) GetTagsByPostId(ctx context.Context, id int) ([]*Tag, error) {
	//TODO implement me
	panic("implement me")
}

func NewSqlPostRepository(dbPath string) *SqlPostRepository {
	db, err := sql.Open("sqlite3", dbPath)
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
		tagErr := tags.Scan(&t.Name, &t.Type, &t.Count)
		if tagErr != nil {
			log.Fatal("Issue getting tags: " + tagErr.Error())
		}
		p.Tags = append(p.Tags, &t)
	}
	return &p, nil
}
