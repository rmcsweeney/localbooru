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
var config Config

type Config struct {
	UseMockDB bool `json:"UseMockDB"`
}

func main() {
	file, _ := os.ReadFile("config.json")
	cfgErr := json.Unmarshal(file, &config)
	if cfgErr != nil {
		println(cfgErr)
		return
	}

	mux := http.NewServeMux()
	repository = NewRepositoryImpl(NewMockPostRepository(true))
	mux.HandleFunc("/hello", getHello)
	mux.HandleFunc("/posts/{loadSize}/{offset}", getNPosts)
	mux.HandleFunc("/posts", getRecentPosts)
	mux.HandleFunc("/posts/tag/{tag}", getPostsByTag)
	mux.HandleFunc("/posts/{id}", getPostById)
	mux.HandleFunc("/assets/{type}/{file}", getMedia)
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		println(err)
		return
	}
	println("Server started")
}

func getRecentPosts(w http.ResponseWriter, r *http.Request) {
	setResponseHeaders(w)
	loadSize := 10
	offset := 0
	res, _ := repository.posts.GetRecentPosts(r.Context(), loadSize, offset)
	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		println(err)
		return
	}
	r.Close = true
}

func getPostsByTag(w http.ResponseWriter, r *http.Request) {
	setResponseHeaders(w)
	tag := r.PathValue("tag")
	res, _ := repository.posts.GetPostsByTag(r.Context(), tag)
	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		println(err)
		return
	}
	r.Close = true
}

func getHello(w http.ResponseWriter, _ *http.Request) {
	_, err := fmt.Fprintf(w, "Hello World")
	if err != nil {
		return
	}
}

func getRoutes() {

}

func getNPosts(w http.ResponseWriter, r *http.Request) {
	loadSize, _ := strconv.Atoi(r.PathValue("loadSize"))
	offset, _ := strconv.Atoi(r.PathValue("offset"))
	res, _ := repository.posts.GetRecentPosts(r.Context(), loadSize, offset) //load 2 posts for now
	setResponseHeaders(w)
	println(res)
	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		println(err)
		return
	}
	r.Close = true
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
	setResponseHeaders(w)
	println(res)
	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		println(err)
		return
	}
	r.Close = true
}

func setResponseHeaders(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}
