# RegExp
正则匹配，要么匹配字符要么匹配位置。

常见的字符组
| 字符组         | 具体含义           | 
| ------------- |:-------------|
| \d  |  表示 [0-9]。表示是一位数字。记忆方式：其英文是 digit（数字）。|
| \D  | 表示 [^0-9]。表示除数字外的任意字符。     |  
| \w  | 表示 [0-9a-zA-Z_]。表示数字、大小写字母和下划线。word也称单词字符。      |   
| \W  | 表示 [^0-9a-zA-Z_]。非单词字符。 |  
| \s  |表示 [ \t\v\n\r\f]。表示空白符，包括空格、水平制表符、垂直制表符、换行符、回车符、换页符。   |  
| \S  |表示 [^ \t\v\n\r\f]。 非空白符。space 的首字母。    |   
| .   | 表示 [^\n\r\u2028\u2029]。通配符，表示几乎任意字符。换行符、回车符、行分隔符和段分隔符除外。 |  

常见的量词

| 量词         | 具体含义           | 
| ------------- |:-------------|
| {m,n} | 出现 m到n次。|
| {m,} | {m,} 表示至少出现 m 次。|
| {m}  | {m} 等价于 {m,m}，表示出现 m 次。    |  
| ?    | ? 等价于 {0,1}，表示出现或者不出现。     |   
| +    | 等价于 {1,}，表示出现至少一次。 |  
| *    |* 等价于 {0,}，表示出现任意次，有可能不出现。   |  

```js
a{1,2}b{3,}c{4}d?f+e*
```

![regexp](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/reg0.png)
## 1. 横向模糊匹配

如全局匹配abc字符串，其中b连续出现2-5次。

![regexp](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/reg1.png)
```js
var str="abbcabcabbbbc";
var reg=/ab{2,5}c/g;
str.match(reg);
// ["abbc","abbbbc"]
```
## 2. 纵向模糊匹配

如匹配a1b a2b a3b

![regexp](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/reg2.png)

```js
var str="a,ba1b12ba3ba4ba444b";
var reg=/a[123]b/g;
str.match(reg);
// ["a1b", "a3b"]
```
对于中括号：
1. 表示范围 [123]只能匹配其中的一个。其中[a-z0-9]也可以表示一个范围
2. 可以排除 [^abc]
> 如果想匹配az-三个中一个呢？

要么放在开头，要么放在结尾，要么转义 [az-] [-az] [a\-z]。

> 如果要排除abc呢?

```js
var str="a1ba4ba5b";
var reg=/a[^123]b/g
// ["a4b", "a5b"]
```

## 3.贪婪匹配与惰性匹配

\d{2,5} 默认是贪婪匹配，如果有3个就匹配三个，如果有6个就匹配5个。


```js

var str="123 1234 12345 123456";
var reg=/\d{2,5}/g
str.match(reg);
// ["123","1234","12345","12345"]
```
添加一个？，即可以改变成惰性匹配。/\d{2,5}?/g，如果有2个就匹配2个，大于2个也不再往下尝试了。

```js
var str="123 1234 12345 123456";
var reg=/\d{2,5}?/g
str.match(reg);
// ["12","12","34","12","34","12","34","56"]
```
| 贪婪量词         | 惰性量词           | 
| ------------- |:-------------|
| {m,n} | {m,n}?|
| {m,} | {m,}? |
| {m}  | {m}? |  
| ?    | ??      |   
| +    | +? |  
| *    |  *? |  

## 4.多选分支

如果要多选匹配 (p1|p2|p3),表示分支支持多个子模式，可以任选其一。注意，多线分支匹配是惰性匹配。

![regexp](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/reg4.png)
```js
var str="goodnice";
var reg=/good|nice/g
str.match(reg);
// ["good", "nice"]
```
多选分支匹配是惰性匹配,匹配goodnice时候，直接匹配到了good。

```js
var str="goodgoodnice";
var reg=/good|goodnice/g
str.match(reg);
// ["good", "good"]
```
如果希望匹配到goodnice的话，上面的匹配模式直接调换一下位置就行了。var reg=/goodnice|/good/g

## 5. 匹配测试
1. 匹配十六进制 

十六进制一般的形式是： #2f2 #ccc #222 #12fd12 
```js
 var reg=/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})/
```
 ![regexp](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/reg5.1.png)

2. 匹配24小时制

24小时制一般是 01:12  23:59,分的第一位为0-5，分的第二位为0-9。时的第一位为0-2，如果第一位为0-1则第二位为0-9，如果第一位为2，则第二位为0-3.
```js
var reg=/^([01][0-9]|[2][0-3]):[0-5][0-9]$/ 
```


![regexp](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/reg5.2.png)

如果要求匹配7:9,也就是前面的0可以省略
```js
var reg=/^(0?[0-9]|1[0-9]|[2][0-3]):(0?[0-9]|[1-5][0-9])$/;
```
![regexp](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/reg5.3.png)

3.  匹配日期YYYY-MM-DD

如匹配2018-09-11
```js
var reg=/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/g
```
![regexp](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/reg5.4.png)

4. 匹配id

```js
// <div id="container" class="main"></div>
var str='<div id="container" class="main"></div>';
var reg=/id=".*"/
// id="container" class="main"

```
.本身就能匹配双引号，*又是贪婪匹配直接匹配到最后一个双引号,常用的两种解决方式。

```js
// 方式1 惰性匹配
var reg=/id=".*?"/
// 方式2 解决惰性匹配回溯的问题
var reg=/id="[^"]*"/
```
## 6. 匹配位置 ^ $ \b \B (?=p) (?!p)

1. ^(脱字符)和$匹配开始和结束位置。
```js
'hello'.replace(/^|$/g,'#')
// "#hello#"
'hello'.replace(/^|$/,'#')
// "#hello"
'i\nlove\njs'.replace(/^|$/gm,'#')
/*
"#i#
#love#
#js#"
*/
```

2. \b \B

\b匹配单词边界，包括\w和^、 \w和$ 、 \w和\W之间的位置。

```js
'[]lesson_01.mp4'.replace(/\b/g,'#')
// "[]#lesson_01#.#mp4#"
'[]lesson_01.mp4'.replace(/\B/g,'#')
// "#[#]l#e#s#s#o#n#_#0#1.m#p#4"

```

3. (?=p) (?!p) 正向先行断言和负向先行断言

?=l即l前面的位置

```js
'hello'.replace(/(?=l)/g,'#')
// "he#l#lo"
'hello'.replace(/(?!l)/g,'#')
// "#h#ell#o#"
```

可以把位置理解为空字符串

```js
// hello ===''+''+'hello'+''
var result = /^^hello$$$/.test("hello");
console.log(result);
// => true
```

5. 数字千位分隔符

```js
'123456789'.replace(/(?=\d{3})/g,',')
// ",1,2,3,4,5,6,789"

'123456789'.replace(/(?=\d{3}$)/g,',')
// "123456,789" 最后三位数前加，

// '123456789'.replace(/(?=((\d{3})+$))/g,',')
",123,456,789" //  从后往前数，一旦是三的倍数，前加，这也导致了第一位加了一个，。

// （?!^）排除第一个
'123456789'.replace(/(?!^)(?=((\d{3})+$))/g,',')
"123,456,789"

```

'12345678 123456789' 要求当前是一个位置，但不是 \b 前面的位置，其实 (?!\b) 说的就是 \B。因此最终正则变成了：/\B(?=(\d{3})+\b)/g。

```js
'12345678 123456789'.replace(/(?!\b)(?=(\d{3})+)/g,',')
//"1,2,3,4,5,678 1,2,3,4,5,6,789"  
// 后面的\b在这里有神作用
'12345678 123456789'.replace(/(?!\b)(?=(\d{3})+\b)/g,',')
//"12,345,678 123,456,789"
'12345678 123456789'.replace(/\B(?=(\d{3})+\b)/g,',')
// "12,345,678 123,456,789"

function format (num) {
return num.toFixed(2).replace(/\B(?=(\d{3})+\b)/g, ",").replace(/^/, "$$ ");
};
console.log( format(1888) );
// => "$ 1,888.00"

```
![regexp](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/reg5.5.png)

