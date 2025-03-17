// /**

//       Basic Type
//  */

// // Type String
// let car = "Toyota";
// let bike: string
// bike = "Winner"

// // Type Number
// let num: number = 10;

// // Type Boolean
// let boolean: boolean = false;

// // Type Body
// // let body: undefined = undefined;

// // Type Footer
// let footer: null;

// // Type Person
// // let person: any
// // person = 10;
// // person = "Phúc";
// // person = false;


// /**
//       Object 
//  *  */

// let house: {
//       address: string,
//       color?: string
// } = {
//       address: ''
// };

// house.address

// /**
//       Array
//  */

// // any[]
// let products: any[] = [];
// products.push(1);
// products.push("Việt NAM");

// // string []
// let names: string[] = [];
// names.push('Hello');

// // number[]
// let numbers: number[] = [];
// numbers.push(123);

// // object array

// let people: {}[] = []
// people.push({
//       name: 'Nguyễn Phúc',
//       addess: "Biên Hòa"
// })

// //FUnction

// const sum = (num1: number, num2: number) => {
//       return num1 + num2
// }

// const sub: (num1: number, num2: number) => number = (num1: number, num2: number) => {
//       return num1 - num2;
// }

// // Union

// let price: string | number
// price = 10
// price = '20'

// let body: { name: string } | { firstName: string } = {
//       name: '',
//       firstName: ''
// }

// // Enum

// enum Sizes {
//       S = "S",
//       M = "M",
//       L = "L",
//       XL = "XL"
// }

// let size = Sizes.S

// //Interface

// // interface State {
// //       name: string,
// //       isLoading: boolean
// // }

// // let state: State = {
// //       name: 'Dang',
// //       isLoading: false,
// // }

// // Type !! Không thể Merge 

// type State = {
//       name: string,
//       isLoading: false
// }

// let state: State = {
//       name: 'Dang',
//       isLoading: false,
// }

// const handleClick = <Type>(value: Type) => value;

// handleClick<string>('100')

// class Person2 {
//       public name: string;
//       readonly age: number = 40;
//       constructor(name: string, age: number) {
//             this.name = name;
//             this.age = age;
//       }
// }

// // class Person2 {
// //       constructor(public name: string, public age: number) {
// //             this.name = name;
// //             this.age = age;
// //       }
// // }

// let person = new Person2('Phúc', 20);


//GENERIC

let Person: {
      name: string,
      number: number
}


type User = {
      name: string
      age: number
}



// With Arrow Function
const indentity = <Type>(value: Type) => value;
const result = <User>indentity({
      name: "Gabi",
      age: 18
})

// Witn Normal Function
function indentity2<Type>(value: Type) {
      return value;
}
const result2 = <User>indentity2({
      name: "Nguyễn Phúc",
      age: 19
})


const getValue = <Obj, Key extends keyof Obj>(obj: Obj, key: Key) => {
      console.log(obj);
      console.log(key);
}


const result3 = getValue({
      name: "Gabi",
}, "name")


//Default Generic

interface Box<Type> {
      value: Type
}

const box: Box<string> = {
      value: 'Nguyễn Phúc'
}

interface Box2<Type = number> {
      value: Type
}

const box2: Box2 = {
      value: 1
}