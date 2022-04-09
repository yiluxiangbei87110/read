# koa

## http

### 1. Context 
koa提供一个context上下文对象，其中包括了request和response两个对象，用来请求和响应。下面的main函数，通过ctx返回'hello koa'信息，use加载这个函数。在浏览器中输入localhost:3000,就可以在浏览器中看到输出的信息： hello koa。
```js
const koa=require('koa');
const app=new koa();
const main=ctx=>{
	ctx.response.body='hello koa';
}
app.use(main);
app.listen(3000);
```
### 2. Request/Response
通过ctx.response.accepts()可以判断请求希望返回什么类型，然后可以通过ctx.response.type进行设置响应类型。Koa 默认的返回类型是text/plain。
```js
const koa=require('koa');
const app=new koa();
const main=ctx=>{
	if(ctx.request.accepts('xml')){
		ctx.response.type='xml';
		ctx.response.body='<felix>hello xml</felix>'
	} else if(ctx.request.accepts='json'){
		ctx.response.type='json';
		ctx.response.body={type:'json'};
	}else if(ctx.response.accepts('html')){
		ctx.response.type='html';
		ctx.response.body='<div>html type</div>'
	}else if(ctx.response.accepts('text')){
		ctx.response.type='text';
		ctx.response.body='text type';
	}else{
		ctx.response.body='unknow type';
	}
}
app.use(main);
app.listen(3000);
```

## path原生路由
通过ctx.request.path可以判断路径，然后返回响应的内容，这就实现了最基本的原生路由。
```js
const koa=require('koa');
const app=new koa();
const main=ctx=>{
	if(ctx.request.path==='/'){
		ctx.response.type='html';
		ctx.response.body='首页';
	}else if(ctx.request.path=='/hello'){
		ctx.response.body='hello';
	}else{
		ctx.response.body='default';
	}
}
app.use(main);
app.listen(3000);

```
## koa-route
使用第三方模块，koa-route非常方便。
```js
const koa=require('koa');
const app=new koa();
const route=require('koa-route');
const main=ctx=>{
	ctx.response.type='html';
	ctx.response.body='hello main';
}

const about=ctx=>{
	ctx.response.body='about';
}

app.use(route.get('/',main));
app.use(route.get('/about',about));
app.listen(3000);

```
## koa-static
使用koa-static模块，地址栏输入指定目录的静态文件，图片、字体、样式表、脚本，可以在浏览器直接显示。如在地址栏中输入，http://localhost:3000/index.js，则会直接显示出文件内容。
```js
const  koa=require('koa');
const app=new koa();
const path=require('path');
const kstatic=require('koa-static');
const main=kstatic(path.join(__dirname));
app.use(main);
app.listen(3000);
```

