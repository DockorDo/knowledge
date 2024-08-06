function Father(){
    this.colors = ["red", "blue", 'green'];
}


function Son(){
    // 子构造函数盗用构造函数继承父构造函数
    Father.call(this);
}


const instance1 = new Son();
const instance2 = new Son();
instance1.colors.push("yellow")

console.log(instance1.colors)
console.log(instance2)