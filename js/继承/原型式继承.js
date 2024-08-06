function object(obj){
    function Fn(){}
    Fn.prototype = obj;
    return new Fn();
  }
  
  object({name:'dodo'})


  let person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
   };
   let anotherPerson = Object.create(person, {
    name: {
     value: "Greg"
    }
   });
   console.log(anotherPerson.name); // "Greg"