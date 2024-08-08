Function.prototype.__call__ = function(_this = globalThis,...args){
    const symName = Symbol(this.name)
    _this[symName]=this;
    _this[symName](...args);
    delete _this[symName]
}

Function.prototype.__apply__ = function(_this,args){
    const symName = Symbol(this.name)
    _this[symName]=this;
    _this[symName](...args);
    delete _this[symName]
}

Function.prototype.__bind__ = function(_this,...args){
    return ()=>{
        const symName = Symbol(this.name)
        _this[symName]=this;
        const res = _this[symName](...args);
        delete _this[symName];
        return res
    }
}



function test(ttt){
    console.log(this.name);
    console.log(ttt)
}

const obj={
    name:'dodo'
}

const newFn = test.__bind__(obj,["test"]);
console.log(newFn())
