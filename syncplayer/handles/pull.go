package handles

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"syncplayer/global"
	"syncplayer/utils"
)

type reqPull struct {
	Id_sync string				`json:"id_sync"`
	PlayerSource string				`json:"playerSource"`
}

func Pull(w http.ResponseWriter, req *http.Request) {
	fmt.Println("this is pull request", req.Method)
	if req.Method == http.MethodOptions {
		utils.AllowCORS(w)
		w.WriteHeader(http.StatusAccepted)
		return
	}
	if req.Method == http.MethodPost {
		utils.AllowCORS(w)
		all, err := ioutil.ReadAll(req.Body)
		if err != nil {
			log.Println(err)
		}
		log.Println(string(all))
		var rp reqPull = reqPull{}
		err = json.Unmarshal(all, &rp)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if info, ok := global.InfoMap[rp.Id_sync + rp.PlayerSource]; ok {
			err = json.NewEncoder(w).Encode(info.Newer())
			if err != nil {
				log.Println(err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		} else {
			w.WriteHeader(http.StatusAccepted)
			return
		}


	}
}
