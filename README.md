# Sync Player

同步播放器

简介： 可以在互联网上的任意两端同步播放相同视频。将支持http/https资源和本地文件。对于互联网资源，要求两端共同有可访问权。本人仅用最短时间实现功能，如果不必要不做优化。

关于http/https的视频资源，我本人使用的是对象存储，可以使用本人仓库[DOStorage1](https://github.com/GuoYuefei/DOStorage1), 也可以使用阿里腾讯等厂家的，建议使用厂家（有CDN加速，比较是视频资源）

支持的视频格式： MP4、WebM、Ogg			~这边仅支持h5自带的，之后可能会提供更多

技术栈： React + Go（原生）

优点： 快速部署，服务端低流量，仅支持少量的访问量，重功能，个人使用，也可以多人使用（只交换视频播放信息，所以流量低，内存小）

一些用到的开源项目：

1. [video-react](https://github.com/video-react/video-react)
2. [simple_react_webpack](https://github.com/GuoYuefei/simple_react_webpack)

-----

## front

先使用代理，需要能fq的，否则某些包可能下载不了，哪怕是更换了国内源。（当然可以自己先试下，之后我有删除webtorrent包，应该不用fq了）

```javascript
npm config set proxy http://server:port
npm config set https-proxy http://server:port

yarn config set proxy  http://username:password@server:port
yarn confit set https-proxy http://username:password@server:port
yarn
```

```
yarn start			// to start develop
yarn build				// 编译到/dist， 最后和后端编译后的可执行文件放在同一文件夹下就可以使用
```

## syncplayer

后端项目的文件夹

```
go build server.go			// 编译就行，编译出的文件为server
```

----

you can run <code>bash build.sh</code> to build.

暂时不支持自动部署。。。原因是公钥不见了，和另一个仓库用的是一个服务器。。以后搞吧