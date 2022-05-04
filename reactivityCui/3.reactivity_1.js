//先补一下map
// Map
// Map是一组键值对的结构，具有极快的查找速度。

// 举个例子，假设要根据同学的名字查找对应的成绩，如果用Array实现，需要两个Array：

// 1 var names = ['Michael', 'Bob', 'Tracy'];
// 2 var scores = [95, 75, 85];
// 给定一个名字，要查找对应的成绩，就先要在names中找到对应的位置，再从scores取出对应的成绩，Array越长，耗时越长。

// 如果用Map实现，只需要一个“名字”-“成绩”的对照表，直接根据名字查找成绩，无论这个表有多大，查找速度都不会变慢。用JavaScript写一个Map如下：

// 1 var m = new Map([['Michael', 95], ['Bob', 75], ['Tracy', 85]]);
// 2 m.get('Michael'); // 95


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
function effectWatch(effect) {
  current_Effect = effect;
  effect();
  // dep.depend(); 这里不收集依赖了 改到get里
  current_Effect = null;
}


let dep = new Dep(10)
let b;
effectWatch(()=>{
  b = dep.value + 5
  console.log(b);
})

//值发生改变
dep.value = 20
dep.value = 30
//输出
//15
//25
//35



// dep 只能代表单个类型
// dep -> number string

// reactive可以这样
// 每个对象的key对应一个dep
// object -> key -> dep
// 但是
// 1. 对象再什么时候改变的

//响应式库
//优化版


// dep 只能代表单个类型
// dep -> number string

// reactive可以这样
// 每个对象的key对应一个dep
// object -> key -> dep

// 1. 对象再什么时候改变的
// 2. 具体去下一节

//Proxy 会返回一个被处理的 数据

// 创建一个mao存
const targetMap = new Map();

function getDep(target, key) {

  //这里第一次没值
  let depsMap = targetMap.get(target);
  //没值的话 初始化一下
  if(!depsMap){
    depsMap = new Map()
    targetMap.set(target,depsMap)
  }


  let dep = depsMap.get(key);
  //这里也是没值的话就存起来
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }

  return dep;
}

function reactive(raw) {
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

const user = reactive({
  name: 30,
});

let double;
//当用户
effectWatch(() => {
  console.log("---reactive---");
  double = user.name;
  console.log(double);
})



user.name = 40;
user.name = 50
//这里每次你改name的值 上面被effectWatch包裹的依赖就会被执行一次
//输出
//---reactive--
//30
//---reactive--
//40
//---reactive--
//50