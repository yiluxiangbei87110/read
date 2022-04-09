# 面向对象(Object-Oritented)

## 1. 创建对象

### 1.1 new 关键字形式
```js
 var o1=new Object({name:'felix'});
 // o1  {name: "felix"}

```

### 1.2 对象字面量形式
```js
  var o2={name:'felix'};
  // o1  {name: "felix"}
```

### 1.3 构造函数模式
```js
  var O=function(name){this.name=name};
  var o3=new  O('felix');
  // O {name: "felix"}

  //  instanceof  实例对象的 __proto___ 和 构造函数的prototype是否是指向同一个地址。
  // 只要是这条原型链上的都会返回true.

  o3 instanceof O      // true
  o3 instanceof Object // true

  o3.__proto__===O.prototype  // true
  O.prototype.__proto__===Object.prototype //true
```

### 1.4 Object.create()形式
```js
  var o4=Object.create(p);
  // o4   {} o4为空 
  // o4.name "kangkang"  在原型对象上
  // Object.create(null) 创建的对象是一个空对象，在该对象上没有继承 Object.prototype 
  // 原型链上的属性或者方法,例如：toString(), hasOwnProperty()等方法
```

## 2. new 关键词
```js
var a=new function(){
	return 'aa';
}

var b=new function(){
	return new String('bb')
}

console.log( a); // {}
console.log( b); // String {"bb"}

```
> new 关键词的作用
1. 创建空对象 var obj = {};
2. 设置新对象的__proto__属性指向构造函数的prototype对象 obj.__proto__ = Base.prototype;
3. 使用新对象调用函数，函数中的this被指向新实例对象  Base.call(obj);　　//{}.构造函数();          
4. 将初始化完毕的新对象地址，保存到等号左边的变量中

 ``` js
    varv  obj  = {};
    obj.__proto__ = Base.prototype;
    Base.call(obj);
```

::: tip
1. 构造函数什么都不返回，默认返回实例对象。(构造函数比较特殊)
2. 若构造函数中返回this或返回值是基本类型（number、string、boolean、null、undefined）的值，则返回新实例对象；
3. 若返回值是引用类型的值，则实际返回值为这个引用类型。
:::

```js
function P(){
	this.name='1234'
}
var p1=new P();
// P {name: "1234"}

function P(){
	this.name='1234';
	return this
}
var p1=new P()
//P {name: "1234"}

function P(){
	this.name='1234';
	return true;
}
var p1=new P()
//P {name: "1234"}

function P(){
	this.name='1234';
	return [1,2,3,4,5]
}
var p1=new P()
//[1, 2, 3, 4, 5]

```

> 重新写一个new方法
```js
var new2=function(func){
  var o=Object.create(func.prototype);
  var k=func.call(o);

  if(typeof k ==='object'){
    return k;
  }else {
    return o;
  }
}

var instanc= new2(构造函数);
```

## 2. 对象的属性

ECMAscript中有两种属性，数据属性和访问器属性。
### 2.1 数据属性

| 参数   | 含义    | 默认|
| ------ | -------|----|
| Configurable    | 表示能否通过delete删除属性从而重新定义属性 | true|
| Enumberrable    | 表示能否通过for-in 循环属性 | true|
| Writeable       | 表示能否修改属性的值 | true|
| Value           | 包含这个属性的数据值 | undefined|

```js
'use strict';
var person={};
Object.defineProperty(person,'name',{
  value:'felix',
  writable:false,     // 是否可以修改
  configurable:false  // 是否可以通过delete删除
});
console.log(person.name); // felix

// 严格模式下报错
person.name="Nicholas";
console.log(person.name); // felix

// 一旦设置configruable false，则不可以删除，严格模式下会报错。
// 一旦把某个属性设置为不可配置的，则不能再次修改为可配置，且只能使用writeable属性。
delete person.name;
console.log(person.name); // felix

```


### 2.2 访问器属性

| 参数   | 含义                      | 默认|
| ------ | ------------------------ |----|
| Configurable    | 表示能否通过delete删除属性从而重新定义属性 | true|
| Enumberrable    | 表示能否通过for-in 循环属性 | true|
| Get             | 在读取属性时候调用的函数 | true|
| Set             | 在写入属性时调用的函数 | undefined|

```js
var book={
  _year:2019,
  edition:1
}

Object.defineProperty(book,'year',{
  get:function(){
    return this._year;
  },
  set:function(newYear){
    if(newYear > 2019){
      this._year=newYear;
      this.edition=newYear-2019;
    }
  }
});

book.year=2020;
console.log(book);

```
访问器属性实现一个简单的双向数据绑定

```js
	var obj={
		pwd:'kangkang'
	}
	Object.defineProperty(obj,'name',{
		get:function(){
			console.log('get',this.name);
		},
		set:function(val){
			console.log('set',val);
			// obj.name=val; 这里赋值会死循环
			document.getElementById('val').innerText=val;
		}	
	});
	document.getElementById('username').addEventListener('keyup',function(event){
		obj.name=event.target.value;
	},false);

```
![defineProperty简单双向数据绑定](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/defineproperty.png)

### 2.3 定义多个属性 defineProperties

```js
var book={};
Object.defineProperties(book,{
  _year:{
    value:2019
  },
  edition:{
    value:1
  },
  year:{
    get:function(){
      return this._year;
    },
    // 赋值的时候做些处理
    set:function(newYear){
      if(newYear>2019){
        this._year=newYear;
        this.edition+=newYear-2019;
      }
    }
  }
});

```

### 2.4 读取属性的特性

``` js
console.log(book); 
// {_year: 2019, edition: 1}

var descriptor=Object.getOwnPropertyDescriptor(book,'_year');
console.log(descriptor); 
// value: 2019, writable: false, enumerable: false, configurable: false}

var descriptor=Object.getOwnPropertyDescriptor(book,'year');
console.log(descriptor);
// {get: ƒ, set: ƒ, enumerable: false, configurable: false}

```

## 3. 创建对象的模式

### 3.1 工厂模式

	工厂模式，显示地创建对象，并返回该对象。
  > 工厂模式解决了创建多个对象的问题，但是没有解决对象识别的问题，无法知道一个对象的类型。
  ``` js
	function createPerson(name,age,job){
		var o=new Object();
		o.name=name;
		o.age=age;
		o.job=job;
		return o;
	}
	var person1=createPerson('kangknak',28,'doctor');
	var person2=createPerson('Maria',20,'teacher');
	console.log(person1);
	console.log(person2);
```
### 3.2 构造函数模式 
> 构造函数的问题，每次实例化对象，内部的方法都会被重新创建。虽然可以独立出这个函数，但是变成全局函数后，只能被某个对象调用，有点名不副实。
  ``` js
function Person(name,age,job){
  this.name=name;
  this.age=age;
  this.job=job;
  this.sayName=function(){
    console.log(this.name);
  }
}

var p1=new Person('kangkang',12,'student');
p1.sayName(); // kangkang

var p2=new Person('Maria',20,'doctor');
p2.sayName(); // Maria
console.log(p1.sayName===p2.sayName);  // false
```

### 3.3 原型模式
我们创建的每个函数都有一个 prototype（原型）属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。
> 原型中所有属性是被很多实例共享的，这种共享对于函数、基本属性的值是没问题的，但是一旦是引用类型，将会互相污染。
``` js
	function Person(){

	}
	Person.prototype.name='kangkang';
	Person.prototype.age=12;
	Person.prototype.hobby=[1,2,4];
	Person.sayName=function(){
		console.log(this.name);
	}
	var p1=new Person();
	console.log(p1); // {}
	var p2=new Person();
	console.log(p2); // {}
	console.log(p1.sayName===p2.sayName); // true

	// 实例中重新原型的值，会覆盖原型中的值。查看实例中有便不再网上查找了
	console.log(p1.name); // kangkang
  
	console.log(p1.hasOwnProperty('name')); //false
	p1.name='Maria'; 
	console.log(p1.hasOwnProperty('name')); // true

	console.log(p1.name); // Maria
	console.log(p2.name); // kangkang

	delete p1.name;
	console.log(p1.name); // kangkang

	console.log(p1.hobby); // [1,2,4]
	p1.hobby.push(4);
	console.log(p1.hobby); //  [1, 2, 4, 4]
	console.log(p2.hobby); //  [1, 2, 4, 4]
```
::: tip
1. hasOwnProperty()只在属性存在于实例中时才返回 true.，因此只要 in 操作符返回 true 而 hasOwnProperty()返回 false，就可以确定属性是原型中的属性。
2. in 操作符只要通过对象能够访问到属性就返回 true。 'name' in person1。
3. 在使用 for-in 循环时，返回的是所有能够通过对象访问的、可枚举的（enumerated）属性，其中既包括存在于实例中的属性，也包括存在于原型中的属性。因为根据规定，所有开发人员定义的属性都是可枚举的——只有在 IE8 及更早版本中例外。
:::


###  3.4 组合使用构造函数模式和原型模式
> 可以使用构造函数来定义实例属性，原型模式来定义方法和共享的属性。

``` js
	function Person(name,age,job){
		this.name=name;
		this.age=age;
		this.job=job;
		this.hobby=[1,2,3,4]
	}
	Person.prototype={
		constructor:Person,
		sayName:function(){
			alert(this.name)
		}
	}

	var p1=new Person('kangkang',12,'student');
	var p2=new Person('Maria',22,'doctor');

	console.log(p1); // {name: "kangkang", age: 12, job: "student", hobby: Array(4)}
	console.log(p2); // {name: "Maria", age: 22, job: "doctor", hobby: Array(4)}
	p1.hobby.push(444);
	console.log(p1.hobby); // [1, 2, 3, 4, 444]
	console.log(p2.hobby); // [1, 2, 3, 4]
  console.log(p1.sayName===p2.sayName); // true

```

###  3.5 动态原型模式
> 动态原型模式 为了更好的让oo开发人员熟悉这种原型，产生了动态原型模式。把所有的信息封装在了构造函数里，仅在需要的时候初始化原型,又保持了兼用原型和构造函数的优点。

``` js

function Person(name,age,job){
  this.name=name;
  this.age=age;
  this.job=job;
  if(typeof this.sayName !=='function'){
    Person.prototype.sayName=function(){
      alert(this.name);
    }
  }
}

var p=new Person('kangkknag',3,'student');
p.say();

```

###  3.6 寄生构造函数模式
> 在前几种模式不适用的情况下，我们会使用寄生构造函数模式。这种模式类似于工厂模式（多了new）通常可以为对象添加构造函数。由于不能直接修改Array构造函数，可以使用这种模式。

``` js
  
    function Person(name,age,job){
    	var o=new Object();
    	o.name=name;
    	o.age=age;
    	o.job=job;
    	return o;
    }

    function specialArray(){
    	let values=new Array();
    	// 添加值
    	values.push.apply(values,arguments);

    	values.toPipedString=function(){
    		return this.join('|');
    	}

    	return values;
    }

    var colors=new specialArray('red','blue','pink');
    console.log(colors.toPipedString()); // red|blue|pink

```

###  3.7 稳妥构造函数模式
> 所谓稳妥对象，指的是没有公共属性，而且其方法也不引用 this 的对象。稳妥对象最适合在一些安全的环境中（这些环境中会禁止使用 this 和 new），或者在防止数据被其他应用程序改动时使用。稳妥构造函数遵循与寄生构造函数类似的模式，但有两点不同：一是新创建对象的实例方法不引用 this；二是不使用 new 操作符调用构造函数。

``` js
function Person(name,age,job){
var o=new Object();
o.sayName=function(){
  alert(name);
}
return o;
}

var p=Person('kangkang',12,'student');
p.sayName(); // kangkang

```

## 4. 继承
### 4.1 原型链
1. 只要是原型链中出现过的原型，都可以说是该原型链所派生的实例的原型。
2. 给原型添加方法的代码一定要放在替换原型的语句之后。
3. 在通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这样做就会重写原型链。
4. 子类型原型上的 constructor属性被重写，不手动指定constructor的指向，原型链会出现紊乱。判断一个对象是否是数组arr.constructor===Array。
5. 属性遮蔽

::: warning
1. 引用类型共享会导致污染。
2. 必须手动纠正constructor的指向。
:::

```js
function Parent() {
    this.parentName = 'parent';
    this.colors = ['red', 'green', 'pink'];
}

Parent.prototype.getParentName = function() {
    return this.parentName;
}

function Child() {
    this.childName = 'child';
}

// 此时的getChildName2在会在后面的实例中获取不到

Child.prototype.getChildName2 = function() {
    return this.childName2;
}

// 必须先声明，否则报错。

Child.prototype = new Parent();

// Parent.prototype也有这个getChildName方法，但是访问不了
Child.prototype.getChildName = function() {
    return this.childName;
}

var child = new Child();
console.log(child); // {childName: "child"}
console.log(child.getChildName()); // child

// 查找经过了child实例--> child.prototype-->parent.prototype
console.log(child.getParentName()); // parent

// 只要是原型链中出现过的原型，都可以说是该原型链所派生的实例的原型
console.log(child instanceof Child); // true
console.log(child instanceof Parent); // true
console.log(child instanceof Object); // true

console.log(Object.prototype.isPrototypeOf(child)); // true
console.log(Parent.prototype.isPrototypeOf(child)); // true
console.log(Child.prototype.isPrototypeOf(child)); // true

var child2 = new Child();
console.log(child2.colors); // ["red", "green", "pink"]
child.colors.push('green'); // ["red", "green", "pink", "green"]
console.log(child2.colors); // ["red", "green", "pink", "green"]


//每一个实例也有一个constructor属性，默认调用prototype对象的constructor属性,new Child() 的时候，下面两个都会返回ture。

// 继承了父类的constructor，自己没有则向父类查找
console.log(child.constructor === Parent.prototype.constructor); // true
console.log(child.constructor === Child.prototype.constructor); // true


// 这显然会导致继承链的紊乱（child明明是用构造函数Child生成的），因此我们必须手动纠正，将Child.prototype对象的constructor值改为Child。
// Child.prototype.constructor=Child;
// console.log(child.constructor === Parent.prototype.constructor); // false

//思考？？ Child.prototype=new Parent(); Child.prototype没有自己的constructor，是继承的。
console.log("child.__proto__.constructor === Parent", child.__proto__.constructor == Parent ); // true
console.log("child.__proto__.constructor === Child", child.__proto__.constructor == Child);    // false

```


### 4.2 借用构造函数

1. 借用构造函数这种思想很简单，有个一很大的优势，可以在子类中向父类构造函数里传递参数。
2. 通过使用 apply()和 call()方法在子类执行构造函数的时候，执行父类的构造函数并绑定子类对象，这样每个子类实例都有了自己的colors副本。

::: warning
1. 方法都在构造函数中定义，函数无法复用。 
2. 在父类原型中定义的方法，子类无法继承。
:::

```js
function Parent(){
  this.colors=['red','green','balck'];
}

function Child(){
  // 通过改变this的指向，来实现继承Parent
  Parent.call(this);
}

var child1=new Child();
var child2=new Child();
child1.colors.push('orange');

// 即便是引用类型，依然不会相互影响
console.log(child1.colors); //["red", "green", "balck", "orange"]
console.log(child2.colors); // ["red", "green", "balck"]

child1.say();
// Uncaught TypeError: child1.say is not a function

```

> 借用构造函数可以实现子类向父类传递参数。
``` js
function A(name){
  this.name=name;
}

function B(){
  // 继承了A，同时传递了参数
  A.call(this,'kangkang');
  this.age=12;
}

var b=new B();

console.log(b.name); // kangkang
console.log(b.age);  // 12

```


###  4.3 组合继承 

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为 JavaScript 中最常用的继承模式。而且，instanceof 和 isPrototypeOf()也能够用于识别基于组合继承创建的对象。 

::: warning
实例化对象父类构造函数会执行两次。
:::

```js
function Parent(name){
  this.colors=['red','pink','green'];
  this.name=name;
}

Parent.prototype.sayName=function(){
  console.log(this.name);
}

function Child(name,age){
  // 这一行是关键
  Parent.call(this,name);
  this.age=age;
}

Child.prototype=new Parent();
Child.prototype.constuctor=Child;
Child.prototype.sayAge=function(){
  console.log(this.age);
}
// 缺点：实例化对象户会执行两次
var child1=new Child('kangkang',12);
child1.colors.push('blue'); //["red", "pink", "green", "blue"]
child1.sayName();
child1.sayAge();
console.log(child1.colors);


var child2=new Child('Maria',22);
child2.sayName();
child2.sayAge();
console.log(child2.colors); // ["red", "pink", "green"]

```


### 4.4 直接prototype
::: warning
    child.prototype和parent.prototype指向同一个对象，即便手动修改constructor的指向，另外一个也会跟着修改。
:::

```js
child.prototype=parent.prototype;
```

### 4.5 组合继承使用一个空对象作为连接 :100:


```js
function Parent(){
    this.parentName='parent';
    this.colors=['red','green','pink'];
}
function Child(){
    Parent.call(this);
    this.childName='child'
}
// Object.create实际是一个桥梁，object.create(A),实例化了一个对象a，a__proto__,child5.prototype指向这个对象，这个对象又指向parent5.prototype，即实现一层层查找的关系。
Child.proptotype=Object.create(Parent.prototype);
Child.prototype.constructor=Child;
```
> 和下面的方法类似
```js
　　var F = function(){};

　　F.prototype = Animal.prototype;

　　Cat.prototype = new F();

　　Cat.prototype.constructor = Cat;

```

参考链接[阮一峰](http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html "extend")

参考链接[github](https://github.com/yacan8/blog/blob/master/posts/JavaScript%E5%8E%9F%E5%9E%8B%E4%B8%8E%E5%8E%9F%E5%9E%8B%E9%93%BE%E7%9A%84%E7%90%86%E8%A7%A3.md "extend")

参考链接[github](https://github.com/yygmind/blog/issues/34 "extend")

参考链接[github](https://github.com/mqyqingfeng/Blog/issues/2 "extend")



