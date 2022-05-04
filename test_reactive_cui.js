//用来引入写好的
import { effectWatch, reactive } from "./reactivityCui/4.reactivity.js";

const user = reactive({
  name: 30,
});

let double;

effectWatch(() => {
  console.log("---reactive---");
  double = user.name;
  console.log(double);
});

user.name = 40;
user.name = 50;

// 打印和之前一样
//---reactive--
//30
//---reactive--
//40
//---reactive--
//50
