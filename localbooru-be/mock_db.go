package main

import (
	"context"
	"errors"
	"sort"
	"strconv"
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
		// Initialize 25 mock posts for now
		numPosts := 25
		for i := 1; i <= numPosts; i++ {
			m.posts[i] = &Post{i, "test" + strconv.Itoa(i), "png", "2025-09-12T00:19:10Z", nil}
			// Tag posts with these IDs as "kronii", the rest will get "none" and "other"
			if i == 1 || i == 2 || (i >= 9 && i <= 15) {
				m.posts[i].Tags = []*Tag{
					{
						ID:    1,
						Name:  "kronii",
						Count: 1,
					}}

			} else {
				m.posts[i].Tags = []*Tag{
					{
						ID:    2,
						Name:  "none",
						Count: 1,
					},
					{
						ID:    3,
						Name:  "other",
						Count: 1,
					},
				}
			}
		}
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

func (m *MockPostRepository) GetRecentPosts(ctx context.Context, loadSize int, offset int) ([]*Post, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	// Get a slice of the keys in the map
	keySlice := make([]int, 0)
	for key, _ := range m.posts {
		keySlice = append(keySlice, key)
	}

	// Sort the slice from highest key to lowest key (ie most recent first)
	// Most likely want to sort by timestamp, but this is easiest for now
	sort.Sort(sort.Reverse(sort.IntSlice(keySlice)))
	keySlice = keySlice[offset : offset+loadSize] //TODO check if we go out of bounds or support loading < loadSize if it's all that remains
	posts := make([]*Post, 0)
	for _, key := range keySlice {
		if m.posts[key] != nil {
			posts = append(posts, m.posts[key])
		} else {
			return nil, errors.New("Post not found with id: " + strconv.Itoa(key))
		}
	}

	return posts, nil
}

func (m *MockPostRepository) CreatePost(ctx context.Context, post *Post) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.posts[post.ID] = post
}

func (m *MockPostRepository) GetPostsByTag(ctx context.Context, searchTag string) ([]*Post, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	// Get a slice of the keys in the map
	keySlice := make([]int, 0)
	for key, _ := range m.posts {
		keySlice = append(keySlice, key)
	}

	posts := make([]*Post, 0)
	for _, key := range keySlice {
		if m.posts[key] != nil && m.posts[key].hasTagString(searchTag) {
			// For now, posts will be returned in a random order. This is based on the order in which Go decides to add them to the slice.
			posts = append(posts, m.posts[key])
		} else if m.posts[key] == nil {
			return nil, errors.New("Post not found with id " + strconv.Itoa(key) + " and tag \"" + searchTag + "\"")
		}
	}

	return posts, nil
}

func (m *MockPostRepository) GetTagsByPostId(ctx context.Context, id int) ([]*Tag, error) {
	// For a richer mock, keep a post->tags mapping; here we return empty.
	return []*Tag{}, nil
}

//func MakePostFromFile(fileName)

func (m *MockPostRepository) GetTopTags(ctx context.Context, loadSize int) ([]*Tag, error) {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return []*Tag{}, nil
}
