## electron+webpack+react项目
> renderer进程使用的是 https://github.com/GuoYuefei/simple_react_webpack 的第四次commit的模板

### react+react搭建项目的模板

见 https://github.com/GuoYuefei/simple_react_webpack/blob/master/README.md

------

### electron部分

#### 1. 构建及开发

> ps. 最新版本的mac无法使用electron交叉编译windows程序。比如macOS Catalina 10.15.1.   

编译程序可通过以下命令： （请务必安装yarn，而非使用npm run）
```shell
yarn install-build-win
or
yarn install-build-mac
```
构建目录为项目根目录的dist文件夹下demo.exe or demo-0.0.1.dmg。

调试程序可以使用(仅针对renderer，修改main需重新执行命令)：
```shell
yarn dev
```
接下来项目开发的逻辑在src目录中编码。当然也可能会需要再遇到某些需求时配置webpack，比如renderer可能需要多入口，以打包多个chuck，又比如需要用到sass等。

#### 2. two package目录结构

目录结构使用的是electron-build推荐的two package结构。但是结构本身加入了些我个人的理解。

两个package.json的分别是package.json 和 /app/package.json. 可以理解为前者是给webpack使用的，后者是给electron看的。我说的webpack包括了它所有利用到的工具包括babel在内。还有本人用的yaml来代替package.json来配置electron-builder，所以理论上讲本段第一句行得通。

事实我找官方给出的two package目录了，貌似electron-build没有明确给出。本人也是在一次项目经历中才发现electron会把package.json的dependencies打包起来，导致安装包特别大。所以想到方法是用webpack打包main，然后使用一个空的dependencies的package.json。此时突然想起之前看到的two-package目录结构，一下子理解了为什么要这么做。。。。其实就是把electron项目和js项目分开，其实就是两个项目，只是放在一起罢了。

```
+ app												// 作为webpack的输出目录， 和electron的源目录
  + assets									// 放一些资源文件
  + dist										// 这是webpack打包的输出目录
    + main									// 这是webpack对主进程程序打包的构建目录
    + renderer							// 这是webpack对渲染进程程序打包的构建目录
  + node_modules						// electron执行后产生，仅一个文件，其余为空
  + pages										// 页面放在这
    - index.html						// 这是渲染进程的主页面
  - package.json						// 给electron看的，app的名字和版本等在此配置
+ config										// 放开发配置文件的地方
  - electron-builder.yml								// electron-builder的配置文件
  - webpack.config.main.prod.js					// webpack的主进程打包配置文件
  - webpack.config.renderer.prod.js			// webpack的渲染进程打包配置文件
  ...																		// 其余的配置文件，如开发环境下的配置文件
+ dist											// 最终的构建目录，也就是electron-builder设置的构建目录
  + mac											// 构建mac程序生成目录
  + win-unpacked						// 构建win x64程序时生成目录
  ....											// 其余文件，如dmg和windows安装包文件
+ node_modules							// 真正放依赖的地方
+ public										// 放一些公共内容, 应该可以由app/assets 和 app/pages代替
+ src												// 源代码
  + main										// main源代码
  + renderer								// 渲染部分代码
  + shared									// 公共部分代码
- package.json							// 记录所有依赖
```

以上即是整个项目目录及作用。其中electron-builder会在当项目下有app目录时自动以该目录为根目录。

