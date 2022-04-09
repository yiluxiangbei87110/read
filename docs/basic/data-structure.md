# 数据结构 data-structure

## 1. 栈

### 1.1 什么是栈

栈是一种遵从先进后出 (LIFO / Last In First Out ) 原则的有序集合；新添加的或待删除的元素都保存在栈的末尾，称作栈顶，另一端为栈底。在栈里，新元素都靠近栈顶，旧元素都接近栈底。
通俗来讲，一摞叠起来的书或盘子都可以看做一个栈，我们想要拿出最底下的书或盘子，一定要现将上面的移走才可以。

### 1.2 模拟栈

```js
  function Stack() {
        var items = [];
        // 入栈
        this.push = function(element) {
            items.push(element)
        }
        // 出栈
        this.pop = function() {
            return items.pop();
        }
        // 查看栈顶元素
        this.peek = function() {
            return items[items.length - 1]
        }
        this.isEmpty = function() {
            return items.length === 0;
        }
        this.clear=function(){
          items=[];
        }
        this.size = function() {
            return items.length;
        }
        this.print = function() {
            console.log(items.toString())
        }
    }

```

### 1.3 进制转换

#### 1.3.1 二进制转换 
```js
   // 对于任何一种进制---X进制，就表示每一位置上的数运算时都是逢X进一位。 十进制是逢十进一，十六进制是逢十六进一，二进制就是逢二进一，以此类推，x进制就是逢x进位。
    function divideBy2(decNumber) {
        var stack = new Stack(),
            rem, binaryString = '';
        while (decNumber > 0) {
            rem = Math.floor(decNumber % 2);
            stack.push(rem);
            decNumber = Math.floor(decNumber / 2);
        }
        // 反转
        while (!stack.isEmpty()) {
            console.log(stack.print())
            binaryString += stack.pop().toString();
        }
        return binaryString;
    }

```

#### 1.3.2 10进制转其他进制
```js
    function baseConvert(number, base) {
        var stack = new Stack();
        var rem, baseString = '', digists = '0123456789ABCDEF';
        while (number > 0) {
            rem = Math.floor(number % base);
            stack.push(rem);
            number = Math.floor(number / base);
        }
        while (!stack.isEmpty()) {
            baseString += digists[stack.pop()].toString();
        }
        return baseString;
    }
    baseConvert(100345, 8);

```


## 2. 队列

### 2.1 什么是队列

队列是一种遵循先进先出 (FIFO / First In First Out) 原则的一组有序的项；队列在尾部添加新元素，并从头部移除元素。最新添加的元素必须排在队列的末尾,最常见的就是排队。

### 2.2 模拟队列

```js
    function Queue() {
        var items = [];
        // 入队
        this.enqueue = function(element) {
            items.push(element)
        }
        // 出队
        this.dequeue = function() {
            return items.shift();
        }
        this.front = function() {
            return items[0]
        }
        this.isEmpty = function() {
            return items.length === 0;
        }
        this.clear = function() {
            items = [];
        }
        this.size = function() {
            return items.length;
        }
        this.print = function() {
            console.log(items.toString())
        }
    }
```

### 2.3 常见队列

#### 2.3.1 优先队列

```js
      // 优先队列 机场登机  如果优先级高则放在前面，如果最小放在最后
    function PriorityQueue() {
        var items = [];
        function QueueElement(element, priority) {
            this.element = element;
            this.priority = priority;
        }
        this.front = function() {
            return items[0]
        }
        this.isEmpty = function() {
            return items.length === 0;
        }
        this.clear = function() {
            items = [];
        }
        this.size = function() {
            return items.length;
        }
        this.print = function() {
            console.log(items)
        }
        this.dequeue = function() {
            items.shift();
        }
        this.enqueue = function(element, priority) {
            var queueElement = new QueueElement(element, priority);
            if (this.isEmpty()) {
                items.push(queueElement);
            } else {
                var added = false;
                for (var i = 0; i < items.length; i++) {
                    if (queueElement.priority < items[i].priority) {
                        items.splice(i, 0, queueElement);
                        added = true;
                        break;
                    }
                }
                if (!added) {
                    items.push(queueElement);
                }
            }
        }
    }
    var priorityQueue = new PriorityQueue();
    priorityQueue.enqueue('kangkang1', 2);
    priorityQueue.enqueue('kangkang2', 1);
    priorityQueue.enqueue('kangkang3', 2);
    priorityQueue.enqueue('kangkang4', 26);
    priorityQueue.print();
    // {element: "kangkang2", priority: 1}
    // {element: "kangkang1", priority: 2}
    // {element: "kangkang3", priority: 2}
    // {element: "kangkang4", priority: 26}
```

#### 2.3.2 循环队列

```js
    // 循环队列 改变元素的位置 。击鼓传花 大家围一个圈，然后报数字，如果报的数字和预期的一致，则被淘汰,直至剩最后一个人。
    function hotPotato(namelist, num) {
        var queue = new Queue();
        for (var i = 0; i < namelist.length; i++) {
            queue.enqueue(namelist[i]);
        }
        var eliminated = '';
        while (queue.size() > 1) {
            for (var i = 0; i < num; i++) {
                queue.enqueue(queue.dequeue())
            }
            var eliminated = queue.dequeue();
            console.log(eliminated + '被淘汰了')
        }
        return queue.dequeue();
    }
    var winner = hotPotato(['kangkna1', 'kangkna2', 'kangkna3', 'kangkna4', 'kangkna5'], 7);
    console.log('胜利者是' + winner);
    // kangkna3被淘汰了
    // kangkna2被淘汰了
    // kangkna5被淘汰了
    // kangkna4被淘汰了
    // 胜利者是kangkna1

```