package main

import (
	"context"
	"database/sql"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type SqlPostRepository struct {
	db *sql.DB
}

func (r *SqlPostRepository) CreatePost(ctx context.Context, post *Post) {
	tx, err := r.db.Begin()
	if err != nil {
		log.Fatal(err)
	}
	q, err := tx.Prepare("INSERT INTO posts (filename, filetype, created_at) VALUES (?, ?, ?)")
	if err != nil {
		println("Error in post creation: " + err.Error())
	}
	_, err = q.Exec(post.FileName, post.FileType, time.Now().UTC().Format(time.RFC3339))

	err = tx.Commit()

	defer q.Close()
}

func (r *SqlPostRepository) CreateTag(ctx context.Context, tag *Tag) {
	tx, err := r.db.Begin()
	if err != nil {
		log.Fatal(err)
	}
	q, err := tx.Prepare("INSERT INTO tags (name, type, count) VALUES (?, ?, ?)")
	if err != nil {
		println("Error in post creation: " + err.Error())
	}
	_, err = q.Exec(tag.Name, tag.Type, 0)

	err = tx.Commit()

	defer q.Close()
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
	postErr := post.Scan(&p.ID, &p.FileName, &p.FileType, &p.CreatedAt)
	if postErr != nil {
		log.Fatal("Issue unpacking post: " + postErr.Error())
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
			log.Fatal("Issue unpacking tags: " + tagErr.Error())
		}
		p.Tags = append(p.Tags, &t)
	}
	return &p, nil
}

func (r *SqlPostRepository) GetRecentPosts(ctx context.Context, loadSize int, offsetIndex int) ([]*Post, error) {
	posts, err := r.db.Query("SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?", loadSize, offsetIndex)
	if err != nil {
		log.Fatal("Issue getting posts: " + err.Error())
	}
	defer posts.Close()
	var postsSlice []*Post
	for posts.Next() {
		var p Post
		postErr := posts.Scan(&p.ID, &p.FileName, &p.FileType, &p.CreatedAt)
		if postErr != nil {
			log.Fatal("Issue unpacking post: " + postErr.Error())
		}
		postsSlice = append(postsSlice, &p)
	}
	return postsSlice, nil
}

func (r *SqlPostRepository) GetPostsByTag(ctx context.Context, tag string) ([]*Post, error) {
	posts, err := r.db.Query("select p.id, p.filename, p.filetype, p.created_at from posts p inner join post_tags pt on p.id = pt.post_id inner join tags t on pt.tag_id = t.id WHERE t.name =  ?", tag)
	if err != nil {
		log.Fatal("Issue getting posts: " + err.Error())
	}
	defer posts.Close()
	var postsSlice []*Post
	for posts.Next() {
		var p Post
		postErr := posts.Scan(&p.ID, &p.FileName, &p.FileType, &p.CreatedAt)
		if postErr != nil {
			log.Fatal("Issue unpacking post: " + postErr.Error())
		}
		postsSlice = append(postsSlice, &p)
	}
	return postsSlice, nil
}

func (r *SqlPostRepository) GetTopTags(ctx context.Context, limit int) ([]*Tag, error) {
	tags, err := r.db.Query("select t.name, t.type, t.count from tags t order by count desc limit ?", limit)
	if err != nil {
		log.Fatal("Issue getting tags: " + err.Error())
	}
	defer tags.Close()
	var tagsSlice []*Tag
	for tags.Next() {
		var t Tag
		_ = tags.Scan(&t.Name, &t.Type, &t.Count)
		tagsSlice = append(tagsSlice, &t)
	}
	return tagsSlice, nil
}
