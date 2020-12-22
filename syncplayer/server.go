package main

import (
	"log"
	"net/http"
	"syncplayer/global"
	"syncplayer/handles"
	"time"
)

func main() {
	go func() {
		Daemons()
	}()
	http.HandleFunc("/push", handles.Push)
	http.HandleFunc("/pull", handles.Pull)
	http.Handle("/", http.FileServer(http.Dir("./dist")))
	log.Println("will listen port :2020")
	err := http.ListenAndServe(":2020", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func Daemons() {
	c := time.Tick(global.CLeanUpCycle)
	for now := range c {
		log.Println("will clean up infos map, update time is", now)
		global.InfoMapPointer.CleanUp()
	}
}
