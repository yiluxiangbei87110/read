# webpack :tada:

## 1. webpack配置vue脚手架

webpack-cli在 4.x 版本以后需要单独安装,此案例中，执行vue文件需要vue-loader模块，运行项目需要 webpack-dev-server模块。
> 目录结构如下
```js
|test
    |src
        |main.js
        |index.styl
    |index.template.ejs
    |postcss.config.js
    |.babelrc
    |package.json

```
```shell
npm init -y
npm install webapck webpack-cli vue-loader vue-template-compiler css-loader  -D
npm install cross-env webpack-dev-server -D
npm install vue -S

```

### 1.1 新建文件
新建src文件，并在该目录里新建app.vue 以及main.js文件。
> app.vue文件
```javascript
<template>
    <div id="app">{{text}}</div>
</template>
<script>
    export default{
        data(){
            return {
                text:'hello world'
            }
        }
    }
</script>

```

> main.js文件，项目入口文件。
```javascript
import Vue from 'vue';
import App from './app.vue';
const root=document.createElement('div');
document.body.appendChild(root);

//new Vue({
//   render:(h)=>h(App)
// }).$mount(root);

new Vue({
  el: root,
  render: h => h(App)
}); 


2. 通过plugin配置html模板来进行挂载。
 new Vue({
     el:'#app',
     render:(h)=>h(App)
 }); 


```

### 1.2 配置webpack.config.js
webpack 运行时默认读取项目下的 webpack.config.js 文件作为配置。

```javascript
const path=require("path");
module.exports={
    entry:path.join(__dirname,'src/index.js'),
    output:{
        filename:'bundle.js',
        path:path.join(__dirname,'dist')
    },
    mode:'development',
    module:{
        rules:[{
            test:/.vue$/,
            loader:'vue-loader'
        }]
    }
}

```

::: tip
webpack同时还支持多入口配置。
:::

```javascript
module.exports = {
  entry: './src/index.js' 
}

// 上述配置等同于
module.exports = {
  entry: {
    main: './src/index.js'
  }
}

// 使用数组来对多个文件进行打包(多个文件作为一个入口)
module.exports = {
  entry: {
    main: [
      './src/foo.js',
      './src/bar.js'
    ]
  }
}

// 配置多个入口 webpack 会解析两个文件的依赖后进行打包
module.exports = {
  entry: {
    foo: './src/foo.js',
    bar: './src/bar.js', 
    // ...
  }
}

```

### 1.3 配置package.json
cross-env 可以解决跨平台获取NODE_ENV的问题,也可以通过process的argv来进行变量控制。
```javascript
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "cross-env NODE_ENV=production webpack --config webpack.config.js",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
  }

```
### 1.4 运行项目 
执行 npm run dev后，地址栏输入localhost:8080 即可打开项目。


## 2. loader
上面我们已经配置了最简单的一个webpakc项目，接下来我们使用loader，来支持打包更多的资源。loader就是一个转换器，将不同的资源解析后webapck可以进行打包。比如上面的vue文件，我们需要vue-loader处理，css文件，我们需要css-loader来处理。
### 2.1 常用loader
1. css-loader 负责解析 CSS 代码，主要是为了处理 CSS 中的依赖，例如 @import 和 url() 等引用外部文件的声明。
2. style-loader 会将 css-loader 解析的结果转变成 JS 代码，运行时动态插入 style 标签来让 CSS 代码生效。
3. url-loader Works like the file loader, but can return a Data Url if the file is smaller than a limit.
4. file-loader Emits the file into the output folder and returns the (relative) url.

### 2.2 loader匹配规则
配置vue时候需要注意，新版本需要单独引用，const VueLoaderPlugin = require('vue-loader/lib/plugin');

1. { test: ... } 匹配特定条件
2. { include: ... } 匹配特定路径
3. { exclude: ... } 排除特定路径
4. { and: [...] }必须匹配数组中所有条件
5. { or: [...] } 匹配数组中任意一个条件
6. { not: [...] } 排除匹配数组中所有条件

loader的执行顺序按照前置（pre） -> 行内 -> 普通 -> 后置(post)的顺序执行。在一个rule里面的loader，如果使用use以数组的形式书写的话，执行顺序是从后往前的。
需要在eslint后然后在使用babel进行转换。我们需要设置eslint-loader为前置类型。

``` js
rules: [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "eslint-loader",
    enforce:'pre'
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
  },
]
```
### 2.3 配置css、图片等资源
安装依赖
npm install style-loader file-loader url-loader -D

```javascript
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(gif|jpg|png|jpeg|svg)$/,
                use: [
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,
                            name:'[name].[ext]'
                        }
                    }
                ]
            }
        ]
    }
```

## 3. plugin
plugin用于处理loader以外的构建任务，比如压缩js，填充html模板等。除了压缩 JS 代码的 uglifyjs-webpack-plugin，常用的还有定义环境变量的 DefinePlugin，生成 CSS 文件的 ExtractTextWebpackPlugin 等。

### 3.1 html-webapck-plugin
html-webpack-plugin 用来配置htmll模板的。
```js
    // 配置html模板
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname,'index.template.html'), // html模板文件
        filename: path.resolve(__dirname,'index.dev.html')       // 输出文件名称和路径
    })
```

### 3.2 webpack.DefinePlugin

webpack.DefinePlugin是webpakc4.x内置的插件，可以获取环境变量。

```js
    new webpack.DefinePlugin({
        'process-env': {
            //  注意 '"development"' : '"production"' 写法，直接一堆引号，则会解析成一个变量
            NODE_ENV: isDev ? '"development"' : '"production"'
        }
    })
```

### 3.3 copy-webpack-plugin 
copy-webpack-plugin 是用来复制文件的。
``` js
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/file.txt', to: 'build/file.txt', }, // 顾名思义，from 配置来源，to 配置目标路径
      { from: 'src/*.ico', to: 'build/*.ico' }, // 配置项可以使用 glob
      // 可以配置很多项复制规则
    ]),
  ]
```

### 3.4 min-css-extract-plugin
用来提取css，webapck4以前使用extact-text-webpack-plugin。当然现在也可以使用一个next版本。

```js
    // 提取css
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
    })
```

### 3.5 webpack.ProvidePlugin

该组件用于引用某些模块作为应用运行时的变量，从而不必每次都用 require 或者 import，其用法相对简单。
``` js
new webpack.ProvidePlugin({
     _: 'lodash',
     $: 'jquery'
});

```


## 4. webpack

### 4.1 webpack解析路径
经常会看到 

```js
import react from 'react';
import * as API from ''./api.js
```

1. 解析相对路径
2. 解析模块名
3. 解析绝对路径（不建议使用）

### 4.2 resolve
1. resolve.alias 配置别名
编写相对路径比较麻烦，可以这样配置，但是会影响构建速度。

2. extensions
resolve.extensions配置扩展名，不加扩展名会按照配置的数组去查找。

```js
resolve:{
    alias:{
        @asserts:path.join(__dirname,'src/asserts'),
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.css'],
    }
}
```

```js
import asserts from '@sserts/images'
```

### 4.3 mode
webpack 4.x 版本引入了 mode 的概念，在运行 webpack 时需要指定使用 production或development 两个mode 其中一个，这个功能也就是我们所需要的运行两套构建环境的能力。
1. roduction mode 时，默认会启用各种性能优化的功能，包括构建结果优化以及webpack运行性能优化，打包时，自动会启用JS Tree Sharking和文件压缩。
2. development mode 的话，则会开启debug工具，运行时打印详细的错误信息，以及更加快速的增量编译构建。

webpack4.x中可以这样配置。
```js
module.exports = (env, argv) => ({
  // ... 其他配置
  optimization: {
    minimize: false,
    // 使用 argv 来获取 mode 参数的值
    minimizer: argv.mode === 'production' ? [
      new UglifyJsPlugin({ /* 你自己的配置 */ }), 
      // 仅在我们要自定义压缩配置时才需要这么做
      // mode 为 production 时 webpack 会默认使用压缩 JS 的 plugin
    ] : [],
  },
})

```

### 4.4 devtool
参考链接[](https://webpack.js.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx 'devtool')
生产开发分开[](https://github.com/yiluxiangbei87110/vue-webpack)

### 4.5 webpack-dev-server
我们使用webpack-dev-server来开启本地服务。安装webpack-dev-server后，需要在package.json里配置
```js 
"dev": "webpack-dev-server --mode development"
```
webpack-dev-server默认端口号为8080，执行npm run dev 那么直接访问 http://localhost:8080。
publicPath 字段用于指定构建好的静态文件在浏览器中用什么路径去访问，默认是 /，例如，对于一个构建好的文件 bundle.js，完整的访问路径是 http://localhost:8080/bundle.js。
如果你配置了 publicPath: 'assets/'，那么上述 bundle.js 的完整访问路径就是 http://localhost:8080/assets/bundle.js。

proxy用来进行代理

``` js
devServer:{
        port: 8000,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        open: true,
        // 启动热更新，需要plugin配置HotModuleReplacementPlugin,不然报错
        hot: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': {
            target: 'http://XXX.XXX:4000', // 将 URL 中带有 /api 的请求代理到http://XXX.XXX:4000端口的服务上
            changeOrigin: true,
            pathRewrite: {
            '^/api': '' //把 URL 中 path 部分的 `api` 移除掉
            }
        }
        }
    }

```
### 4.6 HMR
HMR（Hot Module Replacement）可以使用模块热替换配合devServer使用。启动热更新，需要plugin配置HotModuleReplacementPlugin,不然报错。
```js
new webpack.HotModuleReplacementPlugin(),
new webpack.NoEmitOnErrorsPlugin()
```


## 5. babel

### 5.1 bable升级
>webpack 报错

```js
Module build failed (from ./node_modules/babel-loader/lib/index.js): 
TypeError: Cannot read property 'bindings' of null

```

babel升级到7.x后，舍弃了以前的*babel-core、babel-preset-env* 改成了 *@babel/core、@babel/preset-env*的这种形式。

> 解决方法：

1. 卸载之前的依赖项，并安装当前支持的版本@babel/preset-env @babel/core等。
2. .babelrc文件对应修改后就能正常启动项目了。

```js

{
  // "presets": ["env"] 之前的书写形式。~~
  "presets": [
    "@babel/preset-env"
  ]
}


```

Babel作为一个JavaScript的语法编译器，可以将ES6/7/8代码转为ES5代码。Babel的配置文件是.babelrc，存放在项目的根目录下，该文件用来设置转码规则和插件。Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign ）都不会转码,这就需要plugins和presets。

### 5.2 presets

presets是plugins的组合，通常会将一些模块打包在一起。例如需要转换ES2015(ES6)的语法，那么必须在.babelrc的plugins中按需引入不同作用的plugin。但是这样相对繁琐，我们可以直接使用babel团队推荐的es2015模块，就不用一一配置了。presets中的 targets可以指定目标执行环境 node或者browsers。例如需要配置兼容["last 2 versions", "ie >= 7"]的babel-preset-env。
:::  tip
presets按照数组从后往前的顺序进行编译。

::: 

bable常用的plugins。

```
env
es2015
react
lastet
stage-x
```
@babel/preset-env

```
{
  "plugins": [
    "check-es2015-constants",
    "es2015-arrow-functions",
    "es2015-block-scoped-functions",
    // ...
  ]
}

```

``` js
{
    "presets": [
        [
        "@babel/preset-env",
        {
            "targets":
            {
                "browsers": ["last 2 versions", "ie >= 7"],
                "node": "8.11.3"
            },
            "useBuiltIns": "entry"
            }
        ]
    ],
    "plugins": [
        ["@babel/transform-runtime",
        {
            "helpers": false
        }],
        "@babel/plugin-syntax-dynamic-import",
    ]
}
```

根据 browserlist 是否转换新语法与 polyfill 新 API

1. false : 不启用polyfill, 如果 import '@babel/polyfill', 会无视 browserlist将所有的 polyfill都会加载进来。
2. entry : 启用，需要手动 import '@babel/polyfill', 这样会根据 browserlist过滤出需要的polyfill。
3. usage : 不需要手动import '@babel/polyfill'(加上也无妨，构造时会去掉), 且会根据实际使用到的新API按需进行polyfill。

### 5.3 plugins

#### 5.3.1 @babel/polyfill

@babel/polyfill做法比较暴力，就是将全局对象通通污染一遍
1. 可能会增加很多根本没有用到的polyfill。
2. 可能会污染子模块的局部作用域，严重的或许会导致冲突。
3. 如果你的运行环境比较low，比如说Android一些老机子，而你有需要大量使用Promise、Object.assign、Array.find之类的全局对象或者其所属方法，那么使用babel-polyfill，绝对是一劳永逸。

#### 5.3.2 @babel-runtime
@babel-runtime 需要手动导入需要的包，如import Promise from 'babel-runtime/core-js/promise'。这样不仅避免污染全局对象，而且可以减少不必要的代码。同时配合使用babel-plugin-transform-runtime就可以轻松的帮你省去手动import的痛苦，而且，它还做了公用方法的抽离，哪怕你有100个模块使用了Promise，但是promise的polyfill仅仅存在1份。
babel 在每个需要的文件的顶部都会插入一些 helpers 代码，这可能会导致多个文件都会有重复的 helpers 代码。@babel/plugin-transform-runtime + @babel/runtime 可以避免编译构建时重复的 helper 代码。babel-runtime有个缺点，它不模拟实例方法，即内置对象原型上的方法，所以类似Array.prototype.find，你通过babel-runtime是无法使用的。这样我们就可以使用babel-preset-env。


#### 5.3.3  @babel/register
babel-register模块改写require命令，为它加上一个钩子。此后，每当使用require加载.js、.jsx、.es和.es6后缀名的文件，就会先用Babel进行转码。
但请注意这种方法并不适合正式产品环境使用。


#### 5.3.4 @babel/plugin-syntax-dynamic-import
@babel/plugin-syntax-dynamic-import动态加载对应的JS文件，这样做的好处就是加速首屏显示速度，同时也减少了资源的浪费。


| 方案   | 打包大小               | 优点 | 缺点|
| ------ | ------------------------ | ------ | ------------------------ |  
| babel-polyfill    | 259K  |完整模拟ES2015+环境	  |   体积过大；污染全局对象和内置的对象原型 |
| babel-runtime  | 63K |按需引入，打包体积小 |不模拟实例方法（如Array.prototype.find）  |
| babel-preset-env（开启useBuiltIns）   | 194K |按需引入，可配置性高 |     |

## 6 配置文件
### 6.1 webpack.config.js

``` javascript
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const isDev = process.env.NODE_ENV === 'development';
console.log('-----------------', isDev);

module.exports = {
    mode: 'development',
    devtool: "#cheap-module-eval-source-map",
    target: 'web',
    entry: {
        app:'./src/main.js',
        vendor: ["vue", "lodash"],
        // 测试一下
        vue1:'vue',
        lodash1:'lodash'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        port: 8088,
        // host: '0.0.0.0',
        // open: true,
        overlay: {
            errors: true
        },
        // 启动热更新，需要plugin配置HotModuleReplacementPlugin,不然报错
        hot: true
    },
    module: {
        rules: [{
                test: /\.jsx?/,
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                use: 'babel-loader',
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 试了下，放在一起会报错  https://www.npmjs.com/package/mini-css-extract-plugin
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    'stylus-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            {
                test: /.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        // 配置html模板
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'template-html/index.ejs'), // html模板文件
            filename: path.resolve(__dirname, 'dist/index.html'), // 输出文件名称和路径
            // favicon: './favicon.ico',
            title:'test-webpack',
            inject: false,
            minify: { // 压缩 HTML 的配置
                minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                minifyJS: true // 压缩 HTML 中出现的 JS 代码
            }
        }),
        // 提取css
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),

        // DefinePlugin定义变量
        new webpack.DefinePlugin({
            'process-env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        // 启动热更新，需要plugin配置HotModuleReplacementPlugin,不然报错
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    // 打包公共类库
    optimization: {
        splitChunks: {
          cacheGroups: {
            // 1. 路径下的node_modules全部作为公共部分，此时entry不需要特定指定类库了。
            // vendor: {
            //   chunks: "initial",
            //   test: path.resolve(__dirname, "node_modules"), // 路径在 node_modules 目录下的都作为公共部分
            //   name: "vendor", // 使用 vendor 入口作为公共部分
            //   enforce: true,
            // },
            // 2. 指定类库进行打包
            vendor: {
              chunks: "initial", //  这表示将选择哪些块进行优化。当提供一个字符串，有效值为all，async和initial。提供all可以特别强大，因为这意味着即使在异步和非异步块之间也可以共享块。
              test: "vendor", // 控制此缓存组选择的模块。省略它选择所有模块。它可以匹配绝对模块资源路径或块名称,匹配块名称时，将选择块中的所有模块。
              name: "vendor", // 使用 vendor 入口作为公共部分
              enforce: true // 忽略splitChunks.minSize，splitChunks.minChunks，splitChunks.maxAsyncRequests和splitChunks.maxInitialRequests选项，只为这个高速缓存组创建块。
            },
            vue1: {
              chunks: "initial",
              test: "vue1",
              name: "vue1", // 使用 vue1 入口作为公共部分
              enforce: true,
            },
            lodash1: {
              chunks: "initial",
              test: "lodash1",
              name: "lodash1", // 使用 lodash1 入口作为公共部分
              enforce: true,
            },
          },
        },
      },
    resolve: {
        // 配置别名
        alias: {
            '@images': path.join(__dirname, 'src/images'),
            '@styles': path.join(__dirname, 'src/styles')
        },
        // 配置默认扩展
        extensions: ['.js', '.vue', 'jsx']
    }
}

```
### 6.2 postcss.config.js

```js
const autoprefixer=require('autoprefixer');
module.exports={
    plugins:[
        autoprefixer()
    ]
}

```
### 6.3 babelrc
```
{
	// "presets": ["env"] bable7以后需要下面
	"presets": [
		"@babel/preset-env"
	]
}

```
### 6.4package.json

```
{
  "name": "test-webapck",
  "version": "1.0.0",
  "description": "test-webapck",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "cross-env NODE_ENV=production webpack --mode production",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --mode development"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "lodash": "^4.17.11",
    "vue": "^2.5.22"
  },
  "devDependencies": {
    "@babel/core": "^7.2.2",
    "@babel/preset-env": "^7.2.3",
    "autoprefixer": "^9.4.5",
    "babel-helper-vue-jsx-merge-props": "^2.0.3",
    "babel-loader": "^8.0.5",
    "babel-plugin-transform-vue-jsx": "^3.7.0",
    "babel-preset-env": "^1.7.0",
    "cross-env": "^5.2.0",
    "css-loader": "^2.1.0",
    "file-loader": "^3.0.1",
    "html-webpack-plugin": "^3.2.0",
    "mini-css-extract-plugin": "^0.5.0",
    "postcss-loader": "^3.0.0",
    "style-loader": "^0.23.1",
    "stylus": "^0.54.5",
    "stylus-loader": "^3.0.2",
    "vue-loader": "^15.5.1",
    "vue-template-compiler": "^2.5.22",
    "webpack": "^4.28.4",
    "webpack-cli": "^3.2.1",
    "webpack-dev-server": "^3.1.14"
  }
}
```

