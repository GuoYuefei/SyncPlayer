package utils

import "net/http"

//allow cors.
func AllowCORS(writer http.ResponseWriter) {
	writer.Header().Add("Access-Control-Allow-Origin", "*")
	writer.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
	writer.Header().Add("Access-Control-Max-Age", "3600")
	writer.Header().Add("Access-Control-Allow-Headers", "content-type")
}