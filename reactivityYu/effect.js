//来记录当前执行的副函数
let activeEffect;

//接受一个副函数
export function effect(fn) {
  //用户代码 可能会出错
  //要保证不影响自己的库
  //所以用try catch
  const effectFn = () => {
    try {
      //记录当前执行的副函数
      activeEffect = effectFn;
      return fn();
    } finally {
    }
  };

  effectFn();
  return effectFn;
}

// 这两个函数放到reactive中

//存储副函数 并且建立副函数和依赖的对应关系
const targetMap = new Map();
// 一个副函数可能依赖多个响应式 一个响应式可能依赖多个属性
// 同一个属性有可能被多个副函数依赖 因此targetMap的结构设计如下
// ```
// {
//   [target]: { //key是reactiveObject ,value是一个Map

//     [key]: []  //key是reactiveObject的键值,value是一个Set

//   }

// }
// ```

//收集
export function track(target, key) {
  if (!activeEffect) {
    return;
  }

  let depsMap = targetMap.get(target); //target为给reactive传的对象

  //如果没有就创建一个已 (target为给reactive传的对象) 为key的map集合
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key); //已 reactive对象 为key的map集合 下再已 key 为 key 创建集合

  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  //存副函数
  deps.add(activeEffect);
}

//触发 相当于 收集的逆运算
export function trigger(target, key) {

  const depsMap = targetMap.get(target);
  //找不到的话说明没有被代理 没有副函数依赖
  if (!depsMap) {
    return;
  }

  const deps = depsMap.get(key);
  if (!deps) {
    return;
  }

  deps.forEach(effectFn => {
    effectFn();
  });
}

//effect要和reactive建立联系
//执行副函数

//执行中发现依赖

//发现后再get中收集一下 收集副函数和依赖
//收集依赖track

//set中触发更新
//触发trigger
