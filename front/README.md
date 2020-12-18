### react+react搭建项目的模板

1. 多入口配置
2. 启用对实验语法'classProperties'的支持
3. 支持css and less的引入
4. 映射源码方便检错
5. 支持开发服务器，热更新
6. 支持打包拷贝，将public文件夹内的内容拷贝如构建文件夹
7. 每次构建主动尽力构建文件夹
8. 支持js代码压缩，支持es6压缩
9. 支持全局变量设置
10. 支持eslint，代码规范检查。对于不规范代码在运行时或构建时给出error(不影响正常运行!)


可能需要：  
1. js和css分离
2. 。。。

#### 开始
```shell
yarn
```

#### 运行
```
yarn start
```

#### 构建
```
yarn build
```

#### 测试构建包
```
yarn serve
or
yarn test
```

#### 修改源代码
src下的index为入口react文件。    
建议在src使用合理的目录结构进行开发。

