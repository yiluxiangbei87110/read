# vue

## 1. 组件通信
在单页面开发中，组件通信是一个问题。vuejs中，常用的通信方式有一下几种。

1. $refs 给元素或者组件添加一个ref钩子，通过$refs.ref可以直接调用，在跨级通信时是有弊端。
2. $parent/$children 访问父子元素信息，在跨级通信时是有弊端。
3. Bus 另外new出一个vue实例，然后通过bus.$emit、bus.$on、bus.$off来进行相应的处理。
4. vuex 
5. provide inject 

在父组件里provide一个变量，子组件inject以后，子组件可以使用provide的值。

```vue
<template>
	<div>
		<h2>父组件</h2>
		<testProvideInject2></testProvideInject2>
	</div>
</template>
<script>
	import testProvideInject2 from './testProvideInject2'
	export default{
		// 1. 直接返回一个字符串
		// provide:{
		// 	name:'kangkang',
		// },

		// 2. 返回一个实例对象
		provide(){
			return {
				app:this
			}
		},
		data(){
			return {
				hobby:'read'
			}
		},
		methods:{
			parentmethod(){
				alert('this is parent\'s method')
			}
		},
		components:{
			testProvideInject2
		}
	}
</script>

```
子组件拿到了父组件的实例，也可以使用调用父组件的方法，但是基本数据类型并不是响应的。某些情况下，provede/inject 完全可以取代vuex的作用。

```vue
<template>
	<div>
		<h2>子组件拿到了父组件的值</h2>
		<span>{{app.hobby}}</span>
	</div>
</template>
<script>
	export default{
		inject:['app'],
		mounted(){
			// console.log(this.name);
			console.log(this.app.hobby);
			console.log(this.app.$data.hobby);
			console.log(this.app.parentmethod());
		}
	}
</script>
```

## 2. mixin混入
混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。
1. 混入会将选项进行合并，一旦冲突，组件优先。
2. 混入的生命周期钩子要优先于组件的钩子。
3. 混入只支持script部分混入。
4. 一旦使用全局混入对象，将会影响到所有之后创建的 Vue 实例。

```vue
<template>
	<div>哈哈哈</div>
</template>
<script>
	export default{
		data(){
			return {
				name:'混入的name',
				age:'混入的age'
			}
		},
		methods:{
			sayName(){
				console.log('混入的方法')
			}
		},
		created(){
			console.log('混入的created生命周期')
		}
	}
</script>

```
```vue
<template>
	<div>
		<h3>测试mixin</h3>
		<div>{{name}}</div>
		<div>{{age}}</div>
		<div>{{read}}</div>
	</div>
</template>
<script>
	import testMixin1 from './testMixin1.vue';
	export default{
		mixins:[testMixin1],
		data(){
			return {
				name:'自身的name会替代',
				read:'自身的read'
			}
		},
		methods:{
			sayName2(){
				console.log('自身的的方法')
			}
		},
		created(){
			this.sayName();
			this.sayName2();
			console.log('自身的created生命周期')
		}
	}
</script>
```


## 3. Button组件
一个组件通常由prop、slot、event来组成。下面将有一个简单的button组件，我们可以通过props的size、disabled值的传递来进行动态修改button，同时还支持插槽功能以及自定义事件功能。
1. props是单向数据流，如果我们想要修改，只能通知父组件进行修改，自己不能修改。
2. validator验证props的格式并且返回一个布尔值，如果返回false，则会有warning提示。
3. 默认slot插槽和具名slot插槽配合可以方便插入内容。
4. native修饰符会触发原生事件，如@click.native 触发原生click事件而不是自定义on-click事件。
5. 子组件$emit一个事件，会在父组件进行监听。事实上子组件本身也是可以通过$on来进行监听的。

> button组件部分
``` vue
<template>
  <div>
    <c-button size="large" :disabled="disabled" @on-click="handleCustomClick">
      <span slot="icon">icon图标</span>
      <span>自定义button</span>
    </c-button>
  </div>
</template>
<script>
  import Button from '../components/Button2.vue';
  export default{
    data(){
      return {
        disabled:false
      }
    },
    components:{
      'c-button':Button
    },
    methods:{
      handleCustomClick(e){
        console.log(e);
      }
    }
  }
</script>
```

```vue
<template>
    <div>
        <button :class="'button-'+size" :disabled="disabled" @click="handleClick">
            <slot name="icon"></slot>
            <slot></slot>
        </button>
    </div>
</template>
<script>
function oneOf(val,arr){
	for(let i=0;i<arr.length;i++){
		if(arr[i]===val){
			return true;
		}
	}
	return false;
}
export default {
    props: {
        size: {
        	// 必须是其中的一个，否则报warning
            validator(value) {
                return oneOf(value, ['default', 'small', 'large'])
            },
            default: 'default'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods:{
    	handleClick(event){
    		this.$emit('on-click',event);
    	}
    }
}
</script>
<style scoped>
	.button-default {
		width: 100px;
	}

	.button-small {
		width: 60px;
	}

	.button-large {
		width: 200px;
	}
</style>


```

## 3. dispatch&broadcast
实现两个方法，dispatch和broadcast。dispatch向上派发查找，broadcast详细广播，二者皆依赖组件名称进行查找。
> emitter.js
```js 
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name;
    if (name === componentName) {
      // child.$emit.apply(child, [eventName].concat(params));
      child.$emit(eventName,params);
    } else {
      // 改变this的指向，下次直接从当前child的子组件里进行过滤组件
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
// 元素往上查找很容易，往下查找子元素太多，需要递归。
export default {
  methods: {
    // dispatch向上派发
    dispatch(componentName, eventName, params) {
      console.log('从子元素开始'+this.$options.name)
      console.log(this)
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent) {
        //parent.$emit.apply(parent, [eventName].concat(params)); 没必要apply了
        parent.$emit(eventName,params);
      }
    },
    // broadcast向下广播
    broadcast(componentName, eventName, params) {
      console.log('从父元素开始'+this.$options.name)
      console.log(this)
      broadcast.call(this, componentName, eventName, params);
    }
  }
};

```
> 示例
```vue
<template>
  <div class="componentA">
    <div><button @click="handleClick">componentA</button></div>
    <ComponetB></ComponetB>
  </div>
</template>

<script>
import ComponetB from './componentB.vue'
import Emitter from '../emitter.js'
export default {
  name: 'componentA',
  mixins:[Emitter],
  components: {
    ComponetB
  },
  methods:{
    handleClick(){
      this.broadcast('componentB', 'on-message', 'componentA=>componentB');
    },
    showParentMessage(text){
      alert(text)
    }
  },
  mounted(){
    this.$on('on-parent-message',this.showParentMessage);
    this.$on('on-componentA-message',this.showParentMessage);
  }
}
</script>
<style scoped>
  div{
    margin:10px 0;
  }
</style>
```

## 4. async-validator
参考链接[example link](https://github.com/yiminghe/async-validator "async-validator").
```vue
<template>
	<div>
		<h1>测试async-validator</h1>
		<div>{{msg}}</div>
	</div>
</template>
<script>
	import AsyncValidator from 'async-validator';
	export default {
	    name: 'testAsyncValidator',
	    data(){
	    	return {
	    		msg:''
	    	}
	    },
	    mounted() {
	        const rule = {
	            name: [{
	                type: 'string',
	                required: true
	            },{
	            	min:3,
	            	max:10,
	            	message:'3到10个字符'
	            }]
	        }
	        const data = {
	            name: ''
	        }

	        const validator = new AsyncValidator(rule);
	        validator.validate(data, (errors, fields) => {
	            this.msg=JSON.stringify(errors); // [{"message":"name is required","field":"name"}]
	        });
	    }
	}
</script>

```

## 5. 实现一个单选框
1. 语法糖v-model的使用
2. 父组件props值修改后，子组件的watch监听。
```vue
// test.vue
<template>
	<div>
		<selfCheckbox 
			:disabled='false'  
			v-model="value" 
			trueValue="选中" 
			falseValue="未选中">
		</selfCheckbox>
		<div>{{value}}</div>
	</div>
</template>
<script>
	import selfCheckbox from './checkbox';
	export default{
		components:{
			selfCheckbox
		},
		data(){
			return {
				value:'未选中'
			}
		},
		mounted(){
			// 测试父组件修改后，子组件能否及时响应
			setTimeout(()=>{
				this.value="选中"
			},1000);
		}
	}
</script>
```

```vue
// checkbox.vue
<template>
	<label>
		<span>
			<input 
			type="checkbox" 
			:checked="currentValue" 
			:disabled="disabled"
			@change="handleChange"
			/>
		</span>
		<slot></slot>
		<span>{{currentValue}}</span>
	</label>
</template>
<script>
	export default{
		name:'checkbox',
		data(){
			return {
				// value 被定义为 prop，它只能由父级修改，本身是不能修改的
				// currentValue 只关心当前是否选中，true或者false。
				currentValue:this.value===this.trueValue
			}
		},
		props:{
			value:{
				type:[String,Number,Boolean],
				default:false
			},
			disabled:{
				type:Boolean,
				default:false
			},
			trueValue:{
				type:[String,Number,Boolean],
				default:true
			},
			falseValue:{
				type:[String,Number,Boolean],
				default:false
			}
		},
		methods:{
			handleChange(event){
				if(this.disabled){
					return;
				}
				const checked=event.target.checked;
				this.currentValue=checked;
				const value=checked ? this.trueValue : this.falseValue;
				// 父组件及时更新
				this.$emit('input',value);
				// this.$emit('on-change',value);
			},

			// 父组件传递到value一旦发生变化，子组件需要及时更新，所以需要watch
			updateVal(){
				this.currentValue=this.trueValue===this.value;
			}
		},
		watch:{
			value(val){
				if(val!==this.trueValue && val!==this.falseValue){
					throw 'Value should be trueValue or falseValue.'
				}else{
					this.updateVal();
				}
			}
		}
	}
</script>

```



## 6. inputNumber组件
1. 父组件传递过来value有可能是不符合当前条件的，所以在methods里写了个方法updateValue方法用来过滤正确的值。
2. watch监听数据，让子组件和父组件的值一旦发生变化，让二者及时更新。
3. this.$emit('input',val);调用v-mode的语法糖，通知父组件更新。
4. 在生命周期mounted的时候，过滤一下数据。

![图片地址](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/vue.inputnumber.gif "vue-component")
```vue
<template>
    <div>
        <p>父元素的值 {{value}}</p>
        <Button @click='handleUpdate'>修改父元素的值 +1</Button>
        <inputNumber v-model='value'/>
    </div>
</template>
<script>
import inputNumber from '@views/vue/components/input-number'
export default {
    name:'test-input-number',
    components:{
        inputNumber
    },
    methods:{
        handleUpdate(){
            this.value+=1;
        }
    },
    data(){
        return {
            value:12
        }
    }
}
</script>

```
```vue
// 子组件

<template>
  <div>
    <p>currentvalue {{currentValue}}</p>
    <input
      type='number'
      :value='currentValue'
      @change='handleChange'
    />
    <button @click='handleAdd'> + </button>
    <button @click='handleReduce'> - </button>
  </div>
</template>
<script>
export default {
  name: 'input-number',
  props: {
    min: {
      type: Number,
      default: -Infinity
    },
    max: {
      type: Number,
      default: Infinity
    },
    // v-model语法糖便利，父元素绑定的model，子元素定义的porps value相对应。
    value: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 如果不适用props声明value，则打印不出父组件的值12，将会打印出undefined
    console.log(this.value)
  },
  watch: {
    // 为什么不会死循环 ????
    currentValue(val) {
      console.log('currentValue,val', val)
      this.$emit('input', val)
    },
    value(val) {
      this.updateValue(val)
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  methods: {
    updateValue: function (val) {
      if (val > this.max) val = this.max;
      if (val < this.min) val = this.min;
      this.currentValue = val;
    },
    handleAdd() {
      if (this.currentValue >= this.max) return
      this.currentValue += 1;
    },
    handleReduce() {
      if (this.currentValue <= this.min) return
      this.currentValue -= 1;
    },
    handleChange(e) {
      let val = e.target.value.trim();
      const max = this.max;
      const min = this.min;
      if (!isNaN(val)) {
        if (val > max) {
          this.currentValue = max
        } else if (val < min) {
          this.currentValue = min;
        } else {
          this.currentValue = Number(val);
        }
      } else {
        e.target.value = currentValue;
      }
    }
  },
  mounted() {
    this.updateValue(this.value)
  }
}
</script>

```

## 7. tabs组件
![图片地址](https://felix-1251738024.cos.ap-guangzhou.myqcloud.com/blog/vue.tabs.gif "vue-component")
```vue
<template>
  <div>
    <Button @click='handleChangeLabel'>修改父元素的labe值</Button>
    <Button @click='handleChangeName'>修改父元素的name值</Button>
    <p>父组件的v-model值 {{selectedPanelName}}</p>
    <Tabs1 v-model='selectedPanelName'>
      <Panel1
        label='label1'
        name='name1'
      >
        11在苍茫的 大海寺接口尖峰时刻大嫁风尚看风景
      </Panel1>

      <Panel1
        label='label2'
        name='name2'
      >
        22在苍茫的 大海寺接口尖峰时刻大嫁风尚看风景
      </Panel1>

      <Panel1
        label='label3'
        name='name3'
      >
        33在苍茫的 大海寺接口尖峰时刻大嫁风尚看风景
      </Panel1>

      <Panel1
        :label='testLabel'
        name='name4'
      >
        33在苍茫的 大海寺接口尖峰时刻大嫁风尚看风景
      </Panel1>
    </Tabs1>
    <p>1.v-model的使用 </p>
    <p>2. $parent $children的使用 </p>
    <p>3. watch的使用 </p>
    <p>4.重要的是父组件获取子组件并且修改子组件的值。this.$children.[0].$options可以拿到子组件的所有数据，包括组件名，data数据，porps数据以及computed数据。
      也意味着可以通过父组件查询子组件直接修改子组件的数据，例如，修改show，让子组件显示或者隐藏。
    </p>
  </div>
</template>
<script>
import Tabs1 from '@views/vue/tabs/tab'
import Panel1 from '@views/vue/tabs/panel'
export default {
  name: 'tab-component',
  components: {
    Tabs1,
    Panel1
  },
  data() {
    return {
      testLabel: 'label4',
      selectedPanelName: 'name2'
    }
  },
  methods: {
    handleChangeLabel() {
      this.testLabel = Date.now().toString();
    },
    handleChangeName() {
      this.selectedPanelName = 'name4'
    }
  }
}
</script>

```

```vue
// tab
<template>
  <div>
    <div class="tabs-bar">
      <span
        :class="{'active':acticeClsIndex===index}"
        v-for='(item,index) in navList'
        :key='index'
        @click='handleChangePanel(index)'
      >{{item.label}}
      </span>
    </div>
    <div class='tabs-content'>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tab',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      navList: [],
      acticeClsIndex:'-1',
      isActive:true
    }
  },
  methods: {
    // panle是tab的子组件，可以从tab里直接过滤children来进行查找。
    // 直接打印this.$children[0].$options还找不出name选项，直接打印却有。
    getPanels() {
      return this.$children.filter(item => item.$options.name === 'panel')
    },

    // 点击panel title，切换panel
    handleChangePanel(selectedIndex) {
      this.getPanels().forEach((panel, index) => {
        selectedIndex === index ? panel.show = true : panel.show = false;
      });
      // 设置panel选中项
      this.acticeClsIndex=selectedIndex;
      // 更新父元素选中项
      this.$emit('input',this.getPanels()[selectedIndex].name)

    },
    // 初始化panel的数据
    initPanelData() {
      this.navList=[];
      let selectdIndex = -1;
      this.getPanels().forEach((item, index) => {
        if (item.name === this.value) {
          selectdIndex = index;
        }
        this.navList.push({
          name: item.name,
          label: item.label
        })
      });
      // 如果刚打开没有设置选中panel的name值，则默认选中第一个。
      this.handleChangePanel(selectdIndex === -1 ? 0 : selectdIndex);
    }
  },
  mounted() {
       this.initPanelData();
  },
  watch:{
      value(){
            this.initPanelData();
      }
  }
}
</script>
```

```vue
// panel
<template>
  <div
    class='panel'
    v-show='show'
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'panel',
  data() {
    return {
      show: true
    }
  },
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  watch:{
      label(){
          this.$parent.initPanelData()
      }
  }
}
</script>

```