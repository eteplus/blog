+++
title = "基于 Webpack 和 ES6 构建 NPM 模块"
description = "用 ES6 编写代码，使用 Webpack 打包导出模块，并发布到 NPM 社区，添加基于 Travis-CI 和 Coveralls 的持续集成到 Github 项目中"
slug = "building-npm-modules-based-on-webpack-and-es6"
date = 2018-04-04
updated = 2021-06-28

[taxonomies]
tags = ["webpack", "javascript", "npm"]

[extra]
hero = "images/building-npm-modules-based-on-webpack-and-es6/webpack.png"
+++

## 特性

1. 基于 [Webpack4](https://webpack.js.org)
2. 使用ES6编写模块源码
3. 模块支持:
   - 在浏览器环境下使用，通过`<script>`标签来引入这个类库
   - 通过 [NPM](https://www.npmjs.com/) 安装使用
   - 兼容 ES6(ES2015) 的模块系统、[CommonJS](http://www.commonjs.org/) 和 [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) 模块规范
4. 使用 [AVA](https://github.com/avajs/ava) 自动化测试，并通过 [nyc](https://github.com/istanbuljs/nyc) 测试代码覆盖率
5. 持续集成（[Travis-CI](https://travis-ci.org/) + [Coveralls](https://coveralls.io/))
6. 使用 [ESLint](https://eslint.org/) + [Standrad](https://standardjs.com/) 检测代码质量

## 项目初始化

### 1. 创建repository并**clone**到本地

```bash
git clone https://github.com/eteplus/typeof
```

### 2. 添加.editorconfig

```yaml
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.yml]
indent_style = space
indent_size = 2
```

### 3. 创建目录

```bash
+-- src 源码目录
|   +-- typeof.js
|   +-- types.js
+-- test 测试用例
|   +--- test.js
+-- dist 输出目录
.
.
```

### 4. 创建package.json

> 使用[NPM作用域](https://docs.npmjs.com/misc/scope)管理发布模块，避免同名模块，一般使用**用户名**来注册私有模块(`@eteplus/<package name>`)

```bash
npm init --scope=eteplus
```

```json
package name: (@eteplus/typeof)
version: (1.0.0) 0.1.0
description: The typeOf method returns a string indicating the type of the value
entry point: (index.js) dist/typeof.js
test command:
git repository: https://github.com/eteplus/typeof.git
keywords: node,javascript,typeof
author: eteplus
license: (ISC) MIT
About to write to /Users/eteplus/Workspace/Node/study/typeof/package.json:

{
  "name": "@eteplus/typeof",
  "version": "0.1.0",
  "description": "The typeOf method returns a string indicating the type of the value",
  "main": "dist/typeof.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/eteplus/typeof.git"
  },
  "keywords": [
    "node",
    "javascript",
    "typeof"
  ],
  "author": "eteplus",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/eteplus/typeof/issues"
  },
  "homepage": "https://github.com/eteplus/typeof#readme"
}
```

### 5. ESLint 初始化

> 自动生成`.eslintrc.js`文件并安装相关依赖（可根据自己喜好选择代码规范）

#### 5.1 安装ESlint

```bash
# or use yarn
npm install eslint -D
```

```bash
npm install eslint -g # 全局安装ESLint
eslint --init

? How would you like to configure ESLint? Use a popular style guide
? Which style guide do you want to follow? Standard
? What format do you want your config file to be in? JavaScript
```

#### 5.2 添加`.eslintignore`文件忽略对输出目录的代码检测

```yaml
dist/
```

### 6 创建webpack和babel的配置文件

#### 6.1 安装相关依赖

```bash
npm install webpack webpack-cli uglifyjs-webpack-plugin -D
npm install babel-loader babel-core babel-plugin-transform-runtime babel-preset-env -D
npm install eslint-loader eslint-friendly-formatter -D
```

#### 6.2 创建 **webpack.config.js**

> webpack output 配置项说明 [https://webpack.js.org/configuration/output/](https://webpack.js.org/configuration/output/)

```js
'use strict'

const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const resolve = dir => path.join(__dirname, '.', dir)

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    typeof: './src/typeof.js'
  },
  output: {
    path: resolve('dist'), // 输出目录
    filename: '[name].js', // 输出文件
    libraryTarget: 'umd', // 采用通用模块定义
    library: 'typeOf', // 库名称
    libraryExport: 'default', // 兼容 ES6(ES2015) 的模块系统、CommonJS 和 AMD 模块规范
    globalObject: 'this' // 兼容node和浏览器运行，避免window is not undefined情况
  },
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: isProd
    ? [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          compress: {
            warnings: false
          },
          mangle: true
        },
        sourceMap: true
      })
    ]
    : [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ]
}
```

#### 6.3 创建 **.babelrc**

> heplers和polyfill根据实际情况开启/关闭，具体配置参考（[babel-plugin-transform-runtime](https://babeljs.io/docs/plugins/transform-runtime/)）

```json
{
  "presets": ["env"],
  "plugins": [
    ["transform-runtime", {
      "helpers": false,
      "polyfill": false
      }
    ]
  ]
}
```

### 7. 添加npm命令

> 在package.json上添加 [npm命令](https://docs.npmjs.com/misc/scripts)，通过npm run [name] 执行任务

```json
{
  "scripts": {
    "dev": "NODE_ENV=development webpack --config webpack.config.js --mode=development -w",
    "build": "NODE_ENV=production webpack --config webpack.config.js --mode=production",
    "lint": "eslint ."
  }
}
```

## 测试与代码覆盖率

> 使用 [AVA](https://github.com/avajs/ava) + [nyc](https://github.com/istanbuljs/nyc) 自动化测试和测试代码覆盖率

### 1. 安装 AVA 和 nyc

```bash
npm install ava nyc -D
```

### 2. 添加ava和nyc配置到package.json

**[AVA](https://github.com/avajs/ava#configuration)**:

* files：需要测试的用例文件
* verbose：开启详细输出
* babel：测试文件的babel配置，'inherit'使用根目录下的.babelrc
* require：运行测试前需要额外的模块

其他配置项：

- [官方文档](https://github.com/avajs/ava#configuration)

nyc：

- [官方文档](https://github.com/istanbuljs/nyc)

```json
{
  "ava": {
    "files": [
      "test/test.js"
    ],
    "verbose": true,
    "babel": "inherit",
    "require": [
      "babel-core/register"
    ]
  },
  "nyc": {
    "exclude": [
      "test/*.js"
    ]
  }
}
```

### 3. 添加npm命令

```json
{
  "scripts": {
    ...
    "test": "npm run lint && nyc ava",
    "test:watch": "ava --watch"
  }
}
```

## 持续集成Travis CI

### 1. 登陆Travis-CI

> [https://travis-ci.org](https://travis-ci.org)，使用Github授权登陆

### 2. 添加Repo

{{ image(src="2018-04-04-13-54-44.png" alt="Travis-CI") }}

### 3. 创建`.travis.yml`

> 在项目根目录下添加`.travis.yml`

说明：

- language 指定开发语言
- node_js 指定node.js版本号

其它配置项:

- [官方参考文档]((https://docs.travis-ci.com/user/languages/javascript-with-nodejs))

```yaml
language: node_js
node_js:
- '9'
- '8'
- '7'
```

### 4. 提交`.travis.yml`

> 提交`.travis.yml`到Github, Travis-CI根据提交自动触发持续集成，可在设置中取消根据提交自动触发持续集成

{{ image(src="2018-04-04-14-40-03.png", alt="持续集成") }}

### 5. 获取徽章

> 获取持续集成结果徽章添加到`README.md`中

{{ image(src="2018-04-04-14-45-47.png" alt="获取徽章") }}

## 测试覆盖率Coveralls

### 1. 登陆Coveralls

> [https://coveralls.io](https://coveralls.io)，使用Github授权登陆

### 2. 添加Repo


{{ image(src="2018-04-04-14-27-17.png" alt="Coveralls添加Repo") }}

### 3. 加密repo_token

> 安全起见，repo_token不应该明文写到`.travis.yml`中，coveralls提供了非对称加密repo_token的方法

{{ image(src="2018-04-04-14-55-11.png" alt="coveralls") }}

- 使用[travis命令工具](https://github.com/travis-ci/travis.rb#readme)加密

```bash
# 更改为国内的安装源
gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
gem sources -l
```

```bash
# 安装travis
sudo gem install travis -v 1.8.8 --no-rdoc --no-ri
travis version
1.8.8
```

```bash
# 加密
travis encrypt COVERALLS_REPO_TOKEN=your_repo_token
```

{{ image(src="2018-04-04-15-28-22.png" alt="加密repo_token") }}

- 添加加密后的**secure**到`.travis.yml`

> 修改`.travis.yml`，设置env环境变量（travis提供的repo_token安全方式之一），也可以使用 **--add** 自动添加到 `.travis.yml`中。

{{ image(src="2018-04-04-15-33-53.png" alt="travis.yml") }}

### 4. 安装coveralls并添加npm命令

- 安装coveralls

```bash
npm install coveralls -D
```

- 添加npm命令

> **nyc**生成覆盖率报告推送给**coveralls**

```json
{
  "scripts": {
    ...
    "coverage": "nyc report --reporter=text-lcov | coveralls"
  }
}
```

### 5. 修改`.travis.yml`

- 添加 `after_success: npm run coverage`

> **after_success**: script阶段成功时执行， script阶段默认脚本为 `npm test`，可以省略

{{ image(src="2018-04-04-16-23-41.png" alt="修改.travis.yml") }}

- 重新提交到Github，触发持续集成，到[https://coveralls.io](https://coveralls.io/)查看覆盖率报告，并获取徽章添加到README.md

{{ image(src="2018-04-04-16-46-58.png" alt="获取徽章") }}

## 发布模块到NPM社区

### 1. 打包代码

```bash
npm run build
```

### 2. 添加账号

> 需要先到[https://www.npmjs.com](https://www.npmjs.com)注册一个账号

```bash
npm adduser
Username: your username
Password: your password
Email: your email
```

### 3. 发布

> 无作用域包始终是公开的。有作用域默认为受限制的，可以使用`–-access public` 发布的时候设置权限为公开

```bash
npm publish --access public
```

npm社区版本号规则采用的是semver(语义化版本)，主要规则如下：

> 版本格式：主版号.次版号.修订号

版号递增规则如下：

- 主版号：当你做了不相容的 API 修改，
- 次版号：当你做了向下相容的功能性新增，
- 修订号：当你做了向下相容的问题修正。
- 先行版号及版本编译资讯可以加到「主版号.次版号.修订号」的后面，作为延伸

## 添加个性化徽章

> 推荐 [https://shields.io/](https://shields.io/)

为项目添加上各种各样的徽章，例如：

- 测试是否通过以及代码覆盖率情况
- 项目的最新版本
- 项目的被使用情况
- 代码风格
- 项目的开源协议

{{ image(src="2018-04-04-17-34-28.png" alt="badges") }}

## 参考项目

> 该项目包含教程所有的完整配置

Github地址: [https://github.com/eteplus/typeof](https://github.com/eteplus/typeof)

## 相关链接

- [Webpack](https://webpack.js.org/)
- [AVA](https://github.com/avajs/ava)
- [nyc](https://github.com/istanbuljs/nyc)
- [Travis-CI](https://travis-ci.org)
- [Coveralls](https://coveralls.io/)
- [持续集成服务 Travis CI 教程](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)
