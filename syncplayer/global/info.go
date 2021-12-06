package global

import (
	"time"
)

// 使用时间判断info新旧
// 这里的时间应该是发送时间而不是到达时间， 所以由前端提供

type Info struct {
	Time          time.Time `json:"t"`
	Id_sync       string    `json:"id_sync"`
	PlayerSource  string    `json:"playerSource"`
	InputVideoUrl string    `json:"inputVideoUrl"`
	CurrentTime   float64   `json:"currentTime"`
	Paused        bool      `json:"paused"`
	PlaybackRate  float64   `json:"playbackRate"`
	LastTime      time.Time // 这个记录这上次使用时间
}

// 用返回的原因是，主体的Time属性不能乱变，因为需要进行新旧对比
func (i *Info) Newer() *Info {
	//fmt.Println(*i)
	// 处理所有客户端关闭一段时间的情况
	// 上次访问已经超过PauseTime规定时间，认为已经被暂停在上次访问的时间了
	if time.Now().Sub(i.LastTime) > PauseTime {
		//fmt.Println("-----------")
		td := i.LastTime.Sub(i.Time)
		i.Time = i.LastTime
		sec := td.Seconds()
		i.CurrentTime += sec * i.PlaybackRate
		i.LastTime = time.Now()
		return i
	}

	// 处理正常情况
	ninfo := *i
	i.LastTime = time.Now()
	if !i.Paused {
		td := i.LastTime.Sub(i.Time)
		sec := td.Seconds()

		// 正常播放情况下是不会取改变CurrentTime，而是通过Time属性与现在时间的差值再乘以播放速度计算出播放器应该播放的时间
		ninfo.CurrentTime += sec * i.PlaybackRate
		//i.tmpTime = ninfo.CurrentTime
	}
	return &ninfo
}

/**
如果i1新，那么返回true
*/
func (i1 *Info) IsNew(i2 *Info) bool {
	td := i1.Time.Sub(i2.Time)
	if td >= 3 {
		return true
	}
	return false
}
