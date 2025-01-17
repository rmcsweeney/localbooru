package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/posts", getPosts)
	http.HandleFunc("/posts/{id}", getPostById)
	http.ListenAndServe(":8080", nil)
}

func getRoutes() {

}

func getPosts(w http.ResponseWriter, r *http.Request) {

}

func getPostById(w http.ResponseWriter, r *http.Request) {
	postid := r.PathValue("id")

	message := "postid is " + postid
	fmt.Fprintf(w, message)
}
