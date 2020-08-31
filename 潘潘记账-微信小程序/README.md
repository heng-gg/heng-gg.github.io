```txt
项目结构
cloundfunctions: 云函数
miniprogram: 小程序开发目录
    components: 公共组件
    images: 图片
    pages: 小程序页面目录
    style: 公共样式
    app.js: 小程序注册入口
    app.json: 小程序全局配置
    app.wxss: 全局样式
    sitemap: 记录页面允许微信索引， 微信索引：在微信搜索栏可以所有当前页面
project.config.json: 工程文件，记录偏好
README.md：项目说明文件
```

```txt
每一个页面必须含有wxml,js
wxss,json可选

wxml: 定义页面结构, 类似html
js: 注册页面，定义行为
wxss: 页面样式，美化页面
json: 页面配置
```

```txt
rpx: 类似rem
```

```txt
2020-08-01 <= x <= 2020-08-27

查询条件

今年(本年)2020
本月 08
本日 28

4, 6, 9, 11月 30天

按年查询
    
    先判断是否为本年2020，如果是， 2020-01-01 <= x <= 2020-08-28
    如果不是本年 2019，2019-01-01 <= x <= 2019-12-31

按月查询
    先判断是否为本年2020，如果是，再判断是否为本月，如果是，2020-08-01 <= x <= 2020-08-28
    如果不是本月, 判断是否为2月份, 如果是，再判断本年是否为闰年，如果是，2020-02-01 <= x <= 2020-02-29, 如果不是闰年, 2020-02-01 <= x <= 2020-02-28
    如果不是2月份，是否为30天月份, 如果是 2020-04-01 <= x <= 2020-04-30，如果不是, 2020-05-01 <= x <= 2020-05-31

    如果不是本年
        如果不是本月, 判断是否为2月份, 如果是，再判断本年是否为闰年，如果是，2020-02-01 <= x <= 2020-02-29, 如果不是闰年, 2020-02-01 <= x <= 2020-02-28
    如果不是2月份，是否为30天月份, 如果是 2020-04-01 <= x <= 2020-04-30，如果不是, 2020-05-01 <= x <= 2020-05-31


按日查询
    x = 2020-08-28

```

```txt
ES5
类式继承：子构造函数原型继承父构造函数的实例

function Parent(name) {
    this.name = name;
}

Parent.prototype.getName = function () {}


function Child(age) {
    this.age = age;
}

Child.prototype = new Parent();

let a = new Child()
let b = new Child()

构造函数式继承: 子构造函数内部调用父构造函数, 没有继承父构造函数的原型
function Parent(name) {
    this.name = name;
}

Parent.prototype.getName = function () {}


function Child(age) {
    this.age = age;

    Parent.call(this, [1, 2])
}

组合式继承：类式继承 + 构造函数式继承
function Parent(name) {
    this.name = name;
}

Parent.prototype.getName = function () {}


function Child(age) {
    this.age = age;
    Parent.call(this, [1, 2])
}

Child.prototype = new Parent();

let a = new Child()
let b = new Child()

原型继承

寄生式继承

寄生组合继承

//ES6
class SuperClass {

}

class SubClass extends SuperClass{

}

//什么情况下使用继承

//人类
class Human {
    constructor(name, eye, face) {
        this.name = name;
        this.eye = eye;
        this.face = face;
    }

    walking() {
        
    }
}

//会跳舞的人，有角
class Dancing extends Human {

    //重写Human类的constructor
    constructor(name, eye, face, jiao) {
        super(name, eye, face);
        this.jiao = jiao;
    }

    dancing() {
        
    }

    //重写Human类的方法
    walking() {
        consolelog('Dancing类重写Human的walking方法');
    }
}

//会唱歌的人
class Sing extends Human {
    sind() {
        
    }
}


let xiaohong = new Dancing('小红', '黑色大眼睛', '天使般面孔');

xiaohong.waiking();

let xiaohonghong = new Dancing('小红红', '黑色大眼睛', '天使般面孔');
```
