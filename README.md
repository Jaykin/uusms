# UU Sports Management system

## 技术选型
* @vue/cli 4.0.5 脚手架工具生成（https://cli.vuejs.org/zh/guide/）
* babel 7 编译 ES6+
* 框架：vue 2.6.10（https://cn.vuejs.org/）
* UI 组件库：element-ui 2.12.0（https://element.eleme.cn/#/zh-CN）
    * 自定义主题（src/plugins/element.css）
        1. color-primary 设为 #0045AD
* 构建工具：webpack 4.41.2（https://www.webpackjs.com/）
* CSS 预处理器：Stylus

## 目录结构
```
uums
|-- public
    |-- index.html          页面模板
|-- src                     源码目录
    |-- assets              公共资源
    |-- components          公共组件
    |-- model               API 请求
        |-- api.js          基本 ajax 请求封装
        |-- game.js         比赛相关
        |-- operate.js      运营相关
        |-- team.js         队伍相关
        |-- user.js         用户相关
    |-- plugins             Vue Plugins，暂时只有 element-ui
    |-- router              路由声明
    |-- utils               工具集
        |-- cypto.js        数据加密/解密
        |-- store.js        数据缓存
        |-- validator.js    表单校验
        |-- constant.js     常量
        |-- index.js        一些工具函数
        |-- loading.js      全局 loading 控制
    |-- views               页面
        |-- account         用户
        |-- game            比赛
        |-- login           登录
        |-- operation       运营
        |-- team            队伍
        |-- tools           工具页面（如：创建比赛等），开发人员调试时使用
        Home.vue            首页
    |-- App.vue
    |-- main.js
|-- dist            构建目录
|-- .editorconfig
|-- .gitignore
|-- babel.config.js
|-- package-lock.json
|-- package.json
|-- vue.config.js   vue cli 配置文件
|-- README.md
```

## 环境搭建
```
1. 安装 Node.js 8.9 及以上版本（推荐 8.11.0+）
2. 安装项目依赖 npm install
```

## 开发 & 生产构建
### 开发
```
npm run dev     执行开发编译，支持 HMR
npm run lint    执行 Lints 及修复
```
### 生产构建
```
npm run build   执行生产构建

构建完后将 dist 目录上传至服务器目录（/usr/uu2/pages/uums）

线上访问地址：https://m.uusport.net/pages/uums/dist/index.html
```

## TODO
1. 优化 keep-alive
2. ...
