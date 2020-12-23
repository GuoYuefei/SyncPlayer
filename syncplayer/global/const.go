package global

import "time"

// info 有个过期时间， 过期时间内如果没有被访问就从InfoMap中清理
const Expires time.Duration = 4 * time.Minute

const CLeanUpCycle = 7 * time.Minute

