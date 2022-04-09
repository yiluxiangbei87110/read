## 基础知识
### 发布订阅者模式
待更新---

### 事件委托
 利用事件冒泡处理动态元素事件绑定的方法，专业术语叫事件委托。
 
 避免给所有的元素添加事件，提高性能了性能，当有上千个dom结构需要绑定的时候，使用委托节约了时间。


```js
var ul=document.getElementById('ul');
ul.addEventListener('click',function(event){
    console.log(event.target.innerHTML);        // target,当前触发事件的对象
    console.log(event.currentTarget); // currentTarget,当前绑定事件的对象
},false);

// jquery中实现委托
$('#ul').on('click','li',function(){
    $(this).addClass('active').siblings().removeClass('active');
});
```
相同的案例，vue为什么不推荐使用事件委托呢？
1. vue本身的循环已经避免了手动给所有的对象添加绑定函数。
2. 即便使用委托，也需要去判断触发对象。
参考链接[example link](https://forum.vuejs.org/t/is-event-delegation-necessary/3701/3 "With a Title").


### DOM事件

  #### 1. DOM事件级别
  1.1 DOM0 element.onclick=function(){}
  1.2 DOM2 element.addEventListener('click',function(){},false(false冒泡触发,true捕获触发))
  1.3 DOM3 element.addEventListener('keyup',function(){},false)

  #### 2. DOM事件类型 
  事件流(捕获---目标对象---冒泡) 
  2.1 捕获  window--document--html--body--.....--目标元素
  2.2 冒泡  目标元素--......--body--html--document--window
  2.3 尽管“DOM2级事件”标准规范明确规定事件捕获阶段不会涉及事件目标，但是在IE9、Safari、Chrome、Firefox和Opera9.5及更高版本都会在捕获阶段触发事件对象上的事件。
  2.4 并非所有的事件都会经过冒泡阶段 。所有的事件都要经过捕获阶段和处于目标阶段，但是有些事件会跳过冒泡阶段：如，获得输入焦点的focus事件和失去输入焦点的blur事件。

  ```js
      var div = document.querySelector('#div');

    // div的顺序书写不同，打印的先后顺序也不一样
    div.addEventListener('click', function() {
        console.log('冒泡 div')
    }, false);

    div.addEventListener('click', function() {
        console.log('捕获 div')
    },true);

    window.addEventListener('click', function() {
        console.log('冒泡 window')
    }, false);
    
    window.addEventListener('click', function() {
        console.log('捕获 window')
    }, true);


    document.documentElement.addEventListener('click', function() {
        console.log('冒泡 document')
    }, false);
    document.documentElement.addEventListener('click', function() {
        console.log('捕获 document')
    }, true);

    document.body.addEventListener('click', function() {
        console.log('冒泡 body')
    }, false);

    document.body.addEventListener('click', function() {
        console.log('捕获 body')
    }, true);

      // 捕获 window
      // 3.dom事件.html:81 捕获 document
      // 3.dom事件.html:89 捕获 body
      // 3.dom事件.html:62 冒泡 div
      // 3.dom事件.html:66 捕获 div
      // 3.dom事件.html:85 冒泡 body
      // 3.dom事件.html:78 冒泡 document
      // 3.dom事件.html:71 冒泡 window

  ```

  #### 3. DOM事件类
  3.1 event.preventDefault() // 阻止默认事件 如a标签跳转
  3.2 event.stopPropagation() // 阻止冒泡 (IE cancelBubble)
  3.3 event.stopImmediatePropagation(); // 如果一个button绑定 A、B两个事件，A中绑定的方法中使用了stopImmediatePropagation，则B事件不会被执行。
  3.4 event.currentTarget  currentTarget返回绑定事件的元素
  3.5 event.target  (Ie srcElement) 返回触发事件的元素,一般用于委托

  #### 4. 自定义事件  
  4.1 Event()        IE不支持该方法
  4.2 CustomEvent()  IE不支持该方法，可以通过detail字段传递一个额外的字段
  4.3 document.createEvent() 创建一个新的事件（Event），随之必须调用自身的 init 方法进行初始化。种方声明不推荐使用了，但是浏览器都是支持的，IE也都支持
  new Event => dipatch => addEventListener

  ```js
    var selfEvent = new Event('self', {
        bubbles: true,
        cancelbale: false,
        composed: false,
        // custom中支持携带参数
        // detail:{
        //   age:18
        // }
    });
    // document.dispatchEvent(selfEvent)
    document.getElementById('btn').addEventListener('click', function() {
        // dispatch 事件对象
        this.dispatchEvent(selfEvent);
    });

    document.addEventListener('self', function() {
        console.log('触发了自定义事件')
    });

  ```

### git merge 和git rebase
git merge git 平常用的最多的就是git merge。
1. 只处理一次冲突
2. 引入了一次合并的历史记录，合并后的所有 commit 会按照提交时间从旧到新排列
3. 所有的过程信息更多，可能会提高之后查找问题的难度

git rebase

1. 改变当前分支从 master 上拉出分支的位置
2. 没有多余的合并历史的记录，且合并后的 commit 顺序不一定按照 commit 的提交时间排列
3. 可能会多次解决同一个地方的冲突
3. 更清爽一些，master 分支上每个 commit 点都是相对独立完整的功能单元

### 等比例布局

> 要求： 骰子距离浏览器左右始终为80px,圆到筛子边框距离不变，但是大小可调，不考虑兼容性。

等比例布局，也就是控制宽高比例，可以通过vw、padding来处理。
![](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/1.gif )
1. 方式1
```HTML
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>无标题</title>
    <style type="text/css">
    * {
        margin: 0;
        padding: 0;
    }

    html,
    body {
        width: 100%;
        height: 100%;
        background: #292929;
    }

    .wrap {
        margin: 20px 80px;
        width: calc(100vw - 160px);
        height: calc(100vw - 160px);
        display: flow-root;
        background: #fff;
        border-radius: 10px;
    }

    .item {
        overflow: hidden;
        margin: 5px 0;
    }

    .item span {
        float: left;
        border-radius: 50%;
        /* 160px +4间距*5=180px*/
        width: calc((100vw - 180px) / 3);
        height: calc((100vw - 180px) / 3);
        background: #272822;
    }

    .item span:nth-child(1) {
        margin-left: 5px;
    }

    .item span:nth-child(3) {
        margin-right: 5px;
    }

    .item span:nth-child(2) {
        margin: 0 5px;
    }
    </style>
</head>

<body>
    <div>
        <div class="wrap">
            <div class="item">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="item">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="item">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
</body>

</html>
```
2. 方式二

```html
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>无标题</title>
    <style type="text/css">
    * {
        margin: 0;
        padding: 0;
    }

    html,
    body {
        width: 100%;
        height: 100%;
        background: #292929;
    }

    .wrap {
        margin: 20px 80px;
        width: calc(100vw - 160px);
        height: calc(100vw - 160px);
        display: flow-root;
        background: #fff;
        border-radius: 10px;
    }

    .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-gap: 5px;
        height: 100%;
        overflow: hidden;
        padding: 5px;
        box-sizing: border-box;
    }

    .item {
        background: #ed4014;
        border-radius: 50%;
    }
    </style>
</head>

<body>
    <div>
        <div class="wrap">
            <div class="container">
                <span class="item"></span>
                <span class="item"></span>
                <span class="item"></span>
                <span class="item"></span>
                <span class="item"></span>
                <span class="item"></span>
                <span class="item"></span>
                <span class="item"></span>
                <span class="item"></span>
            </div>
        </div>
    </div>
</body>

</html>

```

3. 方式三

```html
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>无标题</title>
    <style type="text/css">
    * {
        margin: 0;
        padding: 0;
    }

    html,
    body {
        width: 100%;
        height: 100%;
    }
    .wrap {
       position: relative;
       padding: 50%;
       overflow: hidden;
       background: #292929;
    }
    .content{
        position: absolute;
        background: #fff;
        top:80px;
        bottom: 80px;
        left: 80px;
        right: 80px;
    }
    .item{
        display: flex;
        justify-content: space-around;
        height: calc(100% / 3);
    }
    .item span {
        border-radius: 50%;
        /* 160px +4间距*5=180px*/
        width: calc((100vw - 180px) / 3);
        height: calc((100vw - 180px) / 3);
        background: #ff9900;
    }
    </style>
</head>

<body>
    <div>
        <div class="wrap">
           <div class="content">
                <div class="item">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="item">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="item">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
           </div>
        </div>
    </div>
</body>

</html>

```

### vue写一个简单的prompt组建
![](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/2.gif )
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
      <v-prompt 
          :show-pompt="showPompt" 
          @on-confirm="handleConfirm" 
          v-model="value"
          @on-close="handleClose"
          ></v-prompt>
      <button @click="handleShowPrompt">显示prompt弹框</button>
  </div>
  <script src='../vue.js'></script>
  <script src='index.js'></script>
  <script type="text/javascript">
    var app=new Vue({
      el:'#app',
      data(){
        return {
          value:'',
          showPompt:false, // 是否显示弹框
        }
      },
      methods:{
        handleShowPrompt(){
          this.showPompt=true;
        },
        handleConfirm(value){
          console.log(value)
        },
        handleClose(){
          this.showPompt=false;
        }
    }
    })
  </script>
</body>
</html>
```

```js
Vue.component('v-prompt', {
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        showPompt: {
            type: Boolean,
            default: false
        }
    },
    template: `

      <div class="prompt" v-show="showPompt" @click.self="handleClose">
        <div class="wrap">
          <h3>通用弹框</h3>
          <input type="text" placeholder="输入点什么东西吧" v-model="currentValue"/>
          <div class="footer">
              <button @click="handleClose">取消</button>
              <button @click="handleConfirm">确定</button>
          </div>
        </wrap>
      </div>
    `,
    methods: {
        handleClose() {
            this.showPompt = false;
            this.$emit('on-close');
        },
        handleConfirm() {
            this.handleClose();
            this.$emit('on-confirm', this.currentValue)
        }
    },
    data() {
        return {
            currentValue: this.value
        }
    },
    watch: {
        showPompt: function(val) {
            console.log('watch',val)
        }
    },
});
```

### 模块化编程

1. AMD是requireJS在推广过程中对模块定义的规范化产出。AMD是依赖关系前置,在定义模块的时候就要声明其依赖的模块.
```js
define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
  a.doSomething()
  // 此处略去 100 行
  b.doSomething()
  ...
}) 
```
2. CMD是SeaJS在推广过程中对模块定义的规范化产出。CMD是按需加载依赖就近,只有在用到某个模块的时候再去require。
```js
define(function(require, exports, module) {
  var a = require('./a')
  a.doSomething()
  // 此处略去 100 行
  var b = require('./b') // 依赖可以就近书写
  b.doSomething()
  // ... 
})
```
3. CommonJS规范 module.exports
```js
exports.area=function(){
    
}
exports.getName=function(){
    return 'kangkang'
}
```
4. ES6 import export
```js
import moment from 'moment';
export default{
    
}

```
require与import的区别

1. require支持 动态导入，import不支持，正在提案 (babel 下可支持)
2. require是 同步 导入，import属于 异步 导入
3. require是 值拷贝，导出值变化不会影响导入值；import指向 内存地址，导入值会随导出值而变化。

```js
export const a = [1, 2, 3, 4];

// A.vue
let a = API.a;
a.push(1111111);
console.log(a);

// B.vue
let a = API.a;
a.push(999999999999999);
console.log(a);

// 结果会互相影响，公用一个内存地址。

可以这样解决
export const a = ()=> [1, 2, 3, 4];

```


### 算法

### 同源策略
 协议 域名和端口构成一个源，同源策略限制一源和另外一个源的通信。
 1. Cookie LocalStorge indexDB无法获取。
 2. Dom无法获取
 3. ajax不能发送请求

### 前后端通信
  1. ajax/axios/fetch
  2. websocket 不限制同源跨域
  3. CORS
  4. eventSource

### 通信跨域的几种方式
 1. JSONP 实现
 2. Hash
 3. postMessage h5新标准
 4. websocket
 5. CORS

```js
//  hash,A页面通过iframe或者frame嵌入了跨域的页面B
// A中处理
 var B=document.getElementsByTagName('iframe')[0];
 B.src=B.src+'#'+'data';

 // B中处理
 window.onhashchange=function(){
  var data=window.location.hash;
 }
```

```js
// 窗口A向窗口B发送消息
// 窗口A
Bwindow.postMessage('data','http://www.xinghang.com' ||'*');
Awindow.addEventListener('message',function(event){
  console.log(event.origin);
  console.log(event.data);
});

```


### 渲染机制
css加载不会阻塞DOM树解析（异步加载时DOM照常构建）

但会阻塞render树渲染（渲染时需等css加载完毕，因为render树需要css信息）

这可能也就是浏览器的一种优化机制。

1. 资源压缩合并，减少http请击
2. 非核心代码异步加载
3. 利用浏览器缓存 （记得代码）
4. 使用CDN
5. 预解析DNS（https下默认关闭)


### js异步加载
1. defer 是在html解析完成之后才执行（虽然会加载资源），如果是多个按照加载的顺序依次执行。
2. async 是在加载完成之后立即执行，如果是多个，执行顺序和书写顺序无关。(适用性范围比较少)。
3. 因为以上的原因，建议js写在body后。
```js
<script src="script.js"></script>
<script async src="script.js"></script>
<script defer src="script.js"></script>
```
![defer async ](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/deferasync.png 'title')

### 错误


即时运行错误的捕获方式
1. try catch
2. window.onerror

资源加载错误

1. object.onerror（图片等资源）
2. performance.getEntries()
3. Error事件捕获

### ajax
```js
var xhr=window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject('microsoft.XMLHTTP');
xhr.open('post','url',true); // 默认true异步
xhr.send({name:'felix'});
xhr.onreadeystatechange=function(xhr){
    if(xhr.readystate===4){
        // 如果客户端发送了一个带条件的GET 请求且该请求已被允许，而文档的内容并没有改变，则服务器应当返回这个304状态码。
        // 304 简单的表达就是：客户端已经执行了GET，但文件未变化。
        if((xhr.status>=200 && xhr.status<300) || xhr.status===304){
            console.log(xhr.responseText);
        }else{

        }
    }
}
```

### bind函数
call、apply、bind都可以改变this的指向，call和apply会执行函数，而bind会返回一个新的函数，下面实现一个bind函数。
```js
if(!Function.prototype.bind1){
    Function.prototype.bind1=function(){
        var self=this;
        console.log("this",this); //function sayName(){}
        var context=Array.prototype.shift.call(arguments);
        var args=[].slice.call(arguments);
        return function(){
            // return self.apply(context,args.concat([].slice.call(arguments)));
            return self.apply(context,[...args,...arguments]);
        }
    }
}

var name="firstName";
var a={name:'kangkang'};
function sayName(){
    console.log(this.name);
}
sayName(); // firstName
sayName.bind1(a)(); // kangkang

```

### 防抖和节流

防抖用于延迟执行最后的动作，在指定时间内多次触发，则会清除以上的事件，重新计时，直至一定时间内不在触发，则触发这个最后一次事件。

```js
    // 函数防抖Debouncing，要等你触发完事件 n 秒内不再触发事件，函数才执行，强调的是触发事件。
    function fn() {
        console.log("hola datevid");
    }

    function debounce() {
        let timer;
        console.log(timer);
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            console.log('1111111111')
        }, 1000)
    }

    function debounceF(fn, delay) {
        let timer = null;
        return function() {
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                fn.call(this)
            }, delay)
        }
    }

```

节流的原理很简单,有两种实现方式定时器和时间戳。在一定时间内，只执行一次，强调的是时间，比如每隔五分钟执行一次，如果五分钟内又触发了，也不执行，必须等待五分钟过后再次触发才会执行。

```js
    function throttle1() {
        let timer;
        if (!timer) {
            timer = setTimeout(function() {
                console.log(123)
                timer = null;
            }, 200)
        }
    }

    function throttleF1(fn, delay) {
        var timer = null;
        return function() {
            if (!timer) {
                timer = setTimeout(() => {
                    fn.call(this);
                    timer = null;
                }, delay)
            }
        }
    }

    // 时间戳
    function throttle2() {
        var previous = 0;
        var now = Date.now();
        if (now - previos > 1000) {
            previous = now;
        }
    }

    function throttleF2(fn, delay) {
        var previous = 0;
        return function() {
            var now = Date.now();
            if (now - previous > delay) {
                fn.call(this);
                previous = now;
            }
        }
    }

```


### typeof

typeof null ==='object' 为什么返回true？

在《你不知道的JavaScript》中有这么一段解释：不同的对象在底层都表示为二进制， 在 JavaScript 中二进制前三位都为 0 的话会被判断为 object 类型， null 的二进制表示是全 0， 所以执行 typeof 时会返回“object”。

在 javascript 的最初版本中，使用的 32 位系统，为了性能考虑使用低位存储了变量的类型信息：

| 类型       |机器码                  |
| ------    | ---------------------  |
| Object    | 000                    |
| Integer   | 1                      |
| flot      | 010                    |
| string    | 100                    |
| undefined | −2^30                  |
| null      | 0000000                |

### 函数柯里化
在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。简单来说，就是固定一些参数，返回一个接受剩余参数的函数。其实就是使用闭包返回一个延迟执行函数。
```js
var currying = function(fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        var newArgs = args.concat(Array.prototype.slice.call(arguments));
        return fn.call(null, newArgs);
    }
}

var testCurrying = currying(function() {
    var allArgs = [].slice.call(arguments);
    console.log('所有的参数', allArgs);
}, '111', '2333');

testCurrying(); // ["111", "2333"]
testCurrying('4444'); // ["111", "2333", "444"]
testCurrying('777', '999');// ["111", "2333", "777", "999"]
```
 通过闭包把初步参数给保存下来，然后通过获取剩下的arguments进行拼接，最后执行需要currying的函数。 但是好像还有些什么缺陷，这样返回的话其实只能多扩展一个参数，currying(a)(b)(c)这样的话，貌似就不支持了（不支持多参数调用），一般这种情况都会想到使用递归再进行封装一层。

 ```js
 // 此函数有fn.length的限制
 function curry(fn, args) {
    var length = fn.length;
    var args = args || [];
    return function() {
        var _args = args.slice(0);
        _args=_args.concat([].slice.call(arguments))
        if (_args.length < length) {
            return curry.call(this, fn, _args);
        }
        else {
            return fn.apply(this, _args);
        }
    }
}


var fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});

fn("a", "b", "c") // ["a", "b", "c"]
fn("a", "b")("d") // ["a", "b", "d"]
fn("a")("b")("e") // ["a", "b", "e"]
fn("a")("b", "f") // ["a", "b", "f"]

 ```

 实现一个add方法，使计算结果能够满足如下预期：
1. add(1)(2)(3) = 6;
2. add(1, 2, 3)(4) = 10;
3. add(1)(2)(3)(4)(5) = 15;

```js
function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = Array.prototype.slice.call(arguments);

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var _adder = function() {
        _args.push(...arguments);
        return _adder;
    };

    // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
        return _args.reduce(function (a, b) {
            return a + b;
        });
    }
    return _adder;
}

add(1)(2)(3)                // 6
add(1, 2, 3)(4)             // 10
add(1)(2)(3)(4)(5)          // 15
add(2, 6)(1)                // 9

```

### []中括号预算符
```js
var a={a:1};
var b={b:1};
var c={c:1};
var obj={};
obj[a]=1; 
// 为什么此时 obj[b]===1  obj[c]===1,因为此时的key值已经是[object Object]了。obj打印结果是 {[object Object]: 1}
console.log(obj[b]);
console.log(obj[c]);
```

### toString和valueof
需要转换为字符串时，会调用toString，需要转换为数字时需要调用valueOf。
```js

function temp() {

};
temp.toString=function(){
	return 'toString';
}
temp.valueOf=function(){
	return 1;
}

console.log(temp+1); //2 
alert(temp); // toString
console.log(temp);// 1
console.log(`${temp}`);// toString
```

### compose 函数
```js
function add1(str){
    return str+1;
}
function add2(str){
    return str+2;
}
function add3(str){
    return str+3;
}
let result=add3(add2(add1('测试')));
console.log(result);


function compose(...fns){
if(fns.length===1){
	return  fns[0]
}
return fns.reduce((a,b)=>{
	return (...args)=>{
		console.log(args);
		// ["好吃"]
		// ["好吃1"]
		return a(b(...args))
	}
})
// return fns.reduce((a,b)=>(...args)=>a(b(...args)));
}
let add = compose(add3,add2,add1);//
let result2 = add('好吃');
console.log(result2); // 好吃123

```
### http

   1. http协议主要特点： 简单快速 灵活 无连接 无状态 。http1.1支持持久连接。
   2. HTTP报文，包括请求报文和响应报文。请求报文包括请求行、请求头、空行、请求体，响应报文包括，状态行、响应头、空行、响应体。
   3. get和post请求的区别：
     3.1 get请求在浏览器回退时候是无害的，post会再次提交。
     3.2 get请求会被浏览拿起主动缓存，而post不会，除非手动设置。
     3.3 get请求在url传递参数是有长度限制的，而psot没有限制。
     3.4 get参数通过URL传递，而post放在request body中。
     3.5 get请求参数直接暴露在url上，相对不太安全。
   4. HTTP 状态码
    1xx 指示信息--表示请求已经接收，继续处理。
    2xx 成功--表示请求已被成功接收。
    3xx 重定向--要完成请求必须进行更进一步的操作。
    4xx 客户端错误--请求有语法错误或者请求无法实现。
    5xx 服务器错误--服务器未能实现合法的请求。

    200 OK 客户端请求成功
    206 Partial Content 客户端发送了一个带有Range头的get请求，服务器完成了它。一般是请求大的音视频
    301 Moved Permanently 所请求的页面已经转移到新的url
    302 Found  所请求的页面已经临时转移至新的url
    304 Not Modefied 服务器端告诉浏览器直接使用缓存
    401 Unauthorized 请求未经授权
    403 Forbidden 访问被禁止
    404 Not Found 请求资源不存在
    500 Internal Server Error 服务器发送不可以预期的错误

