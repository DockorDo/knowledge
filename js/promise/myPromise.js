
const PROMISE_STATUS={
    PROMISE_PENDDING:"pendding",
    PROMISE_FULFILLED:"fulfilled",
    PROMISE_REJECTED:"rejected"
}

let errorMsg;
class myPromise{
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
        try{
            executor(myPromise.resolve.bind(this),myPromise.reject.bind(this))
        } catch(error) {
            throw error;
        }
    }

    then(onFulfilled,onRejected){}

    catch(){}

    finally(){}

    static all(){}

    static race(){}

    static any(){}

    static allSettled(){}

    static withResolvers(){}

    static resolve(val){
        if(this.PromiseState === PROMISE_STATUS.PROMISE_PENDDING){
            this.PromiseState = PROMISE_STATUS.PROMISE_FULFILLED;
        }

    }

    static reject(){
        if(this.PromiseState === PROMISE_STATUS.PROMISE_PENDDING){
            this.PromiseState = PROMISE_STATUS.PROMISE_REJECTED;
        }
    }

}

export default myPromise;