package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

var repository *RepositoryImpl

func main() {
	mux := http.NewServeMux()
	repository = NewRepositoryImpl(NewMockPostRepository(true))
	mux.HandleFunc("/hello", getHello)
	mux.HandleFunc("/posts", getPosts)
	mux.HandleFunc("/posts/{id}", getPostById)
	http.ListenAndServe(":8080", mux)
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
	postId, _ := strconv.Atoi(r.PathValue("id"))
	res, _ := repository.posts.GetPostById(r.Context(), postId)
	w.Header().Set("Content-Type", "application/json")
	println(res)
	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	r.Close = true
}
