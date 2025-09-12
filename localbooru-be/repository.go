package main

import (
	"context"
)

type PostRepository interface {
	GetPostById(ctx context.Context, id int) (*Post, error)
	CreatePost(ctx context.Context, post *Post)
	GetPostsByTag(ctx context.Context, tag string) ([]*Post, error)
	GetTagsByPostId(ctx context.Context, id int) ([]*Tag, error)
}

type Post struct {
	ID            int
	FileName      string
	ImagePath     string
	ThumbnailPath string
}

type Tag struct {
	ID    int
	Name  string
	Count int
}
