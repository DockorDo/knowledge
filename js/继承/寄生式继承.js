function objFactory(obj){
    const cloneObj = Object.create(obj);
    cloneObj.sayHello = function (){
        return "hello !"
    }

    return obj
}
