package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
)

var repository *RepositoryImpl

func main() {
	mux := http.NewServeMux()
	repository = NewRepositoryImpl(NewMockPostRepository(true))
	mux.HandleFunc("/hello", getHello)
	mux.HandleFunc("/posts", getPosts)
	mux.HandleFunc("/posts/{id}", getPostById)
	mux.HandleFunc("/media/{type}/{file}", getMedia)
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

func getMedia(w http.ResponseWriter, r *http.Request) {
	mediaType := r.PathValue("type")
	fileName := r.PathValue("file")
	//fmt.Fprintf(w, "Media type: %s, file: %s", mediaType, fileName)
	cwd, _ := os.Getwd()
	file, err := os.Open(cwd + "/assets/" + mediaType + "/" + fileName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()
	_, extension, _ := strings.Cut(fileName, ".")

	w.Header().Set("Content-Type", mediaType+"/"+extension)
	buffer := new(bytes.Buffer)
	_, _ = buffer.ReadFrom(file)
	w.Write(buffer.Bytes())
	w.Header().Set("Content-Disposition", "inline; filename="+fileName+"")
	w.Header().Set("Content-Length", strconv.Itoa(len(buffer.Bytes())))

	r.Close = true
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
