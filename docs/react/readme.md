# react
## todolist
###  渲染出列表
1. 书写react组件时，我们需要导入react以及react.Component,这样可以解析jsx语法。
2. react中的render钩子函数是必须的。
3. 构造器第一行需要书写super(props),在ES6中，在子类的constructor中必须先调用super才能引用this,super(props)后可以使用this.props。
4. react中渲染input组件时候，如果不设置defaultVlaue或onchange事件是会报警告的，此时直接在input输入框修改东西是无效的。
5. react16版本开始，新增了Fragment元素，由于render返回的jsx语法结构需要一个根元素，使用Fragment可以让你聚合一个子元素列表，并且不在DOM中增加额外节点。
6. js中的对象是mutable(可变的)的，这样节省了内存，但是由于引用的特性，新的对象的改变可能会影响到旧的对象。react中有个immutable的概念，数据就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable对象。
7. react中的变量使用{}来标记，即便是事件也用{}，这一点和vue有区别，需要注意的是如果一个样式对象，是可以{{}}的，因为里面的本身就是一个对象变量。
8. react中的样式class=>className,onclick=>onClick,ondbclick=>onDoubleClick。
```js
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import Todolist from 'totolist';
ReactDOM.render(<Todolist />, document.getElementById('root'));

```
```js
// totolist.js
import React,{Component,Fragment} from 'react';
class TodoList extends  Component{
    constructor(props){
        super(props);
        this.state={
            inputVal:'做点什么',
            list:[1,2,3,4,5]
        }
    }
    handleAdd(){
        alert(1)
    }
    render(){
        return (
            <Fragment>
                <h1>事项清单</h1>
                <input type='text'   value={this.state.inputVal}  />
                <button onClick={this.handleAdd.bind(this)}>添加</button>
            </Fragment>
            )
    }
}

export default TodoList;

```

### 实现增加删除功能
this绑定的3种方式：
1. construct中手动绑定，如 this.handleChange=this.handleChange.bind(this);
2. 在绑定事件时候 onDoubleClick={this.handelDelete.bind(this,index);
3. 使用箭头函数。
```js
import React,{Component,Fragment} from 'react';
class TodoList extends  Component{
    constructor(props){
        super(props);
        this.state={
            inputVal:'做点什么',
            list:[1,2,3,4,5]
        }
        // 第一种绑定this的方法
        this.handleChange=this.handleChange.bind(this);
    }
    
    // 点击添加，添加事项
    handleAdd(){
        this.setState({
            list:[...this.state.list,this.state.inputVal]
        });
        this.setState({
            inputVal:''
        })

    }

    // 双击删除
    handelDelete(index){
        const list=[...this.state.list];
        list.splice(index,1);
        this.setState({
            list:list
        });
    }

    // input输入框时候，同步消息
    handleChange(event){
        const val=event.target.value;
         this.setState({
                inputVal:val
            });
    }

    render(){
        return (
            <Fragment>
                <h1>事项清单</h1>
                <input type='text' value={this.state.inputVal}  onChange={this.handleChange}/>
                <button onClick={this.handleAdd.bind(this)} >添加</button>
                {
                    this.state.list.map((item,index)=> 
                        <li 
                            key={index} 
                            onDoubleClick={this.handelDelete.bind(this,index)} >{item}
                        </li>
                        )
                }
            </Fragment>
            )
    }
}

export default TodoList;

```

### ref和setState

react中的ref和vue中的ref类似，为直接操作dom提供了预设。setState其实是一个异步的过程(虽然这种说法不全面)。

```js
handleAdd(){
    this.setState(
    (preState)=>({
        list:[...this.state.list,this.state.inputVal]
    }),
    ()=>{console.log('回调打印出长度',this.ulRef.querySelectorAll('li').length)});
    this.setState({
        inputVal:''
    });
    console.log('直接打印出长度',this.ulRef.querySelectorAll('li').length);
    
    // 直接打印出长度 5
    // 回调打印出长度 6
}

```

### 抽离出子组建

```js
<ul ref={ul=>this.ulRef=ul}>
    {
        this.state.list.map((item,index)=>{
            return 
            <TodoItem 
                content={item} 
                key={index} 
                index={index} 
                handleDelete={this.handelDelete.bind(this)}
            ></TodoItem>
        })
    }
</ul>

```

```js 
// 子组件
import React,{Component} from 'react';
class TodoItem extends Component{
    constructor(props){
        super(props);
    }
    handleChildDelete(){
        const {index}=this.props;
        this.props.handleDelete(index);
    }
    render(){
        return <li onDoubleClick={this.handleChildDelete.bind(this)}>{this.props.content}</li>
    }
}

export default TodoItem;
```

### propTypes 

propTypes定义子组件需要接收什么类型的数据，已经设置默认值。
参考链接[propTypes](https://reactjs.org/docs/typechecking-with-proptypes.html 'propTypes')
1. propTypes区分大小写。
2. 这里父组件并没有传递test props参数，但是依然不报错。因为已经设置了defaultProps默认值。

```js
import React,{Component} from 'react';
import PropTypes from 'prop-types';
class TodoItem extends Component{
    constructor(props){
        super(props);
    }
    handleChildDelete(a){
        console.log(a);
        const {index}=this.props;
        this.props.handleDelete(index);
    }
    render(){
        return <li onDoubleClick={this.props.handleDelete.bind(this)}>{this.props.content}</li>
    }
}

TodoItem.propTypes={
    test:PropTypes.string.isRequired,
    content:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    index:PropTypes.index,
    handleDelete:PropTypes.func,
}

TodoItem.defaultProps={
    test:'just test propTypes'
}

export default TodoItem;

```

## redux
### redux基本概念
1. store
store保存数据的地方，整个应用只有一个store。
redux 提供createStore来生成store。

```js
import {createStore} from 'redux';
const store=createStore(reducerFuc)

```

2. state
state可以理解为store某个时刻的快照，可以通过store.getState()获取。 State 对象最好设成只读，要得到新的 State，唯一办法就是生成一个新对象。这样的好处是，任何时候，与某个 View 对应的 State 总是一个不变的对象。

3. action 

view层触发action，然后state才会发生改变。action是一个对象，其中的type属性是必须的，表示action的名称。

```js
const action={
	type:'ADD',
	payload:'add'
}

```

4. reducer
reducer负责生成state，render函数本身是一个纯函数。当reducer函数过多的时候，可以使用combineReducers函数来进行管理.

```js
// import {combineReducers} from 'redux';
const reducerFuc=(state=defaultState,action={}){
	
}

```

### redux 流程
![redux](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/redux.png)

1. 触发action操作，store.dispatch(action);
2. store自动调用reducer，并传入当前state以及action，然后返回新的state。
3. store监听数据变化，store.subscribe(监听函数)，重新渲染view。

```js
function subsribeFunc() {
  let newState = store.getState();
  component.setState(newState);   
}

```
store常用的三个方法。
1. store.getState()
2. store.dispatch()
3. store.subscribe()
### redux demo
```js
// demo.js
import React,{Component,Fragment} from 'react';
import Store from './store/index';
class Todolist extends Component{
    constructor(props){
        super(props);
        // this.state={
        //     name:'kangkang',
        //     age:18
        // }

        this.state=Store.getState();
        // this.handleAddAge=this.handleAddAge.bind(this);

        // 监听store变化并更新state值
        this.handleStoreChange=this.handleStoreChange.bind(this);
        Store.subscribe(this.handleStoreChange);
    }


    handleStoreChange() {
        this.setState(Store.getState());
    }

    handleAdd(){
        const action = {
            type: 'INCREMENT'
        }
        Store.dispatch(action);
    }

    handleSubstract(){
         const action = {
            type: 'DECREMENT',
            val:4
        }
        Store.dispatch(action);
    }

    render(){
        const {name,age}=this.state;
        return (
            <Fragment>
                <div>{name}</div>
                <div onClick={this.handleAddAge}>{age}</div>
                <button onClick={()=>this.handleAdd()}>增加</button>
                <button onClick={()=>this.handleSubstract()}>减少</button>
            </Fragment>
            )
    }
}
export default Todolist;
```

```js
// index.js
import {createStore} from 'redux';
import reducer from './reducer';
const store=createStore(reducer);
export default store;

```


## react-redux

### 为什么需要react-redux
1. 书写更加方便，省去了subscribe显式监听以及store的多次引用。
2. 提供了Provider方法，传入store以后，不管层级多深，容器组件都可以轻松拿到state。
3. 提供了connect方法，用于从 UI 组件生成容器组件。connect的意思，就是将这两种组件连起来。connect(mapStateToProps,mapDispatchToProps)(Component)。
4. mapStateToProps,顾名思义，state映射到props对象。
5. masDispatchToProps，顾名思义，store.dispatch方法映射到props对象。

### react-redux组件分类

1. UI 组件（presentational component）只负责UI的呈现，不带有任何业务逻辑，没有状态（即不使用this.state这个变量），有数据都由参数（this.props）提供，不使用任何Redux的API。
2. 容器组件（container component)。


### react-redux demo
```js
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Store from './33react-redux/store';
import Todolist from './33react-redux/todolist';
const App=
		(
			<Provider store={Store}>
				<Todolist></Todolist>
			</Provider>
		)
	
ReactDOM.render(App,document.getElementById('root'));

```

```js
import React,{Component,Fragment} from 'react';
import {connect} from 'react-redux';
// import Store from './store/index';
class Todolist extends Component{
    constructor(props){
        super(props);
        // this.state={
        //     name:'kangkang',
        //     age:18
        // }
        // this.state=Store.getState();
    }
    render(){ 
    	console.log(this.props);
		// age:18
		// handleAdd:ƒ handleAdd()
		// handleSubstract:ƒ handleSubstract()
		// name:"kangkang"
		// __proto__:Object
        const {name,age,handleAdd,handleSubstract}=this.props;
        return (
            <Fragment>
                <div>{name}</div>
                <div>{age}</div>
                <button onClick={handleAdd}>增加</button>
                <button onClick={handleSubstract}>减少</button>
            </Fragment>
            )
    }
}

// 映射state到props
const mapStateToProps=(state)=>{
	return {
		name:state.name,
		age:state.age
	}
}

// 映射dispatch到props
const mapDispatchToProps=(dispatch)=>{
	return {
		handleAdd(){
	        const action = {
	            type: 'INCREMENT'
	        }
	        dispatch(action);
	    },

	    handleSubstract(){
	         const action = {
	            type: 'DECREMENT',
	            val:4
	        }
	        dispatch(action);
	    }
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(Todolist);

```

## redux-thunk
### 为什么需要redux-thunk 
Action 是由store.dispatch方法发送的,而store.dispatch方法正常情况下，参数只能是对象，不能是函数。对于异步的操作，我们希望可以返回一个函数。redux-thunk最重要的思想，就是可以接受一个返回函数的action creator。如果这个action creator 返回的是一个函数，就执行它，如果不是，就按照原来的next(action)执行。
### redux-thunk demo
```js
// 配合redux开发工具来进行调试
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk';
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const enhancer = composeEnhancers(
    applyMiddleware(thunk),

);
const store = createStore(reducer, enhancer);

export default store;
```
```js
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getFetchData } from './store/testThunk'
class Todolist extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { name, age, handleAdd, handleSubstract,handleTest } = this.props;
        return (
            <Fragment>
                <div>{name}</div>
                <div>{age}</div>
                <button onClick={handleAdd}>增加</button>
                <button onClick={handleSubstract} style={{margin:'0 10px'}}>减少</button>
                <button onClick={handleTest}>异步触发</button>
            </Fragment>
        )
    }
}

// 映射state到props
const mapStateToProps = (state) => {
    return {
        name: state.name,
        age: state.age
    }
}

// 映射dispatch到props
const mapDispatchToProps = (dispatch) => {
    return {
        handleAdd() {
            const action = {
                type: 'INCREMENT'
            }
            dispatch(action);
        },

        handleTest() {
            dispatch(getFetchData());
        },

        handleSubstract() {
            const action = {
                type: 'DECREMENT',
                val: 4
            }
            dispatch(action);
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Todolist);
```

```js
// testThunk.js
export function getFetchData() {
    return dispatch => {
        setTimeout(() => {
            console.log('触发dispatch了');
            dispatch({
                type: 'DECREMENT',
                val: 2
            });
        }, 1000)
    }
}
```

