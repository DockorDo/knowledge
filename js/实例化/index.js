const __new__ = function(Fn){
    const obj = {};
    obj.__proto__=Fn.prototype;
    Fn.call(obj);
    return obj
}