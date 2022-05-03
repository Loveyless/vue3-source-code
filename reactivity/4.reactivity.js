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

// 收集依赖
export function effectWatch(effect) {
  current_Effect = effect;
  effect();
  // dep.depend(); 这里不收集依赖了 改到get里
  current_Effect = null;
}


// 创建一个mao存
const targetMap = new Map();

function getDep(target, key) {
  //这里第一次没值
  let depsMap = targetMap.get(target);
  //没值的话 初始化一下
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }


  let dep = depsMap.get(key);
  //这里也是没值的话就存起来
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }

  return dep;
}

export function reactive(raw) {
  ////Proxy 会返回一个被处理的数据 所以这里return
  return new Proxy(raw, {
    get(target, key) {
      //一个key对应一个dep
      //dep存在哪里呢？
      const dep = getDep(target, key);
      //收集依赖
      dep.depend();

      return target[key]; // return Reflect.get(target,key) //一个意思
    },

    set(target, key, value) {
      //value为修改的值
      //触发依赖
      const dep = getDep(target, key);
      //改值 改完再更新
      const result = Reflect.set(target, key, value);
      //更新
      dep.notice();

      return result;
    },
  });
}


//导出两个 effectWatch 和 reactive
//就可以用了