package main

import (
	"log"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMain(m *testing.M) {
	log.Println("Setting up mocks...")
	repository = NewRepositoryImpl(NewMockPostRepository(true))
	testMux := http.NewServeMux()
	testMux.HandleFunc("/hello", getHello)
	testMux.HandleFunc("/posts/{id}", getPostById)
	log.Println("Running tests...")
	m.Run()
	log.Println("Tests complete.")
}

func TestHello(t *testing.T) {
	req, _ := http.NewRequest("GET", "/hello", nil)
	rr := httptest.NewRecorder()

	getHello(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expected := "Hello World"
	actual := rr.Body.String()
	if actual != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}

func TestGetPostById(t *testing.T) {
	req := httptest.NewRequest("GET", "/posts/1", nil)
	rr := httptest.NewRecorder()

	getPostById(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusOK)
	}

	expected := ""
	actual := rr.Body.String()
	println(actual)
	if actual != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}
