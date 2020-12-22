package global

import "time"

// 使用时间判断info新旧
// 这里的时间应该是发送时间而不是到达时间， 所以由前端提供

type Info struct {
	Time time.Time							`json:"t"`
	Id_sync string							`json:"id_sync"`
	PlayerSource string						`json:"playerSource"`
	InputVideoUrl string					`json:"inputVideoUrl"`
	CurrentTime float64						`json:"currentTime"`
	Paused	bool							`json:"paused"`
	PlaybackRate float64					`json:"playbackRate"`
	LastTime time.Time			// 这个记录这上次使用时间
}

func (i *Info) Newer() *Info{
	ninfo := *i
	i.LastTime = time.Now()
	if !i.Paused {
		td := time.Now().Sub(i.Time)
		sec := td.Seconds()

		ninfo.CurrentTime += sec * i.PlaybackRate
		//i.tmpTime = ninfo.CurrentTime
	}
	return &ninfo
}

/**
	如果i1新，那么返回true
 */
func (i1 *Info) IsNew(i2 *Info) bool  {
	td := i1.Time.Sub(i2.Time)
	if td >= 3 {
		return true
	}
	return false
}

