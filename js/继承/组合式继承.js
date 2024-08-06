// 父构造函数
function Father(){
    this.colors = ["red","blue","green"];
    this.prototype = true
}

// 在父-原型上声明方法
Father.prototype.getPrototype = function(){
    return this.prototype;
}

// 子构造函数
function Son(){
    // 盗用构造函数继承
    Father.call(this);
    this.subProperty = false
}

// 原型链继承
Son.prototype = new Father()

Son.prototype.constructor=Son;

// 在子-原型上添加方法
Son.prototype.getSubPrototype= function(){
    return this.subProperty
}

const instance1 = new Son();
instance1.colors.push("yellow")

const instance2 = new Son();

console.log(instance1.colors)
console.log(instance2.colors)
console.log(instance2.getPrototype())

console.log(instance1.constructor.name)