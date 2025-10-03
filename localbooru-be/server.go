package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

var repository *RepositoryImpl
var config Config

type Config struct {
	UseMockDB bool   `json:"UseMockDB"`
	DbPath    string `json:"DbPath"`
}

func main() {
	file, _ := os.ReadFile("config.json")
	cfgErr := json.Unmarshal(file, &config)
	if cfgErr != nil {
		println("Issue with config: " + cfgErr.Error())
		return
	}

	mux := http.NewServeMux()
	if config.UseMockDB {
		repository = NewRepositoryImpl(NewMockPostRepository(true))
	} else {
		repository = NewRepositoryImpl(NewSqlPostRepository(config.DbPath))
	}
	mux.HandleFunc("/hello", getHello)
	mux.HandleFunc("/posts/{loadSize}/{offset}", getNPosts)
	mux.HandleFunc("/posts", getRecentPosts)
	mux.HandleFunc("/posts/tag/{tag}", getPostsByTag)
	mux.HandleFunc("/posts/{id}", getPostById)
	mux.HandleFunc("/assets/{type}/{file}", getMedia)
	mux.HandleFunc("/upload", uploadMedia)
	mux.HandleFunc("/upload/tag", uploadTag)
	mux.HandleFunc("/tags", getTopTags)
	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal("ListenAndServe: " + err.Error())
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
	res, repoErr := repository.posts.GetPostById(r.Context(), postId)
	if repoErr != nil {
		log.Fatal("Repo error on GetPostById: " + repoErr.Error())
	}
	setResponseHeaders(w)
	println(res)
	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		println(err)
		return
	}
	r.Close = true
}

func uploadMedia(w http.ResponseWriter, r *http.Request) {
	// Limit request body size to 10MB
	r.Body = http.MaxBytesReader(w, r.Body, 10<<20)

	file, handler, err := r.FormFile("file")
	if err != nil {
		fmt.Fprintf(w, "Error retrieving the file: %v", err)
		return
	}
	defer file.Close()

	f, err := os.Create(filepath.Join("assets/images/", handler.Filename))
	if err != nil {
		fmt.Fprintf(w, "Error saving the file: %v", err)
		return
	}
	defer f.Close()

	io.Copy(f, file)
	fmt.Fprintf(w, "File uploaded successfully: %v", handler.Filename)
	fileName := handler.Filename
	split := strings.Split(fileName, ".")
	name, extension := split[0], split[1]
	repository.posts.CreatePost(r.Context(), &Post{FileName: name, FileType: extension})
	setResponseHeaders(w)
}

func uploadTag(w http.ResponseWriter, r *http.Request) {
	tagName := r.FormValue("tag")
	tagType := r.FormValue("type")

	repository.posts.CreateTag(r.Context(), &Tag{Name: tagName, Type: tagType})
	setResponseHeaders(w)
}

func getTopTags(w http.ResponseWriter, r *http.Request) {
	res, repoErr := repository.posts.GetTopTags(r.Context(), 10)
	if repoErr != nil {
		log.Fatal("Repo error on GetTopTags: " + repoErr.Error())
	}
	setResponseHeaders(w)
	if err := json.NewEncoder(w).Encode(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		println(err)
		return
	}
}

func setResponseHeaders(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}
