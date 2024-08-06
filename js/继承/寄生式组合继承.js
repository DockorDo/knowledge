// 先实现一下寄生工厂函数
function inheritPrototype(son,father){
   const prototype = Object.create(father.prototype)
   prototype.constructor = son;
   son.prototype = prototype;
}

// 定义父构造函数
function Father(){
    this.colors = ["red","blue","green"];
    this.prePropertype=true;
}

// 在父构造函数上添加方法
Father.prototype.getColor=function(idx){
    if(idx>=this.colors.length|| +idx)return "null"
    else return this.colors[idx]
}
// 定义子构造函数
function Son(){
    Father.call(this)
    this.subProperty = false
}

// 在子操作原型前先使用寄生工厂函数处理一下原型问题
inheritPrototype(Son, Father);

Son.prototype.getSubProper=function(){
    return this.subProperty;
}

const instance1 = new Son();

instance1.colors.push("yellow");

const instance2 = new Son();

console.log(instance1.colors)
console.log(instance2.colors)
console.log(instance2.getSubProper())
console.log(instance2.getColor(2));