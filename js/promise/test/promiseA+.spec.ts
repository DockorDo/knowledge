import MyPromise from "../myPromise";
import { describe, test, expect, vi } from "vitest"


describe('Terminology 术语规范', () => {
    const promise = new MyPromise();
    test("promise是一个具有then方法的对象",()=>{
        expect(typeof promise.then).toBe("function");
    });
    test("thenable是一个定义了then方法的对象或是一个then函数",()=>{
        const obj = {then:()=>{}}
        expect(typeof obj.then).not.toBe("undefined")
        const fn = function(){};
        fn.then=function(){};
        expect(typeof fn.then).not.toBe("undefined")
    });
    test("value是任何合法的值",async ()=>{
        for(const itm of [undefined,123,"string",{},[]]){
          await expect(()=>(new MyPromise((resolve,reject)=>{
                resolve(itm)
              }))).not.toThrowError()
        }
    })

    test("如果发生异常则使用throw抛出",async()=>{
        const errMsg ="test";
        await expect(()=>(new MyPromise(()=>{
            throw new Error(errMsg)
        }))).toThrowError()
    })

    test("“reason”是一个表示承诺被拒绝的原因的值。", async ()=>{
        const p = new MyPromise((resolve, reject)=>{
            reject("test")
        });
        expect(p.reason).toBe("test");
    })
})

describe("Requirements 要求",()=>{
    test("promise必须处于pendding、fulfilled、rejected之一",()=>{
        const p = new MyPromise(()=>{});
        expect(p.PromiseState).toBe('pendding');
    });
    test("promise的状态可以被转变",()=>{
        const p = new MyPromise((resolve, reject)=>{
            resolve("test")
        });
        expect(p.PromiseState).toBe("fulfilled");
    });
    test("当状态从pendding改变后就不能再改变了",()=>{
        const p1 = new MyPromise((resolve,reject)=>{
            resolve("test");
            reject(123)
        })
        const p2 = new MyPromise((resolve,reject)=>{
            reject("test")
            resolve("test");
        });
        expect(p1.PromiseState).toBe("fulfilled")
        expect(p2.PromiseState).toBe("rejected")
    });
});

describe('then 方法相关', () => { 
    test("promise必须提供then方法来访问其当前或最终的值或原因",()=>{
        const p = new MyPromise(()=>{});
        expect(p.then).not.toBe(undefined);
    });
    test("then方法有两个可选参数",async ()=>{
        const Fn = {
            onFulfilled:(res)=>{},
            onRejected:(err)=>{}
        }
        const onFulfilledSpy = vi.spyOn(Fn,"onFulfilled");
        const onRejectedSpy = vi.spyOn(Fn,"onFulfilled");
        const p1 = new MyPromise((resolve,reject)=>{resolve()});
        await p1.then(Fn.onFulfilled,Fn.onRejected)
        await expect(onFulfilledSpy).toHaveBeenCalled()

        const p2 = new MyPromise((resolve,reject)=>{reject()});
        await p2.then(Fn.onFulfilled,Fn.onRejected);
        await expect(onRejectedSpy).toHaveBeenCalled()
    })

    test("then方法可以针对一个promise多次调用",()=>{
        const p = new MyPromise();

        const thenSpy= vi.spyOn(p,"then")
        p.then();
        expect(thenSpy).toHaveBeenCalledTimes(1)
        p.then();
        expect(thenSpy).toHaveBeenCalledTimes(2)

    })

    test("then 方法返回值也是一个promise",()=>{
        const p = new MyPromise((resolve,reject)=>{
            resolve()
        });
        const thenVal = p.then();
        expect(thenVal.constructor).toBe(MyPromise)

    })
 })

 describe('The Promise Resolution Procedure 承诺解决程序', () => { 
    test("如果promise在确定状态时引用了一个新的promise，它会尝试采用新promise的状态为最终状态",()=>{
        const p = new MyPromise((resolve,reject)=>{
            resolve(new MyPromise((resolve,reject)=>{
                reject("test")
            }))
        });
        expect(p.PromiseState).toBe('rejected')

        const p1 = new MyPromise((resolve,reject)=>{
            resolve(new MyPromise(()=>{}))
        })
        expect(p1.PromiseState).toBe("pendding")

    });
    
  })
