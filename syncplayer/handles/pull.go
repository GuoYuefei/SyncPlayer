package handles

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"syncplayer/global"
	"syncplayer/utils"
)

type reqPull struct {
	Id_sync      string `json:"id_sync"`
	PlayerSource string `json:"playerSource"`
}

func Pull(w http.ResponseWriter, req *http.Request) {
	//fmt.Println("this is pull request", req.Method)
	// 跨域访问时客户端往往会先发送一个option请求探明服务器是否允许跨域的情况，我们设置为允许跨域
	if req.Method == http.MethodOptions {
		utils.AllowCORS(w)
		w.WriteHeader(http.StatusAccepted)
		return
	}
	// 如果是POST请求就是正常请求，需要业务处理
	if req.Method == http.MethodPost {
		utils.AllowCORS(w)
		all, err := ioutil.ReadAll(req.Body)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		//log.Println(string(all))
		var rp reqPull = reqPull{}
		err = json.Unmarshal(all, &rp)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if info, ok := global.InfoMap[rp.Id_sync+rp.PlayerSource]; ok {
			err = json.NewEncoder(w).Encode(info.Newer())
			if err != nil {
				log.Println(err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
		} else {
			w.WriteHeader(http.StatusAccepted)
			return
		}

	}
}
