
const PROMISE_STATUS={
    PROMISE_PENDDING:"pendding",
    PROMISE_FULFILLED:"fulfilled",
    PROMISE_REJECTED:"rejected"
}

let errorMsg;
class MyPromise{
    constructor(executor){
        errorMsg = []
        // 边界判断
        if(typeof (new.target) === "undefined"  ){
            errorMsg.push("Promise constructor cannot be invoked without 'new'")
        }else if( typeof executor !== "function"){
            errorMsg.push("Promise resolver undefined is not a function")
        }
        if(errorMsg.length){
            const error = new TypeError(errorMsg[0]);
            return console.error(error)
        }
        this.__proto__[Symbol.toStringTag] = "Promise"

        this.PromiseState = PROMISE_STATUS.PROMISE_PENDDING;
        this.PromiseResult = undefined;
        this.reason = undefined;

        this.fulfilledList = [];
        this.rejectedList = [];
        this.finallyList = [];
        try{
            executor(MyPromise._resolve.bind(this),MyPromise._reject.bind(this))
        } catch(error) {
            if(this.rejectedList.length){
                MyPromise.reject.bind(this)   
            }else throw error;
        }
    }

    then(onFulfilled,onRejected){
        return new MyPromise((resolve,reject)=>{
            if(this.PromiseState === PROMISE_STATUS.PROMISE_FULFILLED){
                try{
                    resolve(typeof onFulfilled==="function" ? onFulfilled(this.PromiseResult) : PromiseResult)
                }catch(err){
                    reject(err.message)
                }
            }
             if(this.PromiseState === PROMISE_STATUS.PROMISE_REJECTED){
                try{
                    resolve(typeof onRejected==="function" ? onRejected(this.PromiseResult) : PromiseResult)
                }catch(err){
                    reject(err.message)
                }
            }
          
            if(this.PromiseState === PROMISE_STATUS.PROMISE_PENDDING){
                this.fulfilledList.push(()=>{
                    try {
                        resolve(typeof onFulfilled === "function"?onFulfilled(this.PromiseResult):this.PromiseResult)
                    } catch (error) {
                        reject(error.message)
                    }
                })
                this.rejectedList.push(()=>{
                    try {
                        resolve(typeof onRejected === "function"?onRejected(this.PromiseResult):this.PromiseResult)
                    } catch (error) {
                        reject(error.message)
                    }
                })
            }
        })
    }

    catch(onRejected){
        return new MyPromise((resolve,reject)=>{
            if(this.PromiseState === PROMISE_STATUS.PROMISE_PENDDING){
                this.rejectedList.push(()=>{
                    try {
                        resolve(typeof onRejected==="function"?onRejected(this.PromiseResult):this.PromiseResult)
                    } catch (err) {
                        throw err;
                    }
                })
            }
            if(this.PromiseState === PROMISE_STATUS.PROMISE_REJECTED){
                try{
                    this.rejectedList.push(()=>{
                        resolve(typeof onRejected === "function"?onRejected(this.PromiseResult):undefined)
                    })
                } catch(err){
                    throw err
                }
            }
        })
    }

    finally(onFinallyCB){
        if(this.PromiseState === PROMISE_STATUS.PROMISE_PENDDING){
            this.finallyList.push(onFinallyCB);
        }
        if([PROMISE_STATUS.PROMISE_FULFILLED,PROMISE_STATUS.PROMISE_REJECTED].includes(this.PromiseState)){
            onFinallyCB();
        }
    }

    static all(iteratorObj){
        if([undefined,null].includes(iteratorObj)||typeof iteratorObj[Symbol.iterator] !== 'function'){
            switch(iteratorObj){
                case undefined:throw new TypeError("undefined is not iterable (cannot read property Symbol(Symbol.iterator))")
                case null: throw new TypeError("object null is not iterable (cannot read property Symbol(Symbol.iterator))")
                default:throw new TypeError(`${typeof iteratorObj} is not iterable (cannot read property Symbol(Symbol.iterator))`)
            }
        }
        return new MyPromise((resolve,reject)=>{
            const arr = [];
            for(let i =0;i<iteratorObj.length;i++){
                iteratorObj[i].then((res)=>{
                    arr[i] = res;
                },
                (reson) => {
                    reject(reson)
                })
            };
            resolve(arr)
        })
    }

    static race(iteratorObj){
        if([undefined,null].includes(iteratorObj)||typeof iteratorObj[Symbol.iterator] !== 'function'){
            switch(iteratorObj){
                case undefined:throw new TypeError("undefined is not iterable (cannot read property Symbol(Symbol.iterator))")
                case null: throw new TypeError("object null is not iterable (cannot read property Symbol(Symbol.iterator))")
                default:throw new TypeError(`${typeof iteratorObj} is not iterable (cannot read property Symbol(Symbol.iterator))`)
            }
        }
        return new MyPromise((resolve,reject)=>{
            for(let i = 0;i<iteratorObj.length;i++){
                iteratorObj[i].then((res)=>{ 
                    resolve(res)},(reson)=>reject(reson))
            }
        })
    }

    static any(iteratorObj){
        if([undefined,null].includes(iteratorObj)||typeof iteratorObj[Symbol.iterator] !== 'function'){
            switch(iteratorObj){
                case undefined:throw new TypeError("undefined is not iterable (cannot read property Symbol(Symbol.iterator))")
                case null: throw new TypeError("object null is not iterable (cannot read property Symbol(Symbol.iterator))")
                default:throw new TypeError(`${typeof iteratorObj} is not iterable (cannot read property Symbol(Symbol.iterator))`)
            }
        }
        return new MyPromise((resolve,reject)=>{
            let val = []
            for(let i = 0;i<iteratorObj.length;i++){
                iteratorObj[i].then((res)=>{
                    resolve(res);
                    
                },(reson)=>{
                    val[i] = reson
                })
            }
            if(!iteratorObj.length||!val.length) reject(new Error("All promises were rejected"));
        })
    }

    static allSettled(iteratorObj){
        if([undefined,null].includes(iteratorObj)||typeof iteratorObj[Symbol.iterator] !== 'function'){
            switch(iteratorObj){
                case undefined:throw new TypeError("undefined is not iterable (cannot read property Symbol(Symbol.iterator))")
                case null: throw new TypeError("object null is not iterable (cannot read property Symbol(Symbol.iterator))")
                default:throw new TypeError(`${typeof iteratorObj} is not iterable (cannot read property Symbol(Symbol.iterator))`)
            }
        }
        return new MyPromise((resolve,reject)=>{
        try{
            const res = []
            for(let i = 0;i<iteratorObj.length;i++){
                iteratorObj[i].then(result=>{
                    res[i] = result;
                },
                reson=>{
                    res[i] = reson
                })
            }
            if(res.length == iteratorObj.length){
                
                resolve(res)
            }
        }catch(err){
            reject(err)
        }
    })
}

    static withResolvers(){
        let resolve,reject, promise = new MyPromise((_resolve,_reject)=>{
            resolve=_resolve;
            reject=_reject;
        })
        return {promise,resolve,reject}
    }

    static _resolve(val,lastPromise = this){
        if(val instanceof MyPromise){
            const status = val.PromiseState;
            const statusMap = {
                "pendding":()=>{
                    lastPromise.PromiseState = "pendding";
                },
                "fulfilled":()=>{
                    resolve(val.PromiseResult,this)
                },
                "rejected":()=>{
                    MyPromise.reject.call(this,val.PromiseResult,this)
                }
            }
            statusMap[status]();
            return;
        }
        if(lastPromise.PromiseState === PROMISE_STATUS.PROMISE_PENDDING){
            lastPromise.PromiseState = PROMISE_STATUS.PROMISE_FULFILLED;
            lastPromise.PromiseResult = val;
        }
        if(lastPromise.PromiseState === PROMISE_STATUS.PROMISE_FULFILLED){
            queueMicrotask(()=>{
                Array.prototype.forEach.call(this.fulfilledList,fn => fn())
            })
        }
    }

    static _reject(reason, lastPromise = this){
        if(lastPromise.PromiseState === PROMISE_STATUS.PROMISE_PENDDING){
            lastPromise.PromiseState = PROMISE_STATUS.PROMISE_REJECTED;
            lastPromise.PromiseResult = reason;
            lastPromise.reason = reason;
        }
        if(lastPromise.PromiseState === PROMISE_STATUS.PROMISE_REJECTED){
            queueMicrotask(()=>{
            if(this.rejectedList.length) Array.prototype.forEach.call(this.rejectedList,fn => fn());
            else if(!this.rejectedList.length){
                this.PromiseResult='rejected';
            } 
        })
        }
    }

    static resolve(val){
        return new MyPromise((resolve,reject)=> resolve(val))
    }
    static reject(reason){
        return new MyPromise((resolve,reject)=> reject(reason))
    }
}

const p = new MyPromise((resolve,reject)=>{
    resolve("123")
})


p.then(res => {
    console.log(res);
    return 333
}).then(res=>{
    console.log("???:",res)
    throw new Error("test")
}).catch(err => {
    console.log(err)
}).finally(()=>{
    console.log("finally")
})

p.then(res=>{
    console.log(res)
})

const allPromise = MyPromise.all([new MyPromise((res,rej)=>{rej(11111)})]);
console.log(allPromise)
allPromise.then((res)=>{console.log(res)},(err)=>{console.log("1233333:",err)})

const racePromise = MyPromise.race([new MyPromise((res,rej)=>{setTimeout(()=>{res("race")},1000)}),new MyPromise((res,rej)=>{
    setTimeout(()=>{
        rej("race:reject")
    },2000)
})])

racePromise.then(res=>{console.log(res)},err=>{console.log(err)})

const anyPromise = MyPromise.any([new MyPromise((resolve,reject)=>{
    reject("error")
}),new MyPromise((resolve)=>{
    setTimeout(()=>{
        resolve("success")
    },5000)
})])

anyPromise.then(res=>{
    console.log(res)
})

const allSettledPromise = MyPromise.allSettled([new MyPromise((res)=>res("allsettle:success")),new MyPromise((res,rej)=>rej("allsettle:failed"))])

allSettledPromise.then((res=>{
    console.log(res)
}))

export default MyPromise;