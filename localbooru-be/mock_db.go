package main

import (
	"context"
	"errors"
	"sync"
)

type MockPostRepository struct {
	mu    sync.RWMutex
	posts map[int]*Post
	tags  map[string]*Tag
}

func NewMockPostRepository(seed bool) *MockPostRepository {
	m := &MockPostRepository{
		posts: make(map[int]*Post),
		tags:  make(map[string]*Tag),
	}
	if seed {
		m.posts[1] = &Post{1, "test", "png", "2025-09-12T00:19:10Z"}
	}
	return m
}

func (m *MockPostRepository) GetPostById(ctx context.Context, id int) (*Post, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	p := m.posts[id]
	if p == nil {
		return nil, errors.New("Post not found")
	}
	return p, nil
}

func (m *MockPostRepository) CreatePost(ctx context.Context, post *Post) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.posts[post.ID] = post
}

func (m *MockPostRepository) GetPostsByTag(ctx context.Context, tag string) ([]*Post, error) {
	// For a richer mock, keep a post->tags or tag->post index; here we return empty.
	return []*Post{}, nil
}

func (m *MockPostRepository) GetTagsByPostId(ctx context.Context, id int) ([]*Tag, error) {
	// For a richer mock, keep a post->tags mapping; here we return empty.
	return []*Tag{}, nil
}
