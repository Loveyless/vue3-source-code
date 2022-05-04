//哔哩哔哩 啊崔cxr

//响应式库
let current_Effect;
class Dep {
  constructor(val) {
    this.effects = new Set();

    // 整个value
    this._val = val;
  }

  // 整个value
  get value() {
    return this._val;
  }
  set value(newVal) {
    this._val = newVal;
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
  dep.depend(); //收集依赖
  current_Effect = null;
}

let b; //20

effectWatch(() => {
  b = dep.value + 10;
  console.log(b);
});

//值发生更变
dep.value = 20;
dep.notice(); //触发依赖


//我觉得就是实现了一个简单的收集依赖更新依赖
//当值改变后 在调用notice来把以前收集的依赖执行一下
//再effect_2会优化一下