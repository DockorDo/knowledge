// 父构造函数
function Father(){
    this.property = true;
    this.colors = ['red','blue','green']
}
// 为父构造函数原型挂载方法
Father.prototype.getSuperValue = function(){
    return this.property
}

// 子构造函数
function Son(){
    this.subProperty = false;
}

// 原型链继承
Son.prototype = new Father();

// 为子构造函数原型添加方法
Son.prototype.getSubValue = function(){
    return this.subProperty;
}

// 构造实例
let instance1 = new Son();

instance1.colors.push("yellow")

let instance2 = new Son();


/**
 *  因为原型链指向父构造函数实例
 *  实例的原型指向父构造函数的原型 
 *  因此可以访问父构造函数的原型方法、父构造函数的属性
*/
console.log(instance2.colors);
console.log(instance2.colors);