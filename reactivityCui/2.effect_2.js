//响应式库
//优化版
let current_Effect;
class Dep {
  constructor(val) {
    this.effects = new Set();

    // 整个value
    this._val = val;
  }

  // 整个value
  get value() {
    this.depend();
    return this._val;
  }
  set value(newVal) {
    this._val = newVal;
    this.notice(); //一定在值更新后再notice
  }

  // 打印依赖
  effectsLog() {
    console.log(effects);
  }

  // 收集依赖
  depend() {
    current_Effect && this.effects.add(current_Effect);
  }

  // 触发依赖
  notice() {
    //触发一下之前收集到的依赖 effects
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

const dep = new Dep(10);

// 收集依赖
function effectWatch(effect) {
  current_Effect = effect;
  effect();
  // dep.depend(); 这里不收集依赖了 改到get里
  current_Effect = null;
}

let b; //20

effectWatch(() => {
  b = dep.value + 10;
  console.log(b);
});

//值发生更变
dep.value = 20;
// dep.notice(); //值更新的时候 会触发set 写到set里



// dep 只能代表单个类型 
// dep -> number string

// reactive可以这样
// 每个对象的key对应一个dep
// object -> key -> dep

// 1. 对象再什么时候改变的
// 2. 具体去下一节