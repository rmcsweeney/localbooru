package main

import (
	"context"
)

// todo: decide on including tags in GetPost returns
type PostRepository interface {
	GetPostById(ctx context.Context, id int) (*Post, error)
	GetRecentPosts(ctx context.Context, loadSize int, offsetIndex int) ([]*Post, error)
	CreatePost(ctx context.Context, post *Post)
	GetPostsByTag(ctx context.Context, tag string) ([]*Post, error)
	GetTagsByPostId(ctx context.Context, id int) ([]*Tag, error)
}

type RepositoryImpl struct {
	posts PostRepository
}

func NewRepositoryImpl(postRepository PostRepository) *RepositoryImpl {
	return &RepositoryImpl{posts: postRepository}
}

type Post struct {
	ID       int
	FileName string
	FileType string
	//timestamps in ISO 8601 format
	CreatedAt string
}

type Tag struct {
	ID    int
	Name  string
	Count int
}
