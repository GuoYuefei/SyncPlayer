package global

import "time"

// 如果云端信息超过这个时间没有被访问到了，那么就认为已经暂停了
const PauseTime time.Duration = 5 * time.Second

// info 有个过期时间， 过期时间内如果没有被访问就从InfoMap中清理 保留一段时间 Expires - CLeanUpCycle 的播放进度
const Expires time.Duration = 5 * time.Minute

const CLeanUpCycle = 8 * time.Minute

