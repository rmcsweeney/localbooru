package main

import (
	"errors"
)

var post_db map[int]*Post
var tag_db map[string]*Tag

func InitMockDb() {
	post_db = make(map[int]*Post)
	post_db[1] = &Post{1, "test", "png", "test", "test", "2025-09-12T00:19:10Z"}
}

func GetPostById(id int) (*Post, error) {
	var post = post_db[id]
	if post == nil {
		return nil, errors.New("Post not found")
	}
	return post, nil
}

func CreatePost(post *Post) {

}

func GetPostsByTag(tag string) []*Post {
	return nil
}

func GetTagsByPostId(id int) []*Tag {
	return nil
}
