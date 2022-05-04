//哔哩哔哩 鱼斯林

//reactive不能包含基本值
export function _reactive(target) {
  //接受一个数组或对象

  //判断是否为object 这里注意 null的typeof也是object
  if (typeof target != Object || target == null) {
    //如果是基本类型就直接返回
    return target;
  }

  return new Proxy(target, {
    get(target, key) {
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      Reflect.set(target, key, value);
    },
  });
}




// 加了effect的
import { track, trigger } from "./effect.js";

export function reactive(target) {
  //接受一个数组或对象

  //判断是否为object 这里注意 null的typeof也是object
  if (typeof target != "object" || typeof target == null) {
    //如果是基本类型就直接返回
    return target;
  }

  return new Proxy(target, {
    get(target, key) {
      //收集
      track(target,key);

      return Reflect.get(target, key);
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value);

      // 触发
      trigger(target, key);
      
      return result;
    },
  });
}
