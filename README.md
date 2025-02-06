# Sync Player

[![Build Status](https://travis-ci.com/GuoYuefei/SyncPlayer.svg?token=BKq2rtshVZhXjhdzxskH&branch=master)](https://travis-ci.com/GuoYuefei/SyncPlayer) [![GitHub license](https://img.shields.io/github/license/GuoYuefei/SyncPlayer)](https://github.com/GuoYuefei/SyncPlayer/blob/master/LICENSE) [![GitHub issues](https://img.shields.io/github/issues/GuoYuefei/SyncPlayer)](https://github.com/GuoYuefei/SyncPlayer/issues)

# 同步播放器

*该项目主要功能仅一天时间完成，但暂且可以满足本人的需求且这段时间事多，所以近期不会更新。*

！！！ 页面很难看请见谅，没时间。。。

最简介绍： 保证页面中**两个输入框内容相同**就可以同步观影。

简介： 可以在互联网上的任意两端同步播放相同视频。将支持http/https资源和本地文件。对于互联网资源，要求两端共同有可访问权。本人仅用最短时间实现功能，如果不必要不做优化。

## 2023-09-14补充提示 
> ps. 示例网址服务器维持了两年半，已经不决定续费了，所以进不去了哈；  
> 下面的网盘有些都开始做好防火墙或者倒了~~然后还是得抽时间支持其他协议

## 2024-04-12补充
> 由于在家里搭建了一个家庭服务器，今天兴起，重新部署了下，网址已更新到项目 https://home.naturgift.online:5520/  
> 2025-02-06 域名快到期了，重新买了一个，179rmb买了10年（前面域名续费要70~已弃用），已更新 https://home.naturgift.fun:5520/

## 如何使用

### 关于视频资源

本项目只提供一个可以同步播放信息的播放器，并不提供任何的视频资源。视频资源大家可以自己找，本人一般是BT下载下来之后存入网盘或对象存储中。

关于http/https的视频资源，我本人使用的是对象存储和网盘下载链接，对象存储可以使用本人仓库[DOStorage1](https://github.com/GuoYuefei/DOStorage1), 也可以使用阿里腾讯等厂家的，建议使用厂家。非常**推荐**使用网盘下载链接，免费的！！！非常推荐**牛奶快传**，这个网盘的下载链接没有超时时间限制，其他网盘大多有30 min的超时时间，所以需要中间更换链接并不好用。

|      |                           网盘链接                           |            对象存储            |
| :--: | :----------------------------------------------------------: | :----------------------------: |
| 费用 |                             免费                             |         付费或间接付费         |
| 速度 |           根据你使用的网盘，一般来说满足两个人观看           | 速度较快，必要时还可以使用 CDN |
| 推荐 | **阿里云盘**、**牛奶快传**、**超星学习通**、OneDrive、谷歌的云端硬盘 |   腾讯云、九牛云、阿里、百度   |
| 备注 |             阿里云盘是我目前比较喜欢的，速度够快             |         推荐前两者实惠         |

### 关于一些云盘的对比

以下网盘都可获取到直接的https下载网址

总结： 不要永久存储(7天时间)，只是观看影片，首选[奶牛快传](https://cowtransfer.com/)。需要的永久存储的，可以申请注册[阿里云盘](https://www.aliyundrive.com/)。

|                                          |    速度/空间    |                             特点                             |     个人意见     |
| :--------------------------------------: | :-------------: | :----------------------------------------------------------: | :--------------: |
| [阿里云盘](https://www.aliyundrive.com/) |    不限速/1T    | 刚出，需要通过申请公测码才能注册使用，速度是真快，我的环境2-3MB/s。 下载链接有时间大致30 min的限制。 |      *推荐*      |
|                 OneDrive                 |    不限速/5G    | windows自带服务，无需客户端，随时同步，但毕竟是**国外的**，晚上速度貌似不大行。 下载链接有时间大致30 min的限制。 |      较推荐      |
|                 腾讯微云                 |    限速/10G     | 100kb/s, 怎么说呢，很腾讯，不**充钱**玩不好。下载链接不知道有多长时间，没试过。。 |   RMB玩家推荐    |
|              Google云端硬盘              |   不限速/15G    |                     **要fq**，要fq，要fq                     | 都会fq的极力推荐 |
|                  和彩云                  | 不限速/20G+20G  | 移动出品，有手机号就行，速度够快1MB/S上下，算稳定运行里快的了。但是下载链接**过期快**，可能电影播放过程中要更换下载链接， 下载链接有时间大致15 min的限制。 |      较推荐      |
|   [奶牛快传](https://cowtransfer.com/)   |     不限/5G     | 2G的最大文件上传限制，不用注册，上传1.5M/s和下载3M/s都非常快。不用注册就可以上传，也就是5G限制可以当作不存在的（自动7天有效期）。当然注册可以有上传记录和5G空间。下载链接超时时间无限制 |    非常*推荐*    |
|   [超星学习通](http://i.chaoxing.com/)   | 不限/100G(貌似) |             1GB的最大文件上传限制，速度够快1MB/s             |      *推荐*      |

### 关于云盘如何获取链接并使用

1. 从网盘点击下载之后**取消下载**

![第一步](doc/imgs/1_down.png)

2. 在下载管理中找到下载链接拷贝

![第二步](doc/imgs/2_copy.png)

3. 在SyncPlayer网页中对应的输入框内输入刚刚拷贝的下载地址

![第三步](doc/imgs/3_paste.png)

4. 结果图

![第四步](doc/imgs/4_result.png)

### 关于页面介绍

Update ID 按钮上的输入框是双方或多方约定的确定的字符串ID，ID和下面的链接地址共同确定是否同步，若相同则自动同步！！！

ID输入框和链接输入框都需要**下面的按键确定后才起效！！！**

Sync 按钮用于手动同步，一般用不到。

## 其他介绍

支持的视频格式： MP4、WebM、Ogg			~这边仅支持h5自带的，之后可能会提供更多

技术栈： React + Go（原生）

优点： 快速部署，服务端低流量，仅支持少量的访问量，重功能，个人使用，也可以多人使用（只交换视频播放信息，所以流量低，内存小）

一些用到的开源项目：

1. [video-react](https://github.com/video-react/video-react)
2. [simple_react_webpack](https://github.com/GuoYuefei/simple_react_webpack)

## 如何部署

​		发布的可执行文件未必适合你的服务器，所以也没发布，建议直接git clone本项目。 在有golang、nodejs、npm、yarn环境时，可以在项目目录下直接执行<code>bash build.sh</code> ，会得到一个build文件夹， 之后还是在项目根目录下运行<code>bash start.sh</code>即可后台运行程序，此时访问该机子的:2020端口就行了~_~。关闭程序可以使用<code>bash stop.sh</code>. 记得开放服务器的2020端口！

## 开发部分

### front

~先使用代理，需要能fq的，否则某些包可能下载不了，哪怕是更换了国内源。~（当然可以自己先试下，之后我有删除webtorrent包，应该不用fq了）

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

------
<code>yarn start</code> 调试时出现过这样的问题 <code>ENOSPC: System limit for number of file watchers </code>,
解决方案如下：

```shell
sudo vim /etc/sysctl.conf
## 然后添加以下配置
## fs.inotify.max_user_watches = 524288
## 保存后，执行以下命令
sudo sysctl -p
```

### syncplayer

后端项目的文件夹

```
go build server.go			// 编译就行，编译出的文件为server
```

### 构建脚本

在有golang、nodejs、npm、yarn环境时，可以在项目目录下直接执行<code>bash build.sh</code> ，会得到一个build文件夹，进入build文件夹运行server文件，访问http://localhost:2020 即可。

暂时不支持持续部署。。。原因是公钥不见了，和另一个仓库用的是一个服务器。。以后搞吧
