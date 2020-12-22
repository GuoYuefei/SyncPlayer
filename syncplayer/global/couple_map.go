package global

import (
	"sync"
	"time"
)

var mutexCCM sync.Mutex

type infoCM map[string] *Info

func (C infoCM) Lock() {
	mutexCCM.Lock()
}

func (C infoCM) Unlock() {
	mutexCCM.Unlock()
}

func (C *infoCM) CleanUp() {
	now := time.Now()
	for k, _ := range *C {
		if now.Sub((*C)[k].LastTime) > Expires {
			// 到期了, 删除
			C.Lock()
			delete(*C, k)
			C.Unlock()
		}
	}
}

var InfoMap infoCM
var InfoMapPointer *infoCM

func init() {
	InfoMap = infoCM(make(map[string] *Info))
	InfoMapPointer = &InfoMap
}

