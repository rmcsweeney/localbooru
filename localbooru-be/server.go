package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/hello", getHello)
	http.HandleFunc("/posts", getPosts)
	http.HandleFunc("/posts/{id}", getPostById)
	http.ListenAndServe(":8080", nil)
	println("Server started")
}

func getHello(w http.ResponseWriter, _ *http.Request) {
	fmt.Fprintf(w, "Hello World")
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
