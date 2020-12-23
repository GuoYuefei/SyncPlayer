package handles

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"syncplayer/global"
	"syncplayer/utils"
	"time"
)

func Push(w http.ResponseWriter, req *http.Request) {
	log.Println("push", req.Method)
	if req.Method == http.MethodOptions {
		utils.AllowCORS(w)
		w.WriteHeader(http.StatusAccepted)
		return
	}
	if req.Method == http.MethodPost {
		utils.AllowCORS(w)
		log.Println("this is push request", req.Method)
		all, err := ioutil.ReadAll(req.Body)
		if err != nil {
			log.Println(err)
		}
		log.Println(string(all))

		var info global.Info = global.Info{}

		err = json.Unmarshal(all, &info)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		info.LastTime = time.Now()				// 当前时间是这次push访问时间
		if v, ok := global.InfoMap[info.Id_sync + info.PlayerSource]; ok {
			if info.IsNew(v) {
				// 来的状态是新的就更换
				global.InfoMap.Lock()
				global.InfoMap[info.Id_sync + info.PlayerSource] = &info
				global.InfoMap.Unlock()
			}
		} else {
			// 没这个id也可以记录下来 todo 可以以后加权限，不过权限应该在最前面
			global.InfoMap.Lock()
			global.InfoMap[info.Id_sync + info.PlayerSource] = &info
			global.InfoMap.Unlock()
		}

		w.WriteHeader(http.StatusAccepted)
	}
}

