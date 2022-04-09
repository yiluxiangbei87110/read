# node

node本身提供了一些核心模块，如HTTP、URL、FS、Event等内置模块。

## http模块
### 1. http开服务启
```js
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

//res 设置返回信息
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

```
### 2. 爬取代码

> https协议下爬取不了,可以使用https模块。

```js
var http=require('http');
var url='http://www.youku.com/';
http
.get(url,function(res){
  var html='';
  res.on('data',function(data){
    html+=data;
  });
  res.on('end',function(){
    console.log('--------读取结束--------');
    console.log(html);
  })
})
.on('error',function(err){
  console.log('失败');
  console.log(err)
});

```


## url模块

### 1. url.parse
url.parse(url,true); true可以将get请求的参数转换成query对象。

```js
const url=require('url')
var res1=url.parse('https://www.sohu.com?name=Felix&id=1');

Url {
 protocol: 'https:',
 slashes: true,
 auth: null,
 host: 'www.sohu.com',
 port: null,
 hostname: 'www.sohu.com',
 hash: null,
 search: '?name=Felix&id=1',
 query: 'name=Felix&id=1',
 pathname: '/',
 path: '/?name=Felix&id=1',
 href: 'https://www.sohu.com/?name=Felix&id=1' }

```


```js
const url=require('url')
var res2=url.parse('https://www.sohu.com/video/6710?name=Felix&id=1',true);
Url {
 protocol: 'https:',
 slashes: true,
 auth: null,
 host: 'www.sohu.com',
 port: null,
 hostname: 'www.sohu.com',
 hash: null,
 search: '?name=Felix&id=1',
 query: { name: 'Felix', id: '1' },
 pathname: '/video/6710',
 path: '/video/6710?name=Felix&id=1',
 href: 'https://www.sohu.com/video/6710?name=Felix&id=1' }

```
### 2. url.format

```js
var res3=url.format({
protocol: 'https:',
 slashes: true,
 auth: null,
 host: 'www.sohu.com',
 port: null,
 hostname: 'www.sohu.com',
 hash: null,
 search: '?name=Felix&id=1',
 query: { name: 'Felix', id: '1' },
 pathname: '/video/6710',
 path: '/video/6710?name=Felix&id=1',
 href: 'https://www.sohu.com/video/6710?name=Felix&id=1' 
})

https://www.sohu.com/video/6710?name=Felix&id=1
```
### 3. url.resolve 
url.resolve(from,to) 替换域名后面第一个/的内容。
```js
3.url.resolve(from, to)
const url = require('url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'

```

## event模块
### 1. 添加事件
events.EventEmitter模块可以自定义事件。
1. 添加事件监听，addListener || on。一个事件最好不要设置超过10个监听器，超过会有警告，但是可以这样，life.setMaxListeners(15)。
2. 解除事件 off || removeListener || removeAllListeners 

```js
var EventEmitter=require('events').EventEmitter

var life=new EventEmitter()

life.on('greet',function(who){
	console.log('给 '+who+' 打招呼1')
});
life.on('greet',function(who){
	console.log('给 '+who+' 打招呼2')
});
life.on('greet',function(who){
	console.log('给 '+who+' 打招呼3')
});
life.on('greet',function(who){
	console.log('给 '+who+' 打招呼4')
});
life.on('greet',function(who){
	console.log('给 '+who+' 打招呼5')
});
life.on('greet',function(who){
	console.log('给 '+who+' 打招呼6')
});
life.on('greet',function(who){
	console.log('给 '+who+' 打招呼7')
});
life.on('greet',function(who){
	console.log('给 '+who+' 打招呼8')
});
life.on('greet',function(who){
	console.log('给 '+who+' 打招呼9')
});
life.on('greet',function(who){
	console.log('给 '+who+' 打招呼10')
});
life.on('greet',function(who){
	console.log('一个事件最好不要设置超过10个监听器，超过会有警告 life.setMaxListeners(11)')
});
life.on('eat',function(who){
	console.log('给 '+who+' 上菜')
});

//如果不执行emit则不会触发
//life.emit('greet','Felix')

// 这样也会触发
var hasListener1=life.emit('greet','Felix'); //true

var hasListener2=life.emit('eat','Felix');// true

var hasListener3=life.emit('sleep','Felix');//false

<!-- 结果
给 Felix 打招呼1
给 Felix 打招呼2
给 Felix 打招呼3
给 Felix 打招呼4
给 Felix 打招呼5
给 Felix 打招呼6
给 Felix 打招呼7
给 Felix 打招呼8
给 Felix 打招呼9
给 Felix 打招呼10
一个事件最好不要设置超过10个监听器，超过会有警告 life.setMaxListeners(11)
给 Felix 上菜 -->
```

### 2. 解除事件
removeListener解除事件，解除时候必须携带第二个函数参数。

```js
var EventEmitter=require('events').EventEmitter
var life=new EventEmitter();
life.on('greet',function(who){
  console.log('给 '+who+' 打招呼')
});

function work(){
  console.log('work')
}

life.on('greet',work)

//只是接触了work回调函数的great事件，但是还在监听一个匿名函数的great事件。
life.removeListener('greet',work);


//解除所有的事件
// life.removeAllListeners()

life.emit('greet','Felix'); // 给felix打招呼

console.log(life.listeners('greet').length)//1
console.log(EventEmitter.listenerCount(life,'greet'))//1

```
## fs模块

### 1. fs.stat
fs.stat()可以检查文件类型，文件夹或者文件。
```js
const fs=require('fs');
// stat检查文件 是目录还是文件
fs.stat('test.html',(err,stat)=>{
  if(err){
    console.log(err);
  }else{
    console.log('stat',stat);
    console.log(`test.html是文件---${stat.isFile()}`);
    console.log(`test.html是文件---${stat.isDirectory()}`)
  }
});

stat Stats {
  dev: 864295,
  mode: 33206,
  nlink: 1,
  uid: 0,
  gid: 0,
  rdev: 0,
  blksize: undefined,
  ino: 5348024557537669,
  size: 0,
  blocks: undefined,
  atimeMs: 1550410700349.3103,
  mtimeMs: 1550410700349.3103,
  ctimeMs: 1550410700356.3108,
  birthtimeMs: 1550410700296.7083,
  atime: 2019-02-17T13:38:20.349Z,
  mtime: 2019-02-17T13:38:20.349Z,
  ctime: 2019-02-17T13:38:20.356Z,
  birthtime: 2019-02-17T13:38:20.297Z }
  test.html是文件---true
  test.html是文件---false
```

### 2. fs.mkdir
fs.mkdir() 创建文件夹,如果已经有此路径的文件夹则会报错。
```js

fs.mkdir('newfolder',err=>{
  if(err){
    console.log(err);
  }else{
    console.log('newfolder文件夹创建成功啦');
  }
});

{ [Error: EEXIST: file already exists, mkdir 'F:\codecloude\demo_daily\node\node test\fs\newfolder']
  errno: -4075,
  code: 'EEXIST',
  syscall: 'mkdir',
  path: 'F:\\codecloude\\demo_daily\\node\\node test\\fs\\newfolder' }
```


### 3. fs.writeFile/readFileSync
fs.writeFile()创建一个文件并且写入内容，注意会覆盖原来所有的内容。
```js

const fs=require('fs');
fs.writeFile('newfolder/writeFileTxt.txt','创建一个文件&写入一些内容',err=>{
  if(err){
    console.log(err)
  }else{
    console.log('成功写入文件');
  }
});

```
fs.writeFile()的同步版本,对于小的文件可以使用Buffer这样操作，大的文件推荐流stream
```js
var fs=require('fs')
var sourceBuffer=fs.readFileSync('logo.png')
fs.writeFileSync('writeFileSync_logo.png',sourceBuffer)
```

### 4. fs.appendFile
fs.appendFile追加内容。
```js
const fs=require('fs');
fs.appendFile('newfolder/writeFileTxt.txt','appendFile在追加内容\n',err=>{
  if(err){
    console.log(err)
  }else{
    console.log('追加成功')
  }
});

<!-- 结果
创建一个文件&写入一些内容appendFile在追加内容
appendFile在追加内容
appendFile在追加内容 -->

```
### 5. fs.readFile/readFileSync
fs.readFile读取内容
```js
const fs=require('fs');
fs.readFile('newfolder/writeFileTxt.txt','utf8',(err,data)=>{
  if(err){
    console.log(err);
  }else{
    console.log(data);
  }
});

<!-- 结果
创建一个文件&写入一些内容appendFile在追加内容
appendFile在追加内容
appendFile在追加内容 -->

```

```
### 6. fs.readdir
fs.readdir读取目录， 只读到当前目录的第一层级的文件或者文件夹。如果是文件夹则只读出外层文件名称。
```js
const fs=require('fs');
fs.readdir('newfolder',(err,files)=>{
  if(err){
    console.log(err);
  }else{
    console.log(files);
    //[ '11.js', 'writeFileTxt.txt' ]
  }
});

<!-- 结果
[ '11', '11.js', 'writeFileTxt.txt' ]
-->

```


### 7. fs.rename
fs.rename 既可以给文件夹重命名也可以给文件重命名。
```js
const fs=require('fs');
fs.rename('newfolder/11.js','newfolder/22.js',err=>{
  if(err){
    console.log(err);
  }else{
    console.log('重命名成功');
  }
});

```

### 8. fs.rmdir
fs.mdir 只能删除空的文件夹。
```js
const fs=require('fs');
fs.rmdir('emptyfolder',err=>{
  if(err){
    console.log(err);
  }
});

```

### 9. fs.unlink
fs.unlink 删除文件。
```js
const fs=require('fs');
fs.unlink('test.html',err=>{
  if(err){
    console.log(err);
  }
});

```

### 10. fs.createReadStream
fs.createReadStream以流的形式读取文件。
```js
const fs=require('fs');
const fileReadStream=fs.createReadStream('index.html');
let count=0;
let str='';
fileReadStream.on('data',chunk=>{
  console.log(`第${++count},长度：${chunk.length}`);
  str+=chunk;
});

fileReadStream.on('end',()=>{
  console.log('结束了');
  console.log(count);
});

fileReadStream.on('error',(error)=>{
  console.log(error)
});

```
### 11. fs.createWriteStream
fs.createWriteStream 以流的形式写入文件。
```js
const fs=require('fs');
const data='数据数据';
const writeStream=fs.createWriteStream('createWriteStream.txt');
writeStream.write(data,'utf8');
writeStream.on('finish',()=>{
  console.log('写入成功了');
});
writeStream.on('error',(err)=>{
  console.log(err)
});
console.log("执行完毕");

```

### 12. pipe
pipe管道流，通过读取一个文件并将内容写入到另外一个文件。
```js

const fs=require('fs');
const readStream=fs.createReadStream('index.html');
const writeStream=fs.createWriteStream('pipe.html');
readStream.pipe(writeStream);


```
