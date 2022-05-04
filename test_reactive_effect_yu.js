import { effect } from "./reactivityYu/effect.js";
import { reactive } from "./reactivityYu/reactive.js";

const obj = reactive({
  num: 1,
});
console.log(obj);

// let b;

effect(() => {
  // b = obj.num + 2;
  // console.log("effect", b);
  console.log("effect", obj.num);
});

obj.num = 4;
obj.num = 5;
